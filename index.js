const express = require("express");
const { static } = require("express");
const bodyParser = require("body-parser");
const morgan = require("morgan");
const fs = require("fs");
const connectDB = require("./config/db");
const cors = require("cors");
const { noticeOrder } = require("./services");
const app = express();
app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: false
  })
);
app.use(morgan("tiny"));
noticeOrder();
//cors
const corsOptions = {
  origin: ["https://online-store-react.now.sh", "http://localhost:3000"],
  optionsSuccessStatus: 200
};
app.use(cors(corsOptions));
//conect database
connectDB();

//index routes
app.get("/", (req, res) => {
  res.send("home");
});

app.use("/images/", static("public/img/"));
app.use("/api/user", require("./routes/user.routes"));
app.use("/api/category", require("./routes/category.routes"));
app.use("/api/coupon", require("./routes/coupon.routes"));
app.use("/api/product", require("./routes/product.routes"));
app.use("/api/admin", require("./routes/admin.routes"));
app.use("/api/rajaongkir", require("./routes/rajaongkir.routes"));
app.use("/api/order", require("./routes/order.routes"));

// initialize app
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running at port ${PORT}`);
});
