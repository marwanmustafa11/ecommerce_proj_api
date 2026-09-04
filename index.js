import "dotenv/config";
import express from "express";
import "./DB/mongoose.js";
import dns from "dns"
import loginRouter from "./routes/login.routes.js";

const app = express();

app.use(express.json());


const PORT = process.env.PORT || 3000;

dns.setServers(["8.8.8.8" , "8.8.4.4"]);
app.set("trust proxy" , 1);

import forgotPasswordRouter from "./routes/forgotPassword.routes.js"; 
/*
هاتلي الـ default export من الملف ده، وأنا هسميه عندي في الملف الحالي forgotPasswordRouter.
*/

app.use("/auth", loginRouter);
app.use("/auth", forgotPasswordRouter);

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});