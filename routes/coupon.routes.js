const express = require("express");
const { adminMiddleware } = require("../middleware");
const CouponModel = require("../models/coupon.model");
const moment = require("moment");

const router = express.Router();

// @route        GET /coupon
// @desc         List Coupon
// @access       private
router.get("/", adminMiddleware, async (req, res) => {
  try {
    const coupon = await CouponModel.find();
    if (coupon) {
      res.send(coupon);
    }
  } catch (error) {
    res.status(500).json({
      message: "Something error found"
    });
  }
});

// @route        POST /coupon/:id
// @desc         List Coupon
// @access       public
router.post("/:code", async (req, res) => {
  const code = req.params.code;
  const today = moment().format();
  const coupon = await CouponModel.findOne({ coupon_code: code });
  if (coupon) {
    const notExpired = moment(today).isBetween(
      coupon.create_at,
      coupon.expired
    );
    console.log(notExpired);
    if (!notExpired) {
      return res.json({
        msg: "expired"
      });
    }
    res.json({
      msg: "You can use this coupon",
      discount: coupon.discount
    });
  }
});

// @route        POST /coupon
// @desc         Add new coupon
// @access       private
router.post("/", adminMiddleware, async (req, res) => {
  const body = req.body;
  try {
    let code = await CouponModel.findOne({ coupon_code: req.body.coupon_code });
    if (code) {
      return res.status(400).json({
        message: "Coupon code address already exist"
      });
    }
    code = new CouponModel(body);
    await code.save();
    res.send(code);
  } catch (error) {
    res.status(500).json({
      message: "Something error found"
    });
  }
});

// @route        DELETE /coupon/:id
// @desc         Delete coupon
// @access       private
router.delete("/:id", adminMiddleware, async (req, res) => {
  try {
    const deleted = await CouponModel.findByIdAndDelete({
      _id: req.params.id
    });
    if (!deleted) {
      return res.status(404).json({
        message: "coupon not found"
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

module.exports = router;
