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
    });

    const [editingId, setEditingId] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [deleteId, setDeleteId] = useState(null);
    const [deleting, setDeleting] = useState(false);

    // =========================
    // FETCH QUESTIONS
    // =========================

    const fetchQuestions = async () => {
        try {
            setLoading(true);
            setError("");

            const response = await fetch(API_URL);

            if (!response.ok) {
                throw new Error("Failed to fetch questions");
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
            const response = await fetch(QUIZ_API_URL);

            if (!response.ok) {
                throw new Error("Failed to fetch quizzes");
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
    };

    // =========================
    // CREATE / UPDATE
    // =========================

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            setError("");

            if (!formData.quiz_id) {
                setError("Please select a quiz.");
                return;
            }

            if (!formData.question_text.trim()) {
                setError("Question is required.");
                return;
            }

            if (
                !formData.option_a.trim() ||
                !formData.option_b.trim() ||
                !formData.option_c.trim() ||
                !formData.option_d.trim()
            ) {
                setError("All four options are required.");
                return;
            }

            if (!formData.correct_answer.trim()) {
                setError("Correct answer is required.");
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

            const method = editingId ? "PUT" : "POST";

            const token = sessionStorage.getItem("token");

            if (!token) {
                setError(
                    "Authentication required. Please login again."
                );
                return;
            }

            const response = await fetch(url, {
                method,
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    quiz_id: Number(formData.quiz_id),
                    question_text:
                        formData.question_text.trim(),
                    option_a: formData.option_a.trim(),
                    option_b: formData.option_b.trim(),
                    option_c: formData.option_c.trim(),
                    option_d: formData.option_d.trim(),
                    correct_answer: correctAnswer,
                }),
            });

            const data = await response.json();

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
        });

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

            const token = sessionStorage.getItem("token");

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
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            const data = await response.json();

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
        });

        setError("");
    };

    // =========================
    // GET QUIZ NAME
    // =========================

    const getQuizName = (quizId) => {
        const quiz = quizzes.find(
            (item) => item.id === Number(quizId)
        );

        return quiz?.title || "Unknown Quiz";
    };

    // =========================
    // RENDER
    // =========================

    return (
        <div className="min-h-screen bg-slate-50 px-6 py-10">
            <div className="mx-auto max-w-7xl">

                {/* Header */}
                <div className="mb-8">
                    <p className="text-sm font-semibold text-blue-600">
                        Administration
                    </p>

                    <h1 className="mt-1 text-3xl font-bold text-slate-900">
                        Question Bank
                    </h1>

                    <p className="mt-2 text-slate-500">
                        Create, edit, and manage questions
                        for your quizzes.
                    </p>
                </div>

                {/* Form Card */}
                <div className="mb-8 rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200 sm:p-8">

                    <div className="mb-6 flex items-center gap-4">

                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-xl">
                            {editingId ? "✏️" : "❓"}
                        </div>

                        <div>
                            <h2 className="text-xl font-bold text-slate-900">
                                {editingId
                                    ? "Edit Question"
                                    : "Add New Question"}
                            </h2>

                            <p className="mt-1 text-sm text-slate-500">
                                {editingId
                                    ? "Update the selected question."
                                    : "Add a question to a specific quiz."}
                            </p>
                        </div>

                    </div>

                    <form
                        onSubmit={handleSubmit}
                        className="space-y-6"
                    >

                        {/* Quiz */}
                        <div>
                            <label className="mb-2 block text-sm font-semibold text-slate-700">
                                Quiz
                            </label>

                            <select
                                name="quiz_id"
                                value={formData.quiz_id}
                                onChange={handleChange}
                                required
                                className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                            >
                                <option value="">
                                    Select Quiz
                                </option>

                                {quizzes.map((quiz) => (
                                    <option
                                        key={quiz.id}
                                        value={quiz.id}
                                    >
                                        {quiz.title}
                                    </option>
                                ))}
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
                                onChange={handleChange}
                                required
                                rows={4}
                                className="w-full resize-none rounded-lg border border-slate-300 px-4 py-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                            />
                        </div>

                        {/* Options */}
                        <div>

                            <div className="mb-3 flex items-center justify-between">
                                <label className="text-sm font-semibold text-slate-700">
                                    Answer Options
                                </label>

                                <span className="text-xs text-slate-400">
                                    Four options required
                                </span>
                            </div>

                            <div className="grid gap-4 sm:grid-cols-2">

                                {[
                                    ["option_a", "A"],
                                    ["option_b", "B"],
                                    ["option_c", "C"],
                                    ["option_d", "D"],
                                ].map(
                                    ([field, letter]) => (
                                        <div
                                            key={field}
                                            className="flex items-center gap-3"
                                        >
                                            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-sm font-bold text-slate-600">
                                                {letter}
                                            </span>

                                            <input
                                                type="text"
                                                name={field}
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
                                                className="w-full rounded-lg border border-slate-300 px-4 py-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
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
                                onChange={handleChange}
                                required
                                className="w-full rounded-lg border border-green-200 bg-green-50/30 px-4 py-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-green-500 focus:ring-2 focus:ring-green-100"
                            />
                        </div>

                        {/* Error */}
                        {error && (
                            <div className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">
                                {error}
                            </div>
                        )}

                        {/* Buttons */}
                        <div className="flex flex-wrap gap-3 border-t border-slate-100 pt-5">

                            <button
                                type="submit"
                                className="rounded-lg bg-blue-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
                            >
                                {editingId
                                    ? "Update Question"
                                    : "Add Question"}
                            </button>

                            {editingId && (
                                <button
                                    type="button"
                                    onClick={resetForm}
                                    className="rounded-lg border border-slate-300 bg-white px-6 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                                >
                                    Cancel
                                </button>
                            )}

                        </div>
                    </form>
                </div>

                {/* Questions Header */}
                <div className="mb-4 flex items-end justify-between">

                    <div>
                        <h2 className="text-2xl font-bold text-slate-900">
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

                </div>

                {/* Loading */}
                {loading ? (
                    <div className="grid gap-4 lg:grid-cols-2">
                        {[1, 2, 3, 4].map((item) => (
                            <div
                                key={item}
                                className="h-52 animate-pulse rounded-2xl bg-white shadow-sm ring-1 ring-slate-200"
                            />
                        ))}
                    </div>
                ) : questions.length === 0 ? (
                    <div className="rounded-2xl bg-white px-6 py-14 text-center shadow-sm ring-1 ring-slate-200">

                        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-slate-100 text-2xl">
                            ❓
                        </div>

                        <h3 className="mt-4 text-lg font-bold text-slate-900">
                            No questions yet
                        </h3>

                        <p className="mt-2 text-sm text-slate-500">
                            Add your first question using
                            the form above.
                        </p>

                    </div>
                ) : (
                    <div className="grid gap-5 lg:grid-cols-2">

                        {questions.map(
                            (question, index) => (
                                <div
                                    key={question.id}
                                    className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200 transition hover:-translate-y-0.5 hover:shadow-md"
                                >

                                    {/* Card Header */}
                                    <div className="flex items-start justify-between gap-4">

                                        <div className="flex flex-wrap items-center gap-3">

                                            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-sm font-bold text-blue-600">
                                                {index + 1}
                                            </span>

                                            <span className="rounded-full bg-purple-50 px-3 py-1 text-xs font-semibold text-purple-600">
                                                {question.category_name ||
                                                    "Category"}
                                            </span>

                                        </div>

                                        <span className="text-xs font-medium text-slate-400">
                                            #{question.id}
                                        </span>

                                    </div>

                                    {/* Quiz Name */}
                                    <div className="mt-4 rounded-lg bg-blue-50 px-3 py-2">
                                        <p className="text-xs font-semibold uppercase tracking-wide text-blue-500">
                                            Quiz
                                        </p>

                                        <p className="mt-1 text-sm font-semibold text-blue-700">
                                            {question.quiz_title ||
                                                getQuizName(
                                                    question.quiz_id
                                                )}
                                        </p>
                                    </div>

                                    {/* Question */}
                                    <h3 className="mt-5 text-base font-bold leading-6 text-slate-900">
                                        {question.question_text}
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
                                            ([letter, option]) => (
                                                <div
                                                    key={letter}
                                                    className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm ${
                                                        option ===
                                                        question.correct_answer
                                                            ? "bg-green-50 text-green-700 ring-1 ring-green-100"
                                                            : "bg-slate-50 text-slate-600"
                                                    }`}
                                                >
                                                    <span className="font-bold">
                                                        {letter}.
                                                    </span>

                                                    <span className="flex-1">
                                                        {option}
                                                    </span>

                                                    {option ===
                                                        question.correct_answer && (
                                                        <span className="text-xs font-bold">
                                                            ✓
                                                        </span>
                                                    )}
                                                </div>
                                            )
                                        )}

                                    </div>

                                    {/* Actions */}
                                    <div className="mt-5 flex gap-2 border-t border-slate-100 pt-4">

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

            {/* Delete Modal */}
            {showDeleteModal && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 px-5">

                    <div className="w-full max-w-md rounded-2xl bg-white p-7 shadow-2xl">

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

                        <div className="mt-7 flex justify-end gap-3">

                            <button
                                type="button"
                                onClick={closeDeleteModal}
                                disabled={deleting}
                                className="rounded-lg border border-slate-300 px-5 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-50"
                            >
                                Cancel
                            </button>

                            <button
                                type="button"
                                onClick={handleDelete}
                                disabled={deleting}
                                className="rounded-lg bg-red-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
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