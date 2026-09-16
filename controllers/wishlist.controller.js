import Wishlist from "../models/Wishlist.model.js";
import Product from "../models/Product.model.js";

// Get Wishlist
export const getWishlist = async (req, res) => {
    try {
        // بنجيب Wishlist الخاصة بالمستخدم اللي عامل Login
        const wishlist = await Wishlist.findOne({
            user: req.user._id,
        });

        // لو المستخدم لسه معندوش Wishlist
        if (!wishlist) {
            return res.status(200).json({
                success: true,
                message: "Wishlist is empty",
                wishlist: {
                    user: req.user._id,
                    products: [],
                },
            });
        }

        return res.status(200).json({
            success: true,
            wishlist,
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};


// Add Product To Wishlist
export const addProductToWishlist = async (req, res) => {
    try {
        const { productId } = req.params;

        // نتأكد إن المنتج موجود في الداتابيز
        const product = await Product.findById(productId);

        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found",
            });
        }

        // نجيب Wishlist الخاصة بالمستخدم
        let wishlist = await Wishlist.findOne({
            user: req.user._id,
        });

        // لو مفيش Wishlist للمستخدم نعمل واحدة
        if (!wishlist) {
            await Wishlist.create({
                user: req.user._id,
                products: [productId],
            });

            // نجيبها تاني علشان الـ populate يشتغل
            wishlist = await Wishlist.findOne({
                user: req.user._id,
            });

            return res.status(201).json({
                success: true,
                message: "Product added to wishlist",
                wishlist,
            });
        }

        // نتأكد إن المنتج مش موجود بالفعل
        const alreadyExists = wishlist.products.some(
            (product) => product._id.toString() === productId
        );

        if (alreadyExists) {
            return res.status(409).json({
                success: false,
                message: "Product already exists in wishlist",
            });
        }

        // إضافة المنتج للـ Wishlist
        wishlist.products.push(productId);

        await wishlist.save();

        // نجيب الـ Wishlist تاني علشان الـ Product يظهر populated
        wishlist = await Wishlist.findOne({
            user: req.user._id,
        });

        return res.status(200).json({
            success: true,
            message: "Product added to wishlist",
            wishlist,
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};


// Remove Product From Wishlist
export const removeProductFromWishlist = async (req, res) => {
    try {
        const { productId } = req.params;

        // نتأكد إن المنتج موجود في الداتابيز
        const product = await Product.findById(productId);

        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found",
            });
        }

        // نجيب Wishlist الخاصة بالمستخدم
        const wishlist = await Wishlist.findOne({
            user: req.user._id,
        });

        if (!wishlist) {
            return res.status(404).json({
                success: false,
                message: "Wishlist not found",
            });
        }

        // نتأكد إن المنتج موجود داخل الـ Wishlist
        const productExists = wishlist.products.some(
            (product) => product._id.toString() === productId
        );

        if (!productExists) {
            return res.status(404).json({
                success: false,
                message: "Product is not in wishlist",
            });
        }

        // نشيل المنتج من الـ Wishlist
        wishlist.products = wishlist.products.filter(
            (product) => product._id.toString() !== productId
        );

        await wishlist.save();

        // نجيب البيانات مرة تانية مع populate
        const updatedWishlist = await Wishlist.findOne({
            user: req.user._id,
        });

        return res.status(200).json({
            success: true,
            message: "Product removed from wishlist",
            wishlist: updatedWishlist,
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};


// Clear Wishlist
export const clearWishlist = async (req, res) => {
    try {
        // نجيب Wishlist الخاصة بالمستخدم
        const wishlist = await Wishlist.findOne({
            user: req.user._id,
        });

        if (!wishlist) {
            return res.status(404).json({
                success: false,
                message: "Wishlist not found",
            });
        }

        // نمسح كل المنتجات
        wishlist.products = [];

        await wishlist.save();

        return res.status(200).json({
            success: true,
            message: "Wishlist cleared successfully",
            wishlist,
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};