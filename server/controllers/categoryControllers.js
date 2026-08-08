import pool from "../config/db.js";

export const getCategories = async (req, res) => {

    const result = await pool.query(
        "SELECT * FROM categories"
    );

    res.json(result.rows);
};

export const createCategory = async (req, res) => {

    const { name } = req.body;

    if (!name) {
        return res.status(400).json({
            message: "Category name is required"
        });
    }

    const result = await pool.query(
        "INSERT INTO categories (name) VALUES ($1) RETURNING *",
        [name]
    );

    res.status(201).json({
        message: "Category created successfully",
        category: result.rows[0]
    });
};

export const updateCategory = async (req, res) => {

    const { id } = req.params;
    const { name } = req.body;

    if (!name) {
        return res.status(400).json({
            message: "Category name is required"
        });
    }

    const result = await pool.query(
        "UPDATE categories SET name = $1 WHERE id = $2 RETURNING *",
        [name, id]
    );

    if (result.rows.length === 0) {
        return res.status(404).json({
            message: "Category not found"
        });
    }

    res.status(200).json({
        message: "Category updated successfully",
        category: result.rows[0]
    });
};

export const deleteCategory = async (req, res) => {

    const { id } = req.params;

    const result = await pool.query(
        "DELETE FROM categories WHERE id = $1 RETURNING *",
        [id]
    );

    if (result.rows.length === 0) {
        return res.status(404).json({
            message: "Category not found"
        });
    }

    res.status(200).json({
        message: "Category deleted successfully",
        category: result.rows[0]
    });
};