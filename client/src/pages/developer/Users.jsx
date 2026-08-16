import { useEffect, useMemo, useState } from "react";

const API_URL = `${import.meta.env.VITE_API_URL}/api/developer/users`;

function Users() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [search, setSearch] = useState("");
    const [roleFilter, setRoleFilter] = useState("all");

    // User details
    const [selectedUser, setSelectedUser] = useState(null);
    const [detailsLoading, setDetailsLoading] = useState(false);
    const [detailsError, setDetailsError] = useState("");

    // Delete
    const [deleteUserData, setDeleteUserData] = useState(null);
    const [deleting, setDeleting] = useState(false);
    const [deleteError, setDeleteError] = useState("");

    // Current developer
    const storedUser =
        localStorage.getItem("user") ||
        sessionStorage.getItem("user");

    const currentUser = JSON.parse(
        storedUser || "null"
    );

    // ==========================================
    // FETCH ALL USERS
    // ==========================================

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                setLoading(true);
                setError("");

                const token =
                    localStorage.getItem("token") ||
                    sessionStorage.getItem("token");

                const response = await fetch(API_URL, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                const data = await response.json();

                if (!response.ok) {
                    throw new Error(
                        data.message ||
                        "Failed to fetch users"
                    );
                }

                setUsers(data.users || []);
            } catch (err) {
                console.error(
                    "Fetch users error:",
                    err
                );

                setError(
                    err.message ||
                    "Failed to fetch users"
                );
            } finally {
                setLoading(false);
            }
        };

        fetchUsers();
    }, []);

    // ==========================================
    // VIEW USER DETAILS
    // ==========================================

    const handleViewUser = async (userId) => {
        try {
            setDetailsLoading(true);
            setDetailsError("");
            setSelectedUser(null);

            const token =
                localStorage.getItem("token") ||
                sessionStorage.getItem("token");

            const response = await fetch(
                `${API_URL}/${userId}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message ||
                    "Failed to fetch user details"
                );
            }

            setSelectedUser(data.user);
        } catch (err) {
            console.error(
                "Fetch user details error:",
                err
            );

            setDetailsError(
                err.message ||
                "Failed to fetch user details"
            );
        } finally {
            setDetailsLoading(false);
        }
    };

    // ==========================================
    // DELETE USER
    // ==========================================

    const handleDeleteUser = async () => {
        if (!deleteUserData) {
            return;
        }

        try {
            setDeleting(true);
            setDeleteError("");

            const token =
                localStorage.getItem("token") ||
                sessionStorage.getItem("token");

            const response = await fetch(
                `${API_URL}/${deleteUserData.id}`,
                {
                    method: "DELETE",
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message ||
                    "Failed to delete user"
                );
            }

            // Remove deleted user from current list
            setUsers((currentUsers) =>
                currentUsers.filter(
                    (user) =>
                        user.id !==
                        deleteUserData.id
                )
            );

            // Close delete modal
            setDeleteUserData(null);

        } catch (err) {
            console.error(
                "Delete user error:",
                err
            );

            setDeleteError(
                err.message ||
                "Failed to delete user"
            );
        } finally {
            setDeleting(false);
        }
    };

    // ==========================================
    // CLOSE DETAILS
    // ==========================================

    const closeDetails = () => {
        setSelectedUser(null);
        setDetailsError("");
    };

    // ==========================================
    // OPEN DELETE CONFIRMATION
    // ==========================================

    const openDeleteConfirmation = (user) => {
        setDeleteError("");
        setDeleteUserData(user);
    };

    // ==========================================
    // CLOSE DELETE CONFIRMATION
    // ==========================================

    const closeDeleteConfirmation = () => {
        if (!deleting) {
            setDeleteUserData(null);
            setDeleteError("");
        }
    };

    // ==========================================
    // FILTER USERS
    // ==========================================

    const filteredUsers = useMemo(() => {
        return users.filter((user) => {
            const matchesSearch =
                user.full_name
                    ?.toLowerCase()
                    .includes(
                        search.toLowerCase()
                    ) ||
                user.email
                    ?.toLowerCase()
                    .includes(
                        search.toLowerCase()
                    );

            const matchesRole =
                roleFilter === "all" ||
                user.role === roleFilter;

            return (
                matchesSearch &&
                matchesRole
            );
        });
    }, [users, search, roleFilter]);

    // ==========================================
    // ROLE COUNTS
    // ==========================================

    const totalUsers = users.length;

    const studentCount = users.filter(
        (user) => user.role === "student"
    ).length;

    const adminCount = users.filter(
        (user) => user.role === "admin"
    ).length;

    const developerCount = users.filter(
        (user) => user.role === "developer"
    ).length;

    // ==========================================
    // ROLE BADGE
    // ==========================================

    const getRoleStyle = (role) => {
        if (role === "developer") {
            return "bg-purple-50 text-purple-700";
        }

        if (role === "admin") {
            return "bg-blue-50 text-blue-700";
        }

        return "bg-slate-100 text-slate-700";
    };

    return (
        <div className="min-h-screen bg-slate-50 px-4 py-6 sm:px-6 lg:px-8">

            <div className="mx-auto max-w-7xl">

                {/* ================================= */}
                {/* HEADER */}
                {/* ================================= */}

                <div className="mb-8">

                    <p className="text-sm font-semibold text-blue-600">
                        Developer Tools
                    </p>

                    <h1 className="mt-1 text-2xl font-bold text-slate-900 sm:text-3xl">
                        User Management
                    </h1>

                    <p className="mt-2 text-sm text-slate-500">
                        View and manage accounts registered on TryQuizzers.
                    </p>

                </div>


                {/* ================================= */}
                {/* STATISTICS */}
                {/* ================================= */}

                <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">

                    <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
                        <p className="text-sm text-slate-500">
                            Total Users
                        </p>

                        <p className="mt-2 text-3xl font-bold text-slate-900">
                            {totalUsers}
                        </p>
                    </div>


                    <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
                        <p className="text-sm text-slate-500">
                            Students
                        </p>

                        <p className="mt-2 text-3xl font-bold text-slate-900">
                            {studentCount}
                        </p>
                    </div>


                    <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
                        <p className="text-sm text-slate-500">
                            Administrators
                        </p>

                        <p className="mt-2 text-3xl font-bold text-slate-900">
                            {adminCount}
                        </p>
                    </div>


                    <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
                        <p className="text-sm text-slate-500">
                            Developers
                        </p>

                        <p className="mt-2 text-3xl font-bold text-slate-900">
                            {developerCount}
                        </p>
                    </div>

                </div>


                {/* ================================= */}
                {/* MAIN CARD */}
                {/* ================================= */}

                <div className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-slate-200">

                    {/* Toolbar */}

                    <div className="border-b border-slate-200 p-5">

                        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">

                            {/* Search */}

                            <div className="relative w-full lg:max-w-md">

                                <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                                    🔎
                                </span>

                                <input
                                    type="text"
                                    value={search}
                                    onChange={(e) =>
                                        setSearch(
                                            e.target.value
                                        )
                                    }
                                    placeholder="Search by name or email..."
                                    className="w-full rounded-lg border border-slate-300 bg-white py-3 pl-11 pr-4 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                                />

                            </div>


                            {/* Role Filter */}

                            <select
                                value={roleFilter}
                                onChange={(e) =>
                                    setRoleFilter(
                                        e.target.value
                                    )
                                }
                                className="rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm text-slate-700 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                            >

                                <option value="all">
                                    All Roles
                                </option>

                                <option value="student">
                                    Students
                                </option>

                                <option value="admin">
                                    Administrators
                                </option>

                                <option value="developer">
                                    Developers
                                </option>

                            </select>

                        </div>

                    </div>


                    {/* Loading */}

                    {loading && (
                        <div className="p-10 text-center">

                            <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-blue-600" />

                            <p className="mt-4 text-sm text-slate-500">
                                Loading users...
                            </p>

                        </div>
                    )}


                    {/* Error */}

                    {!loading && error && (
                        <div className="p-6">

                            <div className="rounded-xl bg-red-50 px-5 py-4 text-sm text-red-600">
                                {error}
                            </div>

                        </div>
                    )}


                    {/* Empty */}

                    {!loading &&
                        !error &&
                        filteredUsers.length === 0 && (
                            <div className="p-10 text-center">

                                <div className="text-4xl">
                                    👥
                                </div>

                                <h2 className="mt-4 font-bold text-slate-900">
                                    No users found
                                </h2>

                                <p className="mt-1 text-sm text-slate-500">
                                    Try changing your search or filter.
                                </p>

                            </div>
                        )}


                    {/* ================================= */}
                    {/* DESKTOP TABLE */}
                    {/* ================================= */}

                    {!loading &&
                        !error &&
                        filteredUsers.length > 0 && (

                            <div className="hidden overflow-x-auto md:block">

                                <table className="w-full text-left">

                                    <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">

                                        <tr>

                                            <th className="px-6 py-4 font-semibold">
                                                User
                                            </th>

                                            <th className="px-6 py-4 font-semibold">
                                                Email
                                            </th>

                                            <th className="px-6 py-4 font-semibold">
                                                Role
                                            </th>

                                            <th className="px-6 py-4 font-semibold">
                                                User ID
                                            </th>

                                            <th className="px-6 py-4 font-semibold">
                                                Created
                                            </th>

                                            <th className="px-6 py-4 text-right font-semibold">
                                                Actions
                                            </th>

                                        </tr>

                                    </thead>


                                    <tbody className="divide-y divide-slate-100">

                                        {filteredUsers.map(
                                            (user) => {

                                                const isCurrentDeveloper =
                                                    currentUser &&
                                                    Number(
                                                        currentUser.id
                                                    ) ===
                                                        Number(
                                                            user.id
                                                        );

                                                return (
                                                    <tr
                                                        key={
                                                            user.id
                                                        }
                                                        className="transition hover:bg-slate-50"
                                                    >

                                                        {/* User */}

                                                        <td className="px-6 py-4">

                                                            <div className="flex items-center gap-3">

                                                                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-50 font-bold text-blue-600">
                                                                    {user.full_name
                                                                        ?.charAt(
                                                                            0
                                                                        )
                                                                        .toUpperCase()}
                                                                </div>

                                                                <div>

                                                                    <p className="font-semibold text-slate-900">
                                                                        {user.full_name}
                                                                    </p>

                                                                </div>

                                                            </div>

                                                        </td>


                                                        {/* Email */}

                                                        <td className="px-6 py-4 text-sm text-slate-600">
                                                            {user.email}
                                                        </td>


                                                        {/* Role */}

                                                        <td className="px-6 py-4">

                                                            <span
                                                                className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold capitalize ${getRoleStyle(
                                                                    user.role
                                                                )}`}
                                                            >
                                                                {
                                                                    user.role
                                                                }
                                                            </span>

                                                        </td>


                                                        {/* ID */}

                                                        <td className="px-6 py-4 text-sm font-medium text-slate-500">
                                                            #
                                                            {
                                                                user.id
                                                            }
                                                        </td>


                                                        {/* Created */}

                                                        <td className="px-6 py-4 text-sm text-slate-500">
                                                            {user.created_at
                                                                ? new Date(
                                                                      user.created_at
                                                                  ).toLocaleDateString()
                                                                : "—"}
                                                        </td>


                                                        {/* Actions */}

                                                        <td className="px-6 py-4">

                                                            <div className="flex justify-end gap-2">

                                                                <button
                                                                    onClick={() =>
                                                                        handleViewUser(
                                                                            user.id
                                                                        )
                                                                    }
                                                                    className="rounded-lg bg-blue-50 px-4 py-2 text-sm font-semibold text-blue-600 transition hover:bg-blue-100"
                                                                >
                                                                    View
                                                                </button>


                                                                {!isCurrentDeveloper && (
                                                                    <button
                                                                        onClick={() =>
                                                                            openDeleteConfirmation(
                                                                                user
                                                                            )
                                                                        }
                                                                        className="rounded-lg bg-red-50 px-4 py-2 text-sm font-semibold text-red-600 transition hover:bg-red-100"
                                                                    >
                                                                        Delete
                                                                    </button>
                                                                )}

                                                            </div>

                                                        </td>

                                                    </tr>
                                                );
                                            }
                                        )}

                                    </tbody>

                                </table>

                            </div>
                        )}


                    {/* ================================= */}
                    {/* MOBILE CARDS */}
                    {/* ================================= */}

                    {!loading &&
                        !error &&
                        filteredUsers.length > 0 && (

                            <div className="divide-y divide-slate-100 md:hidden">

                                {filteredUsers.map(
                                    (user) => {

                                        const isCurrentDeveloper =
                                            currentUser &&
                                            Number(
                                                currentUser.id
                                            ) ===
                                                Number(
                                                    user.id
                                                );

                                        return (
                                            <div
                                                key={
                                                    user.id
                                                }
                                                className="p-5"
                                            >

                                                <div className="flex items-start justify-between gap-4">

                                                    <div className="flex min-w-0 items-center gap-3">

                                                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-blue-50 font-bold text-blue-600">
                                                            {user.full_name
                                                                ?.charAt(
                                                                    0
                                                                )
                                                                .toUpperCase()}
                                                        </div>

                                                        <div className="min-w-0">

                                                            <p className="truncate font-semibold text-slate-900">
                                                                {
                                                                    user.full_name
                                                                }
                                                            </p>

                                                            <p className="truncate text-sm text-slate-500">
                                                                {
                                                                    user.email
                                                                }
                                                            </p>

                                                        </div>

                                                    </div>


                                                    <span
                                                        className={`shrink-0 rounded-full px-3 py-1 text-xs font-semibold capitalize ${getRoleStyle(
                                                            user.role
                                                        )}`}
                                                    >
                                                        {
                                                            user.role
                                                        }
                                                    </span>

                                                </div>


                                                <div className="mt-4 flex items-center justify-between">

                                                    <div className="flex items-center gap-4 text-xs text-slate-500">

                                                        <span>
                                                            ID #
                                                            {
                                                                user.id
                                                            }
                                                        </span>

                                                        <span>
                                                            {user.created_at
                                                                ? new Date(
                                                                      user.created_at
                                                                  ).toLocaleDateString()
                                                                : "—"}
                                                        </span>

                                                    </div>


                                                    <div className="flex gap-2">

                                                        <button
                                                            onClick={() =>
                                                                handleViewUser(
                                                                    user.id
                                                                )
                                                            }
                                                            className="rounded-lg bg-blue-50 px-3 py-2 text-sm font-semibold text-blue-600"
                                                        >
                                                            View
                                                        </button>


                                                        {!isCurrentDeveloper && (
                                                            <button
                                                                onClick={() =>
                                                                    openDeleteConfirmation(
                                                                        user
                                                                    )
                                                                }
                                                                className="rounded-lg bg-red-50 px-3 py-2 text-sm font-semibold text-red-600"
                                                            >
                                                                Delete
                                                            </button>
                                                        )}

                                                    </div>

                                                </div>

                                            </div>
                                        );
                                    }
                                )}

                            </div>
                        )}

                </div>

            </div>


            {/* ==========================================
                USER DETAILS MODAL
            ========================================== */}

            {(detailsLoading ||
                selectedUser ||
                detailsError) && (

                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 px-4 py-6"
                    onClick={closeDetails}
                >

                    <div
                        className="w-full max-w-lg rounded-2xl bg-white shadow-2xl"
                        onClick={(e) =>
                            e.stopPropagation()
                        }
                    >

                        {/* Header */}

                        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-5">

                            <div>

                                <p className="text-sm font-semibold text-blue-600">
                                    Developer Tools
                                </p>

                                <h2 className="mt-1 text-xl font-bold text-slate-900">
                                    User Details
                                </h2>

                            </div>


                            <button
                                onClick={
                                    closeDetails
                                }
                                className="flex h-9 w-9 items-center justify-center rounded-lg text-xl text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
                            >
                                ×
                            </button>

                        </div>


                        {/* Body */}

                        <div className="p-6">

                            {detailsLoading && (
                                <div className="py-10 text-center">

                                    <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-blue-600" />

                                    <p className="mt-4 text-sm text-slate-500">
                                        Loading user details...
                                    </p>

                                </div>
                            )}


                            {detailsError && (
                                <div className="rounded-xl bg-red-50 px-5 py-4 text-sm text-red-600">
                                    {detailsError}
                                </div>
                            )}


                            {selectedUser &&
                                !detailsLoading && (

                                    <div>

                                        <div className="mb-6 flex items-center gap-4">

                                            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-blue-50 text-2xl font-bold text-blue-600">
                                                {selectedUser.full_name
                                                    ?.charAt(
                                                        0
                                                    )
                                                    .toUpperCase()}
                                            </div>

                                            <div>

                                                <h3 className="text-xl font-bold text-slate-900">
                                                    {
                                                        selectedUser.full_name
                                                    }
                                                </h3>

                                                <span
                                                    className={`mt-2 inline-flex rounded-full px-3 py-1 text-xs font-semibold capitalize ${getRoleStyle(
                                                        selectedUser.role
                                                    )}`}
                                                >
                                                    {
                                                        selectedUser.role
                                                    }
                                                </span>

                                            </div>

                                        </div>


                                        <div className="space-y-4">

                                            <div className="rounded-xl bg-slate-50 p-4">

                                                <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                                                    User ID
                                                </p>

                                                <p className="mt-1 font-semibold text-slate-900">
                                                    #
                                                    {
                                                        selectedUser.id
                                                    }
                                                </p>

                                            </div>


                                            <div className="rounded-xl bg-slate-50 p-4">

                                                <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                                                    Email Address
                                                </p>

                                                <p className="mt-1 break-all font-semibold text-slate-900">
                                                    {
                                                        selectedUser.email
                                                    }
                                                </p>

                                            </div>


                                            <div className="rounded-xl bg-slate-50 p-4">

                                                <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                                                    Account Created
                                                </p>

                                                <p className="mt-1 font-semibold text-slate-900">
                                                    {selectedUser.created_at
                                                        ? new Date(
                                                              selectedUser.created_at
                                                          ).toLocaleString()
                                                        : "—"}
                                                </p>

                                            </div>

                                        </div>

                                    </div>
                                )}

                        </div>


                        {/* Footer */}

                        <div className="border-t border-slate-200 px-6 py-4 text-right">

                            <button
                                onClick={
                                    closeDetails
                                }
                                className="rounded-lg bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800"
                            >
                                Close
                            </button>

                        </div>

                    </div>

                </div>
            )}


            {/* ==========================================
                DELETE CONFIRMATION MODAL
            ========================================== */}

            {deleteUserData && (

                <div
                    className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-950/60 px-4"
                    onClick={
                        closeDeleteConfirmation
                    }
                >

                    <div
                        className="w-full max-w-md rounded-2xl bg-white shadow-2xl"
                        onClick={(e) =>
                            e.stopPropagation()
                        }
                    >

                        {/* Delete Icon */}

                        <div className="px-6 pt-6">

                            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-50 text-xl">
                                ⚠️
                            </div>

                        </div>


                        {/* Content */}

                        <div className="px-6 py-5">

                            <h2 className="text-xl font-bold text-slate-900">
                                Delete User?
                            </h2>

                            <p className="mt-2 text-sm leading-6 text-slate-500">
                                Are you sure you want to permanently
                                delete{" "}
                                <span className="font-semibold text-slate-900">
                                    {
                                        deleteUserData.full_name
                                    }
                                </span>
                                ?
                            </p>

                            <p className="mt-2 text-sm text-red-600">
                                This action cannot be undone.
                            </p>


                            {deleteError && (
                                <div className="mt-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">
                                    {deleteError}
                                </div>
                            )}

                        </div>


                        {/* Buttons */}

                        <div className="flex justify-end gap-3 border-t border-slate-200 px-6 py-4">

                            <button
                                onClick={
                                    closeDeleteConfirmation
                                }
                                disabled={deleting}
                                className="rounded-lg border border-slate-300 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                Cancel
                            </button>


                            <button
                                onClick={
                                    handleDeleteUser
                                }
                                disabled={deleting}
                                className="rounded-lg bg-red-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
                            >
                                {deleting
                                    ? "Deleting..."
                                    : "Delete User"}
                            </button>

                        </div>

                    </div>

                </div>
            )}

        </div>
    );
}

export default Users;