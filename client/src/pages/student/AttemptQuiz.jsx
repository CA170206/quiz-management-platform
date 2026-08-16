import Navbar from "../../components/common/Navbar.jsx";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

const QUESTIONS_API = `${import.meta.env.VITE_API_URL}/api/questions`;
const QUIZ_API = `${import.meta.env.VITE_API_URL}/api/quizzes`;
const ATTEMPTS_API = `${import.meta.env.VITE_API_URL}/api/attempts`;

function AttemptQuiz() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [quiz, setQuiz] = useState(null);
    const [questions, setQuestions] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [answers, setAnswers] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [timeLeft, setTimeLeft] = useState(0);
    const [submitting, setSubmitting] = useState(false);
    const [showSubmitModal, setShowSubmitModal] =
        useState(false);

    // ==========================================
    // FETCH QUIZ + QUESTIONS
    // ==========================================

    useEffect(() => {
        const fetchQuizData = async () => {
            try {
                setLoading(true);
                setError("");

                const [
                    quizResponse,
                    questionsResponse,
                ] = await Promise.all([
                    fetch(`${QUIZ_API}/${id}`),
                    fetch(`${QUESTIONS_API}/quiz/${id}`),
                ]);

                if (!quizResponse.ok) {
                    throw new Error("Failed to fetch quiz");
                }

                if (!questionsResponse.ok) {
                    throw new Error(
                        "Failed to fetch questions"
                    );
                }

                const quizData =
                    await quizResponse.json();

                const questionsData =
                    await questionsResponse.json();

                setQuiz(quizData);
                setQuestions(questionsData);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchQuizData();
    }, [id]);

    // ==========================================
    // SET TIMER
    // ==========================================

    useEffect(() => {
        if (!quiz) {
            return;
        }

        setTimeLeft(quiz.duration * 60);
    }, [quiz]);

    // ==========================================
    // COUNTDOWN
    // ==========================================

    useEffect(() => {
        if (timeLeft <= 0) {
            return;
        }

        const timer = setInterval(() => {
            setTimeLeft((prev) => prev - 1);
        }, 1000);

        return () => clearInterval(timer);
    }, [timeLeft]);

    // ==========================================
    // HANDLE ANSWER
    // ==========================================

    const handleAnswer = (answer) => {
        setAnswers((prev) => ({
            ...prev,
            [questions[currentIndex].id]: answer,
        }));
    };

    // ==========================================
    // SUBMIT QUIZ
    // ==========================================

    const handleSubmit = async () => {
        try {
            setSubmitting(true);
            setError("");

            const token =
                localStorage.getItem("token");

            if (!token) {
                throw new Error(
                    "You are not logged in. Please login again."
                );
            }

            const totalTime =
                quiz.duration * 60;

            const timeTaken =
                totalTime - timeLeft;

            const response = await fetch(
                ATTEMPTS_API,
                {
                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json",

                        Authorization:
                            `Bearer ${token}`,
                    },

                    body: JSON.stringify({
                        quiz_id: Number(id),
                        answers,
                        time_taken: timeTaken,
                    }),
                }
            );

            const data =
                await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message ||
                        "Failed to submit quiz"
                );
            }

            setShowSubmitModal(false);

            navigate(
                `/student/results/${data.attempt.id}`
            );
        } catch (err) {
            setError(err.message);
            setShowSubmitModal(false);
        } finally {
            setSubmitting(false);
        }
    };

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

    if (error && !quiz) {
        return (
            <div className="min-h-screen bg-slate-50">

                <Navbar />

                <main className="px-4 pb-10 pt-24 sm:px-6 sm:pt-28">
                    <div className="mx-auto max-w-5xl">

                        <div className="rounded-xl border border-red-100 bg-red-50 p-4 text-sm text-red-600 sm:p-5">
                            {error}
                        </div>

                    </div>
                </main>

            </div>
        );
    }

    if (!quiz) {
        return null;
    }

    // ==========================================
    // NO QUESTIONS
    // ==========================================

    if (questions.length === 0) {
        return (
            <div className="min-h-screen bg-slate-50">

                <Navbar />

                <main className="px-4 pb-10 pt-24 sm:px-6 sm:pt-28">
                    <div className="mx-auto max-w-4xl">

                        <div className="rounded-2xl bg-white p-6 text-center shadow-sm ring-1 ring-slate-200 sm:p-10">

                            <div className="text-4xl">
                                📝
                            </div>

                            <h1 className="mt-4 text-xl font-bold text-slate-900 sm:text-2xl">
                                No Questions Available
                            </h1>

                            <p className="mt-2 text-sm text-slate-500">
                                This quiz does not have any questions yet.
                            </p>

                            <button
                                onClick={() =>
                                    navigate(
                                        "/student/quizzes"
                                    )
                                }
                                className="
                                    mt-6
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

    // ==========================================
    // VALUES
    // ==========================================

    const currentQuestion =
        questions[currentIndex];

    const answeredCount =
        Object.keys(answers).length;

    const progress =
        ((currentIndex + 1) /
            questions.length) *
        100;

    const minutes =
        Math.floor(timeLeft / 60);

    const seconds =
        String(timeLeft % 60).padStart(
            2,
            "0"
        );

    const isLastQuestion =
        currentIndex ===
        questions.length - 1;

    // ==========================================
    // UI
    // ==========================================

    return (
        <div className="min-h-screen bg-slate-50">

            <Navbar />

            <main className="px-4 pb-10 pt-24 sm:px-6 sm:pt-28">

                <div className="mx-auto max-w-5xl">

                    {/* ================================= */}
                    {/* HEADER */}
                    {/* ================================= */}

                    <div className="mb-5 rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-200 sm:mb-6 sm:p-5">

                        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

                            <div className="min-w-0">

                                <p className="text-sm font-semibold text-black">
                                    Quiz Attempt
                                </p>

                                <h1 className="mt-1 break-words text-lg font-bold leading-tight text-slate-900 sm:text-xl">
                                    {quiz.title}
                                </h1>

                            </div>

                            {/* Timer */}

                            <div
                                className={`w-full shrink-0 rounded-xl px-4 py-3 text-center sm:w-auto sm:min-w-[150px] sm:px-5 ${
                                    timeLeft <= 60
                                        ? "bg-red-50 text-red-600"
                                        : "bg-slate-100 text-slate-900"
                                }`}
                            >

                                <p className="text-xs font-semibold uppercase">
                                    Time Remaining
                                </p>

                                <p className="mt-1 text-xl font-bold tabular-nums">
                                    {minutes}:{seconds}
                                </p>

                            </div>

                        </div>

                        {/* Progress */}

                        <div className="mt-5">

                            <div className="mb-2 flex flex-wrap justify-between gap-2 text-xs font-medium text-slate-500">

                                <span>
                                    Question{" "}
                                    {currentIndex + 1}{" "}
                                    of{" "}
                                    {questions.length}
                                </span>

                                <span>
                                    {answeredCount} answered
                                </span>

                            </div>

                            <div className="h-2 overflow-hidden rounded-full bg-slate-100">

                                <div
                                    className="h-full rounded-full bg-black transition-all duration-300"
                                    style={{
                                        width: `${progress}%`,
                                    }}
                                />

                            </div>

                        </div>

                    </div>


                    {/* ERROR */}

                    {error && (
                        <div className="mb-5 rounded-xl border border-red-100 bg-red-50 px-4 py-4 text-sm text-red-600 sm:px-5">
                            {error}
                        </div>
                    )}


                    {/* ================================= */}
                    {/* QUESTION */}
                    {/* ================================= */}

                    <div className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-slate-200">

                        <div className="border-b border-slate-100 px-5 py-5 sm:px-8 sm:py-6">

                            <span className="inline-flex rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
                                Question{" "}
                                {currentIndex + 1}
                            </span>

                            <h2 className="mt-4 break-words text-lg font-bold leading-7 text-slate-900 sm:mt-5 sm:text-2xl sm:leading-8">
                                {
                                    currentQuestion.question_text
                                }
                            </h2>

                        </div>


                        {/* ================================= */}
                        {/* OPTIONS */}
                        {/* ================================= */}

                        <div className="space-y-3 px-5 py-5 sm:px-8 sm:py-6">

                            {[
                                currentQuestion.option_a,
                                currentQuestion.option_b,
                                currentQuestion.option_c,
                                currentQuestion.option_d,
                            ].map(
                                (
                                    option,
                                    index
                                ) => {

                                    const optionLetter =
                                        String.fromCharCode(
                                            65 + index
                                        );

                                    const selected =
                                        answers[
                                            currentQuestion.id
                                        ] === option;

                                    return (
                                        <label
                                            key={index}
                                            className={`flex min-w-0 cursor-pointer items-start gap-3 rounded-xl border p-3 transition sm:items-center sm:gap-4 sm:p-4 ${
                                                selected
                                                    ? "border-slate-900 bg-slate-50 ring-2 ring-slate-200"
                                                    : "border-slate-200 hover:border-slate-400 hover:bg-slate-50"
                                            }`}
                                        >

                                            <input
                                                type="radio"
                                                name={`question-${currentQuestion.id}`}
                                                value={option}
                                                checked={
                                                    selected
                                                }
                                                onChange={() =>
                                                    handleAnswer(
                                                        option
                                                    )
                                                }
                                                className="sr-only"
                                            />

                                            <span
                                                className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-sm font-bold sm:h-10 sm:w-10 ${
                                                    selected
                                                        ? "bg-black text-white"
                                                        : "bg-slate-100 text-slate-600"
                                                }`}
                                            >
                                                {
                                                    optionLetter
                                                }
                                            </span>

                                            <span
                                                className={`min-w-0 break-words text-sm font-medium leading-6 ${
                                                    selected
                                                        ? "text-slate-900"
                                                        : "text-slate-700"
                                                }`}
                                            >
                                                {option}
                                            </span>

                                        </label>
                                    );
                                }
                            )}

                        </div>


                        {/* ================================= */}
                        {/* NAVIGATION */}
                        {/* ================================= */}

                        <div className="border-t border-slate-100 px-5 py-4 sm:px-8 sm:py-5">

                            <div className="flex items-center justify-between gap-3">

                                <button
                                    type="button"
                                    disabled={
                                        currentIndex ===
                                        0
                                    }
                                    onClick={() =>
                                        setCurrentIndex(
                                            currentIndex -
                                                1
                                        )
                                    }
                                    className="
                                        flex-1
                                        rounded-lg
                                        border
                                        border-slate-300
                                        bg-white
                                        px-3 py-3
                                        text-sm
                                        font-semibold
                                        text-slate-700
                                        transition
                                        hover:bg-slate-50
                                        disabled:cursor-not-allowed
                                        disabled:opacity-40
                                        sm:flex-none
                                        sm:px-5
                                    "
                                >
                                    ← Previous
                                </button>


                                {!isLastQuestion ? (

                                    <button
                                        type="button"
                                        onClick={() =>
                                            setCurrentIndex(
                                                currentIndex +
                                                    1
                                            )
                                        }
                                        className="
                                            flex-1
                                            rounded-lg
                                            bg-black
                                            px-3 py-3
                                            text-sm
                                            font-semibold
                                            text-white
                                            transition
                                            hover:bg-slate-800
                                            sm:flex-none
                                            sm:px-6
                                        "
                                    >
                                        Next →
                                    </button>

                                ) : (

                                    <button
                                        type="button"
                                        onClick={() =>
                                            setShowSubmitModal(
                                                true
                                            )
                                        }
                                        className="
                                            flex-1
                                            rounded-lg
                                            bg-green-600
                                            px-3 py-3
                                            text-sm
                                            font-semibold
                                            text-white
                                            transition
                                            hover:bg-green-700
                                            sm:flex-none
                                            sm:px-6
                                        "
                                    >
                                        Submit Quiz
                                    </button>

                                )}

                            </div>

                        </div>

                    </div>


                    {/* ================================= */}
                    {/* QUESTION NAVIGATION */}
                    {/* ================================= */}

                    <div className="mt-5 rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200 sm:mt-6 sm:p-6">

                        <h3 className="text-sm font-bold text-slate-900">
                            Question Navigation
                        </h3>

                        <div className="mt-4 grid grid-cols-5 gap-2 sm:flex sm:flex-wrap">

                            {questions.map(
                                (
                                    question,
                                    index
                                ) => {

                                    const answered =
                                        answers[
                                            question.id
                                        ];

                                    const current =
                                        index ===
                                        currentIndex;

                                    return (
                                        <button
                                            key={
                                                question.id
                                            }
                                            type="button"
                                            onClick={() =>
                                                setCurrentIndex(
                                                    index
                                                )
                                            }
                                            className={`h-10 w-full rounded-lg text-sm font-semibold transition sm:w-10 ${
                                                current
                                                    ? "bg-black text-white ring-2 ring-slate-300"
                                                    : answered
                                                    ? "bg-green-100 text-green-700 hover:bg-green-200"
                                                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                                            }`}
                                        >
                                            {index + 1}
                                        </button>
                                    );
                                }
                            )}

                        </div>


                        <div className="mt-4 flex flex-wrap gap-x-4 gap-y-2 text-xs text-slate-500">

                            <span className="flex items-center gap-2">
                                <span className="h-3 w-3 rounded bg-black" />
                                Current
                            </span>

                            <span className="flex items-center gap-2">
                                <span className="h-3 w-3 rounded bg-green-100" />
                                Answered
                            </span>

                            <span className="flex items-center gap-2">
                                <span className="h-3 w-3 rounded bg-slate-100" />
                                Unanswered
                            </span>

                        </div>

                    </div>

                </div>

            </main>


            {/* ==========================================
                SUBMIT MODAL
            ========================================== */}

            {showSubmitModal && (

                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 px-4">

                    <div className="w-full max-w-md rounded-2xl bg-white p-5 shadow-2xl sm:p-7">

                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-xl">
                            📝
                        </div>

                        <h2 className="mt-5 text-xl font-bold text-slate-900">
                            Submit Quiz?
                        </h2>

                        <p className="mt-2 text-sm leading-6 text-slate-500">

                            You have answered{" "}
                            <strong>
                                {answeredCount}
                            </strong>{" "}
                            out of{" "}
                            <strong>
                                {questions.length}
                            </strong>{" "}
                            questions.

                            <br />

                            Are you sure you want to submit?

                        </p>


                        <div className="mt-6 flex flex-col-reverse gap-3 sm:mt-7 sm:flex-row sm:justify-end">

                            <button
                                type="button"
                                disabled={
                                    submitting
                                }
                                onClick={() =>
                                    setShowSubmitModal(
                                        false
                                    )
                                }
                                className="
                                    w-full
                                    rounded-lg
                                    border
                                    border-slate-300
                                    px-5 py-3
                                    text-sm
                                    font-semibold
                                    text-slate-700
                                    transition
                                    hover:bg-slate-50
                                    sm:w-auto
                                    sm:py-2.5
                                "
                            >
                                Continue Quiz
                            </button>

                            <button
                                type="button"
                                disabled={
                                    submitting
                                }
                                onClick={
                                    handleSubmit
                                }
                                className="
                                    w-full
                                    rounded-lg
                                    bg-black
                                    px-5 py-3
                                    text-sm
                                    font-semibold
                                    text-white
                                    transition
                                    hover:bg-slate-800
                                    disabled:opacity-60
                                    sm:w-auto
                                    sm:py-2.5
                                "
                            >
                                {submitting
                                    ? "Submitting..."
                                    : "Submit"}
                            </button>

                        </div>

                    </div>

                </div>

            )}

        </div>
    );
}

export default AttemptQuiz;