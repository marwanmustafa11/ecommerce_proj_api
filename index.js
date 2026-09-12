import dotenv from "dotenv";
dotenv.config();

import express from "express";
import "./DB/mongoose.js";
import dns from "dns"; 
import cookieParser from "cookie-parser";
import loginRouter from "./routes/login.routes.js";
import forgotPasswordRouter from "./routes/forgotPassword.routes.js";
import authRoutes from "./routes/sendRegisterOTP.routes.js";
import verifyOtpRouter from "./routes/verifyRegisterOTP.routes.js";

import changePasswordRouter from "./routes/changePassword.routes.js";
import getProfileRouter from "./routes/getProfile.routes.js";
import updateProfileRouter from "./routes/updateProfile.routes.js";
import productRouter from "./routes/product.routes.js";

const app = express();

app.use(cookieParser());

app.use(express.json());

const PORT = process.env.PORT || 3000;

dns.setServers(["8.8.8.8", "8.8.4.4"]);
app.set("trust proxy", 1);

app.use("/auth", loginRouter);
app.use("/auth", forgotPasswordRouter);
app.use("/auth", authRoutes);
app.use("/auth", verifyOtpRouter);
app.use("/auth", changePasswordRouter);
app.use("/auth", getProfileRouter);
app.use("/users", updateProfileRouter);
app.use("/products", productRouter);


app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});