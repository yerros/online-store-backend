const mongoose = require("mongoose");

const CouponSchema = new mongoose.Schema({
  coupon_code: {
    type: String,
    required: true,
    unique: true
  },
  discount: {
    type: Number,
    required: true
  },
  create_at: {
    type: Date,
    default: Date.now
  },
  expired: {
    type: Date,
    required: true
  }
});

module.exports = mongoose.model("Coupon", CouponSchema);
