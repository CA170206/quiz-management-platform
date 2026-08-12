import { useEffect, useState } from "react";

const API_URL = "http://localhost:5000/api/attempts/leaderboard";

function Leaderboard() {
    const [players, setPlayers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchLeaderboard = async () => {
            try {
                const response = await fetch(API_URL);

                if (!response.ok) {
                    throw new Error("Failed to fetch leaderboard");
                }

                const data = await response.json();
                setPlayers(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchLeaderboard();
    }, []);

    if (loading) {
        return <p>Loading leaderboard...</p>;
    }

    if (error) {
        return <p>{error}</p>;
    }

    return (
        <div>
            <h1>Leaderboard</h1>

            {players.length === 0 ? (
                <p>No leaderboard data available.</p>
            ) : (
                <table>
                    <thead>
                        <tr>
                            <th>Rank</th>
                            <th>Name</th>
                            <th>Best Score</th>
                            <th>Percentage</th>
                            <th>Attempts</th>
                        </tr>
                    </thead>

                    <tbody>
                        {players.map((player, index) => (
                            <tr key={player.user_id}>
                                <td>{index + 1}</td>
                                <td>{player.full_name}</td>
                                <td>{player.best_score}</td>
                                <td>
                                    {player.best_percentage}%
                                </td>
                                <td>{player.attempts}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
}

export default Leaderboard;