const { User } = require("../model/user");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const nodemailer = require("nodemailer");
require("dotenv").config();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

const checkout = async (req, res) => {
  const productId = req.params.id;
  const email = req.user.user.email;
  const user = await User.findOne({ email: email }).populate(
    "shoppingCart.orderItem.product"
  );
  let cartItem = {};

  if(!user.shoppingCart || user.shoppingCart.length === 0)
    return res.redirect("/products");

  user.shoppingCart.map((orderItem) => {
    if(orderItem.orderItem.product.id == productId) return cartItem = orderItem.orderItem.product;
  });


  const session = await stripe.checkout.sessions.create({
    success_url: "http://localhost:3000/checkoutSuccess/" + productId,
    cancel_url: "http://localhost:3000/checkout/" + productId,
    payment_method_types: ["card"],
    customer_email: email,
    line_items: [
      {
        name: "Personlig hälsning från" + " " + cartItem.name,
        amount: cartItem.price * 100,
        quantity: 1,
        currency: "sek",
      }
    ],
    mode: "payment",
  });

  res.render("greetingForm.ejs", {
    error: "",
    cartItem: cartItem,
    shoppingCartItems: user.shoppingCart.length,
    role: user.role,
    loggedIn: true,
    sessionId: session.id,
  });
};

const addGreeting = async (req, res) => {
  try {
    const productId = req.params.id;
    const greeting = req.body.greeting;
    const user = await User.findOne({ email: req.user.user.email });

    await user.addGreeting(productId, greeting);
    return console.log("Greeting saved!");
  } catch (error) {
    return res.render("greetingForm.ejs", {
      error: error,
      shoppingCart: [],
      shoppingCartItems: 0,
      role: "customer",
      loggedIn: false,
    });
  }
};

const checkoutSuccess = async (req, res) => {
  const productId = req.params.id;
  const email = req.user.user.email;
  const user = await User.findOne({ email: email }).populate(
    "shoppingCart.orderItem.product"
  );
  if (!user.shoppingCart || user.shoppingCart.length === 0)
    return res.redirect("/products");
  
  let cartItem = {};

  user.shoppingCart.map((orderItem) => {
    if(orderItem.orderItem.product.id == productId) return cartItem = orderItem.orderItem.product;
  });

  const cart = await User.findOne({ email: req.user.user.email }).populate(
    "shoppingCart"
  );
  await cart.removeFromShoppingCart(productId);

  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Orderbekräftelse",
    html:
      `<h1>Tack för din beställning ${user.name}!</h1><h4>Din beställning är mottagen och skickas inom 2-5 dagar. Du har köpt:<br></h4>
      <div>
      <table>
      <tr>
        <td>
          ${cartItem.name}
        </td>
        <td>
          ${cartItem.description}
        </td>
        <td>
          ${cartItem.price} kr
        </td>
      </tr>
      </table>
      </div>
      <p>Med vänliga hälsningar,</p><p>Teamet på Kändishälsningar</p>`,
  });

  res.render("checkoutSuccess.ejs", {
    user: user,
    shoppingCart: user.shoppingCart,
    shoppingCartItems: cart.shoppingCart.length,
    role: user.role,
    loggedIn: true,
  });
};

module.exports = {
  checkout,
  checkoutSuccess,
  addGreeting,
};
