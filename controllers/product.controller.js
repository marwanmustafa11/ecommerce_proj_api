import Product from '../models/Product.model.js';

export const searchProducts = async (req, res) => {
  try {
       const { search, category , subcategory, brand , tags, minPrice, maxPrice} = req.query;
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