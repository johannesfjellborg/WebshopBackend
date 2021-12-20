const express = require("express");
const router = express.Router();

const { resetPasswordRender, resetPasswordSubmit, setPasswordRender, setPasswordSubmit } = require("../controller/resetPasswordController");
const setGlobalVariables = require("../middleware/setGlobalVariables");

router.get("/resetpassword", setGlobalVariables, resetPasswordRender);
router.post("/resetpassword", setGlobalVariables, resetPasswordSubmit);
router.get("/setpassword/:token", setGlobalVariables, setPasswordRender);
router.post("/setpassword/:token", setGlobalVariables, setPasswordSubmit);

module.exports = router;