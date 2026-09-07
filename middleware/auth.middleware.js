import jwt from "jsonwebtoken";
import User from "../models/User.model.js";

// =====================================================
// protect Middleware
// =====================================================
// وظيفة protect:
//
// 1️⃣ يجيب الـ Token من Cookie
// 2️⃣ يتأكد إن الـ Token موجود
// 3️⃣ يعمل Verify للـ JWT
// 4️⃣ يجيب User ID من الـ Token
// 5️⃣ يبحث عن الـ User في Database
// 6️⃣ يحط الـ User في req.user
// 7️⃣ يسمح للـ Request يكمل
// =====================================================

export const protect = async (req, res, next) => {
  try {

    // 1️⃣ الحصول على الـ Token من Cookie
    //
    // Login بيخزن الـ Token باسم "token"
    //
    // res.cookie("token", token, {...})
    
    const token = req.cookies.token;

    // 2️⃣ التأكد إن الـ Token موجود
    if (!token) {
      return res.status(401).json({
        message: "Authentication required",
      });
    }

    // 3️⃣ التحقق من الـ JWT
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    // 4️⃣ الـ Login عندكم بيحط الـ ID باسم _id
    //
    // payload:
    // {
    //   _id: user._id.toString(),
    //   role: user.role
    // }

    const user = await User.findById(decoded._id);

    // 5️⃣ التأكد إن الـ User موجود
    if (!user) {
      return res.status(401).json({
        message: "User not found",
      });
    }

    // 6️⃣ تخزين الـ User داخل req
    //
    // أي Controller بعد protect
    // يقدر يستخدم req.user

    req.user = user;

    // 7️⃣ السماح للـ Request يكمل
    next();

  } catch (error) {

    // لو الـ Token:
    // - غلط
    // - منتهي
    // - متعدل
    // - غير صالح

    return res.status(401).json({
      message: "Invalid or expired token",
    });
  }
};