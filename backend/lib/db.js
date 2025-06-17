import mongoose from "mongoose";

export const connectDB= async () => {
    try {
        const conn=await mongoose.connect(process.env.MONGODB_URI)
        console.log('connected to db')
    } catch (error) {
        console.log('Error in connecting to db',error);
        process.exit(1)
    }
}