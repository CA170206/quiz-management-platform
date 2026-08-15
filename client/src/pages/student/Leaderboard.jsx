import { useEffect, useState } from "react";

const API_URL =
    `${import.meta.env.VITE_API_URL}/api/attempts/leaderboard`;

function Leaderboard() {
    const [players, setPlayers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchLeaderboard = async () => {
            try {
                setLoading(true);
                setError("");

                const token =
                    sessionStorage.getItem("token");

                if (!token) {
                    throw new Error(
                        "You are not logged in. Please login again."
                    );
                }

                const response = await fetch(
                    API_URL,
                    {
                        method: "GET",
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
                            "Failed to fetch leaderboard"
                    );
                }

                setPlayers(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchLeaderboard();
    }, []);

    // ==========================================
    // LOADING
    // ==========================================

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-50 px-6 py-10">
                <div className="mx-auto max-w-6xl">

                    <div className="mb-8 animate-pulse">
                        <div className="mx-auto h-4 w-28 rounded bg-slate-200" />

                        <div className="mx-auto mt-3 h-9 w-56 rounded bg-slate-200" />

                        <div className="mx-auto mt-2 h-5 w-80 rounded bg-slate-200" />
                    </div>

                    <div className="h-96 animate-pulse rounded-2xl bg-white shadow-sm ring-1 ring-slate-200" />

                </div>
            </div>
        );
    }


    // ==========================================
    // ERROR
    // ==========================================

    if (error) {
        return (
            <div className="min-h-screen bg-slate-50 px-6 py-10">

                <div className="mx-auto max-w-6xl">

                    <div className="rounded-xl border border-red-100 bg-red-50 px-5 py-4 text-sm text-red-600">
                        {error}
                    </div>

                </div>

            </div>
        );
    }


    const topThree =
        players.slice(0, 3);

    const remainingPlayers =
        players.slice(3);


    return (
        <div className="min-h-screen bg-slate-50 px-6 py-10">

            <div className="mx-auto max-w-6xl">

                {/* ================================= */}
                {/* HEADER */}
                {/* ================================= */}

                <div className="mb-10 text-center">

                    <p className="text-sm font-semibold text-blue-600">
                        Competition
                    </p>

                    <h1 className="mt-2 text-3xl font-bold text-slate-900">
                        Leaderboard
                    </h1>

                    <p className="mt-2 text-slate-500">
                        See how you rank against other quiz participants.
                    </p>

                </div>


                {/* ================================= */}
                {/* EMPTY */}
                {/* ================================= */}

                {players.length === 0 ? (

                    <div className="rounded-2xl bg-white p-12 text-center shadow-sm ring-1 ring-slate-200">

                        <div className="text-4xl">
                            🏆
                        </div>

                        <h2 className="mt-4 text-xl font-bold text-slate-900">
                            No leaderboard data
                        </h2>

                        <p className="mt-2 text-sm text-slate-500">
                            Complete a quiz to appear on the leaderboard.
                        </p>

                    </div>

                ) : (

                    <>

                        {/* ================================= */}
                        {/* TOP THREE */}
                        {/* ================================= */}

                        <div className="rounded-2xl bg-white px-6 py-10 shadow-sm ring-1 ring-slate-200">

                            <div className="mx-auto flex max-w-3xl items-end justify-center gap-3 sm:gap-8">

                                {/* SECOND */}

                                {topThree[1] && (
                                    <div className="flex w-28 flex-col items-center sm:w-36">

                                        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-slate-200 text-xl font-bold text-slate-700">
                                            {topThree[1].full_name
                                                ?.charAt(0)
                                                .toUpperCase()}
                                        </div>

                                        <p className="mt-3 max-w-full truncate text-sm font-bold text-slate-900">
                                            {topThree[1].full_name}
                                        </p>

                                        <p className="mt-1 text-xs text-slate-500">
                                            {Number(
                                                topThree[1]
                                                    .best_percentage ||
                                                    0
                                            ).toFixed(0)}
                                            %
                                        </p>

                                        <div className="mt-4 flex h-24 w-full items-center justify-center rounded-t-xl bg-slate-200 text-2xl font-bold text-slate-600">
                                            2
                                        </div>

                                    </div>
                                )}


                                {/* FIRST */}

                                {topThree[0] && (
                                    <div className="flex w-32 flex-col items-center sm:w-40">

                                        <div className="mb-2 text-3xl">
                                            👑
                                        </div>

                                        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-blue-600 text-2xl font-bold text-white ring-4 ring-blue-100">
                                            {topThree[0].full_name
                                                ?.charAt(0)
                                                .toUpperCase()}
                                        </div>

                                        <p className="mt-3 max-w-full truncate text-sm font-bold text-slate-900">
                                            {topThree[0].full_name}
                                        </p>

                                        <p className="mt-1 text-xs font-semibold text-blue-600">
                                            {Number(
                                                topThree[0]
                                                    .best_percentage ||
                                                    0
                                            ).toFixed(0)}
                                            %
                                        </p>

                                        <div className="mt-4 flex h-32 w-full items-center justify-center rounded-t-xl bg-blue-600 text-3xl font-bold text-white">
                                            1
                                        </div>

                                    </div>
                                )}


                                {/* THIRD */}

                                {topThree[2] && (
                                    <div className="flex w-28 flex-col items-center sm:w-36">

                                        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-orange-100 text-xl font-bold text-orange-700">
                                            {topThree[2].full_name
                                                ?.charAt(0)
                                                .toUpperCase()}
                                        </div>

                                        <p className="mt-3 max-w-full truncate text-sm font-bold text-slate-900">
                                            {topThree[2].full_name}
                                        </p>

                                        <p className="mt-1 text-xs text-slate-500">
                                            {Number(
                                                topThree[2]
                                                    .best_percentage ||
                                                    0
                                            ).toFixed(0)}
                                            %
                                        </p>

                                        <div className="mt-4 flex h-20 w-full items-center justify-center rounded-t-xl bg-orange-100 text-2xl font-bold text-orange-700">
                                            3
                                        </div>

                                    </div>
                                )}

                            </div>

                        </div>


                        {/* ================================= */}
                        {/* ALL RANKINGS */}
                        {/* ================================= */}

                        <div className="mt-6 overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-slate-200">

                            <div className="border-b border-slate-100 px-6 py-5">

                                <h2 className="text-lg font-bold text-slate-900">
                                    All Rankings
                                </h2>

                                <p className="mt-1 text-sm text-slate-500">
                                    Your current leaderboard standings.
                                </p>

                            </div>


                            <div className="overflow-x-auto">

                                <table className="w-full text-left text-sm">

                                    <thead className="bg-slate-50 text-xs uppercase text-slate-500">

                                        <tr>

                                            <th className="px-6 py-4">
                                                Rank
                                            </th>

                                            <th className="px-6 py-4">
                                                Player
                                            </th>

                                            <th className="px-6 py-4">
                                                Best Score
                                            </th>

                                            <th className="px-6 py-4">
                                                Percentage
                                            </th>

                                            <th className="px-6 py-4">
                                                Attempts
                                            </th>

                                        </tr>

                                    </thead>


                                    <tbody className="divide-y divide-slate-100">

                                        {players.map(
                                            (player, index) => (

                                                <tr
                                                    key={
                                                        player.user_id
                                                    }
                                                    className="transition hover:bg-slate-50"
                                                >

                                                    {/* Rank */}

                                                    <td className="px-6 py-5">

                                                        <span
                                                            className={`flex h-9 w-9 items-center justify-center rounded-lg text-sm font-bold ${
                                                                index === 0
                                                                    ? "bg-blue-100 text-blue-700"
                                                                    : index === 1
                                                                    ? "bg-slate-100 text-slate-700"
                                                                    : index === 2
                                                                    ? "bg-orange-100 text-orange-700"
                                                                    : "bg-slate-50 text-slate-500"
                                                            }`}
                                                        >
                                                            {index + 1}
                                                        </span>

                                                    </td>


                                                    {/* Player */}

                                                    <td className="px-6 py-5">

                                                        <div className="flex items-center gap-3">

                                                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-50 text-sm font-bold text-blue-600">

                                                                {player.full_name
                                                                    ?.charAt(0)
                                                                    .toUpperCase()}

                                                            </div>

                                                            <span className="font-semibold text-slate-900">
                                                                {
                                                                    player.full_name
                                                                }
                                                            </span>

                                                        </div>

                                                    </td>


                                                    {/* Score */}

                                                    <td className="px-6 py-5 font-semibold text-slate-700">

                                                        {
                                                            player.best_score
                                                        }

                                                    </td>


                                                    {/* Percentage */}

                                                    <td className="px-6 py-5">

                                                        <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-600">

                                                            {Number(
                                                                player.best_percentage ||
                                                                    0
                                                            ).toFixed(0)}

                                                            %

                                                        </span>

                                                    </td>


                                                    {/* Attempts */}

                                                    <td className="px-6 py-5 text-slate-500">

                                                        {
                                                            player.attempts
                                                        }

                                                    </td>

                                                </tr>

                                            )
                                        )}

                                    </tbody>

                                </table>

                            </div>

                        </div>

                    </>

                )}

            </div>

        </div>
    );
}

export default Leaderboard;