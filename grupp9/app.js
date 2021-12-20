const express = require("express");
const app = express();
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const flash = require("connect-flash");
const sassMiddleware = require("node-sass-middleware");
const path = require("path");

const homeRouter = require("./routes/homeRoute");
const registerRouter = require("./routes/registerRoute");
const loginRouter = require("./routes/loginRoute");
const resetPasswordRouter = require("./routes/resetPasswordRoute");
const adminRouter = require("./routes/adminRoute");
const productRouter = require("./routes/productRoute");
const wishListRouter = require("./routes/wishListRoute");
const shoppingCartRouter = require("./routes/shoppingCartRoute");
const paymentRouter = require("./routes/paymentRoute");

require("dotenv").config();

app.set("view engine", "ejs");
app.use(cookieParser());
app.use(
  session({
    secret: "cookieMonstah",
    resave: true,
    saveUninitialized: true,
    cookie: { secure: false },
  })
);
app.use(flash());
app.use(
  sassMiddleware({
    src: path.join(__dirname, "scss"),
    dest: path.join(__dirname, "public", "style"),
    debug: true,
    outputStyle: "compressed",
    prefix: "/style",
  })
);
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

app.use(homeRouter);
app.use(registerRouter);
app.use(loginRouter);
app.use(resetPasswordRouter);
app.use(adminRouter);
app.use(productRouter);
app.use(wishListRouter);
app.use(shoppingCartRouter); 
app.use(paymentRouter);

mongoose.connect(
  process.env.DB_CONNECTION,
  { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true },
  (err) => {
    if (err) return;
    console.log("Connected to DB!");

    app.listen(3000, () => {
      console.log("Server up on port 3000");
    });
  }
);
