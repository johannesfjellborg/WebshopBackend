const bcrypt = require("bcrypt");
const { User, validateUser } = require("../model/user");

const registerRender = async (req, res) => {
    res.render("register.ejs", {
      error: req.flash("msg"),
      shoppingCartItems: req.variables.shoppingCartItems,
      role: req.variables.role,
      loggedIn: req.variables.loggedIn,
    });
};

const registerSubmit = async (req, res) => {
  const { name, email, password, passwordConfirm } = req.body;

  try {
    const { error } = await validateUser(req.body);

    if (error) {
      req.flash("msg", error.details[0].message);
      return res.redirect("/register");
    }

    const salt = await bcrypt.genSalt(12);
    const hashedPassword = await bcrypt.hash(password, salt);

    await new User({
      name: name,
      email: email,
      password: hashedPassword,
    }).save();

    req.flash("msg", "Din användare är skapad.");
    res.redirect("/login");
  } catch (error) {
    req.flash("msg", "Vi kunde inte registrera din användare, försök igen.");
    return res.redirect("/register");
  }
};

module.exports = { registerRender, registerSubmit };
