import mongoose from "mongoose"

export const dbConnection = () => {
    try {
        mongoose.connect(process.env.MONGO_DB_URI);
        console.log('Connected to Database')
    } catch (error) {
        console.log("Database Connection Failed: ", error);
    }
}