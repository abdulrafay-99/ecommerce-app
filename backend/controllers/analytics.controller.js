import Order from "../models/order.model.js";
import Product from "../models/product.model.js";
import User from "../models/user.model.js"

export const getAnalyticsData = async (req,res) => {
    const totalUsers= await User.countDocuments();
    const totalProducts=await Product.countDocuments();

    const salesData = await Order.aggregate([{
        $group:{
            _id:null,
            totalSales:{$sum:1},
            totalRevenue:{$sum:'$totalAmount'}
        }
    }])
    const {totalSales,totalRevenue}= salesData[0] || {totalSales:0,totalRevenue:0}

    return {
        totalUsers,
        totalProducts,
        totalSales,
        totalRevenue,
    }
}

export const getDailySalesData = async (startDate,endDate)=>{
    try {
        const dailySalesData= await Order.aggregate([
            {
                $match:{
                    createdAt:{
                        $gte: startDate,
                        $lte: endDate,
                    },
                },
            },
            {
                $group:{
                    _id:{$dateToString:{format:"%Y-%m-%d",date:"$createdAt"}},
                    sales:{$sum:1},
                    revenue:{$sum: "$totalAmount"}
                }
            },
            {
                $sort:{_id:1}
            },
            {
                $project:{
                    _id:1,sales:1,revenue:1
                }
            }
        ]);
        console.log(dailySalesData)
        const dateArray= getDatesInRange(startDate,endDate);
        
        return dateArray.map((date)=>{
            const dataFound= dailySalesData.find((item)=> item._id===date);
            return {
                date,
                sale:dataFound?.sales || 0,
                revenue:dataFound?.revenue || 0
            }
            
        })
        
    } catch (error) {
     console.log('Error in getDailySalesData',error.message)   
    }

}

const getDatesInRange = (startDate,endDate)=>{
    let dates=[];
    let currentDate= new Date(startDate);

    while(currentDate<=endDate){
        dates.push(currentDate.toISOString().split("T")[0]);
        currentDate.setDate(currentDate.getDate()+1)
    }
    return dates;
}