import { useEffect, useState } from "react";

const API_URL =
    import.meta.env.VITE_API_URL ||
    "http://localhost:5000";

function Users() {
    const [users, setUsers] = useState([]);
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [selectedUser, setSelectedUser] =
        useState(null);

    const [userAttempts, setUserAttempts] =
        useState([]);

    const [detailsLoading, setDetailsLoading] =
        useState(false);

    const token =
        localStorage.getItem("token") ||
        localStorage.getItem("authToken");

    const fetchUsers = async () => {
        try {
            setLoading(true);
            setError("");

            const response = await fetch(
                `${API_URL}/api/admin/users?search=${encodeURIComponent(
                    search
                )}`,
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
                        "Failed to fetch students"
                );
            }

            setUsers(data);
        } catch (error) {
            console.error(error);
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, [search]);

    const viewUser = async (id) => {
        try {
            setDetailsLoading(true);

            const response = await fetch(
                `${API_URL}/api/admin/users/${id}`,
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
                        "Failed to fetch student"
                );
            }

            setSelectedUser(data.user);
            setUserAttempts(data.attempts || []);
        } catch (error) {
            alert(error.message);
        } finally {
            setDetailsLoading(false);
        }
    };

    const toggleStatus = async (user) => {
    try {
        const newStatus = user.active === true
            ? false
            : true;

        const response = await fetch(
            `${API_URL}/api/admin/users/${user.id}/status`,
            {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    active: newStatus,
                }),
            }
        );

        const data = await response.json();

        if (!response.ok) {
            throw new Error(
                data.message ||
                    "Failed to update student status"
            );
        }

        setUsers((prevUsers) =>
            prevUsers.map((u) =>
                u.id === user.id
                    ? {
                          ...u,
                          active: data.user.active,
                      }
                    : u
            )
        );

        if (
            selectedUser &&
            selectedUser.id === user.id
        ) {
            setSelectedUser(data.user);
        }

    } catch (error) {
        console.error(
            "Toggle status error:",
            error
        );

        alert(error.message);
    }
};
    const deleteUser = async (user) => {
        const confirmed = window.confirm(
            `Delete ${user.full_name}? This will also delete their quiz attempts and answers.`
        );

        if (!confirmed) return;

        try {
            const response = await fetch(
                `${API_URL}/api/admin/users/${user.id}`,
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
                        "Failed to delete student"
                );
            }

            setSelectedUser(null);
            setUserAttempts([]);

            fetchUsers();

            alert("Student deleted successfully");
        } catch (error) {
            alert(error.message);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 px-6 py-10">

            <div className="mx-auto max-w-7xl">

                <div className="mb-8">
                    <h1 className="text-3xl font-black text-slate-900">
                        Student Management
                    </h1>

                    <p className="mt-2 text-slate-500">
                        Manage registered students and
                        review their quiz performance.
                    </p>
                </div>

                {/* Search */}

                <div className="mb-6 rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-100">

                    <input
                        type="text"
                        value={search}
                        onChange={(e) =>
                            setSearch(e.target.value)
                        }
                        placeholder="Search students by name or email..."
                        className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-black"
                    />

                </div>

                {error && (
                    <div className="mb-6 rounded-xl bg-red-50 p-4 text-red-600">
                        {error}
                    </div>
                )}

                {/* Student table */}

                <div className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-slate-100">

                    {loading ? (
                        <div className="p-10 text-center text-slate-500">
                            Loading students...
                        </div>
                    ) : users.length === 0 ? (
                        <div className="p-10 text-center text-slate-500">
                            No students found.
                        </div>
                    ) : (
                        <div className="overflow-x-auto">

                            <table className="w-full">

                                <thead className="bg-slate-50">
                                    <tr>
                                        <th className="px-5 py-4 text-left text-sm font-bold">
                                            Student
                                        </th>

                                        <th className="px-5 py-4 text-left text-sm font-bold">
                                            Email
                                        </th>

                                        <th className="px-5 py-4 text-left text-sm font-bold">
                                            Joined
                                        </th>

                                        <th className="px-5 py-4 text-left text-sm font-bold">
                                            Status
                                        </th>

                                        <th className="px-5 py-4 text-right text-sm font-bold">
                                            Actions
                                        </th>
                                    </tr>
                                </thead>

                                <tbody>

                                    {users.map((user) => (
                                        <tr
                                            key={user.id}
                                            className="border-t border-slate-100"
                                        >

                                            <td className="px-5 py-4">
                                                <div className="font-bold text-slate-900">
                                                    {user.full_name}
                                                </div>

                                                <div className="text-xs text-slate-400">
                                                    ID #{user.id}
                                                </div>
                                            </td>

                                            <td className="px-5 py-4 text-sm text-slate-600">
                                                {user.email}
                                            </td>

                                            <td className="px-5 py-4 text-sm text-slate-600">
                                                {user.created_at
                                                    ? new Date(
                                                          user.created_at
                                                      ).toLocaleDateString()
                                                    : "—"}
                                            </td>

                                            <td className="px-5 py-4">

                                                <span
                                                    className={`rounded-full px-3 py-1 text-xs font-bold ${
                                                        user.active !==
                                                        false
                                                            ? "bg-green-100 text-green-700"
                                                            : "bg-red-100 text-red-700"
                                                    }`}
                                                >
                                                    {user.active !==
                                                    false
                                                        ? "Active"
                                                        : "Inactive"}
                                                </span>

                                            </td>

                                            <td className="px-5 py-4">

                                                <div className="flex justify-end gap-2">

                                                    <button
                                                        onClick={() =>
                                                            viewUser(
                                                                user.id
                                                            )
                                                        }
                                                        className="rounded-lg bg-slate-100 px-3 py-2 text-xs font-bold hover:bg-slate-200"
                                                    >
                                                        View
                                                    </button>

                                                    <button
    onClick={() => toggleStatus(user)}
    className="rounded-lg bg-yellow-100 px-3 py-2 text-xs font-bold text-yellow-700 hover:bg-yellow-200"
>
    {user.active === true
        ? "Deactivate"
        : "Activate"}
</button>

                                                    <button
                                                        onClick={() =>
                                                            deleteUser(
                                                                user
                                                            )
                                                        }
                                                        className="rounded-lg bg-red-100 px-3 py-2 text-xs font-bold text-red-600 hover:bg-red-200"
                                                    >
                                                        Delete
                                                    </button>

                                                </div>

                                            </td>

                                        </tr>
                                    ))}

                                </tbody>

                            </table>

                        </div>
                    )}

                </div>

                {/* Student details */}

                {selectedUser && (
                    <div className="mt-8 rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-100">

                        <div className="flex items-start justify-between">

                            <div>
                                <h2 className="text-2xl font-black">
                                    {selectedUser.full_name}
                                </h2>

                                <p className="mt-1 text-slate-500">
                                    {selectedUser.email}
                                </p>
                            </div>

                            <button
                                onClick={() =>
                                    setSelectedUser(null)
                                }
                                className="rounded-lg bg-slate-100 px-3 py-2 text-sm font-bold"
                            >
                                Close
                            </button>

                        </div>

                        <div className="mt-6 grid gap-4 sm:grid-cols-3">

                            <div className="rounded-xl bg-slate-50 p-4">
                                <p className="text-xs text-slate-400">
                                    Student ID
                                </p>

                                <p className="mt-1 text-xl font-black">
                                    #{selectedUser.id}
                                </p>
                            </div>

                            <div className="rounded-xl bg-slate-50 p-4">
                                <p className="text-xs text-slate-400">
                                    Role
                                </p>

                                <p className="mt-1 text-xl font-black">
                                    {selectedUser.role}
                                </p>
                            </div>

                            <div className="rounded-xl bg-slate-50 p-4">
                                <p className="text-xs text-slate-400">
                                    Attempts
                                </p>

                                <p className="mt-1 text-xl font-black">
                                    {userAttempts.length}
                                </p>
                            </div>

                        </div>

                        <h3 className="mt-8 text-lg font-black">
                            Quiz History
                        </h3>

                        {detailsLoading ? (
                            <p className="mt-4 text-slate-500">
                                Loading history...
                            </p>
                        ) : userAttempts.length === 0 ? (
                            <p className="mt-4 text-slate-500">
                                No quiz attempts yet.
                            </p>
                        ) : (
                            <div className="mt-4 overflow-x-auto">

                                <table className="w-full">

                                    <thead className="bg-slate-50">
                                        <tr>
                                            <th className="px-4 py-3 text-left text-xs font-bold">
                                                Quiz
                                            </th>

                                            <th className="px-4 py-3 text-left text-xs font-bold">
                                                Score
                                            </th>

                                            <th className="px-4 py-3 text-left text-xs font-bold">
                                                Correct
                                            </th>

                                            <th className="px-4 py-3 text-left text-xs font-bold">
                                                Date
                                            </th>
                                        </tr>
                                    </thead>

                                    <tbody>

                                        {userAttempts.map(
                                            (attempt) => (
                                                <tr
                                                    key={
                                                        attempt.id
                                                    }
                                                    className="border-t border-slate-100"
                                                >

                                                    <td className="px-4 py-3 text-sm font-semibold">
                                                        {
                                                            attempt.quiz_title
                                                        }
                                                    </td>

                                                    <td className="px-4 py-3 text-sm font-bold">
                                                        {
                                                            attempt.percentage
                                                        }
                                                        %
                                                    </td>

                                                    <td className="px-4 py-3 text-sm">
                                                        {
                                                            attempt.correct_answers
                                                        }
                                                        /
                                                        {
                                                            attempt.total_questions
                                                        }
                                                    </td>

                                                    <td className="px-4 py-3 text-sm text-slate-500">
                                                      Attempt #{attempt.id}
                                                      </td>

                                                </tr>
                                            )
                                        )}

                                    </tbody>

                                </table>

                            </div>
                        )}

                    </div>
                )}

            </div>

        </div>
    );
}

export default Users;