import Product from "../models/Product.model.js";
import slugify from "slugify";
import uploadToCloudinary from "../utils/uploadToCloudinary.js";
import deleteFromCloudinary from "../utils/deleteFromCloudinary.js";


const createProduct = async (req, res) => {
  try {
    const productData = {
      ...req.body,
      createdBy: req.user._id,
    };

    if (req.files && req.files.length > 0) {
      const uploadedImages = await Promise.all(
        req.files.map((file) => uploadToCloudinary(file.buffer)),
      );

      productData.images = uploadedImages;
    }

    const product = await Product.create(productData);

    return res.status(201).json({
      success: true,
      message: "Product created successfully",
      product,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find({
      isActive: true,
    });

    res.status(200).json({
      success: true,
      count: products.length,
      products,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    res.status(200).json({
      success: true,
      product,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const updateProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }
 
    if (req.body.name) {
      req.body.slug = slugify(req.body.name, { lower: true });
    }
 
    if (req.body.deletedImagePublicIds) {
      let idsToDelete = req.body.deletedImagePublicIds;

      if (typeof idsToDelete === "string") {
        try {
          idsToDelete = JSON.parse(idsToDelete);
        } catch (e) {
          idsToDelete = idsToDelete.split(",").map((id) => id.trim());
        }
      }

      if (Array.isArray(idsToDelete) && idsToDelete.length > 0) {
        await Promise.all(
          idsToDelete.map((publicId) => deleteFromCloudinary(publicId))
        );

        product.images = product.images.filter(
          (img) => !idsToDelete.includes(img.public_id.trim())
        );
      }
    }
 
    if (req.files && req.files.length > 0) {
      const validFiles = req.files.filter((file) => file.size > 0);

      if (validFiles.length > 0) {
        const uploadedImages = await Promise.all(
          validFiles.map((file) => uploadToCloudinary(file.buffer))
        );

        product.images.push(...uploadedImages);
      }
    }

    const bodyData = { ...req.body };
    delete bodyData.deletedImagePublicIds;
    delete bodyData.deletedImages;

    Object.assign(product, bodyData);

    await product.save();

    return res.status(200).json({
      success: true,
      message: "Product updated successfully",
      product,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const searchProducts = async (req, res) => {
  try {
    const { search, category, subcategory, brand, tags, minPrice, maxPrice, rating } = req.query;
    if (
      minPrice !== undefined &&
      maxPrice !== undefined &&
      Number(minPrice) > Number(maxPrice)
    ) {
      return res.status(400).json({
        success: false,
        message: "minPrice cannot be greater than maxPrice",
      });
    }
    const filter = { isActive: true };
    if (search) {
      filter.$text = { $search: search };
    }

    if (category) {
      filter.category = category.toLowerCase();
    }

    if (subcategory) {
      filter.subcategory = subcategory;
    }

    if (brand) {
      filter.brand = new RegExp(`^${brand}$`, "i");
    }

    if (tags) {
      const tagslist = tags.split(",").map((tag) => tag.trim());
      filter.tags = {
        $in: tagslist
      };
    }
    if (rating !== undefined) {
  filter.averageRating = {
    $gte: Number(rating)
  };
}
    
    if (minPrice !== undefined || maxPrice !== undefined) {
      filter.price = {};

      if (minPrice !== undefined) {
        filter.price.$gte = Number(minPrice);
      }
      if (maxPrice !== undefined) {
        filter.price.$lte = Number(maxPrice);
      }
    }

    
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

 const totalResults = await Product.countDocuments(filter);
 const totalPages = Math.ceil(totalResults / limit);
 const products = await Product.find(filter)
  .sort(sortOption)
  .skip(skip)
  .limit(Number(limit));
  
    res.status(200).json({
      success: true,
      message: "Products found successfully",
      totalResults,
      totalPages,
      page: Number(page),
      limit: Number(limit),
      products,

   });
}

  catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
  
const addReview = async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const productId = req.params.id;
    const userId = req.user._id;

    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    const alreadyReviewed = product.reviews.find(
      (review) => review.user.toString() === userId.toString()
    );

    if (alreadyReviewed) {
      return res.status(400).json({
        success: false,
        message: "You have already reviewed this product",
      });
    }

    const review = {
      user: userId,
      rating: Number(rating),
      comment,
    };

    product.reviews.push(review);

    product.calcAverageRating();

    await product.save();

    return res.status(201).json({
      success: true,
      message: "Review added successfully",
      reviews: product.reviews,
      averageRating: product.averageRating,
      numReviews: product.numReviews,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getProductReviews = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate(
      "reviews.user",
      "username"
    );

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    return res.status(200).json({
      success: true,
      count: product.reviews.length,
      reviews: product.reviews,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const deleteReview = async (req, res) => {
  try {
    const { id: productId, rid: reviewId } = req.params;

    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    const review = product.reviews.find(
      (review) => review._id.toString() === reviewId.toString()
    );

    if (!review) {
      return res.status(404).json({
        success: false,
        message: "Review not found",
      });
    }

    const isOwner =
      review.user.toString() === req.user._id.toString();

    const isAdmin = req.user.role === "admin";

    if (!isOwner && !isAdmin) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to delete this review",
      });
    }

    product.reviews = product.reviews.filter(
      (review) => review._id.toString() !== reviewId.toString()
    );

    product.calcAverageRating();

    await product.save();

    return res.status(200).json({
      success: true,
      message: "Review deleted successfully",
      reviews: product.reviews,
      averageRating: product.averageRating,
      numReviews: product.numReviews,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


const deleteProduct = async (req, res, next) => {
  try {
    const { id } = req.params;

    const product = await Product.findById(id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: `No product found with ID: ${id}`,
      });
    }

    const publicIdsToDelete = [];

    if (Array.isArray(product.images) && product.images.length > 0) {
      product.images.forEach((img) => {
        if (img && img.public_id) {
          publicIdsToDelete.push(img.public_id);
        }
      });
    }

    if (publicIdsToDelete.length > 0) {
      await Promise.all(
        publicIdsToDelete.map((publicId) => deleteFromCloudinary(publicId))
      );
    }

    await Product.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: 'Product and all associated images deleted successfully',
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export { 
  createProduct, 
  getAllProducts, 
  getProductById, 
  updateProduct, 
  searchProducts, 
  addReview,
  getProductReviews,
  deleteReview,
  deleteProduct 
};