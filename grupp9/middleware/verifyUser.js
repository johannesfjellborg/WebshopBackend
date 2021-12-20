const jwt = require("jsonwebtoken");
require("dotenv").config();

const verifyToken = (req, res, next)=> {
    const token = req.cookies.jwtToken;
    if(!token) return res.render("login.ejs", {error: "Du är inte inloggad", shoppingCartItems: 0, role: "customer", loggedIn: false})
    const validUser = jwt.verify(token, process.env.SECRET_KEY) 
    if(validUser) {
        req.user = validUser
    }
   next();
}

module.exports = verifyToken