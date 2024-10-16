import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import User from '../models/user.js';
import { sendVerificationEmail } from '../utils/mailer.js';

// Registration with email verification
export const register = async (req, res) => {
  try {
    const { companyName, email, password, confirmPassword, phone } = req.body;

    // Check if all fields are provided
    if(password !== confirmPassword) {
      return res.status(400).json({ error: "Passwords don't match" });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser && existingUser.isVerified) {
      return res.status(400).json({ error: 'User already exists' });
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create a new user with a verification token
    const verificationToken = crypto.randomBytes(20).toString('hex');
    const user = new User({
      companyName,
      email,
      password: hashedPassword,
      phone,
      verificationToken,
    });

    await user.save();

    // Send verification email
    await sendVerificationEmail(user, verificationToken);

    res.status(201).json({ message: 'User registered. Please verify your email.' });
  } catch (error) {
    console.log("Error in signup controller", error.message);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Email verification
export const verifyEmail = async (req, res) => {
  try {
    const { token } = req.params;
    const user = await User.findOne({ verificationToken: token });

    if (!user) {
      return res.status(400).json({ error: 'Invalid or expired verification token' });
    }

    user.isVerified = true;
    user.verificationToken = null;
    await user.save();

    res.status(200).json({ message: 'Email verified successfully' });
  } catch (error) {
    console.log("Error in signup controller", error.message);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Login with JWT
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    if (!user.isVerified) {
      return res.status(403).json({ message: 'Please verify your email first' });
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Generate JWT token
    genToken(user._id, res);

    res.status(200).json({ message: 'Login successful', token });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Logout
export const logout = async (req, res) => {
  try {
    res.cookie("jwt", "", { maxAge: 0 });
    res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    console.log("Error in logout controller", error.message);
    res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
};
