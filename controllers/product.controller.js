import Product from "../models/Product.model.js";
import { uploadToCloudinary } from "../utils/uploadToCloudinary.js";
import slugify from "slugify";
import { deleteFromCloudinary } from "../utils/uploadToCloudinary.js";

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

    res.status(201).json({
      success: true,
      message: "Product created successfully",
      product,
    });
  } catch (error) {
    res.status(500).json({
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
    res.status(500).json({
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
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// const updateProduct = async (req, res) => {
//   try {
//     const product = await Product.findById(req.params.id);

//     if (!product) {
//       return res.status(404).json({
//         success: false,
//         message: "Product not found",
//       });
//     }
//         // Object.assign(product, req.body);


//     if (req.body.name) {
//       req.body.slug = slugify(req.body.name, { lower: true });
//     }

//     if (req.body.deletedImagePublicIds) {
//       // التعامل مع القيمة سواء جات كـ String واحد أو Array
//       let idsToDelete = req.body.deletedImagePublicIds;
//       if (typeof idsToDelete === "string") {
//         idsToDelete = [idsToDelete];
//       }

//       // حذف الصور من Cloudinary
//       await Promise.all(
//         idsToDelete.map((publicId) => deleteFromCloudinary(publicId))
//       );

//       // حذف الصور من مصفوفة الصور الخاصة بالمنتج في MongoDB
//       product.images = product.images.filter(
//         (img) => !idsToDelete.includes(img.public_id)
//       );
//     }

//     // if (req.files && req.files.length > 0) {
//     //   const uploadedImages = await Promise.all(
//     //     req.files.map((file) => uploadToCloudinary(file.buffer)),
//     //   );

//     //   product.images.push(...uploadedImages);
//     // }


//     if (req.files && req.files.length > 0) {
//       // تصفية الملفات لتجنب رفع ملفات فارغة من Postman
//       const validFiles = req.files.filter((file) => file.size > 0);

//       if (validFiles.length > 0) {
//         const uploadedImages = await Promise.all(
//           validFiles.map((file) => uploadToCloudinary(file.buffer))
//         );

//         product.images.push(...uploadedImages);
//       }
//     }

//     const bodyData = { ...req.body };
//     delete bodyData.deletedImagePublicIds; // مسحها عشان متتحفظش كـ field عشوائي في Mongo

//     Object.assign(product, bodyData);

//     await product.save();

//     res.status(200).json({
//       success: true,
//       message: "Product updated successfully",
//       product,
//     });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: error.message,
//     });
//   }
// };

const updateProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    // 1. تحديث الـ Slug لو الاسم اتغير
    if (req.body.name) {
      req.body.slug = slugify(req.body.name, { lower: true });
    }

    // 2. معالجة حذف صور معينة بـ public_id من Cloudinary و MongoDB
    if (req.body.deletedImagePublicIds) {
      let idsToDelete = req.body.deletedImagePublicIds;
      
      // لو جاية كـ String واصل فيها أكتر من ID أو مسافات
      if (typeof idsToDelete === "string") {
        idsToDelete = idsToDelete.split(",").map((id) => id.trim());
      } else if (Array.isArray(idsToDelete)) {
        idsToDelete = idsToDelete.map((id) => id.trim());
      }

      // حذف الصور من Cloudinary
      await Promise.all(
        idsToDelete.map((publicId) => deleteFromCloudinary(publicId))
      );

      // فلترة مصفوفة الصور في MongoDB (مع تنظيف المسافات للمطابقة المباشرة)
      product.images = product.images.filter(
        (img) => !idsToDelete.includes(img.public_id.trim())
      );
    }

    // 3. رفع الصور الجديدة فقط إذا كان الملف يحتوي على محتوى حقيقي (وليس خانة فارغة)
    if (req.files && req.files.length > 0) {
      // تصفية الملفات لتجنب رفع ملفات فارغة من Postman
      const validFiles = req.files.filter((file) => file.size > 0);

      if (validFiles.length > 0) {
        const uploadedImages = await Promise.all(
          validFiles.map((file) => uploadToCloudinary(file.buffer))
        );

        product.images.push(...uploadedImages);
      }
    }

    // 4. تحديث باقي البيانات النصية القادمة في req.body
    const bodyData = { ...req.body };
    delete bodyData.deletedImagePublicIds;

    Object.assign(product, bodyData);

    // 5. حفظ المنتج المحدث
    await product.save();

    res.status(200).json({
      success: true,
      message: "Product updated successfully",
      product,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
 const searchProducts = async (req, res) => {
  try {
       const { search, category , subcategory, brand , tags, minPrice, maxPrice, rating} = req.query;
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
       if (search) 
        {
          filter.$text = { $search: search };
        }

       if (category) 
        {
         filter.category = category.toLowerCase();
        }

       if (subcategory){
        filter.subcategory = subcategory;
       } 

       if (brand) 
        {
        filter.brand = new RegExp(`^${brand}$`, "i");
        }

       if (tags) {
        const tagslist = tags.split(",").map((tag) => tag.trim());
        filter.tags = {
          $in: tagslist};
     }
      if (rating !== undefined) {
        filter.rating = {
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

    const products = await Product.find(filter);
    res.status(200).json({
      success: true,
      message: "Products found successfully",
      products,
    });
   }

  catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    // 1. البحث عن المنتج للتأكد من وجوده وجلب بيانات الصور
    const product = await Product.findById(id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    // 2. حذف كافة صور المنتج من Cloudinary (إذا كانت توجد صور)
    if (product.images && product.images.length > 0) {
      await Promise.all(
        product.images.map((img) => deleteFromCloudinary(img.public_id))
      );
    }

    // 3. حذف المنتج من داتابيز MongoDB
    await Product.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: "Product and its associated images deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};




export { createProduct, getAllProducts, getProductById, updateProduct, deleteProduct, searchProducts };
