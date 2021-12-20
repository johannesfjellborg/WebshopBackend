const bcrypt = require("bcrypt");
const { User, validateUser } = require("../model/user");
const nodemailer = require("nodemailer");
const crypto = require("crypto");

require("dotenv").config();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

const resetPasswordRender = async (req, res) => {
  res.render("resetPassword.ejs", {
    error: req.flash("msg"),
    shoppingCartItems: req.variables.shoppingCartItems,
    role: req.variables.role,
    loggedIn: req.variables.loggedIn,
  });
};

const resetPasswordSubmit = async (req, res) => {
  try {
    const email = req.body.email;

    const user = await User.findOne({ email: email });

    if (!user) {
      req.flash("msg", `Det finns ingen användare med emailadress ${email}.`);
      res.redirect("/resetpassword");
    }

    const token = crypto.randomBytes(32).toString("hex");

    user.token = token;
    user.tokenExpirationDate = Date.now() + 600000;

    await user.save();

    transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: user.email,
      subject: "Återställning av lösenord",
      html: `<h1>Återställning av lösenord</h1><p>Du har efterfågat om att få återställa ditt lösenord. Klicka <a href="http://localhost:3000/setpassword/${user.token}">här</a> för att göra det. Har du inte begärt att få återställa ditt lösenord kan du ignorera detta mejl.</p><p>Med vänliga hälsningar,</p><p>Teamet på Kändishälsningar</p>`,
    });
    return res.render("checkMail.ejs", {
      email: email,
      shoppingCartItems: req.variables.shoppingCartItems,
      role: req.variables.role,
      loggedIn: req.variables.loggedIn,
    });
  } catch (error) {
    req.flash("msg", "Ett fel har inträffat, försök igen.");
    return res.redirect("/resetpassword");
  }
};

const setPasswordRender = async (req, res) => {
  const token = req.params.token;

  try {
    const validUser = await User.findOne({
      token: token,
      tokenExpirationDate: { $gt: Date.now() },
    });

    if (!validUser) {
      req.flash(
        "msg",
        "Det har gått mer än 10 minuter sedan återställning av lösenord begärdes. Du måste göra om din begäran."
      );
      return res.redirect("/resetpassword");
    }

    return res.render("setPassword.ejs", {
      error: req.flash("msg"),
      token: token,
      email: validUser.email,
      name: validUser.name,
      shoppingCartItems: req.variables.shoppingCartItems,
      role: req.variables.role,
      loggedIn: req.variables.loggedIn,
    });
  } catch (error) {
    req.flash("msg", "Ett fel inträffade, var god och försök igen.");
    return res.redirect("/resetpassword");
  }
};

const setPasswordSubmit = async (req, res) => {
  const token = req.params.token;
  const { password, passwordConfirm, email, name } = req.body;

  try {
    const { error } = await validateUser(req.body);

    if (error) {
      req.flash("msg", error.details[0].message);
      return res.redirect("/setpassword/" + token);
    }

    const user = await User.findOne({ email: email });
    const salt = await bcrypt.genSalt(12);
    const hashedPassword = await bcrypt.hash(password, salt);

    user.password = hashedPassword;
    await user.save();

    return res.render("passwordChanged.ejs", {
      shoppingCartItems: req.variables.shoppingCartItems,
      role: req.variables.role,
      loggedIn: req.variables.loggedIn,
    });
  } catch (error) {
    req.flash("msg", "Ett fel inträffade, var god och försök igen.");
    return res.redirect("/setpassword/" + token);
  }
};

module.exports = {
  resetPasswordRender,
  resetPasswordSubmit,
  setPasswordRender,
  setPasswordSubmit,
};
