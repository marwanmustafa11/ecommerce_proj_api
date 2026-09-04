import express from 'express';
import { register } from '../controllers/authController.js';
import { validateRegister } from '../middleware/validate.js';
import { registerSchema } from '../validation/auth.validation.js';

const router = express.Router();

// router.post('/register', validateRegister(registerSchema), register);
router.post('/register/send-otp', validateRegister(registerSchema), register);
// دة صح ودة صح بس اللي مكتوب في الملف هوالسطر التاني 

export default router;