import React, { createContext, useEffect, useState } from "react";
import { exportPublicKey, generateClientKeys } from "../services/cryptoService";
import api from "../api/axiosInstance";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [clientPrivateKey, setClientPrivateKey] = useState(null);
    const [serverPublicKey, setServerPublicKey] = useState("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        initAuth();
    }, []);

    const initAuth = async () => {
        const keys = await generateClientKeys();
        const publicKeyBase64 = await exportPublicKey(keys.publicKey);

        const tokenRes = await api.post("/auth/token", {
            client_id: "system_client",
            client_secret: "supersecretclient",
            clientPublicKey: publicKeyBase64
        });

        localStorage.setItem("token", tokenRes.data.access_token);
        setClientPrivateKey(keys.privateKey);

        const serverKey = await api.get("/auth/public-key");
        setServerPublicKey(serverKey.data);

        setLoading(false);
    }

    return (
        <AuthContext.Provider
            value={{ clientPrivateKey, serverPublicKey, loading }}
        >
            {children}
        </AuthContext.Provider>
    )
}