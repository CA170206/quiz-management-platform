import { useState } from "react";
import { useNavigate } from "react-router-dom";

const API_URL = "http://localhost:5000/api/auth/login";

function Login() {
    const navigate = useNavigate();

    const [loginType, setLoginType] = useState("student");

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
    };

    const handleLoginTypeChange = (type) => {
        setLoginType(type);
        setError("");

        setFormData({
            email: "",
            password: "",
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            setLoading(true);
            setError("");

            const response = await fetch(API_URL, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formData),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message || "Login failed"
                );
            }

            // Store token
            localStorage.setItem("token", data.token);

            // Store user information if backend returns it
            if (data.user) {
                localStorage.setItem(
                    "user",
                    JSON.stringify(data.user)
                );
            }

            /*
             * IMPORTANT:
             * The selected login type is NOT trusted.
             * The actual role comes from the backend.
             */

            const role = data.user?.role;

            if (role === "admin") {
                navigate("/admin/dashboard");
            } else if (role === "student") {
                navigate("/student/dashboard");
            } else {
                // Fallback if backend doesn't return user yet
                navigate(
                    loginType === "admin"
                        ? "/admin/dashboard"
                        : "/student/dashboard"
                );
            }

        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 px-6 py-12">
            <div className="mx-auto flex min-h-[80vh] max-w-md items-center justify-center">

                <div className="w-full rounded-2xl bg-white p-8 shadow-sm ring-1 ring-slate-200">

                    {/* Header */}
                    <div className="mb-7 text-center">

                        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-xl bg-blue-600 text-xl font-bold text-white">
                            Q
                        </div>

                        <h1 className="mt-5 text-2xl font-bold text-slate-900">
                            Welcome Back
                        </h1>

                        <p className="mt-2 text-sm text-slate-500">
                            Sign in to continue to QuizMaster.
                        </p>

                    </div>

                    {/* Login Type */}
                    <div className="mb-6 rounded-xl bg-slate-100 p-1">

                        <div className="grid grid-cols-2 gap-1">

                            <button
                                type="button"
                                onClick={() =>
                                    handleLoginTypeChange(
                                        "student"
                                    )
                                }
                                className={`rounded-lg px-4 py-3 text-sm font-semibold transition ${
                                    loginType === "student"
                                        ? "bg-white text-blue-600 shadow-sm"
                                        : "text-slate-500 hover:text-slate-700"
                                }`}
                            >
                                🎓 Student Login
                            </button>

                            <button
                                type="button"
                                onClick={() =>
                                    handleLoginTypeChange(
                                        "admin"
                                    )
                                }
                                className={`rounded-lg px-4 py-3 text-sm font-semibold transition ${
                                    loginType === "admin"
                                        ? "bg-white text-blue-600 shadow-sm"
                                        : "text-slate-500 hover:text-slate-700"
                                }`}
                            >
                                🛡️ Admin Login
                            </button>

                        </div>
                    </div>

                    {/* Selected Login Type */}
                    <div className="mb-6 rounded-lg border border-blue-100 bg-blue-50 px-4 py-3">

                        <p className="text-xs font-semibold uppercase tracking-wide text-blue-500">
                            Signing in as
                        </p>

                        <p className="mt-1 text-sm font-bold text-blue-700">
                            {loginType === "student"
                                ? "Student"
                                : "Administrator"}
                        </p>

                    </div>

                    {/* Error */}
                    {error && (
                        <div className="mb-5 rounded-lg border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-600">
                            {error}
                        </div>
                    )}

                    {/* Form */}
                    <form
                        onSubmit={handleSubmit}
                        className="space-y-5"
                    >

                        {/* Email */}
                        <div>
                            <label
                                htmlFor="email"
                                className="mb-2 block text-sm font-semibold text-slate-700"
                            >
                                Email Address
                            </label>

                            <input
                                id="email"
                                name="email"
                                type="email"
                                required
                                value={formData.email}
                                onChange={handleChange}
                                placeholder={
                                    loginType === "admin"
                                        ? "admin@quizmaster.com"
                                        : "you@example.com"
                                }
                                className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                            />
                        </div>

                        {/* Password */}
                        <div>
                            <label
                                htmlFor="password"
                                className="mb-2 block text-sm font-semibold text-slate-700"
                            >
                                Password
                            </label>

                            <input
                                id="password"
                                name="password"
                                type="password"
                                required
                                value={formData.password}
                                onChange={handleChange}
                                placeholder="Enter your password"
                                className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                            />
                        </div>

                        {/* Login */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full rounded-lg bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            {loading
                                ? "Signing in..."
                                : loginType === "admin"
                                ? "Sign In as Admin"
                                : "Sign In as Student"}
                        </button>

                    </form>

                    {/* Signup */}
                    {loginType === "student" && (
                        <div className="mt-6 border-t border-slate-100 pt-6 text-center">
                            <p className="text-sm text-slate-500">
                                Don't have an account?{" "}

                                <button
                                    type="button"
                                    onClick={() =>
                                        navigate(
                                            "/register"
                                        )
                                    }
                                    className="font-semibold text-blue-600 hover:text-blue-700"
                                >
                                    Create an account
                                </button>
                            </p>
                        </div>
                    )}

                    {/* Admin note */}
                    {loginType === "admin" && (
                        <div className="mt-6 border-t border-slate-100 pt-5 text-center">
                            <p className="text-xs leading-5 text-slate-400">
                                Administrator accounts are created
                                separately and cannot be created
                                through student registration.
                            </p>
                        </div>
                    )}

                </div>
            </div>
        </div>
    );
}

export default Login;