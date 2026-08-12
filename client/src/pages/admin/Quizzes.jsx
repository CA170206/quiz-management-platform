import { useEffect, useState } from "react";

const API_URL = "http://localhost:5000/api/quizzes";
const CATEGORY_API_URL = "http://localhost:5000/api/categories";

function Quizzes() {
    const [quizzes, setQuizzes] = useState([]);
    const [categories, setCategories] = useState([]);

    const [formData, setFormData] = useState({
        category_id: "",
        title: "",
        description: "",
        duration: "",
    });

    const [editingId, setEditingId] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    // Fetch quizzes
    const fetchQuizzes = async () => {
        try {
            setLoading(true);
            setError("");

            const response = await fetch(API_URL);

            if (!response.ok) {
                throw new Error("Failed to fetch quizzes");
            }

            const data = await response.json();
            setQuizzes(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    // Fetch categories
    const fetchCategories = async () => {
        try {
            const response = await fetch(CATEGORY_API_URL);

            if (!response.ok) {
                throw new Error("Failed to fetch categories");
            }

            const data = await response.json();
            setCategories(data);
        } catch (err) {
            setError(err.message);
        }
    };

    useEffect(() => {
        fetchQuizzes();
        fetchCategories();
    }, []);

    // Handle input changes
    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    // Add / Update quiz
    const handleSubmit = async (e) => {
        e.preventDefault();

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
                    ...formData,
                    category_id: Number(formData.category_id),
                    duration: Number(formData.duration),
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message || "Something went wrong"
                );
            }

            resetForm();
            fetchQuizzes();
        } catch (err) {
            setError(err.message);
        }
    };

    // Edit quiz
    const handleEdit = (quiz) => {
        setEditingId(quiz.id);

        setFormData({
            category_id: quiz.category_id,
            title: quiz.title,
            description: quiz.description || "",
            duration: quiz.duration,
        });
    };

    // Delete quiz
    const handleDelete = async (id) => {
        const confirmed = window.confirm(
            "Are you sure you want to delete this quiz?"
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
                throw new Error(
                    data.message || "Failed to delete quiz"
                );
            }

            fetchQuizzes();
        } catch (err) {
            setError(err.message);
        }
    };

    // Reset form
    const resetForm = () => {
        setEditingId(null);

        setFormData({
            category_id: "",
            title: "",
            description: "",
            duration: "",
        });
    };

    return (
        <div>
            <h1>Quizzes</h1>

            <p>Manage quizzes from this page.</p>

            <form onSubmit={handleSubmit}>

                <select
                    name="category_id"
                    value={formData.category_id}
                    onChange={handleChange}
                >
                    <option value="">
                        Select Category
                    </option>

                    {categories.map((category) => (
                        <option
                            key={category.id}
                            value={category.id}
                        >
                            {category.name}
                        </option>
                    ))}
                </select>

                <br />

                <input
                    type="text"
                    name="title"
                    placeholder="Quiz title"
                    value={formData.title}
                    onChange={handleChange}
                />

                <br />

                <textarea
                    name="description"
                    placeholder="Quiz description"
                    value={formData.description}
                    onChange={handleChange}
                />

                <br />

                <input
                    type="number"
                    name="duration"
                    placeholder="Duration in minutes"
                    value={formData.duration}
                    onChange={handleChange}
                />

                <br />

                <button type="submit">
                    {editingId ? "Update Quiz" : "Add Quiz"}
                </button>

                {editingId && (
                    <button
                        type="button"
                        onClick={resetForm}
                    >
                        Cancel
                    </button>
                )}
            </form>

            {error && <p>{error}</p>}

            <hr />

            <h2>All Quizzes</h2>

            {loading ? (
                <p>Loading quizzes...</p>
            ) : quizzes.length === 0 ? (
                <p>No quizzes found.</p>
            ) : (
                <table>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Category</th>
                            <th>Title</th>
                            <th>Description</th>
                            <th>Duration</th>
                            <th>Actions</th>
                        </tr>
                    </thead>

                    <tbody>
                        {quizzes.map((quiz) => (
                            <tr key={quiz.id}>
                                <td>{quiz.id}</td>

                                <td>
                                    {categories.find(
                                        (category) =>
                                            category.id ===
                                            quiz.category_id
                                    )?.name || "Unknown"}
                                </td>

                                <td>{quiz.title}</td>

                                <td>{quiz.description}</td>

                                <td>
                                    {quiz.duration} minutes
                                </td>

                                <td>
                                    <button
                                        onClick={() =>
                                            handleEdit(quiz)
                                        }
                                    >
                                        Edit
                                    </button>

                                    <button
                                        onClick={() =>
                                            handleDelete(quiz.id)
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

export default Quizzes;