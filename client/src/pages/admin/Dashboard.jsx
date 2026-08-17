import Navbar from "../../components/common/Navbar.jsx";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";

const API_URL =
    import.meta.env.VITE_API_URL ||
    "http://localhost:5000";

function AdminDashboard() {
    const [stats, setStats] = useState({
        users: 0,
        quizzes: 0,
        questions: 0,
        attempts: 0,
    });

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const token =
                    localStorage.getItem("token");

                const response = await fetch(
                    `${API_URL}/api/admin/analytics`,
                    {
                        headers: {
                            Authorization:
                                `Bearer ${token}`,
                        },
                    }
                );

                const data =
                    await response.json();

                if (!response.ok) {
                    throw new Error(
                        data.message ||
                            "Failed to load dashboard statistics"
                    );
                }

                setStats({
                    users:
                        Number(
                            data.users ??
                            data.total_users ??
                            data.total_students ??
                            0
                        ),

                    quizzes:
                        Number(
                            data.quizzes ??
                            data.total_quizzes ??
                            0
                        ),

                    questions:
                        Number(
                            data.questions ??
                            data.total_questions ??
                            0
                        ),

                    attempts:
                        Number(
                            data.attempts ??
                            data.total_attempts ??
                            0
                        ),
                });

            } catch (err) {
                console.error(
                    "Dashboard stats error:",
                    err
                );

                setError(
                    err.message ||
                        "Unable to load statistics"
                );
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, []);

    const cards = [
        {
            title: "Users",
            label: "Registered Users",
            value: stats.users,
            icon: "👥",
            color: "blue",
        },
        {
            title: "Quizzes",
            label: "Total Quizzes",
            value: stats.quizzes,
            icon: "📝",
            color: "purple",
        },
        {
            title: "Questions",
            label: "Total Questions",
            value: stats.questions,
            icon: "❓",
            color: "green",
        },
        {
            title: "Attempts",
            label: "Quiz Attempts",
            value: stats.attempts,
            icon: "📊",
            color: "orange",
        },
    ];

    return (
        <div className="min-h-screen bg-slate-50 px-4 py-6 sm:px-6 sm:py-10">

            <div className="mx-auto max-w-7xl">

                {/* Header */}

                <div className="mb-6 sm:mb-8">

                    <p className="text-sm font-semibold text-blue-600">
                        Administration
                    </p>

                    <h1 className="mt-1 text-2xl font-bold text-slate-900 sm:text-3xl">
                        Admin Dashboard
                    </h1>

                    <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500 sm:text-base">
                        Manage quizzes, questions, categories, and platform activity.
                    </p>

                </div>


                {/* Error */}

                {error && (
                    <div className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                        {error}
                    </div>
                )}


                {/* Stats */}

                <div className="grid gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-4">

                    {cards.map((card) => (

                        <div
                            key={card.title}
                            className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200 sm:p-6"
                        >

                            <div className="flex items-center justify-between gap-3">

                                <span
                                    className={`
                                        flex h-11 w-11 shrink-0
                                        items-center justify-center
                                        rounded-xl text-xl
                                        ${
                                            card.color === "blue"
                                                ? "bg-blue-50"
                                                : card.color === "purple"
                                                ? "bg-purple-50"
                                                : card.color === "green"
                                                ? "bg-green-50"
                                                : "bg-orange-50"
                                        }
                                    `}
                                >
                                    {card.icon}
                                </span>

                                <span
                                    className={`
                                        text-xs font-semibold
                                        ${
                                            card.color === "blue"
                                                ? "text-blue-600"
                                                : card.color === "purple"
                                                ? "text-purple-600"
                                                : card.color === "green"
                                                ? "text-green-600"
                                                : "text-orange-600"
                                        }
                                    `}
                                >
                                    {card.title}
                                </span>

                            </div>

                            <p className="mt-5 text-sm text-slate-500">
                                {card.label}
                            </p>

                            <p className="mt-1 text-3xl font-bold text-slate-900">
                                {loading
                                    ? "—"
                                    : card.value}
                            </p>

                        </div>

                    ))}

                </div>


                {/* Quick Actions */}

                <div className="mt-5 rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200 sm:mt-6 sm:p-6">

                    <div>

                        <h2 className="text-lg font-bold text-slate-900">
                            Quick Actions
                        </h2>

                        <p className="mt-1 text-sm text-slate-500">
                            Manage your quiz platform.
                        </p>

                    </div>


                    <div className="mt-5 grid gap-3 sm:mt-6 sm:grid-cols-2 sm:gap-4 lg:grid-cols-4">

                        <Link
                            to="/admin/quizzes"
                            className="group rounded-xl border border-slate-200 p-4 transition hover:-translate-y-0.5 hover:border-blue-200 hover:bg-blue-50 sm:p-5"
                        >
                            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-100 text-xl">
                                📝
                            </span>

                            <h3 className="mt-4 font-semibold text-slate-900">
                                Manage Quizzes
                            </h3>

                            <p className="mt-1 text-xs leading-5 text-slate-500">
                                Create, edit, and manage quizzes.
                            </p>

                            <p className="mt-4 text-sm font-semibold text-blue-600">
                                Open →
                            </p>
                        </Link>


                        <Link
                            to="/admin/questions"
                            className="group rounded-xl border border-slate-200 p-4 transition hover:-translate-y-0.5 hover:border-green-200 hover:bg-green-50 sm:p-5"
                        >
                            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-green-100 text-xl">
                                ❓
                            </span>

                            <h3 className="mt-4 font-semibold text-slate-900">
                                Manage Questions
                            </h3>

                            <p className="mt-1 text-xs leading-5 text-slate-500">
                                Add and organize quiz questions.
                            </p>

                            <p className="mt-4 text-sm font-semibold text-green-600">
                                Open →
                            </p>
                        </Link>


                        <Link
                            to="/admin/categories"
                            className="group rounded-xl border border-slate-200 p-4 transition hover:-translate-y-0.5 hover:border-purple-200 hover:bg-purple-50 sm:p-5"
                        >
                            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-purple-100 text-xl">
                                🗂️
                            </span>

                            <h3 className="mt-4 font-semibold text-slate-900">
                                Categories
                            </h3>

                            <p className="mt-1 text-xs leading-5 text-slate-500">
                                Organize quizzes by category.
                            </p>

                            <p className="mt-4 text-sm font-semibold text-purple-600">
                                Open →
                            </p>
                        </Link>


                        <Link
                            to="/admin/questions"
                            className="group rounded-xl border border-slate-200 p-4 transition hover:-translate-y-0.5 hover:border-orange-200 hover:bg-orange-50 sm:p-5"
                        >
                            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-orange-100 text-xl">
                                📊
                            </span>

                            <h3 className="mt-4 font-semibold text-slate-900">
                                Question Bank
                            </h3>

                            <p className="mt-1 text-xs leading-5 text-slate-500">
                                Review your complete question bank.
                            </p>

                            <p className="mt-4 text-sm font-semibold text-orange-600">
                                Open →
                            </p>
                        </Link>

                    </div>

                </div>


                {/* System Status */}

                <div className="mt-5 rounded-2xl bg-slate-900 p-5 text-white sm:mt-6 sm:p-6">

                    <p className="text-sm font-semibold text-blue-400">
                        System
                    </p>

                    <h2 className="mt-2 text-xl font-bold">
                        Platform Status
                    </h2>

                    <div className="mt-5 grid gap-3 sm:grid-cols-3">

                        {[
                            "API Server",
                            "Database",
                            "Authentication",
                        ].map((item) => (

                            <div
                                key={item}
                                className="flex items-center justify-between gap-3 rounded-xl bg-white/5 p-3 sm:p-4"
                            >

                                <span className="text-sm text-slate-300">
                                    {item}
                                </span>

                                <span className="flex shrink-0 items-center gap-2 text-xs font-semibold text-green-400">
                                    <span className="h-2 w-2 rounded-full bg-green-400" />
                                    Online
                                </span>

                            </div>

                        ))}

                    </div>

                </div>

            </div>
        </div>
    );
}

export default AdminDashboard;