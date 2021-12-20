const express = require("express");
const router = express.Router();

const { shoppingCartRender, addToShoppingCart, removeFromShoppingCart, successRender } = require("../controller/shoppingCartController");
const verifyUser = require("../middleware/verifyUser");

router.get("/shoppingCart", verifyUser, shoppingCartRender);
router.get("/shoppingCart/add", verifyUser, addToShoppingCart);
router.get("/shoppingCart/remove/:id", verifyUser, removeFromShoppingCart);
router.get("/success", verifyUser, successRender);

module.exports = router;