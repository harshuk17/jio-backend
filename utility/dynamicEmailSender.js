const nodemailer = require('nodemailer');
const dotenv = require("dotenv");
const fs = require("fs");
dotenv.config();

// Function to update placeholders in HTML template
async function updateTemplerHandler(templatePath, toReplaceObject) {
  let templateContent = await fs.promises.readFile(templatePath, "utf-8");

  const keyArrs = Object.keys(toReplaceObject);
  keyArrs.forEach((key) => {
    const regex = new RegExp(`{{\\s*${key}\\s*}}`, "g"); // handles {{ key }} and {{key}}
    templateContent = templateContent.replace(regex, toReplaceObject[key]);
  });

  return templateContent;
}



// Function to send email
async function emailSender(templatePath, recieverEmail, toReplaceObject) {
  try {
    const content = await updateTemplerHandler(templatePath, toReplaceObject);

    const transporter = nodemailer.createTransport({
      host: 'smtp.sendgrid.net',
      port: 587,
      secure: false,
      auth: {
        user: 'apikey',
        pass: process.env.SENDGRID_API_KEY
      }
    });

    const mailOptions = {
      from: 'harshdeveloper28@gmail.com',
      to: recieverEmail,
      subject: 'Your OTP Verification',
      text: 'Verify your OTP',
      html: content
    };

    const emailStatus = await transporter.sendMail(mailOptions);
    if (emailStatus.accepted.length > 0) {
      console.log("✅ Email sent successfully!");
    } else {
      console.log("❌ Email not accepted.");
    }

  } catch (err) {
    console.log("❌ Email not sent due to error:", err);
  }
}

// // Replace variables in HTML template
// const toReplaceObject = {
//   userName: "Harsh",
//   otp: "123456"
// };

// // Trigger email send
// emailSender("../template/otpTemplate.html", "harshdhiman8410@gmail.com", toReplaceObject);

// exporting the file so that we can use functionality of this file into other files 
module.exports = emailSender;
