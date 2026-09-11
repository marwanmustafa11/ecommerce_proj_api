import crypto from "crypto";

const algorithm = "aes-256-gcm";  //طريقه التشفير اللي هستخدمها
const key = Buffer.from(process.env.ENCRYPTION_KEY, "hex"); // هات المفتاح اللي مكتوب فال انفايرومينت و استعمله كنص هيكس و حوله بافير علشان يحتوي على بايت علشان الكريبتو يقدر يستعمله

const encrypt = (text) => {
    const iv = crypto.randomBytes(16); //نص عشوائي

    const cipher = crypto.createCipheriv(algorithm, key, iv); //يا كريبتز اعملي اداه تشفير باستخدام التلاته دول و خزنهالي في المتغير دا 

    let encrypted = cipher.update(text, "utf8", "hex"); //الـ text اللي داخل ده نص UTF-8.
    encrypted += cipher.final("hex"); //الناتج المشفّر اللي خارج، مثّله كـ Hex.

    const authTag = cipher.getAuthTag();

    return `${iv.toString("hex")}:${authTag.toString("hex")}:${encrypted}`;
};

const decrypt = (encryptedText) => {
    const [ivHex, authTagHex, encrypted] = encryptedText.split(":");

    const iv = Buffer.from(ivHex, "hex");
    const authTag = Buffer.from(authTagHex, "hex");

    const decipher = crypto.createDecipheriv(algorithm, key, iv);

    decipher.setAuthTag(authTag);

    let decrypted = decipher.update(encrypted, "hex", "utf8");
    decrypted += decipher.final("utf8");

    return decrypted;
};

export {
    encrypt,
    decrypt
};