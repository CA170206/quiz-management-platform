import { Link, useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";

function Navbar() {
    const location = useLocation();
    const navigate = useNavigate();

    const [open, setOpen] = useState(false);

    // Delete account states
    const [deleteOpen, setDeleteOpen] = useState(false);
    const [password, setPassword] = useState("");
    const [deleteError, setDeleteError] = useState("");
    const [deleting, setDeleting] = useState(false);

    const user = JSON.parse(
        sessionStorage.getItem("user") || "null"
    );

    const isAdmin = user?.role === "admin";

    // ==========================================
    // LOGOUT
    // ==========================================

    const handleLogout = () => {
        setOpen(false);

        sessionStorage.removeItem("token");
        sessionStorage.removeItem("user");

        navigate("/login");
    };


    // ==========================================
    // PATHS
    // ==========================================

    const profilePath = isAdmin
        ? "/admin/profile"
        : "/student/profile";

    const analyticsPath = isAdmin
        ? "/admin/analytics"
        : "/student/analytics";


    // ==========================================
    // OPEN DELETE POPUP
    // ==========================================

    const handleOpenDelete = () => {
        setOpen(false);

        setPassword("");
        setDeleteError("");
        setDeleteOpen(true);
    };


    // ==========================================
    // CLOSE DELETE POPUP
    // ==========================================

    const handleCloseDelete = () => {
        if (deleting) return;

        setDeleteOpen(false);
        setPassword("");
        setDeleteError("");
    };


    // ==========================================
    // DELETE ACCOUNT
    // ==========================================

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

            const token = localStorage.getItem("token");

            if (!token) {
                throw new Error(
                    "You are not logged in."
                );
            }

            const response = await fetch(
                "http://localhost:5000/api/users/profile",
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

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message ||
                        "Failed to delete account"
                );
            }

            // Clear authentication
            localStorage.removeItem("token");
            localStorage.removeItem("user");

            // Close popup
            setDeleteOpen(false);

            setPassword("");

            // Send user to login
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


    return (
        <>
            {/* ================================= */}
            {/* NAVBAR */}
            {/* ================================= */}

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

                        {/* ================================= */}
                        {/* ADMIN NAVIGATION */}
                        {/* ================================= */}

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

                            /* ================================= */
                            /* STUDENT NAVIGATION */
                            /* ================================= */

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


                        {/* ================================= */}
                        {/* PROFILE DROPDOWN */}
                        {/* ================================= */}

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
                                    ?.toUpperCase() ||
                                    "U"}
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
                                            to={
                                                analyticsPath
                                            }
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


                                        {/* Delete Account */}

                                        <button
                                            type="button"
                                            onClick={
                                                handleOpenDelete
                                            }
                                            className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm font-medium text-red-600 transition hover:bg-red-50"
                                        >
                                            <span>
                                                🗑️
                                            </span>

                                            <span>
                                                Delete Account
                                            </span>
                                        </button>

                                    </div>

                                </div>
                            )}

                        </div>

                    </div>

                </div>

            </nav>


            {/* ========================================= */}
            {/* DELETE ACCOUNT MODAL */}
            {/* ========================================= */}

            {deleteOpen && (

                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 px-4">

                    <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">

                        {/* Warning Icon */}

                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-100 text-xl">
                            ⚠️
                        </div>


                        {/* Title */}

                        <h2 className="mt-5 text-xl font-bold text-slate-900">
                            Delete Account?
                        </h2>


                        {/* Description */}

                        <p className="mt-2 text-sm leading-6 text-slate-500">
                            This action is permanent.
                            Your account and associated
                            data will be permanently
                            deleted from the system.
                        </p>


                        {/* Password */}

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
                                className="w-full rounded-lg border border-slate-300 px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-red-500 focus:ring-2 focus:ring-red-100 disabled:bg-slate-50"
                            />

                        </div>


                        {/* Error */}

                        {deleteError && (

                            <div className="mt-4 rounded-lg border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-600">
                                {deleteError}
                            </div>

                        )}


                        {/* Buttons */}

                        <div className="mt-6 flex gap-3">

                            <button
                                type="button"
                                disabled={deleting}
                                onClick={
                                    handleCloseDelete
                                }
                                className="flex-1 rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
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
                                className="flex-1 rounded-lg bg-red-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
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

export default Navbar;