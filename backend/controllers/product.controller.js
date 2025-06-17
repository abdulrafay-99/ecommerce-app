import Product from "../models/product.model.js"
import redis from "../lib/redis.js"
import cloudinary from "../lib/cloudinary.js"

export const getAllProducts=async(req,res)=>{
    try {
        const products=await Product.find({})
        res.status(201).json({products})
    } catch (error) {
        console.log("error is getAll Products")
        res.status(500).json({error:error.message})
    }
}

export const getFeaturedProducts = async (req,res) => {
    try {
        let featuredProducts=await redis.get('featured_products');
        if(featuredProducts){
            return res.status(200).json({featuredProducts})
        }
        featuredProducts= await Product.find({isFeatured:true}).lean();
        if(!featuredProducts){
            res.status(200).json({message:"No featured Product available"})
        }
        await redis.set('featured_products',JSON.stringify(featuredProducts));
        return res.json(featuredProducts)
    } catch (error) {
        console.log("Error in getting featured products")
        res.status(500).json({message:error.message})
    }
    
}

export const createProduct=async (req,res) => {
    console.log('createProduct called')
    try {
        const {name,description,price,image,category}=req.body;
        console.log(name,description,price,image,category)
        let cloudinaryResponse=null;
        if(image){
            cloudinaryResponse=await cloudinary.uploader.upload(image,{folder:'products'})
        }
        const product=Product.create({
            name,
            description,
            price,
            category,
            image:cloudinaryResponse?.secure_url ?? "",
        })
        return res.status(201).json(product)
    } catch (error) {
        console.log("Error in creating product")
        res.status(500).json({error:error.message})
    }
}

export const deletProduct=async (req,res) => {
    try {
        const product=await Product.findById(req.params.id)
        if(!product){
            res.status(404).json({message:"Product not found"})
        }
        if(product.image){
            const publicId=product.image.split('/').pop().split(".")[0]
            cloudinary.uploader.destroy(`products/${publicId}`)
        }
        await Product.findByIdAndDelete(req.params.id)
        return res.json({message:"product deleted successfully"})
    } catch (error) {
        console.log("Error in deleting image")
        res.status(500).json({error:error.message

        })
    }
}

export const getrecommendedProducts=async (req,res) => {
    try {
        const products = await Product.aggregate([
            {$sample:{size:3}},
            {
                $project:{
                    _id:1,
                    name:1,description:1,
                    image:1,
                    price:1,
                }
            }
        ])
        res.json(products)
    } catch (error) {
        console.log("Error in getting recommended products")
        res.status(500).json({error:error.message})
    }
}
export const getProductsByCategory= async (req,res) => {
    try {
        const {category}=req.params;
        const products=await Product.find({category});
        if(!products){
            return res.status(401).json({message:`No product found in ${category}`})
        }
        return res.status(200).json(products)
    } catch (error) {
        console.log("Error in find products by category",error.message)
        return res.status(500).json({message:error.message})
    }
}
export const toggleFeaturedProduct=async (req,res)=>{
    try {
        const productId=req.params.id;
        const product=await Product.findById(productId);
        if(!product) return res.status(400).json({message:"No product found with this id."})
        product.isFeatured=!product.isFeatured;
        const updatedProduct=await product.save();
        //updateFeaturedProductsCache
        const featuredProducts= await Product.find({isFeatured:true}).lean();
        if(!featuredProducts) return res.status(400).json({message:"No Featured Product found"})
        await redis.set('featured-products',JSON.stringify(featuredProducts))
        return res.status(200).json({updatedProduct})
    } catch (error) {
        console.log("error in toggling featured product")
        res.status(400).json({error:error.message})
    }

}