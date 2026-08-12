import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

const API_URL = "http://localhost:5000/api/attempts";

function Results() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchResult = async () => {
            try {
                const response = await fetch(`${API_URL}/${id}`);

                if (!response.ok) {
                    throw new Error("Failed to fetch result");
                }

                const data = await response.json();
                setResult(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchResult();
    }, [id]);

    if (loading) {
        return <p>Loading result...</p>;
    }

    if (error) {
        return <p>{error}</p>;
    }

    if (!result) {
        return <p>Result not found.</p>;
    }

    return (
        <div>
            <h1>Quiz Result</h1>

            <h2>{result.quiz_title}</h2>

            <p>
                Score: {result.score} / {result.total_questions}
            </p>

            <p>
                Percentage: {result.percentage}%
            </p>

            <p>
                Correct Answers: {result.correct_answers}
            </p>

            <p>
                Incorrect Answers: {result.incorrect_answers}
            </p>

            <p>
                Unanswered: {result.unanswered}
            </p>

            <p>
                Time Taken: {result.time_taken} seconds
            </p>

            <p>
                Status:{" "}
                {Number(result.percentage) >= 40
                    ? "Passed"
                    : "Failed"}
            </p>

            <hr />

            <h2>Answer Review</h2>

            {result.answers.map((answer, index) => (
                <div key={answer.question_id}>
                    <h3>
                        Question {index + 1}
                    </h3>

                    <p>
                        {answer.question_text}
                    </p>

                    <p>
                        Your Answer:{" "}
                        {answer.selected_answer ||
                            "Not Answered"}
                    </p>

                    <p>
                        Correct Answer:{" "}
                        {answer.correct_answer}
                    </p>

                    <p>
                        {answer.is_correct
                            ? "Correct"
                            : "Incorrect"}
                    </p>

                    <hr />
                </div>
            ))}

            <button
                onClick={() =>
                    navigate("/student/quizzes")
                }
            >
                Back to Quizzes
            </button>
        </div>
    );
}

export default Results;