import CryptoJS from "crypto-js"

/* ---------- RSA KEY GENERATION ---------- */

export const generateClientKeys = async () => {
    return await window.crypto.subtle.generateKey(
        {
            name: "RSA-OAEP",
            modulusLength: 2048,
            publicExponent: new Uint8Array([1, 0, 1]),
            hash: "SHA-256",
        },
        true,
        ["encrypt", "decrypt"]
    )
}

export const exportPublicKey = async (publicKey) => {
    const exported = await window.crypto.subtle.exportKey("spki", publicKey);
    return btoa(String.fromCharCode(...new Uint8Array(exported)));
}

/* ---------- ENCRYPT REQUEST ---------- */
export const encryptRequest = async (data, serverPublicKey) => {

    // 1️ Generate AES key using Web Crypto (SAFE)
    const aesKey = await window.crypto.subtle.generateKey(
        {
            name: "AES-CBC",
            length: 256,
        },
        true,
        ["encrypt"]
    );

    const iv = window.crypto.getRandomValues(new Uint8Array(16));

    // 2️ Encrypt data using AES
    const encodedData = new TextEncoder().encode(JSON.stringify(data));

    const encryptedDataBuffer = await window.crypto.subtle.encrypt(
        {
            name: "AES-CBC",
            iv: iv,
        },
        aesKey,
        encodedData
    );

    // 3️ Export AES key (raw) to encrypt with RSA
    const exportedAESKey = await window.crypto.subtle.exportKey(
        "raw",
        aesKey
    );

    // 4️ Import Server Public Key
    const cleanedKey = serverPublicKey
        .replace(/-----.*?-----/g, "")
        .replace(/\n/g, "");

    const binaryDer = window.atob(cleanedKey);
    const buffer = new ArrayBuffer(binaryDer.length);
    const view = new Uint8Array(buffer);

    for (let i = 0; i < binaryDer.length; i++) {
        view[i] = binaryDer.charCodeAt(i);
    }

    const importedServerKey = await window.crypto.subtle.importKey(
        "spki",
        buffer,
        { name: "RSA-OAEP", hash: "SHA-256" },
        false,
        ["encrypt"]
    );

    // 5️ Encrypt AES key using RSA
    const encryptedKey = await window.crypto.subtle.encrypt(
        { name: "RSA-OAEP" },
        importedServerKey,
        exportedAESKey
    );

    return {
        encryptedKey: btoa(String.fromCharCode(...new Uint8Array(encryptedKey))),
        encryptedData: btoa(
            String.fromCharCode(...new Uint8Array(encryptedDataBuffer))
        ),
        iv: btoa(String.fromCharCode(...iv)),
    };
};

/* ---------- DECRYPT RESPONSE ---------- */

export const decryptResponse = async (payload, privateKey) => {

    const encryptedKeyBytes = Uint8Array.from(
        atob(payload.encryptedKey),
        (c) => c.charCodeAt(0)
    );

    const decryptedAESKey = await window.crypto.subtle.decrypt(
        { name: "RSA-OAEP" },
        privateKey,
        encryptedKeyBytes
    );

    const aesKey = await window.crypto.subtle.importKey(
        "raw",
        decryptedAESKey,
        { name: "AES-CBC" },
        false,
        ["decrypt"]
    );

    const encryptedDataBytes = Uint8Array.from(
        atob(payload.encryptedData),
        (c) => c.charCodeAt(0)
    );

    const ivBytes = Uint8Array.from(
        atob(payload.iv),
        (c) => c.charCodeAt(0)
    );

    const decryptedData = await window.crypto.subtle.decrypt(
        {
            name: "AES-CBC",
            iv: ivBytes,
        },
        aesKey,
        encryptedDataBytes
    );

    return JSON.parse(new TextDecoder().decode(decryptedData));
};