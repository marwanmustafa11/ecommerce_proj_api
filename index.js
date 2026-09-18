import dotenv from "dotenv";
dotenv.config();

import express from "express";
import "./DB/mongoose.js";

import cors from 'cors';


import dns from "dns"; 
import path from "path";
import { fileURLToPath } from "url";
import cookieParser from "cookie-parser";
import loginRouter from "./routes/login.routes.js";
import forgotPasswordRouter from "./routes/forgotPassword.routes.js";
import authRoutes from "./routes/sendRegisterOTP.routes.js";
import verifyOtpRouter from "./routes/verifyRegisterOTP.routes.js";
import cartRoutes from "./routes/carts.routes.js"
import routerProduct from "./routes/product.routes.js";

import changePasswordRouter from "./routes/changePassword.routes.js";
import getProfileRouter from "./routes/getProfile.routes.js";
import updateProfileRouter from "./routes/updateProfile.routes.js";
import wishlistRoutes from "./routes/wishlist.routes.js";
import  adminRoutes  from "./routes/admin.users.routes.js";


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.use(cookieParser());

app.use(express.json());

// يخدم صفحة الفرونت اند من نفس الأوريجن بتاع الـ API
// (بيحل مشاكل الكوكيز/الـ CORS أثناء التجربة، وبيخليك تفتح http://localhost:PORT مباشرة)
app.use(express.static(path.join(__dirname, "frontend")));

const PORT = process.env.PORT || 3000;

dns.setServers(["8.8.8.8", "8.8.4.4"]);
app.set("trust proxy", 1);

app.use(cors({ origin: true, credentials: true }));

app.use("/auth", loginRouter);
app.use("/auth", forgotPasswordRouter);
app.use("/auth", authRoutes);
app.use("/auth", verifyOtpRouter);

app.use('/carts',cartRoutes)

app.use("/products", routerProduct);
app.use("/auth", changePasswordRouter);
app.use("/auth", getProfileRouter);
app.use("/users", updateProfileRouter);
app.use("/wishlist", wishlistRoutes);

app.use("/users",adminRoutes)
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});