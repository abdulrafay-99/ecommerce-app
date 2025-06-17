export const getCartProducts = async (req,res) => {
    try {
        const products= await Product.find({_id:{$in:req.user.cartItems}});
        //add quantity for each product
        const cartItems=products.map((product)=>{
            const item=req.user.cartItems.find(cardItem=>cartItem.id===product.id);
            return {...product.toJSON(),quantity:item.quantity}
        })
        res.json(cartItems)
    } catch (error) {
        console.log("Error in getCartProducts");
        res.status(500).json({message:"Sever error",error:error.message})
    }
}
export const addTocart = async (req,res)=>{
    try {
        const {productId}=req.body;
        const user=req.user;
        
        const existingItem= user.cartItems.find((item)=>item.id ===productId);
        if(existingItem){
            existingItem.quantity+=1
        }else{
            user.cartItems.push(productId);
        }
        await user.save();
        res.status(201).json(user.cartItems)        
    } catch (error) {
        console.log("error in addTocart")
        res.status(500).json({error:error.message})
    }
}

export const removeAllFromCart = async (req,res)=>{
    try {
    const {productId}=req.body;
    
    const user= req.user;

    user.cartItems.filter((item)=>{item.id!==productId})
    await user.save();
    res.json(user.cartItems)
    
        
    } catch (error) {
      console.log('Error in removeAllFromCart')  
      res.status(500).json({error:error.message})
    }
}

export const updateQuantity = async (req,res) => {
    try {
        const {id:productId}= req.params;
        const {quantity}=req.body;
        const user=req.user;

        const existingItem= user.cartItems.find((item)=>item.id===productId)
        if(existingItem){
            if(quantity===0){
                user.cartItems.filter((item)=>item.id!==productId)
                await user.save();
                return res.json(user.cartItems)
            }else{
                existingItem.quantity=quantity;
                await user.save();
                return res.json(user.cartItems)
            }
        }else{
            res.status(401).json({message:"Product Not found"})
        }
        
    } catch (error) {
        console.log('Error in updateQuantity')
        res.status(500).json({error:error.message})
    }
    
}