import { useState } from "react";
import axios from "../../services/api";
import { Link } from "react-router-dom";
import Logo from "../Logo";

export default function RegisterPatient() {
    const [form, setForm] = useState({
        username: "",
        password: "",
        email: "",
        age: "",
        severity: "",
        goals: "",
        history: "",
        disorder_type: "articulation"
    });

    const handleRegister = async () => {
        try {
            const payload = {
                ...form,
                goals: form.goals.split(",").map(g => g.trim())
            };
            const res = await axios.post("http://localhost:5000/register-patient", payload);
            alert(res.data.message);
            setForm({
                username: "",
                password: "",
                email: "",
                age: "",
                severity: "",
                goals: "",
                history: "",
                disorder_type: "articulation"
            });
        } catch (err) {
            alert(err.response?.data?.error || "Registration failed");
        }
    };

    const inputStyle = {
        width: "100%",
        padding: "8px 12px",
        fontSize: "15px",
        border: "1px solid #e2e8f0",
        borderRadius: "8px",
        outline: "none",
        transition: "border-color 0.2s ease",
        boxSizing: "border-box",
        marginTop: "0.25rem"
    };

    const labelStyle = {
        fontSize: "14px",
        fontWeight: "500",
        color: "#4b5563",
        display: "block",
        marginBottom: "0.25rem"
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
                padding: "0.75rem 1.5rem",
                background: "white",
                boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                marginBottom: "1.5rem"
            }}>
                <h1 style={{
                    fontSize: "24px",
                    color: "#1e293b",
                    margin: 0,
                    marginBottom: "0.75rem",
                    fontWeight: "700"
                }}>Doctor Dashboard</h1>
                <div style={{
                    display: "flex",
                    gap: "1.25rem"
                }}>
                    <Link to="/doctor/upload" style={{
                        color: "#64748b",
                        textDecoration: "none",
                        fontWeight: "500",
                        fontSize: "15px"
                    }}>Upload Report</Link>
                    <Link to="/doctor/schedule" style={{
                        color: "#64748b",
                        textDecoration: "none",
                        fontWeight: "500",
                        fontSize: "15px"
                    }}>Schedule Meeting</Link>
                    <Link to="/doctor/register" style={{
                        color: "#3b82f6",
                        textDecoration: "none",
                        fontWeight: "600",
                        fontSize: "15px"
                    }}>Register Patient</Link>
                    <Link to="/doctor/feedbacks" style={{
                        color: "#64748b",
                        textDecoration: "none",
                        fontWeight: "500",
                        fontSize: "15px"
                    }}>View Feedbacks</Link>
                    <Link to="/doctor/recordings" style={{
                        color: "#64748b",
                        textDecoration: "none",
                        fontWeight: "500",
                        fontSize: "15px"
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
                maxWidth: "500px",
                margin: "1.5rem auto",
                padding: "1.5rem",
                background: "white",
                borderRadius: "16px",
                boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)"
            }}>
                <h2 style={{
                    fontSize: "20px",
                    color: "#1e293b",
                    marginBottom: "1.25rem",
                    fontWeight: "600"
                }}>Register Patient</h2>

                {["username", "password", "email", "age", "severity"].map((field) => (
                    <div key={field} style={{ marginBottom: "0.75rem" }}>
                        <label style={labelStyle}>
                            {field.charAt(0).toUpperCase() + field.slice(1)}:
                        </label>
                        <input
                            type={field === "password" ? "password" : "text"}
                            value={form[field]}
                            onChange={(e) => setForm({ ...form, [field]: e.target.value })}
                            style={inputStyle}
                        />
                    </div>
                ))}

                <div style={{ marginBottom: "0.75rem" }}>
                    <label style={labelStyle}>Goals:</label>
                    <input
                        type="text"
                        placeholder="Separate with commas"
                        value={form.goals}
                        onChange={(e) => setForm({ ...form, goals: e.target.value })}
                        style={inputStyle}
                    />
                </div>

                <div style={{ marginBottom: "0.75rem" }}>
                    <label style={labelStyle}>History:</label>
                    <textarea
                        value={form.history}
                        onChange={(e) => setForm({ ...form, history: e.target.value })}
                        style={{
                            ...inputStyle,
                            minHeight: "80px",
                            resize: "vertical"
                        }}
                    />
                </div>

                <div style={{ marginBottom: "1rem" }}>
                    <label style={labelStyle}>Disorder Type:</label>
                    <select
                        value={form.disorder_type}
                        onChange={(e) => setForm({ ...form, disorder_type: e.target.value })}
                        style={inputStyle}
                    >
                        <option value="articulation">Articulation</option>
                        <option value="fluency">Fluency</option>
                        <option value="voice">Voice</option>
                        <option value="language">Language</option>
                        <option value="motor_speech">Motor Speech</option>
                    </select>
                </div>

                <div style={{ marginBottom: "1rem" }}>
                    <small style={{
                        display: "block",
                        color: "#64748b",
                        fontSize: "13px",
                        padding: "0.75rem",
                        background: "#f8fafc",
                        borderRadius: "8px",
                        border: "1px solid #e2e8f0"
                    }}>
                        ⚠️ Separate multiple goals using commas (e.g., improve clarity, increase fluency)
                    </small>
                </div>

                <button
                    onClick={handleRegister}
                    style={{
                        width: "100%",
                        padding: "10px 20px",
                        fontSize: "15px",
                        fontWeight: "600",
                        color: "white",
                        backgroundColor: "#3b82f6",
                        border: "none",
                        borderRadius: "8px",
                        cursor: "pointer",
                        transition: "transform 0.2s ease, box-shadow 0.2s ease",
                        boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)"
                    }}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.transform = "translateY(-2px)";
                        e.currentTarget.style.boxShadow = "0 4px 6px rgba(0, 0, 0, 0.15)";
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.transform = "translateY(0)";
                        e.currentTarget.style.boxShadow = "0 2px 4px rgba(0, 0, 0, 0.1)";
                    }}
                >
                    Create Patient Account
                </button>
            </div>
        </div>
    );
}
