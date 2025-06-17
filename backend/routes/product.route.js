import express from "express"
import { protectRoute,adminRoute } from "../middleware/auth.middleware.js";
import { getAllProducts,getFeaturedProducts,createProduct,deletProduct,getrecommendedProducts,getProductsByCategory,toggleFeaturedProduct } from "../controllers/product.controller.js";


const router=express.Router();

router.get('/',protectRoute,adminRoute,getAllProducts)
router.get('/featured',getFeaturedProducts)
router.get('/category/:category',getProductsByCategory)
router.get('/recommendations',getrecommendedProducts)
router.patch('/:id',protectRoute,adminRoute,toggleFeaturedProduct)

router.post('/',protectRoute,adminRoute,createProduct)
router.delete('/:id',protectRoute,adminRoute,deletProduct)

export default router;