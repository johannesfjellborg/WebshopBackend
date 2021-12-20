const {
  showProduct,
  showProductDetails,
} = require("../controller/showProductsController");
const setGlobalVariables = require("../middleware/setGlobalVariables");
const express = require("express");
const router = express.Router();

router.get("/products", setGlobalVariables, showProduct);
router.get("/productDetails/:id", setGlobalVariables, showProductDetails);

module.exports = router;
