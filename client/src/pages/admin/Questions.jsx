import { useEffect, useState } from "react";

const API_URL = "http://localhost:5000/api/questions";
const CATEGORY_API_URL = "http://localhost:5000/api/categories";

function Questions() {
    const [questions, setQuestions] = useState([]);
    const [categories, setCategories] = useState([]);

    const [formData, setFormData] = useState({
        category_id: "",
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

    // Fetch questions
    const fetchQuestions = async () => {
        try {
            setLoading(true);
            setError("");

            const response = await fetch(API_URL);

            if (!response.ok) {
                throw new Error("Failed to fetch questions");
            }

            const data = await response.json();
            setQuestions(data);
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
        fetchQuestions();
        fetchCategories();
    }, []);

    // Handle input changes
    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    // Add / Update question
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
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message || "Something went wrong"
                );
            }

            resetForm();
            fetchQuestions();
        } catch (err) {
            setError(err.message);
        }
    };

    // Edit question
    const handleEdit = (question) => {
        setEditingId(question.id);

        setFormData({
            category_id: question.category_id,
            question_text: question.question_text,
            option_a: question.option_a,
            option_b: question.option_b,
            option_c: question.option_c,
            option_d: question.option_d,
            correct_answer: question.correct_answer,
        });
    };

    // Delete question
    const handleDelete = async (id) => {
        const confirmed = window.confirm(
            "Are you sure you want to delete this question?"
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
                    data.message || "Failed to delete question"
                );
            }

            fetchQuestions();
        } catch (err) {
            setError(err.message);
        }
    };

    // Reset form
    const resetForm = () => {
        setEditingId(null);

        setFormData({
            category_id: "",
            question_text: "",
            option_a: "",
            option_b: "",
            option_c: "",
            option_d: "",
            correct_answer: "",
        });
    };

    return (
        <div>
            <h1>Questions</h1>

            <p>Manage quiz questions from this page.</p>

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

                <textarea
                    name="question_text"
                    placeholder="Enter question"
                    value={formData.question_text}
                    onChange={handleChange}
                />

                <br />

                <input
                    type="text"
                    name="option_a"
                    placeholder="Option A"
                    value={formData.option_a}
                    onChange={handleChange}
                />

                <br />

                <input
                    type="text"
                    name="option_b"
                    placeholder="Option B"
                    value={formData.option_b}
                    onChange={handleChange}
                />

                <br />

                <input
                    type="text"
                    name="option_c"
                    placeholder="Option C"
                    value={formData.option_c}
                    onChange={handleChange}
                />

                <br />

                <input
                    type="text"
                    name="option_d"
                    placeholder="Option D"
                    value={formData.option_d}
                    onChange={handleChange}
                />

                <br />

                <input
                    type="text"
                    name="correct_answer"
                    placeholder="Correct Answer"
                    value={formData.correct_answer}
                    onChange={handleChange}
                />

                <br />

                <button type="submit">
                    {editingId
                        ? "Update Question"
                        : "Add Question"}
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

            <h2>All Questions</h2>

            {loading ? (
                <p>Loading questions...</p>
            ) : questions.length === 0 ? (
                <p>No questions found.</p>
            ) : (
                <table>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Category</th>
                            <th>Question</th>
                            <th>Correct Answer</th>
                            <th>Actions</th>
                        </tr>
                    </thead>

                    <tbody>
                        {questions.map((question) => (
                            <tr key={question.id}>
                                <td>{question.id}</td>

                                <td>
                                    {categories.find(
                                        (category) =>
                                            category.id ===
                                            question.category_id
                                    )?.name || "Unknown"}
                                </td>

                                <td>
                                    {question.question_text}
                                </td>

                                <td>
                                    {question.correct_answer}
                                </td>

                                <td>
                                    <button
                                        onClick={() =>
                                            handleEdit(question)
                                        }
                                    >
                                        Edit
                                    </button>

                                    <button
                                        onClick={() =>
                                            handleDelete(
                                                question.id
                                            )
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

export default Questions;