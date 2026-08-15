import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

const API_URL = `${import.meta.env.VITE_API_URL}/api/attempts`;

function Results() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchResult = async () => {
            try {
                setLoading(true);
                setError("");

                const token =
                    localStorage.getItem("token");

                if (!token) {
                    throw new Error(
                        "You are not logged in. Please login again."
                    );
                }

                const response = await fetch(
                    `${API_URL}/${id}`,
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
                            "Failed to fetch result"
                    );
                }

                setResult(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchResult();
    }, [id]);

    // ==========================================
    // LOADING
    // ==========================================

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-50 px-6 py-12">
                <div className="mx-auto max-w-5xl">

                    <div className="h-96 animate-pulse rounded-2xl bg-white shadow-sm ring-1 ring-slate-200" />

                </div>
            </div>
        );
    }

    // ==========================================
    // ERROR
    // ==========================================

    if (error) {
        return (
            <div className="min-h-screen bg-slate-50 px-6 py-12">

                <div className="mx-auto max-w-5xl">

                    <div className="rounded-xl border border-red-100 bg-red-50 p-5 text-red-600">
                        {error}
                    </div>

                    <button
                        type="button"
                        onClick={() =>
                            navigate(
                                "/student/quizzes"
                            )
                        }
                        className="mt-5 rounded-lg bg-blue-600 px-5 py-3 text-sm font-semibold text-white hover:bg-blue-700"
                    >
                        Back to Quizzes
                    </button>

                </div>

            </div>
        );
    }

    if (!result) {
        return null;
    }

    // ==========================================
    // RESULT VALUES
    // ==========================================

    const percentage =
        Number(result.percentage || 0);

    const passed =
        percentage >= 40;

    return (
        <div className="min-h-screen bg-slate-50 px-6 py-10">

            <div className="mx-auto max-w-5xl">

                {/* HEADER */}

                <div className="mb-8 text-center">

                    <p className="text-sm font-semibold text-blue-600">
                        Quiz Completed
                    </p>

                    <h1 className="mt-2 text-3xl font-bold text-slate-900">
                        Your Result
                    </h1>

                    <p className="mt-2 text-slate-500">
                        {result.quiz_title}
                    </p>

                </div>

                {/* SCORE CARD */}

                <div
                    className={`overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ${
                        passed
                            ? "ring-green-200"
                            : "ring-red-200"
                    }`}
                >

                    <div
                        className={`px-6 py-8 text-center ${
                            passed
                                ? "bg-green-50"
                                : "bg-red-50"
                        }`}
                    >

                        <div
                            className={`mx-auto flex h-28 w-28 items-center justify-center rounded-full border-8 bg-white ${
                                passed
                                    ? "border-green-200"
                                    : "border-red-200"
                            }`}
                        >

                            <p
                                className={`text-3xl font-bold ${
                                    passed
                                        ? "text-green-600"
                                        : "text-red-600"
                                }`}
                            >
                                {percentage}%
                            </p>

                        </div>

                        <h2
                            className={`mt-5 text-2xl font-bold ${
                                passed
                                    ? "text-green-700"
                                    : "text-red-700"
                            }`}
                        >
                            {passed
                                ? "Congratulations! You Passed 🎉"
                                : "Quiz Not Passed"}
                        </h2>

                        <p className="mt-2 text-sm text-slate-500">
                            You scored{" "}
                            <strong>
                                {result.score}
                            </strong>{" "}
                            out of{" "}
                            <strong>
                                {result.total_questions}
                            </strong>
                        </p>

                    </div>

                </div>

                {/* STATISTICS */}

                <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">

                    <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">

                        <p className="text-sm text-slate-500">
                            Score
                        </p>

                        <p className="mt-2 text-2xl font-bold text-blue-600">
                            {result.score}/
                            {result.total_questions}
                        </p>

                    </div>

                    <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">

                        <p className="text-sm text-slate-500">
                            Correct
                        </p>

                        <p className="mt-2 text-2xl font-bold text-green-600">
                            {result.correct_answers}
                        </p>

                    </div>

                    <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">

                        <p className="text-sm text-slate-500">
                            Incorrect
                        </p>

                        <p className="mt-2 text-2xl font-bold text-red-600">
                            {result.incorrect_answers}
                        </p>

                    </div>

                    <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">

                        <p className="text-sm text-slate-500">
                            Time Taken
                        </p>

                        <p className="mt-2 text-2xl font-bold text-slate-900">
                            {result.time_taken}s
                        </p>

                    </div>

                </div>

                {/* ANSWER REVIEW */}

                <div className="mt-8">

                    <div className="mb-5">

                        <h2 className="text-xl font-bold text-slate-900">
                            Answer Review
                        </h2>

                        <p className="mt-1 text-sm text-slate-500">
                            Review your answers and see the correct responses.
                        </p>

                    </div>

                    <div className="space-y-4">

                        {result.answers?.map(
                            (answer, index) => (

                                <div
                                    key={
                                        answer.question_id
                                    }
                                    className={`rounded-2xl bg-white p-6 shadow-sm ring-1 ${
                                        answer.is_correct
                                            ? "ring-green-100"
                                            : "ring-red-100"
                                    }`}
                                >

                                    <div className="flex items-start justify-between gap-4">

                                        <div className="flex gap-4">

                                            <div
                                                className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-sm font-bold ${
                                                    answer.is_correct
                                                        ? "bg-green-100 text-green-700"
                                                        : "bg-red-100 text-red-700"
                                                }`}
                                            >
                                                {index + 1}
                                            </div>

                                            <div>

                                                <h3 className="font-semibold leading-6 text-slate-900">
                                                    {
                                                        answer.question_text
                                                    }
                                                </h3>

                                            </div>

                                        </div>

                                        <span
                                            className={`shrink-0 rounded-full px-3 py-1 text-xs font-semibold ${
                                                answer.is_correct
                                                    ? "bg-green-50 text-green-600"
                                                    : "bg-red-50 text-red-600"
                                            }`}
                                        >
                                            {answer.is_correct
                                                ? "Correct"
                                                : "Incorrect"}
                                        </span>

                                    </div>

                                    <div className="mt-5 grid gap-3 sm:grid-cols-2">

                                        <div
                                            className={`rounded-xl p-4 ${
                                                answer.is_correct
                                                    ? "bg-green-50"
                                                    : "bg-red-50"
                                            }`}
                                        >

                                            <p className="text-xs font-semibold uppercase text-slate-500">
                                                Your Answer
                                            </p>

                                            <p className="mt-2 text-sm font-medium text-slate-900">
                                                {answer.selected_answer ||
                                                    "Not Answered"}
                                            </p>

                                        </div>

                                        <div className="rounded-xl bg-green-50 p-4">

                                            <p className="text-xs font-semibold uppercase text-slate-500">
                                                Correct Answer
                                            </p>

                                            <p className="mt-2 text-sm font-medium text-green-700">
                                                {
                                                    answer.correct_answer
                                                }
                                            </p>

                                        </div>

                                    </div>

                                </div>

                            )
                        )}

                    </div>

                </div>

                {/* ACTIONS */}

                <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">

                    <button
                        type="button"
                        onClick={() =>
                            navigate(
                                "/student/quizzes"
                            )
                        }
                        className="rounded-lg bg-blue-600 px-6 py-3 text-sm font-semibold text-white hover:bg-blue-700"
                    >
                        Take Another Quiz
                    </button>

                    <button
                        type="button"
                        onClick={() =>
                            navigate(
                                "/student/leaderboard"
                            )
                        }
                        className="rounded-lg border border-slate-300 bg-white px-6 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                    >
                        View Leaderboard
                    </button>

                </div>

            </div>

        </div>
    );
}

export default Results;