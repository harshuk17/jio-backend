const express = require("express");
const userRouter = express.Router();
const {protectRouteMiddleWare} = require("../controllers/authController")
const {getCurrentUser,addToWishlist,getUserWishlist} = require("../controllers/userController")
// const protectedRouteMiddleware = require("../authRouter");

userRouter.use(protectRouteMiddleWare);
userRouter.get("/",getCurrentUser );
userRouter.post("/wishlist",addToWishlist);
userRouter.get("/wishlist",getUserWishlist);

module.exports= userRouter;