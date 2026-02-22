import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import { decryptResponse, encryptRequest } from '../services/cryptoService';
import api from '../api/axiosInstance';
import StudentForm from './StudentForm';

const StudentList = () => {
    const { clientPrivateKey, serverPublicKey, loading } =
        useContext(AuthContext);

    const [students, setStudents] = useState([]);
    const [selectedStudent, setSelectedStudent] = useState(null);
    const [processing, setProcessing] = useState(false);

    useEffect(() => {
        if (!loading) {
            fetchStudents();
        }
    }, [loading]);

    const fetchStudents = async () => {
        try {
            setProcessing(true);
            const res = await api.get("/students");
            const data = await decryptResponse(res.data, clientPrivateKey);
            setStudents(data);
        } catch (err) {
            console.error(err);
        } finally {
            setProcessing(false);
        }
    };

    const createStudent = async (data) => {
        try {
            if (!serverPublicKey || !clientPrivateKey) {
                console.log("Keys not ready yet");
                return;
            }

            setProcessing(true);

            const encrypted = await encryptRequest(data, serverPublicKey);

            const res = await api.post("/students", encrypted);

            await decryptResponse(res.data, clientPrivateKey);

            fetchStudents();
        } catch (err) {
            console.error("CREATE ERROR:", err);
        } finally {
            setProcessing(false);
        }
    };

    const updateStudent = async (data) => {
        try {
            setProcessing(true);
            const encrypted = await encryptRequest(data, serverPublicKey);
            const res = await api.put(
                `/students/${selectedStudent._id}`,
                encrypted
            );
            await decryptResponse(res.data, clientPrivateKey);
            setSelectedStudent(null);
            fetchStudents();
        } catch (err) {
            console.error(err);
        }
    };

    const deleteStudent = async (id) => {
        try {
            setProcessing(true);
            const encrypted = await encryptRequest({ id }, serverPublicKey);
            const res = await api.delete(`/students/${id}`, {
                data: encrypted,
            });
            await decryptResponse(res.data, clientPrivateKey);
            fetchStudents();
        } catch (err) {
            console.error(err);
        }
    };

    if (loading)
        return (
            <div className="text-center mt-5">
                <div className="spinner-border text-primary"></div>
                <p className="mt-2">Initializing Secure Session...</p>
            </div>
        );

    return (
        <div className="container mt-5">
            <div className="text-center mb-4">
                <h2 className="fw-bold">Secure Student Management</h2>
                <p className="text-muted">
                    Encrypted OAuth 2.0 Secure CRUD System
                </p>
            </div>

            <StudentForm
                onSubmit={selectedStudent ? updateStudent : createStudent}
                selectedStudent={selectedStudent}
                clearSelection={() => setSelectedStudent(null)}
            />

            <div className="card shadow-sm">
                <div className="card-body">

                    {processing && (
                        <div className="text-center mb-3">
                            <div className="spinner-border text-secondary"></div>
                        </div>
                    )}

                    <div className="table-responsive">
                        <table className="table table-hover align-middle">
                            <thead className="table-dark">
                                <tr>
                                    <th>Name</th>
                                    <th>Student ID</th>
                                    <th>Grade</th>
                                    <th className="text-center">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {students.length === 0 && !processing && (
                                    <tr>
                                        <td colSpan="4" className="text-center text-muted">
                                            No Students Found
                                        </td>
                                    </tr>
                                )}

                                {students.map((s) => (
                                    <tr key={s._id}>
                                        <td>{s.name}</td>
                                        <td>{s.studentId}</td>
                                        <td>{s.grade}</td>
                                        <td className="text-center">
                                            <button
                                                className="btn btn-sm btn-warning me-2"
                                                onClick={() => setSelectedStudent(s)}
                                            >
                                                Edit
                                            </button>

                                            <button
                                                className="btn btn-sm btn-danger"
                                                onClick={() => deleteStudent(s._id)}
                                            >
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))}

                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StudentList;