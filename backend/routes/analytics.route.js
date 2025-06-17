import express from "express"
import { adminRoute, protectRoute } from "../middleware/auth.middleware.js";
import { getAnalyticsData, getDailySalesData } from "../controllers/analytics.controller.js";

const router = express.Router();

router.get('/', protectRoute, adminRoute, async (req, res) => {
    try {
        const analyticsData = await getAnalyticsData();
        const endDate = new Date(); // Current date and time
        const startDate = new Date(endDate); // Create a new Date object based on endDate
        startDate.setDate(endDate.getDate() - 7); 
        const dailySalesData = await getDailySalesData(startDate, endDate);
        console.log(dailySalesData)
        res.json({
            analyticsData,
            dailySalesData,
        })
    } catch (error) {
        console.log("Error in analytics route", error.message);
        res.status(500).json({ message: "Server error", error: error.message });
    }
})

export default router;