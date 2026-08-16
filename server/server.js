import "dotenv/config";
import app from "./app.js";
import pool from "./config/db.js";

const PORT = process.env.PORT || 5000;

let server;

async function startServer() {
    try {
        // Test database connection
        await pool.query("SELECT NOW()");

        console.log("✅ PostgreSQL Connected");

        // Start Express server
        server = app.listen(PORT, () => {
            console.log(
                `🚀 Server running on port ${PORT}`
            );
        });

        // Catch server errors
        server.on("error", (error) => {
            console.error(
                "❌ Server error:",
                error
            );
        });

    } catch (error) {
        console.error(
            "❌ Database Connection Error:"
        );

        console.error(error);

        process.exit(1);
    }
}


// ==========================================
// PROCESS ERROR HANDLING
// ==========================================

process.on(
    "uncaughtException",
    (error) => {
        console.error(
            "❌ Uncaught Exception:"
        );

        console.error(error);
    }
);


process.on(
    "unhandledRejection",
    (reason) => {
        console.error(
            "❌ Unhandled Promise Rejection:"
        );

        console.error(reason);
    }
);


// ==========================================
// START SERVER
// ==========================================

startServer();