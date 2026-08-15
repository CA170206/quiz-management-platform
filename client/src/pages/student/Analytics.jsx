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

                setStats(data.stats);
                setAttempts(data.attempts || []);
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
            <div className="min-h-screen bg-slate-50 px-6 py-10">
                <div className="mx-auto max-w-7xl">

                    <div className="mb-8 animate-pulse">
                        <div className="h-4 w-24 rounded bg-slate-200" />

                        <div className="mt-3 h-9 w-56 rounded bg-slate-200" />

                        <div className="mt-2 h-5 w-80 rounded bg-slate-200" />
                    </div>

                    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
                        {[1, 2, 3, 4].map((item) => (
                            <div
                                key={item}
                                className="h-32 animate-pulse rounded-2xl bg-white ring-1 ring-slate-200"
                            />
                        ))}
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
            <div className="min-h-screen bg-slate-50 px-6 py-10">
                <div className="mx-auto max-w-7xl">

                    <div className="rounded-xl border border-red-100 bg-red-50 px-5 py-4 text-sm text-red-600">
                        {error}
                    </div>

                </div>
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

    const correctAnswers =
        Number(stats?.correct_answers || 0);

    const incorrectAnswers =
        Number(stats?.incorrect_answers || 0);

    const unanswered =
        Number(stats?.unanswered || 0);

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

    // Reverse because API returns newest first
    const chartAttempts = [...attempts].reverse();

    return (
        <div className="min-h-screen bg-slate-50 px-6 py-10">

            <div className="mx-auto max-w-7xl">

                {/* ================================= */}
                {/* HEADER */}
                {/* ================================= */}

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


                {/* ================================= */}
                {/* STATS */}
                {/* ================================= */}

                <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">

                    {/* Attempts */}

                    <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">

                        <p className="text-sm font-medium text-slate-500">
                            Quizzes Attempted
                        </p>

                        <p className="mt-3 text-3xl font-bold text-slate-900">
                            {quizzesAttempted}
                        </p>

                        <p className="mt-2 text-xs text-slate-400">
                            Total attempts
                        </p>

                    </div>


                    {/* Average */}

                    <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">

                        <p className="text-sm font-medium text-slate-500">
                            Average Score
                        </p>

                        <p className="mt-3 text-3xl font-bold text-blue-600">
                            {averageScore}%
                        </p>

                        <p className="mt-2 text-xs text-slate-400">
                            Across all quizzes
                        </p>

                    </div>


                    {/* Best */}

                    <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">

                        <p className="text-sm font-medium text-slate-500">
                            Best Score
                        </p>

                        <p className="mt-3 text-3xl font-bold text-green-600">
                            {bestScore}%
                        </p>

                        <p className="mt-2 text-xs text-slate-400">
                            Highest percentage
                        </p>

                    </div>


                    {/* Pass Rate */}

                    <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">

                        <p className="text-sm font-medium text-slate-500">
                            Pass Rate
                        </p>

                        <p className="mt-3 text-3xl font-bold text-purple-600">
                            {passRate}%
                        </p>

                        <p className="mt-2 text-xs text-slate-400">
                            Successful attempts
                        </p>

                    </div>

                </div>


                {/* ================================= */}
                {/* CHART + SUMMARY */}
                {/* ================================= */}

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
                                Last {chartAttempts.length} Attempts
                            </span>

                        </div>


                        {chartAttempts.length === 0 ? (

                            <div className="flex h-64 items-center justify-center text-sm text-slate-400">
                                No quiz attempts yet.
                            </div>

                        ) : (

                            <>

                                <div className="mt-8 flex h-64 items-end gap-3 border-b border-l border-slate-200 px-5">

                                    {chartAttempts.map(
                                        (attempt) => {

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
                                                    className="flex h-full flex-1 items-end"
                                                >

                                                    <div
                                                        title={`${attempt.quiz_title} - ${percentage}%`}
                                                        className="w-full rounded-t-lg bg-blue-500 transition hover:bg-blue-600"
                                                        style={{
                                                            height: `${height}%`,
                                                        }}
                                                    />

                                                </div>
                                            );
                                        }
                                    )}

                                </div>


                                <div className="mt-3 flex justify-between px-3 text-xs text-slate-400">

                                    {chartAttempts.map(
                                        (attempt, index) => (
                                            <span
                                                key={
                                                    attempt.id
                                                }
                                            >
                                                {index + 1}
                                            </span>
                                        )
                                    )}

                                </div>

                            </>

                        )}

                    </div>


                    {/* Performance Summary */}

                    <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">

                        <h2 className="text-lg font-bold text-slate-900">
                            Performance Summary
                        </h2>


                        <div className="mt-6 space-y-5">

                            {/* Correct */}

                            <div>

                                <div className="flex justify-between text-sm">

                                    <span className="text-slate-500">
                                        Correct Answers
                                    </span>

                                    <span className="font-semibold text-green-600">
                                        {correctPercentage}%
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

                                <div className="flex justify-between text-sm">

                                    <span className="text-slate-500">
                                        Incorrect Answers
                                    </span>

                                    <span className="font-semibold text-red-600">
                                        {incorrectPercentage}%
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

                                <div className="flex justify-between text-sm">

                                    <span className="text-slate-500">
                                        Unanswered
                                    </span>

                                    <span className="font-semibold text-slate-600">
                                        {unansweredPercentage}%
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

                    </div>

                </div>


                {/* ================================= */}
                {/* RECENT ATTEMPTS */}
                {/* ================================= */}

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

                        {attempts.length === 0 ? (

                            <div className="px-6 py-12 text-center">

                                <p className="text-sm text-slate-500">
                                    You haven't attempted any quizzes yet.
                                </p>

                                <Link
                                    to="/student/quizzes"
                                    className="mt-3 inline-block text-sm font-semibold text-blue-600 hover:text-blue-700"
                                >
                                    Browse Quizzes →
                                </Link>

                            </div>

                        ) : (

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

                                    </tr>

                                </thead>


                                <tbody className="divide-y divide-slate-100">

                                    {attempts.map(
                                        (attempt) => {

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
                                                    className="hover:bg-slate-50"
                                                >

                                                    <td className="px-6 py-4 font-semibold text-slate-900">
                                                        {
                                                            attempt.quiz_title
                                                        }
                                                    </td>

                                                    <td className="px-6 py-4 text-slate-600">
                                                        {
                                                            attempt.score
                                                        }{" "}
                                                        /{" "}
                                                        {
                                                            attempt.total_questions
                                                        }
                                                    </td>

                                                    <td className="px-6 py-4 font-semibold text-slate-700">
                                                        {
                                                            percentage
                                                        }%
                                                    </td>

                                                    <td className="px-6 py-4">

                                                        <span
                                                            className={`rounded-full px-3 py-1 text-xs font-semibold ${
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

            </div>

        </div>
    );
}

export default Analytics;