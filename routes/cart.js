const express = require("express");
const router = express.Router();

const Product = require("../models/product");
const Cart = require("../models/cart");

const verifyAuth = require("../middlewares/authMiddleware");

router.post("/addToCart", verifyAuth, async (req, res) => {
  try {
    const { userId, productId, quantity } = req.body;

    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({
        message: "Product not found",
        success: false,
      });
    }

    const price = product.price * quantity;

    let cart = await Cart.findOne({ user: userId });
    if (!cart) {
      cart = new Cart({ user: userId });
    }

    const indexOfExistingItem = cart.items.findIndex(
      (item) => item.product.toString() === productId
    );

    if (indexOfExistingItem !== -1) {
      cart.items[indexOfExistingItem].quantity += quantity;
      cart.items[indexOfExistingItem].price += price;
    } else {
      cart.items.push({ product: productId, quantity, price });
    }

    cart.total += price;
    cart.totalItems += quantity;

    await cart.save();

    res.status(200).json({
      message: "Item added to cart successfully",
      success: true,
    });
  } catch (error) {
    console.error("Error fetching cart items:", error);
    res.status(500).json({
      message: "Quantity limit reached!",
    });
  }
});

router.get("/cartDetails", verifyAuth, async (req, res) => {
  try {
    const { userId } = req.body;

    const cart = await Cart.findOne({ user: userId }).populate("items.product");

    res.status(200).json(cart);
  } catch (error) {
    console.error("Error fetching cart items:", error);
    res.status(500).json({
      message: "Internal server error",
    });
  }
});

router.put("/updateCart", verifyAuth, async (req, res) => {
  try {
    const { userId, productId, quantity } = req.body;

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({
        message: "Product not found",
        success: false,
      });
    }

    let cart = await Cart.findOne({ user: userId });
    if (!cart) {
      return res.status(404).json({
        message: "Cart not found",
        success: false,
      });
    }

    let cartItem = cart.items.find(
      (item) => item.product.toString() === productId
    );

    const previousQuantity = cartItem.quantity;
    const priceDifference = (quantity - cartItem.quantity) * product.price;

    cartItem.quantity = quantity;
    cartItem.price += priceDifference;
    cart.total += priceDifference;

    cart.totalItems += quantity - previousQuantity;
    await cart.save();
    res.status(200).json(cart);
  } catch (error) {
    console.error("Error updating cart items:", error);
    res.status(500).json({
      message: "Internal server error",
    });
  }
});

router.put("/deleteCart/items", verifyAuth, async (req, res) => {
  try {
    const { userId } = req.body;

    const cart = await Cart.findOneAndUpdate(
      { user: userId },
      { $set: { items: [], total: 0, totalItems: 0 } },
      { new: true }
    );

    res.status(200).json(cart);
  } catch (error) {
    console.error("Error deleting the cart items:", error);
    res.status(500).json({
      message: "Internal server error",
    });
  }
});

module.exports = router;
