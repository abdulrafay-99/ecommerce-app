import jwt from "jsonwebtoken"
import User from "../models/user.model.js";

export const protectRoute=async(req,res,next)=>{
    try {
        const accessToken=req.cookies.accessToken;
        if(!accessToken){
            throw Error('no access token provided')
        }
        const decoded=jwt.verify(accessToken,process.env.ACCESS_TOKEN_SECRET);

        const user=await User.findById(decoded.userId).select('-password')
        if(!user){
            throw Error("User not found-Invalid access token")
        }
        req.user=user;
        next()
        
    } catch (error) {
        console.log("Error in protect Route")
        res.status(401).json({error:error.message})
    }
}

export const adminRoute=async (req,res,next) => {
    const isAdmin=req.user.role==='admin'
    if(isAdmin){
        next()
    }else{
        return res.status(403).json({message:"not admin"})
    }
}