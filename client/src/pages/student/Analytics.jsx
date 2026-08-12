import { Link } from "react-router-dom";

function Analytics() {
    return (
        <div className="min-h-screen bg-slate-50 px-6 py-10">
            <div className="mx-auto max-w-7xl">

                {/* Header */}
                <div className="mb-8">
                    <p className="text-sm font-semibold text-blue-600">
                        Performance
                    </p>

                    <h1 className="mt-1 text-3xl font-bold text-slate-900">
                        My Analytics
                    </h1>

                    <p className="mt-2 text-slate-500">
                        Track your quiz performance and progress.
                    </p>
                </div>

                {/* Stats */}
                <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">

                    <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
                        <p className="text-sm font-medium text-slate-500">
                            Quizzes Attempted
                        </p>
                        <p className="mt-3 text-3xl font-bold text-slate-900">
                            12
                        </p>
                        <p className="mt-2 text-xs text-slate-400">
                            Total attempts
                        </p>
                    </div>

                    <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
                        <p className="text-sm font-medium text-slate-500">
                            Average Score
                        </p>
                        <p className="mt-3 text-3xl font-bold text-blue-600">
                            78%
                        </p>
                        <p className="mt-2 text-xs text-slate-400">
                            Across all quizzes
                        </p>
                    </div>

                    <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
                        <p className="text-sm font-medium text-slate-500">
                            Best Score
                        </p>
                        <p className="mt-3 text-3xl font-bold text-green-600">
                            95%
                        </p>
                        <p className="mt-2 text-xs text-slate-400">
                            Highest percentage
                        </p>
                    </div>

                    <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
                        <p className="text-sm font-medium text-slate-500">
                            Pass Rate
                        </p>
                        <p className="mt-3 text-3xl font-bold text-purple-600">
                            83%
                        </p>
                        <p className="mt-2 text-xs text-slate-400">
                            Successful attempts
                        </p>
                    </div>

                </div>

                {/* Main Grid */}
                <div className="mt-6 grid gap-6 lg:grid-cols-3">

                    {/* Performance Chart */}
                    <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200 lg:col-span-2">

                        <div className="flex items-center justify-between">
                            <div>
                                <h2 className="text-lg font-bold text-slate-900">
                                    Performance Overview
                                </h2>

                                <p className="mt-1 text-sm text-slate-500">
                                    Your recent quiz scores
                                </p>
                            </div>

                            <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-600">
                                Last 10 Attempts
                            </span>
                        </div>

                        {/* Simple chart */}
                        <div className="mt-8 flex h-64 items-end gap-4 border-b border-l border-slate-200 px-5 pb-0">

                            {[55, 72, 64, 82, 70, 88, 76, 91, 84, 95].map(
                                (height, index) => (
                                    <div
                                        key={index}
                                        className="flex h-full flex-1 items-end"
                                    >
                                        <div
                                            className="w-full rounded-t-lg bg-blue-500 transition hover:bg-blue-600"
                                            style={{
                                                height: `${height}%`,
                                            }}
                                        />
                                    </div>
                                )
                            )}

                        </div>

                        <div className="mt-3 flex justify-between px-3 text-xs text-slate-400">
                            <span>1</span>
                            <span>2</span>
                            <span>3</span>
                            <span>4</span>
                            <span>5</span>
                            <span>6</span>
                            <span>7</span>
                            <span>8</span>
                            <span>9</span>
                            <span>10</span>
                        </div>

                    </div>

                    {/* Performance Summary */}
                    <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">

                        <h2 className="text-lg font-bold text-slate-900">
                            Performance Summary
                        </h2>

                        <div className="mt-6 space-y-5">

                            <div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-slate-500">
                                        Correct Answers
                                    </span>
                                    <span className="font-semibold text-green-600">
                                        78%
                                    </span>
                                </div>

                                <div className="mt-2 h-2 rounded-full bg-slate-100">
                                    <div className="h-2 w-[78%] rounded-full bg-green-500" />
                                </div>
                            </div>

                            <div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-slate-500">
                                        Incorrect Answers
                                    </span>
                                    <span className="font-semibold text-red-600">
                                        15%
                                    </span>
                                </div>

                                <div className="mt-2 h-2 rounded-full bg-slate-100">
                                    <div className="h-2 w-[15%] rounded-full bg-red-500" />
                                </div>
                            </div>

                            <div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-slate-500">
                                        Unanswered
                                    </span>
                                    <span className="font-semibold text-slate-600">
                                        7%
                                    </span>
                                </div>

                                <div className="mt-2 h-2 rounded-full bg-slate-100">
                                    <div className="h-2 w-[7%] rounded-full bg-slate-400" />
                                </div>
                            </div>

                        </div>

                    </div>
                </div>

                {/* Recent Attempts */}
                <div className="mt-6 rounded-2xl bg-white shadow-sm ring-1 ring-slate-200">

                    <div className="flex items-center justify-between border-b border-slate-100 px-6 py-5">
                        <div>
                            <h2 className="text-lg font-bold text-slate-900">
                                Recent Attempts
                            </h2>

                            <p className="mt-1 text-sm text-slate-500">
                                Your latest quiz activity
                            </p>
                        </div>

                        <Link
                            to="/student/quizzes"
                            className="text-sm font-semibold text-blue-600 hover:text-blue-700"
                        >
                            Take a Quiz →
                        </Link>
                    </div>

                    <div className="overflow-x-auto">

                        <table className="w-full text-left text-sm">

                            <thead className="bg-slate-50 text-xs uppercase text-slate-500">
                                <tr>
                                    <th className="px-6 py-4">
                                        Quiz
                                    </th>

                                    <th className="px-6 py-4">
                                        Score
                                    </th>

                                    <th className="px-6 py-4">
                                        Percentage
                                    </th>

                                    <th className="px-6 py-4">
                                        Status
                                    </th>

                                    <th className="px-6 py-4">
                                        Action
                                    </th>
                                </tr>
                            </thead>

                            <tbody className="divide-y divide-slate-100">

                                {[
                                    ["Java Basics", "8 / 10", "80%", "Passed"],
                                    ["Web Development", "9 / 10", "90%", "Passed"],
                                    ["Python Fundamentals", "6 / 10", "60%", "Passed"],
                                    ["Database Systems", "3 / 10", "30%", "Failed"],
                                ].map((attempt, index) => (

                                    <tr
                                        key={index}
                                        className="hover:bg-slate-50"
                                    >
                                        <td className="px-6 py-4 font-semibold text-slate-900">
                                            {attempt[0]}
                                        </td>

                                        <td className="px-6 py-4 text-slate-600">
                                            {attempt[1]}
                                        </td>

                                        <td className="px-6 py-4 font-semibold text-slate-700">
                                            {attempt[2]}
                                        </td>

                                        <td className="px-6 py-4">
                                            <span
                                                className={`rounded-full px-3 py-1 text-xs font-semibold ${
                                                    attempt[3] === "Passed"
                                                        ? "bg-green-50 text-green-600"
                                                        : "bg-red-50 text-red-600"
                                                }`}
                                            >
                                                {attempt[3]}
                                            </span>
                                        </td>

                                        <td className="px-6 py-4">
                                            <button className="font-semibold text-blue-600 hover:text-blue-700">
                                                View
                                            </button>
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

export default Analytics;