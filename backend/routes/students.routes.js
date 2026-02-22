import express from "express"
import securityMiddleware from "../middlewares/security.middleware.js";
import { createStudent, deleteStudent, getStudents, updateStudent } from "../controllers/student.controller.js";

const router = express.Router();

router.use(securityMiddleware);

router.get("/students", getStudents);
router.post("/students", createStudent);
router.put("/students/:id", updateStudent);
router.delete("/students/:id", deleteStudent);

export default router;