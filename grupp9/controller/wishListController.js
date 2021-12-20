const { User } = require("../model/user");

const wishListRender = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.user.user.email }).populate(
      "wishList"
    );

    res.render("wishlist.ejs", {
      msg: req.flash("msg"),
      wishList: user.wishList,
      role: user.role,
      shoppingCartItems: user.shoppingCart.length,
      loggedIn: true,
    });
  } catch (error) {
    return res.render("wishlist.ejs", {
      msg: "Något gick snett, försök igen.",
      wishList: [],
      role: "customer",
      shoppingCartItems: 0,
      loggedIn: false,
    });
  }
};

const addToWishList = async (req, res) => {
  const productId = req.query.id;
  const path = req.get("referer");
  try {
    const user = await User.findOne({ email: req.user.user.email });

    if (!user) {
      req.flash("msg", "Vi kunde inte hitta din användare.");
      return res.redirect(path);
    }

    const existsInWishList = user.checkWishList(productId);

    if (existsInWishList) {
      req.flash("msg", "Produkten finns redan i dina favoriter.");
      return res.redirect(path);
    }

    await user.addToWishList(productId);
    req.flash("msg", "Produkten har lagts till i favoriter.");
    return res.redirect(path);
  } catch (error) {
    req.flash("msg", "Något gick snett, försök igen.");
    return res.redirect(path);
  }
};

const removeFromWishList = async (req, res) => {
  try {
    const wishListItem = req.params.id;
    const user = await User.findOne({ email: req.user.user.email }).populate(
      "wishList"
    );

    await user.removeFromWishList(wishListItem);
    
    res.redirect("/wishList");
  } catch (error) {
    req.flash("msg", "Något gick snett, försök igen.");
    return res.redirect("/wishList");
  }
};

module.exports = {
  wishListRender,
  addToWishList,
  removeFromWishList,
};
