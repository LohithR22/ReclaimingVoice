import { useState } from "react";
import axios from "../../services/api"; // adjust if path differs

export default function GeneratePlan() {
    const [disorder_type, setDisorderType] = useState("");
    const [age, setAge] = useState("");
    const [severity, setSeverity] = useState("");
    const [goals, setGoals] = useState("");
    const [history, setHistory] = useState("");
    const [plan, setPlan] = useState("");

    const handleGenerate = async () => {
        try {
            const res = await axios.post("/generate-plan", {
                disorder_type,
                age,
                severity,
                goals: goals.split(",").map((g) => g.trim()),
                history,
            });
            setPlan(res.data.plan);
        } catch (err) {
            alert(err.response?.data?.error || "Something went wrong");
        }
    };

    return (
        <div style={{ padding: "2rem", maxWidth: "700px", margin: "auto" }}>
            <h2>Generate Personalized Therapy Plan</h2>
            <input placeholder="Disorder Type" value={disorder_type} onChange={(e) => setDisorderType(e.target.value)} />
            <input placeholder="Age" value={age} onChange={(e) => setAge(e.target.value)} />
            <input placeholder="Severity" value={severity} onChange={(e) => setSeverity(e.target.value)} />
            <input placeholder="Goals (comma-separated)" value={goals} onChange={(e) => setGoals(e.target.value)} />
            <textarea placeholder="History" value={history} onChange={(e) => setHistory(e.target.value)} rows={4} />
            <button style={{ marginTop: "1rem" }} onClick={handleGenerate}>Generate Plan</button>

            {plan && (
                <div style={{ marginTop: "2rem", whiteSpace: "pre-wrap", background: "#f4f4f4", padding: "1rem" }}>
                    <h3>Generated Plan:</h3>
                    <p>{plan}</p>
                </div>
            )}
        </div>
    );
}
