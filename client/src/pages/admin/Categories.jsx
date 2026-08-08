import { useEffect, useState } from "react";

const API_URL = "http://localhost:5000/api/categories";

function Categories() {
    const [categories, setCategories] = useState([]);
    const [name, setName] = useState("");
    const [editingId, setEditingId] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    // Get all categories
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

    // Load categories when page opens
    useEffect(() => {
        fetchCategories();
    }, []);

    // Add / Update category
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!name.trim()) {
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
                throw new Error(data.message || "Something went wrong");
            }

            setName("");
            setEditingId(null);

            fetchCategories();
        } catch (err) {
            setError(err.message);
        }
    };

    // Start editing
    const handleEdit = (category) => {
        setEditingId(category.id);
        setName(category.name);
    };

    // Delete category
    const handleDelete = async (id) => {
        const confirmed = window.confirm(
            "Are you sure you want to delete this category?"
        );

        if (!confirmed) {
            return;
        }

        try {
            setError("");

            const response = await fetch(`${API_URL}/${id}`, {
                method: "DELETE",
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Failed to delete category");
            }

            fetchCategories();
        } catch (err) {
            setError(err.message);
        }
    };

    // Cancel editing
    const handleCancel = () => {
        setEditingId(null);
        setName("");
    };

    return (
        <div>
            <h1>Categories</h1>

            <p>
                Manage quiz categories from this page.
            </p>

            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    placeholder="Enter category name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />

                <button type="submit">
                    {editingId ? "Update Category" : "Add Category"}
                </button>

                {editingId && (
                    <button type="button" onClick={handleCancel}>
                        Cancel
                    </button>
                )}
            </form>

            {error && (
                <p>
                    {error}
                </p>
            )}

            <hr />

            <h2>All Categories</h2>

            {loading ? (
                <p>Loading categories...</p>
            ) : categories.length === 0 ? (
                <p>No categories found.</p>
            ) : (
                <table>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Name</th>
                            <th>Created At</th>
                            <th>Actions</th>
                        </tr>
                    </thead>

                    <tbody>
                        {categories.map((category) => (
                            <tr key={category.id}>
                                <td>{category.id}</td>
                                <td>{category.name}</td>
                                <td>
                                    {new Date(
                                        category.created_at
                                    ).toLocaleDateString()}
                                </td>
                                <td>
                                    <button
                                        onClick={() =>
                                            handleEdit(category)
                                        }
                                    >
                                        Edit
                                    </button>

                                    <button
                                        onClick={() =>
                                            handleDelete(category.id)
                                        }
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
}

export default Categories;