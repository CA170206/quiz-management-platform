import { Link, useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";

function Navbar() {
    const location = useLocation();
    const navigate = useNavigate();

    const [open, setOpen] = useState(false);

    const user = JSON.parse(
        localStorage.getItem("user") || "null"
    );

    const isAdmin = user?.role === "admin";

    const handleLogout = () => {
        setOpen(false);

        localStorage.removeItem("token");
        localStorage.removeItem("user");

        navigate("/login");
    };

    const profilePath = isAdmin
        ? "/admin/profile"
        : "/student/profile";

    const analyticsPath = isAdmin
        ? "/admin/analytics"
        : "/student/analytics";

    return (
        <nav className="bg-slate-900 text-white shadow-lg">
            <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">

                {/* Logo */}
                <Link
                    to={
                        isAdmin
                            ? "/admin/dashboard"
                            : "/student/dashboard"
                    }
                    className="text-xl font-bold"
                >
                    Quiz
                    <span className="text-blue-400">
                        Master
                    </span>
                </Link>

                {/* Navigation */}
                <div className="flex items-center gap-6 text-sm font-medium">

                    {isAdmin ? (
                        <>
                            <Link
                                to="/admin/dashboard"
                                className="text-slate-300 transition hover:text-white"
                            >
                                Dashboard
                            </Link>

                            <Link
                                to="/admin/categories"
                                className="text-slate-300 transition hover:text-white"
                            >
                                Categories
                            </Link>

                            <Link
                                to="/admin/questions"
                                className="text-slate-300 transition hover:text-white"
                            >
                                Questions
                            </Link>

                            <Link
                                to="/admin/quizzes"
                                className="text-slate-300 transition hover:text-white"
                            >
                                Quizzes
                            </Link>
                        </>
                    ) : (
                        <>
                            <Link
                                to="/student/dashboard"
                                className="text-slate-300 transition hover:text-white"
                            >
                                Dashboard
                            </Link>

                            <Link
                                to="/student/quizzes"
                                className="text-slate-300 transition hover:text-white"
                            >
                                Quizzes
                            </Link>

                            <Link
                                to="/student/leaderboard"
                                className="text-slate-300 transition hover:text-white"
                            >
                                Leaderboard
                            </Link>
                        </>
                    )}

                    {/* Profile Dropdown */}
                    <div className="relative">

                        <button
                            type="button"
                            onClick={() =>
                                setOpen(!open)
                            }
                            className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-600 font-bold transition hover:bg-blue-500"
                        >
                            {user?.full_name
                                ?.charAt(0)
                                ?.toUpperCase() || "U"}
                        </button>

                        {open && (
                            <div className="absolute right-0 top-12 z-50 w-64 overflow-hidden rounded-xl bg-white shadow-xl ring-1 ring-black/5">

                                {/* User Header */}
                                <div className="border-b border-slate-100 px-4 py-4">

                                    <p className="font-semibold text-slate-900">
                                        {user?.full_name ||
                                            "User"}
                                    </p>

                                    <p className="mt-1 truncate text-xs text-slate-500">
                                        {user?.email ||
                                            ""}
                                    </p>

                                    <span className="mt-2 inline-flex rounded-full bg-blue-50 px-2.5 py-1 text-xs font-semibold capitalize text-blue-600">
                                        {user?.role ||
                                            "student"}
                                    </span>

                                </div>

                                {/* Menu */}
                                <div className="p-2">

                                    {/* Profile */}
                                    <Link
                                        to={profilePath}
                                        onClick={() =>
                                            setOpen(false)
                                        }
                                        className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
                                    >
                                        <span>
                                            👤
                                        </span>

                                        <span>
                                            Profile
                                        </span>
                                    </Link>

                                    {/* Analytics */}
                                    <Link
                                        to={analyticsPath}
                                        onClick={() =>
                                            setOpen(false)
                                        }
                                        className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
                                    >
                                        <span>
                                            📊
                                        </span>

                                        <span>
                                            Analytics
                                        </span>
                                    </Link>

                                    <div className="my-2 border-t border-slate-100" />

                                    {/* Logout */}
                                    <button
                                        type="button"
                                        onClick={
                                            handleLogout
                                        }
                                        className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm font-medium text-red-600 transition hover:bg-red-50"
                                    >
                                        <span>
                                            🚪
                                        </span>

                                        <span>
                                            Logout
                                        </span>
                                    </button>

                                </div>
                            </div>
                        )}

                    </div>

                </div>
            </div>
        </nav>
    );
}

export default Navbar;