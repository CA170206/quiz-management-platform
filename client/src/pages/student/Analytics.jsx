import Navbar from "../../components/common/Navbar.jsx";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const API_URL =
    `${import.meta.env.VITE_API_URL}/api/analytics/student`;

function Analytics() {
    const [stats, setStats] = useState(null);
    const [attempts, setAttempts] = useState([]);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    // ==========================================
    // FETCH REAL ANALYTICS
    // ==========================================

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

                const data =
                    await response.json();

                if (!response.ok) {
                    throw new Error(
                        data.message ||
                            "Failed to fetch analytics"
                    );
                }

                setStats(data.stats || {});
                setAttempts(data.attempts || []);
            } catch (err) {
                setError(
                    err.message ||
                        "Failed to load analytics"
                );
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
            <div className="min-h-screen bg-slate-50">

                <Navbar />

                <main className="px-4 pb-10 pt-24 sm:px-6 sm:pt-28">

                    <div className="mx-auto max-w-7xl">

                        <div className="mb-7 animate-pulse sm:mb-8">

                            <div className="h-4 w-24 rounded bg-slate-200" />

                            <div className="mt-3 h-8 w-48 rounded bg-slate-200 sm:h-9 sm:w-56" />

                            <div className="mt-2 h-5 w-full max-w-sm rounded bg-slate-200" />

                        </div>


                        <div className="grid gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-4">

                            {[1, 2, 3, 4].map(
                                (item) => (
                                    <div
                                        key={item}
                                        className="h-32 animate-pulse rounded-2xl bg-white shadow-sm ring-1 ring-slate-200"
                                    />
                                )
                            )}

                        </div>


                        <div className="mt-5 grid gap-5 sm:mt-6 lg:grid-cols-3">

                            <div className="h-80 animate-pulse rounded-2xl bg-white shadow-sm ring-1 ring-slate-200 lg:col-span-2" />

                            <div className="h-80 animate-pulse rounded-2xl bg-white shadow-sm ring-1 ring-slate-200" />

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

                        <div className="rounded-xl border border-red-100 bg-red-50 px-4 py-4 text-sm text-red-600 sm:px-5">
                            {error}
                        </div>

                    </div>

                </main>

            </div>
        );
    }

    // ==========================================
    // REAL VALUES
    // ==========================================

    const quizzesAttempted =
        Number(
            stats?.quizzes_attempted || 0
        );

    const averageScore =
        Number(
            stats?.average_score || 0
        );

    const bestScore =
        Number(
            stats?.best_score || 0
        );

    const passRate =
        Number(
            stats?.pass_rate || 0
        );

    const correctAnswers =
        Number(
            stats?.correct_answers || 0
        );

    const incorrectAnswers =
        Number(
            stats?.incorrect_answers || 0
        );

    const unanswered =
        Number(
            stats?.unanswered || 0
        );

    const totalAnswers =
        correctAnswers +
        incorrectAnswers +
        unanswered;

    const correctPercentage =
        totalAnswers > 0
            ? Math.round(
                  (correctAnswers /
                      totalAnswers) *
                      100
              )
            : 0;

    const incorrectPercentage =
        totalAnswers > 0
            ? Math.round(
                  (incorrectAnswers /
                      totalAnswers) *
                      100
              )
            : 0;

    const unansweredPercentage =
        totalAnswers > 0
            ? Math.round(
                  (unanswered /
                      totalAnswers) *
                      100
              )
            : 0;

    const chartAttempts =
        [...attempts].reverse();

    // ==========================================
    // UI
    // ==========================================

    return (
        <div className="min-h-screen bg-slate-50">

            <Navbar />

            <main className="px-4 pb-10 pt-24 sm:px-6 sm:pt-28">

                <div className="mx-auto max-w-7xl">

                    {/* ================================= */}
                    {/* HEADER */}
                    {/* ================================= */}

                    <div className="mb-6 sm:mb-8">

                        <p className="text-sm font-semibold text-black">
                            Performance
                        </p>

                        <h1 className="mt-1 text-2xl font-bold text-slate-900 sm:text-3xl">
                            My Analytics
                        </h1>

                        <p className="mt-2 text-sm leading-6 text-slate-500 sm:text-base">
                            Track your quiz performance and progress.
                        </p>

                    </div>


                    {/* ================================= */}
                    {/* STATS */}
                    {/* ================================= */}

                    <div className="grid gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-4">

                        {/* Quizzes */}

                        <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200 sm:p-6">

                            <div className="flex items-center justify-between">

                                <span className="text-2xl">
                                    📝
                                </span>

                                <span className="text-xs font-semibold text-slate-500">
                                    Total
                                </span>

                            </div>

                            <p className="mt-4 text-sm font-medium text-slate-500">
                                Quizzes Attempted
                            </p>

                            <p className="mt-1 text-3xl font-bold text-slate-900">
                                {quizzesAttempted}
                            </p>

                            <p className="mt-2 text-xs text-slate-400">
                                Total attempts
                            </p>

                        </div>


                        {/* Average */}

                        <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200 sm:p-6">

                            <div className="flex items-center justify-between">

                                <span className="text-2xl">
                                    🎯
                                </span>

                                <span className="text-xs font-semibold text-green-600">
                                    Average
                                </span>

                            </div>

                            <p className="mt-4 text-sm font-medium text-slate-500">
                                Average Score
                            </p>

                            <p className="mt-1 text-3xl font-bold text-slate-900">
                                {averageScore}%
                            </p>

                            <p className="mt-2 text-xs text-slate-400">
                                Across all quizzes
                            </p>

                        </div>


                        {/* Best */}

                        <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200 sm:p-6">

                            <div className="flex items-center justify-between">

                                <span className="text-2xl">
                                    🏆
                                </span>

                                <span className="text-xs font-semibold text-slate-700">
                                    Best
                                </span>

                            </div>

                            <p className="mt-4 text-sm font-medium text-slate-500">
                                Best Score
                            </p>

                            <p className="mt-1 text-3xl font-bold text-slate-900">
                                {bestScore}%
                            </p>

                            <p className="mt-2 text-xs text-slate-400">
                                Highest percentage
                            </p>

                        </div>


                        {/* Pass Rate */}

                        <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200 sm:p-6">

                            <div className="flex items-center justify-between">

                                <span className="text-2xl">
                                    ✓
                                </span>

                                <span className="text-xs font-semibold text-green-600">
                                    Pass Rate
                                </span>

                            </div>

                            <p className="mt-4 text-sm font-medium text-slate-500">
                                Pass Rate
                            </p>

                            <p className="mt-1 text-3xl font-bold text-slate-900">
                                {passRate}%
                            </p>

                            <p className="mt-2 text-xs text-slate-400">
                                Based on attempts
                            </p>

                        </div>

                    </div>


                    {/* ================================= */}
                    {/* MAIN CONTENT */}
                    {/* ================================= */}

                    <div className="mt-5 grid gap-5 sm:mt-6 sm:gap-6 lg:grid-cols-3">

                        {/* ================================= */}
                        {/* PERFORMANCE HISTORY */}
                        {/* ================================= */}

                        <div className="min-w-0 overflow-hidden rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200 sm:p-6 lg:col-span-2">

                            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">

                                <div className="min-w-0">

                                    <h2 className="text-lg font-bold text-slate-900">
                                        Performance History
                                    </h2>

                                    <p className="mt-1 text-sm text-slate-500">
                                        Your recent quiz scores
                                    </p>

                                </div>

                                <span className="shrink-0 text-xs font-semibold text-slate-400">
                                    {attempts.length} Attempts
                                </span>

                            </div>


                            {chartAttempts.length ===
                            0 ? (

                                <div className="flex h-64 items-center justify-center text-center text-sm text-slate-400">
                                    No quiz attempts yet.
                                </div>

                            ) : (

                                <>

                                    {/* Chart */}

                                    <div className="mt-7 flex h-56 items-end gap-1 border-b border-l border-slate-200 px-2 sm:mt-8 sm:h-64 sm:gap-3 sm:px-5">

                                        {chartAttempts.map(
                                            (
                                                attempt
                                            ) => {

                                                const percentage =
                                                    Number(
                                                        attempt.percentage ||
                                                            0
                                                    );

                                                const height =
                                                    Math.max(
                                                        percentage,
                                                        2
                                                    );

                                                return (
                                                    <div
                                                        key={
                                                            attempt.id
                                                        }
                                                        className="flex h-full min-w-0 flex-1 items-end"
                                                    >

                                                        <div
                                                            title={`${attempt.quiz_title} - ${percentage}%`}
                                                            className="w-full rounded-t-md bg-black transition hover:bg-slate-700 sm:rounded-t-lg"
                                                            style={{
                                                                height: `${height}%`,
                                                            }}
                                                        />

                                                    </div>
                                                );
                                            }
                                        )}

                                    </div>


                                    {/* Numbers */}

                                    <div className="mt-3 flex justify-between overflow-hidden px-1 text-xs text-slate-400 sm:px-3">

                                        {chartAttempts.map(
                                            (
                                                attempt,
                                                index
                                            ) => (

                                                <span
                                                    key={
                                                        attempt.id
                                                    }
                                                >
                                                    {index +
                                                        1}
                                                </span>

                                            )
                                        )}

                                    </div>

                                </>

                            )}

                        </div>


                        {/* ================================= */}
                        {/* PERFORMANCE SUMMARY */}
                        {/* ================================= */}

                        <div className="min-w-0 rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200 sm:p-6">

                            <h2 className="text-lg font-bold text-slate-900">
                                Performance Summary
                            </h2>


                            <div className="mt-5 space-y-5 sm:mt-6">

                                {/* Correct */}

                                <div>

                                    <div className="flex justify-between gap-3 text-sm">

                                        <span className="text-slate-500">
                                            Correct Answers
                                        </span>

                                        <span className="shrink-0 font-semibold text-green-600">
                                            {
                                                correctPercentage
                                            }
                                            %
                                        </span>

                                    </div>

                                    <div className="mt-2 h-2 rounded-full bg-slate-100">

                                        <div
                                            className="h-2 rounded-full bg-green-500"
                                            style={{
                                                width: `${correctPercentage}%`,
                                            }}
                                        />

                                    </div>

                                </div>


                                {/* Incorrect */}

                                <div>

                                    <div className="flex justify-between gap-3 text-sm">

                                        <span className="text-slate-500">
                                            Incorrect Answers
                                        </span>

                                        <span className="shrink-0 font-semibold text-red-600">
                                            {
                                                incorrectPercentage
                                            }
                                            %
                                        </span>

                                    </div>

                                    <div className="mt-2 h-2 rounded-full bg-slate-100">

                                        <div
                                            className="h-2 rounded-full bg-red-500"
                                            style={{
                                                width: `${incorrectPercentage}%`,
                                            }}
                                        />

                                    </div>

                                </div>


                                {/* Unanswered */}

                                <div>

                                    <div className="flex justify-between gap-3 text-sm">

                                        <span className="text-slate-500">
                                            Unanswered
                                        </span>

                                        <span className="shrink-0 font-semibold text-slate-600">
                                            {
                                                unansweredPercentage
                                            }
                                            %
                                        </span>

                                    </div>

                                    <div className="mt-2 h-2 rounded-full bg-slate-100">

                                        <div
                                            className="h-2 rounded-full bg-slate-400"
                                            style={{
                                                width: `${unansweredPercentage}%`,
                                            }}
                                        />

                                    </div>

                                </div>

                            </div>


                            {/* Totals */}

                            <div className="mt-6 grid grid-cols-3 gap-2 border-t border-slate-100 pt-5">

                                <div className="min-w-0 text-center">

                                    <p className="text-lg font-bold text-green-600">
                                        {
                                            correctAnswers
                                        }
                                    </p>

                                    <p className="mt-1 text-[11px] text-slate-400">
                                        Correct
                                    </p>

                                </div>


                                <div className="min-w-0 text-center">

                                    <p className="text-lg font-bold text-red-600">
                                        {
                                            incorrectAnswers
                                        }
                                    </p>

                                    <p className="mt-1 text-[11px] text-slate-400">
                                        Incorrect
                                    </p>

                                </div>


                                <div className="min-w-0 text-center">

                                    <p className="text-lg font-bold text-slate-600">
                                        {unanswered}
                                    </p>

                                    <p className="mt-1 text-[11px] text-slate-400">
                                        Unanswered
                                    </p>

                                </div>

                            </div>

                        </div>

                    </div>


                    {/* ================================= */}
                    {/* RECENT ATTEMPTS */}
                    {/* ================================= */}

                    <div className="mt-5 overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-slate-200 sm:mt-6">

                        <div className="flex flex-col gap-3 border-b border-slate-100 px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-6">

                            <div className="min-w-0">

                                <h2 className="text-lg font-bold text-slate-900">
                                    Recent Attempts
                                </h2>

                                <p className="mt-1 text-sm text-slate-500">
                                    Your latest quiz activity
                                </p>

                            </div>


                            <Link
                                to="/student/quizzes"
                                className="
                                    shrink-0
                                    text-sm
                                    font-semibold
                                    text-slate-700
                                    transition
                                    hover:text-black
                                "
                            >
                                Take a Quiz →
                            </Link>

                        </div>


                        <div className="overflow-x-auto">

                            {attempts.length ===
                            0 ? (

                                <div className="px-5 py-12 text-center sm:px-6">

                                    <p className="text-sm text-slate-500">
                                        You haven't attempted any quizzes yet.
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

                                <table className="w-full min-w-[650px] text-left text-sm">

                                    <thead className="bg-slate-50 text-xs uppercase text-slate-500">

                                        <tr>

                                            <th className="px-5 py-4 sm:px-6">
                                                Quiz
                                            </th>

                                            <th className="px-5 py-4 sm:px-6">
                                                Score
                                            </th>

                                            <th className="px-5 py-4 sm:px-6">
                                                Percentage
                                            </th>

                                            <th className="px-5 py-4 sm:px-6">
                                                Status
                                            </th>

                                        </tr>

                                    </thead>


                                    <tbody className="divide-y divide-slate-100">

                                        {attempts.map(
                                            (
                                                attempt
                                            ) => {

                                                const percentage =
                                                    Number(
                                                        attempt.percentage ||
                                                            0
                                                    );

                                                const passed =
                                                    percentage >=
                                                    40;

                                                return (
                                                    <tr
                                                        key={
                                                            attempt.id
                                                        }
                                                        className="transition hover:bg-slate-50"
                                                    >

                                                        <td className="max-w-[260px] px-5 py-4 sm:px-6">

                                                            <p className="truncate font-semibold text-slate-900">
                                                                {
                                                                    attempt.quiz_title ||
                                                                    "Quiz"
                                                                }
                                                            </p>

                                                            {attempt.created_at && (
                                                                <p className="mt-1 text-xs text-slate-400">
                                                                    {new Date(
                                                                        attempt.created_at
                                                                    ).toLocaleDateString()}
                                                                </p>
                                                            )}

                                                        </td>


                                                        <td className="px-5 py-4 font-semibold text-slate-700 sm:px-6">

                                                            {
                                                                attempt.score ??
                                                                0
                                                            }

                                                        </td>


                                                        <td className="px-5 py-4 sm:px-6">

                                                            <span className="font-semibold text-slate-900">
                                                                {
                                                                    percentage
                                                                }
                                                                %
                                                            </span>

                                                        </td>


                                                        <td className="px-5 py-4 sm:px-6">

                                                            <span
                                                                className={`whitespace-nowrap rounded-full px-3 py-1 text-xs font-semibold ${
                                                                    passed
                                                                        ? "bg-green-50 text-green-600"
                                                                        : "bg-red-50 text-red-600"
                                                                }`}
                                                            >
                                                                {passed
                                                                    ? "Passed"
                                                                    : "Failed"}
                                                            </span>

                                                        </td>

                                                    </tr>
                                                );
                                            }
                                        )}

                                    </tbody>

                                </table>

                            )}

                        </div>

                    </div>


                    {/* ================================= */}
                    {/* CTA */}
                    {/* ================================= */}

                    <div className="mt-5 overflow-hidden rounded-2xl bg-slate-900 p-5 text-white sm:mt-6 sm:p-6">

                        <p className="text-sm font-semibold text-slate-300">
                            Keep Going
                        </p>

                        <h2 className="mt-2 text-xl font-bold">
                            Ready for your next challenge?
                        </h2>

                        <p className="mt-2 max-w-xl text-sm leading-6 text-slate-400">
                            Take another quiz and improve your score on the leaderboard.
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
                                hover:bg-slate-200
                                sm:w-auto
                            "
                        >
                            Find a Quiz →
                        </Link>

                    </div>

                </div>

            </main>

        </div>
    );
}

export default Analytics;