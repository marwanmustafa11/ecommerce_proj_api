import express from 'express';
import { register } from '../controllers/authController.js';

const router = express.Router();

// المسار القياسي والمسار المذكور بملف الأكاديمية
router.post('/register', register);
router.post('/register/send-otp', register);

export default router;