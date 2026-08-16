import Navbar from "../../components/common/Navbar.jsx";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

const API_URL =
    `${import.meta.env.VITE_API_URL}/api/quizzes`;

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

    // ==============================
    // LOADING
    // ==============================

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-50">

                <Navbar />

                <main className="px-4 pb-10 pt-24 sm:px-6 sm:pt-28">

                    <div className="mx-auto max-w-4xl">

                        <div className="h-96 animate-pulse rounded-2xl bg-white shadow-sm ring-1 ring-slate-200" />

                    </div>

                </main>

            </div>
        );
    }

    // ==============================
    // ERROR
    // ==============================

    if (error) {
        return (
            <div className="min-h-screen bg-slate-50">

                <Navbar />

                <main className="px-4 pb-10 pt-24 sm:px-6 sm:pt-28">

                    <div className="mx-auto max-w-4xl">

                        <div className="rounded-xl border border-red-100 bg-red-50 px-4 py-4 text-sm text-red-600 sm:px-5">
                            {error}
                        </div>

                    </div>

                </main>

            </div>
        );
    }

    // ==============================
    // QUIZ NOT FOUND
    // ==============================

    if (!quiz) {
        return (
            <div className="min-h-screen bg-slate-50">

                <Navbar />

                <main className="px-4 pb-10 pt-24 sm:px-6 sm:pt-28">

                    <div className="mx-auto max-w-4xl text-center">

                        <div className="rounded-2xl bg-white p-8 shadow-sm ring-1 ring-slate-200 sm:p-12">

                            <div className="text-4xl">
                                📝
                            </div>

                            <h1 className="mt-4 text-xl font-bold text-slate-900 sm:text-2xl">
                                Quiz not found
                            </h1>

                            <p className="mt-2 text-sm text-slate-500">
                                The quiz you're looking for could not be found.
                            </p>

                            <button
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

                    </div>

                </main>

            </div>
        );
    }

    // ==============================
    // UI
    // ==============================

    return (
        <div className="min-h-screen bg-slate-50">

            <Navbar />

            <main className="px-4 pb-10 pt-24 sm:px-6 sm:pt-28">

                <div className="mx-auto max-w-4xl">

                    {/* ========================= */}
                    {/* BACK */}
                    {/* ========================= */}

                    <button
                        onClick={() =>
                            navigate(
                                "/student/quizzes"
                            )
                        }
                        className="
                            mb-5
                            text-sm
                            font-semibold
                            text-slate-500
                            transition
                            hover:text-black
                            sm:mb-6
                        "
                    >
                        ← Back to Quizzes
                    </button>


                    {/* ========================= */}
                    {/* MAIN CARD */}
                    {/* ========================= */}

                    <div className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-slate-200">

                        {/* ========================= */}
                        {/* HEADER */}
                        {/* ========================= */}

                        <div className="bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 px-5 py-7 text-white sm:px-8 sm:py-10">

                            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/10 text-lg font-bold ring-1 ring-white/10 sm:h-14 sm:w-14 sm:text-xl">
                                Q
                            </div>

                            <h1 className="mt-5 break-words text-2xl font-bold leading-tight sm:mt-6 sm:text-3xl">
                                {quiz.title}
                            </h1>

                            <p className="mt-3 max-w-2xl break-words text-sm leading-6 text-slate-300 sm:text-base">
                                {quiz.description ||
                                    "Test your knowledge with this quiz."}
                            </p>

                        </div>


                        {/* ========================= */}
                        {/* DETAILS */}
                        {/* ========================= */}

                        <div className="px-5 py-6 sm:px-8 sm:py-8">

                            <h2 className="text-lg font-bold text-slate-900">
                                Quiz Information
                            </h2>


                            <div className="mt-5 grid gap-3 sm:mt-6 sm:grid-cols-3 sm:gap-4">

                                {/* Duration */}

                                <div className="rounded-xl bg-slate-50 p-4 sm:p-5">

                                    <p className="text-sm text-slate-500">
                                        Duration
                                    </p>

                                    <p className="mt-2 text-lg font-bold text-slate-900 sm:text-xl">
                                        {quiz.duration} min
                                    </p>

                                </div>


                                {/* Quiz ID */}

                                <div className="rounded-xl bg-slate-50 p-4 sm:p-5">

                                    <p className="text-sm text-slate-500">
                                        Quiz ID
                                    </p>

                                    <p className="mt-2 text-lg font-bold text-slate-900 sm:text-xl">
                                        #{quiz.id}
                                    </p>

                                </div>


                                {/* Category */}

                                <div className="rounded-xl bg-slate-50 p-4 sm:p-5">

                                    <p className="text-sm text-slate-500">
                                        Category
                                    </p>

                                    <p className="mt-2 truncate text-lg font-bold text-slate-900 sm:text-xl">
                                        Quiz
                                    </p>

                                </div>

                            </div>


                            {/* ========================= */}
                            {/* INSTRUCTIONS */}
                            {/* ========================= */}

                            <div className="mt-6 rounded-xl border border-slate-200 bg-slate-50 p-4 sm:mt-8 sm:p-5">

                                <h3 className="font-bold text-slate-900">
                                    Before you start
                                </h3>

                                <ul className="mt-3 space-y-2 text-sm leading-6 text-slate-600">

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


                            {/* ========================= */}
                            {/* ACTIONS */}
                            {/* ========================= */}

                            <div className="mt-6 flex flex-col gap-3 sm:mt-8 sm:flex-row">

                                <button
                                    onClick={() =>
                                        navigate(
                                            `/student/quizzes/${quiz.id}/attempt`
                                        )
                                    }
                                    className="
                                        w-full
                                        rounded-lg
                                        bg-black
                                        px-6 py-3.5
                                        text-sm
                                        font-semibold
                                        text-white
                                        transition
                                        hover:bg-slate-800
                                        sm:flex-1
                                    "
                                >
                                    Start Quiz →
                                </button>


                                <button
                                    onClick={() =>
                                        navigate(
                                            "/student/quizzes"
                                        )
                                    }
                                    className="
                                        w-full
                                        rounded-lg
                                        border
                                        border-slate-300
                                        bg-white
                                        px-6 py-3.5
                                        text-sm
                                        font-semibold
                                        text-slate-700
                                        transition
                                        hover:bg-slate-50
                                        hover:text-black
                                        sm:w-auto
                                    "
                                >
                                    Cancel
                                </button>

                            </div>

                        </div>

                    </div>

                </div>

            </main>

        </div>
    );
}

export default QuizDetails;