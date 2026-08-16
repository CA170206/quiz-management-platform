import Navbar from "../../components/common/Navbar.jsx";

import { useEffect, useState } from "react";

const API_URL = `${import.meta.env.VITE_API_URL}/api/quizzes`;
const ADMIN_API_URL = `${import.meta.env.VITE_API_URL}/api/quizzes/admin`;
const CATEGORY_API_URL = `${import.meta.env.VITE_API_URL}/api/categories`;

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

    const [publishingId, setPublishingId] = useState(null);

    // =========================
    // GET TOKEN
    // =========================

    const getToken = () => {
        return (
            localStorage.getItem("token") ||
            sessionStorage.getItem("token")
        );
    };

    // =========================
    // FETCH ALL QUIZZES
    // ADMIN ONLY
    // =========================

    const fetchQuizzes = async () => {
        try {
            setLoading(true);
            setError("");

            const token = getToken();

            if (!token) {
                throw new Error(
                    "Authentication required. Please login again."
                );
            }

            const response = await fetch(
                ADMIN_API_URL,
                {
                    headers: {
                        Authorization:
                            `Bearer ${token}`,
                    },
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message ||
                        "Failed to fetch quizzes"
                );
            }

            const sortedQuizzes = [...data].sort(
                (a, b) => a.id - b.id
            );

            setQuizzes(sortedQuizzes);
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

        setError("");
    };

    // =========================
    // CREATE / UPDATE
    // =========================

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            setError("");

            if (!formData.title.trim()) {
                setError(
                    "Quiz title is required."
                );
                return;
            }

            if (!formData.category_id) {
                setError(
                    "Please select a category."
                );
                return;
            }

            if (!formData.duration) {
                setError(
                    "Quiz duration is required."
                );
                return;
            }

            const token = getToken();

            if (!token) {
                setError(
                    "Authentication required. Please login again."
                );
                return;
            }

            const url = editingId
                ? `${API_URL}/${editingId}`
                : API_URL;

            const method = editingId
                ? "PUT"
                : "POST";

            const response = await fetch(url, {
                method,

                headers: {
                    "Content-Type":
                        "application/json",

                    Authorization:
                        `Bearer ${token}`,
                },

                body: JSON.stringify({
                    title:
                        formData.title.trim(),

                    description:
                        formData.description.trim(),

                    category_id:
                        Number(
                            formData.category_id
                        ),

                    duration:
                        Number(
                            formData.duration
                        ),
                }),
            });

            const data =
                await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message ||
                        "Failed to save quiz"
                );
            }

            resetForm();
            await fetchQuizzes();

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
            description:
                quiz.description || "",
            category_id:
                quiz.category_id?.toString() ||
                "",
            duration:
                quiz.duration?.toString() ||
                "",
        });

        setError("");

        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });
    };

    // =========================
    // PUBLISH / UNPUBLISH
    // =========================

    const handlePublishToggle = async (quiz) => {
        try {
            setPublishingId(quiz.id);
            setError("");

            const token = getToken();

            if (!token) {
                throw new Error(
                    "Authentication required. Please login again."
                );
            }

            const response = await fetch(
                `${API_URL}/${quiz.id}/publish`,
                {
                    method: "PATCH",

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
                        "Failed to update quiz status"
                );
            }

            await fetchQuizzes();

        } catch (err) {
            setError(err.message);
        } finally {
            setPublishingId(null);
        }
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

            const token = getToken();

            if (!token) {
                throw new Error(
                    "Authentication required. Please login again."
                );
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
                        "Failed to delete quiz"
                );
            }

            setDeleteId(null);
            setShowDeleteModal(false);

            await fetchQuizzes();

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
            (item) =>
                item.id === Number(categoryId)
        );

        return category?.name || "Unknown";
    };

    // =========================
    // STATUS DISPLAY
    // =========================

    const getStatusClasses = (status) => {
        if (status === "published") {
            return "bg-green-50 text-green-700";
        }

        if (status === "unpublished") {
            return "bg-orange-50 text-orange-700";
        }

        return "bg-slate-100 text-slate-600";
    };

    const getStatusLabel = (status) => {
        if (status === "published") {
            return "Published";
        }

        if (status === "unpublished") {
            return "Unpublished";
        }

        return "Draft";
    };

    // =========================
    // UI
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
                        Quiz Management
                    </h1>

                    <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500 sm:text-base">
                        Create, edit, publish, and manage quizzes on the platform.
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
                                : "📝"}
                        </div>

                        <div className="min-w-0">

                            <h2 className="text-lg font-bold text-slate-900 sm:text-xl">
                                {editingId
                                    ? "Edit Quiz"
                                    : "Create New Quiz"}
                            </h2>

                            <p className="mt-1 text-sm leading-5 text-slate-500">
                                {editingId
                                    ? "Update the selected quiz."
                                    : "Create a quiz for students to attempt."}
                            </p>

                        </div>

                    </div>


                    <form
                        onSubmit={handleSubmit}
                        className="space-y-5 sm:space-y-6"
                    >

                        {/* TITLE */}

                        <div>

                            <label className="mb-2 block text-sm font-semibold text-slate-700">
                                Quiz Title
                            </label>

                            <input
                                type="text"
                                name="title"
                                value={
                                    formData.title
                                }
                                onChange={
                                    handleChange
                                }
                                placeholder="Enter quiz title"
                                required
                                className="w-full min-w-0 rounded-lg border border-slate-300 px-4 py-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
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
                                onChange={
                                    handleChange
                                }
                                placeholder="Describe the quiz..."
                                rows={4}
                                className="w-full resize-y rounded-lg border border-slate-300 px-4 py-3 text-sm leading-6 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                            />

                        </div>


                        {/* CATEGORY + DURATION */}

                        <div className="grid gap-5 sm:grid-cols-2">

                            {/* CATEGORY */}

                            <div className="min-w-0">

                                <label className="mb-2 block text-sm font-semibold text-slate-700">
                                    Category
                                </label>

                                <select
                                    name="category_id"
                                    value={
                                        formData.category_id
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    required
                                    className="w-full min-w-0 rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                                >

                                    <option value="">
                                        Select Category
                                    </option>

                                    {categories.map(
                                        (
                                            category
                                        ) => (
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

                            <div className="min-w-0">

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
                                        className="w-full min-w-0 rounded-lg border border-slate-300 px-4 py-3 pr-20 text-sm outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                                    />

                                    <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-xs font-medium text-slate-400">
                                        minutes
                                    </span>

                                </div>

                            </div>

                        </div>


                        {/* ERROR */}

                        {error && (
                            <div className="break-words rounded-lg bg-red-50 px-4 py-3 text-sm leading-5 text-red-600">
                                {error}
                            </div>
                        )}


                        {/* BUTTONS */}

                        <div className="flex flex-col gap-3 border-t border-slate-100 pt-5 sm:flex-row">

                            <button
                                type="submit"
                                className="w-full rounded-lg bg-blue-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 sm:w-auto"
                            >
                                {editingId
                                    ? "Update Quiz"
                                    : "Create Quiz"}
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
                {/* QUIZZES HEADER */}
                {/* ========================= */}

                <div className="mb-4">

                    <h2 className="text-xl font-bold text-slate-900 sm:text-2xl">
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


                {/* ========================= */}
                {/* LOADING */}
                {/* ========================= */}

                {loading ? (

                    <div className="grid gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3">

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

                    <div className="rounded-2xl bg-white px-5 py-12 text-center shadow-sm ring-1 ring-slate-200 sm:px-6 sm:py-14">

                        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-slate-100 text-2xl">
                            📝
                        </div>

                        <h3 className="mt-4 text-lg font-bold text-slate-900">
                            No quizzes yet
                        </h3>

                        <p className="mt-2 text-sm leading-6 text-slate-500">
                            Create your first quiz using
                            the form above.
                        </p>

                    </div>

                ) : (

                    /* QUIZ CARDS */

                    <div className="grid gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3">

                        {quizzes.map(
                            (quiz, index) => (

                                <div
                                    key={
                                        quiz.id
                                    }
                                    className="group min-w-0 rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200 transition hover:-translate-y-0.5 hover:shadow-md sm:p-6"
                                >

                                    {/* TOP */}

                                    <div className="flex items-start justify-between gap-3">

                                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-lg font-bold text-blue-600 sm:h-11 sm:w-11">
                                            {index + 1}
                                        </div>

                                        <div className="flex max-w-[65%] flex-wrap justify-end gap-2">

                                            <span className="max-w-[180px] truncate rounded-full bg-purple-50 px-3 py-1 text-xs font-semibold text-purple-600">
                                                {getCategoryName(
                                                    quiz.category_id
                                                )}
                                            </span>

                                            <span
                                                className={`rounded-full px-3 py-1 text-xs font-semibold ${getStatusClasses(
                                                    quiz.status
                                                )}`}
                                            >
                                                {getStatusLabel(
                                                    quiz.status
                                                )}
                                            </span>

                                        </div>

                                    </div>


                                    {/* TITLE */}

                                    <h3 className="mt-5 break-words text-lg font-bold leading-6 text-slate-900">
                                        {quiz.title}
                                    </h3>


                                    {/* DESCRIPTION */}

                                    <p className="mt-2 min-h-[48px] break-words text-sm leading-6 text-slate-500">
                                        {quiz.description ||
                                            "No description provided."}
                                    </p>


                                    {/* INFO */}

                                    <div className="mt-5 grid grid-cols-2 gap-3">

                                        <div className="min-w-0 rounded-xl bg-slate-50 p-3">

                                            <p className="text-xs text-slate-400">
                                                Duration
                                            </p>

                                            <p className="mt-1 text-sm font-bold text-slate-800">
                                                {
                                                    quiz.duration
                                                }{" "}
                                                min
                                            </p>

                                        </div>


                                        <div className="min-w-0 rounded-xl bg-slate-50 p-3">

                                            <p className="text-xs text-slate-400">
                                                Quiz ID
                                            </p>

                                            <p className="mt-1 text-sm font-bold text-slate-800">
                                                #
                                                {
                                                    quiz.id
                                                }
                                            </p>

                                        </div>

                                    </div>


                                    {/* ACTIONS */}

                                    <div className="mt-5 flex flex-col gap-2 border-t border-slate-100 pt-4">

                                        <div className="flex flex-col gap-2 min-[400px]:flex-row">

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

                                        <button
                                            type="button"
                                            onClick={() =>
                                                handlePublishToggle(
                                                    quiz
                                                )
                                            }
                                            disabled={
                                                publishingId ===
                                                quiz.id
                                            }
                                            className={`w-full rounded-lg px-4 py-2.5 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-60 ${
                                                quiz.status ===
                                                "published"
                                                    ? "bg-orange-50 text-orange-600 hover:bg-orange-100"
                                                    : "bg-green-50 text-green-600 hover:bg-green-100"
                                            }`}
                                        >
                                            {publishingId ===
                                            quiz.id
                                                ? "Updating..."
                                                : quiz.status ===
                                                  "published"
                                                ? "Unpublish Quiz"
                                                : "Publish Quiz"}
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
                            Delete Quiz?
                        </h2>

                        <p className="mt-2 text-sm leading-6 text-slate-500">
                            Are you sure you want to delete
                            this quiz? This action cannot be
                            undone.
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