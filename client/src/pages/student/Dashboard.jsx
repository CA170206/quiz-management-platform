import { Link } from "react-router-dom";

function Dashboard() {
    return (
        <div className="min-h-screen bg-slate-50 px-4 py-6 sm:px-6 sm:py-10">
            <div className="mx-auto max-w-7xl">

                {/* Welcome */}
                <div className="overflow-hidden rounded-2xl bg-gradient-to-br from-blue-600 to-blue-700 px-5 py-6 text-white shadow-sm sm:px-10 sm:py-8">

                    <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center sm:gap-6">

                        <div className="min-w-0">

                            <p className="text-sm font-semibold text-blue-100">
                                Student Dashboard
                            </p>

                            <h1 className="mt-2 text-2xl font-bold leading-tight sm:text-3xl">
                                Welcome back 👋
                            </h1>

                            <p className="mt-2 max-w-xl text-sm leading-6 text-blue-100">
                                Continue learning, attempt quizzes,
                                and track your performance.
                            </p>

                        </div>

                        <Link
                            to="/student/quizzes"
                            className="inline-flex w-full shrink-0 items-center justify-center rounded-lg bg-white px-5 py-3 text-sm font-semibold text-blue-600 transition hover:bg-blue-50 sm:w-auto"
                        >
                            Browse Quizzes →
                        </Link>

                    </div>

                </div>


                {/* Stats */}
                <div className="mt-5 grid gap-4 sm:mt-6 sm:grid-cols-2 sm:gap-5 lg:grid-cols-4">

                    <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200 sm:p-6">

                        <div className="flex items-center justify-between">
                            <span className="text-2xl">📝</span>

                            <span className="text-xs font-semibold text-blue-600">
                                Total
                            </span>
                        </div>

                        <p className="mt-4 text-sm text-slate-500 sm:mt-5">
                            Quizzes Attempted
                        </p>

                        <p className="mt-1 text-3xl font-bold text-slate-900">
                            12
                        </p>

                    </div>


                    <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200 sm:p-6">

                        <div className="flex items-center justify-between">
                            <span className="text-2xl">🎯</span>

                            <span className="text-xs font-semibold text-green-600">
                                Average
                            </span>
                        </div>

                        <p className="mt-4 text-sm text-slate-500 sm:mt-5">
                            Average Score
                        </p>

                        <p className="mt-1 text-3xl font-bold text-slate-900">
                            78%
                        </p>

                    </div>


                    <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200 sm:p-6">

                        <div className="flex items-center justify-between">
                            <span className="text-2xl">🏆</span>

                            <span className="text-xs font-semibold text-purple-600">
                                Best
                            </span>
                        </div>

                        <p className="mt-4 text-sm text-slate-500 sm:mt-5">
                            Highest Score
                        </p>

                        <p className="mt-1 text-3xl font-bold text-slate-900">
                            95%
                        </p>

                    </div>


                    <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200 sm:p-6">

                        <div className="flex items-center justify-between">
                            <span className="text-2xl">📈</span>

                            <span className="text-xs font-semibold text-orange-600">
                                Current
                            </span>
                        </div>

                        <p className="mt-4 text-sm text-slate-500 sm:mt-5">
                            Pass Rate
                        </p>

                        <p className="mt-1 text-3xl font-bold text-slate-900">
                            83%
                        </p>

                    </div>

                </div>


                {/* Main Content */}
                <div className="mt-5 grid gap-5 sm:mt-6 sm:gap-6 lg:grid-cols-3">

                    {/* Recent Activity */}
                    <div className="min-w-0 overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-slate-200 lg:col-span-2">

                        <div className="flex flex-col gap-3 border-b border-slate-100 px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-6">

                            <div className="min-w-0">

                                <h2 className="text-lg font-bold text-slate-900">
                                    Recent Activity
                                </h2>

                                <p className="mt-1 text-sm text-slate-500">
                                    Your latest quiz attempts
                                </p>

                            </div>

                            <Link
                                to="/student/analytics"
                                className="shrink-0 text-sm font-semibold text-blue-600 hover:text-blue-700"
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
                                    className="flex items-center justify-between gap-3 px-5 py-4 transition hover:bg-slate-50 sm:gap-4 sm:px-6 sm:py-5"
                                >

                                    <div className="flex min-w-0 items-center gap-3 sm:gap-4">

                                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 font-bold text-blue-600 sm:h-11 sm:w-11">
                                            Q
                                        </div>

                                        <div className="min-w-0">

                                            <p className="truncate font-semibold text-slate-900">
                                                {item.name}
                                            </p>

                                            <p className="mt-1 text-xs text-slate-400">
                                                Quiz attempt
                                            </p>

                                        </div>

                                    </div>


                                    <div className="shrink-0 text-right">

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
                    <div className="min-w-0 rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200 sm:p-6">

                        <h2 className="text-lg font-bold text-slate-900">
                            Quick Actions
                        </h2>

                        <p className="mt-1 text-sm text-slate-500">
                            Jump straight to what you need.
                        </p>

                        <div className="mt-5 space-y-3 sm:mt-6">

                            <Link
                                to="/student/quizzes"
                                className="flex items-center gap-3 rounded-xl border border-slate-200 p-3 transition hover:border-blue-200 hover:bg-blue-50 sm:gap-4 sm:p-4"
                            >

                                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-100">
                                    📝
                                </span>

                                <div className="min-w-0">
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
                                className="flex items-center gap-3 rounded-xl border border-slate-200 p-3 transition hover:border-blue-200 hover:bg-blue-50 sm:gap-4 sm:p-4"
                            >

                                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-yellow-100">
                                    🏆
                                </span>

                                <div className="min-w-0">
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
                                className="flex items-center gap-3 rounded-xl border border-slate-200 p-3 transition hover:border-blue-200 hover:bg-blue-50 sm:gap-4 sm:p-4"
                            >

                                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-purple-100">
                                    📊
                                </span>

                                <div className="min-w-0">
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
                                className="flex items-center gap-3 rounded-xl border border-slate-200 p-3 transition hover:border-blue-200 hover:bg-blue-50 sm:gap-4 sm:p-4"
                            >

                                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-slate-100">
                                    👤
                                </span>

                                <div className="min-w-0">
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
                <div className="mt-5 grid gap-5 sm:mt-6 sm:gap-6 lg:grid-cols-2">

                    {/* Progress */}
                    <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200 sm:p-6">

                        <div className="flex items-start justify-between gap-4">

                            <div className="min-w-0">

                                <h2 className="text-lg font-bold text-slate-900">
                                    Overall Performance
                                </h2>

                                <p className="mt-1 text-sm text-slate-500">
                                    Your current progress
                                </p>

                            </div>

                            <span className="shrink-0 text-2xl font-bold text-blue-600">
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
                    <div className="rounded-2xl bg-slate-900 p-5 text-white sm:p-6">

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
                            className="mt-6 inline-flex w-full items-center justify-center rounded-lg bg-blue-600 px-5 py-3 text-sm font-semibold text-white hover:bg-blue-700 sm:w-auto"
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