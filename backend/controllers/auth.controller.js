import jwt from "jsonwebtoken"
import { errorHandler } from "../utils/errorHandler.js";
import { publicKey } from "../config/keys.js";

export const getToken = (req, res, next) => {
    const { client_id, client_secret, clientPublicKey } = req.body;

    if (
        client_id !== process.env.CLIENT_ID ||
        client_secret !== process.env.CLIENT_SECRET
    ) {
        return next(new errorHandler("Invalid client credentials", 401));
    }

    const token = jwt.sign(
        { client: client_id, clientPublicKey },
        process.env.JWT_SECRET,
        { expiresIn: "1d" }
    );

    res.json({ access_token: token });
}

export const getPublicKey = (_, res) => {
    res.send(publicKey.export({ type: "spki", format: "pem" }));
};