import mongoose from "mongoose";

const studentSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Name is required"],
    },
    studentId: {
        type: String,
        required: [true, "Student Id is required"],
    },
    grade: {
        type: String,
        required: [true, "Grade is required"],
    },
});

export const Student = mongoose.model("Student", studentSchema);