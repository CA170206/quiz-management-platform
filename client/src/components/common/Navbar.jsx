import { Link, useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

function Navbar() {
    const navigate = useNavigate();
    const location = useLocation();

    const [open, setOpen] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);

    const [deleteOpen, setDeleteOpen] = useState(false);
    const [password, setPassword] = useState("");
    const [deleteError, setDeleteError] = useState("");
    const [deleting, setDeleting] = useState(false);

    // =========================================================
    // GLOBAL THEME
    // =========================================================

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
        const handleThemeChange = (event) => {
            if (
                event?.detail &&
                typeof event.detail.darkMode === "boolean"
            ) {
                setDarkMode(event.detail.darkMode);
                return;
            }

            try {
                setDarkMode(
                    localStorage.getItem(
                        "tryquizzers-theme"
                    ) === "dark"
                );
            } catch {
                // Ignore storage errors
            }
        };

        window.addEventListener(
            "tryquizzers-theme-change",
            handleThemeChange
        );

        return () => {
            window.removeEventListener(
                "tryquizzers-theme-change",
                handleThemeChange
            );
        };
    }, []);

    const handleThemeToggle = () => {
        const newDarkMode = !darkMode;

        setDarkMode(newDarkMode);

        try {
            localStorage.setItem(
                "tryquizzers-theme",
                newDarkMode ? "dark" : "light"
            );
        } catch {
            // Ignore storage errors
        }

        document.documentElement.classList.toggle(
            "dark",
            newDarkMode
        );

        document.documentElement.style.colorScheme =
            newDarkMode ? "dark" : "light";

        document.body.style.backgroundColor =
            newDarkMode
                ? "#0a0a0a"
                : "#ffffff";

        window.dispatchEvent(
            new CustomEvent(
                "tryquizzers-theme-change",
                {
                    detail: {
                        darkMode: newDarkMode,
                    },
                }
            )
        );

        // Also update the global function used by App.jsx
        if (
            typeof window.toggleTryQuizzersTheme ===
            "function"
        ) {
            // App.jsx owns the global state.
            // The event above keeps all components synced.
        }
    };

    // =========================================================
    // USER
    // =========================================================

    const user = JSON.parse(
        localStorage.getItem("user") ||
            sessionStorage.getItem("user") ||
            "null"
    );

    const isAdmin = user?.role === "admin";

    const profilePath = isAdmin
        ? "/admin/profile"
        : "/student/profile";

    const analyticsPath = isAdmin
        ? "/admin/analytics"
        : "/student/analytics";

    const homePath = isAdmin
        ? "/admin/dashboard"
        : "/student/dashboard";

    // =========================================================
    // CLOSE MENUS
    // =========================================================

    const closeMenus = () => {
        setOpen(false);
        setMobileOpen(false);
    };

    // =========================================================
    // LOGOUT
    // =========================================================

    const handleLogout = () => {
        closeMenus();

        localStorage.removeItem("token");
        localStorage.removeItem("user");

        sessionStorage.removeItem("token");
        sessionStorage.removeItem("user");

        navigate("/login");
    };

    // =========================================================
    // DELETE ACCOUNT
    // =========================================================

    const handleOpenDelete = () => {
        closeMenus();

        setPassword("");
        setDeleteError("");
        setDeleteOpen(true);
    };

    const handleCloseDelete = () => {
        if (deleting) return;

        setDeleteOpen(false);
        setPassword("");
        setDeleteError("");
    };

    const handleDeleteAccount = async () => {
        if (!password) {
            setDeleteError(
                "Please enter your password."
            );
            return;
        }

        try {
            setDeleting(true);
            setDeleteError("");

            const token =
                localStorage.getItem("token") ||
                sessionStorage.getItem("token");

            if (!token) {
                throw new Error(
                    "You are not logged in."
                );
            }

            const response = await fetch(
                `${import.meta.env.VITE_API_URL}/api/users/profile`,
                {
                    method: "DELETE",
                    headers: {
                        "Content-Type":
                            "application/json",
                        Authorization:
                            `Bearer ${token}`,
                    },
                    body: JSON.stringify({
                        password,
                    }),
                }
            );

            const data =
                await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message ||
                        "Failed to delete account"
                );
            }

            localStorage.removeItem("token");
            localStorage.removeItem("user");

            sessionStorage.removeItem("token");
            sessionStorage.removeItem("user");

            setDeleteOpen(false);
            setPassword("");

            navigate("/login");
        } catch (error) {
            setDeleteError(
                error.message ||
                    "Failed to delete account"
            );
        } finally {
            setDeleting(false);
        }
    };

    // =========================================================
    // ACTIVE ROUTE
    // =========================================================

    const isActive = (path) => {
        return location.pathname === path;
    };

    // =========================================================
    // UI
    // =========================================================

    return (
        <>
            {/* ================================================= */}
            {/* FLOATING NAVBAR */}
            {/* ================================================= */}

            <div className="fixed left-0 right-0 top-0 z-50 px-3 pt-3 sm:px-5 sm:pt-4">

                <nav
                    className={`
                        mx-auto
                        max-w-7xl
                        rounded-2xl
                        shadow-[0_10px_35px_rgba(15,23,42,0.08)]
                        backdrop-blur-xl
                        transition-all
                        duration-300
                        ${
                            darkMode
                                ? "bg-[#151515]/95 shadow-black/40 ring-1 ring-white/10"
                                : "bg-white/90"
                        }
                    `}
                >

                    <div className="flex min-h-[64px] items-center justify-between px-4 sm:px-6 lg:px-7">

                        {/* ================================================= */}
                        {/* LOGO */}
                        {/* ================================================= */}

                        <Link
                            to={homePath}
                            onClick={closeMenus}
                            className="group flex shrink-0 items-center"
                        >

                            <div className="leading-none">

                                <div
                                    className={`
                                        text-xl
                                        font-extrabold
                                        tracking-tight
                                        transition-colors
                                        duration-300
                                        sm:text-[22px]
                                        ${
                                            darkMode
                                                ? "text-white"
                                                : "text-black"
                                        }
                                    `}
                                >
                                    TryQuizzers
                                </div>

                                <div
                                    className={`
                                        mt-0.5
                                        hidden
                                        text-[10px]
                                        font-medium
                                        transition-colors
                                        duration-300
                                        sm:block
                                        ${
                                            darkMode
                                                ? "text-slate-500"
                                                : "text-slate-400"
                                        }
                                    `}
                                >
                                    Learn. Practice. Improve.
                                </div>

                            </div>

                        </Link>

                        {/* ================================================= */}
                        {/* DESKTOP NAVIGATION */}
                        {/* ================================================= */}

                        <div className="hidden items-center gap-1 md:flex">

                            {isAdmin ? (
                                <>
                                    <NavItem
                                        to="/admin/dashboard"
                                        active={isActive(
                                            "/admin/dashboard"
                                        )}
                                        onClick={
                                            closeMenus
                                        }
                                        darkMode={
                                            darkMode
                                        }
                                    >
                                        Dashboard
                                    </NavItem>

                                    <NavItem
                                        to="/admin/categories"
                                        active={isActive(
                                            "/admin/categories"
                                        )}
                                        onClick={
                                            closeMenus
                                        }
                                        darkMode={
                                            darkMode
                                        }
                                    >
                                        Categories
                                    </NavItem>

                                    <NavItem
                                        to="/admin/questions"
                                        active={isActive(
                                            "/admin/questions"
                                        )}
                                        onClick={
                                            closeMenus
                                        }
                                        darkMode={
                                            darkMode
                                        }
                                    >
                                        Questions
                                    </NavItem>

                                    <NavItem
                                        to="/admin/quizzes"
                                        active={isActive(
                                            "/admin/quizzes"
                                        )}
                                        onClick={
                                            closeMenus
                                        }
                                        darkMode={
                                            darkMode
                                        }
                                    >
                                        Quizzes
                                    </NavItem>
                                </>
                            ) : (
                                <>
                                    <NavItem
                                        to="/student/dashboard"
                                        active={isActive(
                                            "/student/dashboard"
                                        )}
                                        onClick={
                                            closeMenus
                                        }
                                        darkMode={
                                            darkMode
                                        }
                                    >
                                        Dashboard
                                    </NavItem>

                                    <NavItem
                                        to="/student/quizzes"
                                        active={isActive(
                                            "/student/quizzes"
                                        )}
                                        onClick={
                                            closeMenus
                                        }
                                        darkMode={
                                            darkMode
                                        }
                                    >
                                        Quizzes
                                    </NavItem>

                                    <NavItem
                                        to="/student/leaderboard"
                                        active={isActive(
                                            "/student/leaderboard"
                                        )}
                                        onClick={
                                            closeMenus
                                        }
                                        darkMode={
                                            darkMode
                                        }
                                    >
                                        Leaderboard
                                    </NavItem>
                                </>
                            )}

                            {/* ================================================= */}
                            {/* THEME TOGGLE */}
                            {/* ================================================= */}

                            <button
                                type="button"
                                onClick={
                                    handleThemeToggle
                                }
                                aria-label={
                                    darkMode
                                        ? "Switch to light mode"
                                        : "Switch to dark mode"
                                }
                                title={
                                    darkMode
                                        ? "Light mode"
                                        : "Dark mode"
                                }
                                className={`
                                    ml-2
                                    flex
                                    h-10
                                    w-10
                                    items-center
                                    justify-center
                                    rounded-full
                                    text-base
                                    transition-all
                                    duration-300
                                    ${
                                        darkMode
                                            ? "bg-white/10 text-white hover:bg-white hover:text-black"
                                            : "bg-slate-100 text-slate-700 hover:bg-black hover:text-white"
                                    }
                                `}
                            >
                                {darkMode ? "☀" : "☾"}
                            </button>

                            {/* ================================================= */}
                            {/* PROFILE */}
                            {/* ================================================= */}

                            <div className="relative ml-2">

                                <button
                                    type="button"
                                    onClick={() =>
                                        setOpen(
                                            !open
                                        )
                                    }
                                    className={`
                                        flex
                                        h-10
                                        w-10
                                        items-center
                                        justify-center
                                        rounded-full
                                        text-sm
                                        font-bold
                                        transition
                                        ${
                                            darkMode
                                                ? "bg-white/10 text-white hover:bg-white hover:text-black"
                                                : "bg-slate-100 text-black hover:bg-black hover:text-white"
                                        }
                                    `}
                                >
                                    {user?.full_name
                                        ?.charAt(
                                            0
                                        )
                                        ?.toUpperCase() ||
                                        "U"}
                                </button>

                                {open && (
                                    <ProfileMenu
                                        user={user}
                                        profilePath={
                                            profilePath
                                        }
                                        analyticsPath={
                                            analyticsPath
                                        }
                                        setOpen={
                                            setOpen
                                        }
                                        handleLogout={
                                            handleLogout
                                        }
                                        handleOpenDelete={
                                            handleOpenDelete
                                        }
                                        darkMode={
                                            darkMode
                                        }
                                    />
                                )}

                            </div>

                        </div>

                        {/* ================================================= */}
                        {/* MOBILE BUTTONS */}
                        {/* ================================================= */}

                        <div className="flex items-center gap-2 md:hidden">

                            {/* THEME */}

                            <button
                                type="button"
                                onClick={
                                    handleThemeToggle
                                }
                                aria-label={
                                    darkMode
                                        ? "Switch to light mode"
                                        : "Switch to dark mode"
                                }
                                className={`
                                    flex
                                    h-10
                                    w-10
                                    items-center
                                    justify-center
                                    rounded-xl
                                    text-base
                                    transition
                                    ${
                                        darkMode
                                            ? "bg-white/10 text-white hover:bg-white hover:text-black"
                                            : "bg-slate-100 text-black hover:bg-black hover:text-white"
                                    }
                                `}
                            >
                                {darkMode ? "☀" : "☾"}
                            </button>

                            {/* MOBILE MENU */}

                            <button
                                type="button"
                                onClick={() =>
                                    setMobileOpen(
                                        !mobileOpen
                                    )
                                }
                                className={`
                                    flex
                                    h-10
                                    w-10
                                    items-center
                                    justify-center
                                    rounded-xl
                                    text-lg
                                    transition
                                    ${
                                        darkMode
                                            ? "bg-white/10 text-white hover:bg-white hover:text-black"
                                            : "bg-slate-100 text-black hover:bg-black hover:text-white"
                                    }
                                `}
                                aria-label="Toggle navigation menu"
                            >
                                {mobileOpen
                                    ? "✕"
                                    : "☰"}
                            </button>

                        </div>

                    </div>

                    {/* ================================================= */}
                    {/* MOBILE NAVIGATION */}
                    {/* ================================================= */}

                    {mobileOpen && (
                        <div
                            className={`
                                border-t
                                px-3
                                pb-3
                                pt-2
                                transition-colors
                                duration-300
                                md:hidden
                                ${
                                    darkMode
                                        ? "border-white/10"
                                        : "border-slate-100"
                                }
                            `}
                        >

                            <div
                                className={`
                                    rounded-xl
                                    p-2
                                    ${
                                        darkMode
                                            ? "bg-[#1c1c1c]"
                                            : "bg-slate-50"
                                    }
                                `}
                            >

                                {isAdmin ? (
                                    <>
                                        <MobileNavItem
                                            to="/admin/dashboard"
                                            active={isActive(
                                                "/admin/dashboard"
                                            )}
                                            onClick={
                                                closeMenus
                                            }
                                            darkMode={
                                                darkMode
                                            }
                                        >
                                            Dashboard
                                        </MobileNavItem>

                                        <MobileNavItem
                                            to="/admin/categories"
                                            active={isActive(
                                                "/admin/categories"
                                            )}
                                            onClick={
                                                closeMenus
                                            }
                                            darkMode={
                                                darkMode
                                            }
                                        >
                                            Categories
                                        </MobileNavItem>

                                        <MobileNavItem
                                            to="/admin/questions"
                                            active={isActive(
                                                "/admin/questions"
                                            )}
                                            onClick={
                                                closeMenus
                                            }
                                            darkMode={
                                                darkMode
                                            }
                                        >
                                            Questions
                                        </MobileNavItem>

                                        <MobileNavItem
                                            to="/admin/quizzes"
                                            active={isActive(
                                                "/admin/quizzes"
                                            )}
                                            onClick={
                                                closeMenus
                                            }
                                            darkMode={
                                                darkMode
                                            }
                                        >
                                            Quizzes
                                        </MobileNavItem>
                                    </>
                                ) : (
                                    <>
                                        <MobileNavItem
                                            to="/student/dashboard"
                                            active={isActive(
                                                "/student/dashboard"
                                            )}
                                            onClick={
                                                closeMenus
                                            }
                                            darkMode={
                                                darkMode
                                            }
                                        >
                                            Dashboard
                                        </MobileNavItem>

                                        <MobileNavItem
                                            to="/student/quizzes"
                                            active={isActive(
                                                "/student/quizzes"
                                            )}
                                            onClick={
                                                closeMenus
                                            }
                                            darkMode={
                                                darkMode
                                            }
                                        >
                                            Quizzes
                                        </MobileNavItem>

                                        <MobileNavItem
                                            to="/student/leaderboard"
                                            active={isActive(
                                                "/student/leaderboard"
                                            )}
                                            onClick={
                                                closeMenus
                                            }
                                            darkMode={
                                                darkMode
                                            }
                                        >
                                            Leaderboard
                                        </MobileNavItem>
                                    </>
                                )}

                                <div
                                    className={`
                                        my-2
                                        border-t
                                        ${
                                            darkMode
                                                ? "border-white/10"
                                                : "border-slate-200"
                                        }
                                    `}
                                />

                                <MobileNavItem
                                    to={profilePath}
                                    onClick={
                                        closeMenus
                                    }
                                    darkMode={
                                        darkMode
                                    }
                                >
                                    Profile
                                </MobileNavItem>

                                <MobileNavItem
                                    to={analyticsPath}
                                    onClick={
                                        closeMenus
                                    }
                                    darkMode={
                                        darkMode
                                    }
                                >
                                    Analytics
                                </MobileNavItem>

                                <button
                                    type="button"
                                    onClick={
                                        handleLogout
                                    }
                                    className={`
                                        w-full
                                        rounded-lg
                                        px-3
                                        py-3
                                        text-left
                                        text-sm
                                        font-medium
                                        text-red-500
                                        transition
                                        ${
                                            darkMode
                                                ? "hover:bg-red-500/10"
                                                : "hover:bg-red-50"
                                        }
                                    `}
                                >
                                    Logout
                                </button>

                                <button
                                    type="button"
                                    onClick={
                                        handleOpenDelete
                                    }
                                    className={`
                                        w-full
                                        rounded-lg
                                        px-3
                                        py-3
                                        text-left
                                        text-sm
                                        font-medium
                                        text-red-500
                                        transition
                                        ${
                                            darkMode
                                                ? "hover:bg-red-500/10"
                                                : "hover:bg-red-50"
                                        }
                                    `}
                                >
                                    Delete Account
                                </button>

                            </div>

                        </div>
                    )}

                </nav>

            </div>

            {/* ================================================= */}
            {/* DELETE ACCOUNT MODAL */}
            {/* ================================================= */}

            {deleteOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 px-4 backdrop-blur-sm">

                    <div
                        className={`
                            w-full
                            max-w-md
                            rounded-2xl
                            p-5
                            shadow-2xl
                            transition-colors
                            duration-300
                            sm:p-6
                            ${
                                darkMode
                                    ? "bg-[#151515] ring-1 ring-white/10"
                                    : "bg-white"
                            }
                        `}
                    >

                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-100 text-xl">
                            ⚠️
                        </div>

                        <h2
                            className={`
                                mt-5
                                text-xl
                                font-bold
                                ${
                                    darkMode
                                        ? "text-white"
                                        : "text-slate-900"
                                }
                            `}
                        >
                            Delete Account?
                        </h2>

                        <p
                            className={`
                                mt-2
                                text-sm
                                leading-6
                                ${
                                    darkMode
                                        ? "text-slate-400"
                                        : "text-slate-500"
                                }
                            `}
                        >
                            This action is permanent.
                            Your account and associated
                            data will be permanently
                            deleted from the system.
                        </p>

                        <div className="mt-5">

                            <label
                                className={`
                                    mb-2
                                    block
                                    text-sm
                                    font-semibold
                                    ${
                                        darkMode
                                            ? "text-slate-300"
                                            : "text-slate-700"
                                    }
                                `}
                            >
                                Enter your password
                            </label>

                            <input
                                type="password"
                                value={
                                    password
                                }
                                onChange={(
                                    e
                                ) => {
                                    setPassword(
                                        e.target
                                            .value
                                    );
                                    setDeleteError(
                                        ""
                                    );
                                }}
                                placeholder="Enter your password"
                                autoFocus
                                disabled={
                                    deleting
                                }
                                className={`
                                    w-full
                                    rounded-lg
                                    border
                                    px-4
                                    py-3
                                    text-sm
                                    outline-none
                                    transition
                                    placeholder:text-slate-500
                                    focus:border-black
                                    focus:ring-2
                                    focus:ring-slate-300
                                    disabled:opacity-50
                                    ${
                                        darkMode
                                            ? "border-white/10 bg-[#0f0f0f] text-white"
                                            : "border-slate-300 bg-white text-slate-900"
                                    }
                                `}
                            />

                        </div>

                        {deleteError && (
                            <div className="mt-4 rounded-lg border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-500">
                                {
                                    deleteError
                                }
                            </div>
                        )}

                        <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row">

                            <button
                                type="button"
                                disabled={
                                    deleting
                                }
                                onClick={
                                    handleCloseDelete
                                }
                                className={`
                                    flex-1
                                    rounded-lg
                                    border
                                    px-4
                                    py-3
                                    text-sm
                                    font-semibold
                                    transition
                                    disabled:cursor-not-allowed
                                    disabled:opacity-50
                                    ${
                                        darkMode
                                            ? "border-white/10 bg-white/5 text-white hover:bg-white/10"
                                            : "border-slate-300 bg-white text-slate-700 hover:bg-slate-50"
                                    }
                                `}
                            >
                                Cancel
                            </button>

                            <button
                                type="button"
                                disabled={
                                    deleting ||
                                    !password
                                }
                                onClick={
                                    handleDeleteAccount
                                }
                                className="
                                    flex-1
                                    rounded-lg
                                    bg-red-600
                                    px-4
                                    py-3
                                    text-sm
                                    font-semibold
                                    text-white
                                    transition
                                    hover:bg-red-700
                                    disabled:cursor-not-allowed
                                    disabled:opacity-50
                                "
                            >
                                {deleting
                                    ? "Deleting..."
                                    : "Delete Permanently"}
                            </button>

                        </div>

                    </div>

                </div>
            )}

        </>
    );
}

