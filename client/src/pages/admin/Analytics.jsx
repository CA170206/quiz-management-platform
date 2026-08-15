import { useEffect, useState } from "react";

const API_URL =
    `${import.meta.env.VITE_API_URL}/api/analytics/admin`;

function Analytics() {
    const [data, setData] = useState(null);
    const [loading, setLoading] =
        useState(true);
    const [error, setError] =
        useState("");

    useEffect(() => {
        const fetchAnalytics = async () => {
            try {
                setLoading(true);
                setError("");

                const token =
                    localStorage.getItem("token") ||
                    sessionStorage.getItem("token");

                if (!token) {
                    throw new Error(
                        "You are not logged in."
                    );
                }

                const response = await fetch(
                    API_URL,
                    {
                        method: "GET",
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
                            "Failed to fetch analytics"
                    );
                }

                setData(result);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchAnalytics();
    }, []);

    // ==========================================
    // LOADING
    // ==========================================

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-50 px-4 py-6 sm:px-6 sm:py-10">
                <div className="mx-auto max-w-7xl">

                    <div className="mb-6 animate-pulse sm:mb-8">
                        <div className="h-4 w-28 rounded bg-slate-200" />

                        <div className="mt-3 h-8 w-56 rounded bg-slate-200 sm:h-9 sm:w-64" />

                        <div className="mt-2 h-5 w-full max-w-sm rounded bg-slate-200" />
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-4">

                        {[1, 2, 3, 4].map(
                            (item) => (
                                <div
                                    key={item}
                                    className="h-32 animate-pulse rounded-2xl bg-white ring-1 ring-slate-200"
                                />
                            )
                        )}

                    </div>

                </div>
            </div>
        );
    }

    // ==========================================
    // ERROR
    // ==========================================

    if (error) {
        return (
            <div className="min-h-screen bg-slate-50 px-4 py-6 sm:px-6 sm:py-10">
                <div className="mx-auto max-w-7xl">

                    <div className="rounded-xl border border-red-100 bg-red-50 px-4 py-4 text-sm text-red-600 sm:px-5">
                        {error}
                    </div>

                </div>
            </div>
        );
    }

    const stats =
        data?.stats || {};

    const popularQuizzes =
        data?.popularQuizzes || [];

    const recentAttempts =
        data?.recentAttempts || [];

    const categories =
        data?.categories || [];

    const totalStudents =
        Number(stats.total_students || 0);

    const totalQuizzes =
        Number(stats.total_quizzes || 0);

    const totalQuestions =
        Number(stats.total_questions || 0);

    const totalAttempts =
        Number(stats.total_attempts || 0);

    const totalCategories =
        Number(stats.total_categories || 0);

    const averageScore =
        Number(stats.average_score || 0);

    const passRate =
        Number(stats.pass_rate || 0);

    const cards = [
        {
            title: "Total Students",
            value: totalStudents,
            icon: "👥",
            description:
                "Registered students",
        },
        {
            title: "Total Quizzes",
            value: totalQuizzes,
            icon: "📝",
            description:
                "Available quizzes",
        },
        {
            title: "Quiz Attempts",
            value: totalAttempts,
            icon: "📊",
            description:
                "Total attempts",
        },
        {
            title: "Average Score",
            value: `${averageScore}%`,
            icon: "🎯",
            description:
                "Across all attempts",
        },
    ];

    return (
        <div className="min-h-screen bg-slate-50 px-4 py-6 sm:px-6 sm:py-10">

            <div className="mx-auto max-w-7xl">

                {/* HEADER */}

                <div className="mb-6 sm:mb-8">

                    <p className="text-sm font-semibold text-blue-600">
                        Administration
                    </p>

                    <h1 className="mt-1 text-2xl font-bold text-slate-900 sm:text-3xl">
                        Platform Analytics
                    </h1>

                    <p className="mt-2 text-sm leading-6 text-slate-500 sm:text-base">
                        Real-time overview of QuizMaster activity.
                    </p>

                </div>


                {/* STAT CARDS */}

                <div className="grid gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-4">

                    {cards.map((card) => (

                        <div
                            key={card.title}
                            className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200 sm:p-6"
                        >

                            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-xl sm:h-12 sm:w-12">
                                {card.icon}
                            </div>

                            <p className="mt-5 text-sm font-medium text-slate-500 sm:mt-6">
                                {card.title}
                            </p>

                            <p className="mt-1 text-3xl font-bold text-slate-900">
                                {card.value}
                            </p>

                            <p className="mt-2 text-xs text-slate-400">
                                {card.description}
                            </p>

                        </div>

                    ))}

                </div>


                {/* SECONDARY STATS */}

                <div className="mt-5 grid gap-4 sm:mt-6 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3">

                    <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200 sm:p-6">

                        <p className="text-sm font-medium text-slate-500">
                            Pass Rate
                        </p>

                        <p className="mt-2 text-3xl font-bold text-green-600">
                            {passRate}%
                        </p>

                        <p className="mt-2 text-xs text-slate-400">
                            Attempts scoring 40% or higher
                        </p>

                    </div>


                    <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200 sm:p-6">

                        <p className="text-sm font-medium text-slate-500">
                            Question Bank
                        </p>

                        <p className="mt-2 text-3xl font-bold text-blue-600">
                            {totalQuestions}
                        </p>

                        <p className="mt-2 text-xs text-slate-400">
                            Questions available
                        </p>

                    </div>


                    <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200 sm:p-6 sm:max-sm:col-span-2">

                        <p className="text-sm font-medium text-slate-500">
                            Categories
                        </p>

                        <p className="mt-2 text-3xl font-bold text-purple-600">
                            {totalCategories}
                        </p>

                        <p className="mt-2 text-xs text-slate-400">
                            Quiz categories
                        </p>

                    </div>

                </div>


                {/* POPULAR QUIZZES */}

                <div className="mt-5 overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-slate-200 sm:mt-6">

                    <div className="border-b border-slate-100 px-5 py-5 sm:px-6">

                        <h2 className="text-lg font-bold text-slate-900">
                            Most Popular Quizzes
                        </h2>

                        <p className="mt-1 text-sm text-slate-500">
                            Ranked by number of attempts.
                        </p>

                    </div>


                    {popularQuizzes.length === 0 ? (

                        <div className="px-5 py-10 text-center text-sm text-slate-500 sm:px-6">
                            No quiz attempts yet.
                        </div>

                    ) : (

                        <div className="divide-y divide-slate-100">

                            {popularQuizzes.map(
                                (quiz, index) => (

                                    <div
                                        key={quiz.id}
                                        className="flex items-center justify-between gap-3 px-5 py-4 sm:gap-5 sm:px-6 sm:py-5"
                                    >

                                        <div className="flex min-w-0 items-center gap-3 sm:gap-4">

                                            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-sm font-bold text-blue-600 sm:h-10 sm:w-10">
                                                {index + 1}
                                            </div>

                                            <div className="min-w-0">

                                                <p className="truncate font-semibold text-slate-900">
                                                    {quiz.title}
                                                </p>

                                                <p className="mt-1 text-xs text-slate-500">
                                                    {quiz.attempts} attempts
                                                </p>

                                            </div>

                                        </div>

                                        <span className="shrink-0 rounded-full bg-green-50 px-2.5 py-1 text-xs font-semibold text-green-600 sm:px-3">
                                            {Number(
                                                quiz.average_score || 0
                                            ).toFixed(0)}
                                            % avg
                                        </span>

                                    </div>

                                )
                            )}

                        </div>

                    )}

                </div>


                {/* RECENT ATTEMPTS */}

                <div className="mt-5 overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-slate-200 sm:mt-6">

                    <div className="border-b border-slate-100 px-5 py-5 sm:px-6">

                        <h2 className="text-lg font-bold text-slate-900">
                            Recent Quiz Activity
                        </h2>

                        <p className="mt-1 text-sm text-slate-500">
                            Latest quiz attempts across the platform.
                        </p>

                    </div>


                    {recentAttempts.length === 0 ? (

                        <div className="px-5 py-10 text-center text-sm text-slate-500 sm:px-6">
                            No quiz activity yet.
                        </div>

                    ) : (

                        <div className="overflow-x-auto">

                            <table className="w-full min-w-[650px] text-left text-sm">

                                <thead className="bg-slate-50 text-xs uppercase text-slate-500">

                                    <tr>

                                        <th className="px-5 py-4 sm:px-6">
                                            Student
                                        </th>

                                        <th className="px-5 py-4 sm:px-6">
                                            Quiz
                                        </th>

                                        <th className="px-5 py-4 sm:px-6">
                                            Score
                                        </th>

                                        <th className="px-5 py-4 sm:px-6">
                                            Percentage
                                        </th>

                                    </tr>

                                </thead>


                                <tbody className="divide-y divide-slate-100">

                                    {recentAttempts.map(
                                        (attempt) => {

                                            const percentage =
                                                Number(
                                                    attempt.percentage || 0
                                                );

                                            return (
                                                <tr
                                                    key={attempt.id}
                                                    className="hover:bg-slate-50"
                                                >

                                                    <td className="max-w-[240px] px-5 py-4 sm:px-6">

                                                        <p className="truncate font-semibold text-slate-900">
                                                            {attempt.full_name}
                                                        </p>

                                                        <p className="truncate text-xs text-slate-400">
                                                            {attempt.email}
                                                        </p>

                                                    </td>

                                                    <td className="max-w-[220px] truncate px-5 py-4 font-medium text-slate-700 sm:px-6">
                                                        {attempt.quiz_title}
                                                    </td>

                                                    <td className="px-5 py-4 text-slate-600 sm:px-6">
                                                        {attempt.score}
                                                    </td>

                                                    <td className="px-5 py-4 sm:px-6">

                                                        <span
                                                            className={`whitespace-nowrap rounded-full px-3 py-1 text-xs font-semibold ${
                                                                percentage >= 40
                                                                    ? "bg-green-50 text-green-600"
                                                                    : "bg-red-50 text-red-600"
                                                            }`}
                                                        >
                                                            {percentage}%
                                                        </span>

                                                    </td>

                                                </tr>
                                            );
                                        }
                                    )}

                                </tbody>

                            </table>

                        </div>

                    )}

                </div>


                {/* CATEGORIES */}

                <div className="mt-5 overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-slate-200 sm:mt-6">

                    <div className="border-b border-slate-100 px-5 py-5 sm:px-6">

                        <h2 className="text-lg font-bold text-slate-900">
                            Category Activity
                        </h2>

                        <p className="mt-1 text-sm text-slate-500">
                            Quiz and attempt activity by category.
                        </p>

                    </div>


                    <div className="grid gap-3 p-4 sm:grid-cols-2 sm:gap-4 sm:p-6 lg:grid-cols-3">

                        {categories.map(
                            (category) => {

                                const maxAttempts =
                                    Math.max(
                                        ...categories.map(
                                            (item) =>
                                                Number(
                                                    item.attempts || 0
                                                )
                                        ),
                                        1
                                    );

                                const percentage =
                                    Math.min(
                                        100,
                                        (
                                            (Number(
                                                category.attempts || 0
                                            ) /
                                                maxAttempts) *
                                            100
                                        )
                                    );

                                return (
                                    <div
                                        key={category.id}
                                        className="min-w-0 rounded-xl border border-slate-100 p-4 sm:p-5"
                                    >

                                        <div className="flex items-start justify-between gap-3">

                                            <p className="min-w-0 break-words font-semibold text-slate-900">
                                                {category.name}
                                            </p>

                                            <span className="shrink-0 text-right text-xs font-semibold text-blue-600">
                                                {category.attempts} attempts
                                            </span>

                                        </div>

                                        <p className="mt-1 text-xs text-slate-500">
                                            {category.quizzes} quizzes
                                        </p>

                                        <div className="mt-4 h-2 overflow-hidden rounded-full bg-slate-100">

                                            <div
                                                className="h-full rounded-full bg-blue-500"
                                                style={{
                                                    width: `${percentage}%`,
                                                }}
                                            />

                                        </div>

                                    </div>
                                );
                            }
                        )}

                    </div>

                </div>

            </div>

        </div>
    );
}

export default Analytics;