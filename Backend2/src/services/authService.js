const prisma = require('../prisma');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { generateOTP } = require('../utils/otpGenerator');
const { sendOTP } = require('../utils/mailer');

// Generate JWT token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

const signup = async (name, email, password) => {
  // Check if user exists
  const userExists = await prisma.user.findUnique({ where: { email } });
  if (userExists) {
    throw new Error('User already exists');
  }

  // Hash password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  // Create user
  const user = await prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
    },
  });

  return {
    id: user.id,
    name: user.name,
    email: user.email,
    token: generateToken(user.id),
  };
};

const login = async (email, password) => {
  // Find user by email
  const user = await prisma.user.findUnique({ where: { email } });

  if (user && (await bcrypt.compare(password, user.password))) {
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      token: generateToken(user.id),
    };
  } else {
    throw new Error('Invalid email or password');
  }
};

const forgotPassword = async (email) => {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    throw new Error('User not found');
  }

  // Generate OTP
  const otp = generateOTP();
  
  // Expiry time (10 minutes)
  const otpExpiry = new Date(Date.now() + 10 * 60 * 1000);

  // Save OTP in DB
  await prisma.user.update({
    where: { email },
    data: { otp, otpExpiry },
  });

  // Send email using Nodemailer utility
  try {
    await sendOTP(user.email, otp);
  } catch (error) {
    // Clear OTP fields if email fails
    await prisma.user.update({
      where: { email },
      data: { otp: null, otpExpiry: null },
    });
    throw new Error('Email could not be sent');
  }

  return { message: 'OTP sent to your email' };
};

const verifyOTP = async (email, otp) => {
  const user = await prisma.user.findUnique({ where: { email } });

  if (!user || user.otp !== otp || user.otpExpiry < new Date()) {
    throw new Error('Invalid or expired OTP');
  }

  return { message: 'OTP verified successfully' };
};

const resetPassword = async (email, newPassword) => {
  // Note: Assuming verifyOTP has already been called successfully or we check again
  const user = await prisma.user.findUnique({ where: { email } });

  if (!user) {
    throw new Error('User not found');
  }

  // Hash new password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(newPassword, salt);

  // Update password and clear OTP fields
  await prisma.user.update({
    where: { email },
    data: {
      password: hashedPassword,
      otp: null,
      otpExpiry: null,
    },
  });

  return { message: 'Password reset successful' };
};

module.exports = {
  signup,
  login,
  forgotPassword,
  verifyOTP,
  resetPassword,
};
