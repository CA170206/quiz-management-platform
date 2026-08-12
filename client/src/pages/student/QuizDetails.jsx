import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

const API_URL = "http://localhost:5000/api/quizzes";

function QuizDetails() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [quiz, setQuiz] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchQuiz = async () => {
            try {
                setLoading(true);
                setError("");

                const response = await fetch(
                    `${API_URL}/${id}`
                );

                const data = await response.json();

                if (!response.ok) {
                    throw new Error(
                        data.message ||
                        "Failed to fetch quiz"
                    );
                }

                setQuiz(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchQuiz();
    }, [id]);

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-50 px-6 py-12">
                <div className="mx-auto max-w-4xl">
                    <div className="h-80 animate-pulse rounded-2xl bg-white shadow-sm ring-1 ring-slate-200" />
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-slate-50 px-6 py-12">
                <div className="mx-auto max-w-4xl">
                    <div className="rounded-xl bg-red-50 px-5 py-4 text-red-600">
                        {error}
                    </div>
                </div>
            </div>
        );
    }

    if (!quiz) {
        return (
            <div className="min-h-screen bg-slate-50 px-6 py-12">
                <div className="mx-auto max-w-4xl text-center">
                    <h1 className="text-2xl font-bold text-slate-900">
                        Quiz not found
                    </h1>

                    <button
                        onClick={() =>
                            navigate("/student/quizzes")
                        }
                        className="mt-5 rounded-lg bg-blue-600 px-5 py-3 text-sm font-semibold text-white hover:bg-blue-700"
                    >
                        Back to Quizzes
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 px-6 py-10">
            <div className="mx-auto max-w-4xl">

                {/* Back */}
                <button
                    onClick={() =>
                        navigate("/student/quizzes")
                    }
                    className="mb-6 text-sm font-semibold text-slate-500 hover:text-blue-600"
                >
                    ← Back to Quizzes
                </button>

                {/* Main Card */}
                <div className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-slate-200">

                    {/* Header */}
                    <div className="bg-gradient-to-br from-blue-600 to-blue-700 px-8 py-10 text-white">

                        <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-white/15 text-xl font-bold">
                            Q
                        </div>

                        <h1 className="mt-6 text-3xl font-bold">
                            {quiz.title}
                        </h1>

                        <p className="mt-3 max-w-2xl text-sm leading-6 text-blue-100">
                            {quiz.description ||
                                "Test your knowledge with this quiz."}
                        </p>

                    </div>

                    {/* Details */}
                    <div className="px-8 py-8">

                        <h2 className="text-lg font-bold text-slate-900">
                            Quiz Information
                        </h2>

                        <div className="mt-6 grid gap-4 sm:grid-cols-3">

                            <div className="rounded-xl bg-slate-50 p-5">
                                <p className="text-sm text-slate-500">
                                    Duration
                                </p>

                                <p className="mt-2 text-xl font-bold text-slate-900">
                                    {quiz.duration} min
                                </p>
                            </div>

                            <div className="rounded-xl bg-slate-50 p-5">
                                <p className="text-sm text-slate-500">
                                    Quiz ID
                                </p>

                                <p className="mt-2 text-xl font-bold text-slate-900">
                                    #{quiz.id}
                                </p>
                            </div>

                            <div className="rounded-xl bg-slate-50 p-5">
                                <p className="text-sm text-slate-500">
                                    Category
                                </p>

                                <p className="mt-2 text-xl font-bold text-slate-900">
                                    Quiz
                                </p>
                            </div>

                        </div>

                        {/* Instructions */}
                        <div className="mt-8 rounded-xl border border-blue-100 bg-blue-50 p-5">

                            <h3 className="font-bold text-blue-900">
                                Before you start
                            </h3>

                            <ul className="mt-3 space-y-2 text-sm leading-6 text-blue-800">
                                <li>
                                    • Make sure you have enough time to complete the quiz.
                                </li>

                                <li>
                                    • Once started, the timer will begin automatically.
                                </li>

                                <li>
                                    • Review your answers before submitting.
                                </li>
                            </ul>

                        </div>

                        {/* Actions */}
                        <div className="mt-8 flex flex-col gap-3 sm:flex-row">

                            <button
                                onClick={() =>
                                    navigate(
                                        `/student/quizzes/${quiz.id}/attempt`
                                    )
                                }
                                className="flex-1 rounded-lg bg-blue-600 px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-blue-700"
                            >
                                Start Quiz →
                            </button>

                            <button
                                onClick={() =>
                                    navigate(
                                        "/student/quizzes"
                                    )
                                }
                                className="rounded-lg border border-slate-300 bg-white px-6 py-3.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                            >
                                Cancel
                            </button>

                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
}

export default QuizDetails;