import { useEffect, useState } from "react";

const CATEGORIES_API = "http://localhost:5000/api/categories";
const QUESTIONS_API = "http://localhost:5000/api/questions";
const QUIZZES_API = "http://localhost:5000/api/quizzes";

function Dashboard() {
    const [categories, setCategories] = useState([]);
    const [questions, setQuestions] = useState([]);
    const [quizzes, setQuizzes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const [
                    categoriesResponse,
                    questionsResponse,
                    quizzesResponse,
                ] = await Promise.all([
                    fetch(CATEGORIES_API),
                    fetch(QUESTIONS_API),
                    fetch(QUIZZES_API),
                ]);

                if (!categoriesResponse.ok) {
                    throw new Error(
                        "Failed to fetch categories"
                    );
                }

                if (!questionsResponse.ok) {
                    throw new Error(
                        "Failed to fetch questions"
                    );
                }

                if (!quizzesResponse.ok) {
                    throw new Error(
                        "Failed to fetch quizzes"
                    );
                }

                const categoriesData =
                    await categoriesResponse.json();

                const questionsData =
                    await questionsResponse.json();

                const quizzesData =
                    await quizzesResponse.json();

                setCategories(categoriesData);
                setQuestions(questionsData);
                setQuizzes(quizzesData);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, []);

    if (loading) {
        return <p>Loading dashboard...</p>;
    }

    if (error) {
        return <p>{error}</p>;
    }

    return (
        <div>
            <h1>Admin Dashboard</h1>

            <p>Manage your quiz platform.</p>

            <hr />

            <h2>Overview</h2>

            <p>
                Total Categories: {categories.length}
            </p>

            <p>
                Total Questions: {questions.length}
            </p>

            <p>
                Total Quizzes: {quizzes.length}
            </p>
        </div>
    );
}

export default Dashboard;