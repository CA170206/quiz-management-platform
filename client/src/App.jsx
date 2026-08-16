import { useEffect, useState } from "react";
import AppRoutes from "./routes/AppRoutes";

function App() {
    const [darkMode, setDarkMode] = useState(() => {
        try {
            return localStorage.getItem("tryquizzers-theme") === "dark";
        } catch {
            return false;
        }
    });

    useEffect(() => {
        try {
            localStorage.setItem(
                "tryquizzers-theme",
                darkMode ? "dark" : "light"
            );
        } catch {
            // Ignore localStorage errors
        }

        document.documentElement.classList.toggle(
            "dark",
            darkMode
        );

        document.documentElement.style.colorScheme = darkMode
            ? "dark"
            : "light";

        document.body.style.backgroundColor = darkMode
            ? "#0a0a0a"
            : "#ffffff";

        document.body.style.transition =
            "background-color 300ms ease";
    }, [darkMode]);

    useEffect(() => {
        window.toggleTryQuizzersTheme = () => {
            setDarkMode((current) => !current);
        };

        window.getTryQuizzersTheme = () => {
            return darkMode;
        };

        return () => {
            delete window.toggleTryQuizzersTheme;
            delete window.getTryQuizzersTheme;
        };
    }, [darkMode]);

    return (
        <div
            className={`min-h-screen transition-colors duration-300 ${
                darkMode
                    ? "bg-[#0a0a0a] text-white"
                    : "bg-white text-slate-950"
            }`}
        >
            <AppRoutes />
        </div>
    );
}

export default App;