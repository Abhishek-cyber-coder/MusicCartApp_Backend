const express = require("express");
const router = express.Router();
const Product = require("../models/product");

router.get("/all", async (req, res) => {
  try {
    const { headphoneType, company, color, priceRange, sortBy, search } =
      req.query;

    let query = {};

    if (headphoneType) {
      const editedType = headphoneType + " " + "headphone";
      query.typeOfProduct = editedType;
    }

    if (company) {
      query.brand = company;
    }

    if (color) {
      const editedColor = color[0].toUpperCase() + color.slice(1).toLowerCase();
      query.color = editedColor;
    }

    if (priceRange) {
      const [minPrice, maxPrice] = priceRange.split("-");
      query.price = { $gte: Number(minPrice), $lte: Number(maxPrice) };
    }

    if (search) {
      query.title = { $regex: search, $options: "i" };
    }

    let productQuery = Product.find(query);

    if (sortBy) {
      productQuery = productQuery.sort(sortBy);
    }

    const products = await productQuery;
    res.status(200).json({ products });
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({
      message: "Internal server error",
    });
  }
});

router.get("/details/:productId", async (req, res) => {
  try {
    const productId = req.params.productId;

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({
        message: "Product not found",
        success: false,
      });
    }

    res.status(200).json(product);
  } catch (error) {
    console.error("Error fetching product details:", error);
    res.status(500).json({
      message: "Internal server error",
    });
  }
});

module.exports = router;
