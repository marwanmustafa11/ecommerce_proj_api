const mongoose = require('mongoose');
const orderSchema = new mongoose.Schema({
    user: {
         type: mongoose.Schema.Types.ObjectId,
         ref: 'User',
        required: true,
},

  items: [{
    product:{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Product',
            required: true,
    },
     name:{
            type: String,
            required: true,
    },
     image:{
            type: String,
            required: true,
    },
     price:{
            type: Number,
            required: true,
    },
     quantity:{
            type: Number,
            required: true,
    },
}],

   shippingAddress: {
      fullName: {
        type: String,
        required: true,
      },
      phone: {
        type: String,
        required: true,
      },
      country: {
        type: String,
        required: true,
      },
      city: {
        type: String,
        required: true,
      },
      address: {
        type: String,
        required: true,
      },
      postalCode: {
        type: String,
        required: true,  
      }},

    paymentMethod: {
      type: String,
      enum: ['cash','stripe','paypal','paymob'],
      default: 'cash',
    },

    paymentStatus: {
      type: String,
      enum: ['pending','paid','failed','refunded'],
     
    },

    transactionId: {
      type: String,
    },

    subtotal: {
      type: Number,
      required: true,
    },

    shippingFee: {
      type: Number,
      default:0,
    },
  
    tax: {
      type: Number,
    },

    discount: {
      type: Number,
    },

    totalPrice: {
      type: Number,
      required: true,
    },

status: {
      type: String,
      enum: ['pending','confirmed','processing','shipped','delivered','cancelled','returned'],
    
    },

    paidAt: {
      type: Date,
    },
    deliveredAt: {
      type: Date,
    },
    cancelledAt: {
      type: Date,
    },

    customerNote: {
      type: String,
      maxlength: 1000,
    },

    adminNote: {
      type: String,
      maxlength: 1000,
    },
  
},
{
    timestamps: true 
  }
);

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;