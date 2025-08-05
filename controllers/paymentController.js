const dotenv = require("dotenv");
const Razorpay = require("razorpay");  // Capitalized for clarity
const userModel = require("../model/userModel");
dotenv.config();

//  Razorpay instance created correctly
const razorpayInstance = new Razorpay({
  key_id: process.env.RAZORPAY_PUBLIC_KEY,
  key_secret: process.env.RAZORPAY_PRIVATE_KEY,
});

//  Payment controller to create order
const getPaymentController = async function (req, res) {
  try {
   

    const orderConfig = {
      amount: req.body.amount * 100, // amount in paise
      currency: "INR",
      receipt: "Receipt_ID_" + Date.now(),
    };

    //  Use the instance you created
    const order = await razorpayInstance.orders.create(orderConfig);

    res.status(200).json({
      status: "success",
      amount: order.amount,
      orderId: order.id,  // corrected to `order.id`
    });
  } catch (err) {
    res.status(500).json({
      message: "internal server error",
      error: err.message,
    });
  }
};

//  Premium access update logic
const updatePremiumAccessController = async function (req, res) {
  try {
    const email = req.body.email;

    //  Await the user lookup
    const user = await userModel.findOne({ email: email });
    if (!user) {
      return res.status(401).json({
        message: "Error! User not found",
        status: "failure",
      });
    }

    //  You already update below, no need to mutate `user.isPremium = true`
    await userModel.findOneAndUpdate(
      { email: email },
      { $set: { isPremium: true } },
      { new: true }
    );

    res.json({ message: { isPremium: true } });
  } catch (err) {
    res.status(401).json({
      message: "internal server error",
      error: err.message,
    });
  }
};

module.exports = {
  getPaymentController,
  updatePremiumAccessController,
};
