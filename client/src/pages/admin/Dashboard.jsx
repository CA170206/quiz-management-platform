import { Link } from "react-router-dom";

function AdminDashboard() {
    return (
        <div className="min-h-screen bg-slate-50 px-6 py-10">
            <div className="mx-auto max-w-7xl">

                {/* Header */}
                <div className="mb-8">
                    <p className="text-sm font-semibold text-blue-600">
                        Administration
                    </p>

                    <h1 className="mt-1 text-3xl font-bold text-slate-900">
                        Admin Dashboard
                    </h1>

                    <p className="mt-2 text-slate-500">
                        Manage quizzes, questions, categories, and platform activity.
                    </p>
                </div>

                {/* Stats */}
                <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">

                    <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
                        <div className="flex items-center justify-between">
                            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-xl">
                                👥
                            </span>
                            <span className="text-xs font-semibold text-blue-600">
                                Users
                            </span>
                        </div>

                        <p className="mt-5 text-sm text-slate-500">
                            Registered Users
                        </p>

                        <p className="mt-1 text-3xl font-bold text-slate-900">
                            128
                        </p>
                    </div>

                    <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
                        <div className="flex items-center justify-between">
                            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-purple-50 text-xl">
                                📝
                            </span>
                            <span className="text-xs font-semibold text-purple-600">
                                Quizzes
                            </span>
                        </div>

                        <p className="mt-5 text-sm text-slate-500">
                            Total Quizzes
                        </p>

                        <p className="mt-1 text-3xl font-bold text-slate-900">
                            24
                        </p>
                    </div>

                    <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
                        <div className="flex items-center justify-between">
                            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-green-50 text-xl">
                                ❓
                            </span>
                            <span className="text-xs font-semibold text-green-600">
                                Questions
                            </span>
                        </div>

                        <p className="mt-5 text-sm text-slate-500">
                            Total Questions
                        </p>

                        <p className="mt-1 text-3xl font-bold text-slate-900">
                            186
                        </p>
                    </div>

                    <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
                        <div className="flex items-center justify-between">
                            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-orange-50 text-xl">
                                📊
                            </span>
                            <span className="text-xs font-semibold text-orange-600">
                                Attempts
                            </span>
                        </div>

                        <p className="mt-5 text-sm text-slate-500">
                            Quiz Attempts
                        </p>

                        <p className="mt-1 text-3xl font-bold text-slate-900">
                            542
                        </p>
                    </div>

                </div>

                {/* Quick Actions */}
                <div className="mt-6 rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">

                    <div>
                        <h2 className="text-lg font-bold text-slate-900">
                            Quick Actions
                        </h2>

                        <p className="mt-1 text-sm text-slate-500">
                            Manage your quiz platform.
                        </p>
                    </div>

                    <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">

                        <Link
                            to="/admin/quizzes"
                            className="group rounded-xl border border-slate-200 p-5 transition hover:-translate-y-0.5 hover:border-blue-200 hover:bg-blue-50"
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
                            className="group rounded-xl border border-slate-200 p-5 transition hover:-translate-y-0.5 hover:border-green-200 hover:bg-green-50"
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
                            className="group rounded-xl border border-slate-200 p-5 transition hover:-translate-y-0.5 hover:border-purple-200 hover:bg-purple-50"
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
                            className="group rounded-xl border border-slate-200 p-5 transition hover:-translate-y-0.5 hover:border-orange-200 hover:bg-orange-50"
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

                {/* Activity + System Status */}
                <div className="mt-6 grid gap-6 lg:grid-cols-3">

                    {/* Activity */}
                    <div className="rounded-2xl bg-white shadow-sm ring-1 ring-slate-200 lg:col-span-2">

                        <div className="border-b border-slate-100 px-6 py-5">
                            <h2 className="text-lg font-bold text-slate-900">
                                Recent Activity
                            </h2>

                            <p className="mt-1 text-sm text-slate-500">
                                Latest platform activity.
                            </p>
                        </div>

                        <div className="divide-y divide-slate-100">

                            {[
                                {
                                    icon: "📝",
                                    title: "New quiz created",
                                    description: "Java Fundamentals",
                                    time: "10 minutes ago",
                                },
                                {
                                    icon: "❓",
                                    title: "Questions added",
                                    description: "5 questions added to Java",
                                    time: "32 minutes ago",
                                },
                                {
                                    icon: "👤",
                                    title: "New user registered",
                                    description: "New student account created",
                                    time: "1 hour ago",
                                },
                                {
                                    icon: "📊",
                                    title: "Quiz completed",
                                    description: "Python Fundamentals",
                                    time: "2 hours ago",
                                },
                            ].map((activity, index) => (
                                <div
                                    key={index}
                                    className="flex items-center gap-4 px-6 py-5"
                                >
                                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-100">
                                        {activity.icon}
                                    </div>

                                    <div className="min-w-0 flex-1">
                                        <p className="font-semibold text-slate-900">
                                            {activity.title}
                                        </p>

                                        <p className="mt-1 text-xs text-slate-500">
                                            {activity.description}
                                        </p>
                                    </div>

                                    <span className="shrink-0 text-xs text-slate-400">
                                        {activity.time}
                                    </span>
                                </div>
                            ))}

                        </div>
                    </div>

                    {/* Status */}
                    <div className="rounded-2xl bg-slate-900 p-6 text-white">

                        <p className="text-sm font-semibold text-blue-400">
                            System
                        </p>

                        <h2 className="mt-2 text-xl font-bold">
                            Platform Status
                        </h2>

                        <div className="mt-6 space-y-4">

                            <div className="flex items-center justify-between rounded-xl bg-white/5 p-4">
                                <span className="text-sm text-slate-300">
                                    API Server
                                </span>

                                <span className="flex items-center gap-2 text-xs font-semibold text-green-400">
                                    <span className="h-2 w-2 rounded-full bg-green-400" />
                                    Online
                                </span>
                            </div>

                            <div className="flex items-center justify-between rounded-xl bg-white/5 p-4">
                                <span className="text-sm text-slate-300">
                                    Database
                                </span>

                                <span className="flex items-center gap-2 text-xs font-semibold text-green-400">
                                    <span className="h-2 w-2 rounded-full bg-green-400" />
                                    Connected
                                </span>
                            </div>

                            <div className="flex items-center justify-between rounded-xl bg-white/5 p-4">
                                <span className="text-sm text-slate-300">
                                    Authentication
                                </span>

                                <span className="flex items-center gap-2 text-xs font-semibold text-green-400">
                                    <span className="h-2 w-2 rounded-full bg-green-400" />
                                    Active
                                </span>
                            </div>

                        </div>

                        <div className="mt-6 border-t border-white/10 pt-5">
                            <p className="text-xs leading-5 text-slate-400">
                                These statistics are currently UI placeholders.
                                We will connect them to your backend after the
                                design pass.
                            </p>
                        </div>

                    </div>

                </div>

            </div>
        </div>
    );
}

export default AdminDashboard;