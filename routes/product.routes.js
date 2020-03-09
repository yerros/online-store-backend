const express = require("express");
const multer = require("multer");
const path = require("path");
const { uploadCloudinary } = require('../services')
const route = express.Router();
require("dotenv").config();
const { adminMiddleware } = require("../middleware");
const ProductModel = require("../models/product.model");
const CategoryModel = require("../models/category.model");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/img");
  },
  filename: (req, file, cb) => {
    cb(null, "product-" + Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });

// @route        GET /Product/
// @desc         List Product
// @access       public
route.get("/", async (req, res) => {
  try {
    let product = await ProductModel.find().populate({ path: "category" });
    res.send(product);
  } catch (error) {
    res.status(500).json({
      message: "Something error found"
    });
  }
});

// @route        GET /Product/:id
// @desc         get single Product
// @access       public
route.get("/:id", async (req, res) => {
  const id = req.params.id;
  try {
    let product = await ProductModel.findById({ _id: id }).populate({
      path: "category"
    });
    if (!product) {
      return res.status(404).json({ msg: "Product not found" });
    }
    res.send(product);
  } catch (error) {
    res.status(500).json({
      message: "Something error found"
    });
  }
});

// @route        POST /Product/
// @desc         Add Product
// @access       private
route.post("/", adminMiddleware, async (req, res) => {
  const data = req.body;
  try {
    if (data) {
      const product = new ProductModel(data);
      await product.save();
      await CategoryModel.findByIdAndUpdate(
        { _id: product.category },
        { $push: { products: product._id } }
      );
      res.send(product);
    }
  } catch (error) {
    res.status(500).json({ msg: "Server error" });
  }
});

// @route        PUT /Product/:id
// @desc         Update Product
// @access       private
route.put("/:id", adminMiddleware, async (req, res) => {
  const id = req.params.id;
  const data = req.body;
  try {
    if (data) {
      const product = await ProductModel.findByIdAndUpdate(
        { _id: id },
        { $set: data }
      );
      res.send(product);
    }
  } catch (error) {
    res.status(500).json({ msg: "Server error" });
  }
});

// @route        Post /img-upload
// @desc         Upload Image
// @access       private
route.post(
  "/img-upload",
  adminMiddleware,
  upload.single("products"),
  async (req, res) => {

    try {
      const url = `${process.env.BaseUrl}/images/`;
      await uploadCloudinary(req.file.path)
        .then(result => {
          res.json({
            message: "Success",
            img: url + req.file.filename,
            remote: result.url
          });
        })
    } catch (error) {
      res.sendStatus(400);
    }
  }
);

module.exports = route;
