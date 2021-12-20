const express = require("express");
const router = express.Router();

const {
  checkout, 
  checkoutSuccess,
  addGreeting,
} = require("../controller/paymentController");
const verifyUser = require("../middleware/verifyUser");

router.get("/checkout/:id", verifyUser, checkout);
router.post("/checkout/:id", verifyUser, addGreeting);
router.get("/checkoutSuccess/:id", verifyUser, checkoutSuccess);

module.exports = router;
