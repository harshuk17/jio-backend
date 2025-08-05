const express = require("express");
const paymentRouter = express.Router();

const { getPaymentController,
    updatePremiumAccessController} = require("../controllers/paymentController")

paymentRouter.post("/order",getPaymentController);
paymentRouter.patch("/update-premium-access",updatePremiumAccessController);

module.exports = paymentRouter;