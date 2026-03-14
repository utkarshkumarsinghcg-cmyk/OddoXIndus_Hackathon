const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const sendOTP = async (email, otp) => {
  const mailOptions = {
    from: `"Inventory System" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: 'Password Reset OTP',
    text: `Your OTP for password reset is: ${otp}\nThis OTP will expire in 10 minutes.`,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('OTP email sent successfully: %s', info.messageId);
    return info;
  } catch (error) {
    console.error('Error sending OTP email:', error);
    throw new Error('Failed to send OTP email');
  }
};

module.exports = { sendOTP };
