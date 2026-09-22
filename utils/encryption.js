import crypto from "crypto";

const algorithm = "aes-256-gcm";   
const key = Buffer.from(process.env.ENCRYPTION_KEY, "hex");  

const encrypt = (text) => {
    const iv = crypto.randomBytes(16);  

    const cipher = crypto.createCipheriv(algorithm, key, iv);  

    let encrypted = cipher.update(text, "utf8", "hex"); 
    encrypted += cipher.final("hex");  

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