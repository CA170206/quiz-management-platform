import Navbar from "../../components/common/Navbar.jsx";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useTheme } from "../../context/ThemeContext";

const API_URL =
    `${import.meta.env.VITE_API_URL}/api/quizzes`;

const QUESTIONS_API_URL =
    `${import.meta.env.VITE_API_URL}/api/questions`;

const CATEGORY_API_URL =
    `${import.meta.env.VITE_API_URL}/api/categories`;

function QuizDetails() {
    const { id } = useParams();
    const navigate = useNavigate();

    const { darkMode } = useTheme();

    const [quiz, setQuiz] = useState(null);
    const [questionCount, setQuestionCount] =
        useState(null);
    const [categoryName, setCategoryName] =
        useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    // =========================================================
    // FETCH QUIZ DETAILS
    // =========================================================

    useEffect(() => {
        const fetchQuizDetails = async () => {
            try {
                setLoading(true);
                setError("");

                // ---------------------------------------------
                // Fetch quiz
                // ---------------------------------------------

                const quizResponse = await fetch(
                    `${API_URL}/${id}`
                );

                const quizData =
                    await quizResponse.json();

                if (!quizResponse.ok) {
                    throw new Error(
                        quizData.message ||
                            "Failed to fetch quiz"
                    );
                }

                setQuiz(quizData);

                // ---------------------------------------------
                // Fetch questions
                // ---------------------------------------------

                try {
                    const questionsResponse =
                        await fetch(
                            `${QUESTIONS_API_URL}/quiz/${id}`
                        );

                    if (questionsResponse.ok) {
                        const questionsData =
                            await questionsResponse.json();

                        if (
                            Array.isArray(
                                questionsData
                            )
                        ) {
                            setQuestionCount(
                                questionsData.length
                            );
                        } else if (
                            Array.isArray(
                                questionsData.questions
                            )
                        ) {
                            setQuestionCount(
                                questionsData.questions
                                    .length
                            );
                        } else if (
                            typeof questionsData.count ===
                            "number"
                        ) {
                            setQuestionCount(
                                questionsData.count
                            );
                        }
                    }
                } catch (questionError) {
                    console.error(
                        "Failed to fetch questions:",
                        questionError
                    );
                }

                // ---------------------------------------------
                // Fetch category
                // ---------------------------------------------

                try {
                    const categoriesResponse =
                        await fetch(
                            CATEGORY_API_URL
                        );

                    if (categoriesResponse.ok) {
                        const categoriesData =
                            await categoriesResponse.json();

                        const categories =
                            Array.isArray(
                                categoriesData
                            )
                                ? categoriesData
                                : Array.isArray(
                                      categoriesData.categories
                                  )
                                ? categoriesData.categories
                                : [];

                        const categoryId =
                            quizData.category_id;

                        const category =
                            categories.find(
                                (item) =>
                                    Number(item.id) ===
                                    Number(categoryId)
                            );

                        if (category) {
                            setCategoryName(
                                category.name ||
                                    category.title ||
                                    ""
                            );
                        }
                    }
                } catch (categoryError) {
                    console.error(
                        "Failed to fetch category:",
                        categoryError
                    );
                }
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchQuizDetails();
    }, [id]);

    // =========================================================
    // HELPERS
    // =========================================================

    const getValue = (
        values,
        fallback = "Not specified"
    ) => {
        for (const value of values) {
            if (
                value !== undefined &&
                value !== null &&
                value !== ""
            ) {
                return value;
            }
        }

        return fallback;
    };

    // =========================================================
    // LOADING
    // =========================================================

    if (loading) {
        return (
            <div
                className={`
                    min-h-screen
                    transition-colors
                    duration-300
                    ${
                        darkMode
                            ? "bg-[#0a0a0a]"
                            : "bg-slate-50"
                    }
                `}
            >
                <Navbar />

                <main className="px-4 pb-10 pt-24 sm:px-6 sm:pt-28">

                    <div className="mx-auto max-w-4xl">

                        <div
                            className={`
                                h-96
                                animate-pulse
                                rounded-2xl
                                ${
                                    darkMode
                                        ? "bg-[#151515] ring-1 ring-white/10"
                                        : "bg-white ring-1 ring-slate-200"
                                }
                            `}
                        />

                    </div>

                </main>
            </div>
        );
    }

    // =========================================================
    // ERROR
    // =========================================================

    if (error) {
        return (
            <div
                className={`
                    min-h-screen
                    transition-colors
                    duration-300
                    ${
                        darkMode
                            ? "bg-[#0a0a0a]"
                            : "bg-slate-50"
                    }
                `}
            >
                <Navbar />

                <main className="px-4 pb-10 pt-24 sm:px-6 sm:pt-28">

                    <div className="mx-auto max-w-4xl">

                        <div
                            className={`
                                rounded-xl
                                border
                                px-4
                                py-4
                                text-sm
                                ${
                                    darkMode
                                        ? "border-red-500/20 bg-red-500/10 text-red-400"
                                        : "border-red-100 bg-red-50 text-red-600"
                                }
                            `}
                        >
                            {error}
                        </div>

                    </div>

                </main>
            </div>
        );
    }

    // =========================================================
    // QUIZ NOT FOUND
    // =========================================================

    if (!quiz) {
        return (
            <div
                className={`
                    min-h-screen
                    transition-colors
                    duration-300
                    ${
                        darkMode
                            ? "bg-[#0a0a0a]"
                            : "bg-slate-50"
                    }
                `}
            >
                <Navbar />

                <main className="px-4 pb-10 pt-24 sm:px-6 sm:pt-28">

                    <div className="mx-auto max-w-4xl text-center">

                        <div
                            className={`
                                rounded-2xl
                                p-8
                                shadow-sm
                                sm:p-12
                                ${
                                    darkMode
                                        ? "bg-[#151515] ring-1 ring-white/10"
                                        : "bg-white ring-1 ring-slate-200"
                                }
                            `}
                        >

                            <div className="text-4xl">
                                📝
                            </div>

                            <h1
                                className={`
                                    mt-4
                                    text-xl
                                    font-bold
                                    sm:text-2xl
                                    ${
                                        darkMode
                                            ? "text-white"
                                            : "text-slate-900"
                                    }
                                `}
                            >
                                Quiz not found
                            </h1>

                            <p
                                className={`
                                    mt-2
                                    text-sm
                                    ${
                                        darkMode
                                            ? "text-slate-400"
                                            : "text-slate-500"
                                    }
                                `}
                            >
                                The quiz you're looking for
                                could not be found.
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
                                    px-5
                                    py-3
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

    // =========================================================
    // REAL QUIZ VALUES
    // =========================================================

    const difficulty = getValue([
        quiz.difficulty,
        quiz.level,
    ]);

    const passingScore = getValue([
        quiz.passing_percentage,
        quiz.passing_score,
        quiz.passingScore,
        quiz.pass_percentage,
    ]);

    const maximumAttempts = getValue([
        quiz.maximum_attempts,
        quiz.max_attempts,
        quiz.maximumAttempts,
        quiz.maxAttempts,
    ]);

    const totalQuestions =
        questionCount !== null
            ? questionCount
            : getValue([
                  quiz.question_count,
                  quiz.questions_count,
                  quiz.total_questions,
                  quiz.number_of_questions,
              ]);

    const category =
        categoryName ||
        getValue([
            quiz.category_name,
            quiz.category?.name,
            quiz.category,
        ]);

    // =========================================================
    // UI
    // =========================================================

    return (
        <div
            className={`
                min-h-screen
                transition-colors
                duration-300
                ${
                    darkMode
                        ? "bg-[#0a0a0a]"
                        : "bg-slate-50"
                }
            `}
        >

            <Navbar />

            <main className="px-4 pb-10 pt-24 sm:px-6 sm:pt-28">

                <div className="mx-auto max-w-4xl">

                    {/* =================================================
                        BACK
                    ================================================= */}

                    <button
                        onClick={() =>
                            navigate(
                                "/student/quizzes"
                            )
                        }
                        className={`
                            mb-5
                            text-sm
                            font-semibold
                            transition
                            sm:mb-6
                            ${
                                darkMode
                                    ? "text-slate-400 hover:text-white"
                                    : "text-slate-500 hover:text-black"
                            }
                        `}
                    >
                        ← Back to Quizzes
                    </button>

                    {/* =================================================
                        MAIN CARD
                    ================================================= */}

                    <div
                        className={`
                            overflow-hidden
                            rounded-2xl
                            shadow-sm
                            transition-colors
                            ${
                                darkMode
                                    ? "bg-[#141414] ring-1 ring-white/10"
                                    : "bg-white ring-1 ring-slate-200"
                            }
                        `}
                    >

                        {/* =================================================
                            HEADER
                        ================================================= */}

                        <div
                            className="
                                bg-gradient-to-br
                                from-slate-950
                                via-slate-900
                                to-slate-800
                                px-5
                                py-7
                                text-white
                                sm:px-8
                                sm:py-10
                            "
                        >

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

                        {/* =================================================
                            DETAILS
                        ================================================= */}

                        <div className="px-5 py-6 sm:px-8 sm:py-8">

                            <h2
                                className={`
                                    text-lg
                                    font-bold
                                    ${
                                        darkMode
                                            ? "text-white"
                                            : "text-slate-900"
                                    }
                                `}
                            >
                                Quiz Information
                            </h2>

                            <div className="mt-5 grid gap-3 sm:mt-6 sm:grid-cols-2 lg:grid-cols-3">

                                {/* Category */}

                                <div
                                    className={`
                                        rounded-xl
                                        p-4
                                        sm:p-5
                                        ${
                                            darkMode
                                                ? "bg-[#1b1b1b]"
                                                : "bg-slate-50"
                                        }
                                    `}
                                >
                                    <p
                                        className={`
                                            text-sm
                                            ${
                                                darkMode
                                                    ? "text-slate-400"
                                                    : "text-slate-500"
                                            }
                                        `}
                                    >
                                        Category
                                    </p>

                                    <p
                                        className={`
                                            mt-2
                                            truncate
                                            text-lg
                                            font-bold
                                            sm:text-xl
                                            ${
                                                darkMode
                                                    ? "text-white"
                                                    : "text-slate-900"
                                            }
                                        `}
                                    >
                                        {category}
                                    </p>
                                </div>

                                {/* Difficulty */}

                                <div
                                    className={`
                                        rounded-xl
                                        p-4
                                        sm:p-5
                                        ${
                                            darkMode
                                                ? "bg-[#1b1b1b]"
                                                : "bg-slate-50"
                                        }
                                    `}
                                >
                                    <p
                                        className={`
                                            text-sm
                                            ${
                                                darkMode
                                                    ? "text-slate-400"
                                                    : "text-slate-500"
                                            }
                                        `}
                                    >
                                        Difficulty
                                    </p>

                                    <p
                                        className={`
                                            mt-2
                                            text-lg
                                            font-bold
                                            sm:text-xl
                                            ${
                                                darkMode
                                                    ? "text-white"
                                                    : "text-slate-900"
                                            }
                                        `}
                                    >
                                        {difficulty}
                                    </p>
                                </div>

                                {/* Questions */}

                                <div
                                    className={`
                                        rounded-xl
                                        p-4
                                        sm:p-5
                                        ${
                                            darkMode
                                                ? "bg-[#1b1b1b]"
                                                : "bg-slate-50"
                                        }
                                    `}
                                >
                                    <p
                                        className={`
                                            text-sm
                                            ${
                                                darkMode
                                                    ? "text-slate-400"
                                                    : "text-slate-500"
                                            }
                                        `}
                                    >
                                        Questions
                                    </p>

                                    <p
                                        className={`
                                            mt-2
                                            text-lg
                                            font-bold
                                            sm:text-xl
                                            ${
                                                darkMode
                                                    ? "text-white"
                                                    : "text-slate-900"
                                            }
                                        `}
                                    >
                                        {totalQuestions}
                                    </p>
                                </div>

                                {/* Duration */}

                                <div
                                    className={`
                                        rounded-xl
                                        p-4
                                        sm:p-5
                                        ${
                                            darkMode
                                                ? "bg-[#1b1b1b]"
                                                : "bg-slate-50"
                                        }
                                    `}
                                >
                                    <p
                                        className={`
                                            text-sm
                                            ${
                                                darkMode
                                                    ? "text-slate-400"
                                                    : "text-slate-500"
                                            }
                                        `}
                                    >
                                        Duration
                                    </p>

                                    <p
                                        className={`
                                            mt-2
                                            text-lg
                                            font-bold
                                            sm:text-xl
                                            ${
                                                darkMode
                                                    ? "text-white"
                                                    : "text-slate-900"
                                            }
                                        `}
                                    >
                                        {quiz.duration} min
                                    </p>
                                </div>

                                {/* Passing Score */}

                                <div
                                    className={`
                                        rounded-xl
                                        p-4
                                        sm:p-5
                                        ${
                                            darkMode
                                                ? "bg-[#1b1b1b]"
                                                : "bg-slate-50"
                                        }
                                    `}
                                >
                                    <p
                                        className={`
                                            text-sm
                                            ${
                                                darkMode
                                                    ? "text-slate-400"
                                                    : "text-slate-500"
                                            }
                                        `}
                                    >
                                        Passing Score
                                    </p>

                                    <p
                                        className={`
                                            mt-2
                                            text-lg
                                            font-bold
                                            sm:text-xl
                                            ${
                                                darkMode
                                                    ? "text-white"
                                                    : "text-slate-900"
                                            }
                                        `}
                                    >
                                        {passingScore ===
                                        "Not specified"
                                            ? passingScore
                                            : `${passingScore}%`}
                                    </p>
                                </div>

                                {/* Maximum Attempts */}

                                <div
                                    className={`
                                        rounded-xl
                                        p-4
                                        sm:p-5
                                        ${
                                            darkMode
                                                ? "bg-[#1b1b1b]"
                                                : "bg-slate-50"
                                        }
                                    `}
                                >
                                    <p
                                        className={`
                                            text-sm
                                            ${
                                                darkMode
                                                    ? "text-slate-400"
                                                    : "text-slate-500"
                                            }
                                        `}
                                    >
                                        Maximum Attempts
                                    </p>

                                    <p
                                        className={`
                                            mt-2
                                            text-lg
                                            font-bold
                                            sm:text-xl
                                            ${
                                                darkMode
                                                    ? "text-white"
                                                    : "text-slate-900"
                                            }
                                        `}
                                    >
                                        {maximumAttempts}
                                    </p>
                                </div>

                            </div>

                            {/* =================================================
                                QUIZ ID
                            ================================================= */}

                            <div
                                className={`
                                    mt-4
                                    flex
                                    items-center
                                    justify-between
                                    rounded-xl
                                    border
                                    px-4
                                    py-3
                                    ${
                                        darkMode
                                            ? "border-white/10 bg-[#111111]"
                                            : "border-slate-200 bg-white"
                                    }
                                `}
                            >

                                <span
                                    className={`
                                        text-sm
                                        ${
                                            darkMode
                                                ? "text-slate-400"
                                                : "text-slate-500"
                                        }
                                    `}
                                >
                                    Quiz ID
                                </span>

                                <span
                                    className={`
                                        text-sm
                                        font-bold
                                        ${
                                            darkMode
                                                ? "text-white"
                                                : "text-slate-900"
                                        }
                                    `}
                                >
                                    #{quiz.id}
                                </span>

                            </div>

                            {/* =================================================
                                INSTRUCTIONS
                            ================================================= */}

                            <div
                                className={`
                                    mt-6
                                    rounded-xl
                                    border
                                    p-4
                                    sm:mt-8
                                    sm:p-5
                                    ${
                                        darkMode
                                            ? "border-white/10 bg-white/5"
                                            : "border-slate-200 bg-slate-50"
                                    }
                                `}
                            >

                                <h3
                                    className={`
                                        font-bold
                                        ${
                                            darkMode
                                                ? "text-white"
                                                : "text-slate-900"
                                        }
                                    `}
                                >
                                    Before you start
                                </h3>

                                <ul
                                    className={`
                                        mt-3
                                        space-y-2
                                        text-sm
                                        leading-6
                                        ${
                                            darkMode
                                                ? "text-slate-400"
                                                : "text-slate-600"
                                        }
                                    `}
                                >

                                    <li>
                                        • Make sure you have enough time
                                        to complete the quiz.
                                    </li>

                                    <li>
                                        • Once started, the timer will
                                        begin automatically.
                                    </li>

                                    <li>
                                        • Review your answers before
                                        submitting.
                                    </li>

                                    <li>
                                        • Your score will be calculated
                                        automatically after submission.
                                    </li>

                                </ul>

                            </div>

                            {/* =================================================
                                ACTIONS
                            ================================================= */}

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
                                        px-6
                                        py-3.5
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
                                    className={`
                                        w-full
                                        rounded-lg
                                        border
                                        px-6
                                        py-3.5
                                        text-sm
                                        font-semibold
                                        transition
                                        sm:w-auto
                                        ${
                                            darkMode
                                                ? "border-white/10 bg-[#1b1b1b] text-slate-300 hover:bg-[#222] hover:text-white"
                                                : "border-slate-300 bg-white text-slate-700 hover:bg-slate-50 hover:text-black"
                                        }
                                    `}
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