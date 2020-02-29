const express = require("express");
const CategoryModel = require("../models/category.model");
const { adminMiddleware } = require("../middleware");
const route = express.Router();

// @route        POST /category/
// @desc         Add new Category
// @access       private
route.post("/", adminMiddleware, async (req, res) => {
  const { category_name, category_description } = req.body;
  try {
    let category = await CategoryModel.findOne({
      category_name
    });
    if (category) {
      return res.status(400).json({
        message: "Category already exist"
      });
    }

    category = new CategoryModel({
      category_name,
      category_description
    });
    await category.save();
    res.send(category);
  } catch (error) {
    res.status(500).json({
      message: "Something error found"
    });
  }
});

// @route        POST /category/
// @desc         List Category
// @access       public
route.get("/", async (req, res) => {
  try {
    let category = await CategoryModel.find().populate("products");
    res.send(category);
  } catch (error) {
    res.status(500).json({
      message: "Something error found"
    });
  }
});

// @route        PUT /category/
// @desc         Update Category
// @access       private
route.put("/:id", adminMiddleware, async (req, res) => {
  const { category_name, category_description } = req.body;
  try {
    const update = await CategoryModel.findOneAndUpdate(
      {
        _id: req.params.id
      },
      {
        $set: {
          category_name: category_name,
          category_description: category_description
        }
      }
    );
    res.status(200).json({
      message: "Update Success",
      result: update
    });
  } catch (error) {
    console.log(error);
    res.status(500).send("Server Error 2");
  }
});

// @route        DELETE /category/
// @desc         Delete Category
// @access       private
route.delete("/:id", adminMiddleware, async (req, res) => {
  try {
    const deleted = await CategoryModel.findByIdAndDelete({
      _id: req.params.id
    });
    if (!deleted) {
      return res.status(404).json({
        message: "category not found"
      });
    }
    res.status(200).json({
      msg: "Delete Success"
    });
  } catch (error) {
    console.log(error);
    res.status(500).send("Server Error 2");
  }
});

module.exports = route;
