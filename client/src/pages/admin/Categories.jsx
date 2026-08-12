import { useEffect, useState } from "react";

const API_URL = "http://localhost:5000/api/categories";

function Categories() {
    const [categories, setCategories] = useState([]);
    const [name, setName] = useState("");
    const [editingId, setEditingId] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [deleteId, setDeleteId] = useState(null);
    const [deleting, setDeleting] = useState(false);

    const fetchCategories = async () => {
        try {
            setLoading(true);
            setError("");

            const response = await fetch(API_URL);

            if (!response.ok) {
                throw new Error("Failed to fetch categories");
            }

            const data = await response.json();
            setCategories(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!name.trim()) {
            setError("Category name is required.");
            return;
        }

        try {
            setError("");

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
                    name: name.trim(),
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message || "Something went wrong"
                );
            }

            setName("");
            setEditingId(null);

            fetchCategories();
        } catch (err) {
            setError(err.message);
        }
    };

    const handleEdit = (category) => {
        setEditingId(category.id);
        setName(category.name);

        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });
    };

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
                        "Failed to delete category"
                );
            }

            setDeleteId(null);
            setShowDeleteModal(false);

            fetchCategories();
        } catch (err) {
            setError(err.message);
        } finally {
            setDeleting(false);
        }
    };

    const handleCancel = () => {
        setEditingId(null);
        setName("");
        setError("");
    };

    return (
        <div className="min-h-screen bg-slate-50 px-6 py-10">
            <div className="mx-auto max-w-7xl">

                {/* Header */}
                <div className="mb-8">
                    <p className="text-sm font-semibold text-blue-600">
                        Administration
                    </p>

                    <h1 className="mt-1 text-3xl font-bold text-slate-900">
                        Categories
                    </h1>

                    <p className="mt-2 text-slate-500">
                        Create and manage categories used by
                        your quizzes.
                    </p>
                </div>

                {/* Form Card */}
                <div className="mb-8 rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">

                    <div className="mb-5 flex items-center gap-4">
                        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-xl">
                            {editingId ? "✏️" : "📁"}
                        </div>

                        <div>
                            <h2 className="text-lg font-bold text-slate-900">
                                {editingId
                                    ? "Edit Category"
                                    : "Add New Category"}
                            </h2>

                            <p className="mt-1 text-sm text-slate-500">
                                {editingId
                                    ? "Update the selected category."
                                    : "Create a category for organizing quizzes."}
                            </p>
                        </div>
                    </div>

                    <form
                        onSubmit={handleSubmit}
                        className="flex flex-col gap-3 sm:flex-row"
                    >
                        <input
                            type="text"
                            placeholder="Enter category name"
                            value={name}
                            onChange={(e) =>
                                setName(e.target.value)
                            }
                            className="flex-1 rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                        />

                        <button
                            type="submit"
                            className="rounded-lg bg-blue-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
                        >
                            {editingId
                                ? "Update Category"
                                : "Add Category"}
                        </button>

                        {editingId && (
                            <button
                                type="button"
                                onClick={handleCancel}
                                className="rounded-lg border border-slate-300 bg-white px-6 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                            >
                                Cancel
                            </button>
                        )}
                    </form>

                    {error && (
                        <div className="mt-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">
                            {error}
                        </div>
                    )}
                </div>

                {/* Category List */}
                <div className="mb-4 flex items-end justify-between">
                    <div>
                        <h2 className="text-2xl font-bold text-slate-900">
                            All Categories
                        </h2>

                        <p className="mt-1 text-sm text-slate-500">
                            {categories.length}{" "}
                            {categories.length === 1
                                ? "category"
                                : "categories"}{" "}
                            available
                        </p>
                    </div>
                </div>

                {loading ? (
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        {[1, 2, 3].map((item) => (
                            <div
                                key={item}
                                className="h-36 animate-pulse rounded-2xl bg-white shadow-sm ring-1 ring-slate-200"
                            />
                        ))}
                    </div>
                ) : categories.length === 0 ? (
                    <div className="rounded-2xl bg-white px-6 py-14 text-center shadow-sm ring-1 ring-slate-200">
                        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-slate-100 text-2xl">
                            📁
                        </div>

                        <h3 className="mt-4 text-lg font-bold text-slate-900">
                            No categories yet
                        </h3>

                        <p className="mt-2 text-sm text-slate-500">
                            Add your first category using the
                            form above.
                        </p>
                    </div>
                ) : (
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">

                        {categories.map((category, index) => (
                            <div
                                key={category.id}
                                className="group rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200 transition hover:-translate-y-0.5 hover:shadow-md"
                            >
                                <div className="flex items-start justify-between">

                                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 font-bold text-blue-600">
                                        {index + 1}
                                    </div>

                                    <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-500">
                                        #{category.id}
                                    </span>

                                </div>

                                <h3 className="mt-5 text-lg font-bold text-slate-900">
                                    {category.name}
                                </h3>

                                <p className="mt-1 text-xs text-slate-400">
                                    Created{" "}
                                    {new Date(
                                        category.created_at
                                    ).toLocaleDateString()}
                                </p>

                                <div className="mt-5 flex gap-2 border-t border-slate-100 pt-4">

                                    <button
                                        type="button"
                                        onClick={() =>
                                            handleEdit(category)
                                        }
                                        className="flex-1 rounded-lg bg-blue-50 px-3 py-2.5 text-xs font-semibold text-blue-600 transition hover:bg-blue-100"
                                    >
                                        Edit
                                    </button>

                                    <button
                                        type="button"
                                        onClick={() =>
                                            openDeleteModal(
                                                category.id
                                            )
                                        }
                                        className="flex-1 rounded-lg bg-red-50 px-3 py-2.5 text-xs font-semibold text-red-600 transition hover:bg-red-100"
                                    >
                                        Delete
                                    </button>

                                </div>
                            </div>
                        ))}

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
                            Delete Category?
                        </h2>

                        <p className="mt-2 text-sm leading-6 text-slate-500">
                            Are you sure you want to delete this
                            category? This action cannot be
                            undone.
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
                                    : "Delete Category"}
                            </button>

                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Categories;