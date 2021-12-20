const { User } = require("../model/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const loginRender = async (req, res) => {
  return res.render("login.ejs", {
    error: req.flash("msg"),
    shoppingCartItems: req.variables.shoppingCartItems,
    role: req.variables.role,
    loggedIn: req.variables.loggedIn,
  });
};

const loginSubmit = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email: email });
  if (!user)
    return res.render("login.ejs", {
      error: "Fel mailadress, försök igen",
      shoppingCartItems: req.variables.shoppingCartItems,
      role: req.variables.role,
      loggedIn: req.variables.loggedIn,
    });
  const validUser = await bcrypt.compare(password, user.password);
  if (!validUser)
    return res.render("login.ejs", {
      error: "Fel lösenord, försök igen",
      shoppingCartItems: req.variables.shoppingCartItems,
      role: req.variables.role,
      loggedIn: req.variables.loggedIn,
    });
  const jwtToken = await jwt.sign({ user: user }, process.env.SECRET_KEY);
  if (jwtToken) {
    const cookie = req.cookies.jwtToken;
    if (!cookie) {
      res.cookie("jwtToken", jwtToken, { maxAge: 3600000, httpOnly: true });
    }
    return res.redirect("/");
  }
  if (!jwtToken) {
    req.flash("msg", "Något gick snett, försök igen.");
    return res.redirect("/login");
  }
};

module.exports = {
  loginRender,
  loginSubmit,
};
