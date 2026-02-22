import crypto from "crypto";

export default (data, clientPublicKey, res) => {

  const aesKey = crypto.randomBytes(32);
  const iv = crypto.randomBytes(16);

  const cipher = crypto.createCipheriv("aes-256-cbc", aesKey, iv);

  let encryptedData = cipher.update(
    JSON.stringify(data),
    "utf8",
    "base64"
  );
  encryptedData += cipher.final("base64");

  // Convert base64 SPKI public key into buffer
  const publicKeyBuffer = Buffer.from(clientPublicKey, "base64");

  const encryptedKey = crypto.publicEncrypt(
    {
      key: publicKeyBuffer,
      format: "der",
      type: "spki",
      padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
      oaepHash: "sha256",   // 🔥 MUST MATCH FRONTEND
    },
    aesKey
  );

  res.json({
    encryptedKey: encryptedKey.toString("base64"),
    encryptedData,
    iv: iv.toString("base64"),
  });
};