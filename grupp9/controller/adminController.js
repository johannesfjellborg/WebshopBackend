const Product = require("../model/product");
const { User } = require("../model/user");
const fs = require("fs");
const { promisify } = require("util");
const unlinkAsync = promisify(fs.unlink);

const addProductForm = async (req, res) => {
  const user = await User.findOne({ _id: req.user.user._id });
  res.render("addProduct.ejs", {
    msg: req.flash("msg"),
    shoppingCartItems: user.shoppingCart.length,
    role: user.role,
    loggedIn: true,
  });
};

const addProductFormSubmit = async (req, res) => {
  const path = req.get("referer");
  const { name, price, description, detailedDescription } = req.body;
  const image = req.file;
  if (!name || !price || !description || !detailedDescription || !image) {
    req.flash("msg", "Alla fält måste vara ifyllda.");
    return res.redirect(path);
  }
  const product = await new Product({
    name: name,
    price: price,
    description: description,
    detailedDescription: detailedDescription,
    image: "/uploads/" + req.file.filename,
  }).save();
  const user = await User.findOne({ _id: req.user.user._id });
  user.addToProductList(product._id);
  req.flash("msg", "Produkt tillagd.");
  res.redirect(path);
};

const showAdminProducts = async (req, res) => {
  const user = await User.findOne({ _id: req.user.user._id }).populate(
    "productList"
  );
  res.render("adminProducts.ejs", {
    products: user.productList,
    msg: req.flash("msg"),
    shoppingCartItems: user.shoppingCart.length,
    role: user.role,
    loggedIn: true,
  });
};

const editProductForm = async (req, res) => {
  const user = await User.findOne({ _id: req.user.user._id });
  const product = await Product.findOne({ _id: req.params.id });
  res.render("editProduct.ejs", {
    product: product,
    msg: req.flash("msg"),
    shoppingCartItems: user.shoppingCart.length,
    role: user.role,
    loggedIn: true,
  });
};

const editProductFormSubmit = async (req, res) => {
  const path = req.get("referer");
  const { name, price, description, detailedDescription } = req.body;
  if (!name || !price || !description || !detailedDescription) {
    req.flash("msg", "Alla fält måste vara ifyllda.");
    return res.redirect(path);
  }
  await Product.updateOne(
    { _id: req.params.id },
    {
      name: name,
      price: price,
      description: description,
      detailedDescription: detailedDescription,
    }
  );
  req.flash("msg", "Produkt uppdaterad.");
  res.redirect("/adminProducts");
};

const editImageForm = async (req, res) => {
  const user = await User.findOne({ _id: req.user.user._id });
  const product = await Product.findOne({ _id: req.params.id });
  res.render("editImage.ejs", {
    product: product,
    msg: req.flash("msg"),
    shoppingCartItems: user.shoppingCart.length,
    role: user.role,
    loggedIn: true,
  });
};

const editImageFormSubmit = async (req, res) => {
  const path = req.get("referer");
  const image = req.file;
  const product = await Product.findOne({ _id: req.params.id });
  if (!image) {
    req.flash("msg", "Du måste välja en bild att ladda upp.");
    return res.redirect(path);
  }

  await unlinkAsync("./public/" + product.image);

  await Product.updateOne(
    { _id: req.params.id },
    {
      image: "/uploads/" + req.file.filename,
    }
  );
  req.flash("msg", "Bild uppdaterad.");
  res.redirect("/adminProducts");
};

const deleteProduct = async (req, res) => {
  const user = await User.findOne({ _id: req.user.user._id }).populate(
    "productList"
  );

  const product = await Product.findById(req.params.id);

  await unlinkAsync("./public/" + product.image);

  user.removeFromProductList(req.params.id);

  await Product.deleteOne({ _id: req.params.id });

  req.flash("msg", "Produkt raderad.");
  res.redirect("/adminProducts");
};

module.exports = {
  addProductForm,
  addProductFormSubmit,
  showAdminProducts,
  editProductForm,
  editProductFormSubmit,
  editImageForm,
  editImageFormSubmit,
  deleteProduct,
};
