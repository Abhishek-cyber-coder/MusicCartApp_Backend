const express = require("express");
const router = express.Router();

const verifyAuth = require("../middlewares/authMiddleware");

const Order = require("../models/order");

router.post("/", verifyAuth, async (req, res) => {
  try {
    const { userId, deliveryAddress, paymentMethod, items, orderTotal } =
      req.body;

    if (
      !userId ||
      !deliveryAddress ||
      !paymentMethod ||
      !items ||
      !orderTotal
    ) {
      return res.status(404).json({
        message: "Bad Request",
        success: false,
      });
    }

    const newOrder = new Order({
      deliveryAddress,
      paymentMethod,
      items,
      orderTotal,
      user: userId,
    });

    await newOrder.save();

    res.status(200).json({ newOrder });
  } catch (error) {
    console.error("Error in taking the order:", error);
    res.status(500).json({
      message: "Internal server error",
    });
  }
});

router.get("/detailAll", verifyAuth, async (req, res) => {
  try {
    const userId = req.body.userId;

    const orders = await Order.find({ user: userId });

    if (!orders) {
      return res.status(404).json({
        message: "No orders are there for this user",
      });
    }

    res.status(200).json(orders);
  } catch (error) {
    console.error("Error fetching the orders:", error);
    res.status(500).json({
      message: "Internal server error",
    });
  }
});

router.get("/detail/:invoiceId", verifyAuth, async (req, res) => {
  try {
    const invoiceId = req.params.invoiceId;
    const orderDetail = await Order.findById(invoiceId);

    if (!orderDetail) {
      return res.status(404).json({
        message: "Order related to this orderId not found",
        success: false,
      });
    }

    res.status(200).json({ orderDetail });
  } catch (error) {
    console.error("Error fetching the order by Id:", error);
    res.status(500).json({
      message: "Internal server error",
    });
  }
});

module.exports = router;
