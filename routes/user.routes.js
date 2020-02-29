const express = require("express");
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { adminMiddleware } = require("../middleware");
require("dotenv").config();
const UserModel = require("../models/user.model");
const router = express.Router();

// @route        GET /user
// @desc         Show list of user
// @access       private
router.get("/", adminMiddleware, async (req, res) => {
  try {
    const user = await UserModel.find();
    if (user) {
      res.send(user);
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "Server error" });
  }
});

// @route        GET /user/:id
// @desc         Show list of user
// @access       private
router.get("/:id", async (req, res) => {
  try {
    const user = await UserModel.findById({ _id: req.params.id }).populate(
      "orders"
    );
    if (user) {
      res.send(user);
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "Server error" });
  }
});

// @route        POST /user/register
// @desc         Register new user
// @access       public
router.post("/register", async (req, res) => {
  const { firstname, lastname, email, password } = req.body;

  try {
    let user = await UserModel.findOne({
      email
    });
    if (user) {
      return res.status(400).json({
        message: "Email address already use"
      });
    }

    user = new UserModel({
      firstname,
      lastname,
      email,
      password
    });

    const salt = await bcryptjs.genSalt(10);
    user.password = await bcryptjs.hash(password, salt);

    await user.save();

    const payload = {
      user: {
        id: user.id
      }
    };

    jwt.sign(payload, process.env.secretJWT, (err, token) => {
      if (err) throw err;
      res.json({
        message: "User added succefully",
        token
      });
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      error
    });
  }
});

// @route        POST /admin/login
// @desc         Login new admin
// @access       public
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  //check user
  try {
    let user = await UserModel.findOne({
      email
    });
    if (!user) {
      return res.status(400).json({
        message: "Email yang anda masukkan salah"
      });
    }
    // check password
    let checkPassword = await bcryptjs.compare(password, user.password);
    if (!checkPassword) {
      return res.status(400).json({
        message: "Password yang anda masukkan salah!"
      });
    }

    const payload = {
      user: {
        id: user.id
      }
    };
    jwt.sign(payload, process.env.secretJWT, (err, token) => {
      if (err) throw err;
      res.json({
        token,
        user
      });
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "something error found"
    });
  }
});

module.exports = router;
