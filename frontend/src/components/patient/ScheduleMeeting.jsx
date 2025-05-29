import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../../services/api';

export default function ScheduleMeeting() {
    const [meetingDetails, setMeetingDetails] = useState({
        date: '',
        time: '',
        description: ''
    });
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const patientUsername = localStorage.getItem('patient');
            if (!patientUsername) {
                alert('Please log in first');
                navigate('/');
                return;
            }

            const response = await axios.post('/schedule-meeting', {
                patientUsername,
                date: meetingDetails.date,
                time: meetingDetails.time,
                description: meetingDetails.description,
                role: 'patient'
            });

            if (response.data.success) {
                alert('Meeting request sent successfully!');
                navigate('/patient/dashboard');
            }
        } catch (error) {
            alert('Failed to schedule meeting: ' + (error.response?.data?.error || error.message));
        } finally {
            setLoading(false);
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
                    <div style={{
                        display: "flex",
                        gap: "1rem"
                    }}>
                        <span style={{
                            color: "#4b5563",
                            fontSize: "14px",
                            fontWeight: "500",
                            padding: "0.4rem 0.75rem"
                        }}>Schedule Therapy Session</span>
                    </div>
                </div>
                <div style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "1rem"
                }}>
                    <button
                        onClick={() => navigate("/patient/dashboard")}
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
                maxWidth: "600px",
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
                    }}>Request a Therapy Session</h2>
                    <form onSubmit={handleSubmit}>
                        <div style={{ marginBottom: "1.5rem" }}>
                            <label
                                style={{
                                    display: "block",
                                    marginBottom: "0.5rem",
                                    color: "#1e293b",
                                    fontSize: "14px",
                                    fontWeight: "500"
                                }}
                            >
                                Preferred Date
                            </label>
                            <input
                                type="date"
                                required
                                value={meetingDetails.date}
                                onChange={(e) => setMeetingDetails(prev => ({
                                    ...prev,
                                    date: e.target.value
                                }))}
                                style={{
                                    width: "100%",
                                    padding: "0.5rem",
                                    border: "1px solid #e2e8f0",
                                    borderRadius: "6px",
                                    fontSize: "14px"
                                }}
                            />
                        </div>

                        <div style={{ marginBottom: "1.5rem" }}>
                            <label
                                style={{
                                    display: "block",
                                    marginBottom: "0.5rem",
                                    color: "#1e293b",
                                    fontSize: "14px",
                                    fontWeight: "500"
                                }}
                            >
                                Preferred Time
                            </label>
                            <input
                                type="time"
                                required
                                value={meetingDetails.time}
                                onChange={(e) => setMeetingDetails(prev => ({
                                    ...prev,
                                    time: e.target.value
                                }))}
                                style={{
                                    width: "100%",
                                    padding: "0.5rem",
                                    border: "1px solid #e2e8f0",
                                    borderRadius: "6px",
                                    fontSize: "14px"
                                }}
                            />
                        </div>

                        <div style={{ marginBottom: "1.5rem" }}>
                            <label
                                style={{
                                    display: "block",
                                    marginBottom: "0.5rem",
                                    color: "#1e293b",
                                    fontSize: "14px",
                                    fontWeight: "500"
                                }}
                            >
                                Session Purpose
                            </label>
                            <textarea
                                required
                                value={meetingDetails.description}
                                onChange={(e) => setMeetingDetails(prev => ({
                                    ...prev,
                                    description: e.target.value
                                }))}
                                placeholder="Briefly describe what you'd like to focus on in this therapy session"
                                style={{
                                    width: "100%",
                                    padding: "0.5rem",
                                    border: "1px solid #e2e8f0",
                                    borderRadius: "6px",
                                    fontSize: "14px",
                                    minHeight: "100px",
                                    resize: "vertical"
                                }}
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            style={{
                                width: "100%",
                                padding: "0.75rem",
                                background: "#1e40af",
                                color: "white",
                                border: "none",
                                borderRadius: "6px",
                                fontSize: "14px",
                                fontWeight: "500",
                                cursor: loading ? "not-allowed" : "pointer",
                                transition: "background-color 0.2s ease",
                                opacity: loading ? "0.7" : "1",
                                ':hover': {
                                    background: "#1e3a8a"
                                }
                            }}
                        >
                            {loading ? "Submitting Request..." : "Request Therapy Session"}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
} 