import Navbar from "../../components/common/Navbar.jsx";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

const API_URL =
    `${import.meta.env.VITE_API_URL}/api/attempts`;

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
            <div className="min-h-screen bg-slate-50">

                <Navbar />

                <main className="px-4 pb-10 pt-24 sm:px-6 sm:pt-28">

                    <div className="mx-auto max-w-5xl">

                        <div className="h-96 animate-pulse rounded-2xl bg-white shadow-sm ring-1 ring-slate-200" />

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

                    <div className="mx-auto max-w-5xl">

                        <div className="rounded-xl border border-red-100 bg-red-50 p-4 text-sm text-red-600 sm:p-5">
                            {error}
                        </div>

                        <button
                            type="button"
                            onClick={() =>
                                navigate(
                                    "/student/quizzes"
                                )
                            }
                            className="
                                mt-5
                                w-full
                                rounded-lg
                                bg-black
                                px-5 py-3
                                text-sm
                                font-semibold
                                text-white
                                transition
                                hover:bg-slate-800
                                sm:w-auto
                            "
                        >
                            Back to Quizzes
                        </button>

                    </div>

                </main>

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
        <div className="min-h-screen bg-slate-50">

            <Navbar />

            <main className="px-4 pb-10 pt-24 sm:px-6 sm:pt-28">

                <div className="mx-auto max-w-5xl">

                    {/* ================================= */}
                    {/* HEADER */}
                    {/* ================================= */}

                    <div className="mb-6 text-center sm:mb-8">

                        <p className="text-sm font-semibold text-black">
                            Quiz Completed
                        </p>

                        <h1 className="mt-2 text-2xl font-bold text-slate-900 sm:text-3xl">
                            Your Result
                        </h1>

                        <p className="mt-2 break-words text-sm text-slate-500 sm:text-base">
                            {result.quiz_title}
                        </p>

                    </div>


                    {/* ================================= */}
                    {/* SCORE CARD */}
                    {/* ================================= */}

                    <div
                        className={`overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ${
                            passed
                                ? "ring-green-200"
                                : "ring-red-200"
                        }`}
                    >

                        <div
                            className={`px-5 py-7 text-center sm:px-6 sm:py-8 ${
                                passed
                                    ? "bg-green-50"
                                    : "bg-red-50"
                            }`}
                        >

                            <div
                                className={`mx-auto flex h-24 w-24 items-center justify-center rounded-full border-8 bg-white sm:h-28 sm:w-28 ${
                                    passed
                                        ? "border-green-200"
                                        : "border-red-200"
                                }`}
                            >

                                <p
                                    className={`text-2xl font-bold sm:text-3xl ${
                                        passed
                                            ? "text-green-600"
                                            : "text-red-600"
                                    }`}
                                >
                                    {percentage}%
                                </p>

                            </div>

                            <h2
                                className={`mt-5 break-words text-xl font-bold sm:text-2xl ${
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
                                    {
                                        result.total_questions
                                    }
                                </strong>
                            </p>

                        </div>

                    </div>


                    {/* ================================= */}
                    {/* STATISTICS */}
                    {/* ================================= */}

                    <div className="mt-5 grid gap-3 sm:mt-6 sm:grid-cols-2 sm:gap-4 lg:grid-cols-4">

                        {/* Score */}

                        <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200 sm:p-6">

                            <p className="text-sm text-slate-500">
                                Score
                            </p>

                            <p className="mt-2 text-2xl font-bold text-slate-900">
                                {result.score}/
                                {result.total_questions}
                            </p>

                        </div>


                        {/* Correct */}

                        <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200 sm:p-6">

                            <p className="text-sm text-slate-500">
                                Correct
                            </p>

                            <p className="mt-2 text-2xl font-bold text-green-600">
                                {
                                    result.correct_answers
                                }
                            </p>

                        </div>


                        {/* Incorrect */}

                        <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200 sm:p-6">

                            <p className="text-sm text-slate-500">
                                Incorrect
                            </p>

                            <p className="mt-2 text-2xl font-bold text-red-600">
                                {
                                    result.incorrect_answers
                                }
                            </p>

                        </div>


                        {/* Time */}

                        <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200 sm:p-6">

                            <p className="text-sm text-slate-500">
                                Time Taken
                            </p>

                            <p className="mt-2 text-2xl font-bold text-slate-900">
                                {
                                    result.time_taken
                                }
                                s
                            </p>

                        </div>

                    </div>


                    {/* ================================= */}
                    {/* ANSWER REVIEW */}
                    {/* ================================= */}

                    <div className="mt-7 sm:mt-8">

                        <div className="mb-4 sm:mb-5">

                            <h2 className="text-xl font-bold text-slate-900">
                                Answer Review
                            </h2>

                            <p className="mt-1 text-sm leading-6 text-slate-500">
                                Review your answers and see the correct responses.
                            </p>

                        </div>


                        <div className="space-y-4">

                            {result.answers?.map(
                                (
                                    answer,
                                    index
                                ) => (

                                    <div
                                        key={
                                            answer.question_id
                                        }
                                        className={`min-w-0 overflow-hidden rounded-2xl bg-white p-4 shadow-sm ring-1 sm:p-6 ${
                                            answer.is_correct
                                                ? "ring-green-100"
                                                : "ring-red-100"
                                        }`}
                                    >

                                        {/* Question Header */}

                                        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">

                                            <div className="flex min-w-0 gap-3 sm:gap-4">

                                                <div
                                                    className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-sm font-bold ${
                                                        answer.is_correct
                                                            ? "bg-green-100 text-green-700"
                                                            : "bg-red-100 text-red-700"
                                                    }`}
                                                >
                                                    {index + 1}
                                                </div>


                                                <div className="min-w-0 flex-1">

                                                    {/* Difficulty */}

                                                    {answer.difficulty && (
                                                        <div className="mb-2">

                                                            <span
                                                                className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                                                                    answer.difficulty ===
                                                                    "beginner"
                                                                        ? "bg-green-50 text-green-700"
                                                                        : answer.difficulty ===
                                                                          "medium"
                                                                        ? "bg-yellow-50 text-yellow-700"
                                                                        : "bg-red-50 text-red-700"
                                                                }`}
                                                            >
                                                                {answer.difficulty ===
                                                                "beginner"
                                                                    ? "Beginner"
                                                                    : answer.difficulty ===
                                                                      "medium"
                                                                    ? "Medium"
                                                                    : "Intermediate"}
                                                            </span>

                                                        </div>
                                                    )}

                                                    <h3 className="break-words font-semibold leading-6 text-slate-900">
                                                        {
                                                            answer.question_text
                                                        }
                                                    </h3>

                                                </div>

                                            </div>


                                            <span
                                                className={`self-start rounded-full px-3 py-1 text-xs font-semibold sm:shrink-0 ${
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


                                        {/* Answers */}

                                        <div className="mt-4 grid gap-3 sm:mt-5 sm:grid-cols-2">

                                            {/* Your Answer */}

                                            <div
                                                className={`min-w-0 rounded-xl p-4 ${
                                                    answer.is_correct
                                                        ? "bg-green-50"
                                                        : "bg-red-50"
                                                }`}
                                            >

                                                <p className="text-xs font-semibold uppercase text-slate-500">
                                                    Your Answer
                                                </p>

                                                <p className="mt-2 break-words text-sm font-medium leading-6 text-slate-900">
                                                    {answer.selected_answer ||
                                                        "Not Answered"}
                                                </p>

                                            </div>


                                            {/* Correct Answer */}

                                            <div className="min-w-0 rounded-xl bg-green-50 p-4">

                                                <p className="text-xs font-semibold uppercase text-slate-500">
                                                    Correct Answer
                                                </p>

                                                <p className="mt-2 break-words text-sm font-medium leading-6 text-green-700">
                                                    {
                                                        answer.correct_answer
                                                    }
                                                </p>

                                            </div>

                                        </div>


                                        {/* Explanation */}

                                        {answer.explanation && (
                                            <div className="mt-4 rounded-xl border border-slate-200 bg-slate-50 p-4">

                                                <p className="text-xs font-semibold uppercase tracking-wide text-slate-700">
                                                    Explanation
                                                </p>

                                                <p className="mt-2 break-words text-sm leading-6 text-slate-700">
                                                    {
                                                        answer.explanation
                                                    }
                                                </p>

                                            </div>
                                        )}

                                    </div>

                                )
                            )}

                        </div>

                    </div>


                    {/* ================================= */}
                    {/* ACTIONS */}
                    {/* ================================= */}

                    <div className="mt-7 flex flex-col gap-3 sm:mt-8 sm:flex-row sm:justify-center">

                        <button
                            type="button"
                            onClick={() =>
                                navigate(
                                    "/student/quizzes"
                                )
                            }
                            className="
                                w-full
                                rounded-lg
                                bg-black
                                px-6 py-3
                                text-sm
                                font-semibold
                                text-white
                                transition
                                hover:bg-slate-800
                                sm:w-auto
                            "
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
                            className="
                                w-full
                                rounded-lg
                                border
                                border-slate-300
                                bg-white
                                px-6 py-3
                                text-sm
                                font-semibold
                                text-slate-700
                                transition
                                hover:bg-slate-50
                                hover:text-black
                                sm:w-auto
                            "
                        >
                            View Leaderboard
                        </button>

                    </div>

                </div>

            </main>

        </div>
    );
}

export default Results;