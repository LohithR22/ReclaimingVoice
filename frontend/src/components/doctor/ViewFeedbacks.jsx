import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../../services/api';
import Logo from "../Logo";

export default function ViewFeedbacks() {
    const [feedbacks, setFeedbacks] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        fetchFeedbacks();
    }, []);

    const fetchFeedbacks = async () => {
        try {
            const response = await axios.get('/api/feedbacks');
            setFeedbacks(response.data.feedbacks);
        } catch (error) {
            alert('Failed to fetch feedbacks: ' + error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this feedback?')) {
            try {
                const response = await axios.delete(`/api/feedback/${id}`);
                if (response.data.success) {
                    alert('Feedback deleted successfully!');
                    // Refresh the feedbacks list
                    fetchFeedbacks();
                }
            } catch (error) {
                alert('Failed to delete feedback: ' + error.message);
            }
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
                    }}>Doctor Dashboard</h1>
                    <div style={{
                        display: "flex",
                        gap: "1rem"
                    }}>
                        <button
                            onClick={() => navigate("/doctor/upload")}
                            style={{
                                color: "#64748b",
                                textDecoration: "none",
                                fontWeight: "500",
                                fontSize: "14px",
                                padding: "0.4rem 0.75rem",
                                borderRadius: "6px",
                                border: "1px solid #e2e8f0",
                                background: "transparent",
                                cursor: "pointer"
                            }}
                        >
                            Upload Report
                        </button>
                        <button
                            onClick={() => navigate("/doctor/schedule")}
                            style={{
                                color: "#64748b",
                                textDecoration: "none",
                                fontWeight: "500",
                                fontSize: "14px",
                                padding: "0.4rem 0.75rem",
                                borderRadius: "6px",
                                border: "1px solid #e2e8f0",
                                background: "transparent",
                                cursor: "pointer"
                            }}
                        >
                            Schedule Meeting
                        </button>
                        <button
                            onClick={() => navigate("/doctor/register")}
                            style={{
                                color: "#64748b",
                                textDecoration: "none",
                                fontWeight: "500",
                                fontSize: "14px",
                                padding: "0.4rem 0.75rem",
                                borderRadius: "6px",
                                border: "1px solid #e2e8f0",
                                background: "transparent",
                                cursor: "pointer"
                            }}
                        >
                            Register Patient
                        </button>
                        <button
                            onClick={() => navigate("/doctor/feedbacks")}
                            style={{
                                color: "#3b82f6",
                                textDecoration: "none",
                                fontWeight: "600",
                                fontSize: "14px",
                                padding: "0.4rem 0.75rem",
                                borderRadius: "6px",
                                border: "1px solid #e2e8f0",
                                background: "transparent",
                                cursor: "pointer"
                            }}
                        >
                            View Feedbacks
                        </button>
                        <button
                            onClick={() => navigate("/doctor/recordings")}
                            style={{
                                color: "#64748b",
                                textDecoration: "none",
                                fontWeight: "500",
                                fontSize: "14px",
                                padding: "0.4rem 0.75rem",
                                borderRadius: "6px",
                                border: "1px solid #e2e8f0",
                                background: "transparent",
                                cursor: "pointer"
                            }}
                        >
                            Patient Recordings
                        </button>
                    </div>
                </div>
                <div style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "1rem"
                }}>
                    <button
                        onClick={() => navigate("/doctor/dashboard")}
                        style={{
                            color: "#64748b",
                            textDecoration: "none",
                            fontWeight: "500",
                            fontSize: "14px",
                            padding: "0.4rem 0.75rem",
                            borderRadius: "6px",
                            border: "1px solid #e2e8f0",
                            background: "transparent",
                            cursor: "pointer",
                            transition: "all 0.2s ease",
                            display: "flex",
                            alignItems: "center",
                            gap: "0.5rem"
                        }}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M19 12H5M12 19l-7-7 7-7" />
                        </svg>
                        Back to Dashboard
                    </button>
                </div>
            </nav>

            {/* Main Content */}
            <div style={{
                maxWidth: "800px",
                margin: "2rem auto",
                padding: "0 1.5rem"
            }}>
                <div style={{
                    background: "white",
                    padding: "2rem",
                    borderRadius: "8px",
                    boxShadow: "0 1px 3px rgba(0,0,0,0.1)"
                }}>
                    <h2 style={{
                        fontSize: "18px",
                        color: "#1e40af",
                        marginTop: 0,
                        marginBottom: "1.5rem",
                        textAlign: "center"
                    }}>Patient Feedbacks</h2>

                    {loading ? (
                        <p style={{
                            textAlign: "center",
                            color: "#6b7280",
                            fontSize: "14px"
                        }}>Loading feedbacks...</p>
                    ) : feedbacks.length === 0 ? (
                        <p style={{
                            textAlign: "center",
                            color: "#6b7280",
                            fontSize: "14px"
                        }}>No feedbacks available</p>
                    ) : (
                        <div style={{
                            display: "flex",
                            flexDirection: "column",
                            gap: "1rem"
                        }}>
                            {feedbacks.map(feedback => (
                                <div
                                    key={feedback.id}
                                    style={{
                                        padding: "1rem",
                                        border: "1px solid #e2e8f0",
                                        borderRadius: "6px",
                                        background: "#f8fafc"
                                    }}
                                >
                                    <div style={{
                                        display: "flex",
                                        justifyContent: "space-between",
                                        alignItems: "center",
                                        marginBottom: "0.5rem"
                                    }}>
                                        <div>
                                            <span style={{
                                                fontSize: "14px",
                                                fontWeight: "500",
                                                color: "#1e293b"
                                            }}>
                                                {feedback.patientUsername}
                                            </span>
                                            <span style={{
                                                fontSize: "12px",
                                                color: "#64748b",
                                                marginLeft: "1rem"
                                            }}>
                                                {feedback.date}
                                            </span>
                                        </div>
                                        <button
                                            onClick={() => handleDelete(feedback.id)}
                                            style={{
                                                padding: "0.25rem 0.5rem",
                                                background: "#fee2e2",
                                                color: "#dc2626",
                                                border: "none",
                                                borderRadius: "4px",
                                                fontSize: "12px",
                                                cursor: "pointer",
                                                transition: "all 0.2s ease"
                                            }}
                                        >
                                            Delete
                                        </button>
                                    </div>
                                    <p style={{
                                        fontSize: "14px",
                                        color: "#4b5563",
                                        margin: 0
                                    }}>
                                        {feedback.feedback}
                                    </p>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
} 