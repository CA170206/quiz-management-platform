import Navbar from "../../components/common/Navbar.jsx";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const API_URL =
    `${import.meta.env.VITE_API_URL}/api/analytics/student`;

function Dashboard() {
    const [stats, setStats] = useState(null);
    const [attempts, setAttempts] = useState([]);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    // ==========================================
    // FETCH REAL STUDENT ANALYTICS
    // ==========================================

    useEffect(() => {
        const fetchDashboardData = async () => {
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

                const data = await response.json();

                if (!response.ok) {
                    throw new Error(
                        data.message ||
                            "Failed to fetch dashboard data"
                    );
                }

                setStats(data.stats || {});
                setAttempts(data.attempts || []);
            } catch (err) {
                setError(
                    err.message ||
                        "Failed to load dashboard"
                );
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, []);

    // ==========================================
    // LOADING
    // ==========================================

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-50">

                <Navbar />

                <main className="px-4 pb-10 pt-24 sm:px-6 sm:pt-28">
                    <div className="mx-auto max-w-7xl">

                        <div className="h-44 animate-pulse rounded-2xl bg-slate-200 sm:h-40" />

                        <div className="mt-5 grid gap-4 sm:mt-6 sm:grid-cols-2 sm:gap-5 lg:grid-cols-4">
                            {[1, 2, 3, 4].map((item) => (
                                <div
                                    key={item}
                                    className="h-36 animate-pulse rounded-2xl bg-white ring-1 ring-slate-200"
                                />
                            ))}
                        </div>

                        <div className="mt-5 grid gap-5 sm:mt-6 lg:grid-cols-3">
                            <div className="h-80 animate-pulse rounded-2xl bg-white ring-1 ring-slate-200 lg:col-span-2" />

                            <div className="h-80 animate-pulse rounded-2xl bg-white ring-1 ring-slate-200" />
                        </div>

                    </div>
                </main>

            </div>
        );
    }

    // ==========================================
    // ERROR
    // ==========================================

    if (error) {
        return (
            <div className="min-h-screen bg-slate-50">

                <Navbar />

                <main className="px-4 pb-10 pt-24 sm:px-6 sm:pt-28">
                    <div className="mx-auto max-w-7xl">

                        <div className="rounded-xl border border-red-100 bg-red-50 px-5 py-4 text-sm text-red-600">
                            {error}
                        </div>

                        <Link
                            to="/student/quizzes"
                            className="
                                mt-5
                                inline-flex
                                rounded-lg
                                bg-black
                                px-5 py-3
                                text-sm
                                font-semibold
                                text-white
                                transition
                                hover:bg-slate-800
                            "
                        >
                            Browse Quizzes →
                        </Link>

                    </div>
                </main>

            </div>
        );
    }

    // ==========================================
    // REAL VALUES
    // ==========================================

    const quizzesAttempted =
        Number(stats?.quizzes_attempted || 0);

    const averageScore =
        Number(stats?.average_score || 0);

    const bestScore =
        Number(stats?.best_score || 0);

    const passRate =
        Number(stats?.pass_rate || 0);

    const recentAttempts =
        attempts.slice(0, 3);

    return (
        <div className="min-h-screen bg-slate-50">

            {/* ================================= */}
            {/* SHARED NAVBAR */}
            {/* ================================= */}

            <Navbar />


            <main className="px-4 pb-10 pt-24 sm:px-6 sm:pt-28">

                <div className="mx-auto max-w-7xl">

                    {/* ================================= */}
                    {/* WELCOME */}
                    {/* ================================= */}

                    <div className="overflow-hidden rounded-2xl bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 px-5 py-6 text-white shadow-sm sm:px-10 sm:py-8">

                        <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center sm:gap-6">

                            <div className="min-w-0">

                                <p className="text-sm font-semibold text-slate-300">
                                    Student Dashboard
                                </p>

                                <h1 className="mt-2 text-2xl font-bold leading-tight sm:text-3xl">
                                    Welcome back 👋
                                </h1>

                                <p className="mt-2 max-w-xl text-sm leading-6 text-slate-300">
                                    Continue learning, attempt quizzes,
                                    and track your performance.
                                </p>

                            </div>

                            <Link
                                to="/student/quizzes"
                                className="
                                    inline-flex
                                    w-full
                                    shrink-0
                                    items-center
                                    justify-center
                                    rounded-lg
                                    bg-white
                                    px-5 py-3
                                    text-sm
                                    font-semibold
                                    text-black
                                    transition
                                    hover:bg-slate-100
                                    sm:w-auto
                                "
                            >
                                Browse Quizzes →
                            </Link>

                        </div>

                    </div>


                    {/* ================================= */}
                    {/* STATS */}
                    {/* ================================= */}

                    <div className="mt-5 grid gap-4 sm:mt-6 sm:grid-cols-2 sm:gap-5 lg:grid-cols-4">

                        {/* Attempts */}

                        <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200 transition hover:-translate-y-0.5 hover:shadow-md sm:p-6">

                            <div className="flex items-center justify-between">

                                <span className="text-2xl">
                                    📝
                                </span>

                                <span className="text-xs font-semibold text-slate-600">
                                    Total
                                </span>

                            </div>

                            <p className="mt-4 text-sm text-slate-500 sm:mt-5">
                                Quizzes Attempted
                            </p>

                            <p className="mt-1 text-3xl font-bold text-slate-900">
                                {quizzesAttempted}
                            </p>

                        </div>


                        {/* Average */}

                        <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200 transition hover:-translate-y-0.5 hover:shadow-md sm:p-6">

                            <div className="flex items-center justify-between">

                                <span className="text-2xl">
                                    🎯
                                </span>

                                <span className="text-xs font-semibold text-slate-600">
                                    Average
                                </span>

                            </div>

                            <p className="mt-4 text-sm text-slate-500 sm:mt-5">
                                Average Score
                            </p>

                            <p className="mt-1 text-3xl font-bold text-slate-900">
                                {averageScore}%
                            </p>

                        </div>


                        {/* Best */}

                        <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200 transition hover:-translate-y-0.5 hover:shadow-md sm:p-6">

                            <div className="flex items-center justify-between">

                                <span className="text-2xl">
                                    🏆
                                </span>

                                <span className="text-xs font-semibold text-slate-600">
                                    Best
                                </span>

                            </div>

                            <p className="mt-4 text-sm text-slate-500 sm:mt-5">
                                Highest Score
                            </p>

                            <p className="mt-1 text-3xl font-bold text-slate-900">
                                {bestScore}%
                            </p>

                        </div>


                        {/* Pass Rate */}

                        <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200 transition hover:-translate-y-0.5 hover:shadow-md sm:p-6">

                            <div className="flex items-center justify-between">

                                <span className="text-2xl">
                                    📈
                                </span>

                                <span className="text-xs font-semibold text-slate-600">
                                    Current
                                </span>

                            </div>

                            <p className="mt-4 text-sm text-slate-500 sm:mt-5">
                                Pass Rate
                            </p>

                            <p className="mt-1 text-3xl font-bold text-slate-900">
                                {passRate}%
                            </p>

                        </div>

                    </div>


                    {/* ================================= */}
                    {/* MAIN CONTENT */}
                    {/* ================================= */}

                    <div className="mt-5 grid gap-5 sm:mt-6 sm:gap-6 lg:grid-cols-3">

                        {/* ================================= */}
                        {/* RECENT ACTIVITY */}
                        {/* ================================= */}

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
                                    className="
                                        shrink-0
                                        text-sm
                                        font-semibold
                                        text-slate-700
                                        transition
                                        hover:text-black
                                    "
                                >
                                    View Analytics →
                                </Link>

                            </div>


                            <div className="divide-y divide-slate-100">

                                {recentAttempts.length === 0 ? (

                                    <div className="px-5 py-12 text-center sm:px-6">

                                        <p className="text-sm text-slate-500">
                                            You haven't attempted
                                            any quizzes yet.
                                        </p>

                                        <Link
                                            to="/student/quizzes"
                                            className="
                                                mt-3
                                                inline-block
                                                text-sm
                                                font-semibold
                                                text-slate-700
                                                hover:text-black
                                            "
                                        >
                                            Browse Quizzes →
                                        </Link>

                                    </div>

                                ) : (

                                    recentAttempts.map(
                                        (attempt) => {

                                            const percentage =
                                                Number(
                                                    attempt.percentage ||
                                                        0
                                                );

                                            const passed =
                                                percentage >= 40;

                                            return (
                                                <div
                                                    key={attempt.id}
                                                    className="
                                                        flex
                                                        items-center
                                                        justify-between
                                                        gap-3
                                                        px-5 py-4
                                                        transition
                                                        hover:bg-slate-50
                                                        sm:gap-4
                                                        sm:px-6 sm:py-5
                                                    "
                                                >

                                                    <div className="flex min-w-0 items-center gap-3 sm:gap-4">

                                                        <div className="
                                                            flex
                                                            h-10 w-10
                                                            shrink-0
                                                            items-center
                                                            justify-center
                                                            rounded-xl
                                                            bg-slate-100
                                                            font-bold
                                                            text-slate-800
                                                            sm:h-11 sm:w-11
                                                        ">
                                                            Q
                                                        </div>

                                                        <div className="min-w-0">

                                                            <p className="truncate font-semibold text-slate-900">
                                                                {
                                                                    attempt.quiz_title
                                                                }
                                                            </p>

                                                            <p className="mt-1 text-xs text-slate-400">
                                                                Score:{" "}
                                                                {
                                                                    attempt.score
                                                                }{" "}
                                                                /{" "}
                                                                {
                                                                    attempt.total_questions
                                                                }
                                                            </p>

                                                        </div>

                                                    </div>


                                                    <div className="shrink-0 text-right">

                                                        <p className="font-bold text-slate-900">
                                                            {percentage}%
                                                        </p>

                                                        <span
                                                            className={`text-xs font-semibold ${
                                                                passed
                                                                    ? "text-green-600"
                                                                    : "text-red-600"
                                                            }`}
                                                        >
                                                            {passed
                                                                ? "Passed"
                                                                : "Failed"}
                                                        </span>

                                                    </div>

                                                </div>
                                            );
                                        }
                                    )

                                )}

                            </div>

                        </div>


                        {/* ================================= */}
                        {/* QUICK ACTIONS */}
                        {/* ================================= */}

                        <div className="min-w-0 rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200 sm:p-6">

                            <h2 className="text-lg font-bold text-slate-900">
                                Quick Actions
                            </h2>

                            <p className="mt-1 text-sm text-slate-500">
                                Jump straight to what you need.
                            </p>


                            <div className="mt-5 space-y-3 sm:mt-6">

                                {/* TAKE QUIZ */}

                                <Link
                                    to="/student/quizzes"
                                    className="
                                        group
                                        flex
                                        items-center
                                        gap-3
                                        rounded-xl
                                        border
                                        border-slate-200
                                        bg-white
                                        p-3
                                        transition-all
                                        duration-200
                                        hover:-translate-y-0.5
                                        hover:border-slate-400
                                        hover:bg-slate-50
                                        hover:shadow-sm
                                        sm:gap-4
                                        sm:p-4
                                    "
                                >

                                    <span className="
                                        flex
                                        h-10 w-10
                                        shrink-0
                                        items-center
                                        justify-center
                                        rounded-lg
                                        bg-slate-100
                                        transition-all
                                        duration-200
                                        group-hover:scale-105
                                        group-hover:bg-slate-200
                                    ">
                                        📝
                                    </span>

                                    <div className="min-w-0">

                                        <p className="
                                            text-sm
                                            font-semibold
                                            text-slate-900
                                            transition-colors
                                            group-hover:text-black
                                        ">
                                            Take a Quiz
                                        </p>

                                        <p className="
                                            mt-1
                                            text-xs
                                            text-slate-500
                                        ">
                                            Test your knowledge
                                        </p>

                                    </div>

                                    <span className="
                                        ml-auto
                                        text-slate-700
                                        opacity-0
                                        transition-all
                                        duration-200
                                        group-hover:translate-x-1
                                        group-hover:opacity-100
                                    ">
                                        →
                                    </span>

                                </Link>


                                {/* LEADERBOARD */}

                                <Link
                                    to="/student/leaderboard"
                                    className="
                                        group
                                        flex
                                        items-center
                                        gap-3
                                        rounded-xl
                                        border
                                        border-slate-200
                                        bg-white
                                        p-3
                                        transition-all
                                        duration-200
                                        hover:-translate-y-0.5
                                        hover:border-slate-400
                                        hover:bg-slate-50
                                        hover:shadow-sm
                                        sm:gap-4
                                        sm:p-4
                                    "
                                >

                                    <span className="
                                        flex
                                        h-10 w-10
                                        shrink-0
                                        items-center
                                        justify-center
                                        rounded-lg
                                        bg-slate-100
                                        transition-all
                                        duration-200
                                        group-hover:scale-105
                                        group-hover:bg-slate-200
                                    ">
                                        🏆
                                    </span>

                                    <div className="min-w-0">

                                        <p className="
                                            text-sm
                                            font-semibold
                                            text-slate-900
                                            transition-colors
                                            group-hover:text-black
                                        ">
                                            Leaderboard
                                        </p>

                                        <p className="
                                            mt-1
                                            text-xs
                                            text-slate-500
                                        ">
                                            Check your ranking
                                        </p>

                                    </div>

                                    <span className="
                                        ml-auto
                                        text-slate-700
                                        opacity-0
                                        transition-all
                                        duration-200
                                        group-hover:translate-x-1
                                        group-hover:opacity-100
                                    ">
                                        →
                                    </span>

                                </Link>


                                {/* ANALYTICS */}

                                <Link
                                    to="/student/analytics"
                                    className="
                                        group
                                        flex
                                        items-center
                                        gap-3
                                        rounded-xl
                                        border
                                        border-slate-200
                                        bg-white
                                        p-3
                                        transition-all
                                        duration-200
                                        hover:-translate-y-0.5
                                        hover:border-slate-400
                                        hover:bg-slate-50
                                        hover:shadow-sm
                                        sm:gap-4
                                        sm:p-4
                                    "
                                >

                                    <span className="
                                        flex
                                        h-10 w-10
                                        shrink-0
                                        items-center
                                        justify-center
                                        rounded-lg
                                        bg-slate-100
                                        transition-all
                                        duration-200
                                        group-hover:scale-105
                                        group-hover:bg-slate-200
                                    ">
                                        📊
                                    </span>

                                    <div className="min-w-0">

                                        <p className="
                                            text-sm
                                            font-semibold
                                            text-slate-900
                                            transition-colors
                                            group-hover:text-black
                                        ">
                                            My Analytics
                                        </p>

                                        <p className="
                                            mt-1
                                            text-xs
                                            text-slate-500
                                        ">
                                            Track your progress
                                        </p>

                                    </div>

                                    <span className="
                                        ml-auto
                                        text-slate-700
                                        opacity-0
                                        transition-all
                                        duration-200
                                        group-hover:translate-x-1
                                        group-hover:opacity-100
                                    ">
                                        →
                                    </span>

                                </Link>


                                {/* PROFILE */}

                                <Link
                                    to="/student/profile"
                                    className="
                                        group
                                        flex
                                        items-center
                                        gap-3
                                        rounded-xl
                                        border
                                        border-slate-200
                                        bg-white
                                        p-3
                                        transition-all
                                        duration-200
                                        hover:-translate-y-0.5
                                        hover:border-slate-400
                                        hover:bg-slate-50
                                        hover:shadow-sm
                                        sm:gap-4
                                        sm:p-4
                                    "
                                >

                                    <span className="
                                        flex
                                        h-10 w-10
                                        shrink-0
                                        items-center
                                        justify-center
                                        rounded-lg
                                        bg-slate-100
                                        transition-all
                                        duration-200
                                        group-hover:scale-105
                                        group-hover:bg-slate-200
                                    ">
                                        👤
                                    </span>

                                    <div className="min-w-0">

                                        <p className="
                                            text-sm
                                            font-semibold
                                            text-slate-900
                                            transition-colors
                                            group-hover:text-black
                                        ">
                                            My Profile
                                        </p>

                                        <p className="
                                            mt-1
                                            text-xs
                                            text-slate-500
                                        ">
                                            Manage your account
                                        </p>

                                    </div>

                                    <span className="
                                        ml-auto
                                        text-slate-700
                                        opacity-0
                                        transition-all
                                        duration-200
                                        group-hover:translate-x-1
                                        group-hover:opacity-100
                                    ">
                                        →
                                    </span>

                                </Link>

                            </div>

                        </div>

                    </div>


                    {/* ================================= */}
                    {/* PERFORMANCE */}
                    {/* ================================= */}

                    <div className="mt-5 grid gap-5 sm:mt-6 sm:gap-6 lg:grid-cols-2">

                        {/* Overall Performance */}

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

                                <span className="shrink-0 text-2xl font-bold text-slate-900">
                                    {averageScore}%
                                </span>

                            </div>


                            <div className="mt-6 h-3 overflow-hidden rounded-full bg-slate-100">

                                <div
                                    className="
                                        h-full
                                        rounded-full
                                        bg-black
                                        transition-all
                                        duration-500
                                    "
                                    style={{
                                        width: `${Math.min(
                                            Math.max(
                                                averageScore,
                                                0
                                            ),
                                            100
                                        )}%`,
                                    }}
                                />

                            </div>


                            <div className="mt-4 flex justify-between text-xs text-slate-400">

                                <span>0%</span>

                                <span>
                                    Target: 80%
                                </span>

                                <span>100%</span>

                            </div>

                        </div>


                        {/* CTA */}

                        <div className="rounded-2xl bg-slate-900 p-5 text-white sm:p-6">

                            <p className="text-sm font-semibold text-slate-300">
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
                                className="
                                    mt-6
                                    inline-flex
                                    w-full
                                    items-center
                                    justify-center
                                    rounded-lg
                                    bg-white
                                    px-5 py-3
                                    text-sm
                                    font-semibold
                                    text-black
                                    transition
                                    hover:bg-slate-100
                                    sm:w-auto
                                "
                            >
                                Find a Quiz →
                            </Link>

                        </div>

                    </div>

                </div>

            </main>

        </div>
    );
}

export default Dashboard;