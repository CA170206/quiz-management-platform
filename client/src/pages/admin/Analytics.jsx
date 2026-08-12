import { useEffect, useState } from "react";

const USERS_API =
    "http://localhost:5000/api/users";

const QUIZZES_API =
    "http://localhost:5000/api/quizzes";

const QUESTIONS_API =
    "http://localhost:5000/api/questions";

const ATTEMPTS_API =
    "http://localhost:5000/api/attempts";

function Analytics() {
    const [stats, setStats] = useState({
        users: 0,
        quizzes: 0,
        questions: 0,
        attempts: 0,
    });

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchAnalytics = async () => {
            try {
                setLoading(true);
                setError("");

                const [
                    usersResponse,
                    quizzesResponse,
                    questionsResponse,
                    attemptsResponse,
                ] = await Promise.all([
                    fetch(USERS_API),
                    fetch(QUIZZES_API),
                    fetch(QUESTIONS_API),
                    fetch(ATTEMPTS_API),
                ]);

                const users = usersResponse.ok
                    ? await usersResponse.json()
                    : [];

                const quizzes = quizzesResponse.ok
                    ? await quizzesResponse.json()
                    : [];

                const questions =
                    questionsResponse.ok
                        ? await questionsResponse.json()
                        : [];

                const attempts =
                    attemptsResponse.ok
                        ? await attemptsResponse.json()
                        : [];

                setStats({
                    users: Array.isArray(users)
                        ? users.length
                        : 0,

                    quizzes: Array.isArray(quizzes)
                        ? quizzes.length
                        : 0,

                    questions: Array.isArray(
                        questions
                    )
                        ? questions.length
                        : 0,

                    attempts: Array.isArray(
                        attempts
                    )
                        ? attempts.length
                        : 0,
                });
            } catch (err) {
                setError(
                    "Unable to load analytics."
                );
            } finally {
                setLoading(false);
            }
        };

        fetchAnalytics();
    }, []);

    const cards = [
        {
            title: "Total Users",
            value: stats.users,
            icon: "👥",
            description:
                "Registered users",
        },
        {
            title: "Total Quizzes",
            value: stats.quizzes,
            icon: "📝",
            description:
                "Available quizzes",
        },
        {
            title: "Question Bank",
            value: stats.questions,
            icon: "❓",
            description:
                "Total questions",
        },
        {
            title: "Quiz Attempts",
            value: stats.attempts,
            icon: "📊",
            description:
                "Total attempts",
        },
    ];

    return (
        <div className="min-h-screen bg-slate-50 px-6 py-10">
            <div className="mx-auto max-w-7xl">

                {/* Header */}
                <div className="mb-8">
                    <p className="text-sm font-semibold text-blue-600">
                        Administration
                    </p>

                    <h1 className="mt-1 text-3xl font-bold text-slate-900">
                        Platform Analytics
                    </h1>

                    <p className="mt-2 text-slate-500">
                        Overview of activity across
                        QuizMaster.
                    </p>
                </div>

                {/* Error */}
                {error && (
                    <div className="mb-6 rounded-xl bg-red-50 px-5 py-4 text-sm text-red-600">
                        {error}
                    </div>
                )}

                {/* Stats */}
                <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">

                    {cards.map((card) => (
                        <div
                            key={card.title}
                            className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200"
                        >

                            <div className="flex items-center justify-between">

                                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-xl">
                                    {card.icon}
                                </div>

                            </div>

                            <p className="mt-6 text-sm font-medium text-slate-500">
                                {card.title}
                            </p>

                            <p className="mt-1 text-3xl font-bold text-slate-900">
                                {loading
                                    ? "—"
                                    : card.value}
                            </p>

                            <p className="mt-2 text-xs text-slate-400">
                                {card.description}
                            </p>

                        </div>
                    ))}

                </div>

                {/* Overview */}
                <div className="mt-8 grid gap-6 lg:grid-cols-2">

                    {/* Platform Overview */}
                    <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">

                        <h2 className="text-lg font-bold text-slate-900">
                            Platform Overview
                        </h2>

                        <p className="mt-1 text-sm text-slate-500">
                            Current system statistics.
                        </p>

                        <div className="mt-6 space-y-5">

                            <div>
                                <div className="mb-2 flex justify-between text-sm">
                                    <span className="font-medium text-slate-600">
                                        Users
                                    </span>

                                    <span className="font-bold text-slate-900">
                                        {stats.users}
                                    </span>
                                </div>

                                <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                                    <div
                                        className="h-full rounded-full bg-blue-600"
                                        style={{
                                            width: "75%",
                                        }}
                                    />
                                </div>
                            </div>

                            <div>
                                <div className="mb-2 flex justify-between text-sm">
                                    <span className="font-medium text-slate-600">
                                        Quizzes
                                    </span>

                                    <span className="font-bold text-slate-900">
                                        {stats.quizzes}
                                    </span>
                                </div>

                                <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                                    <div
                                        className="h-full rounded-full bg-blue-500"
                                        style={{
                                            width: "55%",
                                        }}
                                    />
                                </div>
                            </div>

                            <div>
                                <div className="mb-2 flex justify-between text-sm">
                                    <span className="font-medium text-slate-600">
                                        Questions
                                    </span>

                                    <span className="font-bold text-slate-900">
                                        {stats.questions}
                                    </span>
                                </div>

                                <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                                    <div
                                        className="h-full rounded-full bg-blue-400"
                                        style={{
                                            width: "85%",
                                        }}
                                    />
                                </div>
                            </div>

                        </div>
                    </div>

                    {/* Admin Info */}
                    <div className="rounded-2xl bg-slate-900 p-6 text-white shadow-sm">

                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-600 text-xl">
                            🛡️
                        </div>

                        <h2 className="mt-6 text-xl font-bold">
                            Administrator Overview
                        </h2>

                        <p className="mt-2 text-sm leading-6 text-slate-400">
                            Use the administration panel to
                            manage users, categories,
                            questions, quizzes, and monitor
                            platform activity.
                        </p>

                        <div className="mt-6 grid grid-cols-2 gap-3">

                            <div className="rounded-xl bg-white/5 p-4">
                                <p className="text-xs text-slate-400">
                                    Users
                                </p>

                                <p className="mt-1 text-xl font-bold">
                                    {stats.users}
                                </p>
                            </div>

                            <div className="rounded-xl bg-white/5 p-4">
                                <p className="text-xs text-slate-400">
                                    Attempts
                                </p>

                                <p className="mt-1 text-xl font-bold">
                                    {stats.attempts}
                                </p>
                            </div>

                        </div>

                    </div>

                </div>

            </div>
        </div>
    );
}

export default Analytics;