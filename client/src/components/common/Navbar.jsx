import { Link, useLocation, useNavigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { useTheme } from "../../context/ThemeContext";

function Navbar() {
    const navigate = useNavigate();
    const location = useLocation();

    const { darkMode, toggleTheme } = useTheme();

    const [open, setOpen] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);

    const [deleteOpen, setDeleteOpen] = useState(false);
    const [password, setPassword] = useState("");
    const [deleteError, setDeleteError] = useState("");
    const [deleting, setDeleting] = useState(false);

    // =========================================================
    // ACTIVE NAV ANIMATION
    // =========================================================

    const navRef = useRef(null);
    const itemRefs = useRef({});

    const [indicator, setIndicator] = useState({
        left: 0,
        width: 0,
        visible: false,
    });

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
    // NAVIGATION ITEMS
    // =========================================================

    const navItems = isAdmin
        ? [
              {
                  label: "Dashboard",
                  path: "/admin/dashboard",
              },
              {
                  label: "Categories",
                  path: "/admin/categories",
              },
              {
                  label: "Questions",
                  path: "/admin/questions",
              },
              {
                  label: "Quizzes",
                  path: "/admin/quizzes",
              },
          ]
        : [
              {
                  label: "Dashboard",
                  path: "/student/dashboard",
              },
              {
                  label: "Quizzes",
                  path: "/student/quizzes",
              },
              {
                  label: "Leaderboard",
                  path: "/student/leaderboard",
              },
          ];

    // =========================================================
    // ACTIVE ROUTE
    // =========================================================

    const isActive = (path) => {
        return location.pathname === path;
    };

    const activeItem =
        navItems.findIndex((item) =>
            isActive(item.path)
        );

    // =========================================================
    // UPDATE SPOTLIGHT POSITION
    // =========================================================

    const updateIndicator = () => {
        if (!navRef.current || activeItem < 0) {
            setIndicator((current) => ({
                ...current,
                visible: false,
            }));

            return;
        }

        const activeElement =
            itemRefs.current[activeItem];

        if (!activeElement) return;

        const navRect =
            navRef.current.getBoundingClientRect();

        const itemRect =
            activeElement.getBoundingClientRect();

        setIndicator({
            left:
                itemRect.left -
                navRect.left,
            width: itemRect.width,
            visible: true,
        });
    };

    useEffect(() => {
        const timer = setTimeout(() => {
            updateIndicator();
        }, 20);

        return () => clearTimeout(timer);
    }, [
        activeItem,
        isAdmin,
        location.pathname,
    ]);

    useEffect(() => {
        window.addEventListener(
            "resize",
            updateIndicator
        );

        return () => {
            window.removeEventListener(
                "resize",
                updateIndicator
            );
        };
    }, [activeItem]);

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
    // UI
    // =========================================================

    return (
        <>
            {/* ================================================= */}
            {/* FLOATING ALMOND NAVBAR */}
            {/* ================================================= */}

            <div className="fixed left-0 right-0 top-0 z-50 px-2 pt-2 sm:px-4 sm:pt-3">

                <nav
                    className="
                        mx-auto
                        max-w-7xl
                        overflow-visible
                        rounded-[2rem]
                        bg-[#f5f2ec]
                        shadow-[0_12px_35px_rgba(0,0,0,0.08)]
                    "
                >

                    {/* ================================================= */}
                    {/* DESKTOP NAV */}
                    {/* ================================================= */}

                    <div className="hidden min-h-[72px] items-center px-5 sm:px-7 md:flex lg:px-9">

                        {/* ================================================= */}
                        {/* LOGO */}
                        {/* ================================================= */}

                        <Link
                            to={homePath}
                            onClick={closeMenus}
                            className="
                                shrink-0
                                text-[22px]
                                font-extrabold
                                tracking-[-0.04em]
                                text-[#080808]
                                transition-opacity
                                hover:opacity-70
                                lg:text-[24px]
                            "
                        >
                            TryQuizzers
                        </Link>

                        {/* ================================================= */}
                        {/* CENTER NAV */}
                        {/* ================================================= */}

                        <div className="mx-auto flex items-center">

                            <div
                                ref={navRef}
                                className="
                                    relative
                                    flex
                                    items-center
                                    gap-1
                                    rounded-full
                                "
                            >

                                {/* ========================================= */}
                                {/* SLIDING WHITE SPOTLIGHT */}
                                {/* ========================================= */}

                                <div
                                    className="
                                        pointer-events-none
                                        absolute
                                        top-0
                                        z-0
                                        h-full
                                        rounded-full
                                        bg-white
                                        shadow-[0_2px_5px_rgba(0,0,0,0.10)]
                                        transition-all
                                        duration-500
                                        ease-[cubic-bezier(0.22,1,0.36,1)]
                                    "
                                    style={{
                                        left: indicator.left,
                                        width: indicator.width,
                                        opacity:
                                            indicator.visible
                                                ? 1
                                                : 0,
                                    }}
                                />

                                {navItems.map(
                                    (
                                        item,
                                        index
                                    ) => (
                                        <Link
                                            key={
                                                item.path
                                            }
                                            ref={(
                                                element
                                            ) => {
                                                itemRefs.current[
                                                    index
                                                ] =
                                                    element;
                                            }}
                                            to={
                                                item.path
                                            }
                                            onClick={
                                                closeMenus
                                            }
                                            className="
                                                relative
                                                z-10
                                                rounded-full
                                                px-5
                                                py-3
                                                text-sm
                                                font-medium
                                                text-[#63718a]
                                                transition-colors
                                                duration-300
                                                hover:text-[#111111]
                                                lg:px-6
                                            "
                                        >
                                            {item.label}
                                        </Link>
                                    )
                                )}

                            </div>

                        </div>

                        {/* ================================================= */}
                        {/* RIGHT SIDE */}
                        {/* ================================================= */}

                        <div className="ml-auto flex shrink-0 items-center gap-2 lg:gap-3">

                            {/* Theme */}

                            <button
                                type="button"
                                onClick={toggleTheme}
                                title={
                                    darkMode
                                        ? "Light mode"
                                        : "Dark mode"
                                }
                                aria-label={
                                    darkMode
                                        ? "Switch to light mode"
                                        : "Switch to dark mode"
                                }
                                className="
                                    flex
                                    h-11
                                    w-11
                                    items-center
                                    justify-center
                                    rounded-full
                                    bg-white/70
                                    text-[17px]
                                    text-[#344054]
                                    transition-all
                                    duration-300
                                    hover:scale-105
                                    hover:bg-white
                                "
                            >
                                {darkMode
                                    ? "☀"
                                    : "☾"}
                            </button>

                            {/* Sign In / Profile */}

                            <div className="relative">

                                <button
                                    type="button"
                                    onClick={() =>
                                        setOpen(
                                            !open
                                        )
                                    }
                                    className="
                                        flex
                                        items-center
                                        gap-2
                                        rounded-full
                                        px-4
                                        py-2.5
                                        text-sm
                                        font-semibold
                                        text-[#63718a]
                                        transition
                                        hover:text-[#111111]
                                    "
                                >
                                    <span className="hidden lg:inline">
                                        {user?.full_name ||
                                            "Profile"}
                                    </span>

                                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-xs font-bold text-black lg:hidden">
                                        {user?.full_name
                                            ?.charAt(
                                                0
                                            )
                                            ?.toUpperCase() ||
                                            "U"}
                                    </span>
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
                                    />
                                )}

                            </div>

                            {/* Start Quiz */}

                            <Link
                                to="/student/quizzes"
                                onClick={
                                    closeMenus
                                }
                                className="
                                    flex
                                    items-center
                                    gap-2
                                    rounded-full
                                    bg-black
                                    px-5
                                    py-3
                                    text-sm
                                    font-semibold
                                    text-white
                                    shadow-sm
                                    transition-all
                                    duration-300
                                    hover:-translate-y-0.5
                                    hover:bg-[#202020]
                                    hover:shadow-md
                                "
                            >
                                <span className="flex h-2 w-2 rounded-full bg-white" />
                                Start a Quiz
                            </Link>

                        </div>

                    </div>

                    {/* ================================================= */}
                    {/* MOBILE NAV */}
                    {/* ================================================= */}

                    <div className="flex min-h-[62px] items-center justify-between px-4 md:hidden">

                        <Link
                            to={homePath}
                            onClick={closeMenus}
                            className="
                                text-xl
                                font-extrabold
                                tracking-[-0.04em]
                                text-[#080808]
                            "
                        >
                            TryQuizzers
                        </Link>

                        <div className="flex items-center gap-2">

                            {/* Theme */}

                            <button
                                type="button"
                                onClick={toggleTheme}
                                className="
                                    flex
                                    h-10
                                    w-10
                                    items-center
                                    justify-center
                                    rounded-full
                                    bg-white/70
                                    text-[#344054]
                                    transition
                                    hover:bg-white
                                "
                            >
                                {darkMode
                                    ? "☀"
                                    : "☾"}
                            </button>

                            {/* Menu */}

                            <button
                                type="button"
                                onClick={() =>
                                    setMobileOpen(
                                        !mobileOpen
                                    )
                                }
                                className="
                                    flex
                                    h-10
                                    w-10
                                    items-center
                                    justify-center
                                    rounded-full
                                    bg-black
                                    text-white
                                    transition
                                    hover:bg-[#202020]
                                "
                                aria-label="Toggle navigation"
                            >
                                {mobileOpen
                                    ? "✕"
                                    : "☰"}
                            </button>

                        </div>

                    </div>

                    {/* ================================================= */}
                    {/* MOBILE MENU */}
                    {/* ================================================= */}

                    {mobileOpen && (
                        <div
                            className="
                                border-t
                                border-black/5
                                px-3
                                pb-3
                                pt-2
                                md:hidden
                            "
                        >

                            <div className="rounded-2xl bg-white/60 p-2">

                                {navItems.map(
                                    (item) => (
                                        <Link
                                            key={
                                                item.path
                                            }
                                            to={
                                                item.path
                                            }
                                            onClick={
                                                closeMenus
                                            }
                                            className={`
                                                block
                                                rounded-xl
                                                px-4
                                                py-3
                                                text-sm
                                                font-semibold
                                                transition
                                                ${
                                                    isActive(
                                                        item.path
                                                    )
                                                        ? "bg-white text-black shadow-sm"
                                                        : "text-[#63718a] hover:bg-white/70 hover:text-black"
                                                }
                                            `}
                                        >
                                            {
                                                item.label
                                            }
                                        </Link>
                                    )
                                )}

                                <div className="my-2 border-t border-black/5" />

                                <Link
                                    to={
                                        profilePath
                                    }
                                    onClick={
                                        closeMenus
                                    }
                                    className="
                                        block
                                        rounded-xl
                                        px-4
                                        py-3
                                        text-sm
                                        font-semibold
                                        text-[#63718a]
                                        transition
                                        hover:bg-white
                                        hover:text-black
                                    "
                                >
                                    Profile
                                </Link>

                                <Link
                                    to={
                                        analyticsPath
                                    }
                                    onClick={
                                        closeMenus
                                    }
                                    className="
                                        block
                                        rounded-xl
                                        px-4
                                        py-3
                                        text-sm
                                        font-semibold
                                        text-[#63718a]
                                        transition
                                        hover:bg-white
                                        hover:text-black
                                    "
                                >
                                    Analytics
                                </Link>

                                <Link
                                    to="/student/quizzes"
                                    onClick={
                                        closeMenus
                                    }
                                    className="
                                        mt-1
                                        flex
                                        items-center
                                        justify-center
                                        gap-2
                                        rounded-xl
                                        bg-black
                                        px-4
                                        py-3
                                        text-sm
                                        font-semibold
                                        text-white
                                    "
                                >
                                    <span className="h-2 w-2 rounded-full bg-white" />
                                    Start a Quiz
                                </Link>

                                <button
                                    type="button"
                                    onClick={
                                        handleLogout
                                    }
                                    className="
                                        mt-1
                                        w-full
                                        rounded-xl
                                        px-4
                                        py-3
                                        text-left
                                        text-sm
                                        font-semibold
                                        text-red-500
                                        transition
                                        hover:bg-red-50
                                    "
                                >
                                    Logout
                                </button>

                                <button
                                    type="button"
                                    onClick={
                                        handleOpenDelete
                                    }
                                    className="
                                        w-full
                                        rounded-xl
                                        px-4
                                        py-3
                                        text-left
                                        text-sm
                                        font-semibold
                                        text-red-500
                                        transition
                                        hover:bg-red-50
                                    "
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
                        className="
                            w-full
                            max-w-md
                            rounded-3xl
                            bg-white
                            p-5
                            shadow-2xl
                            sm:p-6
                        "
                    >

                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-100 text-xl">
                            ⚠️
                        </div>

                        <h2 className="mt-5 text-xl font-bold text-slate-900">
                            Delete Account?
                        </h2>

                        <p className="mt-2 text-sm leading-6 text-slate-500">
                            This action is permanent.
                            Your account and associated
                            data will be permanently
                            deleted from the system.
                        </p>

                        <div className="mt-5">

                            <label className="mb-2 block text-sm font-semibold text-slate-700">
                                Enter your password
                            </label>

                            <input
                                type="password"
                                value={password}
                                onChange={(e) => {
                                    setPassword(
                                        e.target.value
                                    );
                                    setDeleteError("");
                                }}
                                placeholder="Enter your password"
                                autoFocus
                                disabled={deleting}
                                className="
                                    w-full
                                    rounded-xl
                                    border
                                    border-slate-300
                                    bg-white
                                    px-4
                                    py-3
                                    text-sm
                                    text-slate-900
                                    outline-none
                                    transition
                                    placeholder:text-slate-400
                                    focus:border-black
                                    focus:ring-2
                                    focus:ring-slate-200
                                    disabled:opacity-50
                                "
                            />

                        </div>

                        {deleteError && (
                            <div className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                                {deleteError}
                            </div>
                        )}

                        <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row">

                            <button
                                type="button"
                                disabled={deleting}
                                onClick={
                                    handleCloseDelete
                                }
                                className="
                                    flex-1
                                    rounded-xl
                                    border
                                    border-slate-300
                                    bg-white
                                    px-4
                                    py-3
                                    text-sm
                                    font-semibold
                                    text-slate-700
                                    transition
                                    hover:bg-slate-50
                                    disabled:cursor-not-allowed
                                    disabled:opacity-50
                                "
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
                                    rounded-xl
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
/* PROFILE DROPDOWN */
/* ========================================================= */

function ProfileMenu({
    user,
    profilePath,
    analyticsPath,
    setOpen,
    handleLogout,
    handleOpenDelete,
}) {
    return (
        <div
            className="
                absolute
                right-0
                top-14
                z-50
                w-64
                max-w-[calc(100vw-2rem)]
                overflow-hidden
                rounded-2xl
                bg-white
                shadow-[0_15px_40px_rgba(15,23,42,0.15)]
                ring-1
                ring-black/5
            "
        >

            <div className="border-b border-slate-100 px-4 py-4">

                <div className="flex items-center gap-3">

                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-black text-sm font-bold text-white">
                        {user?.full_name
                            ?.charAt(0)
                            ?.toUpperCase() ||
                            "U"}
                    </div>

                    <div className="min-w-0">

                        <p className="truncate font-semibold text-slate-900">
                            {user?.full_name ||
                                "User"}
                        </p>

                        <p className="truncate text-xs text-slate-500">
                            {user?.email || ""}
                        </p>

                    </div>

                </div>

                <span className="mt-3 inline-flex rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold capitalize text-slate-600">
                    {user?.role || "student"}
                </span>

            </div>

            <div className="p-2">

                <Link
                    to={profilePath}
                    onClick={() =>
                        setOpen(false)
                    }
                    className="
                        flex
                        items-center
                        rounded-xl
                        px-3
                        py-2.5
                        text-sm
                        font-medium
                        text-slate-700
                        transition
                        hover:bg-slate-100
                        hover:text-black
                    "
                >
                    Profile
                </Link>

                <Link
                    to={analyticsPath}
                    onClick={() =>
                        setOpen(false)
                    }
                    className="
                        flex
                        items-center
                        rounded-xl
                        px-3
                        py-2.5
                        text-sm
                        font-medium
                        text-slate-700
                        transition
                        hover:bg-slate-100
                        hover:text-black
                    "
                >
                    Analytics
                </Link>

                <div className="my-2 border-t border-slate-100" />

                <button
                    type="button"
                    onClick={handleLogout}
                    className="
                        flex
                        w-full
                        rounded-xl
                        px-3
                        py-2.5
                        text-left
                        text-sm
                        font-medium
                        text-red-500
                        transition
                        hover:bg-red-50
                    "
                >
                    Logout
                </button>

                <button
                    type="button"
                    onClick={handleOpenDelete}
                    className="
                        flex
                        w-full
                        rounded-xl
                        px-3
                        py-2.5
                        text-left
                        text-sm
                        font-medium
                        text-red-500
                        transition
                        hover:bg-red-50
                    "
                >
                    Delete Account
                </button>

            </div>

        </div>
    );
}

export default Navbar;