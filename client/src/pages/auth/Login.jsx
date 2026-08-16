import { useState } from "react";
import { useNavigate } from "react-router-dom";

const API_URL = `${import.meta.env.VITE_API_URL}/api/auth/login`;

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
                body: JSON.stringify({
                    ...formData,
                    loginType,
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message || "Login failed"
                );
            }

            if (!data.token) {
                throw new Error(
                    "Login succeeded but no token was received."
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

            const role = data.user?.role;

            if (role === "admin") {
                window.location.href = "/admin/dashboard";
            } else if (role === "student") {
                window.location.href = "/student/dashboard";
            } else {
                throw new Error(
                    "Invalid user role received from server."
                );
            }

        } catch (err) {
            console.error("Login error:", err);

            setError(
                err.message ||
                "Something went wrong during login."
            );
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
                            Welcome Back
                        </h1>

                        <p className="mt-2 text-sm leading-6 text-slate-500">
                            Sign in to continue to TryQuizzers.
                        </p>

                    </div>


                    {/* ============================== */}
                    {/* LOGIN TYPE */}
                    {/* ============================== */}

                    <div className="mb-6 rounded-2xl bg-slate-100 p-1">

                        <div className="grid grid-cols-2 gap-1">

                            <button
                                type="button"
                                onClick={() =>
                                    handleLoginTypeChange(
                                        "student"
                                    )
                                }
                                className={`
                                    rounded-xl
                                    px-3
                                    py-3
                                    text-sm
                                    font-semibold
                                    transition-all
                                    sm:px-4
                                    ${
                                        loginType === "student"
                                            ? "bg-white text-black shadow-sm"
                                            : "text-slate-500 hover:text-black"
                                    }
                                `}
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
                                className={`
                                    rounded-xl
                                    px-3
                                    py-3
                                    text-sm
                                    font-semibold
                                    transition-all
                                    sm:px-4
                                    ${
                                        loginType === "admin"
                                            ? "bg-white text-black shadow-sm"
                                            : "text-slate-500 hover:text-black"
                                    }
                                `}
                            >
                                🛡️ Admin Login
                            </button>

                        </div>

                    </div>


                    {/* ============================== */}
                    {/* SELECTED LOGIN TYPE */}
                    {/* ============================== */}

                    <div className="mb-6 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3.5">

                        <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                            Signing in as
                        </p>

                        <p className="mt-1 text-sm font-bold text-black">
                            {loginType === "student"
                                ? "Student"
                                : "Administrator"}
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
                                placeholder={
                                    loginType === "admin"
                                        ? "admin@tryquizzers.com"
                                        : "you@example.com"
                                }
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
                                value={formData.password}
                                onChange={handleChange}
                                placeholder="Enter your password"
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


                        {/* Login */}

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
                                ? "Signing in..."
                                : loginType === "admin"
                                ? "Sign In as Admin"
                                : "Sign In as Student"}
                        </button>

                    </form>


                    {/* ============================== */}
                    {/* SIGN UP */}
                    {/* ============================== */}

                    {loginType === "student" && (
                        <div className="mt-6 border-t border-slate-100 pt-6 text-center">

                            <p className="text-sm text-slate-500">

                                Don't have an account?{" "}

                                <button
                                    type="button"
                                    onClick={() =>
                                        navigate("/register")
                                    }
                                    className="
                                        font-semibold
                                        text-black
                                        transition
                                        hover:underline
                                    "
                                >
                                    Create an account
                                </button>

                            </p>

                        </div>
                    )}


                    {/* ============================== */}
                    {/* ADMIN NOTE */}
                    {/* ============================== */}

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