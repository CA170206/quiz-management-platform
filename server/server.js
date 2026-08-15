import app from "./app.js";
import pool from "./config/db.js";

const PORT = process.env.PORT || 5000;

async function startServer() {
    try {
        await pool.query("SELECT NOW()");

        console.log("✅ PostgreSQL Connected");

        app.listen(PORT, () => {
            console.log(
                `🚀 Server running on port ${PORT}`
            );
        });
    } catch (err) {
        console.error(
            "Database Connection Error"
        );

        console.error(err.message);
    }
}

startServer();