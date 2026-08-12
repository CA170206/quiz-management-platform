import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const QUIZZES_API = "http://localhost:5000/api/quizzes";
const LEADERBOARD_API =
    "http://localhost:5000/api/attempts/leaderboard";

function Dashboard() {
    const navigate = useNavigate();

    const [quizzes, setQuizzes] = useState([]);
    const [leaderboard, setLeaderboard] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const [quizResponse, leaderboardResponse] =
                    await Promise.all([
                        fetch(QUIZZES_API),
                        fetch(LEADERBOARD_API),
                    ]);

                if (!quizResponse.ok) {
                    throw new Error("Failed to fetch quizzes");
                }

                if (!leaderboardResponse.ok) {
                    throw new Error(
                        "Failed to fetch leaderboard"
                    );
                }

                const quizData = await quizResponse.json();
                const leaderboardData =
                    await leaderboardResponse.json();

                setQuizzes(quizData);
                setLeaderboard(leaderboardData);
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

    const currentUser = leaderboard.find(
        (player) => player.user_id === 1
    );

    return (
        <div>
            <h1>Student Dashboard</h1>

            <p>Welcome back!</p>

            <hr />

            <h2>Dashboard Overview</h2>

            <p>
                Available Quizzes: {quizzes.length}
            </p>

            <p>
                Best Score:{" "}
                {currentUser
                    ? currentUser.best_score
                    : 0}
            </p>

            <p>
                Best Percentage:{" "}
                {currentUser
                    ? `${currentUser.best_percentage}%`
                    : "0%"}
            </p>

            <p>
                Total Attempts:{" "}
                {currentUser
                    ? currentUser.attempts
                    : 0}
            </p>

            <hr />

            <h2>Available Quizzes</h2>

            {quizzes.length === 0 ? (
                <p>No quizzes available.</p>
            ) : (
                quizzes.map((quiz) => (
                    <div key={quiz.id}>
                        <h3>{quiz.title}</h3>

                        <p>{quiz.description}</p>

                        <p>
                            Duration: {quiz.duration} minutes
                        </p>

                        <button
                            onClick={() =>
                                navigate(
                                    `/student/quizzes/${quiz.id}`
                                )
                            }
                        >
                            View Quiz
                        </button>

                        <hr />
                    </div>
                ))
            )}

            <button
                onClick={() =>
                    navigate("/student/leaderboard")
                }
            >
                View Leaderboard
            </button>

            <br />
            <br />

            <button
                onClick={() =>
                    navigate("/student/quizzes")
                }
            >
                View All Quizzes
            </button>
        </div>
    );
}

export default Dashboard;