/* ========================================================= */
/* DESKTOP NAV ITEM */
/* ========================================================= */

function NavItem({
    to,
    active,
    onClick,
    children,
    darkMode,
}) {
    return (
        <Link
            to={to}
            onClick={onClick}
            className={`
                relative
                rounded-full
                px-4
                py-2.5
                text-sm
                font-semibold
                transition-all
                duration-200
                ${
                    active
                        ? "bg-black text-white"
                        : darkMode
                        ? "text-slate-400 hover:bg-white/10 hover:text-white"
                        : "text-slate-500 hover:bg-slate-100 hover:text-black"
                }
            `}
        >
            {children}
        </Link>
    );
}

/* ========================================================= */
/* MOBILE NAV ITEM */
/* ========================================================= */

function MobileNavItem({
    to,
    active,
    onClick,
    children,
    darkMode,
}) {
    return (
        <Link
            to={to}
            onClick={onClick}
            className={`
                block
                rounded-lg
                px-3
                py-3
                text-sm
                font-semibold
                transition
                ${
                    active
                        ? "bg-black text-white"
                        : darkMode
                        ? "text-slate-400 hover:bg-white/10 hover:text-white"
                        : "text-slate-600 hover:bg-white hover:text-black"
                }
            `}
        >
            {children}
        </Link>
    );
}

