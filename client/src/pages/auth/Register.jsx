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

    // =========================================================
    // HANDLE INPUT
    // =========================================================

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });

        setError("");
    };

    // =========================================================
    // REGISTER
    // =========================================================

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

            // =================================================
            // LOCAL STORAGE
            // =================================================

            localStorage.setItem(
                "token",
                data.token
            );

            if (data.user) {
                localStorage.setItem(
                    "user",
                    JSON.stringify(data.user)
                );
            }

            // =================================================
            // SESSION STORAGE
            // =================================================

            sessionStorage.setItem(
                "token",
                data.token
            );

            if (data.user) {
                sessionStorage.setItem(
                    "user",
                    JSON.stringify(data.user)
                );
            }

            // =================================================
            // DASHBOARD
            // =================================================

            navigate("/student/dashboard");

        } catch (err) {
            setError(
                err.message ||
                    "Something went wrong during registration."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div
            className="
                min-h-screen
                bg-white
                px-4
                py-20
                text-slate-950
                transition-colors
                duration-300
                dark:bg-[#0a0a0a]
                dark:text-white
                sm:px-6
                sm:py-24
            "
        >

            <div
                className="
                    mx-auto
                    flex
                    min-h-[calc(100vh-10rem)]
                    w-full
                    max-w-md
                    items-center
                    justify-center
                    sm:min-h-[calc(100vh-12rem)]
                "
            >

                {/* =================================================
                    REGISTER CARD
                ================================================= */}

                <div
                    className="
                        w-full
                        rounded-[1.5rem]
                        bg-white
                        p-5
                        shadow-[0_20px_60px_rgba(15,23,42,0.08)]
                        ring-1
                        ring-slate-200
                        transition-all
                        duration-300
                        dark:bg-[#111111]
                        dark:shadow-black/40
                        dark:ring-white/10
                        sm:rounded-[1.75rem]
                        sm:p-8
                    "
                >

                    {/* =================================================
                        HEADER
                    ================================================= */}

                    <div className="mb-7 text-center sm:mb-8">

                        {/* LOGO */}

                        <div
                            className="
                                mx-auto
                                flex
                                h-16
                                w-16
                                items-center
                                justify-center
                                overflow-hidden
                                rounded-2xl
                                bg-black
                                shadow-lg
                                shadow-slate-300/30
                                transition-transform
                                duration-300
                                hover:scale-105
                                dark:shadow-black/40
                                sm:h-[68px]
                                sm:w-[68px]
                            "
                        >
                            <img
                                src="/icon.svg"
                                alt="TryQuizzers"
                                className="h-full w-full object-contain"
                            />
                        </div>

                        <h1
                            className="
                                mt-5
                                text-2xl
                                font-black
                                tracking-tight
                                text-slate-950
                                transition-colors
                                duration-300
                                dark:text-white
                                sm:text-[28px]
                            "
                        >
                            Create Account
                        </h1>

                        <p
                            className="
                                mt-2
                                text-sm
                                leading-6
                                text-slate-500
                                dark:text-slate-400
                            "
                        >
                            Create your account and start your
                            learning journey with TryQuizzers.
                        </p>

                    </div>

                    {/* =================================================
                        ERROR
                    ================================================= */}

                    {error && (
                        <div
                            className="
                                mb-5
                                rounded-xl
                                border
                                border-red-200
                                bg-red-50
                                px-4
                                py-3
                                text-sm
                                leading-5
                                text-red-600
                                dark:border-red-500/20
                                dark:bg-red-500/10
                                dark:text-red-400
                            "
                        >
                            {error}
                        </div>
                    )}

                    {/* =================================================
                        FORM
                    ================================================= */}

                    <form
                        onSubmit={handleSubmit}
                        className="space-y-5"
                    >

                        {/* =================================================
                            FULL NAME
                        ================================================= */}

                        <div>

                            <label
                                htmlFor="full_name"
                                className="
                                    mb-2
                                    block
                                    text-sm
                                    font-semibold
                                    text-slate-800
                                    dark:text-slate-300
                                "
                            >
                                Full Name
                            </label>

                            <input
                                id="full_name"
                                name="full_name"
                                type="text"
                                required
                                autoComplete="name"
                                value={
                                    formData.full_name
                                }
                                onChange={
                                    handleChange
                                }
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
                                    transition-all
                                    duration-300
                                    placeholder:text-slate-400
                                    hover:border-slate-400
                                    focus:border-black
                                    focus:ring-2
                                    focus:ring-slate-100
                                    dark:border-white/10
                                    dark:bg-[#0f0f0f]
                                    dark:text-white
                                    dark:placeholder:text-slate-600
                                    dark:hover:border-white/20
                                    dark:focus:border-white
                                    dark:focus:ring-white/10
                                "
                            />

                        </div>

                        {/* =================================================
                            EMAIL
                        ================================================= */}

                        <div>

                            <label
                                htmlFor="email"
                                className="
                                    mb-2
                                    block
                                    text-sm
                                    font-semibold
                                    text-slate-800
                                    dark:text-slate-300
                                "
                            >
                                Email Address
                            </label>

                            <input
                                id="email"
                                name="email"
                                type="email"
                                required
                                autoComplete="email"
                                value={
                                    formData.email
                                }
                                onChange={
                                    handleChange
                                }
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
                                    transition-all
                                    duration-300
                                    placeholder:text-slate-400
                                    hover:border-slate-400
                                    focus:border-black
                                    focus:ring-2
                                    focus:ring-slate-100
                                    dark:border-white/10
                                    dark:bg-[#0f0f0f]
                                    dark:text-white
                                    dark:placeholder:text-slate-600
                                    dark:hover:border-white/20
                                    dark:focus:border-white
                                    dark:focus:ring-white/10
                                "
                            />

                        </div>

                        {/* =================================================
                            PASSWORD
                        ================================================= */}

                        <div>

                            <label
                                htmlFor="password"
                                className="
                                    mb-2
                                    block
                                    text-sm
                                    font-semibold
                                    text-slate-800
                                    dark:text-slate-300
                                "
                            >
                                Password
                            </label>

                            <input
                                id="password"
                                name="password"
                                type="password"
                                required
                                minLength={6}
                                autoComplete="new-password"
                                value={
                                    formData.password
                                }
                                onChange={
                                    handleChange
                                }
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
                                    transition-all
                                    duration-300
                                    placeholder:text-slate-400
                                    hover:border-slate-400
                                    focus:border-black
                                    focus:ring-2
                                    focus:ring-slate-100
                                    dark:border-white/10
                                    dark:bg-[#0f0f0f]
                                    dark:text-white
                                    dark:placeholder:text-slate-600
                                    dark:hover:border-white/20
                                    dark:focus:border-white
                                    dark:focus:ring-white/10
                                "
                            />

                            <p
                                className="
                                    mt-2
                                    text-xs
                                    text-slate-400
                                    dark:text-slate-500
                                "
                            >
                                Use at least 6 characters.
                            </p>

                        </div>

                        {/* =================================================
                            CREATE ACCOUNT
                        ================================================= */}

                        <button
                            type="submit"
                            disabled={loading}
                            className="
                                group
                                flex
                                w-full
                                items-center
                                justify-center
                                gap-2
                                rounded-xl
                                bg-black
                                px-5
                                py-3.5
                                text-sm
                                font-bold
                                text-white
                                shadow-lg
                                shadow-slate-300/30
                                transition-all
                                duration-300
                                hover:-translate-y-0.5
                                hover:bg-slate-800
                                hover:shadow-xl
                                active:scale-[0.99]
                                disabled:cursor-not-allowed
                                disabled:opacity-60
                                dark:shadow-black/40
                            "
                        >

                            {loading ? (
                                <>
                                    <span
                                        className="
                                            h-4
                                            w-4
                                            animate-spin
                                            rounded-full
                                            border-2
                                            border-white/30
                                            border-t-white
                                        "
                                    />

                                    Creating Account...
                                </>
                            ) : (
                                <>
                                    Create Account

                                    <span className="transition-transform duration-300 group-hover:translate-x-1">
                                        →
                                    </span>
                                </>
                            )}

                        </button>

                    </form>

                    {/* =================================================
                        LOGIN
                    ================================================= */}

                    <div
                        className="
                            mt-6
                            border-t
                            border-slate-100
                            pt-6
                            text-center
                            dark:border-white/10
                        "
                    >

                        <p
                            className="
                                text-sm
                                text-slate-500
                                dark:text-slate-400
                            "
                        >
                            Already have an account?{" "}

                            <button
                                type="button"
                                onClick={() =>
                                    navigate("/login")
                                }
                                className="
                                    font-bold
                                    text-black
                                    transition
                                    hover:underline
                                    dark:text-white
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