import {
    createContext,
    useContext,
    useEffect,
    useState,
} from "react";

const ThemeContext = createContext(null);

export function ThemeProvider({ children }) {
    const [darkMode, setDarkMode] = useState(() => {
        try {
            return (
                localStorage.getItem(
                    "tryquizzers-theme"
                ) === "dark"
            );
        } catch {
            return false;
        }
    });

    useEffect(() => {
        const root = document.documentElement;

        root.classList.toggle(
            "dark",
            darkMode
        );

        root.style.colorScheme = darkMode
            ? "dark"
            : "light";

        try {
            localStorage.setItem(
                "tryquizzers-theme",
                darkMode
                    ? "dark"
                    : "light"
            );
        } catch {
            // Ignore localStorage errors
        };
    }, [darkMode]);

    const toggleTheme = () => {
        setDarkMode(
            (current) => !current
        );
    };

    return (
        <ThemeContext.Provider
            value={{
                darkMode,
                setDarkMode,
                toggleTheme,
            }}
        >
            {children}
        </ThemeContext.Provider>
    );
}

export function useTheme() {
    const context =
        useContext(ThemeContext);

    if (!context) {
        throw new Error(
            "useTheme must be used inside ThemeProvider"
        );
    }

    return context;
}