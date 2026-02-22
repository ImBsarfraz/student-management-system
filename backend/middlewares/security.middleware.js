import jwt from "jsonwebtoken";
import crypto from "crypto";
import { errorHandler } from "../utils/errorHandler.js";
import { privateKey } from "../config/keys.js";

export default (req, res, next) => {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
        return next(new errorHandler("No token", 401));
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.clientPublicKey = decoded.clientPublicKey;

        if (req.method === "GET") return next();

        const { encryptedKey, encryptedData, iv } = req.body;

        // ✅ CRITICAL FIX — SHA256 MUST BE SPECIFIED
        const aesKey = crypto.privateDecrypt(
            {
                key: privateKey,
                padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
                oaepHash: "sha256",
            },
            Buffer.from(encryptedKey, "base64")
        );

        const decipher = crypto.createDecipheriv(
            "aes-256-cbc",
            aesKey,
            Buffer.from(iv, "base64")
        );

        let decrypted = decipher.update(encryptedData, "base64", "utf8");
        decrypted += decipher.final("utf8");

        req.body = JSON.parse(decrypted);

        next();
    } catch (error) {
        console.log("SECURITY ERROR:", error.message);
        return res.status(401).json({ message: "Security validation failed" });
    }
};