import 'dotenv/config';
import User from '../models/User.model.js';
import OTP from '../models/OTP.model.js';
import nodemailer from 'nodemailer';

// إعداد Nodemailer
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// 5️⃣ POST /register (Send OTP)
export const register = async (req, res) => {
  try {
    const { username, email, password, phone } = req.body;

    // 1. التحقق من استقبال وجودة البيانات الأساسية
    if (!username || !email || !password) {
      return res.status(400).json({ 
        status: 'fail',
        message: 'جميع الحقول الأساسية مطلوب إدخالها (username, email, password)' 
      });
    }

    // 2. التأكد أن الـ email غير مستخدم سابقاً في داتابيز المستخدمين
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(400).json({ 
        status: 'fail',
        message: 'البريد الإلكتروني مسجل بالفعل، يرجى تسجيل الدخول' 
      });
    }

    // 3. Generate OTP (إنشاء كود عشوائي مكون من 6 أرقام)
    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();

    // 4. حذف أي OTP قديم معلق لنفس الإيميل
    await OTP.deleteMany({ email: email.toLowerCase() });

    // 5. حفظ الـ OTP وبيانات المستخدم المؤقتة في داتابيز الـ OTP (تنتهي بعد 10 دقائق)
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

    // 6. إرسال الـ OTP بالإيميل باستخدام Nodemailer
    const mailOptions = {
      from: `"Ecommerce API" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'رمز تفعيل الحساب (OTP)',
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; border: 1px solid #eee; border-radius: 8px;">
          <h2 style="color: #333;">أهلاً بك ${username}،</h2>
          <p style="font-size: 16px;">شكراً لتسجيلك معنا. كود التحقق الخاص بك لتفعيل الحساب هو:</p>
          <h1 style="color: #4CAF50; letter-spacing: 4px;">${otpCode}</h1>
          <p style="color: #777; font-size: 14px;">هذا الكود صالِح لمدة 10 دقائق فقط.</p>
        </div>
      `
    };

    await transporter.sendMail(mailOptions);

    // 7. الرد بـ Status Code 200 عند النجاح
    return res.status(200).json({
      status: 'success',
      message: 'تم إنشاء كود التحقق وإرساله إلى البريد الإلكتروني بنجاح'
    });

  } catch (error) {
    console.error('Register Error:', error);
    // 8. التعامل مع أخطاء السيرفر (Status Code 500)
    return res.status(500).json({
      status: 'error',
      message: 'حدث خطأ في السيرفر أثناء إرسال كود التحقق',
      error: error.message
    });
  }
};