import { useEffect, useState } from "react";

const API_URL =
    `${import.meta.env.VITE_API_URL}/api/developer/users`;

function Database() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const fetchUsers = async () => {
        try {
            setLoading(true);
            setError("");

            const token =
                localStorage.getItem("token");

            const response = await fetch(API_URL, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message ||
                    "Failed to fetch database records"
                );
            }

            setUsers(data.users || []);

        } catch (err) {
            setError(
                err.message ||
                "Failed to load database records"
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const students = users.filter(
        (user) => user.role === "student"
    ).length;

    const admins = users.filter(
        (user) => user.role === "admin"
    ).length;

    const developers = users.filter(
        (user) => user.role === "developer"
    ).length;

    return (
        <div className="min-h-screen bg-slate-50 px-4 py-6 sm:px-6 lg:px-8">

            <div className="mx-auto max-w-7xl">

                {/* Header */}

                <div className="mb-6 rounded-2xl bg-slate-950 px-6 py-7 text-white shadow-sm sm:px-8">

                    <p className="text-sm font-semibold text-blue-400">
                        Developer Database
                    </p>

                    <h1 className="mt-1 text-2xl font-bold sm:text-3xl">
                        Database Explorer
                    </h1>

                    <p className="mt-2 text-sm text-slate-400">
                        Inspect user records and database information.
                    </p>

                </div>


                {/* Summary */}

                <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">

                    <StatCard
                        title="Total Users"
                        value={users.length}
                        icon="👥"
                    />

                    <StatCard
                        title="Students"
                        value={students}
                        icon="🎓"
                    />

                    <StatCard
                        title="Admins"
                        value={admins}
                        icon="🛡️"
                    />

                    <StatCard
                        title="Developers"
                        value={developers}
                        icon="⚙️"
                    />

                </div>


                {/* User Records */}

                <div className="rounded-2xl bg-white shadow-sm ring-1 ring-slate-200">

                    <div className="flex flex-col gap-4 border-b border-slate-100 p-5 sm:flex-row sm:items-center sm:justify-between">

                        <div>
                            <h2 className="font-bold text-slate-900">
                                User Records
                            </h2>

                            <p className="mt-1 text-sm text-slate-500">
                                Records currently stored in the users table.
                            </p>
                        </div>

                        <button
                            type="button"
                            onClick={fetchUsers}
                            disabled={loading}
                            className="rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            {loading
                                ? "Refreshing..."
                                : "Refresh"}
                        </button>

                    </div>


                    {error && (
                        <div className="m-5 rounded-lg border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-600">
                            {error}
                        </div>
                    )}


                    {loading ? (
                        <div className="p-8 text-center text-sm text-slate-500">
                            Loading database records...
                        </div>
                    ) : users.length === 0 ? (
                        <div className="p-8 text-center text-sm text-slate-500">
                            No user records found.
                        </div>
                    ) : (
                        <div className="overflow-x-auto">

                            <table className="min-w-full text-left text-sm">

                                <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">

                                    <tr>
                                        <th className="px-5 py-4 font-semibold">
                                            ID
                                        </th>

                                        <th className="px-5 py-4 font-semibold">
                                            Name
                                        </th>

                                        <th className="px-5 py-4 font-semibold">
                                            Email
                                        </th>

                                        <th className="px-5 py-4 font-semibold">
                                            Role
                                        </th>

                                        <th className="px-5 py-4 font-semibold">
                                            Created
                                        </th>
                                    </tr>

                                </thead>

                                <tbody className="divide-y divide-slate-100">

                                    {users.map((user) => (
                                        <tr
                                            key={user.id}
                                            className="transition hover:bg-slate-50"
                                        >

                                            <td className="whitespace-nowrap px-5 py-4 font-medium text-slate-900">
                                                #{user.id}
                                            </td>

                                            <td className="whitespace-nowrap px-5 py-4 font-semibold text-slate-900">
                                                {user.full_name}
                                            </td>

                                            <td className="whitespace-nowrap px-5 py-4 text-slate-500">
                                                {user.email}
                                            </td>

                                            <td className="whitespace-nowrap px-5 py-4">

                                                <RoleBadge
                                                    role={user.role}
                                                />

                                            </td>

                                            <td className="whitespace-nowrap px-5 py-4 text-slate-500">
                                                {user.created_at
                                                    ? new Date(
                                                        user.created_at
                                                    ).toLocaleString()
                                                    : "—"}
                                            </td>

                                        </tr>
                                    ))}

                                </tbody>

                            </table>

                        </div>
                    )}

                </div>

            </div>

        </div>
    );
}


function StatCard({
    title,
    value,
    icon,
}) {
    return (
        <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200">

            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-xl">
                {icon}
            </div>

            <p className="mt-4 text-sm font-medium text-slate-500">
                {title}
            </p>

            <p className="mt-1 text-2xl font-bold text-slate-900">
                {value}
            </p>

        </div>
    );
}


function RoleBadge({ role }) {
    const styles = {
        student:
            "bg-blue-50 text-blue-700",
        admin:
            "bg-purple-50 text-purple-700",
        developer:
            "bg-green-50 text-green-700",
    };

    return (
        <span
            className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold capitalize ${
                styles[role] ||
                "bg-slate-100 text-slate-700"
            }`}
        >
            {role}
        </span>
    );
}


export default Database;