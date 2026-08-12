import { Link } from "react-router-dom";

function Dashboard() {
    return (
        <div className="min-h-screen bg-slate-50 px-6 py-10">
            <div className="mx-auto max-w-7xl">

                {/* Welcome */}
                <div className="overflow-hidden rounded-2xl bg-gradient-to-br from-blue-600 to-blue-700 px-7 py-8 text-white shadow-sm sm:px-10">
                    <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-center">

                        <div>
                            <p className="text-sm font-semibold text-blue-100">
                                Student Dashboard
                            </p>

                            <h1 className="mt-2 text-3xl font-bold">
                                Welcome back 👋
                            </h1>

                            <p className="mt-2 max-w-xl text-sm leading-6 text-blue-100">
                                Continue learning, attempt quizzes,
                                and track your performance.
                            </p>
                        </div>

                        <Link
                            to="/student/quizzes"
                            className="inline-flex items-center justify-center rounded-lg bg-white px-5 py-3 text-sm font-semibold text-blue-600 transition hover:bg-blue-50"
                        >
                            Browse Quizzes →
                        </Link>

                    </div>
                </div>

                {/* Stats */}
                <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">

                    <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
                        <div className="flex items-center justify-between">
                            <span className="text-2xl">📝</span>
                            <span className="text-xs font-semibold text-blue-600">
                                Total
                            </span>
                        </div>

                        <p className="mt-5 text-sm text-slate-500">
                            Quizzes Attempted
                        </p>

                        <p className="mt-1 text-3xl font-bold text-slate-900">
                            12
                        </p>
                    </div>

                    <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
                        <div className="flex items-center justify-between">
                            <span className="text-2xl">🎯</span>
                            <span className="text-xs font-semibold text-green-600">
                                Average
                            </span>
                        </div>

                        <p className="mt-5 text-sm text-slate-500">
                            Average Score
                        </p>

                        <p className="mt-1 text-3xl font-bold text-slate-900">
                            78%
                        </p>
                    </div>

                    <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
                        <div className="flex items-center justify-between">
                            <span className="text-2xl">🏆</span>
                            <span className="text-xs font-semibold text-purple-600">
                                Best
                            </span>
                        </div>

                        <p className="mt-5 text-sm text-slate-500">
                            Highest Score
                        </p>

                        <p className="mt-1 text-3xl font-bold text-slate-900">
                            95%
                        </p>
                    </div>

                    <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
                        <div className="flex items-center justify-between">
                            <span className="text-2xl">📈</span>
                            <span className="text-xs font-semibold text-orange-600">
                                Current
                            </span>
                        </div>

                        <p className="mt-5 text-sm text-slate-500">
                            Pass Rate
                        </p>

                        <p className="mt-1 text-3xl font-bold text-slate-900">
                            83%
                        </p>
                    </div>

                </div>

                {/* Main Content */}
                <div className="mt-6 grid gap-6 lg:grid-cols-3">

                    {/* Recent Activity */}
                    <div className="rounded-2xl bg-white shadow-sm ring-1 ring-slate-200 lg:col-span-2">

                        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-5">
                            <div>
                                <h2 className="text-lg font-bold text-slate-900">
                                    Recent Activity
                                </h2>

                                <p className="mt-1 text-sm text-slate-500">
                                    Your latest quiz attempts
                                </p>
                            </div>

                            <Link
                                to="/student/analytics"
                                className="text-sm font-semibold text-blue-600 hover:text-blue-700"
                            >
                                View Analytics →
                            </Link>
                        </div>

                        <div className="divide-y divide-slate-100">

                            {[
                                {
                                    name: "Java Basics",
                                    score: "8/10",
                                    percentage: "80%",
                                    status: "Passed",
                                },
                                {
                                    name: "Web Development",
                                    score: "9/10",
                                    percentage: "90%",
                                    status: "Passed",
                                },
                                {
                                    name: "Python Fundamentals",
                                    score: "6/10",
                                    percentage: "60%",
                                    status: "Passed",
                                },
                            ].map((item, index) => (
                                <div
                                    key={index}
                                    className="flex items-center justify-between gap-4 px-6 py-5 transition hover:bg-slate-50"
                                >
                                    <div className="flex items-center gap-4">

                                        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 font-bold text-blue-600">
                                            Q
                                        </div>

                                        <div>
                                            <p className="font-semibold text-slate-900">
                                                {item.name}
                                            </p>

                                            <p className="mt-1 text-xs text-slate-400">
                                                Quiz attempt
                                            </p>
                                        </div>

                                    </div>

                                    <div className="text-right">

                                        <p className="font-bold text-slate-900">
                                            {item.percentage}
                                        </p>

                                        <span className="text-xs font-semibold text-green-600">
                                            {item.status}
                                        </span>

                                    </div>
                                </div>
                            ))}

                        </div>

                    </div>

                    {/* Quick Actions */}
                    <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">

                        <h2 className="text-lg font-bold text-slate-900">
                            Quick Actions
                        </h2>

                        <p className="mt-1 text-sm text-slate-500">
                            Jump straight to what you need.
                        </p>

                        <div className="mt-6 space-y-3">

                            <Link
                                to="/student/quizzes"
                                className="flex items-center gap-4 rounded-xl border border-slate-200 p-4 transition hover:border-blue-200 hover:bg-blue-50"
                            >
                                <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100">
                                    📝
                                </span>

                                <div>
                                    <p className="text-sm font-semibold text-slate-900">
                                        Take a Quiz
                                    </p>

                                    <p className="mt-1 text-xs text-slate-500">
                                        Test your knowledge
                                    </p>
                                </div>
                            </Link>

                            <Link
                                to="/student/leaderboard"
                                className="flex items-center gap-4 rounded-xl border border-slate-200 p-4 transition hover:border-blue-200 hover:bg-blue-50"
                            >
                                <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-yellow-100">
                                    🏆
                                </span>

                                <div>
                                    <p className="text-sm font-semibold text-slate-900">
                                        Leaderboard
                                    </p>

                                    <p className="mt-1 text-xs text-slate-500">
                                        Check your ranking
                                    </p>
                                </div>
                            </Link>

                            <Link
                                to="/student/analytics"
                                className="flex items-center gap-4 rounded-xl border border-slate-200 p-4 transition hover:border-blue-200 hover:bg-blue-50"
                            >
                                <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-100">
                                    📊
                                </span>

                                <div>
                                    <p className="text-sm font-semibold text-slate-900">
                                        My Analytics
                                    </p>

                                    <p className="mt-1 text-xs text-slate-500">
                                        Track your progress
                                    </p>
                                </div>
                            </Link>

                            <Link
                                to="/student/profile"
                                className="flex items-center gap-4 rounded-xl border border-slate-200 p-4 transition hover:border-blue-200 hover:bg-blue-50"
                            >
                                <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-100">
                                    👤
                                </span>

                                <div>
                                    <p className="text-sm font-semibold text-slate-900">
                                        My Profile
                                    </p>

                                    <p className="mt-1 text-xs text-slate-500">
                                        Manage your account
                                    </p>
                                </div>
                            </Link>

                        </div>
                    </div>

                </div>

                {/* Performance */}
                <div className="mt-6 grid gap-6 lg:grid-cols-2">

                    {/* Progress */}
                    <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">

                        <div className="flex items-center justify-between">
                            <div>
                                <h2 className="text-lg font-bold text-slate-900">
                                    Overall Performance
                                </h2>

                                <p className="mt-1 text-sm text-slate-500">
                                    Your current progress
                                </p>
                            </div>

                            <span className="text-2xl font-bold text-blue-600">
                                78%
                            </span>
                        </div>

                        <div className="mt-6 h-3 overflow-hidden rounded-full bg-slate-100">
                            <div className="h-full w-[78%] rounded-full bg-blue-600" />
                        </div>

                        <div className="mt-4 flex justify-between text-xs text-slate-400">
                            <span>0%</span>
                            <span>Target: 80%</span>
                            <span>100%</span>
                        </div>

                    </div>

                    {/* CTA */}
                    <div className="rounded-2xl bg-slate-900 p-6 text-white">

                        <p className="text-sm font-semibold text-blue-400">
                            Keep Going
                        </p>

                        <h2 className="mt-2 text-xl font-bold">
                            Ready for your next challenge?
                        </h2>

                        <p className="mt-2 text-sm leading-6 text-slate-400">
                            Take another quiz and improve your
                            score on the leaderboard.
                        </p>

                        <Link
                            to="/student/quizzes"
                            className="mt-6 inline-flex rounded-lg bg-blue-600 px-5 py-3 text-sm font-semibold text-white hover:bg-blue-700"
                        >
                            Find a Quiz →
                        </Link>

                    </div>

                </div>

            </div>
        </div>
    );
}

export default Dashboard;