/* ========================================================= */
/* PROFILE DROPDOWN */
/* ========================================================= */

function ProfileMenu({
    user,
    profilePath,
    analyticsPath,
    setOpen,
    handleLogout,
    handleOpenDelete,
    darkMode,
}) {
    return (
        <div
            className={`
                absolute
                right-0
                top-12
                z-50
                w-64
                max-w-[calc(100vw-2rem)]
                overflow-hidden
                rounded-2xl
                shadow-[0_15px_40px_rgba(15,23,42,0.15)]
                transition-colors
                duration-300
                ${
                    darkMode
                        ? "bg-[#151515] shadow-black/50 ring-1 ring-white/10"
                        : "bg-white ring-1 ring-slate-200"
                }
            `}
        >

            <div
                className={`
                    border-b
                    px-4
                    py-4
                    ${
                        darkMode
                            ? "border-white/10"
                            : "border-slate-100"
                    }
                `}
            >

                <div className="flex items-center gap-3">

                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-black text-sm font-bold text-white">
                        {user?.full_name
                            ?.charAt(0)
                            ?.toUpperCase() ||
                            "U"}
                    </div>

                    <div className="min-w-0">

                        <p
                            className={`
                                truncate
                                font-semibold
                                ${
                                    darkMode
                                        ? "text-white"
                                        : "text-slate-900"
                                }
                            `}
                        >
                            {user?.full_name ||
                                "User"}
                        </p>

                        <p
                            className={`
                                truncate
                                text-xs
                                ${
                                    darkMode
                                        ? "text-slate-500"
                                        : "text-slate-500"
                                }
                            `}
                        >
                            {user?.email ||
                                ""}
                        </p>

                    </div>

                </div>

                <span
                    className={`
                        mt-3
                        inline-flex
                        rounded-full
                        px-2.5
                        py-1
                        text-xs
                        font-semibold
                        capitalize
                        ${
                            darkMode
                                ? "bg-white/10 text-slate-300"
                                : "bg-slate-100 text-slate-600"
                        }
                    `}
                >
                    {user?.role ||
                        "student"}
                </span>

            </div>

            <div className="p-2">

                <Link
                    to={profilePath}
                    onClick={() =>
                        setOpen(false)
                    }
                    className={`
                        flex
                        items-center
                        gap-3
                        rounded-lg
                        px-3
                        py-2.5
                        text-sm
                        font-medium
                        transition
                        ${
                            darkMode
                                ? "text-slate-300 hover:bg-white/10 hover:text-white"
                                : "text-slate-700 hover:bg-slate-100 hover:text-black"
                        }
                    `}
                >
                    Profile
                </Link>

                <Link
                    to={analyticsPath}
                    onClick={() =>
                        setOpen(false)
                    }
                    className={`
                        flex
                        items-center
                        gap-3
                        rounded-lg
                        px-3
                        py-2.5
                        text-sm
                        font-medium
                        transition
                        ${
                            darkMode
                                ? "text-slate-300 hover:bg-white/10 hover:text-white"
                                : "text-slate-700 hover:bg-slate-100 hover:text-black"
                        }
                    `}
                >
                    Analytics
                </Link>

                <div
                    className={`
                        my-2
                        border-t
                        ${
                            darkMode
                                ? "border-white/10"
                                : "border-slate-100"
                        }
                    `}
                />

                <button
                    type="button"
                    onClick={
                        handleLogout
                    }
                    className={`
                        flex
                        w-full
                        items-center
                        gap-3
                        rounded-lg
                        px-3
                        py-2.5
                        text-left
                        text-sm
                        font-medium
                        text-red-500
                        transition
                        ${
                            darkMode
                                ? "hover:bg-red-500/10"
                                : "hover:bg-red-50"
                        }
                    `}
                >
                    Logout
                </button>

                <button
                    type="button"
                    onClick={
                        handleOpenDelete
                    }
                    className={`
                        flex
                        w-full
                        items-center
                        gap-3
                        rounded-lg
                        px-3
                        py-2.5
                        text-left
                        text-sm
                        font-medium
                        text-red-500
                        transition
                        ${
                            darkMode
                                ? "hover:bg-red-500/10"
                                : "hover:bg-red-50"
                        }
                    `}
                >
                    Delete Account
                </button>

            </div>

        </div>
    );
}

export default Navbar;