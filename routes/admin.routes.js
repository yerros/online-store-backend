const express = require("express");
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");
const AdminModel = require("../models/admin.model");
const { adminMiddleware } = require("../middleware");
require("dotenv").config();
const router = express.Router();

router.get("/", adminMiddleware, (req, res) => {
  res.json({
    msg: "admin route"
  });
});

// @route        POST /admin/login
// @desc         Login new admin
// @access       public
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  //check user
  try {
    let admin = await AdminModel.findOne({
      email
    });
    if (!admin) {
      return res.status(400).json({
        message: "Email yang anda masukkan salah"
      });
    }
    // check password
    let checkPassword = await bcryptjs.compare(password, admin.password);
    if (!checkPassword) {
      return res.status(400).json({
        message: "Password yang anda masukkan salah!"
      });
    }

    const payload = {
      admin: {
        id: admin.id
      }
    };
    jwt.sign(payload, process.env.secretJWT, (err, token) => {
      if (err) throw err;
      res.json({
        token
      });
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "something error found"
    });
  }
});

// @route        POST /admin/register
// @desc         Register new user
// @access       public
router.post("/register", async (req, res) => {
  const { firstname, lastname, email, password } = req.body;

  try {
    let admin = await AdminModel.findOne({
      email
    });
    if (admin) {
      return res.status(400).json({
        message: "Email address already use"
      });
    }

    admin = new AdminModel({
      firstname,
      lastname,
      email,
      password
    });

    const salt = await bcryptjs.genSalt(10);
    admin.password = await bcryptjs.hash(password, salt);

    await admin.save();

    const payload = {
      admin: {
        id: admin.id
      }
    };

    jwt.sign(payload, process.env.secretJWT, (err, token) => {
      if (err) throw err;
      res.json({
        message: "Admin added succefully",
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

module.exports = router;
