// frontend/src/components/Doctor/ViewFeedback.js
import { useEffect, useState } from "react";
import axios from "../../services/api";

export default function ViewFeedback() {
    const [feedbackList, setFeedbackList] = useState([]);

    useEffect(() => {
        axios.get("/get-feedbacks").then(res => {
            setFeedbackList(res.data);
        });
    }, []);

    return (
        <div>
            <h2>Patient Feedback</h2>
            {feedbackList.map((f, i) => (
                <div key={i}>
                    <strong>{f.email}</strong>
                    <p>{f.message}</p>
                    <hr />
                </div>
            ))}
        </div>
    );
}
