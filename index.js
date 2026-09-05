import dotenv from "dotenv";
dotenv.config();

import express from "express";
import "./DB/mongoose.js";
import dns from "dns";

import loginRouter from "./routes/login.routes.js";
import forgotPasswordRouter from "./routes/forgotPassword.routes.js";
import authRoutes from "./routes/authRoutes.js";
import verifyOtpRouter from "./routes/verifyOtp.routes.js";

const app = express();

app.use(express.json());

const PORT = process.env.PORT || 3000;

dns.setServers(["8.8.8.8", "8.8.4.4"]);
app.set("trust proxy", 1);

app.use("/auth", loginRouter);
app.use("/auth", forgotPasswordRouter);
app.use("/auth", authRoutes);
app.use("/auth", verifyOtpRouter);

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});