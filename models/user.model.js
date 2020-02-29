const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  create_at: {
    type: Date,
    default: Date.now
  },
  firstname: {
    type: String,
    required: true
  },
  lastname: {
    type: String,
    required: true
  },
  email: {
    type: String,
    unique: true,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  company: {
    type: String,
    default: ""
  },
  street: {
    type: String,
    default: ""
  },
  city: {
    type: String,
    default: ""
  },
  state: {
    type: String,
    default: ""
  },
  zip: {
    type: String,
    default: ""
  },
  country: {
    type: String
  },
  phone: {
    type: Number,
    default: ""
  },
  orders: [
    {
      type: mongoose.Types.ObjectId,
      ref: "Order"
    }
  ]
});

module.exports = mongoose.model("User", UserSchema);
