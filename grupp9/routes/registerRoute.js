const express = require("express");
const router = express.Router();

const { registerRender, registerSubmit } = require("../controller/registerController");
const setGlobalVariables = require("../middleware/setGlobalVariables");

router.get("/register", setGlobalVariables, registerRender);
router.post("/register", setGlobalVariables, registerSubmit);

module.exports = router;