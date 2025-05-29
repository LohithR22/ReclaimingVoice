import React, { useState } from "react";
import axios from "../../services/api";
import { useNavigate } from "react-router-dom";
import Logo from "../Logo";

export default function PatientAuth() {
    const [form, setForm] = useState({ username: "", password: "" });
    const [showSuccessMessage, setShowSuccessMessage] = useState(false);
    const navigate = useNavigate();

    const handleLogin = async () => {
        if (!form.username.trim() || !form.password.trim()) {
            return;
        }

        try {
            const res = await axios.post("/login-patient", form);
            localStorage.setItem("patient", res.data.username);

            // Show success message with animation
            const successDiv = document.createElement('div');
            successDiv.style.position = 'fixed';
            successDiv.style.top = '20px';
            successDiv.style.left = '50%';
            successDiv.style.transform = 'translateX(-50%)';
            successDiv.style.backgroundColor = '#059669';
            successDiv.style.color = 'white';
            successDiv.style.padding = '1rem 2rem';
            successDiv.style.borderRadius = '8px';
            successDiv.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
            successDiv.style.zIndex = '1000';
            successDiv.style.opacity = '0';
            successDiv.style.transition = 'opacity 0.3s ease';
            successDiv.innerHTML = `Welcome back, ${res.data.username}! 👋`;

            document.body.appendChild(successDiv);

            // Fade in
            setTimeout(() => {
                successDiv.style.opacity = '1';
            }, 100);

            // Remove after delay
            setTimeout(() => {
                successDiv.style.opacity = '0';
                setTimeout(() => {
                    document.body.removeChild(successDiv);
                    navigate("/patient/dashboard");
                }, 300);
            }, 1500);

        } catch (err) {
            // Show error message with animation
            const errorDiv = document.createElement('div');
            errorDiv.style.position = 'fixed';
            errorDiv.style.top = '20px';
            errorDiv.style.left = '50%';
            errorDiv.style.transform = 'translateX(-50%)';
            errorDiv.style.backgroundColor = '#dc2626';
            errorDiv.style.color = 'white';
            errorDiv.style.padding = '1rem 2rem';
            errorDiv.style.borderRadius = '8px';
            errorDiv.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
            errorDiv.style.zIndex = '1000';
            errorDiv.style.opacity = '0';
            errorDiv.style.transition = 'opacity 0.3s ease';
            errorDiv.innerHTML = err.response?.data?.error || "Login failed. Please try again.";

            document.body.appendChild(errorDiv);

            // Fade in
            setTimeout(() => {
                errorDiv.style.opacity = '1';
            }, 100);

            // Remove after delay
            setTimeout(() => {
                errorDiv.style.opacity = '0';
                setTimeout(() => {
                    document.body.removeChild(errorDiv);
                }, 300);
            }, 3000);
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && form.username.trim() && form.password.trim()) {
            handleLogin();
        }
    };

    return (
        <div style={{
            minHeight: "100vh",
            width: "100vw",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            background: "linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%)",
            margin: 0,
            padding: 0,
            overflow: "hidden",
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0
        }}>
            <Logo />
            <div style={{
                width: "90%",
                maxWidth: "400px",
                padding: "2.5rem",
                background: "white",
                borderRadius: "24px",
                boxShadow: "0 10px 25px rgba(0, 0, 0, 0.1)",
                textAlign: "center",
                position: "relative"
            }}>
                <button
                    onClick={() => navigate("/")}
                    style={{
                        position: "absolute",
                        top: "1rem",
                        left: "1rem",
                        padding: "8px 16px",
                        fontSize: "14px",
                        fontWeight: "500",
                        color: "#1e40af",
                        backgroundColor: "transparent",
                        border: "1px solid #1e40af",
                        borderRadius: "8px",
                        cursor: "pointer",
                        transition: "all 0.2s ease",
                        display: "flex",
                        alignItems: "center",
                        gap: "4px"
                    }}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = "#1e40af";
                        e.currentTarget.style.color = "white";
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = "transparent";
                        e.currentTarget.style.color = "#1e40af";
                    }}
                >
                    ← Home
                </button>

                <h2 style={{
                    fontSize: "32px",
                    color: "#1e40af",
                    marginBottom: "2rem",
                    fontWeight: "700",
                    letterSpacing: "-0.5px"
                }}>Patient Login</h2>

                <div style={{ marginBottom: "1.5rem" }}>
                    <input
                        type="text"
                        placeholder="Username"
                        value={form.username}
                        onChange={(e) => setForm({ ...form, username: e.target.value })}
                        onKeyPress={handleKeyPress}
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
                        type="password"
                        placeholder="Password"
                        value={form.password}
                        onChange={(e) => setForm({ ...form, password: e.target.value })}
                        onKeyPress={handleKeyPress}
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

                <button
                    onClick={handleLogin}
                    style={{
                        width: "100%",
                        padding: "12px 24px",
                        fontSize: "16px",
                        fontWeight: "600",
                        color: "white",
                        backgroundColor: "#1e40af",
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
                    Login
                </button>
            </div>
        </div>
    );
}
