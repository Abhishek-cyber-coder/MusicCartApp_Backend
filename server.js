const express = require("express");
const app = express();
app.use(express.json());

const cors = require("cors");
app.use(cors());

const authRoutes = require("./routes/auth");
const cartRoutes = require("./routes/cart");
const productRoutes = require("./routes/product");
const orderRoutes = require("./routes/order");
const feedbackRoutes = require("./routes/feedback");

const dotenv = require("dotenv");
dotenv.config();

const mongoose = require("mongoose");
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("DB is connected successfully");
  })
  .catch((err) => {
    console.log(err);
  });

app.get("/health", (req, res) => {
  return res.json({
    message: "API is running successfully",
  });
});

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/cart", cartRoutes);
app.use("/api/v1/product", productRoutes);
app.use("/api/v1/order", orderRoutes);
app.use("/api/v1/feedback", feedbackRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, (err) => {
  if (!err) {
    console.log(`Server is running at port ${PORT}`);
  }
});
