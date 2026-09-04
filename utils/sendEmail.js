import nodemailer from "nodemailer";
// SMTP = Simple Mail Transfer Protocol
const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST, // هكلم أنهي Mail Server
    port: process.env.EMAIL_PORT,
    secure: false,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    }
});
// 465 → secure: true
// 587 → secure: false
const sendEmail = async (to, subject, text) => {

    await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to,
        subject,
        text,
    });

};

export default sendEmail;