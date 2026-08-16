import { useEffect, useState } from "react";

const API_URL =
    `${import.meta.env.VITE_API_URL}/api/analytics/developer`;

function DeveloperAnalytics() {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const fetchAnalytics = async () => {
        try {
            setLoading(true);
            setError("");

            const token =
                localStorage.getItem("token");

            const response = await fetch(API_URL, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(
                    result.message ||
                    "Failed to fetch system analytics"
                );
            }

            setData(result);

        } catch (err) {
            setError(
                err.message ||
                "Failed to load system analytics"
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAnalytics();
    }, []);

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-50 px-4 py-8 sm:px-6">
                <div className="mx-auto max-w-7xl">

                    <div className="rounded-2xl bg-white p-8 text-center shadow-sm ring-1 ring-slate-200">
                        <p className="text-sm text-slate-500">
                            Loading system analytics...
                        </p>
                    </div>

                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-slate-50 px-4 py-8 sm:px-6">
                <div className="mx-auto max-w-7xl">

                    <div className="rounded-2xl border border-red-100 bg-red-50 p-6 text-sm text-red-600">
                        {error}
                    </div>

                </div>
            </div>
        );
    }

    const stats = data?.stats || {};

    return (
        <div className="min-h-screen bg-slate-50 px-4 py-6 sm:px-6 lg:px-8">

            <div className="mx-auto max-w-7xl">

                {/* Header */}

                <div className="mb-6 rounded-2xl bg-slate-950 px-6 py-7 text-white shadow-sm sm:px-8">

                    <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">

                        <div>

                            <p className="text-sm font-semibold text-blue-400">
                                Developer Analytics
                            </p>

                            <h1 className="mt-1 text-2xl font-bold sm:text-3xl">
                                System Analytics
                            </h1>

                            <p className="mt-2 text-sm text-slate-400">
                                Platform-wide statistics and system activity.
                            </p>

                        </div>

                        <button
                            type="button"
                            onClick={fetchAnalytics}
                            className="rounded-lg border border-slate-700 px-4 py-2.5 text-sm font-semibold text-slate-300 transition hover:bg-slate-800 hover:text-white"
                        >
                            Refresh
                        </button>

                    </div>

                </div>


                {/* Platform Statistics */}

                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">

                    <StatCard
                        title="Total Users"
                        value={stats.total_users}
                        icon="👥"
                    />

                    <StatCard
                        title="Students"
                        value={stats.total_students}
                        icon="🎓"
                    />

                    <StatCard
                        title="Admins"
                        value={stats.total_admins}
                        icon="🛡️"
                    />

                    <StatCard
                        title="Developers"
                        value={stats.total_developers}
                        icon="⚙️"
                    />

                    <StatCard
                        title="Quizzes"
                        value={stats.total_quizzes}
                        icon="📝"
                    />

                    <StatCard
                        title="Questions"
                        value={stats.total_questions}
                        icon="❓"
                    />

                    <StatCard
                        title="Categories"
                        value={stats.total_categories}
                        icon="📚"
                    />

                    <StatCard
                        title="Attempts"
                        value={stats.total_attempts}
                        icon="🎯"
                    />

                </div>


                {/* Performance */}

                <div className="mt-6 grid gap-5 sm:grid-cols-2">

                    <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">

                        <p className="text-sm font-medium text-slate-500">
                            Average Score
                        </p>

                        <p className="mt-2 text-3xl font-bold text-slate-900">
                            {stats.average_score ?? 0}%
                        </p>

                        <p className="mt-2 text-sm text-slate-500">
                            Average percentage across all attempts.
                        </p>

                    </div>


                    <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">

                        <p className="text-sm font-medium text-slate-500">
                            Pass Rate
                        </p>

                        <p className="mt-2 text-3xl font-bold text-green-600">
                            {stats.pass_rate ?? 0}%
                        </p>

                        <p className="mt-2 text-sm text-slate-500">
                            Percentage of attempts scoring 40% or higher.
                        </p>

                    </div>

                </div>


                {/* Two-column sections */}

                <div className="mt-6 grid gap-6 lg:grid-cols-2">

                    {/* Role Distribution */}

                    <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">

                        <h2 className="font-bold text-slate-900">
                            User Role Distribution
                        </h2>

                        <p className="mt-1 text-sm text-slate-500">
                            Current accounts by role.
                        </p>

                        <div className="mt-5 space-y-3">

                            {(data?.roles || []).map((item) => (
                                <div
                                    key={item.role}
                                    className="flex items-center justify-between rounded-xl bg-slate-50 px-4 py-3"
                                >

                                    <span className="font-medium capitalize text-slate-700">
                                        {item.role}
                                    </span>

                                    <span className="font-bold text-slate-900">
                                        {item.count}
                                    </span>

                                </div>
                            ))}

                        </div>

                    </div>


                    {/* Popular Quizzes */}

                    <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">

                        <h2 className="font-bold text-slate-900">
                            Most Attempted Quizzes
                        </h2>

                        <p className="mt-1 text-sm text-slate-500">
                            Quizzes with the highest participation.
                        </p>

                        <div className="mt-5 space-y-3">

                            {(data?.popularQuizzes || []).length === 0 ? (
                                <p className="py-5 text-sm text-slate-500">
                                    No quiz attempts yet.
                                </p>
                            ) : (
                                data.popularQuizzes.map((quiz) => (
                                    <div
                                        key={quiz.id}
                                        className="rounded-xl bg-slate-50 px-4 py-3"
                                    >

                                        <div className="flex items-start justify-between gap-4">

                                            <p className="font-semibold text-slate-800">
                                                {quiz.title}
                                            </p>

                                            <span className="whitespace-nowrap text-xs font-semibold text-blue-600">
                                                {quiz.attempts} attempts
                                            </span>

                                        </div>

                                        <p className="mt-1 text-xs text-slate-500">
                                            Average score: {quiz.average_score}%
                                        </p>

                                    </div>
                                ))
                            )}

                        </div>

                    </div>

                </div>


                {/* Recent Registrations */}

                <div className="mt-6 rounded-2xl bg-white shadow-sm ring-1 ring-slate-200">

                    <div className="border-b border-slate-100 p-6">

                        <h2 className="font-bold text-slate-900">
                            Recent Registrations
                        </h2>

                        <p className="mt-1 text-sm text-slate-500">
                            Latest accounts created on the platform.
                        </p>

                    </div>

                    <div className="overflow-x-auto">

                        <table className="min-w-full text-left text-sm">

                            <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">

                                <tr>
                                    <th className="px-6 py-4 font-semibold">
                                        Name
                                    </th>

                                    <th className="px-6 py-4 font-semibold">
                                        Email
                                    </th>

                                    <th className="px-6 py-4 font-semibold">
                                        Role
                                    </th>

                                    <th className="px-6 py-4 font-semibold">
                                        Registered
                                    </th>
                                </tr>

                            </thead>

                            <tbody className="divide-y divide-slate-100">

                                {(data?.recentUsers || []).map((user) => (
                                    <tr
                                        key={user.id}
                                        className="hover:bg-slate-50"
                                    >

                                        <td className="whitespace-nowrap px-6 py-4 font-semibold text-slate-900">
                                            {user.full_name}
                                        </td>

                                        <td className="whitespace-nowrap px-6 py-4 text-slate-500">
                                            {user.email}
                                        </td>

                                        <td className="whitespace-nowrap px-6 py-4 capitalize text-slate-700">
                                            {user.role}
                                        </td>

                                        <td className="whitespace-nowrap px-6 py-4 text-slate-500">
                                            {user.created_at
                                                ? new Date(
                                                    user.created_at
                                                ).toLocaleString()
                                                : "—"}
                                        </td>

                                    </tr>
                                ))}

                            </tbody>

                        </table>

                    </div>

                </div>


                {/* Recent Attempts */}

                <div className="mt-6 rounded-2xl bg-white shadow-sm ring-1 ring-slate-200">

                    <div className="border-b border-slate-100 p-6">

                        <h2 className="font-bold text-slate-900">
                            Recent Quiz Activity
                        </h2>

                        <p className="mt-1 text-sm text-slate-500">
                            Latest quiz attempts across the platform.
                        </p>

                    </div>

                    <div className="overflow-x-auto">

                        <table className="min-w-full text-left text-sm">

                            <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">

                                <tr>
                                    <th className="px-6 py-4 font-semibold">
                                        Student
                                    </th>

                                    <th className="px-6 py-4 font-semibold">
                                        Quiz
                                    </th>

                                    <th className="px-6 py-4 font-semibold">
                                        Score
                                    </th>

                                    <th className="px-6 py-4 font-semibold">
                                        Percentage
                                    </th>

                                    <th className="px-6 py-4 font-semibold">
                                        Submitted
                                    </th>
                                </tr>

                            </thead>

                            <tbody className="divide-y divide-slate-100">

                                {(data?.recentAttempts || []).map((attempt) => (
                                    <tr
                                        key={attempt.id}
                                        className="hover:bg-slate-50"
                                    >

                                        <td className="whitespace-nowrap px-6 py-4 font-semibold text-slate-900">
                                            {attempt.full_name}
                                        </td>

                                        <td className="whitespace-nowrap px-6 py-4 text-slate-600">
                                            {attempt.quiz_title}
                                        </td>

                                        <td className="whitespace-nowrap px-6 py-4 text-slate-700">
                                            {attempt.score}
                                        </td>

                                        <td className="whitespace-nowrap px-6 py-4 font-semibold text-blue-600">
                                            {attempt.percentage}%
                                        </td>

                                        <td className="whitespace-nowrap px-6 py-4 text-slate-500">
                                            {attempt.submitted_at
                                                ? new Date(
                                                    attempt.submitted_at
                                                ).toLocaleString()
                                                : "—"}
                                        </td>

                                    </tr>
                                ))}

                            </tbody>

                        </table>

                    </div>

                </div>

            </div>

        </div>
    );
}


function StatCard({
    title,
    value,
    icon,
}) {
    return (
        <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200">

            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-xl">
                {icon}
            </div>

            <p className="mt-4 text-sm font-medium text-slate-500">
                {title}
            </p>

            <p className="mt-1 text-2xl font-bold text-slate-900">
                {value ?? 0}
            </p>

        </div>
    );
}


export default DeveloperAnalytics;