const mongoose = require('mongoose');
const cartSchema = new mongoose.Schema({
user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true,
  },

  items:[{
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
    },

    name: {
      type: String,
    },

    image: {
      type: String,
    },

    price: {
      type: Number,
    },

    quantity: {
      type: Number,
    },
  }],

coupon: {
    code: {
      type: String,
      uppercase: true,
    },

    discountType: {
      type: String,
      enum: ['percentage', 'fixed'],
    },
    discountValue: {
      type: Number,
    },
  },
},
   {
    timestamps: true 
  }
);


cartSchema.virtual('subtotal').get(function () {
  let sum = 0;
  this.items.forEach((item) => {
    sum += item.price * item.quantity;
  });
  return sum;
});

cartSchema.virtual('discountAmount').get(function () {
  if (!this.coupon || !this.coupon.discountValue) 
     return 0;

  if (this.coupon.discountType == 'percentage') {
    return (this.subtotal * this.coupon.discountValue) / 100;
  } 
  if (this.coupon.discountType == 'fixed') {
    return Math.min(this.coupon.discountValue, this.subtotal);
  }
  return 0;
});

cartSchema.virtual('total').get(function () {
  return Math.max(0, this.subtotal - this.discountAmount);
});

cartSchema.virtual('itemCount').get(function () {
let count = 0;
  this.items.forEach((item) => {
    count += item.quantity;
  });
  return count;
});

const Cart = mongoose.model('Cart', cartSchema);

module.exports = Cart;