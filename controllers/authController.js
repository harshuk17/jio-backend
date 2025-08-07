 // const userModel = require("../usermodel")
const express= require("express");
const mongoose= require("mongoose");
const dotenv=require("dotenv");
const jwt= require("jsonwebtoken");
const cookieParser=require("cookie-parser");
const util = require("util");
const userModel=require("../model/userModel")
dotenv.config();
// *******CONVERTING JWT METHODS INTO ASYNC/AWAIT**************
const promisify = util.promisify;
const promisedJWTsign= promisify(jwt.sign);
const promisedJWTverify= promisify(jwt.verify);

const loginHandler= async function(req,res){
    try{
        const {email, password}=req.body;
        const user= await userModel.findOne({email});
        if(!user){
            return res.status(401).json({
                "message":"invalid email or password at backend",
                "status":"failure"
            })
        }
        const areEqual= password===user.password;
        if(!areEqual){
            return res.status(404).json({
                "message":"enter correct password",
                "status":"failure"
            })
        }
        const loginToken=await promisedJWTsign({id:user._id},process.env.JWT_SECRET_KEY);
        // console.log(loginToken);
        return res
        .cookie("jwtToken", loginToken, {
            httpOnly: true,
            maxAge: 1000 * 60 * 60 * 24, // 1 day
            secure:true
        })
        .status(200)
        .json({
            message: "login successfully",
            status: "success",
            user: user
        });
    }catch(err){
        return res.status(500).json({
            "message":"some unkown error occured at server",
            "error":err?.message,  
        })
    }
    
}
const signupHandler = async (req, res) => {
    try {
        // console.log("signupHandler is called");
        const {name, email, password ,confirmPassword} = req.body;
        
        if (!email || !password) {
            return res.status(400).json({
                message: "Required data missing",
                status: "failure"
            });
        }
        
        const user = await userModel.findOne({email});
        if (user) {
            // step-2- check if email is already registerd
            return res.status(409).json({
                message: "User is already registered with this email",
                status: "failure"
            });
        }
        
        // step-3- create new user
        const newUser = await userModel.create({name, email, password, confirmPassword});
        return res.status(201).json({
            message: "User created successfully",
            newUser,
            status: "success"
        });
    } catch (err) {
        return res.status(500).json({
            message: "Unknown error occurred on server",
            "error": err.message
        });
    }
};
// function for generating an OTP 
function generateSixDigitOTP() {
    // Generate a random number between 100000 (inclusive) and 999999 (inclusive)
    const otp = Math.floor(100000 + Math.random() * 900000);
    return otp;
}

const forgetPasswordHandler = async function(req,res){
    try{
        // step-1-fetch the email from user and check whether it exist in db or not 
        const email = req.body.email;
        // step-2-if not exist respond with user not present 
        if(req.body.email===undefined)
            {
                return res.status(401).json({
                    message:"enter the email ! Empty field not accepted",
                    status:"failure"
                })
            }
            const user = await userModel.findOne({email:email})
            if(!user){
                return res.status(401).json({
                    message:"user not found! Enter valid email",
                    status:"failure"
                })
            }
            // step-3-if present 
            //      >create an otp
            const myOTP = generateSixDigitOTP();
            user.otp=myOTP;
            user.otpExpiry=Date.now()+1000*60*10;
            // saving the otp and expiry date in the DB 
            await user.save({validateBeforeSave:false})
            //      >map token with user 
            // step-4-send an email
            const emailSender=require("../utility/dynamicEmailSender");
            // const otpTemplatePath = require.resolve("../template/otpTemplate.html");
            const templateData = {userName:user.name,otp:user.otp}
            await emailSender("./template/otpTemplate.html",email,templateData)
            // step-5-reset URL id 
            return res.status(200).json({
                message: "OTP sent to mail",
                otp: myOTP,  
                status: "success",
                resetURL:`https://localhost:3003/api/auth/resetPassword/${user._id}`,
            });
            
        }catch(err){
        res.status(500).json({
            message:"something went wrong in server",
            err:err.message,
            status:"failure",
        })
    }
}
const resetPasswordHandler = async function(req,res){
    try{
        // console.log("reset password is called in backend")
  
        const {email,password,confirmPassword,otp} = req.body;
      
        if (!email || !password || !confirmPassword || !otp) {
        return res.status(400).json({
        message: "All fields are required",
        status: "failure"
        });
        }
        if (password !== confirmPassword) {
        return res.status(400).json({
        message: "Passwords do not match",
        status: "failure"
        });
        }
        const user= await userModel.findOne({email});  
        
        if (!user) {
            return res.status(404).json({
                message: "No user found with this email",
                status: "failure"
            });
        }
        if (!user.otp) {
        return res.status(401).json({
        message: "OTP not present",
        status: "failure"
        });
        }

        if (user.otp !== otp) {
        return res.status(401).json({
        message: "OTP does not match",
        status: "failure"
        });
        }

        if(Date.now()>user.otpExpiry){
            return res.status(401).json({
                message:"OTP expired",
                status:"failure"
            })
        }

        user.password=password;
        user.confirmPassword=confirmPassword;
        // step-6-remove otp from DB 
        user.otp=undefined;
        user.otpExpiry=undefined;
        await user.save();
        res.status(200).json({
            message:"password reset succesfully",
            status:"success"
        })
        // step-7-re-route to login 
        
    }catch(err){
        console.error("Reset password error:", err);
        res.status(500).json({
            message:"internal server error",
            error:err?.message||err
        })
    }
}
const logoutHandler = async function(req,res){
    // console.log("logout in backend is called")
    res.cookie("jwtToken","",{
        maxAge: 0,
        httpOnly:true,
        path:"/",
        sameSite:"None",
        secure:true
    }).status(200).json({
        message:"logout succesfully",
        status:"success" 
    })
}
// MIDLEWARE
const protectRouteMiddleWare = async function (req, res, next) {
    try {
        // console.log("protect Route middleWare is called")
        let jwtToken = req.cookies.jwtToken;
        // console.log("jwt token in backend ",jwtToken);
        if (!jwtToken) throw new Error("UnAuthorized!");

        let decryptedToken = await promisedJWTverify(jwtToken, process.env.JWT_SECRET_KEY);

        if (decryptedToken) {
            let userId = decryptedToken.id;
            // adding the userId to the req object
            req.userId = userId;
            console.log("authenticated");
            next();
        }
    } catch (err) {
        res.status(500).json({
            message: err.message,
            status: "failure",
        });
    }
};

module.exports={
    loginHandler,
    signupHandler,
    forgetPasswordHandler,
    resetPasswordHandler,
    logoutHandler,
    protectRouteMiddleWare
}