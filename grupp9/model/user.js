const mongoose = require("mongoose");
const joi = require("joi");

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, minLength: 3, maxLength: 50 },
  email: {
    type: String,
    required: true,
    unique: true,
    minLength: 7,
    maxLength: 255,
  },
  password: { type: String, required: true, minLength: 8, maxLength: 100 },
  role: { type: String, required: true, default: "customer" },
  token: String,
  tokenExpirationDate: Date,
  productList: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "product",
    },
  ],
  wishList: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "product",
    },
  ],
  shoppingCart: [
    {
      orderItem: {
        product: { type: mongoose.Schema.Types.ObjectId, ref: "product" },
        greeting: String,
      },
    },
  ],
});

userSchema.methods.addToProductList = function (productId) {
  this.productList.push(productId);
  this.save();
};

userSchema.methods.removeFromProductList = function (productId) {
  for (let i = 0; i < this.productList.length; i++) {
    if (this.productList[i]._id == productId) {
      this.productList.splice([i], 1);
    }
  }
  this.save();
};

userSchema.methods.addToWishList = function (productId) {
  this.wishList.push(productId);
  this.save();
};

userSchema.methods.removeFromWishList = function (productId) {
  for (let i = 0; i < this.wishList.length; i++) {
    if (this.wishList[i]._id == productId) {
      this.wishList.splice([i], 1);
    }
  }
  this.save();
};

userSchema.methods.checkWishList = function (productId) {
  for (let i = 0; i < this.wishList.length; i++) {
    if (this.wishList[i]._id == productId) {
      return true;
    }
  }
};

userSchema.methods.addToShoppingCart = function (productId) {
  this.shoppingCart.push({ orderItem: { product: productId } });
  this.save();
};

userSchema.methods.removeFromShoppingCart = function (productId) {
  for (let i = 0; i < this.shoppingCart.length; i++) {
    if (this.shoppingCart[i].orderItem.product == productId) {
      this.shoppingCart.splice([i], 1);
    }
  }
  this.save();
};

userSchema.methods.checkShoppingCart = function (productId) {
  for (let i = 0; i < this.shoppingCart.length; i++) {
    if (this.shoppingCart[i].orderItem.product == productId) {
      return true;
    }
  }
};

userSchema.methods.addGreeting = function (productId, greeting) {
  for (let i = 0; i < this.shoppingCart.length; i++) {
    if (this.shoppingCart[i].orderItem.product == productId) {
      this.shoppingCart[i].orderItem.greeting = greeting;
      this.save();
    }
  }
};

userSchema.methods.shoppingCartTotal = function () {
  let totalPrice = 0;
  for (let i = 0; i < this.shoppingCart.length; i++) {
    totalPrice += this.shoppingCart[i].orderItem.product.price;
  }
  return totalPrice;
};

function validateUser(user) {
  const schema = joi.object({
    name: joi.string().min(3).max(50).required().messages({
      "string.min": "Användarnamnet måste innehålla minst 3 tecken.",
      "string.max": "Användarnamnet måste innehålla mindre än 50 tecken.",
      "string.empty": "Du måste fylla i ett användarnamn.",
    }),
    email: joi.string().min(7).max(100).required().email().messages({
      "string.min": "Emailadressen måste innehålla minst 7 tecken.",
      "string.max": "Emailadressen får inte innehålla mer än 100 tecken.",
      "string.empty": "Du måste fylla i en emailadress.",
    }),
    password: joi
      .string()
      .pattern(
        new RegExp(
          /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/
        )
      )
      .messages({
        "string.pattern.base":
          "Lösenordet måste innehålla minst 8 tecken, minst en gemen, en versal, en siffra och ett specialtecken.",
          "string.empty": "Du måste fylla i ett lösenord.",
      }),
    passwordConfirm: joi.any().equal(joi.ref("password")).required().messages({
      "any.only": "Lösenorden måste matcha varandra, försök igen.",
      "string.empty": "Du måste fylla i ett lösenord.",
    }),
  });

  return schema.validate(user);
}

const User = mongoose.model("user", userSchema);

module.exports = { User, validateUser };
