import { useEffect, useState } from "react";

const API_URL = "http://localhost:5000/api/quizzes";
const CATEGORY_API_URL = "http://localhost:5000/api/categories";

function Quizzes() {
    const [quizzes, setQuizzes] = useState([]);
    const [categories, setCategories] = useState([]);

    const [formData, setFormData] = useState({
        title: "",
        description: "",
        category_id: "",
        duration: "",
    });

    const [editingId, setEditingId] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const [showDeleteModal, setShowDeleteModal] =
        useState(false);

    const [deleteId, setDeleteId] = useState(null);
    const [deleting, setDeleting] = useState(false);

    // =========================
    // FETCH QUIZZES
    // =========================

    const fetchQuizzes = async () => {
        try {
            setLoading(true);
            setError("");

            const response = await fetch(API_URL);

            if (!response.ok) {
                throw new Error(
                    "Failed to fetch quizzes"
                );
            }

            const data = await response.json();

            setQuizzes(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    // =========================
    // FETCH CATEGORIES
    // =========================

    const fetchCategories = async () => {
        try {
            const response = await fetch(
                CATEGORY_API_URL
            );

            if (!response.ok) {
                throw new Error(
                    "Failed to fetch categories"
                );
            }

            const data = await response.json();

            setCategories(data);
        } catch (err) {
            setError(err.message);
        }
    };

    // =========================
    // INITIAL LOAD
    // =========================

    useEffect(() => {
        fetchQuizzes();
        fetchCategories();
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

            if (!formData.title.trim()) {
                setError("Quiz title is required.");
                return;
            }

            if (!formData.category_id) {
                setError("Please select a category.");
                return;
            }

            if (!formData.duration) {
                setError("Quiz duration is required.");
                return;
            }

            const url = editingId
                ? `${API_URL}/${editingId}`
                : API_URL;

            const method = editingId ? "PUT" : "POST";

            const response = await fetch(url, {
                method,
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    title: formData.title.trim(),
                    description:
                        formData.description.trim(),
                    category_id: Number(
                        formData.category_id
                    ),
                    duration: Number(
                        formData.duration
                    ),
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message ||
                        "Failed to save quiz"
                );
            }

            resetForm();
            fetchQuizzes();
        } catch (err) {
            setError(err.message);
        }
    };

    // =========================
    // EDIT
    // =========================

    const handleEdit = (quiz) => {
        setEditingId(quiz.id);

        setFormData({
            title: quiz.title || "",
            description: quiz.description || "",
            category_id:
                quiz.category_id?.toString() || "",
            duration:
                quiz.duration?.toString() || "",
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

            const response = await fetch(
                `${API_URL}/${deleteId}`,
                {
                    method: "DELETE",
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message ||
                        "Failed to delete quiz"
                );
            }

            setDeleteId(null);
            setShowDeleteModal(false);

            fetchQuizzes();
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
            title: "",
            description: "",
            category_id: "",
            duration: "",
        });

        setError("");
    };

    // =========================
    // CATEGORY NAME
    // =========================

    const getCategoryName = (categoryId) => {
        const category = categories.find(
            (item) => item.id === categoryId
        );

        return category?.name || "Unknown";
    };

    // =========================
    // UI
    // =========================

    return (
        <div className="min-h-screen bg-slate-50 px-6 py-10">
            <div className="mx-auto max-w-7xl">

                {/* HEADER */}
                <div className="mb-8">
                    <p className="text-sm font-semibold text-blue-600">
                        Administration
                    </p>

                    <h1 className="mt-1 text-3xl font-bold text-slate-900">
                        Quiz Management
                    </h1>

                    <p className="mt-2 text-slate-500">
                        Create, edit, and manage quizzes
                        on the platform.
                    </p>
                </div>

                {/* FORM CARD */}
                <div className="mb-8 rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200 sm:p-8">

                    <div className="mb-6 flex items-center gap-4">

                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-xl">
                            {editingId ? "✏️" : "📝"}
                        </div>

                        <div>
                            <h2 className="text-xl font-bold text-slate-900">
                                {editingId
                                    ? "Edit Quiz"
                                    : "Create New Quiz"}
                            </h2>

                            <p className="mt-1 text-sm text-slate-500">
                                {editingId
                                    ? "Update the selected quiz."
                                    : "Create a quiz for students to attempt."}
                            </p>
                        </div>

                    </div>

                    <form
                        onSubmit={handleSubmit}
                        className="space-y-6"
                    >

                        {/* TITLE */}
                        <div>
                            <label className="mb-2 block text-sm font-semibold text-slate-700">
                                Quiz Title
                            </label>

                            <input
                                type="text"
                                name="title"
                                value={formData.title}
                                onChange={handleChange}
                                placeholder="Enter quiz title"
                                required
                                className="w-full rounded-lg border border-slate-300 px-4 py-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                            />
                        </div>

                        {/* DESCRIPTION */}
                        <div>
                            <label className="mb-2 block text-sm font-semibold text-slate-700">
                                Description
                            </label>

                            <textarea
                                name="description"
                                value={
                                    formData.description
                                }
                                onChange={handleChange}
                                placeholder="Describe the quiz..."
                                rows={4}
                                className="w-full resize-none rounded-lg border border-slate-300 px-4 py-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                            />
                        </div>

                        {/* CATEGORY + DURATION */}
                        <div className="grid gap-5 sm:grid-cols-2">

                            {/* CATEGORY */}
                            <div>
                                <label className="mb-2 block text-sm font-semibold text-slate-700">
                                    Category
                                </label>

                                <select
                                    name="category_id"
                                    value={
                                        formData.category_id
                                    }
                                    onChange={handleChange}
                                    required
                                    className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                                >
                                    <option value="">
                                        Select Category
                                    </option>

                                    {categories.map(
                                        (category) => (
                                            <option
                                                key={
                                                    category.id
                                                }
                                                value={
                                                    category.id
                                                }
                                            >
                                                {
                                                    category.name
                                                }
                                            </option>
                                        )
                                    )}
                                </select>
                            </div>

                            {/* DURATION */}
                            <div>
                                <label className="mb-2 block text-sm font-semibold text-slate-700">
                                    Duration
                                </label>

                                <div className="relative">
                                    <input
                                        type="number"
                                        name="duration"
                                        value={
                                            formData.duration
                                        }
                                        onChange={
                                            handleChange
                                        }
                                        placeholder="30"
                                        min="1"
                                        required
                                        className="w-full rounded-lg border border-slate-300 px-4 py-3 pr-16 text-sm outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                                    />

                                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-medium text-slate-400">
                                        minutes
                                    </span>
                                </div>
                            </div>

                        </div>

                        {/* ERROR */}
                        {error && (
                            <div className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">
                                {error}
                            </div>
                        )}

                        {/* BUTTONS */}
                        <div className="flex flex-wrap gap-3 border-t border-slate-100 pt-5">

                            <button
                                type="submit"
                                className="rounded-lg bg-blue-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
                            >
                                {editingId
                                    ? "Update Quiz"
                                    : "Create Quiz"}
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

                {/* QUIZZES HEADER */}
                <div className="mb-4">
                    <h2 className="text-2xl font-bold text-slate-900">
                        All Quizzes
                    </h2>

                    <p className="mt-1 text-sm text-slate-500">
                        {quizzes.length}{" "}
                        {quizzes.length === 1
                            ? "quiz"
                            : "quizzes"}{" "}
                        available
                    </p>
                </div>

                {/* LOADING */}
                {loading ? (
                    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">

                        {[1, 2, 3, 4, 5, 6].map(
                            (item) => (
                                <div
                                    key={item}
                                    className="h-64 animate-pulse rounded-2xl bg-white shadow-sm ring-1 ring-slate-200"
                                />
                            )
                        )}

                    </div>
                ) : quizzes.length === 0 ? (
                    /* EMPTY */
                    <div className="rounded-2xl bg-white px-6 py-14 text-center shadow-sm ring-1 ring-slate-200">

                        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-slate-100 text-2xl">
                            📝
                        </div>

                        <h3 className="mt-4 text-lg font-bold text-slate-900">
                            No quizzes yet
                        </h3>

                        <p className="mt-2 text-sm text-slate-500">
                            Create your first quiz using
                            the form above.
                        </p>

                    </div>
                ) : (
                    /* QUIZ CARDS */
                    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">

                        {quizzes.map(
                            (quiz, index) => (
                                <div
                                    key={quiz.id}
                                    className="group rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200 transition hover:-translate-y-1 hover:shadow-md"
                                >

                                    {/* TOP */}
                                    <div className="flex items-start justify-between gap-4">

                                        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-lg font-bold text-blue-600">
                                            {index + 1}
                                        </div>

                                        <span className="rounded-full bg-purple-50 px-3 py-1 text-xs font-semibold text-purple-600">
                                            {getCategoryName(
                                                quiz.category_id
                                            )}
                                        </span>

                                    </div>

                                    {/* TITLE */}
                                    <h3 className="mt-5 text-lg font-bold leading-6 text-slate-900">
                                        {quiz.title}
                                    </h3>

                                    {/* DESCRIPTION */}
                                    <p className="mt-2 min-h-[48px] text-sm leading-6 text-slate-500">
                                        {quiz.description ||
                                            "No description provided."}
                                    </p>

                                    {/* INFO */}
                                    <div className="mt-5 grid grid-cols-2 gap-3">

                                        <div className="rounded-xl bg-slate-50 p-3">
                                            <p className="text-xs text-slate-400">
                                                Duration
                                            </p>

                                            <p className="mt-1 text-sm font-bold text-slate-800">
                                                {quiz.duration}{" "}
                                                min
                                            </p>
                                        </div>

                                        <div className="rounded-xl bg-slate-50 p-3">
                                            <p className="text-xs text-slate-400">
                                                Quiz ID
                                            </p>

                                            <p className="mt-1 text-sm font-bold text-slate-800">
                                                #{quiz.id}
                                            </p>
                                        </div>

                                    </div>

                                    {/* ACTIONS */}
                                    <div className="mt-5 flex gap-2 border-t border-slate-100 pt-4">

                                        <button
                                            type="button"
                                            onClick={() =>
                                                handleEdit(
                                                    quiz
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
                                                    quiz.id
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

            {/* DELETE MODAL */}
            {showDeleteModal && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 px-5">

                    <div className="w-full max-w-md rounded-2xl bg-white p-7 shadow-2xl">

                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-100 text-xl">
                            ⚠️
                        </div>

                        <h2 className="mt-5 text-xl font-bold text-slate-900">
                            Delete Quiz?
                        </h2>

                        <p className="mt-2 text-sm leading-6 text-slate-500">
                            Are you sure you want to delete
                            this quiz? This action cannot be
                            undone.
                        </p>

                        <div className="mt-7 flex justify-end gap-3">

                            <button
                                type="button"
                                onClick={closeDeleteModal}
                                disabled={deleting}
                                className="rounded-lg border border-slate-300 px-5 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:opacity-50"
                            >
                                Cancel
                            </button>

                            <button
                                type="button"
                                onClick={handleDelete}
                                disabled={deleting}
                                className="rounded-lg bg-red-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
                            >
                                {deleting
                                    ? "Deleting..."
                                    : "Delete Quiz"}
                            </button>

                        </div>

                    </div>
                </div>
            )}
        </div>
    );
}

export default Quizzes;