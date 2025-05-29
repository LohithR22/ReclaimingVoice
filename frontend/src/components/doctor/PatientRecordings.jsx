import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "../../services/api";
import Logo from "../Logo";

export default function PatientRecordings() {
    const [recordings, setRecordings] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        fetchRecordings();
    }, []);

    const fetchRecordings = async () => {
        try {
            const response = await axios.get("http://localhost:5000/list-recordings");
            if (response.data.recordings && response.data.recordings.length > 0) {
                setRecordings(response.data.recordings);
            } else {
                alert("No recordings found. Patient has not yet taken the speaking assessment.");
                navigate("/doctor/upload");
            }
        } catch (error) {
            console.error("Error fetching recordings:", error);
            alert("Error fetching recordings");
            navigate("/doctor/upload");
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
                        color: "#64748b",
                        textDecoration: "none",
                        fontWeight: "500",
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
                        color: "#3b82f6",
                        textDecoration: "none",
                        fontWeight: "600",
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
                maxWidth: "800px",
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
                }}>Patient Recordings</h2>

                <div style={{
                    display: "grid",
                    gap: "1rem"
                }}>
                    {recordings.map((recording, index) => (
                        <div key={index} style={{
                            padding: "1rem",
                            borderRadius: "12px",
                            border: "1px solid #e2e8f0",
                            background: "#f8fafc"
                        }}>
                            <p style={{
                                fontSize: "16px",
                                color: "#1e293b",
                                marginBottom: "0.5rem"
                            }}>{recording}</p>
                            <audio
                                controls
                                style={{
                                    width: "100%",
                                    marginTop: "0.5rem"
                                }}
                            >
                                <source src={`http://localhost:5000/recordings/${recording}`} type="audio/wav" />
                                Your browser does not support the audio element.
                            </audio>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
} 