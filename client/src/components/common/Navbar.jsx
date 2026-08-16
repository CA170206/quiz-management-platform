import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";

function Navbar() {
    const navigate = useNavigate();

    const [open, setOpen] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);

    const [deleteOpen, setDeleteOpen] = useState(false);
    const [password, setPassword] = useState("");
    const [deleteError, setDeleteError] = useState("");
    const [deleting, setDeleting] = useState(false);

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

    const closeMenus = () => {
        setOpen(false);
        setMobileOpen(false);
    };

    const handleLogout = () => {
        closeMenus();

        localStorage.removeItem("token");
        localStorage.removeItem("user");

        sessionStorage.removeItem("token");
        sessionStorage.removeItem("user");

        navigate("/login");
    };

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
            setDeleteError("Please enter your password.");
            return;
        }

        try {
            setDeleting(true);
            setDeleteError("");

            const token =
                localStorage.getItem("token") ||
                sessionStorage.getItem("token");

            if (!token) {
                throw new Error("You are not logged in.");
            }

            const response = await fetch(
                `${import.meta.env.VITE_API_URL}/api/users/profile`,
                {
                    method: "DELETE",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({
                        password,
                    }),
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message || "Failed to delete account"
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
                error.message || "Failed to delete account"
            );
        } finally {
            setDeleting(false);
        }
    };

    return (
        <>
            <nav className="bg-slate-900 text-white shadow-lg">

                <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">

                    {/* LOGO */}

                    <Link
                        to={
                            isAdmin
                                ? "/admin/dashboard"
                                : "/student/dashboard"
                        }
                        onClick={closeMenus}
                        className="shrink-0 text-xl font-bold"
                    >
                        Try
                        <span className="text-blue-400">
                            Quizzers
                        </span>
                    </Link>


                    {/* DESKTOP NAVIGATION */}

                    <div className="hidden items-center gap-6 text-sm font-medium md:flex">

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

                        {/* PROFILE */}

                        <div className="relative">

                            <button
                                type="button"
                                onClick={() => setOpen(!open)}
                                className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-600 font-bold transition hover:bg-blue-500"
                            >
                                {user?.full_name
                                    ?.charAt(0)
                                    ?.toUpperCase() || "U"}
                            </button>

                            {open && (
                                <ProfileMenu
                                    user={user}
                                    profilePath={profilePath}
                                    analyticsPath={analyticsPath}
                                    setOpen={setOpen}
                                    handleLogout={handleLogout}
                                    handleOpenDelete={handleOpenDelete}
                                />
                            )}

                        </div>

                    </div>


                    {/* MOBILE MENU BUTTON */}

                    <button
                        type="button"
                        onClick={() => setMobileOpen(!mobileOpen)}
                        className="flex h-10 w-10 items-center justify-center rounded-lg text-2xl text-white hover:bg-slate-800 md:hidden"
                        aria-label="Toggle navigation menu"
                    >
                        {mobileOpen ? "✕" : "☰"}
                    </button>

                </div>


                {/* MOBILE NAVIGATION */}

                {mobileOpen && (
                    <div className="border-t border-slate-700 px-4 pb-4 pt-3 md:hidden">

                        <div className="flex flex-col gap-1">

                            {isAdmin ? (
                                <>
                                    <MobileLink
                                        to="/admin/dashboard"
                                        onClick={closeMenus}
                                    >
                                        Dashboard
                                    </MobileLink>

                                    <MobileLink
                                        to="/admin/categories"
                                        onClick={closeMenus}
                                    >
                                        Categories
                                    </MobileLink>

                                    <MobileLink
                                        to="/admin/questions"
                                        onClick={closeMenus}
                                    >
                                        Questions
                                    </MobileLink>

                                    <MobileLink
                                        to="/admin/quizzes"
                                        onClick={closeMenus}
                                    >
                                        Quizzes
                                    </MobileLink>
                                </>
                            ) : (
                                <>
                                    <MobileLink
                                        to="/student/dashboard"
                                        onClick={closeMenus}
                                    >
                                        Dashboard
                                    </MobileLink>

                                    <MobileLink
                                        to="/student/quizzes"
                                        onClick={closeMenus}
                                    >
                                        Quizzes
                                    </MobileLink>

                                    <MobileLink
                                        to="/student/leaderboard"
                                        onClick={closeMenus}
                                    >
                                        Leaderboard
                                    </MobileLink>
                                </>
                            )}

                            <div className="my-2 border-t border-slate-700" />

                            <MobileLink
                                to={profilePath}
                                onClick={closeMenus}
                            >
                                👤 Profile
                            </MobileLink>

                            <MobileLink
                                to={analyticsPath}
                                onClick={closeMenus}
                            >
                                📊 Analytics
                            </MobileLink>

                            <button
                                type="button"
                                onClick={handleLogout}
                                className="w-full rounded-lg px-3 py-3 text-left text-sm font-medium text-red-400 hover:bg-slate-800"
                            >
                                🚪 Logout
                            </button>

                            <button
                                type="button"
                                onClick={handleOpenDelete}
                                className="w-full rounded-lg px-3 py-3 text-left text-sm font-medium text-red-400 hover:bg-slate-800"
                            >
                                🗑️ Delete Account
                            </button>

                        </div>

                    </div>
                )}

            </nav>


            {/* DELETE ACCOUNT MODAL */}

            {deleteOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 px-4">

                    <div className="w-full max-w-md rounded-2xl bg-white p-5 shadow-2xl sm:p-6">

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
                                    setPassword(e.target.value);
                                    setDeleteError("");
                                }}
                                placeholder="Enter your password"
                                autoFocus
                                disabled={deleting}
                                className="w-full rounded-lg border border-slate-300 px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-red-500 focus:ring-2 focus:ring-red-100 disabled:bg-slate-50"
                            />

                        </div>

                        {deleteError && (
                            <div className="mt-4 rounded-lg border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-600">
                                {deleteError}
                            </div>
                        )}

                        <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row">

                            <button
                                type="button"
                                disabled={deleting}
                                onClick={handleCloseDelete}
                                className="flex-1 rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                Cancel
                            </button>

                            <button
                                type="button"
                                disabled={deleting || !password}
                                onClick={handleDeleteAccount}
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


