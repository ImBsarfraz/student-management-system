import { catchAsyncErrors } from "../middlewares/catchAsyncErrors.js";
import { Student } from "../models/student.model.js";
import encryptResponse from "../utils/encryptResponse.js";
import { errorHandler } from "../utils/errorHandler.js";

export const getStudents = catchAsyncErrors(async (req, res, next) => {
    const students = await Student.find();

    if (!students) {
        return next(new errorHandler("Students not found", 404));
    }

    encryptResponse(students, req.clientPublicKey, res);
});

export const createStudent = catchAsyncErrors(async (req, res, next) => {
    const student = await Student.create(req.body);

    if (!student) {
        return next(new errorHandler("All fields are required", 400));
    }

    encryptResponse(student, req.clientPublicKey, res);
});



export const updateStudent = catchAsyncErrors(async (req, res, next) => {
    const student = await Student.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true }
    );

    if (!student) {
        return next(new errorHandler("Student not found", 404));
    }

    encryptResponse(student, req.clientPublicKey, res);
});

export const deleteStudent = catchAsyncErrors(async (req, res, next) => {
    const student = await Student.findByIdAndDelete(req.params.id);

    if (!student) {
        return next(new errorHandler("Student not found", 404));
    }

    encryptResponse({ message: "Deleted" }, req.clientPublicKey, res)
})