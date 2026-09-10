import mongoose from "mongoose";
import slugify from "slugify";
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
productSchema.pre("save", async function () {
  if (!this.isModified("name")) {
    return ;
  }
  const baseSlug = slugify(this.name, {
    lower: true,
    strict: true,
    trim: true,
  });

  let slug = baseSlug;
  let length = 0;
  while
  (
    await this.constructor.exists({
      slug,
      _id: { $ne: this._id },
    })
  ) {
    length++;
    slug = `${baseSlug}-${length}`;
  }
  this.slug = slug;
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
productSchema.index({
  name: "text",
  description: "text",
  brand: "text",
});

productSchema.index({ category: 1 });
productSchema.index({ brand: 1 });
productSchema.index({ price: 1 });
productSchema.index({ averageRating: 1 });
productSchema.index({ createdAt: 1 });

const ProductModel = mongoose.model("Product", productSchema);
export default ProductModel;
