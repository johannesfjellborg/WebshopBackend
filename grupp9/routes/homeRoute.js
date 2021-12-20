const express = require("express");
const router = express.Router();

const { homeRender, homeRenderAdmin, clearCookies } = require("../controller/homeController");
const verifyAdmin = require("../middleware/verifyAdmin");
const setGlobalVariables = require("../middleware/setGlobalVariables");

router.get("/", setGlobalVariables, homeRender);
router.get("/admin", verifyAdmin, homeRenderAdmin);
router.get("/logout", setGlobalVariables, clearCookies);

module.exports = router;