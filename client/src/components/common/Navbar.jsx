import { Link, useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";

function Navbar() {
    const navigate = useNavigate();
    const location = useLocation();

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

    const homePath = isAdmin
        ? "/admin/dashboard"
        : "/student/dashboard";

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

    const isActive = (path) => {
        return location.pathname === path;
    };

    return (
        <>
            {/* ================================================= */}
            {/* FLOATING NAVBAR */}
            {/* ================================================= */}

            <div className="fixed left-0 right-0 top-0 z-50 px-3 pt-3 sm:px-5 sm:pt-4">

                <nav className="mx-auto max-w-7xl rounded-2xl bg-white/90 shadow-[0_10px_35px_rgba(15,23,42,0.08)] backdrop-blur-xl">

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

                                <div className="text-xl font-extrabold tracking-tight text-black sm:text-[22px]">
                                    TryQuizzers
                                </div>

                                <div className="mt-0.5 hidden text-[10px] font-medium text-slate-400 sm:block">
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
                                    >
                                        Leaderboard
                                    </NavItem>
                                </>
                            )}


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
                                    className="
                                        flex
                                        h-10
                                        w-10
                                        items-center
                                        justify-center
                                        rounded-full
                                        bg-slate-100
                                        text-sm
                                        font-bold
                                        text-black
                                        transition
                                        hover:bg-black
                                        hover:text-white
                                    "
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
                                    />
                                )}

                            </div>

                        </div>


                        {/* ================================================= */}
                        {/* MOBILE BUTTON */}
                        {/* ================================================= */}

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
                                rounded-xl
                                bg-slate-100
                                text-lg
                                text-black
                                transition
                                hover:bg-black
                                hover:text-white
                                md:hidden
                            "
                            aria-label="Toggle navigation menu"
                        >
                            {mobileOpen
                                ? "✕"
                                : "☰"}
                        </button>

                    </div>


                    {/* ================================================= */}
                    {/* MOBILE NAVIGATION */}
                    {/* ================================================= */}

                    {mobileOpen && (
                        <div className="border-t border-slate-100 px-3 pb-3 pt-2 md:hidden">

                            <div className="rounded-xl bg-slate-50 p-2">

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
                                        >
                                            Leaderboard
                                        </MobileNavItem>
                                    </>
                                )}


                                <div className="my-2 border-t border-slate-200" />


                                <MobileNavItem
                                    to={profilePath}
                                    onClick={
                                        closeMenus
                                    }
                                >
                                    Profile
                                </MobileNavItem>

                                <MobileNavItem
                                    to={analyticsPath}
                                    onClick={
                                        closeMenus
                                    }
                                >
                                    Analytics
                                </MobileNavItem>


                                <button
                                    type="button"
                                    onClick={
                                        handleLogout
                                    }
                                    className="
                                        w-full
                                        rounded-lg
                                        px-3
                                        py-3
                                        text-left
                                        text-sm
                                        font-medium
                                        text-red-600
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
                                        rounded-lg
                                        px-3
                                        py-3
                                        text-left
                                        text-sm
                                        font-medium
                                        text-red-600
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
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 px-4 backdrop-blur-sm">

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
                                className="
                                    w-full
                                    rounded-lg
                                    border
                                    border-slate-300
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
                                    disabled:bg-slate-50
                                "
                            />

                        </div>


                        {deleteError && (
                            <div className="mt-4 rounded-lg border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-600">
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
                                className="
                                    flex-1
                                    rounded-lg
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
}) {
    return (
        <div className="absolute right-0 top-12 z-50 w-64 max-w-[calc(100vw-2rem)] overflow-hidden rounded-2xl bg-white shadow-[0_15px_40px_rgba(15,23,42,0.15)] ring-1 ring-slate-200">

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
                            {user?.email ||
                                ""}
                        </p>

                    </div>

                </div>


                <span className="mt-3 inline-flex rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold capitalize text-slate-600">
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
                    className="
                        flex
                        items-center
                        gap-3
                        rounded-lg
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
                        gap-3
                        rounded-lg
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
                    onClick={
                        handleLogout
                    }
                    className="
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
                        text-red-600
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
                        text-red-600
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