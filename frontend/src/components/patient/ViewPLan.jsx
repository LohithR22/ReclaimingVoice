import React, { useEffect, useState, useRef } from "react";
import axios from "../../services/api";
import { useNavigate } from "react-router-dom";
import Logo from "../Logo";

export default function ViewPlan() {
    const [disorder, setDisorder] = useState("articulation");
    const [plan, setPlan] = useState("");
    const [loading, setLoading] = useState(false);
    const [expandedWeeks, setExpandedWeeks] = useState({});
    const [completedWeeks, setCompletedWeeks] = useState({});
    const [showAssessment, setShowAssessment] = useState(false);
    const [isAssessmentExpanded, setIsAssessmentExpanded] = useState(false);
    const [isReferencesExpanded, setIsReferencesExpanded] = useState(false);
    const [assessmentQuestions, setAssessmentQuestions] = useState([]);
    const [currentRecording, setCurrentRecording] = useState(null);
    const [recordings, setRecordings] = useState({});
    const [isRecording, setIsRecording] = useState(null);
    const mediaRecorderRef = useRef(null);
    const audioChunksRef = useRef([]);
    const navigate = useNavigate();
    const [showAlert, setShowAlert] = useState(false);
    const alertTimeoutRef = useRef(null);

    const handleGeneratePlan = async () => {
        const username = localStorage.getItem("patient");
        if (!username) {
            alert("You must be logged in as a patient.");
            return;
        }

        setLoading(true);
        try {
            const res = await axios.post("/generate-plan", {
                username,
                disorder_type: disorder
            });
            setPlan(res.data.plan);
            setExpandedWeeks({});
            const initialCompletedState = {
                1: false,
                2: false,
                3: false
            };
            setCompletedWeeks(initialCompletedState);
            setShowAssessment(false);
            setIsAssessmentExpanded(false);
            setIsReferencesExpanded(false);

            // Reset recording states
            setAssessmentQuestions([]);
            setIsRecording(null);
            if (mediaRecorderRef.current && mediaRecorderRef.current.state === "recording") {
                mediaRecorderRef.current.stop();
                mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
            }
            mediaRecorderRef.current = null;
            audioChunksRef.current = [];

        } catch (err) {
            alert("Failed to generate plan: " + (err.response?.data?.error || err.message));
        } finally {
            setLoading(false);
        }
    };

    const fetchAssessmentQuestions = async () => {
        try {
            const response = await axios.post("/get-assessment-questions", {
                disorder_type: disorder
            });
            setAssessmentQuestions(response.data.questions);
        } catch (error) {
            console.error("Failed to fetch questions:", error);
            alert("Failed to load questions");
        }
    };

    const showTemporaryAlert = () => {
        setShowAlert(true);
        // Clear any existing timeout
        if (alertTimeoutRef.current) {
            clearTimeout(alertTimeoutRef.current);
        }
        // Hide alert after 1.5 seconds
        alertTimeoutRef.current = setTimeout(() => {
            setShowAlert(false);
        }, 1500);
    };

    // Cleanup timeout on component unmount
    useEffect(() => {
        return () => {
            if (alertTimeoutRef.current) {
                clearTimeout(alertTimeoutRef.current);
            }
        };
    }, []);

    const startRecording = async (questionId) => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            const mediaRecorder = new MediaRecorder(stream);
            mediaRecorderRef.current = mediaRecorder;

            const chunks = [];
            mediaRecorder.ondataavailable = (e) => chunks.push(e.data);

            mediaRecorder.onstop = async () => {
                const blob = new Blob(chunks, { type: 'audio/wav' });
                const formData = new FormData();
                formData.append('audio', blob, `${questionId}.wav`);
                formData.append('disorder_type', disorder);

                try {
                    await axios.post('/save-recording', formData);
                    showTemporaryAlert(); // Show temporary alert instead of modal
                } catch (error) {
                    console.error('Error saving recording:', error);
                    alert('Failed to save recording'); // Keep error alert as modal
                }
            };

            mediaRecorder.start();
            setIsRecording(questionId);
        } catch (error) {
            console.error('Error starting recording:', error);
            alert('Could not access microphone');
        }
    };

    const stopRecording = () => {
        if (mediaRecorderRef.current && mediaRecorderRef.current.state === "recording") {
            mediaRecorderRef.current.stop();
            mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
            setIsRecording(null);
        }
    };

    useEffect(() => {
        handleGeneratePlan();
    }, [disorder]);

    useEffect(() => {
        if (showAssessment) {
            fetchAssessmentQuestions();
        }
    }, [showAssessment]);

    const handleComplete = (weekNumber) => {
        const newCompletedWeeks = {
            ...completedWeeks,
            [weekNumber]: !completedWeeks[weekNumber]
        };
        setCompletedWeeks(newCompletedWeeks);

        if (!completedWeeks[weekNumber]) {
            setExpandedWeeks(prev => ({
                ...prev,
                [weekNumber]: false
            }));
        }

        const allWeeksCompleted = [1, 2, 3].every(week => newCompletedWeeks[week]);
        if (allWeeksCompleted) {
            setShowAssessment(true);
            setIsAssessmentExpanded(true);
        } else {
            setShowAssessment(false);
        }
    };

    const parseWeeklyPlans = (planText) => {
        if (!planText) return [];

        const weeks = [];
        const weekRegex = /Week (\d+):/g;
        let lastIndex = 0;
        let match;

        while ((match = weekRegex.exec(planText)) !== null) {
            const weekNumber = parseInt(match[1]);
            if (weekNumber <= 3) {
                const startIndex = match.index;
                const nextWeekIndex = planText.indexOf("Week " + (weekNumber + 1) + ":", startIndex);
                const endIndex = nextWeekIndex !== -1 ? nextWeekIndex : planText.length;

                const weekContent = planText.substring(startIndex, endIndex).trim();

                // Extract the full title from the first line
                const firstLine = weekContent.split('\n')[0].trim();
                const title = firstLine.replace(/\*\*/g, '').trim();

                // Split the title into main title and subtitle if it contains " - "
                const [mainTitle, ...subtitleParts] = title.split(' - ');
                const subtitle = subtitleParts.join(' - ');

                weeks.push({
                    number: weekNumber,
                    content: weekContent,
                    title: mainTitle,
                    subtitle: subtitle || ''
                });
            }
            lastIndex = match.index;
        }

        return weeks;
    };

    const formatContent = (content) => {
        const lines = content.split('\n');
        const formattedContent = [];

        lines.forEach((line, index) => {
            const trimmedLine = line.trim();
            if (!trimmedLine) return;

            // Skip the title line as we're handling it separately
            if (index === 0) return;

            const indentLevel = (line.match(/^\s*\*+\s*/) || [''])[0].length;
            const cleanedLine = trimmedLine.replace(/\*\*/g, '').replace(/^\* /, '');

            formattedContent.push({
                text: cleanedLine,
                type: indentLevel === 0 ? 'section' : 'item',
                indent: Math.floor(indentLevel / 2)
            });
        });

        return formattedContent;
    };

    const toggleWeek = (weekNumber) => {
        setExpandedWeeks(prev => ({
            ...prev,
            [weekNumber]: !prev[weekNumber]
        }));
    };

    const weeklyPlans = parseWeeklyPlans(plan);

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
            {/* Add temporary alert */}
            {showAlert && (
                <div style={{
                    position: "fixed",
                    top: "20px",
                    right: "20px",
                    background: "#4ade80",
                    color: "white",
                    padding: "12px 24px",
                    borderRadius: "8px",
                    boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                    zIndex: 1000,
                    animation: "fadeIn 0.3s ease-out"
                }}>
                    Recording saved successfully!
                </div>
            )}

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
                <h1 style={{
                    fontSize: "20px",
                    color: "#1e40af",
                    margin: 0,
                    fontWeight: "700"
                }}>Personalized Weekly Therapy Plan</h1>
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
                        transition: "all 0.2s ease"
                    }}
                >Back to Dashboard</button>
            </nav>

            {/* Main Content */}
            <div style={{
                maxWidth: "800px",
                margin: "0 auto",
                padding: "0 1.5rem"
            }}>
                {/* Disorder Type Selector */}
                <div style={{
                    background: "white",
                    padding: "1rem",
                    borderRadius: "8px",
                    marginBottom: "1rem",
                    boxShadow: "0 1px 2px rgba(0,0,0,0.05)"
                }}>
                    <label style={{
                        fontSize: "14px",
                        fontWeight: "500",
                        color: "#4b5563",
                        marginRight: "0.75rem"
                    }}>Select Disorder Type:</label>
                    <select
                        value={disorder}
                        onChange={(e) => setDisorder(e.target.value)}
                        style={{
                            padding: "0.4rem 0.75rem",
                            fontSize: "14px",
                            border: "1px solid #e2e8f0",
                            borderRadius: "6px",
                            color: "#1e293b",
                            outline: "none"
                        }}
                    >
                        <option value="articulation">Articulation</option>
                        <option value="fluency">Fluency</option>
                        <option value="voice">Voice</option>
                        <option value="language">Language</option>
                        <option value="motor_speech">Motor Speech</option>
                    </select>
                </div>

                {loading ? (
                    <div style={{
                        background: "white",
                        padding: "1rem",
                        borderRadius: "8px",
                        textAlign: "center",
                        color: "#4b5563"
                    }}>Generating plan...</div>
                ) : (
                    <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                        {/* Weekly Plans */}
                        {weeklyPlans.map((week) => (
                            <div
                                key={week.number}
                                style={{
                                    background: "white",
                                    borderRadius: "8px",
                                    overflow: "hidden",
                                    boxShadow: "0 1px 2px rgba(0,0,0,0.05)"
                                }}
                            >
                                <div
                                    onClick={() => toggleWeek(week.number)}
                                    style={{
                                        padding: "1rem",
                                        backgroundColor: completedWeeks[week.number] ? "#f0fdf4" : "#f8fafc",
                                        display: "flex",
                                        justifyContent: "space-between",
                                        alignItems: "center",
                                        cursor: "pointer",
                                        borderBottom: expandedWeeks[week.number] ? "1px solid #e2e8f0" : "none"
                                    }}
                                >
                                    <div style={{ flex: 1 }}>
                                        <div style={{
                                            display: "flex",
                                            alignItems: "center",
                                            gap: "0.75rem",
                                            marginBottom: "0.25rem"
                                        }}>
                                            <h3 style={{
                                                margin: 0,
                                                fontSize: "16px",
                                                fontWeight: "600",
                                                color: completedWeeks[week.number] ? "#166534" : "#1e293b"
                                            }}>{week.title}</h3>
                                            {completedWeeks[week.number] && (
                                                <span style={{
                                                    fontSize: "12px",
                                                    color: "#166534",
                                                    background: "#dcfce7",
                                                    padding: "0.25rem 0.5rem",
                                                    borderRadius: "4px",
                                                    fontWeight: "500"
                                                }}>Completed</span>
                                            )}
                                        </div>
                                        {week.subtitle && (
                                            <p style={{
                                                margin: "0.25rem 0 0 0",
                                                fontSize: "14px",
                                                color: "#6b7280",
                                                fontStyle: "italic"
                                            }}>
                                                {week.subtitle}
                                            </p>
                                        )}
                                    </div>
                                    <span style={{ color: "#64748b", marginLeft: "1rem" }}>
                                        {expandedWeeks[week.number] ? "▼" : "▶"}
                                    </span>
                                </div>
                                {expandedWeeks[week.number] && (
                                    <div style={{ padding: "1.5rem" }}>
                                        {formatContent(week.content).map((item, index) => (
                                            <div
                                                key={index}
                                                style={{
                                                    marginLeft: `${item.indent * 1.5}rem`,
                                                    marginBottom: "0.75rem",
                                                    color: item.type === 'section' ? "#1e40af" : "#4b5563",
                                                    fontSize: item.type === 'section' ? "15px" : "14px",
                                                    fontWeight: item.type === 'section' ? "600" : "400",
                                                    lineHeight: "1.5"
                                                }}
                                            >
                                                {item.text}
                                            </div>
                                        ))}
                                        <div style={{
                                            display: "flex",
                                            justifyContent: "flex-end",
                                            marginTop: "1.5rem"
                                        }}>
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleComplete(week.number);
                                                }}
                                                style={{
                                                    padding: "0.5rem 1rem",
                                                    fontSize: "14px",
                                                    color: completedWeeks[week.number] ? "#dc2626" : "#166534",
                                                    background: completedWeeks[week.number] ? "#fee2e2" : "#dcfce7",
                                                    border: "none",
                                                    borderRadius: "6px",
                                                    cursor: "pointer",
                                                    fontWeight: "500",
                                                    transition: "all 0.2s ease"
                                                }}
                                            >
                                                {completedWeeks[week.number] ? "Mark as Incomplete" : "Mark as Complete"}
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}

                        {/* References Section */}
                        <div style={{
                            background: "white",
                            borderRadius: "8px",
                            overflow: "hidden",
                            boxShadow: "0 1px 2px rgba(0,0,0,0.05)"
                        }}>
                            <div
                                onClick={() => setIsReferencesExpanded(!isReferencesExpanded)}
                                style={{
                                    padding: "1rem",
                                    backgroundColor: "#f8fafc",
                                    display: "flex",
                                    justifyContent: "space-between",
                                    alignItems: "center",
                                    cursor: "pointer"
                                }}
                            >
                                <h3 style={{
                                    margin: 0,
                                    fontSize: "16px",
                                    fontWeight: "600",
                                    color: "#1e293b"
                                }}>References</h3>
                                <span style={{ color: "#64748b" }}>
                                    {isReferencesExpanded ? "▼" : "▶"}
                                </span>
                            </div>
                            {isReferencesExpanded && (
                                <div style={{ padding: "1rem" }}>
                                    <div style={{
                                        color: "#4b5563",
                                        fontSize: "14px",
                                        lineHeight: "1.5"
                                    }}>
                                        <p style={{ margin: "0.5rem 0" }}>
                                            [1] American Speech-Language-Hearing Association. (2016). Scope of practice in speech-language pathology.
                                        </p>
                                        <p style={{ margin: "0.5rem 0" }}>
                                            [2] Guitar, B. (2013). Stuttering: An integrated approach to its nature and treatment.
                                        </p>
                                        <p style={{ margin: "0.5rem 0" }}>
                                            [3] Yorkston, K. M., Beukelman, D. R., Strand, E. A., & Bell, K. R. (2010). Management of motor speech disorders in children and adults.
                                        </p>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Final Assessment Section */}
                        {showAssessment && (
                            <div style={{
                                background: "white",
                                borderRadius: "8px",
                                padding: "1.5rem",
                                marginBottom: "2rem",
                                boxShadow: "0 1px 3px rgba(0,0,0,0.1)"
                            }}>
                                <h2 style={{
                                    fontSize: "1.25rem",
                                    color: "#1e40af",
                                    marginBottom: "1.5rem"
                                }}>
                                    Final Assessment
                                </h2>

                                {assessmentQuestions.map((question, index) => (
                                    <div
                                        key={question.id}
                                        style={{
                                            marginBottom: "1.5rem",
                                            padding: "1rem",
                                            background: "#f8fafc",
                                            borderRadius: "6px"
                                        }}
                                    >
                                        <p style={{
                                            fontSize: "1rem",
                                            color: "#1e293b",
                                            marginBottom: "1rem"
                                        }}>
                                            {index + 1}. {question.question}
                                        </p>

                                        <button
                                            onClick={() => isRecording === question.id ? stopRecording() : startRecording(question.id)}
                                            style={{
                                                padding: "0.5rem 1rem",
                                                background: isRecording === question.id ? "#ef4444" : "#2563eb",
                                                color: "white",
                                                border: "none",
                                                borderRadius: "6px",
                                                cursor: "pointer"
                                            }}
                                            disabled={isRecording !== null && isRecording !== question.id}
                                        >
                                            {isRecording === question.id ? "Stop Recording" : "Record Answer"}
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
