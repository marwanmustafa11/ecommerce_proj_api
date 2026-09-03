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
        message: 'جميع الحقول الأساسية مطلوب إدخالها' 
      });
    }

    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(400).json({ 
        status: 'fail',
        message: 'البريد الإلكتروني مسجل بالفعل، يرجى تسجيل الدخول' 
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
 
const subject = 'رمز تفعيل الحساب (OTP)';
    const textMessage = `كود التحقق الخاص بك هو: ${otpCode}`;

    await sendEmail(email, subject, textMessage);
    return res.status(200).json({
      status: 'success',
      message: 'تم إنشاء كود التحقق وإرساله إلى البريد الإلكتروني بنجاح'
    });

  } catch (error) {
    console.error('Register Error:', error);
    return res.status(500).json({
      status: 'error',
      message: 'حدث خطأ في السيرفر أثناء إرسال كود التحقق',
      error: error.message
    });
  }
};