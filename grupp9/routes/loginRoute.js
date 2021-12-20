const express = require("express");
const router = express.Router();
const {loginRender, loginSubmit} = require("../controller/loginController");
const setGlobalVariables = require("../middleware/setGlobalVariables");

router.get("/login", setGlobalVariables, loginRender);
router.post("/login", setGlobalVariables, loginSubmit);

module.exports = router;