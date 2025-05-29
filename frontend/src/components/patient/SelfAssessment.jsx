import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Logo from "../Logo";

const articulationQuestions = [
    "Do you substitute sounds (e.g., 'thun' for 'sun')?",
    "Do you omit sounds in words (e.g., 'ca-' for 'cat')?",
    "Are distortions present in >30% of /s/, /z/, /r/, or /l/ sounds?",
    "Do errors persist in all word positions (initial/medial/final)?",
    "Has this continued beyond age 5?",
    "Do listeners misunderstand >40% of your speech?",
    "Do you avoid multisyllabic words (e.g., 'hippopotamus')?",
    "Have teachers/workplaces flagged speech clarity issues?",
    "Does oral motor weakness affect sound production?",
    "Are errors consistent across repetitions?",
    "Do you struggle with consonant clusters (e.g., 'splash')?",
    "Is there a history of chronic ear infections?",
    "Does hearing loss contribute to sound errors?",
    "Have orthodontic issues been diagnosed?",
    "Do you use compensatory articulation strategies?",
    "Are errors present in both spontaneous and imitated speech?",
    "Does stress/emotion worsen articulation?",
    "Have you received prior speech therapy without resolution?",
    "Are nasal emissions present during speech?",
    "Do you experience jaw fatigue during conversation?"
];

const fluencyQuestions = [
    "Do blocks last >2 seconds in >30% of utterances?",
    "Are syllable repetitions >3 iterations per instance?",
    "Do secondary behaviors occur (eye blinking, head nods)?",
    "Has stuttering persisted >18 months?",
    "Do avoidance behaviors impact daily communication?",
    "Is speech rate <100 words/minute?",
    "Does tension/pain accompany disfluencies?",
    "Are fillers (\"um\") used >10 times/minute?",
    "Does stuttering occur in >25% of sentences?",
    "Have negative self-perceptions developed?",
    "Does anxiety increase disfluency frequency?",
    "Are breathing patterns discoordinated with speech?",
    "Does singing/whispering reduce stuttering?",
    "Is there family history of fluency disorders?",
    "Do disfluencies persist in choral reading?",
    "Have academic/work opportunities been limited?",
    "Do caffeine/stress exacerbate symptoms?",
    "Is there concomitant cluttering?",
    "Have social interactions decreased due to stuttering?",
    "Does delayed auditory feedback improve fluency?",
];

const voiceQuestions = [
    "Is hoarseness present >50% of waking hours?",
    "Can you sustain 'ah' <10 seconds?",
    "Does pitch mismatch gender/age norms?",
    "Is vocal fatigue reported after <15 mins of use?",
    "Are vocal fold lesions/nodules diagnosed?",
    "Does reflux affect voice quality?",
    "Is there smoking/vocal overuse history?",
    "Are breathy/rough qualities dominant?",
    "Does voice 'cut out' mid-phrase?",
    "Have you modified career due to voice issues?",
    "Is maximum phonation time <7 seconds?",
    "Does hydration status significantly affect voice?",
    "Are pitch breaks/common in speech?",
    "Does laryngeal tension/pain occur?",
    "Have ENT evaluations shown structural abnormalities?",
    "Is there diplophonia (double pitch)?",
    "Does vocal tremor affect sustained phonation?",
    "Are nocturnal breathing issues present?",
    "Does voice rest provide >50% improvement?",
    "Is there history of intubation-related trauma?",
];

const languageQuestions = [
    "Do you struggle with 3-step commands?",
    "Is naming accuracy <70% on 20-item test?",
    "Are syntactic errors present in >30% of utterances?",
    "Do you use neologisms/nonwords frequently?",
    "Is reading comprehension below grade level?",
    "Does writing contain semantic paraphasias?",
    "Are abstract concepts poorly understood?",
    "Do you repeat phrases verbatim without comprehension?",
    "Has this persisted >6 months post-onset?",
    "Do gestures substitute for verbal communication?",
    "Are turn-taking rules in conversation impaired?",
    "Is auditory processing time >5 seconds?",
    "Do you misunderstand sarcasm/idioms >50%?",
    "Is MLU <4 words in spontaneous speech?",
    "Are word-finding pauses >3 seconds common?",
    "Does confrontation naming elicit circumlocution?",
    "Are tense markers omitted >25%?",
    "Do you struggle with pronoun resolution?",
    "Is narrative sequencing impaired?",
    "Have standardized test scores shown >1.5 SD below mean?",
];

