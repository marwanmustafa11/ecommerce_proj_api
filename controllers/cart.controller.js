import Product from "../models/Product.model.js"
import Cart from "../models/Cart.model.js"

export const addItem = async (req, res) => {
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
    if (quantity > product.stock) {
        return res.status(400).json({
            success: false,
            message: "Invalid quantity or insufficient stock "
        })
    }
    if (!cart) {
        cart = await Cart.create({
            user: userId
        })
    }
    const item = cart.items.find(item => item.product.toString() === productId)
    if (item) {

        item.quantity += quantity
    } else {
        cart.items.push({
            product: product._id,
            name: product.name,
            image: product.images[0].url,
            price: product.price,
            quantity: quantity
        })
    }
    product.stock -= quantity
    await product.save()
    await cart.save()
    return res.status(200).json({
        "success": true,
        "message": "Item added",
        cart
    })
}

export const getCart = async (req, res) => {
    let cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
        cart = await Cart.create({
            user: req.user._id
        })
    }
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

export const updateCart = async (req, res) => {

    const { productId, quantity } = req.body;
    const cart = await Cart.findOne({
        user: req.user._id
    })
    if (!cart) {
        return res.status(404).json({
            success: false,
            message: "Cart  not found"
        })
    }
    const item = cart.items.find(item => item.product.toString() === productId)
    if (!item) {
        return res.status(404).json({
            success: false,
            message: " item not found"
        })
    }
    const product = await Product.findById(productId);
    if (!product) {
        return res.status(404).json({
            success: false,
            message: "Product not found"
        })
    }
    const difference = quantity - item.quantity
    if (difference > 0) {
        if (difference > product.stock) {
            return res.status(400).json({
                success: false,
                message: "Insufficient stock "
            })
        }
        product.stock -= difference
    }
    else {
        product.stock += Math.abs(difference)
    }
    item.quantity = quantity
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
export const removeItem = async (req, res) => {
    const cart = await Cart.findOne({ user: req.user._id })
    if (!cart) {
        return res.status(404).json({
            success: false,
            message: "Cart not found"
        })
    }
    const { productId } = req.params;
    const item = cart.items.find(item => item.product.toString() === productId)
    if (!item) {
        return res.status(404).json({
            success: false,
            message: " item not found"
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
export const clearCart = async (req, res) => {
    const cart = await Cart.findOne({
        user: req.user._id
    })
    if (!cart) {
        return res.status(404).json({
            success: false,
            message: "Cart  not found"
        })
    }
    for (const item of cart.items) {
        const product = await Product.findById(item.product);
        if (product) {
            product.stock += item.quantity;
            await product.save();
        }
    }
    cart.items = []
    cart.coupon = undefined
    await cart.save()
    return res.status(200).json({
        success: true,
        message: "Cart cleared successfully"
    })
}






export const createOrder = async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const userId = req.user._id;

        const cart = await Cart.findOne({ user: userId }).session(session);
        if (!cart || cart.items.length === 0) {
            await session.abortTransaction();
            session.endSession();
            return res.status(400).json({ success: false, message: 'Cart is empty' });
        }

        for (const item of cart.items) {
            const product = await Product.findById(item.product).session(session);
            if (!product || !product.isActive) {
                await session.abortTransaction();
                session.endSession();
                return res.status(400).json({ success: false, message: `Product not found or inactive: ${item.name}` });
            }
        }

        const itemsList = cart.items.map(item => ({
            product: item.product,
            name: item.name,
            image: item.image || '',
            price: item.price,
            quantity: item.quantity,
        }));

        const subtotal = cart.subtotal;
        const discountAmount = cart.discountAmount || 0;
        const shippingFee = req.body.shippingFee || 0;
        const tax = req.body.tax || 0;
        const totalPrice = Math.max(0, subtotal - discountAmount) + shippingFee + tax;

        const orderArray = await Order.create([{
            user: userId,
            items: itemsList,
            shippingAddress: req.body.shippingAddress,
            paymentMethod: req.body.paymentMethod || 'cash',
            subtotal: subtotal,
            shippingFee: shippingFee,
            tax: tax,
            discount: discountAmount,
            totalPrice: totalPrice,
            status: 'pending'
        }], { session });

        const newOrder = orderArray[0];

        await Cart.findOneAndDelete({ user: userId }, { session });

        await session.commitTransaction();
        session.endSession();

        return res.status(201).json({
            success: true,
            message: 'Order created successfully',
            order: newOrder
        });

    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        return res.status(500).json({
            success: false,
            message: 'Server error during order creation',
            error: error.message
        });
    }
};




export const cancelOrder = async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const { orderId } = req.params;
        const userId = req.user._id;

        const order = await Order.findOne({ _id: orderId, user: userId }).session(session);
        if (!order) {
            await session.abortTransaction();
            session.endSession();
            return res.status(404).json({ success: false, message: 'Order not found' });
        }

        if (order.status === 'cancelled') {
            await session.abortTransaction();
            session.endSession();
            return res.status(400).json({ success: false, message: 'Order is already cancelled' });
        }

        order.status = 'cancelled';
        order.cancelledAt = new Date();
        await order.save({ session });

        for (const item of order.items) {
            await Product.findByIdAndUpdate(
                item.product,
                { $inc: { stock: item.quantity } },
                { session }
            );
        }

        await session.commitTransaction();
        session.endSession();

        return res.status(200).json({
            success: true,
            message: 'Order cancelled successfully and stock restored',
            order
        });

    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        return res.status(500).json({
            success: false,
            message: 'Server error during order cancellation',
            error: error.message
        });
    }
};






