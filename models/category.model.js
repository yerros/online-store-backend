const mongoose = require("mongoose");

const CategorySchema = new mongoose.Schema({
  category_name: {
    type: String,
    required: true,
    unique: true
  },
  category_description: {
    type: String
  },
  products: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product"
    }
  ]
});

module.exports = mongoose.model("Category", CategorySchema);
