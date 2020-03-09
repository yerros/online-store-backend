const express = require("express");
const UserModel = require("../models/user.model");
const OrderModel = require("../models/order.model");
const midtransClient = require("midtrans-client");
const { sendMail } = require("../services");
const router = express.Router();

router.post("/", async (req, res) => {
  const { total_price, payment_method, shipping_method } = req.body;
  const user = await UserModel.findByIdAndUpdate(
    { _id: req.body.customer._id },
    { $set: req.body.customer }
  );
  const itemID = req.body.items.map(item => item._id);
  const order = new OrderModel({
    customer: user._id,
    items: itemID,
    total_price: total_price,
    payment_method: payment_method,
    shipping_method: shipping_method
  });
  await order.save();
  await UserModel.findOneAndUpdate(
    { _id: user._id },
    { $push: { orders: order._id } }
  );
  await sendMail(req.body);
  res.send(order);
});

router.get("/", async (req, res) => {
  const order = await OrderModel.find().populate("customer items");
  res.send(order);
});

router.post("/transaction", async (req, res) => {
  const order = req.body;
  res.send(order);
});

// router.get("/:id", async (req, res) => {
//   const order = await OrderModel.findById(req.params.id).populate(
//     "customer items"
//   );
//   res.send(order);
// });

router.get("/success", async (req, res) => {
  const id = req.query.orderID;
  const order = await OrderModel.findByIdAndUpdate(
    { _id: id },
    { $set: { status: "paid" } }
  );
  res.send(order);
});

router.get("/token", (req, res) => {
  let snap = new midtransClient.Snap({
    isProduction: false,
    serverKey: "SB-Mid-server-avadaU6xl-9YhNg_dASAPCQW",
    clientKey: "SB-Mid-client-GNV7FN8RaJuzyoEG"
  });

  let parameter = {
    transaction_details: {
      order_id: req.query.id,
      gross_amount: req.query.amount
    },
    credit_card: {
      secure: true
    }
  };

  snap.createTransaction(parameter).then(transaction => {
    const token = transaction.token;
    const redirect = transaction.redirect_url;
    res.send({ token, redirect });
  });
});

module.exports = router;
