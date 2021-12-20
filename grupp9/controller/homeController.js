const { User } = require("../model/user");

const homeRender = async (req, res) => {
  res.render("index.ejs", {
    shoppingCartItems: req.variables.shoppingCartItems,
    role: req.variables.role,
    loggedIn: req.variables.loggedIn,
  });
};

const homeRenderAdmin = async (req, res) => {
  const user = await User.findOne({ _id: req.user.user._id });
  res.render("adminHome.ejs", {
    user: req.user.user,
    shoppingCartItems: user.shoppingCart.length,
    role: user.role,
    loggedIn: true,
  });
};

const clearCookies = (req, res) => {
  res.clearCookie("jwtToken");
  res.render("login.ejs", {
    error: "Du har loggats ut.",
    shoppingCartItems: 0,
    role: "customer",
    loggedIn: false,
  });
};

module.exports = { homeRender, homeRenderAdmin, clearCookies };
