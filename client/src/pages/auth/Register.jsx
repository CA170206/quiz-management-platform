import { useState } from "react";
import { useNavigate } from "react-router-dom";

const API_URL = `${import.meta.env.VITE_API_URL}/api/auth/register`;

function Register() {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        full_name: "",
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
                    data.message || "Registration failed"
                );
            }

            if (!data.token) {
                throw new Error(
                    "Registration succeeded, but no login token was received."
                );
            }

            localStorage.setItem("token", data.token);

            if (data.user) {
                localStorage.setItem(
                    "user",
                    JSON.stringify(data.user)
                );
            }

            sessionStorage.setItem("token", data.token);

            if (data.user) {
                sessionStorage.setItem(
                    "user",
                    JSON.stringify(data.user)
                );
            }

            navigate("/student/dashboard");

        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 px-4 py-8 sm:px-6 sm:py-12">

            <div className="mx-auto flex min-h-[calc(100vh-4rem)] w-full max-w-md items-center justify-center sm:min-h-[80vh]">

                <div className="w-full rounded-[24px] bg-white p-6 shadow-[0_12px_40px_rgba(15,23,42,0.08)] ring-1 ring-slate-200 sm:p-8">

                    {/* ============================== */}
                    {/* HEADER */}
                    {/* ============================== */}

                    <div className="mb-7 text-center sm:mb-8">

                        <div className="mx-auto flex h-16 w-16 items-center justify-center overflow-hidden rounded-2xl bg-black sm:h-[68px] sm:w-[68px]">
                            <img
                                src="/icon.svg"
                                alt="TryQuizzers"
                                className="h-full w-full object-contain"
                            />
                        </div>

                        <h1 className="mt-5 text-2xl font-bold tracking-tight text-black sm:text-[28px]">
                            Create Account
                        </h1>

                        <p className="mt-2 text-sm leading-6 text-slate-500">
                            Create your account and start your
                            learning journey with TryQuizzers.
                        </p>

                    </div>


                    {/* ============================== */}
                    {/* ERROR */}
                    {/* ============================== */}

                    {error && (
                        <div className="mb-5 rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm leading-5 text-red-600">
                            {error}
                        </div>
                    )}


                    {/* ============================== */}
                    {/* FORM */}
                    {/* ============================== */}

                    <form
                        onSubmit={handleSubmit}
                        className="space-y-5"
                    >

                        {/* Full Name */}

                        <div>

                            <label
                                htmlFor="full_name"
                                className="mb-2 block text-sm font-semibold text-slate-800"
                            >
                                Full Name
                            </label>

                            <input
                                id="full_name"
                                name="full_name"
                                type="text"
                                required
                                value={formData.full_name}
                                onChange={handleChange}
                                placeholder="Enter your full name"
                                className="
                                    w-full
                                    rounded-xl
                                    border
                                    border-slate-300
                                    bg-white
                                    px-4
                                    py-3.5
                                    text-sm
                                    text-slate-900
                                    outline-none
                                    transition
                                    placeholder:text-slate-400
                                    hover:border-slate-400
                                    focus:border-black
                                    focus:ring-2
                                    focus:ring-slate-100
                                "
                            />

                        </div>


                        {/* Email */}

                        <div>

                            <label
                                htmlFor="email"
                                className="mb-2 block text-sm font-semibold text-slate-800"
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
                                placeholder="you@example.com"
                                className="
                                    w-full
                                    rounded-xl
                                    border
                                    border-slate-300
                                    bg-white
                                    px-4
                                    py-3.5
                                    text-sm
                                    text-slate-900
                                    outline-none
                                    transition
                                    placeholder:text-slate-400
                                    hover:border-slate-400
                                    focus:border-black
                                    focus:ring-2
                                    focus:ring-slate-100
                                "
                            />

                        </div>


                        {/* Password */}

                        <div>

                            <label
                                htmlFor="password"
                                className="mb-2 block text-sm font-semibold text-slate-800"
                            >
                                Password
                            </label>

                            <input
                                id="password"
                                name="password"
                                type="password"
                                required
                                minLength={6}
                                value={formData.password}
                                onChange={handleChange}
                                placeholder="Create a password"
                                className="
                                    w-full
                                    rounded-xl
                                    border
                                    border-slate-300
                                    bg-white
                                    px-4
                                    py-3.5
                                    text-sm
                                    text-slate-900
                                    outline-none
                                    transition
                                    placeholder:text-slate-400
                                    hover:border-slate-400
                                    focus:border-black
                                    focus:ring-2
                                    focus:ring-slate-100
                                "
                            />

                            <p className="mt-2 text-xs text-slate-400">
                                Use at least 6 characters.
                            </p>

                        </div>


                        {/* Create Account */}

                        <button
                            type="submit"
                            disabled={loading}
                            className="
                                w-full
                                rounded-xl
                                bg-black
                                px-5
                                py-3.5
                                text-sm
                                font-semibold
                                text-white
                                shadow-sm
                                transition
                                hover:bg-slate-800
                                active:scale-[0.99]
                                disabled:cursor-not-allowed
                                disabled:opacity-60
                            "
                        >
                            {loading
                                ? "Creating Account..."
                                : "Create Account"}
                        </button>

                    </form>


                    {/* ============================== */}
                    {/* LOGIN */}
                    {/* ============================== */}

                    <div className="mt-6 border-t border-slate-100 pt-6 text-center">

                        <p className="text-sm text-slate-500">

                            Already have an account?{" "}

                            <button
                                type="button"
                                onClick={() =>
                                    navigate("/login")
                                }
                                className="
                                    font-semibold
                                    text-black
                                    transition
                                    hover:underline
                                "
                            >
                                Sign In
                            </button>

                        </p>

                    </div>

                </div>

            </div>

        </div>
    );
}

export default Register;