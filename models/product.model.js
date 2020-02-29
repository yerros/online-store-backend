const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema({
  create_at: {
    type: Date,
    default: Date.now
  },
  author: {
    type: mongoose.Types.ObjectId,
    ref: "Admin"
  },
  product_name: {
    type: String,
    required: true
  },
  product_description: {
    type: String,
    required: true
  },
  product_code: {
    type: String,
    default: ""
  },
  category: {
    type: mongoose.Types.ObjectId,
    ref: "Category"
  },
  stock: {
    type: Number,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  weight: {
    type: Number,
    required: true
  },
  color: {
    type: String,
    default: ""
  },
  size: {
    type: String,
    default: ""
  },
  material: {
    type: String,
    default: ""
  },
  tags: {
    type: String
  },
  product_image: {
    type: String
  }
});

module.exports = mongoose.model("Product", ProductSchema);
