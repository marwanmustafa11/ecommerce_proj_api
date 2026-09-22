import Wishlist from "../models/Wishlist.model.js";
import Product from "../models/Product.model.js";
 
export const getWishlist = async (req, res) => {
    try {
        const wishlist = await Wishlist.findOne({
            user: req.user._id,
        });
 
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

export const addProductToWishlist = async (req, res) => {
    try {
        const { productId } = req.params;
 
        const product = await Product.findById(productId);

        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found",
            });
        }
 
        let wishlist = await Wishlist.findOne({
            user: req.user._id,
        });
 
        if (!wishlist) {
            await Wishlist.create({
                user: req.user._id,
                products: [productId],
            });
 
            wishlist = await Wishlist.findOne({
                user: req.user._id,
            });

            return res.status(201).json({
                success: true,
                message: "Product added to wishlist",
                wishlist,
            });
        }
 
        const alreadyExists = wishlist.products.some(
            (product) => product._id.toString() === productId
        );

        if (alreadyExists) {
            return res.status(409).json({
                success: false,
                message: "Product already exists in wishlist",
            });
        }
 
        wishlist.products.push(productId);

        await wishlist.save();
 
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
 
export const removeProductFromWishlist = async (req, res) => {
    try {
        const { productId } = req.params;
 
        const product = await Product.findById(productId);

        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found",
            });
        }
 
        const wishlist = await Wishlist.findOne({
            user: req.user._id,
        });

        if (!wishlist) {
            return res.status(404).json({
                success: false,
                message: "Wishlist not found",
            });
        }
 
        const productExists = wishlist.products.some(
            (product) => product._id.toString() === productId
        );

        if (!productExists) {
            return res.status(404).json({
                success: false,
                message: "Product is not in wishlist",
            });
        }
 
        wishlist.products = wishlist.products.filter(
            (product) => product._id.toString() !== productId
        );

        await wishlist.save();
 
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

export const clearWishlist = async (req, res) => {
    try {
 
        const wishlist = await Wishlist.findOne({
            user: req.user._id,
        });

        if (!wishlist) {
            return res.status(404).json({
                success: false,
                message: "Wishlist not found",
            });
        }
 
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