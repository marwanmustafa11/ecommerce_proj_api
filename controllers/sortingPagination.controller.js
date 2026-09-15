import ProductModel from "../models/Product.model.js";

const getProducts = async (req, res) => {
    try {
        const { page = 1, limit = 10, sort } = req.query;
       

        const skip = (page - 1) * limit;

        let sortOption = {};

        if (sort === "price_asc") {
            sortOption.price = 1;
        } else if (sort === "price_desc") {
            sortOption.price = -1;
        } else if (sort === "rating") {
            sortOption.averageRating = -1;
        } else if (sort === "newest") {
            sortOption.createdAt = -1;
        }

        const totalResults = await ProductModel.countDocuments({
            isActive: true
        });

        const totalPages = Math.ceil(totalResults / limit);

        const products = await ProductModel.find({
            isActive: true
        })
            .sort(sortOption)
            .skip(skip)
            .limit(Number(limit));

        return res.status(200).json({
            success: true,
            totalResults,
            totalPages,
            page: Number(page),
            limit: Number(limit),
            products
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Something went wrong",
            error: error.message
        });
    }
};

export {
    getProducts
};