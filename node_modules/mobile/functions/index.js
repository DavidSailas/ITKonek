const functions = require("firebase-functions");
const nodemailer = require("nodemailer");

// 1️⃣ Create transporter for Gmail
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "villondo.jmsoneit@gmail.com", // your Gmail
    pass: "apmg snfq kupi nral",   // App password from Step 1
  },
});

// 2️⃣ Send welcome email when a user signs up
exports.sendWelcomeEmail = functions.auth.user().onCreate(async (user) => {
  const mailOptions = {
    from: '"ITKonek" <yourgmail@gmail.com>', // sender info
    to: user.email,                           // new user's email
    subject: "Welcome to ITKonek!",           // professional subject
    html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.5; color: #333;">
        <div style="text-align: center; margin-bottom: 20px;">
          <img src="https://yourapp.com/logo.png" alt="ITKonek Logo" width="100"/>
        </div>
        <h2 style="color: #1a73e8;">Welcome to ITKonek!</h2>
        <p>Hi ${user.displayName || ""},</p>
        <p>Your account has been successfully created. We're excited to have you on board!</p>
        <p>Here’s what you can do next:</p>
        <ul>
          <li>Explore our services</li>
          <li>Manage your profile</li>
          <li>Start submitting requests</li>
        </ul>
        <p style="margin-top: 20px;">Thank you,<br/><strong>The ITKonek Team</strong></p>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log("Welcome email sent to:", user.email);
  } catch (error) {
    console.error("Error sending welcome email:", error);
  }
});