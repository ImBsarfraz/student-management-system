import React, { useEffect, useState } from 'react';

const StudentForm = ({ onSubmit, selectedStudent, clearSelection }) => {
    const [form, setForm] = useState({
        name: "",
        studentId: "",
        grade: "",
    });

    useEffect(() => {
        if (selectedStudent) {
            setForm({
                name: selectedStudent.name,
                studentId: selectedStudent.studentId,
                grade: selectedStudent.grade,
            });
        }
    }, [selectedStudent]);

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(form);
        setForm({ name: "", studentId: "", grade: "" });
    };

    return (
        <div className="card shadow-sm mb-4">
            <div className="card-body">
                <h5 className="card-title mb-3">
                    {selectedStudent ? "Update Student" : "Add New Student"}
                </h5>

                <form onSubmit={handleSubmit}>
                    <div className="row g-3">
                        <div className="col-md-4">
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Name"
                                value={form.name}
                                onChange={(e) =>
                                    setForm({ ...form, name: e.target.value })
                                }
                                required
                            />
                        </div>

                        <div className="col-md-4">
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Student ID"
                                value={form.studentId}
                                onChange={(e) =>
                                    setForm({ ...form, studentId: e.target.value })
                                }
                                required
                            />
                        </div>

                        <div className="col-md-4">
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Grade"
                                value={form.grade}
                                onChange={(e) =>
                                    setForm({ ...form, grade: e.target.value })
                                }
                                required
                            />
                        </div>
                    </div>

                    <div className="mt-3">
                        <button type="submit" className="btn btn-primary">
                            {selectedStudent ? "Update" : "Add"}
                        </button>

                        {selectedStudent && (
                            <button
                                type="button"
                                onClick={clearSelection}
                                className="btn btn-secondary ms-2"
                            >
                                Cancel
                            </button>
                        )}
                    </div>
                </form>
            </div>
        </div>
    );
};

export default StudentForm;