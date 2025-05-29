import React from 'react';
import { Link, useNavigate } from "react-router-dom";
import Logo from "../Logo";

export default function PatientDashboard() {
    const navigate = useNavigate();
    const username = localStorage.getItem("patient");

    const handleLogout = () => {
        localStorage.removeItem("patient");
        navigate("/");
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
                boxShadow: "0 1px 2px rgba(0,0,0,0.1)",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "1rem"
            }}>
                <div style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "2rem"
                }}>
                    <h1 style={{
                        fontSize: "20px",
                        color: "#1e40af",
                        margin: 0,
                        fontWeight: "700"
                    }}>Patient Dashboard</h1>
                </div>
                <div style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "1rem"
                }}>
                    <span style={{
                        color: "#4b5563",
                        fontSize: "14px"
                    }}>Welcome, {username}</span>
                    <button
                        onClick={handleLogout}
                        style={{
                            color: "#dc2626",
                            background: "#fee2e2",
                            border: "none",
                            padding: "0.4rem 0.75rem",
                            borderRadius: "6px",
                            fontSize: "14px",
                            fontWeight: "500",
                            cursor: "pointer",
                            transition: "all 0.2s ease"
                        }}
                    >
                        Logout
                    </button>
                </div>
            </nav>

            {/* Main Content */}
            <div style={{
                maxWidth: "1200px",
                margin: "2rem auto",
                padding: "0 1.5rem"
            }}>
                <div style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
                    gap: "1.5rem"
                }}>
                    {/* Self Assessment Card */}
                    <div
                        onClick={() => navigate('/patient/self-assessment')}
                        style={{
                            background: "white",
                            padding: "1.5rem",
                            borderRadius: "8px",
                            boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
                            cursor: "pointer",
                            transition: "transform 0.2s ease, box-shadow 0.2s ease",
                            ':hover': {
                                transform: "translateY(-2px)",
                                boxShadow: "0 4px 6px rgba(0,0,0,0.1)"
                            }
                        }}
                    >
                        <h2 style={{
                            fontSize: "18px",
                            color: "#1e40af",
                            marginBottom: "0.75rem"
                        }}>Self Assessment</h2>
                        <p style={{
                            fontSize: "14px",
                            color: "#4b5563",
                            lineHeight: "1.5"
                        }}>
                            Take a comprehensive assessment to help us understand your speech patterns and needs better.
                        </p>
                    </div>

                    {/* View Therapy Plan Card */}
                    <div
                        onClick={() => navigate('/patient/view-plan')}
                        style={{
                            background: "white",
                            padding: "1.5rem",
                            borderRadius: "8px",
                            boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
                            cursor: "pointer",
                            transition: "transform 0.2s ease, box-shadow 0.2s ease",
                            ':hover': {
                                transform: "translateY(-2px)",
                                boxShadow: "0 4px 6px rgba(0,0,0,0.1)"
                            }
                        }}
                    >
                        <h2 style={{
                            fontSize: "18px",
                            color: "#1e40af",
                            marginBottom: "0.75rem"
                        }}>View Therapy Plan</h2>
                        <p style={{
                            fontSize: "14px",
                            color: "#4b5563",
                            lineHeight: "1.5"
                        }}>
                            Access your personalized therapy plan and track your progress through the exercises.
                        </p>
                    </div>

                    {/* Schedule Meeting Card */}
                    <div
                        onClick={() => navigate('/patient/schedule-meeting')}
                        style={{
                            background: "white",
                            padding: "1.5rem",
                            borderRadius: "8px",
                            boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
                            cursor: "pointer",
                            transition: "transform 0.2s ease, box-shadow 0.2s ease",
                            ':hover': {
                                transform: "translateY(-2px)",
                                boxShadow: "0 4px 6px rgba(0,0,0,0.1)"
                            }
                        }}
                    >
                        <h2 style={{
                            fontSize: "18px",
                            color: "#1e40af",
                            marginBottom: "0.75rem"
                        }}>Schedule Meeting</h2>
                        <p style={{
                            fontSize: "14px",
                            color: "#4b5563",
                            lineHeight: "1.5"
                        }}>
                            Schedule a consultation with your speech therapist to discuss your progress and concerns.
                        </p>
                    </div>

                    {/* Give Feedback Card */}
                    <div
                        onClick={() => navigate('/patient/give-feedback')}
                        style={{
                            background: "white",
                            padding: "1.5rem",
                            borderRadius: "8px",
                            boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
                            cursor: "pointer",
                            transition: "transform 0.2s ease, box-shadow 0.2s ease",
                            ':hover': {
                                transform: "translateY(-2px)",
                                boxShadow: "0 4px 6px rgba(0,0,0,0.1)"
                            }
                        }}
                    >
                        <h2 style={{
                            fontSize: "18px",
                            color: "#1e40af",
                            marginBottom: "0.75rem"
                        }}>Give Feedback</h2>
                        <p style={{
                            fontSize: "14px",
                            color: "#4b5563",
                            lineHeight: "1.5"
                        }}>
                            Share your experience and help us improve our services.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
