const mongoose = require("mongoose");
const slugify = require("slugify");
const productSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 200,
    },
    slug: {
      type: String,
      unique: true,
    },
    shortDescription: {
      type: String,
      required: true,
      maxlength: 500,
    },
    description: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    discountPrice: {
      type: Number,
      default: 0,
      min: 0,
    },
    stock: {
      type: Number,
      default: 1,
      min: 0,
      required: true,
    },
    sku: {
      type: String,
      unique: true,
      sparse: true,
    },
    images: {
      type: [
        {
          public_id: {
            type: String,
            required: true,
          },
          url: {
            type: String,
            required: true,
          },
        },
      ],
      required: true,
      validate(images) {
        if (images.length === 0) {
          throw new Error("Product must have at least one image");
        }
      },
    },
    category: {
      type: String,
      required: true,
      lowercase: true,
    },
    subcategory: {
      type: String,
      lowercase: true,
    },
    brand: {
      type: String,
    },
    tags: [{ type: String }],

    reviews: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
          required: true,
        },

        rating: {
          type: Number,
          required: true,
          min: 1,
          max: 5,
        },

        comment: {
          type: String,
          required: true,
        },
      },
    ],
    averageRating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },

    numReviews: {
      type: Number,
      default: 0,
    },
    featured: {
      type: Boolean,
      default: false,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true },
);
productSchema.pre("save", async function (next) {
  if (!this.isModified("name")) {
    return next();
  }
  const baseSlug = slugify(this.name, {
    lower: true,
    strict: true,
    trim: true,
  });

  let slug = baseSlug;
  let length = 0;
  while (
    await ProductModel.exists({
      slug,
      _id: { $ne: this._id },
    })
  ) {
    length++;
    slug = `${baseSlug}-${length}`;
  }
  this.slug = slug;
  next();
});

productSchema.methods.calcAverageRating = function () {
  if (this.reviews.length === 0) {
    this.averageRating = 0;
    this.numReviews = 0;
    return;
  }
  const totalReviews = this.reviews.reduce(
    (total, review) => total + review.rating,
    0,
  );
  this.numReviews = this.reviews.length;
  this.averageRating = Number((totalReviews / this.numReviews).toFixed(2));
};
const ProductModel = mongoose.model("Product", productSchema);
module.exports = ProductModel;
