const jwt = require("jsonwebtoken");
require("dotenv").config();

const verifyTokenAdmin = (req, res, next) => {
  const token = req.cookies.jwtToken;
  if (!token) return res.render("login.ejs", { error: "Du måste logga in!", shoppingCartItems: 0, role: "customer", loggedIn: false });
  const validUser = jwt.verify(token, process.env.SECRET_KEY);
  if (validUser.user.role === "customer")
    return res.render("login.ejs", { error: "Du är inte admin!", shoppingCartItems: 0, role: "customer", loggedIn: false });
  if (validUser.user.role) {
    req.user = validUser;
  }
  next();
};

module.exports = verifyTokenAdmin;