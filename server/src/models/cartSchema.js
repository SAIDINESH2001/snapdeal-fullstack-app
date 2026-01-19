const mongoose = require("mongoose");


const cartSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      required: true,
      unique: true
    },
    items: [cartItemSchema],

    itemsPrice: {
      type: Number,
      default: 0
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
      default: 0
    }
  },
  {
    timestamps: true
  }
);

const Cart = mongoose.model("cart", cartSchema);
module.exports = Cart;
