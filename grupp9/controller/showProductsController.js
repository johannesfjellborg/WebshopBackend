const Products = require("../model/product");

const showProduct = async (req, res) => {
  try {
    const page = +req.query.page || 1;
    const totalProducts = await Products.find().countDocuments();
    const productsToShow = 6;
    const totalPages = Math.ceil(totalProducts / productsToShow);
    const totalProductsShowing = productsToShow * page;
    const products = await Products.find().limit(totalProductsShowing);

    res.render("productpage.ejs", {
      msg: req.flash("msg"),
      products: products,
      totalProducts,
      productsToShow,
      totalPages,
      totalProductsShowing,
      shoppingCartItems: req.variables.shoppingCartItems,
      role: req.variables.role,
      loggedIn: req.variables.loggedIn,
    });
  } catch (error) {
    return res.render("productpage.ejs", {
      msg: "Vi kunde inte hämta några produkter, försök igen.",
      products: [],
      totalProducts,
      productsToShow,
      totalPages,
      totalProductsShowing,
      shoppingCartItems: req.variables.shoppingCartItems,
      role: req.variables.role,
      loggedIn: req.variables.loggedIn,
    });
  }
};

const showProductDetails = async (req, res) => {
  const product = await Products.findOne({ _id: req.params.id });
  res.render("productDetails.ejs", {
    product: product,
    msg: req.flash("msg"),
    shoppingCartItems: req.variables.shoppingCartItems,
    role: req.variables.role,
    loggedIn: req.variables.loggedIn,
  });
};

module.exports = {
  showProduct,
  showProductDetails,
};
