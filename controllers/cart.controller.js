import Product from "../models/Product.model.js"
import Cart from "../models/Cart.model.js"

export const addItem =async (req,res) => {
const { productId, quantity } = req.body;
const userId = req.user._id;
let cart = await Cart.findOne({ user: userId });
const product = await Product.findById(productId);
if (!product) {
    return res.status(404).json({
        success: false,
        message: "Product not found"
    });
}
if(quantity>product.stock){
    return res.status(400).json({
                success: false,
                message:"Invalid quantity or insufficient stock "
            })
}
if(!cart){
    cart=await Cart.create({
    user: userId
        })
}
const item=cart.items.find(item=>item.product.toString()===productId)
if(item){
    
    item.quantity+=quantity
}else{
cart.items.push({
    product:product._id,
    name:product.name,
    image:product.images[0].url,
    price:product.price,
    quantity:quantity
})}
product.stock-=quantity
await product.save()
await cart.save()
return res .status(200).json({
    "success": true,
    "message": "Item added",
    cart
})
}

export const getCart =async (req,res) => {
    let cart = await Cart.findOne({ user: req.user._id });
    if(!cart){
    cart=await Cart.create({
        user:req.user._id
    })
    }
    return res .status(200).json({
    "success": true,
    "itemCount": cart.itemCount,
    "subtotal": cart.subtotal,
    "discountAmount": cart.discountAmount,
    "total": cart.total,
    "coupon": cart.coupon?.code || null,
    "items": cart.items
})
}

export const updateCart =async (req,res) => {

const { productId, quantity } = req.body;
const cart=await Cart.findOne({
    user:req.user._id
})
if(!cart){
    return res.status(404).json({
    success: false,
    message:"Cart  not found"
    })
}
const item=cart.items.find(item=>item.product.toString()===productId)
if(!item){
    return res.status(404).json({
        success: false,
        message:" item not found"
    })
}
const product = await Product.findById(productId);
if(!product){
    return res.status(404).json({
        success: false,
        message:"Product not found"
    })
}
const difference=quantity-item.quantity
if(difference>0){
if(difference>product.stock){
    return res.status(400).json({
        success: false,
        message:"Insufficient stock "
    })
}
product.stock-=difference
}
else{
    product.stock+=Math.abs(difference)
}
item.quantity=quantity
await product.save()
await cart.save()
return res.status(200).json({
    "success": true,
    "itemCount": cart.itemCount,
    "subtotal": cart.subtotal,
    "discountAmount": cart.discountAmount,
    "total": cart.total,
    "coupon": cart.coupon?.code || null,
    "items": cart.items
})
}
export const removeItem=async(req,res)=>{
const cart=await Cart.findOne({user:req.user._id})
if(!cart){
    return res.status(404).json({
    success: false,
    message:"Cart not found"
})
}
const { productId } = req.params;
const item=cart.items.find(item=>item.product.toString()===productId)
if(!item){
    return res.status(404).json({
        success: false,
        message:" item not found"
    })
}
const product = await Product.findById(productId);

    if (!product) {
        return res.status(404).json({
            success: false,
            message: "Product not found"
        });
    }

    product.stock += item.quantity;

    cart.items = cart.items.filter(
        item => item.product.toString() !== productId
    );

    await product.save();
await cart.save()
return res.status(200).json({
    "success": true,
    "itemCount": cart.itemCount,
    "subtotal": cart.subtotal,
    "discountAmount": cart.discountAmount,
    "total": cart.total,
    "coupon": cart.coupon?.code || null,
    "items": cart.items
})
}
export const clearCart=async(req,res)=>{
    const cart=await Cart.findOne({
    user:req.user._id
})
if(!cart){
    return res.status(404).json({
    success: false,
    message:"Cart  not found"
    })
}
for (const item of cart.items) {
        const product = await Product.findById(item.product);
        if (product) {
            product.stock += item.quantity;
            await product.save();
        }
    }
cart.items=[]
cart.coupon=undefined
await cart.save()
return res.status(200).json({
    success:true,
    message:"Cart cleared successfully"
})
}