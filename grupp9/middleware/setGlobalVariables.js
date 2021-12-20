const jwt = require("jsonwebtoken");
require("dotenv").config();
const { User } = require("../model/user");

const setGlobalVariables = async (req, res, next) => {
  const token = req.cookies.jwtToken;
  if (!token) {
    req.variables = {
      shoppingCartItems: 0,
      role: "customer",
      loggedIn: false,
    };
    next();
    return;
  }
  const validUser = jwt.verify(token, process.env.SECRET_KEY);
  if (validUser) {
    const user = await User.findOne({ _id: validUser.user._id });
    req.variables = {
      shoppingCartItems: user.shoppingCart.length,
      role: user.role,
      loggedIn: true,
    };
  }
  next();
};

module.exports = setGlobalVariables;
