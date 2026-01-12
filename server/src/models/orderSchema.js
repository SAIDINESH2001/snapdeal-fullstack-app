const mongoose = require("mongoose");

const orderItemSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true
    },
    quantity: {
      type: Number,
      required: true,
      min: 1
    },
    price: {
      type: Number,
      required: true
    }
  },
  { _id: false }
);

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    items: [orderItemSchema],

    shippingAddress: {
      street: { type: String, required: true },
      city: { type: String, required: true },
      state: { type: String, required: true },
      country: { type: String, required: true },
      zipCode: { type: String, required: true }
    },

    itemsPrice: {
      type: Number,
      required: true
    },
    taxPrice: {
      type: Number,
      default: 0
    },
    shippingPrice: {
      type: Number,
      default: 0
    },
    totalPrice: {
      type: Number,
      required: true
    },

    orderStatus: {
      type: String,
      enum: ["pending", "preprocessing", "shipped", "delivered", "cancelled"],
      default: "pending"
    },

    deliveredAt: {
      type: Date
    },

    trackingNumber: {
      type: String
    }
  },
  {
    timestamps: true
  }
);

const Order = mongoose.model("orders", orderSchema);
module.exports = Order;
