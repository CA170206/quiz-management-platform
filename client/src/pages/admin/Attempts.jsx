import { useEffect, useState } from "react";

const API_URL =
    `${import.meta.env.VITE_API_URL}/api/admin/attempts`;

function Attempts() {
    const [attempts, setAttempts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [search, setSearch] = useState("");

    const getToken = () =>
        localStorage.getItem("token") ||
        sessionStorage.getItem("token");

    const fetchAttempts = async () => {
        try {
            setLoading(true);
            setError("");

            const token = getToken();

            const response = await fetch(API_URL, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message || "Failed to fetch attempts"
                );
            }

            setAttempts(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAttempts();
    }, []);

    const filteredAttempts = attempts.filter((attempt) => {
        const text = search.toLowerCase();

        return (
            attempt.full_name?.toLowerCase().includes(text) ||
            attempt.email?.toLowerCase().includes(text) ||
            attempt.quiz_title?.toLowerCase().includes(text)
        );
    });

    const formatDate = (date) => {
        if (!date) return "—";

        return new Date(date).toLocaleString("en-IN", {
            dateStyle: "medium",
            timeStyle: "short",
        });
    };

    return (
        <div className="min-h-screen bg-slate-50 px-4 pb-10 pt-24 sm:px-6 sm:pb-10 sm:pt-28">
            <div className="mx-auto max-w-7xl">

                <div className="mb-6">
                    <p className="text-sm font-semibold text-blue-600">
                        Administration
                    </p>

                    <h1 className="mt-1 text-2xl font-bold text-slate-900 sm:text-3xl">
                        Quiz Attempts
                    </h1>

                    <p className="mt-2 text-sm text-slate-500">
                        View student quiz attempts, scores, and results.
                    </p>
                </div>

                <div className="mb-6 rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
                    <input
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search student, email, or quiz..."
                        className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                    />
                </div>

                {error && (
                    <div className="mb-6 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">
                        {error}
                    </div>
                )}

                {loading ? (
                    <div className="rounded-2xl bg-white p-10 text-center shadow-sm ring-1 ring-slate-200">
                        <p className="text-sm text-slate-500">
                            Loading attempts...
                        </p>
                    </div>
                ) : filteredAttempts.length === 0 ? (
                    <div className="rounded-2xl bg-white p-12 text-center shadow-sm ring-1 ring-slate-200">
                        <div className="text-3xl">📊</div>

                        <h2 className="mt-4 text-lg font-bold text-slate-900">
                            No attempts found
                        </h2>

                        <p className="mt-2 text-sm text-slate-500">
                            No quiz attempts match your search.
                        </p>
                    </div>
                ) : (
                    <div className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-slate-200">

                        <div className="overflow-x-auto">
                            <table className="w-full min-w-[900px] text-left">

                                <thead className="border-b border-slate-200 bg-slate-50">
                                    <tr>
                                        <th className="px-5 py-4 text-xs font-bold uppercase text-slate-500">
                                            Student
                                        </th>

                                        <th className="px-5 py-4 text-xs font-bold uppercase text-slate-500">
                                            Quiz
                                        </th>

                                        <th className="px-5 py-4 text-xs font-bold uppercase text-slate-500">
                                            Score
                                        </th>

                                        <th className="px-5 py-4 text-xs font-bold uppercase text-slate-500">
                                            Percentage
                                        </th>

                                        <th className="px-5 py-4 text-xs font-bold uppercase text-slate-500">
                                            Result
                                        </th>

                                        <th className="px-5 py-4 text-xs font-bold uppercase text-slate-500">
                                            Submitted
                                        </th>
                                    </tr>
                                </thead>

                                <tbody className="divide-y divide-slate-100">

                                    {filteredAttempts.map((attempt) => (
                                        <tr
                                            key={attempt.id}
                                            className="hover:bg-slate-50"
                                        >
                                            <td className="px-5 py-4">
                                                <p className="font-semibold text-slate-900">
                                                    {attempt.full_name}
                                                </p>

                                                <p className="mt-1 text-xs text-slate-500">
                                                    {attempt.email}
                                                </p>
                                            </td>

                                            <td className="px-5 py-4">
                                                <p className="font-semibold text-slate-800">
                                                    {attempt.quiz_title}
                                                </p>

                                                <p className="mt-1 text-xs text-slate-400">
                                                    Attempt #{attempt.id}
                                                </p>
                                            </td>

                                            <td className="px-5 py-4 text-sm font-semibold text-slate-800">
                                                {attempt.score ?? "—"}
                                            </td>

                                            <td className="px-5 py-4">
                                                <span className="font-bold text-slate-900">
                                                    {attempt.percentage ?? 0}%
                                                </span>
                                            </td>

                                            <td className="px-5 py-4">
                                                {attempt.passed ? (
                                                    <span className="rounded-full bg-green-50 px-3 py-1.5 text-xs font-bold text-green-700">
                                                        Passed
                                                    </span>
                                                ) : (
                                                    <span className="rounded-full bg-red-50 px-3 py-1.5 text-xs font-bold text-red-600">
                                                        Failed
                                                    </span>
                                                )}
                                            </td>

                                            <td className="px-5 py-4 text-sm text-slate-500">
                                                {formatDate(
                                                    attempt.submitted_at
                                                )}
                                            </td>
                                        </tr>
                                    ))}

                                </tbody>
                            </table>
                        </div>

                        <div className="border-t border-slate-100 px-5 py-4">
                            <p className="text-sm text-slate-500">
                                Showing{" "}
                                <span className="font-semibold text-slate-900">
                                    {filteredAttempts.length}
                                </span>{" "}
                                attempts
                            </p>
                        </div>

                    </div>
                )}

            </div>
        </div>
    );
}

export default Attempts;