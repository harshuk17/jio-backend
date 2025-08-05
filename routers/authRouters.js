const express = require("express");
const {   
        loginHandler,
        signupHandler,
        forgetPasswordHandler,
        resetPasswordHandler,
        logoutHandler
} = require("../controllers/authController")

const authRouter = express.Router();

authRouter.post("/login",loginHandler);
authRouter.post("/signup",signupHandler);
authRouter.patch("/forgetPassword",forgetPasswordHandler);
authRouter.patch("/resetPassword",resetPasswordHandler);
authRouter.post("/logout",logoutHandler);

module.exports = authRouter;