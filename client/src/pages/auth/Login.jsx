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
    // LOGIN TYPE
    // =========================================================

    const handleLoginTypeChange = (type) => {
        setLoginType(type);
        setError("");

        setFormData({
            email: "",
            password: "",
        });
    };

    // =========================================================
    // LOGIN
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

                body: JSON.stringify({
                    ...formData,
                    loginType,
                }),
            });

            const data = await response.json();

            console.log("Login response:", data);

            if (!response.ok) {
                throw new Error(
                    data.message || "Login failed"
                );
            }

            // =================================================
            // TOKEN VALIDATION
            // =================================================

            if (!data.token) {
                throw new Error(
                    "Login succeeded but no token was received."
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
            // ROLE FROM BACKEND
            // =================================================

            const role = data.user?.role;

            console.log(
                "Logged in role:",
                role
            );

            if (role === "admin") {
                window.location.href =
                    "/admin/dashboard";
            } else if (role === "student") {
                window.location.href =
                    "/student/dashboard";
            } else {
                throw new Error(
                    "Invalid user role received from server."
                );
            }

        } catch (err) {
            console.error(
                "Login error:",
                err
            );

            setError(
                err.message ||
                    "Something went wrong during login."
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
                    LOGIN CARD
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

                    <div className="mb-7 text-center">

                        {/* LOGO */}

                        <div
                            className="
                                mx-auto
                                flex
                                h-14
                                w-14
                                items-center
                                justify-center
                                rounded-2xl
                                bg-black
                                text-xl
                                font-black
                                text-white
                                shadow-lg
                                shadow-slate-300/30
                                transition-transform
                                duration-300
                                hover:scale-105
                                dark:shadow-black/40
                            "
                        >
                            T
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
                                sm:text-3xl
                            "
                        >
                            Welcome Back
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
                            Sign in to continue to TryQuizzers.
                        </p>

                    </div>

                    {/* =================================================
                        LOGIN TYPE
                    ================================================= */}

                    <div
                        className="
                            mb-6
                            rounded-2xl
                            bg-slate-100
                            p-1
                            transition-colors
                            duration-300
                            dark:bg-[#1c1c1c]
                        "
                    >

                        <div className="grid grid-cols-2 gap-1">

                            {/* STUDENT */}

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
                                    text-xs
                                    font-bold
                                    transition-all
                                    duration-300
                                    sm:px-4
                                    sm:text-sm
                                    ${
                                        loginType ===
                                        "student"
                                            ? "bg-black text-white shadow-sm"
                                            : "text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
                                    }
                                `}
                            >
                                🎓 Student Login
                            </button>

                            {/* ADMIN */}

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
                                    text-xs
                                    font-bold
                                    transition-all
                                    duration-300
                                    sm:px-4
                                    sm:text-sm
                                    ${
                                        loginType ===
                                        "admin"
                                            ? "bg-black text-white shadow-sm"
                                            : "text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
                                    }
                                `}
                            >
                                🛡️ Admin Login
                            </button>

                        </div>

                    </div>

                    {/* =================================================
                        SELECTED LOGIN TYPE
                    ================================================= */}

                    <div
                        className="
                            mb-6
                            rounded-xl
                            border
                            border-slate-200
                            bg-slate-50
                            px-4
                            py-3
                            transition-colors
                            duration-300
                            dark:border-white/10
                            dark:bg-[#181818]
                        "
                    >

                        <p
                            className="
                                text-[10px]
                                font-bold
                                uppercase
                                tracking-[0.16em]
                                text-slate-400
                            "
                        >
                            Signing in as
                        </p>

                        <p
                            className="
                                mt-1
                                text-sm
                                font-black
                                text-slate-900
                                dark:text-white
                            "
                        >
                            {loginType === "student"
                                ? "Student"
                                : "Administrator"}
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

                        {/* EMAIL */}

                        <div>

                            <label
                                htmlFor="email"
                                className="
                                    mb-2
                                    block
                                    text-sm
                                    font-semibold
                                    text-slate-700
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
                                placeholder={
                                    loginType ===
                                    "admin"
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
                                    transition-all
                                    duration-300
                                    placeholder:text-slate-400
                                    focus:border-black
                                    focus:ring-2
                                    focus:ring-slate-200
                                    dark:border-white/10
                                    dark:bg-[#0f0f0f]
                                    dark:text-white
                                    dark:placeholder:text-slate-600
                                    dark:focus:border-white
                                    dark:focus:ring-white/10
                                "
                            />

                        </div>

                        {/* PASSWORD */}

                        <div>

                            <label
                                htmlFor="password"
                                className="
                                    mb-2
                                    block
                                    text-sm
                                    font-semibold
                                    text-slate-700
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
                                autoComplete="current-password"
                                value={
                                    formData.password
                                }
                                onChange={
                                    handleChange
                                }
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
                                    transition-all
                                    duration-300
                                    placeholder:text-slate-400
                                    focus:border-black
                                    focus:ring-2
                                    focus:ring-slate-200
                                    dark:border-white/10
                                    dark:bg-[#0f0f0f]
                                    dark:text-white
                                    dark:placeholder:text-slate-600
                                    dark:focus:border-white
                                    dark:focus:ring-white/10
                                "
                            />

                        </div>

                        {/* =================================================
                            LOGIN BUTTON
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

                                    Signing in...
                                </>
                            ) : (
                                <>
                                    {loginType ===
                                    "admin"
                                        ? "Sign In as Admin"
                                        : "Sign In as Student"}

                                    <span className="transition-transform duration-300 group-hover:translate-x-1">
                                        →
                                    </span>
                                </>
                            )}

                        </button>

                    </form>

                    {/* =================================================
                        SIGN UP
                    ================================================= */}

                    {loginType === "student" && (
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
                                Don't have an account?{" "}

                                <button
                                    type="button"
                                    onClick={() =>
                                        navigate(
                                            "/register"
                                        )
                                    }
                                    className="
                                        font-bold
                                        text-black
                                        transition
                                        hover:underline
                                        dark:text-white
                                    "
                                >
                                    Create an account
                                </button>

                            </p>

                        </div>
                    )}

                    {/* =================================================
                        ADMIN NOTE
                    ================================================= */}

                    {loginType === "admin" && (
                        <div
                            className="
                                mt-6
                                border-t
                                border-slate-100
                                pt-5
                                text-center
                                dark:border-white/10
                            "
                        >

                            <p
                                className="
                                    text-xs
                                    leading-5
                                    text-slate-400
                                    dark:text-slate-500
                                "
                            >
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