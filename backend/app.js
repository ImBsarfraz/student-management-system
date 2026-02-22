import express from "express"
import cors from "cors"
import dotenv from "dotenv"
import { dbConnection } from "./config/db.js";
import { errorHandlingMiddleware } from "./middlewares/errorHandlingMiddleware.js";
import authRoutes from "./routes/auth.routes.js"
import studentRoutes from "./routes/students.routes.js"

dotenv.config();
dbConnection();

const SERVER = process.env.PORT || 5000;

const app = express();

app.use(express.json());
app.use(cors());

app.use("/api/v1", authRoutes);
app.use("/api/v1", studentRoutes);

// error handling middleare
app.use(errorHandlingMiddleware);

app.listen(SERVER, () => {
    console.log(`SERVING ON PORT: ${SERVER}`);
})
