const nodeMailer = require("nodemailer");
const moment = require("moment");
const cron = require("node-cron");
const fs = require("fs");
const cloudinary = require('cloudinary').v2
require("dotenv");
const OrderModel = require("../models/order.model");
const Mustache = require("mustache");

//send Email
const sendMail = async payload => {
  const template = fs.readFileSync("./helper/template.html", "utf8");
  let transporter = nodeMailer.createTransport({
<<<<<<< HEAD
    host: "smtp.mailtrap.io",
    port: 587,
    secure: false,
    auth: {
      user: process.env.mailtrap_USER,
      pass: process.env.mailtrap_PASS
=======
    host: "smtp.sendgrid.net",
    port: 465,
    secure: false,
    auth: {
      user: "apikey",
      pass: process.env.SENDGRID_API_KEY
    },
    tls: {
      rejectUnauthorized: false
>>>>>>> remove sendgrid API
    }
  });

  let mail = {
    from: "info2@eversick.co",
    to: "bahtiaryeris@gmail.com",
    subject: `Thanks for your order ${payload._id}`,
    html: Mustache.render(template, payload)
  };
  transporter.sendMail(mail).catch(console.error);
  console.log("email send");
};


// check order status return UNPAID status
const checkOrder = async () => {
  const allOrder = await OrderModel.find().populate("customer items");
  const unpaidOrder = allOrder.filter(item => item.status === "unpaid");
  return unpaidOrder;
};

// Check expired Order
const checkExpired = orderID => {
  const today = moment(new Date()).format();
  const expired = moment(orderID)
    .add(5, "days")
    .format();
  const checkDay = moment(today).isBetween(orderID, expired);
  return checkDay;
};

// Set order to Expired
const setExpired = async orderID => {
  await OrderModel.findByIdAndUpdate(
    { _id: orderID },
    { $set: { status: "expired" } }
  );
};

// Cron job Every 23.59
const noticeOrder = async () => {
  cron.schedule("59 23 * * *", async function () {
    console.log("cron running");
    const today = moment(new Date()).format();
    const unpaid = await checkOrder();
    unpaid.map(async item => {
      const order = await OrderModel.findById(item._id);
      const checkDay = checkExpired(order.create_at);
      if (checkDay) {
        console.log(order._id + " send notice to user");
        sendMail(order._id);
      } else {
        console.log(order._id + " this order set to expired");
        setExpired(order._id);
      }
    });
    //noticeMail;
  });
};

const uploadCloudinary = async (image) => {
  return new Promise((resolve, reject) => {
    cloudinary.config({
      cloud_name: 'diiizbyxa',
      api_key: '418657921356493',
      api_secret: 'I2JeNXRXp3AqGPiF3CzcTYUBXC4'
    })

    cloudinary.uploader.upload(image, (err, result) => {
      if (err) reject(err);
      resolve(result)
    })
  })
}
module.exports = { sendMail, noticeOrder, uploadCloudinary };
