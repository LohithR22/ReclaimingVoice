import React, { useState } from "react";
import axios from "../../services/api";
import { useNavigate } from "react-router-dom";
import Logo from "../Logo";

export default function DoctorAuth() {
    const [isLogin, setIsLogin] = useState(true);
    const [form, setForm] = useState({ username: "", password: "" });
    const navigate = useNavigate();

    const handleSubmit = async () => {
        if (!form.username.trim() || !form.password.trim()) {
            return;
        }

        try {
            const endpoint = isLogin ? "/login-doctor" : "/register-doctor";
            const res = await axios.post(endpoint, form);

            if (isLogin) {
                localStorage.setItem("doctor", form.username);

                // Show success message with animation
                const successDiv = document.createElement('div');
                successDiv.style.position = 'fixed';
                successDiv.style.top = '20px';
                successDiv.style.left = '50%';
                successDiv.style.transform = 'translateX(-50%)';
                successDiv.style.backgroundColor = '#166534';
                successDiv.style.color = 'white';
                successDiv.style.padding = '1rem 2rem';
                successDiv.style.borderRadius = '8px';
                successDiv.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
                successDiv.style.zIndex = '1000';
                successDiv.style.opacity = '0';
                successDiv.style.transition = 'opacity 0.3s ease';
                successDiv.innerHTML = `Welcome back, Dr. ${form.username}! 👋`;

                document.body.appendChild(successDiv);

                // Fade in
                setTimeout(() => {
                    successDiv.style.opacity = '1';
                }, 100);

                // Remove after delay and navigate
                setTimeout(() => {
                    successDiv.style.opacity = '0';
                    setTimeout(() => {
                        document.body.removeChild(successDiv);
                        navigate("/doctor/upload");
                    }, 300);
                }, 1500);
            } else {
                // Show registration success message
                const successDiv = document.createElement('div');
                successDiv.style.position = 'fixed';
                successDiv.style.top = '20px';
                successDiv.style.left = '50%';
                successDiv.style.transform = 'translateX(-50%)';
                successDiv.style.backgroundColor = '#166534';
                successDiv.style.color = 'white';
                successDiv.style.padding = '1rem 2rem';
                successDiv.style.borderRadius = '8px';
                successDiv.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
                successDiv.style.zIndex = '1000';
                successDiv.style.opacity = '0';
                successDiv.style.transition = 'opacity 0.3s ease';
                successDiv.innerHTML = 'Registration successful! Please log in.';

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
                        setIsLogin(true);
                    }, 300);
                }, 1500);
            }
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
            errorDiv.innerHTML = err.response?.data?.error || "Something went wrong";

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
            handleSubmit();
        }
    };

    return (
        <div style={{
            minHeight: "100vh",
            width: "100vw",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            background: "linear-gradient(135deg, #f0f4ff 0%, #e6eeff 50%, #f0f4ff 100%)",
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
                        color: "#166534",
                        backgroundColor: "transparent",
                        border: "1px solid #166534",
                        borderRadius: "8px",
                        cursor: "pointer",
                        transition: "all 0.2s ease",
                        display: "flex",
                        alignItems: "center",
                        gap: "4px"
                    }}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = "#166534";
                        e.currentTarget.style.color = "white";
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = "transparent";
                        e.currentTarget.style.color = "#166534";
                    }}
                >
                    ← Home
                </button>

                <h2 style={{
                    fontSize: "32px",
                    color: "#166534",
                    marginBottom: "2rem",
                    fontWeight: "700",
                    letterSpacing: "-0.5px"
                }}>{isLogin ? "Doctor Login" : "Doctor Signup"}</h2>

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
                    onClick={handleSubmit}
                    style={{
                        width: "100%",
                        padding: "12px 24px",
                        fontSize: "16px",
                        fontWeight: "600",
                        color: "white",
                        backgroundColor: "#166534",
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
                    {isLogin ? "Login" : "Signup"}
                </button>

                <p style={{
                    marginTop: "1.5rem",
                    color: "#4b5563",
                    fontSize: "14px"
                }}>
                    {isLogin ? "Don't have an account?" : "Already registered?"}{" "}
                    <span
                        style={{
                            color: "#166534",
                            cursor: "pointer",
                            fontWeight: "600"
                        }}
                        onClick={() => setIsLogin(!isLogin)}
                    >
                        {isLogin ? "Signup" : "Login"}
                    </span>
                </p>
            </div>
        </div>
    );
}
