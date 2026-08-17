import Navbar from "../../components/common/Navbar.jsx";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";

const API_URL =
    import.meta.env.VITE_API_URL ||
    "http://localhost:5000";

function AdminDashboard() {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const loadAnalytics = async () => {
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

                const result =
                    await response.json();

                if (!response.ok) {
                    throw new Error(
                        result.message ||
                            "Failed to load analytics"
                    );
                }

                setData({
    ...result.stats,
    popular_quizzes: result.popularQuizzes || [],
    popular_categories: result.categories || [],
    recent_attempts: result.recentAttempts || [],
    attempts_over_time: result.attemptsOverTime || [],
});

            } catch (err) {
                console.error(err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        loadAnalytics();
    }, []);

    const statCards = [
        {
            label: "Total Students",
            value: data?.total_students ?? 0,
            icon: "👥",
        },
        {
            label: "Total Quizzes",
            value: data?.total_quizzes ?? 0,
            icon: "📝",
        },
        {
            label: "Published Quizzes",
            value: data?.published_quizzes ?? 0,
            icon: "✅",
        },
        {
            label: "Draft Quizzes",
            value: data?.draft_quizzes ?? 0,
            icon: "📄",
        },
        {
            label: "Total Questions",
            value: data?.total_questions ?? 0,
            icon: "❓",
        },
        {
            label: "Total Attempts",
            value: data?.total_attempts ?? 0,
            icon: "📊",
        },
        {
            label: "Average Score",
            value: `${data?.average_score ?? 0}%`,
            icon: "📈",
        },
        {
            label: "Passed Attempts",
            value: data?.passed_attempts ?? 0,
            icon: "🏆",
        },
    ];

    const maxQuizAttempts = Math.max(
        ...(data?.popular_quizzes || []).map(
            (item) =>
                Number(item.attempts)
        ),
        1
    );

    const maxCategoryAttempts = Math.max(
        ...(data?.popular_categories || []).map(
            (item) =>
                Number(item.attempts)
        ),
        1
    );

    const maxDailyAttempts = Math.max(
    ...(data?.attempts_over_time || []).map(
        (item) => Number(item.attempts)
    ),
    1
);

    return (
        <div className="min-h-screen bg-slate-50">

            <Navbar />

            <main className="px-4 pb-10 pt-24 sm:px-6 sm:pt-28">

                <div className="mx-auto max-w-7xl">

                    {/* HEADER */}

                    <div className="mb-6">

                        <p className="text-sm font-semibold text-blue-600">
                            Administration
                        </p>

                        <h1 className="mt-1 text-2xl font-bold text-slate-900 sm:text-3xl">
                            Admin Dashboard
                        </h1>

                        <p className="mt-2 text-sm text-slate-500">
                            Platform statistics and performance analytics.
                        </p>

                    </div>


                    {/* ERROR */}

                    {error && (
                        <div className="mb-5 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-600">
                            {error}
                        </div>
                    )}


                    {/* STATISTICS */}

                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">

                        {statCards.map(
                            (card) => (
                                <div
                                    key={card.label}
                                    className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200"
                                >

                                    <div className="flex items-center justify-between">

                                        <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-100 text-xl">
                                            {card.icon}
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
                            )
                        )}

                    </div>


                    {/* PASS / FAIL */}

                    <div className="mt-6 grid gap-4 sm:grid-cols-2">

                        <div className="rounded-2xl bg-green-50 p-5 ring-1 ring-green-100">

                            <p className="text-sm font-semibold text-green-700">
                                Passed Attempts
                            </p>

                            <p className="mt-2 text-3xl font-bold text-green-700">
                                {data?.passed_attempts ?? 0}
                            </p>

                        </div>

                        <div className="rounded-2xl bg-red-50 p-5 ring-1 ring-red-100">

                            <p className="text-sm font-semibold text-red-700">
                                Failed Attempts
                            </p>

                            <p className="mt-2 text-3xl font-bold text-red-700">
                                {data?.failed_attempts ?? 0}
                            </p>

                        </div>

                    </div>


                    {/* POPULAR QUIZZES */}

                    <div className="mt-6 grid gap-6 lg:grid-cols-2">

                        <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200 sm:p-6">

                            <h2 className="text-lg font-bold text-slate-900">
                                Most Popular Quizzes
                            </h2>

                            <div className="mt-5 space-y-4">

                                {data?.popular_quizzes?.length ? (
                                    data.popular_quizzes.map(
                                        (quiz) => {

                                            const attempts =
                                                Number(
                                                    quiz.attempts
                                                );

                                            return (
                                                <div
                                                    key={
                                                        quiz.title
                                                    }
                                                >

                                                    <div className="flex justify-between gap-3 text-sm">

                                                        <span className="min-w-0 truncate font-medium text-slate-700">
                                                            {
                                                                quiz.title
                                                            }
                                                        </span>

                                                        <span className="shrink-0 font-semibold text-slate-900">
                                                            {
                                                                attempts
                                                            }
                                                        </span>

                                                    </div>

                                                    <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-100">

                                                        <div
                                                            className="h-full rounded-full bg-blue-600"
                                                            style={{
                                                                width: `${(
                                                                    attempts /
                                                                    maxQuizAttempts
                                                                ) * 100}%`,
                                                            }}
                                                        />

                                                    </div>

                                                </div>
                                            );
                                        }
                                    )
                                ) : (
                                    <p className="text-sm text-slate-500">
                                        No quiz attempts yet.
                                    </p>
                                )}

                            </div>

                        </div>


                        {/* POPULAR CATEGORIES */}

                        <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200 sm:p-6">

                            <h2 className="text-lg font-bold text-slate-900">
                                Most Popular Categories
                            </h2>

                            <div className="mt-5 space-y-4">

                                {data?.popular_categories?.length ? (
                                    data.popular_categories.map(
                                        (category) => {

                                            const attempts =
                                                Number(
                                                    category.attempts
                                                );

                                            return (
                                                <div
                                                    key={
                                                        category.name
                                                    }
                                                >

                                                    <div className="flex justify-between gap-3 text-sm">

                                                        <span className="font-medium text-slate-700">
                                                            {
                                                                category.name
                                                            }
                                                        </span>

                                                        <span className="font-semibold text-slate-900">
                                                            {
                                                                attempts
                                                            }
                                                        </span>

                                                    </div>

                                                    <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-100">

                                                        <div
                                                            className="h-full rounded-full bg-purple-600"
                                                            style={{
                                                                width: `${(
                                                                    attempts /
                                                                    maxCategoryAttempts
                                                                ) * 100}%`,
                                                            }}
                                                        />

                                                    </div>

                                                </div>
                                            );
                                        }
                                    )
                                ) : (
                                    <p className="text-sm text-slate-500">
                                        No category activity yet.
                                    </p>
                                )}

                            </div>

                        </div>

                    </div>


                    {/* RECENT ACTIVITY */}

<div className="mt-6 grid gap-6 lg:grid-cols-2">

    <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200 sm:p-6">

        <h2 className="text-lg font-bold text-slate-900">
            Recent Quiz Activity
        </h2>

        <div className="mt-5 space-y-3">

            {data?.recent_attempts?.length ? (
                data.recent_attempts.map((attempt) => (
                    <div
                        key={attempt.id}
                        className="flex items-center justify-between gap-4 rounded-xl border border-slate-100 p-3"
                    >
                        <div className="min-w-0">
                            <p className="truncate text-sm font-semibold text-slate-800">
                                {attempt.full_name}
                            </p>

                            <p className="truncate text-xs text-slate-500">
                                {attempt.quiz_title}
                            </p>
                        </div>

                        <div className="shrink-0 text-right">
                            <p className="text-sm font-bold text-slate-900">
                                {Number(attempt.percentage)}%
                            </p>

                            <p className="text-xs text-slate-400">
                                {attempt.submitted_at
                                    ? new Date(
                                          attempt.submitted_at
                                      ).toLocaleDateString()
                                    : ""}
                            </p>
                        </div>
                    </div>
                ))
            ) : (
                <p className="text-sm text-slate-500">
                    No recent attempts.
                </p>
            )}

        </div>
    </div>


    {/* ATTEMPTS CHART */}

    <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200 sm:p-6">

        <h2 className="text-lg font-bold text-slate-900">
            Attempts Over Time
        </h2>

        <div className="mt-6 flex h-56 items-end gap-3">

            {(data?.attempts_over_time || [])
                .slice()
                .reverse()
                .map((item) => {

                    const attempts =
                        Number(item.attempts);

                    const height =
                        Math.max(
                            (attempts /
                                maxDailyAttempts) *
                                100,
                            5
                        );

                    return (
                        <div
                            key={item.date}
                            className="flex h-full flex-1 flex-col items-center justify-end"
                        >
                            <span className="mb-2 text-xs font-semibold text-slate-700">
                                {attempts}
                            </span>

                            <div
                                className="w-full max-w-10 rounded-t-lg bg-blue-600"
                                style={{
                                    height: `${height}%`,
                                }}
                            />

                            <span className="mt-2 text-[10px] text-slate-400">
                                {new Date(
                                    item.date
                                ).toLocaleDateString(
                                    undefined,
                                    {
                                        month: "short",
                                        day: "numeric",
                                    }
                                )}
                            </span>
                        </div>
                    );
                })}

        </div>

    </div>

</div>

                    {/* QUICK ACTIONS */}

                    <div className="mt-6 rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200 sm:p-6">

                        <h2 className="text-lg font-bold text-slate-900">
                            Quick Actions
                        </h2>

                        <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">

                            <Link
                                to="/admin/quizzes"
                                className="rounded-xl border border-slate-200 p-4 transition hover:bg-blue-50"
                            >
                                <span className="text-xl">
                                    📝
                                </span>

                                <h3 className="mt-3 font-semibold text-slate-900">
                                    Manage Quizzes
                                </h3>

                                <p className="mt-1 text-xs text-slate-500">
                                    Create and manage quizzes.
                                </p>
                            </Link>

                            <Link
                                to="/admin/questions"
                                className="rounded-xl border border-slate-200 p-4 transition hover:bg-green-50"
                            >
                                <span className="text-xl">
                                    ❓
                                </span>

                                <h3 className="mt-3 font-semibold text-slate-900">
                                    Manage Questions
                                </h3>

                                <p className="mt-1 text-xs text-slate-500">
                                    Manage quiz questions.
                                </p>
                            </Link>

                            <Link
                                to="/admin/categories"
                                className="rounded-xl border border-slate-200 p-4 transition hover:bg-purple-50"
                            >
                                <span className="text-xl">
                                    🗂️
                                </span>

                                <h3 className="mt-3 font-semibold text-slate-900">
                                    Categories
                                </h3>

                                <p className="mt-1 text-xs text-slate-500">
                                    Manage quiz categories.
                                </p>
                            </Link>

                            <Link
                                to="/admin/users"
                                className="rounded-xl border border-slate-200 p-4 transition hover:bg-orange-50"
                            >
                                <span className="text-xl">
                                    👥
                                </span>

                                <h3 className="mt-3 font-semibold text-slate-900">
                                    Manage Students
                                </h3>

                                <p className="mt-1 text-xs text-slate-500">
                                    Manage registered students.
                                </p>
                            </Link>

                        </div>

                    </div>

                </div>
            </main>
        </div>
    );
}

export default AdminDashboard;