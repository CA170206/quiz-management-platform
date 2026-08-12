import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

const API_URL = "http://localhost:5000/api/quizzes";

function QuizDetails() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [quiz, setQuiz] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchQuiz = async () => {
            try {
                const response = await fetch(`${API_URL}/${id}`);

                if (!response.ok) {
                    throw new Error("Failed to fetch quiz");
                }

                const data = await response.json();
                setQuiz(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchQuiz();
    }, [id]);

    if (loading) {
        return <p>Loading quiz...</p>;
    }

    if (error) {
        return <p>{error}</p>;
    }

    if (!quiz) {
        return <p>Quiz not found.</p>;
    }

    return (
        <div>
            <h1>{quiz.title}</h1>

            <p>{quiz.description}</p>

            <p>
                Duration: {quiz.duration} minutes
            </p>

            <button
                onClick={() =>
                    navigate(`/student/quizzes/${quiz.id}/attempt`)
                }
            >
                Start Quiz
            </button>

            <br />

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

export default QuizDetails;