function calculateSeverity(score, type) {
    if (type === "articulation") {
        if (score <= 5) return "Mild (PCC 85-100%)";
        if (score <= 12) return "Moderate (PCC 65-84%)";
        return "Severe (PCC <65%)";
    } else if (type === "fluency") {
        if (score <= 6) return "Mild (SSI-4 score ≤16)";
        if (score <= 14) return "Moderate (SSI-4 score 17-24)";
        return "Severe (SSI-4 score ≥25)";
    } else if (type === "voice") {
        if (score <= 6) return "Mild (DSI >-2)";
        if (score <= 12) return "Moderate (DSI -3 to -7)";
        return "Severe (DSI <-8)";
    } else if (type === "language") {
        if (score <= 7) return "Mild (WAB-AQ 75-93.7)";
        if (score <= 14) return "Moderate (WAB-AQ 40-74)";
        return "Severe (WAB-AQ <40)";
    }
    return "Unknown";
}

export default function SelfAssessment() {
    const navigate = useNavigate();
    const [step, setStep] = useState(1);
    const [articulationAnswers, setArticulationAnswers] = useState(Array(articulationQuestions.length).fill(null));
    const [fluencyAnswers, setFluencyAnswers] = useState(Array(fluencyQuestions.length).fill(null));
    const [voiceAnswers, setVoiceAnswers] = useState(Array(voiceQuestions.length).fill(null));
    const [languageAnswers, setLanguageAnswers] = useState(Array(languageQuestions.length).fill(null));
    const [results, setResults] = useState({});

    const handleChange = (stepType, index, value) => {
        const updateAnswers = (setter, answers) => {
            const updated = [...answers];
            updated[index] = value;
            setter(updated);
        };

        if (stepType === "articulation") updateAnswers(setArticulationAnswers, articulationAnswers);
        else if (stepType === "fluency") updateAnswers(setFluencyAnswers, fluencyAnswers);
        else if (stepType === "voice") updateAnswers(setVoiceAnswers, voiceAnswers);
        else if (stepType === "language") updateAnswers(setLanguageAnswers, languageAnswers);
    };

    const handleSubmit = () => {
        if (step === 1 && articulationAnswers.includes(null)) {
            alert("Please answer all questions in Step 1");
            return;
        }
        if (step === 2 && fluencyAnswers.includes(null)) {
            alert("Please answer all questions in Step 2");
            return;
        }
        if (step === 3 && voiceAnswers.includes(null)) {
            alert("Please answer all questions in Step 3");
            return;
        }
        if (step === 4 && languageAnswers.includes(null)) {
            alert("Please answer all questions in Step 4");
            return;
        }

        if (step === 1) {
            const yesCount = articulationAnswers.filter((a) => a === "yes").length;
            setResults((prev) => ({ ...prev, articulation: { yesCount, severity: calculateSeverity(yesCount, "articulation") } }));
            setStep(2);
        } else if (step === 2) {
            const yesCount = fluencyAnswers.filter((a) => a === "yes").length;
            setResults((prev) => ({ ...prev, fluency: { yesCount, severity: calculateSeverity(yesCount, "fluency") } }));
            setStep(3);
        } else if (step === 3) {
            const yesCount = voiceAnswers.filter((a) => a === "yes").length;
            setResults((prev) => ({ ...prev, voice: { yesCount, severity: calculateSeverity(yesCount, "voice") } }));
            setStep(4);
        } else if (step === 4) {
            const yesCount = languageAnswers.filter((a) => a === "yes").length;
            setResults((prev) => ({ ...prev, language: { yesCount, severity: calculateSeverity(yesCount, "language") } }));
        }
    };

    const renderQuestions = (questions, stepType, answers) => (
        <div style={{ marginTop: "1rem" }}>
            {questions.map((q, idx) => (
                <div key={idx} style={{
                    background: "white",
                    padding: "1rem",
                    borderRadius: "8px",
                    marginBottom: "0.75rem",
                    boxShadow: "0 1px 2px rgba(0,0,0,0.05)"
                }}>
                    <p style={{
                        fontSize: "15px",
                        color: "#1e293b",
                        marginBottom: "0.5rem",
                        fontWeight: "500"
                    }}>{idx + 1}. {q}</p>
                    <div style={{
                        display: "flex",
                        gap: "1rem"
                    }}>
                        <label style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "0.35rem",
                            cursor: "pointer"
                        }}>
                            <input
                                type="radio"
                                name={`${stepType}-${idx}`}
                                value="yes"
                                onChange={() => handleChange(stepType, idx, "yes")}
                                checked={answers[idx] === "yes"}
                                style={{ cursor: "pointer" }}
                            />
                            <span style={{ color: "#64748b", fontSize: "14px" }}>Yes</span>
                        </label>
                        <label style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "0.35rem",
                            cursor: "pointer"
                        }}>
                            <input
                                type="radio"
                                name={`${stepType}-${idx}`}
                                value="no"
                                onChange={() => handleChange(stepType, idx, "no")}
                                checked={answers[idx] === "no"}
                                style={{ cursor: "pointer" }}
                            />
                            <span style={{ color: "#64748b", fontSize: "14px" }}>No</span>
                        </label>
                    </div>
                </div>
            ))}
        </div>
    );

    const renderResults = (type, result) => (
        <div style={{
            background: "white",
            padding: "1rem",
            borderRadius: "8px",
            marginBottom: "0.75rem",
            boxShadow: "0 1px 2px rgba(0,0,0,0.05)"
        }}>
            <h3 style={{
                fontSize: "16px",
                color: "#1e40af",
                marginBottom: "0.5rem",
                fontWeight: "600"
            }}>{type} Assessment Result</h3>
            <p style={{
                color: "#64748b",
                fontSize: "14px",
                marginBottom: "0.25rem"
            }}>Yes Answers: {result.yesCount}</p>
            <p style={{
                color: "#64748b",
                fontSize: "14px",
                fontWeight: "500"
            }}>Severity: {result.severity}</p>
        </div>
    );

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
                alignItems: "center"
            }}>
                <h1 style={{
                    fontSize: "20px",
                    color: "#1e40af",
                    margin: 0,
                    fontWeight: "700"
                }}>Self Assessment</h1>
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
                margin: "1rem auto",
                padding: "0 1.5rem"
            }}>
                {/* Progress Bar */}
                <div style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: "1rem",
                    background: "white",
                    padding: "0.75rem",
                    borderRadius: "8px",
                    boxShadow: "0 1px 2px rgba(0,0,0,0.05)"
                }}>
                    {[1, 2, 3, 4].map((s) => (
                        <div key={s} style={{
                            display: "flex",
                            alignItems: "center"
                        }}>
                            <div style={{
                                width: "28px",
                                height: "28px",
                                borderRadius: "50%",
                                background: step >= s ? "#1e40af" : "#e2e8f0",
                                color: "white",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                fontWeight: "600",
                                fontSize: "13px"
                            }}>{s}</div>
                            {s < 4 && (
                                <div style={{
                                    height: "2px",
                                    width: "80px",
                                    background: step > s ? "#1e40af" : "#e2e8f0",
                                    margin: "0 0.35rem"
                                }} />
                            )}
                        </div>
                    ))}
                </div>

                {/* Assessment Steps */}
                <div style={{
                    background: "white",
                    padding: "1.5rem",
                    borderRadius: "12px",
                    boxShadow: "0 2px 4px rgba(0,0,0,0.1)"
                }}>
                    {step === 1 && (
                        <>
                            <h2 style={{
                                fontSize: "20px",
                                color: "#1e293b",
                                marginBottom: "0.75rem",
                                fontWeight: "600"
                            }}>Step 1: Articulation Disorders Assessment</h2>
                            {renderQuestions(articulationQuestions, "articulation", articulationAnswers)}
                        </>
                    )}
                    {step === 2 && (
                        <>
                            <h2 style={{
                                fontSize: "20px",
                                color: "#1e293b",
                                marginBottom: "0.75rem",
                                fontWeight: "600"
                            }}>Step 2: Fluency Disorders Assessment</h2>
                            {renderQuestions(fluencyQuestions, "fluency", fluencyAnswers)}
                        </>
                    )}
                    {step === 3 && (
                        <>
                            <h2 style={{
                                fontSize: "20px",
                                color: "#1e293b",
                                marginBottom: "0.75rem",
                                fontWeight: "600"
                            }}>Step 3: Voice Disorders Assessment</h2>
                            {renderQuestions(voiceQuestions, "voice", voiceAnswers)}
                        </>
                    )}
                    {step === 4 && (
                        <>
                            <h2 style={{
                                fontSize: "20px",
                                color: "#1e293b",
                                marginBottom: "0.75rem",
                                fontWeight: "600"
                            }}>Step 4: Language Disorders Assessment</h2>
                            {renderQuestions(languageQuestions, "language", languageAnswers)}
                        </>
                    )}

                    {/* Results Section */}
                    {results.articulation && step >= 2 && renderResults("Step 1", results.articulation)}
                    {results.fluency && step >= 3 && renderResults("Step 2", results.fluency)}
                    {results.voice && step >= 4 && renderResults("Step 3", results.voice)}
                    {results.language && step === 4 && renderResults("Step 4", results.language)}

                    {/* Submit Button */}
                    <button
                        onClick={handleSubmit}
                        style={{
                            width: "100%",
                            padding: "0.75rem",
                            fontSize: "15px",
                            fontWeight: "600",
                            color: "white",
                            backgroundColor: "#1e40af",
                            border: "none",
                            borderRadius: "6px",
                            cursor: "pointer",
                            marginTop: "1.5rem",
                            transition: "transform 0.2s ease, box-shadow 0.2s ease"
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.transform = "translateY(-2px)";
                            e.currentTarget.style.boxShadow = "0 4px 6px rgba(0, 0, 0, 0.1)";
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.transform = "translateY(0)";
                            e.currentTarget.style.boxShadow = "none";
                        }}
                    >
                        {step < 4 ? `Continue to Step ${step + 1}` : "Complete Assessment"}
                    </button>
                </div>
            </div>
        </div>
    );
}