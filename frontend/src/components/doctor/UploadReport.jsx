// frontend/src/components/Doctor/UploadReport.js
import { useState } from "react";
import axios from "../../services/api";
import { Link } from "react-router-dom";
import Logo from "../Logo";

export default function UploadReport() {
    const [file, setFile] = useState(null);
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");

    const handleSubmit = async () => {
        if (!file || !email) {
            alert("Please enter a patient email and select a report file.");
            return;
        }

        const formData = new FormData();
        formData.append("file", file);
        formData.append("email", email);

        try {
            const res = await axios.post("/upload-report", formData, {
                headers: { "Content-Type": "multipart/form-data" }
            });
            setMessage(res.data.message);
            setEmail("");
            setFile(null);
        } catch (err) {
            console.error("Upload failed:", err);
            alert("Failed to upload the report. Please try again.");
        }
    };

    return (
        <div style={{
            minHeight: "100vh",
            width: "100vw",
            margin: 0,
            padding: 0,
            background: "linear-gradient(135deg, #f0f4ff 0%, #e6eeff 50%, #f0f4ff 100%)",
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            overflow: "auto"
        }}>
            <Logo position="bottom-right" />
            {/* Navigation Bar */}
            <nav style={{
                padding: "1rem 2rem",
                background: "white",
                boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                marginBottom: "2rem"
            }}>
                <h1 style={{
                    fontSize: "28px",
                    color: "#1e293b",
                    margin: 0,
                    marginBottom: "1rem",
                    fontWeight: "700"
                }}>Doctor Dashboard</h1>
                <div style={{
                    display: "flex",
                    gap: "1.5rem"
                }}>
                    <Link to="/doctor/upload" style={{
                        color: "#3b82f6",
                        textDecoration: "none",
                        fontWeight: "600",
                        fontSize: "16px"
                    }}>Upload Report</Link>
                    <Link to="/doctor/schedule" style={{
                        color: "#64748b",
                        textDecoration: "none",
                        fontWeight: "500",
                        fontSize: "16px"
                    }}>Schedule Meeting</Link>
                    <Link to="/doctor/register" style={{
                        color: "#64748b",
                        textDecoration: "none",
                        fontWeight: "500",
                        fontSize: "16px"
                    }}>Register Patient</Link>
                    <Link to="/doctor/feedbacks" style={{
                        color: "#64748b",
                        textDecoration: "none",
                        fontWeight: "500",
                        fontSize: "16px"
                    }}>View Feedbacks</Link>
                    <Link to="/doctor/recordings" style={{
                        color: "#64748b",
                        textDecoration: "none",
                        fontWeight: "500",
                        fontSize: "16px"
                    }}>Patient Recordings</Link>
                </div>
                <Link to="/" style={{
                    position: "absolute",
                    right: "1.5rem",
                    top: "1.5rem",
                    color: "#ef4444",
                    textDecoration: "none",
                    fontWeight: "500",
                    fontSize: "15px",
                    padding: "0.5rem 1rem",
                    borderRadius: "6px",
                    border: "1px solid #ef4444",
                    transition: "all 0.2s ease"
                }}>Logout</Link>
            </nav>

            {/* Main Content */}
            <div style={{
                width: "90%",
                maxWidth: "600px",
                margin: "2rem auto",
                padding: "2.5rem",
                background: "white",
                borderRadius: "24px",
                boxShadow: "0 10px 25px rgba(0, 0, 0, 0.1)"
            }}>
                <h2 style={{
                    fontSize: "24px",
                    color: "#1e293b",
                    marginBottom: "2rem",
                    fontWeight: "600"
                }}>Upload Patient Report</h2>

                <div style={{ marginBottom: "1.5rem" }}>
                    <input
                        type="email"
                        placeholder="Patient Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        style={{
                            width: "100%",
                            padding: "12px 16px",
                            fontSize: "16px",
                            border: "2px solid #e2e8f0",
                            borderRadius: "12px",
                            outline: "none",
                            transition: "border-color 0.2s ease",
                            boxSizing: "border-box"
                        }}
                    />
                </div>

                <div style={{ marginBottom: "2rem" }}>
                    <input
                        type="file"
                        onChange={(e) => setFile(e.target.files[0])}
                        style={{
                            width: "100%",
                            padding: "12px 16px",
                            fontSize: "16px",
                            border: "2px solid #e2e8f0",
                            borderRadius: "12px",
                            backgroundColor: "white",
                            outline: "none",
                            transition: "border-color 0.2s ease",
                            boxSizing: "border-box"
                        }}
                    />
                </div>

                <button
                    onClick={handleSubmit}
                    style={{
                        width: "100%",
                        padding: "12px 24px",
                        fontSize: "16px",
                        fontWeight: "600",
                        color: "white",
                        backgroundColor: "#3b82f6",
                        border: "none",
                        borderRadius: "12px",
                        cursor: "pointer",
                        transition: "transform 0.2s ease, box-shadow 0.2s ease",
                        boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)"
                    }}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.transform = "translateY(-2px)";
                        e.currentTarget.style.boxShadow = "0 6px 8px rgba(0, 0, 0, 0.15)";
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.transform = "translateY(0)";
                        e.currentTarget.style.boxShadow = "0 4px 6px rgba(0, 0, 0, 0.1)";
                    }}
                >
                    Upload Report
                </button>

                {message && (
                    <p style={{
                        marginTop: "1.5rem",
                        padding: "1rem",
                        borderRadius: "12px",
                        backgroundColor: "#f0fdf4",
                        color: "#166534",
                        fontSize: "14px",
                        textAlign: "center"
                    }}>{message}</p>
                )}
            </div>
        </div>
    );
}
