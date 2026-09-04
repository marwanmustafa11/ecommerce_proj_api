import 'dotenv/config';
import User from '../models/User.model.js';
import OTP from '../models/OTP.model.js';
import sendEmail from '../utils/sendEmail.js';

// POST /register (Send OTP)

export const register = async (req, res) => {
  try {
    const { username, email, password, phone } = req.body;
    if (!username || !email || !password) {
      return res.status(400).json({ 
        status: 'fail',
        message: 'All required fields must be filled in.' 
      });
    }

    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(400).json({ 
        status: 'fail',
        message: 'Email is already registered, please log in' 
      });
    }

    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();

    await OTP.deleteMany({ email: email.toLowerCase() });

    await OTP.create({
      email: email.toLowerCase(),
      otp: otpCode,
      expiresAt: new Date(Date.now() + 10 * 60 * 1000), // 10 دقائق
      userData: { 
        username, 
        email: email.toLowerCase(), 
        password, 
        phone 
      }
    });
 
const subject = 'Account Activation OTP';
    const textMessage = `Your verification code is: ${otpCode}`;

    await sendEmail(email, subject, textMessage);
    return res.status(200).json({
      status: 'success',
      message: 'Verification code created and sent to your email address successfully'
    });

  } catch (error) {
    console.error('Register Error:', error);
    return res.status(500).json({
      status: 'error',
      message: 'An error occurred on the server while sending the verification code',
      error: error.message
    });
  }
};