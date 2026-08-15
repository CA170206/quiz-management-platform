import { useState } from "react";
import { useNavigate } from "react-router-dom";

const API_URL =
    `${import.meta.env.VITE_API_URL}/api/auth/developer-login`;

function DeveloperLogin() {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });

        setError("");
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            setLoading(true);
            setError("");

            if (
                !formData.email ||
                !formData.password
            ) {
                setError(
                    "Email and password are required."
                );
                return;
            }

            const response = await fetch(API_URL, {
                method: "POST",

                headers: {
                    "Content-Type":
                        "application/json",
                },

                body: JSON.stringify({
                    email:
                        formData.email.trim(),
                    password:
                        formData.password,
                }),
            });

            const data =
                await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message ||
                        "Developer login failed"
                );
            }

            // Store developer authentication
            localStorage.setItem(
                "token",
                data.token
            );

            localStorage.setItem(
                "user",
                JSON.stringify(data.user)
            );

            // Go to developer dashboard
            navigate("/developer");

        } catch (err) {
            setError(
                err.message ||
                    "Developer login failed"
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-slate-950 px-4 py-8">

            <div className="w-full max-w-md">

                {/* Header */}

                <div className="mb-8 text-center">

                    <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-600 text-2xl shadow-lg shadow-blue-600/20">
                        ⚙️
                    </div>

                    <h1 className="mt-5 text-2xl font-bold text-white sm:text-3xl">
                        Developer Access
                    </h1>

                    <p className="mt-2 text-sm text-slate-400">
                        Restricted system administration
                    </p>

                </div>


                {/* Login Card */}

                <div className="rounded-2xl bg-white p-5 shadow-2xl sm:p-8">

                    <div className="mb-6">

                        <h2 className="text-lg font-bold text-slate-900">
                            Developer Login
                        </h2>

                        <p className="mt-1 text-sm leading-5 text-slate-500">
                            Sign in with your authorized
                            developer account.
                        </p>

                    </div>


                    <form
                        onSubmit={handleSubmit}
                        className="space-y-5"
                    >

                        {/* Email */}

                        <div>

                            <label className="mb-2 block text-sm font-semibold text-slate-700">
                                Email Address
                            </label>

                            <input
                                type="email"
                                name="email"
                                value={
                                    formData.email
                                }
                                onChange={
                                    handleChange
                                }
                                placeholder="Developer email"
                                autoComplete="email"
                                required
                                className="w-full rounded-lg border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                            />

                        </div>


                        {/* Password */}

                        <div>

                            <label className="mb-2 block text-sm font-semibold text-slate-700">
                                Password
                            </label>

                            <input
                                type="password"
                                name="password"
                                value={
                                    formData.password
                                }
                                onChange={
                                    handleChange
                                }
                                placeholder="Developer password"
                                autoComplete="current-password"
                                required
                                className="w-full rounded-lg border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                            />

                        </div>


                        {/* Error */}

                        {error && (
                            <div className="rounded-lg border border-red-100 bg-red-50 px-4 py-3 text-sm leading-5 text-red-600">
                                {error}
                            </div>
                        )}


                        {/* Submit */}

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full rounded-lg bg-blue-600 px-5 py-3.5 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            {loading
                                ? "Authenticating..."
                                : "Developer Login"}
                        </button>

                    </form>


                    {/* Security Notice */}

                    <div className="mt-6 rounded-lg bg-slate-50 px-4 py-3">

                        <p className="text-xs leading-5 text-slate-500">
                            This area is restricted to the
                            authorized developer account.
                            Unauthorized access attempts
                            are denied by the server.
                        </p>

                    </div>

                </div>

            </div>

        </div>
    );
}

export default DeveloperLogin;