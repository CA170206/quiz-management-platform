import { useEffect, useMemo, useState } from "react";

const API_URL =
    `${import.meta.env.VITE_API_URL}/api/developer/admins`;

const USERS_API_URL =
    `${import.meta.env.VITE_API_URL}/api/developer/users`;

function Admins() {
    const [admins, setAdmins] = useState([]);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const [fullName, setFullName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] =
        useState("");

    const [showPassword, setShowPassword] =
        useState(false);

    const [creating, setCreating] = useState(false);

    const [search, setSearch] = useState("");

    const [deleteAdmin, setDeleteAdmin] =
        useState(null);

    const [deleting, setDeleting] =
        useState(false);

    const [deleteError, setDeleteError] =
        useState("");


    // ==========================================
    // GET TOKEN
    // ==========================================

    const getToken = () => {
        return (
            localStorage.getItem("token") ||
            sessionStorage.getItem("token")
        );
    };


    // ==========================================
    // FETCH ADMINS
    // ==========================================

    const fetchAdmins = async () => {
        try {
            setLoading(true);
            setError("");

            const token = getToken();

            if (!token) {
                throw new Error(
                    "You are not logged in."
                );
            }

            const response = await fetch(
                USERS_API_URL,
                {
                    headers: {
                        Authorization:
                            `Bearer ${token}`,
                    },
                }
            );

            const data =
                await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message ||
                        "Failed to fetch admins"
                );
            }

            setAdmins(
                (data.users || []).filter(
                    (user) =>
                        user.role === "admin"
                )
            );
        } catch (err) {
            console.error(
                "Fetch admins error:",
                err
            );

            setError(
                err.message ||
                    "Failed to fetch admins"
            );
        } finally {
            setLoading(false);
        }
    };


    useEffect(() => {
        fetchAdmins();
    }, []);


    // ==========================================
    // CREATE ADMIN
    // ==========================================

    const handleCreateAdmin = async (e) => {
        e.preventDefault();

        setError("");
        setSuccess("");

        const trimmedName =
            fullName.trim();

        const trimmedEmail =
            email.trim().toLowerCase();

        // Validation

        if (
            !trimmedName ||
            !trimmedEmail ||
            !password ||
            !confirmPassword
        ) {
            setError(
                "All fields are required."
            );
            return;
        }

        if (password.length < 8) {
            setError(
                "Password must be at least 8 characters."
            );
            return;
        }

        if (
            password !== confirmPassword
        ) {
            setError(
                "Passwords do not match."
            );
            return;
        }

        try {
            setCreating(true);

            const token = getToken();

            if (!token) {
                throw new Error(
                    "You are not logged in."
                );
            }

            const response =
                await fetch(API_URL, {
                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json",

                        Authorization:
                            `Bearer ${token}`,
                    },

                    body: JSON.stringify({
                        full_name:
                            trimmedName,
                        email:
                            trimmedEmail,
                        password,
                    }),
                });

            const data =
                await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message ||
                        "Failed to create admin"
                );
            }

            setSuccess(
                "Admin account created successfully."
            );

            // Clear form

            setFullName("");
            setEmail("");
            setPassword("");
            setConfirmPassword("");

            // Refresh list

            await fetchAdmins();

        } catch (err) {
            console.error(
                "Create admin error:",
                err
            );

            setError(
                err.message ||
                    "Failed to create admin"
            );
        } finally {
            setCreating(false);
        }
    };


    // ==========================================
    // DELETE ADMIN
    // ==========================================

    const handleDeleteAdmin = async () => {
        if (!deleteAdmin) {
            return;
        }

        try {
            setDeleting(true);
            setDeleteError("");

            const token = getToken();

            if (!token) {
                throw new Error(
                    "You are not logged in."
                );
            }

            const response =
                await fetch(
                    `${USERS_API_URL}/${deleteAdmin.id}`,
                    {
                        method: "DELETE",

                        headers: {
                            Authorization:
                                `Bearer ${token}`,
                        },
                    }
                );

            const data =
                await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message ||
                        "Failed to delete admin"
                );
            }

            setAdmins(
                (currentAdmins) =>
                    currentAdmins.filter(
                        (admin) =>
                            admin.id !==
                            deleteAdmin.id
                    )
            );

            setDeleteAdmin(null);

        } catch (err) {
            console.error(
                "Delete admin error:",
                err
            );

            setDeleteError(
                err.message ||
                    "Failed to delete admin"
            );
        } finally {
            setDeleting(false);
        }
    };


    // ==========================================
    // FILTER
    // ==========================================

    const filteredAdmins = useMemo(() => {
        const query =
            search
                .trim()
                .toLowerCase();

        if (!query) {
            return admins;
        }

        return admins.filter(
            (admin) =>
                admin.full_name
                    ?.toLowerCase()
                    .includes(query) ||
                admin.email
                    ?.toLowerCase()
                    .includes(query)
        );
    }, [admins, search]);


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
                        Admin Management
                    </h1>

                    <p className="mt-2 text-sm text-slate-500">
                        Create and manage administrator accounts.
                    </p>

                </div>


                {/* ================================= */}
                {/* CREATE ADMIN CARD */}
                {/* ================================= */}

                <div className="mb-8 rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">

                    <div className="mb-6 flex items-start gap-4">

                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-xl">
                            🛡️
                        </div>

                        <div>

                            <h2 className="text-lg font-bold text-slate-900">
                                Create Admin
                            </h2>

                            <p className="mt-1 text-sm text-slate-500">
                                Create a new administrator account.
                            </p>

                        </div>

                    </div>


                    <form
                        onSubmit={
                            handleCreateAdmin
                        }
                    >

                        <div className="grid gap-5 md:grid-cols-2">

                            {/* Full Name */}

                            <div>

                                <label className="mb-2 block text-sm font-semibold text-slate-700">
                                    Full Name
                                </label>

                                <input
                                    type="text"
                                    value={fullName}
                                    onChange={(e) =>
                                        setFullName(
                                            e.target.value
                                        )
                                    }
                                    placeholder="Enter admin name"
                                    disabled={creating}
                                    className="w-full rounded-lg border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:bg-slate-50"
                                />

                            </div>


                            {/* Email */}

                            <div>

                                <label className="mb-2 block text-sm font-semibold text-slate-700">
                                    Email
                                </label>

                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) =>
                                        setEmail(
                                            e.target.value
                                        )
                                    }
                                    placeholder="admin@example.com"
                                    disabled={creating}
                                    className="w-full rounded-lg border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:bg-slate-50"
                                />

                            </div>


                            {/* Password */}

                            <div>

                                <label className="mb-2 block text-sm font-semibold text-slate-700">
                                    Password
                                </label>

                                <div className="relative">

                                    <input
                                        type={
                                            showPassword
                                                ? "text"
                                                : "password"
                                        }
                                        value={
                                            password
                                        }
                                        onChange={(
                                            e
                                        ) =>
                                            setPassword(
                                                e.target.value
                                            )
                                        }
                                        placeholder="Minimum 8 characters"
                                        disabled={
                                            creating
                                        }
                                        className="w-full rounded-lg border border-slate-300 px-4 py-3 pr-20 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:bg-slate-50"
                                    />

                                    <button
                                        type="button"
                                        onClick={() =>
                                            setShowPassword(
                                                !showPassword
                                            )
                                        }
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-slate-500 hover:text-slate-800"
                                    >
                                        {showPassword
                                            ? "Hide"
                                            : "Show"}
                                    </button>

                                </div>

                            </div>


                            {/* Confirm Password */}

                            <div>

                                <label className="mb-2 block text-sm font-semibold text-slate-700">
                                    Confirm Password
                                </label>

                                <input
                                    type={
                                        showPassword
                                            ? "text"
                                            : "password"
                                    }
                                    value={
                                        confirmPassword
                                    }
                                    onChange={(
                                        e
                                    ) =>
                                        setConfirmPassword(
                                            e.target.value
                                        )
                                    }
                                    placeholder="Re-enter password"
                                    disabled={creating}
                                    className="w-full rounded-lg border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:bg-slate-50"
                                />

                            </div>

                        </div>


                        {/* Error */}

                        {error && (
                            <div className="mt-5 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">
                                {error}
                            </div>
                        )}


                        {/* Success */}

                        {success && (
                            <div className="mt-5 rounded-lg bg-green-50 px-4 py-3 text-sm text-green-700">
                                {success}
                            </div>
                        )}


                        {/* Submit */}

                        <div className="mt-6 flex justify-end">

                            <button
                                type="submit"
                                disabled={
                                    creating
                                }
                                className="w-full rounded-lg bg-blue-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
                            >
                                {creating
                                    ? "Creating..."
                                    : "Create Admin"}
                            </button>

                        </div>

                    </form>

                </div>


                {/* ================================= */}
                {/* ADMIN LIST */}
                {/* ================================= */}

                <div className="mb-4 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">

                    <div>

                        <h2 className="text-xl font-bold text-slate-900">
                            Administrators
                        </h2>

                        <p className="mt-1 text-sm text-slate-500">
                            {admins.length}{" "}
                            {admins.length === 1
                                ? "administrator"
                                : "administrators"}
                        </p>

                    </div>


                    <input
                        type="text"
                        value={search}
                        onChange={(e) =>
                            setSearch(
                                e.target.value
                            )
                        }
                        placeholder="Search admins..."
                        className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 sm:w-72"
                    />

                </div>


                {/* ================================= */}
                {/* LIST */}
                {/* ================================= */}

                {loading ? (

                    <div className="rounded-2xl bg-white p-10 text-center shadow-sm ring-1 ring-slate-200">

                        <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-blue-600" />

                        <p className="mt-4 text-sm text-slate-500">
                            Loading administrators...
                        </p>

                    </div>

                ) : error && admins.length === 0 ? (

                    <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">

                        <div className="rounded-xl bg-red-50 px-5 py-4 text-sm text-red-600">
                            {error}
                        </div>

                    </div>

                ) : filteredAdmins.length === 0 ? (

                    <div className="rounded-2xl bg-white px-6 py-12 text-center shadow-sm ring-1 ring-slate-200">

                        <div className="text-4xl">
                            🛡️
                        </div>

                        <h3 className="mt-4 font-bold text-slate-900">
                            No administrators found
                        </h3>

                        <p className="mt-1 text-sm text-slate-500">
                            Create an administrator using the form above.
                        </p>

                    </div>

                ) : (

                    <div className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-slate-200">

                        <div className="hidden overflow-x-auto md:block">

                            <table className="w-full text-left">

                                <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">

                                    <tr>

                                        <th className="px-6 py-4 font-semibold">
                                            Administrator
                                        </th>

                                        <th className="px-6 py-4 font-semibold">
                                            Email
                                        </th>

                                        <th className="px-6 py-4 font-semibold">
                                            ID
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

                                    {filteredAdmins.map(
                                        (admin) => (

                                            <tr
                                                key={
                                                    admin.id
                                                }
                                                className="transition hover:bg-slate-50"
                                            >

                                                <td className="px-6 py-4">

                                                    <div className="flex items-center gap-3">

                                                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-50 font-bold text-blue-600">
                                                            {admin.full_name
                                                                ?.charAt(
                                                                    0
                                                                )
                                                                .toUpperCase()}
                                                        </div>

                                                        <div>

                                                            <p className="font-semibold text-slate-900">
                                                                {
                                                                    admin.full_name
                                                                }
                                                            </p>

                                                            <span className="text-xs font-semibold text-blue-600">
                                                                Administrator
                                                            </span>

                                                        </div>

                                                    </div>

                                                </td>


                                                <td className="px-6 py-4 text-sm text-slate-600">
                                                    {
                                                        admin.email
                                                    }
                                                </td>


                                                <td className="px-6 py-4 text-sm text-slate-500">
                                                    #
                                                    {
                                                        admin.id
                                                    }
                                                </td>


                                                <td className="px-6 py-4 text-sm text-slate-500">
                                                    {admin.created_at
                                                        ? new Date(
                                                              admin.created_at
                                                          ).toLocaleDateString()
                                                        : "—"}
                                                </td>


                                                <td className="px-6 py-4">

                                                    <div className="flex justify-end">

                                                        <button
                                                            type="button"
                                                            onClick={() => {
                                                                setDeleteError(
                                                                    ""
                                                                );
                                                                setDeleteAdmin(
                                                                    admin
                                                                );
                                                            }}
                                                            className="rounded-lg bg-red-50 px-4 py-2 text-sm font-semibold text-red-600 transition hover:bg-red-100"
                                                        >
                                                            Delete
                                                        </button>

                                                    </div>

                                                </td>

                                            </tr>

                                        )
                                    )}

                                </tbody>

                            </table>

                        </div>


                        {/* Mobile */}

                        <div className="divide-y divide-slate-100 md:hidden">

                            {filteredAdmins.map(
                                (admin) => (

                                    <div
                                        key={
                                            admin.id
                                        }
                                        className="p-5"
                                    >

                                        <div className="flex items-start justify-between gap-4">

                                            <div className="flex min-w-0 items-center gap-3">

                                                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-blue-50 font-bold text-blue-600">
                                                    {admin.full_name
                                                        ?.charAt(
                                                            0
                                                        )
                                                        .toUpperCase()}
                                                </div>

                                                <div className="min-w-0">

                                                    <p className="truncate font-semibold text-slate-900">
                                                        {
                                                            admin.full_name
                                                        }
                                                    </p>

                                                    <p className="truncate text-sm text-slate-500">
                                                        {
                                                            admin.email
                                                        }
                                                    </p>

                                                </div>

                                            </div>

                                        </div>


                                        <div className="mt-4 flex items-center justify-between">

                                            <div className="text-xs text-slate-500">

                                                ID #
                                                {
                                                    admin.id
                                                }

                                                {" • "}

                                                {admin.created_at
                                                    ? new Date(
                                                          admin.created_at
                                                      ).toLocaleDateString()
                                                    : "—"}

                                            </div>


                                            <button
                                                type="button"
                                                onClick={() => {
                                                    setDeleteError(
                                                        ""
                                                    );
                                                    setDeleteAdmin(
                                                        admin
                                                    );
                                                }}
                                                className="rounded-lg bg-red-50 px-3 py-2 text-sm font-semibold text-red-600"
                                            >
                                                Delete
                                            </button>

                                        </div>

                                    </div>

                                )
                            )}

                        </div>

                    </div>

                )}

            </div>


            {/* ================================= */}
            {/* DELETE MODAL */}
            {/* ================================= */}

            {deleteAdmin && (

                <div
                    className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/60 px-4"
                    onClick={() => {
                        if (!deleting) {
                            setDeleteAdmin(
                                null
                            );
                            setDeleteError("");
                        }
                    }}
                >

                    <div
                        className="w-full max-w-md rounded-2xl bg-white shadow-2xl"
                        onClick={(e) =>
                            e.stopPropagation()
                        }
                    >

                        <div className="p-6">

                            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-50 text-xl">
                                ⚠️
                            </div>

                            <h2 className="mt-5 text-xl font-bold text-slate-900">
                                Delete Administrator?
                            </h2>

                            <p className="mt-2 text-sm leading-6 text-slate-500">

                                Are you sure you want to permanently
                                delete{" "}

                                <span className="font-semibold text-slate-900">
                                    {
                                        deleteAdmin.full_name
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


                        <div className="flex justify-end gap-3 border-t border-slate-200 px-6 py-4">

                            <button
                                type="button"
                                disabled={deleting}
                                onClick={() => {
                                    setDeleteAdmin(
                                        null
                                    );
                                    setDeleteError(
                                        ""
                                    );
                                }}
                                className="rounded-lg border border-slate-300 px-5 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:opacity-50"
                            >
                                Cancel
                            </button>


                            <button
                                type="button"
                                disabled={deleting}
                                onClick={
                                    handleDeleteAdmin
                                }
                                className="rounded-lg bg-red-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
                            >
                                {deleting
                                    ? "Deleting..."
                                    : "Delete Admin"}
                            </button>

                        </div>

                    </div>

                </div>

            )}

        </div>
    );
}

export default Admins;