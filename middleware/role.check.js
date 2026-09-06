// =====================================================
// adminOnly Middleware
// =====================================================
// بيتأكد إن الـ User اللي عامل Login هو Admin
//
// مهم:
// لازم adminOnly تيجي بعد protect
// لأن protect هي اللي بتحط User داخل req.user
// =====================================================

export const adminOnly = (req, res, next) => {

  // التأكد إن المستخدم Admin
  if (req.user.role !== "admin") {
    return res.status(403).json({
      message: "Admin access required",
    });
  }

  // المستخدم Admin → كمل
  next();
};