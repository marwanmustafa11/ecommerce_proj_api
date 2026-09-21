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
import logoutRouter from "./routes/logout.routes.js";

import changePasswordRouter from "./routes/changePassword.routes.js";
import getProfileRouter from "./routes/getProfile.routes.js";
import updateProfileRouter from "./routes/updateProfile.routes.js";
import wishlistRoutes from "./routes/wishlist.routes.js";

import  adminRoutes  from "./routes/admin.users.routes.js";
import revenueRouter from "./routes/revenue.routes.js";

 

import dashboardRouter from "./routes/admin.dashboard.routes.js";
import { handleStripeWebhook } from "./controllers/order.webhook.controller.js";

import orderRoutes from "./routes/orders.routes.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.use(cookieParser());

app.post(
  "/orders/webhook",
  express.raw({ type: "application/json" }),
  handleStripeWebhook
);


app.use(express.json());
app.use(express.static(path.join(__dirname, "frontend")));

const PORT = process.env.PORT || 3000;

dns.setServers(["8.8.8.8", "8.8.4.4"]);
app.set("trust proxy", 1);

app.use(cors({ origin: true, credentials: true }));

app.use("/auth", loginRouter);
app.use("/auth", forgotPasswordRouter);
app.use("/auth", authRoutes);
app.use("/auth", verifyOtpRouter);
app.use("/auth", logoutRouter);

app.use('/carts',cartRoutes)

app.use("/products", routerProduct);
app.use("/auth", changePasswordRouter);
app.use("/auth", getProfileRouter);
app.use("/users", updateProfileRouter);
app.use("/wishlist", wishlistRoutes);
app.use("/users",adminRoutes);
app.use("/admin", revenueRouter);
app.use("/orders", orderRoutes);
app.use("/admin/dashboard", dashboardRouter);

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

