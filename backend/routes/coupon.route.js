import express from "express"
import { protectRoute } from "../middleware/auth.middleware.js";
import { getCoupon,validateCoupon } from "../controllers/coupon.controller.js";


const router=express.Router();

router.get("/getCoupon",protectRoute,getCoupon)
router.post("/validateCoupon",protectRoute,validateCoupon)


export default router