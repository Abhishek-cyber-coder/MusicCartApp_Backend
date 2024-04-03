const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  brand: {
    type: String,
    required: true,
  },

  rating: {
    type: Number,
    min: 0,
    max: 5,
    default: 0,
  },
  price: {
    type: Number,
    required: true,
  },
  description: {
    type: String,
  },
  color: {
    type: String,
  },
  typeOfProduct: {
    type: String,
  },
  numOfCustomerReviews: {
    type: Number,
    default: 0,
  },
  images: {
    type: [String],
  },
  heading: {
    type: String,
  },
});

module.exports = mongoose.model("Product", productSchema);
