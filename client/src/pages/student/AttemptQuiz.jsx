import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

const QUESTIONS_API = "http://localhost:5000/api/questions";
const QUIZ_API = "http://localhost:5000/api/quizzes";
const ATTEMPTS_API = "http://localhost:5000/api/attempts";

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
    const [showSubmitModal, setShowSubmitModal] = useState(false);

    // ==========================================
    // FETCH QUIZ + QUESTIONS
    // ==========================================

    useEffect(() => {
        const fetchQuizData = async () => {
            try {
                setLoading(true);
                setError("");

                const [quizResponse, questionsResponse] =
                    await Promise.all([
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
                sessionStorage.getItem("token");

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


            // Close modal
            setShowSubmitModal(false);


            // Go to result page
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
            <div className="min-h-screen bg-slate-50 px-6 py-12">

                <div className="mx-auto max-w-4xl">

                    <div className="h-96 animate-pulse rounded-2xl bg-white shadow-sm ring-1 ring-slate-200" />

                </div>

            </div>
        );
    }


    // ==========================================
    // ERROR
    // ==========================================

    if (error && !quiz) {
        return (
            <div className="min-h-screen bg-slate-50 px-6 py-12">

                <div className="mx-auto max-w-4xl rounded-xl bg-red-50 p-5 text-red-600">
                    {error}
                </div>

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
            <div className="min-h-screen bg-slate-50 px-6 py-12">

                <div className="mx-auto max-w-4xl rounded-2xl bg-white p-10 text-center shadow-sm ring-1 ring-slate-200">

                    <div className="text-4xl">
                        📝
                    </div>

                    <h1 className="mt-4 text-2xl font-bold text-slate-900">
                        No Questions Available
                    </h1>

                    <p className="mt-2 text-slate-500">
                        This quiz does not have any questions yet.
                    </p>

                    <button
                        onClick={() =>
                            navigate(
                                "/student/quizzes"
                            )
                        }
                        className="mt-6 rounded-lg bg-blue-600 px-5 py-3 text-sm font-semibold text-white hover:bg-blue-700"
                    >
                        Back to Quizzes
                    </button>

                </div>

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
        <div className="min-h-screen bg-slate-50 px-4 py-6 sm:px-6">

            <div className="mx-auto max-w-5xl">

                {/* ================================= */}
                {/* HEADER */}
                {/* ================================= */}

                <div className="mb-6 rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200">

                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

                        <div>

                            <p className="text-sm font-semibold text-blue-600">
                                Quiz Attempt
                            </p>

                            <h1 className="mt-1 text-xl font-bold text-slate-900">
                                {quiz.title}
                            </h1>

                        </div>


                        {/* Timer */}

                        <div
                            className={`rounded-xl px-5 py-3 text-center ${
                                timeLeft <= 60
                                    ? "bg-red-50 text-red-600"
                                    : "bg-blue-50 text-blue-600"
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

                        <div className="mb-2 flex justify-between text-xs font-medium text-slate-500">

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
                                className="h-full rounded-full bg-blue-600 transition-all duration-300"
                                style={{
                                    width: `${progress}%`,
                                }}
                            />

                        </div>

                    </div>

                </div>


                {/* ================================= */}
                {/* ERROR */}
                {/* ================================= */}

                {error && (
                    <div className="mb-5 rounded-xl bg-red-50 px-5 py-4 text-sm text-red-600">
                        {error}
                    </div>
                )}


                {/* ================================= */}
                {/* QUESTION */}
                {/* ================================= */}

                <div className="rounded-2xl bg-white shadow-sm ring-1 ring-slate-200">

                    <div className="border-b border-slate-100 px-6 py-6 sm:px-8">

                        <span className="inline-flex rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-600">
                            Question{" "}
                            {currentIndex + 1}
                        </span>

                        <h2 className="mt-5 text-xl font-bold leading-8 text-slate-900 sm:text-2xl">
                            {
                                currentQuestion.question_text
                            }
                        </h2>

                    </div>


                    {/* Options */}

                    <div className="space-y-3 px-6 py-6 sm:px-8">

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
                                        className={`flex cursor-pointer items-center gap-4 rounded-xl border p-4 transition ${
                                            selected
                                                ? "border-blue-500 bg-blue-50 ring-2 ring-blue-100"
                                                : "border-slate-200 hover:border-blue-300 hover:bg-slate-50"
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
                                            className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-sm font-bold ${
                                                selected
                                                    ? "bg-blue-600 text-white"
                                                    : "bg-slate-100 text-slate-600"
                                            }`}
                                        >
                                            {
                                                optionLetter
                                            }
                                        </span>


                                        <span
                                            className={`text-sm font-medium leading-6 ${
                                                selected
                                                    ? "text-blue-900"
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


                    {/* Navigation */}

                    <div className="border-t border-slate-100 px-6 py-5 sm:px-8">

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
                                className="rounded-lg border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
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
                                    className="rounded-lg bg-blue-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
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
                                    className="rounded-lg bg-green-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-green-700"
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

                <div className="mt-6 rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">

                    <h3 className="text-sm font-bold text-slate-900">
                        Question Navigation
                    </h3>


                    <div className="mt-4 flex flex-wrap gap-2">

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
                                        className={`h-10 w-10 rounded-lg text-sm font-semibold transition ${
                                            current
                                                ? "bg-blue-600 text-white ring-2 ring-blue-200"
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


                    <div className="mt-4 flex flex-wrap gap-4 text-xs text-slate-500">

                        <span className="flex items-center gap-2">
                            <span className="h-3 w-3 rounded bg-blue-600" />
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


            {/* ================================= */}
            {/* SUBMIT MODAL */}
            {/* ================================= */}

            {showSubmitModal && (

                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 px-5">

                    <div className="w-full max-w-md rounded-2xl bg-white p-7 shadow-2xl">

                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-50 text-xl">
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


                        <div className="mt-7 flex justify-end gap-3">

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
                                className="rounded-lg border border-slate-300 px-5 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
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
                                className="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-60"
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