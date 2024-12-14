const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const User = require('../models/userModel');

// Configure Nodemailer
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Generate OTP
const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString();

// Send OTP Email
const sendEmail = async (email, subject, text) => {
  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: email,
    subject,
    text,
  });
};

// Register User
exports.registerUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: 'User already exists.' });

    const hashedPassword = await bcrypt.hash(password, 10);
    const otp = generateOTP();

    const newUser = new User({
      email,
      password: hashedPassword,
      otp,
      otpExpiry: Date.now() + 10 * 60 * 1000, // OTP valid for 10 minutes
    });

    await newUser.save();
    await sendEmail(email, 'Verify Your Account', `Your OTP is ${otp}`);
    res.status(200).json({ message: 'Registration successful! Please verify your account.' });
  } catch (error) {
    res.status(500).json({ message: 'Error registering user.', error });
  }
};

// Verify OTP
exports.verifyOTP = async (req, res) => {
  const { email, otp } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'User not found.' });

    if (user.otp !== otp || user.otpExpiry < Date.now())
      return res.status(400).json({ message: 'Invalid or expired OTP.' });

    user.isVerified = true;
    user.otp = undefined;
    user.otpExpiry = undefined;
    await user.save();

    res.status(200).json({ message: 'Account verified successfully!' });
  } catch (error) {
    res.status(500).json({ message: 'Error verifying OTP.', error });
  }
};

// Login User
exports.loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'User not found.' });

    if (!user.isVerified) return res.status(400).json({ message: 'Please verify your account first.' });

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) return res.status(400).json({ message: 'Invalid credentials.' });

    const otp = generateOTP();
    user.otp = otp;
    user.otpExpiry = Date.now() + 10 * 60 * 1000; // OTP valid for 10 minutes
    await user.save();

    await sendEmail(email, 'Login OTP', `Your OTP is ${otp}`);
    res.status(200).json({ message: 'OTP sent to your email.' });
  } catch (error) {
    res.status(500).json({ message: 'Error logging in.', error });
  }
};

// Forgot Password
exports.forgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'User not found.' });

    const otp = generateOTP();
    user.otp = otp;
    user.otpExpiry = Date.now() + 10 * 60 * 1000; // OTP valid for 10 minutes
    await user.save();

    await sendEmail(email, 'Password Reset OTP', `Your OTP is ${otp}`);
    res.status(200).json({ message: 'OTP sent to your email.' });
  } catch (error) {
    res.status(500).json({ message: 'Error processing request.', error });
  }
};

// Reset Password
exports.resetPassword = async (req, res) => {
  const { email, otp, newPassword } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'User not found.' });

    if (user.otp !== otp || user.otpExpiry < Date.now())
      return res.status(400).json({ message: 'Invalid or expired OTP.' });

    user.password = await bcrypt.hash(newPassword, 10);
    user.otp = undefined;
    user.otpExpiry = undefined;
    await user.save();

    res.status(200).json({ message: 'Password reset successfully!' });
  } catch (error) {
    res.status(500).json({ message: 'Error resetting password.', error });
  }
};
