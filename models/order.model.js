const mongoose = require("mongoose");

const OrderSchema = new mongoose.Schema({
  create_at: {
    type: Date,
    default: Date.now
  },
  customer: {
    type: mongoose.Types.ObjectId,
    ref: "User"
  },
  items: [
    {
      type: mongoose.Types.ObjectId,
      ref: "Product"
    }
  ],
  total_price: {
    type: Number
  },
  status: {
    type: String,
    default: "unpaid"
  },
  payment_method: {
    type: String,
    default: ""
  },
  shipping_method: {
    type: String,
    default: ""
  }
});

module.exports = mongoose.model("Order", OrderSchema);
