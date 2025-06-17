import User from "../models/user.model.js"
import jwt from "jsonwebtoken"
import redis from "../lib/redis.js"

const generateTokens = (userId)=>{
    const accessToken=jwt.sign({userId},process.env.ACCESS_TOKEN_SECRET,{expiresIn:'15m'});

    const refreshToken=jwt.sign({userId},process.env.REFRESH_TOKEN_SECRET,{expiresIn:'7d'})
    return {accessToken,refreshToken}
}

const storeRefreshToken = async(userId,refreshToken)=>{
await redis.set(`refresh_token:${userId}`,refreshToken,"EX",7*24*60*60)
}

const setCookies = async (res,refreshToken,accessToken)=>{
    res.cookie("accessToken",accessToken,{
        httpOnly:true,
        secure:process.env.NODE_ENV=="production",
        sameSite:'strict',
        maxAge:15*60*1000
    })

     res.cookie("refreshToken",refreshToken,{
        httpOnly:true,
        secure:process.env.NODE_ENV=="production",
        sameSite:'strict',
        maxAge:7*24*60*60*1000
    })
}

export const signup = async (req, res) => { 
    const {email,password,name}=req.body;
    
    try {
        const userExists=await User.findOne({email});
    if(userExists){
        res.status(400).json({message:"User already exists"})
    }
    const user= await User.create({name,email,password})
    // authenticate new User
    const {accessToken,refreshToken}=generateTokens(user._id)
    await storeRefreshToken(user._id,refreshToken)
    setCookies(res,refreshToken,accessToken);
    res.status(201).json({message:"User created successfully",user:{
        _id:user._id,
        name:user.name,
        email:user.email,
        role:user.role,
    }})

    } catch (error) {
        res.status(500).json({message:error.message})
    }
}
export const login =async (req, res) => { 
    const {email,password}=req.body;
    try {
        const user= await User.findOne({email});
        if(user && (await user.comparePassword(password))){
           const {accessToken,refreshToken}= generateTokens(user._id)
           await storeRefreshToken(user._id,refreshToken);
           setCookies(res,refreshToken,accessToken)
           res.status(201).json({message:"Logged In successfully",user:{
        _id:user._id,
        name:user.name,
        email:user.email,
        role:user.role,
    }})
        }else{throw Error('Invalid Credentials')}
        
    } catch (error) {
        console.log("Error in loging in")
        res.status(400).json({error:error.message})
    }




}
export const logout = async (req, res) => { 
    try {
        const refreshToken= req.cookies.refreshToken;
        if(refreshToken){
            const decoded=jwt.verify(refreshToken,process.env.REFRESH_TOKEN_SECRET)
            console.log(decoded)
            await redis.del(`refresh_token:${decoded.userId}`)
        }
        res.clearCookie('accessToken');
        res.clearCookie('refreshToken');
        res.status(201).json({message:"Logged Out Successfully"})
    } catch (error) {
        console.log("error in logout")
        res.status(500).json({error})
    }
 }

export const refreshToken=async (req,res) => {
    try {
        const refreshToken=req.cookies.refreshToken;
        if(!refreshToken){
			return res.status(500).json({ message: "No refresh token provided" });
        }
        const decoded=jwt.verify(refreshToken,process.env.REFRESH_TOKEN_SECRET);
        const storedToken=await redis.get(`refresh_token:${decoded.userId}`)
        console.log(storedToken)
        if(storedToken!==refreshToken){
			return res.status(500).json({ message: "Invalid refresh token" });
        }
        const accessToken=jwt.sign({userId:decoded.userId},process.env.ACCESS_TOKEN_SECRET,{expiresIn:'15m'})
        res.cookie('accessToken',accessToken,{
            httpOnly:true,
            secure:process.env.NODE_ENV=='production',
            sameSite:'strict',
            maxAge:15*60*1000
        })
        res.status(200).json({message:'token refreshed successfully'})
    } catch (error) {
        console.log('error in refresh token')
        res.status(500).json({error:error.message})
    }
}

export const getProfile = async (req,res) => {
    try {
        res.json(req.user)
    } catch (error) {
        console.log("error in getting profile")
        res.status(500).json({message:"Internal server error",error:error.message})
    }
}