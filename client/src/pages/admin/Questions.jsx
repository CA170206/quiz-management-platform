import { useEffect, useState } from "react";

const API_URL = `${import.meta.env.VITE_API_URL}/api/questions`;
const QUIZ_API_URL = `${import.meta.env.VITE_API_URL}/api/quizzes`;

function Questions() {
    const [questions, setQuestions] = useState([]);
    const [quizzes, setQuizzes] = useState([]);

    const [formData, setFormData] = useState({
        quiz_id: "",
        question_text: "",
        option_a: "",
        option_b: "",
        option_c: "",
        option_d: "",
        correct_answer: "",
        explanation: "",
        difficulty: "",
    });

    const [editingId, setEditingId] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const [showDeleteModal, setShowDeleteModal] =
        useState(false);

    const [deleteId, setDeleteId] =
        useState(null);

    const [deleting, setDeleting] =
        useState(false);

    // =========================
    // FETCH QUESTIONS
    // =========================

    const fetchQuestions = async () => {
        try {
            setLoading(true);
            setError("");

            const response = await fetch(API_URL);

            if (!response.ok) {
                throw new Error(
                    "Failed to fetch questions"
                );
            }

            const data = await response.json();

            const sortedQuestions = [...data].sort(
                (a, b) => a.id - b.id
            );

            setQuestions(sortedQuestions);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    // =========================
    // FETCH QUIZZES
    // =========================

    const fetchQuizzes = async () => {
        try {
            const response =
                await fetch(QUIZ_API_URL);

            if (!response.ok) {
                throw new Error(
                    "Failed to fetch quizzes"
                );
            }

            const data = await response.json();

            const sortedQuizzes = [...data].sort(
                (a, b) => a.id - b.id
            );

            setQuizzes(sortedQuizzes);
        } catch (err) {
            setError(err.message);
        }
    };

    // =========================
    // INITIAL LOAD
    // =========================

    useEffect(() => {
        fetchQuestions();
        fetchQuizzes();
    }, []);

    // =========================
    // HANDLE INPUT
    // =========================

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });

        setError("");
    };

    // =========================
    // CREATE / UPDATE
    // =========================

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            setError("");

            if (!formData.quiz_id) {
                setError(
                    "Please select a quiz."
                );
                return;
            }

            if (!formData.question_text.trim()) {
                setError(
                    "Question is required."
                );
                return;
            }

            if (
                !formData.option_a.trim() ||
                !formData.option_b.trim() ||
                !formData.option_c.trim() ||
                !formData.option_d.trim()
            ) {
                setError(
                    "All four options are required."
                );
                return;
            }

            if (!formData.correct_answer.trim()) {
                setError(
                    "Correct answer is required."
                );
                return;
            }

            if (!formData.difficulty) {
                setError(
                    "Please select a difficulty level."
                );
                return;
            }

            const options = [
                formData.option_a.trim(),
                formData.option_b.trim(),
                formData.option_c.trim(),
                formData.option_d.trim(),
            ];

            const correctAnswer =
                formData.correct_answer.trim();

            if (!options.includes(correctAnswer)) {
                setError(
                    "Correct answer must exactly match one of the four options."
                );
                return;
            }

            const url = editingId
                ? `${API_URL}/${editingId}`
                : API_URL;

            const method = editingId
                ? "PUT"
                : "POST";

            const token =
                localStorage.getItem("token") ||
                sessionStorage.getItem("token");

            if (!token) {
                setError(
                    "Authentication required. Please login again."
                );
                return;
            }

            const response = await fetch(url, {
                method,

                headers: {
                    "Content-Type":
                        "application/json",

                    Authorization:
                        `Bearer ${token}`,
                },

                body: JSON.stringify({
                    quiz_id:
                        Number(
                            formData.quiz_id
                        ),

                    question_text:
                        formData.question_text.trim(),

                    option_a:
                        formData.option_a.trim(),

                    option_b:
                        formData.option_b.trim(),

                    option_c:
                        formData.option_c.trim(),

                    option_d:
                        formData.option_d.trim(),

                    correct_answer:
                        correctAnswer,

                    explanation:
                        formData.explanation.trim(),

                    difficulty:
                        formData.difficulty,
                }),
            });

            const data =
                await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message ||
                        "Something went wrong"
                );
            }

            resetForm();

            await fetchQuestions();

        } catch (err) {
            setError(err.message);
        }
    };

    // =========================
    // EDIT
    // =========================

    const handleEdit = (question) => {
        setEditingId(question.id);

        setFormData({
            quiz_id:
                question.quiz_id?.toString() || "",

            question_text:
                question.question_text || "",

            option_a:
                question.option_a || "",

            option_b:
                question.option_b || "",

            option_c:
                question.option_c || "",

            option_d:
                question.option_d || "",

            correct_answer:
                question.correct_answer || "",

            explanation:
                question.explanation || "",

            difficulty:
                question.difficulty || "",
        });

        setError("");

        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });
    };

    // =========================
    // DELETE MODAL
    // =========================

    const openDeleteModal = (id) => {
        setDeleteId(id);
        setShowDeleteModal(true);
    };

    const closeDeleteModal = () => {
        if (deleting) {
            return;
        }

        setDeleteId(null);
        setShowDeleteModal(false);
    };

    // =========================
    // DELETE
    // =========================

    const handleDelete = async () => {
        if (!deleteId) {
            return;
        }

        try {
            setDeleting(true);
            setError("");

            const token =
                localStorage.getItem("token") ||
                sessionStorage.getItem("token");

            if (!token) {
                setError(
                    "Authentication required. Please login again."
                );
                return;
            }

            const response = await fetch(
                `${API_URL}/${deleteId}`,
                {
                    method: "DELETE",

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
                        "Failed to delete question"
                );
            }

            setDeleteId(null);
            setShowDeleteModal(false);

            await fetchQuestions();

        } catch (err) {
            setError(err.message);
        } finally {
            setDeleting(false);
        }
    };

    // =========================
    // RESET FORM
    // =========================

    const resetForm = () => {
        setEditingId(null);

        setFormData({
            quiz_id: "",
            question_text: "",
            option_a: "",
            option_b: "",
            option_c: "",
            option_d: "",
            correct_answer: "",
            explanation: "",
            difficulty: "",
        });

        setError("");
    };

    // =========================
    // GET QUIZ NAME
    // =========================

    const getQuizName = (quizId) => {
        const quiz = quizzes.find(
            (item) =>
                item.id === Number(quizId)
        );

        return (
            quiz?.title ||
            "Unknown Quiz"
        );
    };

    // =========================
    // DIFFICULTY DISPLAY
    // =========================

    const getDifficultyClasses = (
        difficulty
    ) => {
        if (difficulty === "beginner") {
            return "bg-green-50 text-green-700";
        }

        if (difficulty === "medium") {
            return "bg-yellow-50 text-yellow-700";
        }

        if (difficulty === "intermediate") {
            return "bg-red-50 text-red-700";
        }

        return "bg-slate-100 text-slate-600";
    };

    const getDifficultyLabel = (
        difficulty
    ) => {
        if (difficulty === "beginner") {
            return "Beginner";
        }

        if (difficulty === "medium") {
            return "Medium";
        }

        if (difficulty === "intermediate") {
            return "Intermediate";
        }

        return "Not set";
    };

    // =========================
    // RENDER
    // =========================

    return (
        <div className="min-h-screen bg-slate-50 px-4 py-6 sm:px-6 sm:py-10">

            <div className="mx-auto max-w-7xl">

                {/* ========================= */}
                {/* HEADER */}
                {/* ========================= */}

                <div className="mb-6 sm:mb-8">

                    <p className="text-sm font-semibold text-blue-600">
                        Administration
                    </p>

                    <h1 className="mt-1 text-2xl font-bold text-slate-900 sm:text-3xl">
                        Question Bank
                    </h1>

                    <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500 sm:text-base">
                        Create, edit, and manage questions
                        for your quizzes.
                    </p>

                </div>


                {/* ========================= */}
                {/* FORM CARD */}
                {/* ========================= */}

                <div className="mb-6 rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200 sm:mb-8 sm:p-8">

                    <div className="mb-5 flex items-start gap-3 sm:mb-6 sm:gap-4">

                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-xl sm:h-12 sm:w-12">
                            {editingId
                                ? "✏️"
                                : "❓"}
                        </div>

                        <div className="min-w-0">

                            <h2 className="text-lg font-bold text-slate-900 sm:text-xl">
                                {editingId
                                    ? "Edit Question"
                                    : "Add New Question"}
                            </h2>

                            <p className="mt-1 text-sm leading-5 text-slate-500">
                                {editingId
                                    ? "Update the selected question."
                                    : "Add a question to a specific quiz."}
                            </p>

                        </div>

                    </div>


                    <form
                        onSubmit={handleSubmit}
                        className="space-y-5 sm:space-y-6"
                    >

                        {/* Quiz */}

                        <div>

                            <label className="mb-2 block text-sm font-semibold text-slate-700">
                                Quiz
                            </label>

                            <select
                                name="quiz_id"
                                value={
                                    formData.quiz_id
                                }
                                onChange={
                                    handleChange
                                }
                                required
                                className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                            >

                                <option value="">
                                    Select Quiz
                                </option>

                                {quizzes.map(
                                    (quiz) => (
                                        <option
                                            key={
                                                quiz.id
                                            }
                                            value={
                                                quiz.id
                                            }
                                        >
                                            {
                                                quiz.title
                                            }
                                        </option>
                                    )
                                )}

                            </select>

                        </div>


                        {/* Question */}

                        <div>

                            <label className="mb-2 block text-sm font-semibold text-slate-700">
                                Question
                            </label>

                            <textarea
                                name="question_text"
                                placeholder="Enter your question..."
                                value={
                                    formData.question_text
                                }
                                onChange={
                                    handleChange
                                }
                                required
                                rows={4}
                                className="w-full resize-y rounded-lg border border-slate-300 px-4 py-3 text-sm leading-6 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                            />

                        </div>


                        {/* Options */}

                        <div>

                            <div className="mb-3 flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">

                                <label className="text-sm font-semibold text-slate-700">
                                    Answer Options
                                </label>

                                <span className="text-xs text-slate-400">
                                    Four options required
                                </span>

                            </div>


                            <div className="grid gap-3 sm:grid-cols-2 sm:gap-4">

                                {[
                                    [
                                        "option_a",
                                        "A",
                                    ],
                                    [
                                        "option_b",
                                        "B",
                                    ],
                                    [
                                        "option_c",
                                        "C",
                                    ],
                                    [
                                        "option_d",
                                        "D",
                                    ],
                                ].map(
                                    ([
                                        field,
                                        letter,
                                    ]) => (

                                        <div
                                            key={
                                                field
                                            }
                                            className="flex min-w-0 items-center gap-3"
                                        >

                                            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-sm font-bold text-slate-600">
                                                {
                                                    letter
                                                }
                                            </span>

                                            <input
                                                type="text"
                                                name={
                                                    field
                                                }
                                                placeholder={`Option ${letter}`}
                                                value={
                                                    formData[
                                                        field
                                                    ]
                                                }
                                                onChange={
                                                    handleChange
                                                }
                                                required
                                                className="min-w-0 w-full rounded-lg border border-slate-300 px-4 py-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                                            />

                                        </div>

                                    )
                                )}

                            </div>

                        </div>


                        {/* Correct Answer */}

                        <div>

                            <label className="mb-2 block text-sm font-semibold text-slate-700">
                                Correct Answer
                            </label>

                            <input
                                type="text"
                                name="correct_answer"
                                placeholder="Enter the correct answer exactly as it appears above"
                                value={
                                    formData.correct_answer
                                }
                                onChange={
                                    handleChange
                                }
                                required
                                className="w-full min-w-0 rounded-lg border border-green-200 bg-green-50/30 px-4 py-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-green-500 focus:ring-2 focus:ring-green-100"
                            />

                        </div>


                        {/* Explanation */}

                        <div>

                            <label className="mb-2 block text-sm font-semibold text-slate-700">
                                Explanation
                            </label>

                            <textarea
                                name="explanation"
                                placeholder="Explain why this is the correct answer..."
                                value={
                                    formData.explanation
                                }
                                onChange={
                                    handleChange
                                }
                                rows={3}
                                className="w-full resize-y rounded-lg border border-slate-300 px-4 py-3 text-sm leading-6 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                            />

                        </div>


                        {/* Difficulty */}

                        <div>

                            <label className="mb-2 block text-sm font-semibold text-slate-700">
                                Difficulty
                            </label>

                            <select
                                name="difficulty"
                                value={
                                    formData.difficulty
                                }
                                onChange={
                                    handleChange
                                }
                                required
                                className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                            >

                                <option value="">
                                    Select Difficulty
                                </option>

                                <option value="beginner">
                                    Beginner
                                </option>

                                <option value="medium">
                                    Medium
                                </option>

                                <option value="intermediate">
                                    Intermediate
                                </option>

                            </select>

                        </div>


                        {/* Error */}

                        {error && (
                            <div className="break-words rounded-lg bg-red-50 px-4 py-3 text-sm leading-5 text-red-600">
                                {error}
                            </div>
                        )}


                        {/* Buttons */}

                        <div className="flex flex-col gap-3 border-t border-slate-100 pt-5 sm:flex-row">

                            <button
                                type="submit"
                                className="w-full rounded-lg bg-blue-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 sm:w-auto"
                            >
                                {editingId
                                    ? "Update Question"
                                    : "Add Question"}
                            </button>

                            {editingId && (
                                <button
                                    type="button"
                                    onClick={
                                        resetForm
                                    }
                                    className="w-full rounded-lg border border-slate-300 bg-white px-6 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 sm:w-auto"
                                >
                                    Cancel
                                </button>
                            )}

                        </div>

                    </form>

                </div>


                {/* ========================= */}
                {/* QUESTIONS HEADER */}
                {/* ========================= */}

                <div className="mb-4">

                    <h2 className="text-xl font-bold text-slate-900 sm:text-2xl">
                        All Questions
                    </h2>

                    <p className="mt-1 text-sm text-slate-500">
                        {questions.length}{" "}
                        {questions.length === 1
                            ? "question"
                            : "questions"}{" "}
                        available
                    </p>

                </div>


                {/* ========================= */}
                {/* LOADING */}
                {/* ========================= */}

                {loading ? (

                    <div className="grid gap-4 lg:grid-cols-2">

                        {[1, 2, 3, 4].map(
                            (item) => (
                                <div
                                    key={item}
                                    className="h-52 animate-pulse rounded-2xl bg-white shadow-sm ring-1 ring-slate-200"
                                />
                            )
                        )}

                    </div>

                ) : questions.length === 0 ? (

                    <div className="rounded-2xl bg-white px-5 py-12 text-center shadow-sm ring-1 ring-slate-200 sm:px-6 sm:py-14">

                        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-slate-100 text-2xl">
                            ❓
                        </div>

                        <h3 className="mt-4 text-lg font-bold text-slate-900">
                            No questions yet
                        </h3>

                        <p className="mt-2 text-sm leading-6 text-slate-500">
                            Add your first question using
                            the form above.
                        </p>

                    </div>

                ) : (

                    <div className="grid gap-4 sm:gap-5 lg:grid-cols-2">

                        {questions.map(
                            (
                                question,
                                index
                            ) => (

                                <div
                                    key={
                                        question.id
                                    }
                                    className="min-w-0 overflow-hidden rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200 transition hover:-translate-y-0.5 hover:shadow-md sm:p-6"
                                >

                                    {/* Card Header */}

                                    <div className="flex items-start justify-between gap-3">

                                        <div className="flex min-w-0 flex-wrap items-center gap-2 sm:gap-3">

                                            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-sm font-bold text-blue-600 sm:h-10 sm:w-10">
                                                {index +
                                                    1}
                                            </span>

                                            <span className="max-w-[180px] truncate rounded-full bg-purple-50 px-3 py-1 text-xs font-semibold text-purple-600">
                                                {question.category_name ||
                                                    "Category"}
                                            </span>

                                            <span
                                                className={`rounded-full px-3 py-1 text-xs font-semibold ${getDifficultyClasses(
                                                    question.difficulty
                                                )}`}
                                            >
                                                {getDifficultyLabel(
                                                    question.difficulty
                                                )}
                                            </span>

                                        </div>

                                        <span className="shrink-0 text-xs font-medium text-slate-400">
                                            #
                                            {
                                                question.id
                                            }
                                        </span>

                                    </div>


                                    {/* Quiz Name */}

                                    <div className="mt-4 min-w-0 rounded-lg bg-blue-50 px-3 py-2">

                                        <p className="text-xs font-semibold uppercase tracking-wide text-blue-500">
                                            Quiz
                                        </p>

                                        <p className="mt-1 break-words text-sm font-semibold leading-5 text-blue-700">
                                            {question.quiz_title ||
                                                getQuizName(
                                                    question.quiz_id
                                                )}
                                        </p>

                                    </div>


                                    {/* Question */}

                                    <h3 className="mt-5 break-words text-base font-bold leading-6 text-slate-900">
                                        {
                                            question.question_text
                                        }
                                    </h3>


                                    {/* Options */}

                                    <div className="mt-5 grid gap-2">

                                        {[
                                            [
                                                "A",
                                                question.option_a,
                                            ],
                                            [
                                                "B",
                                                question.option_b,
                                            ],
                                            [
                                                "C",
                                                question.option_c,
                                            ],
                                            [
                                                "D",
                                                question.option_d,
                                            ],
                                        ].map(
                                            ([
                                                letter,
                                                option,
                                            ]) => (

                                                <div
                                                    key={
                                                        letter
                                                    }
                                                    className={`flex min-w-0 items-start gap-3 rounded-lg px-3 py-2.5 text-sm ${
                                                        option ===
                                                        question.correct_answer
                                                            ? "bg-green-50 text-green-700 ring-1 ring-green-100"
                                                            : "bg-slate-50 text-slate-600"
                                                    }`}
                                                >

                                                    <span className="shrink-0 font-bold">
                                                        {
                                                            letter
                                                        }.
                                                    </span>

                                                    <span className="min-w-0 flex-1 break-words leading-5">
                                                        {
                                                            option
                                                        }
                                                    </span>

                                                    {option ===
                                                        question.correct_answer && (
                                                        <span className="shrink-0 text-xs font-bold">
                                                            ✓
                                                        </span>
                                                    )}

                                                </div>

                                            )
                                        )}

                                    </div>


                                    {/* Explanation */}

                                    {question.explanation && (
                                        <div className="mt-4 rounded-lg bg-slate-50 px-3 py-3">

                                            <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                                                Explanation
                                            </p>

                                            <p className="mt-1 break-words text-sm leading-5 text-slate-600">
                                                {
                                                    question.explanation
                                                }
                                            </p>

                                        </div>
                                    )}


                                    {/* Actions */}

                                    <div className="mt-5 flex flex-col gap-2 border-t border-slate-100 pt-4 min-[400px]:flex-row">

                                        <button
                                            type="button"
                                            onClick={() =>
                                                handleEdit(
                                                    question
                                                )
                                            }
                                            className="flex-1 rounded-lg bg-blue-50 px-4 py-2.5 text-sm font-semibold text-blue-600 transition hover:bg-blue-100"
                                        >
                                            Edit
                                        </button>

                                        <button
                                            type="button"
                                            onClick={() =>
                                                openDeleteModal(
                                                    question.id
                                                )
                                            }
                                            className="flex-1 rounded-lg bg-red-50 px-4 py-2.5 text-sm font-semibold text-red-600 transition hover:bg-red-100"
                                        >
                                            Delete
                                        </button>

                                    </div>

                                </div>

                            )
                        )}

                    </div>

                )}

            </div>


            {/* ========================= */}
            {/* DELETE MODAL */}
            {/* ========================= */}

            {showDeleteModal && (

                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 px-4">

                    <div className="w-full max-w-md rounded-2xl bg-white p-5 shadow-2xl sm:p-7">

                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-100 text-xl">
                            ⚠️
                        </div>

                        <h2 className="mt-5 text-xl font-bold text-slate-900">
                            Delete Question?
                        </h2>

                        <p className="mt-2 text-sm leading-6 text-slate-500">
                            Are you sure you want to delete
                            this question? This action cannot
                            be undone.
                        </p>

                        <div className="mt-6 flex flex-col-reverse gap-3 sm:mt-7 sm:flex-row sm:justify-end">

                            <button
                                type="button"
                                onClick={
                                    closeDeleteModal
                                }
                                disabled={deleting}
                                className="w-full rounded-lg border border-slate-300 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:opacity-50 sm:w-auto sm:py-2.5"
                            >
                                Cancel
                            </button>

                            <button
                                type="button"
                                onClick={
                                    handleDelete
                                }
                                disabled={deleting}
                                className="w-full rounded-lg bg-red-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto sm:py-2.5"
                            >
                                {deleting
                                    ? "Deleting..."
                                    : "Delete Question"}
                            </button>

                        </div>

                    </div>

                </div>

            )}

        </div>
    );
}

export default Questions;