/* ========================================= */
/* MOBILE LINK */
/* ========================================= */

function MobileLink({ to, onClick, children }) {
    return (
        <Link
            to={to}
            onClick={onClick}
            className="rounded-lg px-3 py-3 text-sm font-medium text-slate-300 hover:bg-slate-800 hover:text-white"
        >
            {children}
        </Link>
    );
}


/* ========================================= */
/* PROFILE DROPDOWN */
/* ========================================= */

function ProfileMenu({
    user,
    profilePath,
    analyticsPath,
    setOpen,
    handleLogout,
    handleOpenDelete,
}) {
    return (
        <div className="absolute right-0 top-12 z-50 w-64 max-w-[calc(100vw-2rem)] overflow-hidden rounded-xl bg-white shadow-xl ring-1 ring-black/5">

            <div className="border-b border-slate-100 px-4 py-4">

                <p className="font-semibold text-slate-900">
                    {user?.full_name || "User"}
                </p>

                <p className="mt-1 truncate text-xs text-slate-500">
                    {user?.email || ""}
                </p>

                <span className="mt-2 inline-flex rounded-full bg-blue-50 px-2.5 py-1 text-xs font-semibold capitalize text-blue-600">
                    {user?.role || "student"}
                </span>

            </div>

            <div className="p-2">

                <Link
                    to={profilePath}
                    onClick={() => setOpen(false)}
                    className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
                >
                    👤
                    <span>Profile</span>
                </Link>

                <Link
                    to={analyticsPath}
                    onClick={() => setOpen(false)}
                    className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
                >
                    📊
                    <span>Analytics</span>
                </Link>

                <div className="my-2 border-t border-slate-100" />

                <button
                    type="button"
                    onClick={handleLogout}
                    className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm font-medium text-red-600 transition hover:bg-red-50"
                >
                    🚪
                    <span>Logout</span>
                </button>

                <button
                    type="button"
                    onClick={handleOpenDelete}
                    className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm font-medium text-red-600 transition hover:bg-red-50"
                >
                    🗑️
                    <span>Delete Account</span>
                </button>

            </div>

        </div>
    );
}

export default Navbar;