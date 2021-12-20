const { User } = require("../model/user");

const shoppingCartRender = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.user.user.email }).populate(
      "shoppingCart.orderItem.product"
    );

    const totalPrice = user.shoppingCartTotal();

    return res.render("shoppingCart.ejs", {
      error: req.flash("msg"),
      shoppingCart: user.shoppingCart,
      totalPrice: totalPrice,
      shoppingCartItems: user.shoppingCart.length,
      role: user.role,
      loggedIn: true,
    });
  } catch (error) {
    return res.render("shoppingCart.ejs", {
      error: error,
      shoppingCart: [],
      totalPrice: 0,
      shoppingCartItems: 0,
      role: "customer",
      loggedIn: true,
    });
  }
};

const addToShoppingCart = async (req, res) => {
  const productId = req.query.id;
  const path = req.get("referer");
  try {
    const user = await User.findOne({ email: req.user.user.email });

    const existsInShoppingCart = user.checkShoppingCart(productId);

    if (existsInShoppingCart) {
      req.flash("msg", "Produkten finns redan i din varukorg.");
      return res.redirect(path);
    }

    user.addToShoppingCart(productId);
    req.flash("msg", "Produkten har lagts till i din varukorg.");
    return res.redirect(path);
  } catch (error) {
    req.flash("msg", error);
    return res.redirect(path);
  }
};

const removeFromShoppingCart = async (req, res) => {
  try {
    const shoppingCartItem = req.params.id;
    const user = await User.findOne({ email: req.user.user.email }).populate(
      "shoppingCart"
    );

    await user.removeFromShoppingCart(shoppingCartItem);

    return res.redirect("/shoppingCart");
  } catch (error) {
    req.flash("msg", "Någonting gick snett, försök igen.");
    return res.redirect("/shoppingCart");
  }
};

const successRender = async (req, res) => {
  const user = await User.findOne({ email: req.user.user.email });
  res.render("success.ejs", { user: user });
};

module.exports = {
  shoppingCartRender,
  addToShoppingCart,
  removeFromShoppingCart,
  successRender,
};
