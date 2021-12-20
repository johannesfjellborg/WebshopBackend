const {
  addProductForm,
  addProductFormSubmit,
  showAdminProducts,
  editProductForm,
  editProductFormSubmit,
  editImageForm,
  editImageFormSubmit,
  deleteProduct,
} = require("../controller/adminController");
const express = require("express");
const verifyAdmin = require("../middleware/verifyAdmin");
const {upload} = require("../middleware/productImage");
const router = express.Router();

router.get("/addProduct", verifyAdmin, addProductForm);
router.post("/addProduct", verifyAdmin, upload.single("productImage"), addProductFormSubmit);
router.get("/adminProducts", verifyAdmin, showAdminProducts);
router.get("/edit/:id", verifyAdmin, editProductForm);
router.post("/edit/:id", verifyAdmin, editProductFormSubmit);
router.get("/editImage/:id", verifyAdmin, editImageForm);
router.post("/editImage/:id", verifyAdmin, upload.single("productImage"), editImageFormSubmit);
router.get("/delete/:id", verifyAdmin, deleteProduct);

module.exports = router;