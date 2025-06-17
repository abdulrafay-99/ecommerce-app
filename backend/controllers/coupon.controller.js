import Coupon from "../models/coupon.model.js"

export const getCoupon = async (req,res) => {
    try {
        const coupon= await Coupon.findOne({userId:req.user._id,isActive:true})
        res.status(200).json(coupon || null)
    } catch (error) {
        console.log("Error in getCoupon")
        res.status(500).json({message:error.message})
    }
}

export const validateCoupon= async (req,res) => {
    try {
    const {code}= req.body;
    const coupon = await Coupon.findOne({code:code,userId:req.user._id,isActive:true})

    if(!coupon){
        return res.status(200).json({message:"No coupon found"})
    }
    //check expiry
    if(coupon.expirationDate < new Date()){
        return res.status(404).json({message:"Coupon has expired"})
    }

    res.status(200).json({
        message:'Coupon is valid',
        code:coupon.code,
        discountPercentage:coupon.discountPercentage,
    })
    
    } catch (error) {
    console.log("Error in validate Coupon")        
    res.status(500).json({message:"Server error",error:error.message})
    }
    
    
    
}