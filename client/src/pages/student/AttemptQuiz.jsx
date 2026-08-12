import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

const QUESTIONS_API = "http://localhost:5000/api/questions";
const QUIZ_API = "http://localhost:5000/api/quizzes";
const ATTEMPTS_API = "http://localhost:5000/api/attempts";

function AttemptQuiz() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [quiz, setQuiz] = useState(null);
    const [questions, setQuestions] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [answers, setAnswers] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [timeLeft, setTimeLeft] = useState(0);
    const [submitting, setSubmitting] = useState(false);

    // Fetch quiz and questions
    useEffect(() => {
        const fetchQuizData = async () => {
            try {
                const [quizResponse, questionsResponse] =
                    await Promise.all([
                        fetch(`${QUIZ_API}/${id}`),
                        fetch(`${QUESTIONS_API}/quiz/${id}`),
                    ]);

                if (!quizResponse.ok) {
                    throw new Error("Failed to fetch quiz");
                }

                if (!questionsResponse.ok) {
                    throw new Error("Failed to fetch questions");
                }

                const quizData = await quizResponse.json();
                const questionsData =
                    await questionsResponse.json();

                setQuiz(quizData);
                setQuestions(questionsData);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchQuizData();
    }, [id]);

    // Set timer using quiz duration
    useEffect(() => {
        if (!quiz) {
            return;
        }

        setTimeLeft(quiz.duration * 60);
    }, [quiz]);

    // Countdown timer
    useEffect(() => {
        if (timeLeft <= 0) {
            return;
        }

        const timer = setInterval(() => {
            setTimeLeft((prev) => prev - 1);
        }, 1000);

        return () => clearInterval(timer);
    }, [timeLeft]);

    // Handle answer selection
    const handleAnswer = (answer) => {
        setAnswers({
            ...answers,
            [questions[currentIndex].id]: answer,
        });
    };

    // Submit quiz
    const handleSubmit = async () => {
        try {
            setSubmitting(true);
            setError("");

            const totalTime = quiz.duration * 60;
            const timeTaken = totalTime - timeLeft;

            const response = await fetch(ATTEMPTS_API, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    user_id: 1,
                    quiz_id: Number(id),
                    answers,
                    time_taken: timeTaken,
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message || "Failed to submit quiz"
                );
            }

            navigate(`/student/results/${data.attempt.id}`);
        } catch (err) {
            setError(err.message);
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return <p>Loading quiz...</p>;
    }

    if (error) {
        return <p>{error}</p>;
    }

    if (!quiz) {
        return <p>Quiz not found.</p>;
    }

    if (questions.length === 0) {
        return <p>No questions found for this quiz.</p>;
    }

    const currentQuestion = questions[currentIndex];

    return (
        <div>
            <h1>{quiz.title}</h1>

            <p>
                Time Left:{" "}
                {Math.floor(timeLeft / 60)}:
                {String(timeLeft % 60).padStart(2, "0")}
            </p>

            <p>
                Question {currentIndex + 1} of{" "}
                {questions.length}
            </p>

            <h2>{currentQuestion.question_text}</h2>

            {[
                currentQuestion.option_a,
                currentQuestion.option_b,
                currentQuestion.option_c,
                currentQuestion.option_d,
            ].map((option, index) => (
                <div key={index}>
                    <label>
                        <input
                            type="radio"
                            name={`question-${currentQuestion.id}`}
                            value={option}
                            checked={
                                answers[currentQuestion.id] ===
                                option
                            }
                            onChange={() =>
                                handleAnswer(option)
                            }
                        />

                        {option}
                    </label>
                </div>
            ))}

            <br />

            <button
                disabled={currentIndex === 0}
                onClick={() =>
                    setCurrentIndex(currentIndex - 1)
                }
            >
                Previous
            </button>

            {currentIndex < questions.length - 1 ? (
                <button
                    onClick={() =>
                        setCurrentIndex(currentIndex + 1)
                    }
                >
                    Next
                </button>
            ) : (
                <button
                    onClick={handleSubmit}
                    disabled={submitting}
                >
                    {submitting
                        ? "Submitting..."
                        : "Submit Quiz"}
                </button>
            )}
        </div>
    );
}

export default AttemptQuiz;