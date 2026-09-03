import Joi from "joi";

export const registerSchema = Joi.object({
  username: Joi.string().min(3).max(30).required().messages({
    "any.required": "اسم المستخدم مطلوب",
    "string.empty": "اسم المستخدم لا يمكن أن يكون فارغاً"
  }),
  email: Joi.string().email().required().messages({
    "string.email": "يرجى إدخال بريد إلكتروني صحيح",
    "any.required": "البريد الإلكتروني مطلوب"
  }),
  password: Joi.string().min(6).required().messages({
    "string.min": "كلمة المرور يجب ألا تقل عن 6 أحرف",
    "any.required": "كلمة المرور مطلوبة"
  }),
  phone: Joi.string().optional()
});