import 'dotenv/config'; // بديل require('dotenv').config()
import './DB/mongoose.js'; // لازم تكمل امتداد .js في النهاية
import express from 'express';
import authRoutes from './routes/authRoutes.js';

const app = express();

// Middleware لقراءة الـ JSON
app.use(express.json());

// Routes
app.use('/api/v1/auth', authRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});