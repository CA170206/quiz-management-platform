import { useEffect, useState } from "react";

const API_URL = "http://localhost:5000/api/quizzes";
const CATEGORY_API_URL = "http://localhost:5000/api/categories";

function QuizList() {
    const [quizzes, setQuizzes] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const fetchQuizzes = async () => {
        try {
            setLoading(true);
            setError("");

            const response = await fetch(API_URL);

            if (!response.ok) {
                throw new Error("Failed to fetch quizzes");
            }

            const data = await response.json();
            setQuizzes(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const fetchCategories = async () => {
        try {
            const response = await fetch(CATEGORY_API_URL);

            if (!response.ok) {
                throw new Error("Failed to fetch categories");
            }

            const data = await response.json();
            setCategories(data);
        } catch (err) {
            setError(err.message);
        }
    };

    useEffect(() => {
        fetchQuizzes();
        fetchCategories();
    }, []);

    const getCategoryName = (categoryId) => {
        const category = categories.find(
            (category) => category.id === categoryId
        );

        return category ? category.name : "Unknown";
    };

    return (
        <div>
            <h1>Available Quizzes</h1>

            <p>Select a quiz to start.</p>

            {error && <p>{error}</p>}

            {loading ? (
                <p>Loading quizzes...</p>
            ) : quizzes.length === 0 ? (
                <p>No quizzes available.</p>
            ) : (
                <div>
                    {quizzes.map((quiz) => (
                        <div key={quiz.id}>
                            <h2>{quiz.title}</h2>

                            <p>
                                Category:{" "}
                                {getCategoryName(quiz.category_id)}
                            </p>

                            <p>
                                {quiz.description}
                            </p>

                            <p>
                                Duration: {quiz.duration} minutes
                            </p>

                            <button
                            onClick={() =>
                              window.location.href = `/student/quizzes/${quiz.id}`
                              }
                            >
                              View Quiz
                              </button>

                            <hr />
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default QuizList;