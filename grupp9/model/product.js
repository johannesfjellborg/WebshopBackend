const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  description: { type: String, required: true },
  detailedDescription: { type: String, required: true },
  image: { type: String, required: true },
});

const Product = mongoose.model("product", productSchema);

module.exports = Product;
