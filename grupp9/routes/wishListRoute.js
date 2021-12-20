const express = require("express");
const router = express.Router();

const { wishListRender, addToWishList, removeFromWishList } = require("../controller/wishListController");
const verifyUser = require("../middleware/verifyUser");

router.get("/wishList", verifyUser, wishListRender);
router.get("/wishList/add", verifyUser, addToWishList);
router.get("/wishList/remove/:id", verifyUser, removeFromWishList);

module.exports = router;