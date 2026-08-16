import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function AuthPage() {
    const navigate = useNavigate();

    const [menuOpen, setMenuOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);

    const [stats, setStats] = useState({
        categories: 0,
        quizzes: 0,
        questions: 0,
    });

    const [loadingStats, setLoadingStats] = useState(true);

    /* =========================================================
       NAVBAR SCROLL
    ========================================================= */

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 45);
        };

        window.addEventListener("scroll", handleScroll);

        return () => {
            window.removeEventListener("scroll", handleScroll);
        };
    }, []);


    /* =========================================================
       REAL PLATFORM DATA
    ========================================================= */

    useEffect(() => {
        const fetchPlatformStats = async () => {
            try {
                const API_URL =
                    import.meta.env.VITE_API_URL ||
                    "http://localhost:5000";

                const [
                    categoriesRes,
                    quizzesRes,
                    questionsRes,
                ] = await Promise.all([
                    fetch(`${API_URL}/api/categories`),
                    fetch(`${API_URL}/api/quizzes`),
                    fetch(`${API_URL}/api/questions`),
                ]);

                const categoriesData = categoriesRes.ok
                    ? await categoriesRes.json()
                    : {};

                const quizzesData = quizzesRes.ok
                    ? await quizzesRes.json()
                    : {};

                const questionsData = questionsRes.ok
                    ? await questionsRes.json()
                    : {};

                setStats({
                    categories:
                        Array.isArray(categoriesData.categories)
                            ? categoriesData.categories.length
                            : Array.isArray(categoriesData)
                                ? categoriesData.length
                                : 0,

                    quizzes:
                        Array.isArray(quizzesData.quizzes)
                            ? quizzesData.quizzes.length
                            : Array.isArray(quizzesData)
                                ? quizzesData.length
                                : 0,

                    questions:
                        Array.isArray(questionsData.questions)
                            ? questionsData.questions.length
                            : Array.isArray(questionsData)
                                ? questionsData.length
                                : 0,
                });
            } catch (error) {
                console.error(
                    "Failed to fetch platform statistics:",
                    error
                );
            } finally {
                setLoadingStats(false);
            }
        };

        fetchPlatformStats();
    }, []);


    /* =========================================================
       NAVIGATION
    ========================================================= */

    const scrollToSection = (id) => {
        setMenuOpen(false);

        const section = document.getElementById(id);

        if (section) {
            section.scrollIntoView({
                behavior: "smooth",
                block: "start",
            });
        }
    };


    return (
        <div className="min-h-screen overflow-x-hidden bg-slate-50 text-slate-950">


            {/* =====================================================
                FLOATING NAVBAR
                Inspired by the supplied video:
                - floating pill
                - no border
                - matte background
                - animated vertical light panels
                - compact typography
                - black CTA
            ===================================================== */}

            <header className="fixed left-0 right-0 top-0 z-50 px-3 pt-3 sm:px-5 sm:pt-4 lg:px-8">

                <div
                    className={`
                        navbar-shimmer
                        relative mx-auto flex items-center
                        justify-between overflow-hidden
                        bg-[#f5f3ee]/95
                        backdrop-blur-xl
                        shadow-[0_12px_35px_rgba(15,23,42,0.10)]
                        transition-all duration-500 ease-out

                        ${
                            scrolled
                                ? "max-w-5xl rounded-full px-4 py-2 sm:px-5"
                                : "max-w-6xl rounded-full px-5 py-2.5 sm:px-7"
                        }
                    `}
                >

                    {/* =================================================
                        ANIMATED BACKGROUND
                    ================================================= */}

                    <div className="pointer-events-none absolute inset-0 overflow-hidden">

                        <div className="navbar-light-sweep" />

                    </div>


                    {/* =================================================
                        BRAND
                        No icon — text only
                    ================================================= */}

                    <button
                        onClick={() => {
                            setMenuOpen(false);

                            window.scrollTo({
                                top: 0,
                                behavior: "smooth",
                            });
                        }}
                        className="relative z-10 shrink-0 rounded-full px-1 py-1"
                    >

                        <span
                            className="
                                block
                                font-black
                                tracking-[-0.055em]
                                text-slate-950
                                transition-all duration-300
                                text-[18px]
                                sm:text-[20px]
                            "
                            style={{
                                fontFamily:
                                    "'Arial', 'Helvetica Neue', sans-serif",
                            }}
                        >
                            TryQuizzers
                        </span>

                    </button>


                    {/* =================================================
                        DESKTOP NAV
                    ================================================= */}

                    <nav className="relative z-10 hidden items-center gap-1 lg:flex">

                        <button
                            onClick={() => scrollToSection("home")}
                            className="
                                rounded-full
                                bg-white/75
                                px-4 py-2
                                text-[12px]
                                font-semibold
                                tracking-[-0.01em]
                                text-slate-950
                                shadow-sm
                                transition-all duration-300
                                hover:bg-white
                            "
                        >
                            Home
                        </button>

                        <button
                            onClick={() => scrollToSection("features")}
                            className="
                                rounded-full
                                px-4 py-2
                                text-[12px]
                                font-medium
                                tracking-[-0.01em]
                                text-slate-500
                                transition-all duration-300
                                hover:bg-white/70
                                hover:text-slate-950
                            "
                        >
                            Features
                        </button>

                        <button
                            onClick={() =>
                                scrollToSection("how-it-works")
                            }
                            className="
                                rounded-full
                                px-4 py-2
                                text-[12px]
                                font-medium
                                tracking-[-0.01em]
                                text-slate-500
                                transition-all duration-300
                                hover:bg-white/70
                                hover:text-slate-950
                            "
                        >
                            How It Works
                        </button>

                        <button
                            onClick={() =>
                                scrollToSection("about")
                            }
                            className="
                                rounded-full
                                px-4 py-2
                                text-[12px]
                                font-medium
                                tracking-[-0.01em]
                                text-slate-500
                                transition-all duration-300
                                hover:bg-white/70
                                hover:text-slate-950
                            "
                        >
                            About
                        </button>

                    </nav>


                    {/* =================================================
                        RIGHT ACTION
                    ================================================= */}

                    <div className="relative z-10 hidden items-center gap-2 lg:flex">

                        <button
                            onClick={() => navigate("/login")}
                            className="
                                rounded-full
                                px-4 py-2
                                text-[12px]
                                font-medium
                                text-slate-600
                                transition
                                hover:bg-white/70
                                hover:text-slate-950
                            "
                        >
                            Sign In
                        </button>

                        <button
                            onClick={() => navigate("/register")}
                            className="
                                group
                                flex items-center gap-2
                                rounded-full
                                bg-slate-950
                                px-4 py-2.5
                                text-[11px]
                                font-bold
                                tracking-wide
                                text-white
                                shadow-sm
                                transition-all duration-300
                                hover:bg-slate-800
                                hover:shadow-lg
                            "
                        >

                            <span className="h-1.5 w-1.5 rounded-full bg-white transition-transform duration-300 group-hover:scale-125" />

                            Start a Quiz

                        </button>

                    </div>


                    {/* =================================================
                        MOBILE MENU BUTTON
                    ================================================= */}

                    <button
                        onClick={() => setMenuOpen(!menuOpen)}
                        className="
                            relative z-10
                            flex h-10 w-10
                            items-center justify-center
                            rounded-full
                            bg-white/70
                            text-slate-800
                            transition
                            hover:bg-white
                            lg:hidden
                        "
                        aria-label="Toggle navigation"
                    >

                        {menuOpen ? (
                            <span className="text-2xl leading-none">
                                ×
                            </span>
                        ) : (
                            <div className="space-y-1.5">

                                <span className="block h-0.5 w-5 rounded-full bg-slate-800" />

                                <span className="block h-0.5 w-5 rounded-full bg-slate-800" />

                                <span className="block h-0.5 w-5 rounded-full bg-slate-800" />

                            </div>
                        )}

                    </button>

                </div>


                {/* =================================================
                    MOBILE MENU
                ================================================= */}

                {menuOpen && (

                    <div
                        className="
                            mx-auto mt-2 max-w-6xl
                            overflow-hidden
                            rounded-[1.75rem]
                            bg-[#f5f3ee]/95
                            p-2
                            shadow-[0_15px_40px_rgba(15,23,42,0.12)]
                            backdrop-blur-xl
                            lg:hidden
                        "
                    >

                        <button
                            onClick={() =>
                                scrollToSection("home")
                            }
                            className="
                                w-full rounded-2xl
                                bg-slate-950
                                px-4 py-3
                                text-left
                                text-sm font-semibold
                                text-white
                            "
                        >
                            Home
                        </button>

                        <button
                            onClick={() =>
                                scrollToSection("features")
                            }
                            className="
                                w-full rounded-2xl
                                px-4 py-3
                                text-left
                                text-sm font-medium
                                text-slate-600
                                transition
                                hover:bg-white
                            "
                        >
                            Features
                        </button>

                        <button
                            onClick={() =>
                                scrollToSection("how-it-works")
                            }
                            className="
                                w-full rounded-2xl
                                px-4 py-3
                                text-left
                                text-sm font-medium
                                text-slate-600
                                transition
                                hover:bg-white
                            "
                        >
                            How It Works
                        </button>

                        <button
                            onClick={() =>
                                scrollToSection("about")
                            }
                            className="
                                w-full rounded-2xl
                                px-4 py-3
                                text-left
                                text-sm font-medium
                                text-slate-600
                                transition
                                hover:bg-white
                            "
                        >
                            About
                        </button>


                        <div className="mt-1 grid grid-cols-2 gap-2 p-1">

                            <button
                                onClick={() => {
                                    setMenuOpen(false);
                                    navigate("/login");
                                }}
                                className="
                                    rounded-2xl
                                    bg-white
                                    px-4 py-3
                                    text-sm font-semibold
                                    text-slate-700
                                "
                            >
                                Sign In
                            </button>

                            <button
                                onClick={() => {
                                    setMenuOpen(false);
                                    navigate("/register");
                                }}
                                className="
                                    rounded-2xl
                                    bg-slate-950
                                    px-4 py-3
                                    text-sm font-semibold
                                    text-white
                                "
                            >
                                Get Started
                            </button>

                        </div>

                    </div>

                )}

            </header>


            {/* =====================================================
                NAVBAR ANIMATION STYLES
            ===================================================== */}

            <style>{`

                .navbar-shimmer {
                    isolation: isolate;
                }

                .navbar-light-sweep {
                    position: absolute;
                    top: 0;
                    bottom: 0;
                    left: -45%;
                    width: 45%;
                    pointer-events: none;

                    background:
                        repeating-linear-gradient(
                            90deg,
                            rgba(255,255,255,0) 0px,
                            rgba(255,255,255,0) 22px,
                            rgba(255,255,255,0.62) 23px,
                            rgba(255,255,255,0.62) 48px,
                            rgba(255,255,255,0) 49px,
                            rgba(255,255,255,0) 72px
                        );

                    filter: blur(1px);

                    animation:
                        navbarSweep 7s
                        cubic-bezier(0.65, 0, 0.35, 1)
                        infinite;
                }

                @keyframes navbarSweep {

                    0% {
                        transform: translateX(0);
                        opacity: 0;
                    }

                    8% {
                        opacity: 0.75;
                    }

                    50% {
                        opacity: 0.9;
                    }

                    92% {
                        opacity: 0.75;
                    }

                    100% {
                        transform: translateX(330%);
                        opacity: 0;
                    }

                }

                @media (prefers-reduced-motion: reduce) {

                    .navbar-light-sweep {
                        animation: none;
                        opacity: 0;
                    }

                }

            `}</style>


            {/* =====================================================
                MAIN
            ===================================================== */}

            <main className="pt-20 sm:pt-24">


                {/* =================================================
                    HERO
                ================================================= */}

                <section
                    id="home"
                    className="scroll-mt-24 overflow-hidden"
                >

                    <div
                        className="
                            mx-auto grid max-w-7xl
                            items-start
                            gap-10
                            px-4 py-7
                            sm:px-6 sm:py-9
                            lg:grid-cols-[0.95fr_1.05fr]
                            lg:gap-14
                            lg:px-8 lg:py-10
                        "
                    >


                        {/* =================================================
                            LEFT HERO
                        ================================================= */}

                        <div className="max-w-2xl pt-4 sm:pt-6 lg:pt-10">

                            <div
                                className="
                                    mb-5 inline-flex
                                    items-center gap-2
                                    rounded-full
                                    bg-slate-100
                                    px-4 py-2
                                    text-xs font-semibold
                                    text-slate-800
                                    sm:text-sm
                                "
                            >

                                <span className="h-2 w-2 rounded-full bg-slate-950" />

                                Smarter way to practice

                            </div>


                            <h1
                                className="
                                    text-[2.7rem]
                                    font-black
                                    leading-[0.98]
                                    tracking-[-0.055em]
                                    text-slate-950
                                    sm:text-5xl
                                    md:text-6xl
                                    lg:text-[3.7rem]
                                "
                            >

                                Test your
                                <br />

                                knowledge.

                                <span className="block">
                                    Improve your skills.
                                </span>

                            </h1>


                            <p
                                className="
                                    mt-5 max-w-xl
                                    text-base
                                    leading-7
                                    text-slate-500
                                    sm:text-lg
                                    sm:leading-8
                                "
                            >
                                Practice quizzes, track your performance,
                                discover your strengths, and compete with
                                other students on TryQuizzers.
                            </p>


                            <div className="mt-7 flex flex-col gap-3 sm:flex-row">

                                <button
                                    onClick={() =>
                                        navigate("/register")
                                    }
                                    className="
                                        rounded-xl
                                        bg-slate-950
                                        px-6 py-3.5
                                        text-sm font-semibold
                                        text-white
                                        shadow-lg
                                        shadow-slate-300
                                        transition
                                        hover:-translate-y-0.5
                                        hover:bg-slate-800
                                    "
                                >
                                    Get Started →
                                </button>

                                <button
                                    onClick={() =>
                                        navigate("/login")
                                    }
                                    className="
                                        rounded-xl
                                        bg-white
                                        px-6 py-3.5
                                        text-sm font-semibold
                                        text-slate-700
                                        shadow-sm
                                        ring-1 ring-slate-200
                                        transition
                                        hover:bg-slate-50
                                    "
                                >
                                    Sign In
                                </button>

                            </div>


                            <div
                                className="
                                    mt-6 flex flex-wrap
                                    gap-x-5 gap-y-2
                                    text-xs text-slate-400
                                    sm:text-sm
                                "
                            >

                                <span>✓ Practice quizzes</span>

                                <span>✓ Instant results</span>

                                <span>✓ Performance analytics</span>

                            </div>

                        </div>


                        {/* =================================================
                            RIGHT PREVIEW
                        ================================================= */}

                        <div className="relative w-full">

                            <div className="absolute -right-10 -top-10 -z-10 h-40 w-40 rounded-full bg-slate-300/40 blur-3xl" />

                            <div className="absolute -bottom-10 -left-10 -z-10 h-40 w-40 rounded-full bg-slate-300/40 blur-3xl" />


                            <div
                                className="
                                    relative overflow-hidden
                                    rounded-[1.75rem]
                                    bg-white
                                    p-4
                                    shadow-2xl
                                    shadow-slate-200/70
                                    ring-1 ring-slate-200/70
                                    sm:p-5
                                "
                            >


                                {/* PREVIEW HEADER */}

                                <div className="flex items-center justify-between">

                                    <div>

                                        <p
                                            className="
                                                text-lg
                                                font-black
                                                tracking-[-0.04em]
                                                text-slate-950
                                            "
                                        >
                                            TryQuizzers
                                        </p>

                                        <p className="text-[11px] text-slate-400 sm:text-xs">
                                            Your learning platform
                                        </p>

                                    </div>


                                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-100">
                                        🔔
                                    </div>

                                </div>


                                {/* PREVIEW HERO */}

                                <div
                                    className="
                                        mt-5
                                        rounded-2xl
                                        bg-gradient-to-br
                                        from-slate-950
                                        via-slate-900
                                        to-slate-700
                                        p-5
                                        text-white
                                        sm:p-6
                                    "
                                >

                                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-300">
                                        QUIZ PLATFORM
                                    </p>

                                    <h2 className="mt-1.5 text-2xl font-bold sm:text-3xl">
                                        Learn. Practice. Improve.
                                    </h2>

                                    <p className="mt-2 text-sm leading-6 text-slate-300 sm:text-base">
                                        Take quizzes and get immediate
                                        feedback on your answers.
                                    </p>

                                    <button
                                        onClick={() =>
                                            navigate("/register")
                                        }
                                        className="
                                            mt-4
                                            rounded-xl
                                            bg-white
                                            px-4 py-2.5
                                            text-xs
                                            font-bold
                                            text-slate-950
                                            transition
                                            hover:bg-slate-100
                                            sm:text-sm
                                        "
                                    >
                                        Start Practicing →
                                    </button>

                                </div>


                                {/* FEATURES */}

                                <div className="mt-5">

                                    <div className="flex items-center justify-between">

                                        <p className="text-base font-bold sm:text-lg">
                                            Explore TryQuizzers
                                        </p>

                                        <span className="text-xs text-slate-400">
                                            Features
                                        </span>

                                    </div>


                                    <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">


                                        <div className="rounded-2xl bg-slate-50 p-4">

                                            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-200">
                                                📝
                                            </div>

                                            <p className="mt-3 font-bold">
                                                Quiz Practice
                                            </p>

                                            <p className="mt-1 text-xs leading-5 text-slate-400 sm:text-sm">
                                                Practice across different categories.
                                            </p>

                                        </div>


                                        <div className="rounded-2xl bg-slate-50 p-4">

                                            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-200">
                                                📊
                                            </div>

                                            <p className="mt-3 font-bold">
                                                Analytics
                                            </p>

                                            <p className="mt-1 text-xs leading-5 text-slate-400 sm:text-sm">
                                                Understand your performance and progress.
                                            </p>

                                        </div>


                                        <div className="rounded-2xl bg-slate-50 p-4">

                                            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-200">
                                                🏆
                                            </div>

                                            <p className="mt-3 font-bold">
                                                Leaderboard
                                            </p>

                                            <p className="mt-1 text-xs leading-5 text-slate-400 sm:text-sm">
                                                Compete and track your ranking.
                                            </p>

                                        </div>


                                        <div className="rounded-2xl bg-slate-50 p-4">

                                            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-200">
                                                ✓
                                            </div>

                                            <p className="mt-3 font-bold">
                                                Instant Results
                                            </p>

                                            <p className="mt-1 text-xs leading-5 text-slate-400 sm:text-sm">
                                                Get your score immediately after every quiz.
                                            </p>

                                        </div>

                                    </div>

                                </div>


                                {/* REAL DATA */}

                                <div
                                    className="
                                        mt-4
                                        rounded-2xl
                                        bg-white
                                        p-4
                                        ring-1 ring-slate-100
                                    "
                                >

                                    <div className="flex items-center justify-between">

                                        <div>

                                            <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-400 sm:text-xs">
                                                TRYQUIZZERS PLATFORM
                                            </p>

                                            <p className="mt-1 text-sm font-bold sm:text-base">
                                                Ready to start learning?
                                            </p>

                                        </div>

                                        <span className="text-lg">
                                            🚀
                                        </span>

                                    </div>


                                    <div className="mt-3 grid grid-cols-3 gap-2.5">

                                        <div className="rounded-xl bg-slate-100 px-2 py-3 text-center">

                                            <p className="text-xl font-bold text-slate-950 sm:text-2xl">
                                                {loadingStats
                                                    ? "—"
                                                    : stats.categories}
                                            </p>

                                            <p className="text-[10px] text-slate-500 sm:text-xs">
                                                Categories
                                            </p>

                                        </div>


                                        <div className="rounded-xl bg-slate-100 px-2 py-3 text-center">

                                            <p className="text-xl font-bold text-slate-950 sm:text-2xl">
                                                {loadingStats
                                                    ? "—"
                                                    : stats.quizzes}
                                            </p>

                                            <p className="text-[10px] text-slate-500 sm:text-xs">
                                                Quizzes
                                            </p>

                                        </div>


                                        <div className="rounded-xl bg-slate-100 px-2 py-3 text-center">

                                            <p className="text-xl font-bold text-slate-950 sm:text-2xl">
                                                {loadingStats
                                                    ? "—"
                                                    : stats.questions}
                                            </p>

                                            <p className="text-[10px] text-slate-500 sm:text-xs">
                                                Questions
                                            </p>

                                        </div>

                                    </div>

                                </div>

                            </div>

                        </div>

                    </div>

                </section>


                {/* =================================================
                    FEATURES
                ================================================= */}

                <section
                    id="features"
                    className="scroll-mt-24 bg-white"
                >

                    <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">

                        <div className="mx-auto max-w-2xl text-center">

                            <p className="text-sm font-semibold uppercase tracking-wide text-slate-500">
                                Everything you need
                            </p>

                            <h2 className="mt-2 text-3xl font-bold sm:text-4xl">
                                Built for better learning
                            </h2>

                            <p className="mt-3 text-slate-500">
                                Practice, understand your performance,
                                and continuously improve.
                            </p>

                        </div>


                        <div className="mt-10 grid gap-5 md:grid-cols-3">

                            {[
                                [
                                    "🧠",
                                    "Practice Quizzes",
                                    "Test yourself across different subjects and categories.",
                                ],
                                [
                                    "📊",
                                    "Track Performance",
                                    "Review scores, attempts, accuracy, and performance.",
                                ],
                                [
                                    "🏆",
                                    "Compete & Improve",
                                    "Compare your performance through leaderboards.",
                                ],
                            ].map(([icon, title, text]) => (

                                <div
                                    key={title}
                                    className="
                                        rounded-2xl
                                        bg-slate-50
                                        p-6
                                        transition
                                        hover:-translate-y-1
                                        hover:shadow-lg
                                    "
                                >

                                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-200 text-xl">
                                        {icon}
                                    </div>

                                    <h3 className="mt-5 text-lg font-bold">
                                        {title}
                                    </h3>

                                    <p className="mt-2 text-sm leading-6 text-slate-500">
                                        {text}
                                    </p>

                                </div>

                            ))}

                        </div>

                    </div>

                </section>


                {/* =================================================
                    HOW IT WORKS
                ================================================= */}

                <section
                    id="how-it-works"
                    className="scroll-mt-24 bg-slate-50"
                >

                    <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">

                        <div className="mx-auto max-w-2xl text-center">

                            <p className="text-sm font-semibold uppercase tracking-wide text-slate-500">
                                Simple process
                            </p>

                            <h2 className="mt-2 text-3xl font-bold">
                                Start learning in three steps
                            </h2>

                        </div>


                        <div className="mt-10 grid gap-5 md:grid-cols-3">

                            {[
                                [
                                    "01",
                                    "Create your account",
                                    "Register and access the TryQuizzers platform.",
                                ],
                                [
                                    "02",
                                    "Take quizzes",
                                    "Choose available categories and challenge yourself.",
                                ],
                                [
                                    "03",
                                    "Analyze & improve",
                                    "Review your results and keep improving.",
                                ],
                            ].map(([number, title, text]) => (

                                <div
                                    key={number}
                                    className="rounded-2xl bg-white p-6 shadow-sm"
                                >

                                    <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-950 text-xs font-bold text-white">
                                        {number}
                                    </span>

                                    <h3 className="mt-5 text-lg font-bold">
                                        {title}
                                    </h3>

                                    <p className="mt-2 text-sm leading-6 text-slate-500">
                                        {text}
                                    </p>

                                </div>

                            ))}

                        </div>

                    </div>

                </section>


                {/* =================================================
                    ABOUT
                ================================================= */}

                <section
                    id="about"
                    className="scroll-mt-24 bg-white"
                >

                    <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">

                        <div className="grid items-center gap-10 lg:grid-cols-2">

                            <div>

                                <p className="text-sm font-semibold uppercase tracking-wide text-slate-500">
                                    About TryQuizzers
                                </p>

                                <h2 className="mt-2 text-3xl font-bold sm:text-4xl">
                                    A smarter way to prepare.
                                </h2>

                                <p className="mt-5 max-w-xl leading-7 text-slate-500">
                                    TryQuizzers is designed to make quiz-based
                                    learning simple, measurable, and engaging.
                                    Practice, understand your results, and
                                    continuously improve your knowledge.
                                </p>

                                <button
                                    onClick={() =>
                                        navigate("/register")
                                    }
                                    className="
                                        mt-6
                                        rounded-xl
                                        bg-slate-950
                                        px-6 py-3
                                        text-sm font-semibold
                                        text-white
                                        transition
                                        hover:bg-slate-800
                                    "
                                >
                                    Start Learning →
                                </button>

                            </div>


                            <div className="grid grid-cols-2 gap-4">

                                <div className="rounded-2xl bg-slate-100 p-5">

                                    <p className="text-3xl font-extrabold text-slate-950">
                                        {loadingStats
                                            ? "—"
                                            : stats.categories}
                                    </p>

                                    <p className="mt-1 text-sm text-slate-600">
                                        Quiz Categories
                                    </p>

                                </div>


                                <div className="rounded-2xl bg-slate-100 p-5">

                                    <p className="text-3xl font-extrabold text-slate-950">
                                        {loadingStats
                                            ? "—"
                                            : stats.quizzes}
                                    </p>

                                    <p className="mt-1 text-sm text-slate-600">
                                        Available Quizzes
                                    </p>

                                </div>


                                <div className="rounded-2xl bg-slate-100 p-5">

                                    <p className="text-3xl font-extrabold text-slate-950">
                                        {loadingStats
                                            ? "—"
                                            : stats.questions}
                                    </p>

                                    <p className="mt-1 text-sm text-slate-600">
                                        Questions
                                    </p>

                                </div>


                                <div className="rounded-2xl bg-slate-100 p-5">

                                    <p className="text-3xl font-extrabold text-slate-950">
                                        ✓
                                    </p>

                                    <p className="mt-1 text-sm text-slate-600">
                                        Instant Results
                                    </p>

                                </div>

                            </div>

                        </div>

                    </div>

                </section>


                {/* =================================================
                    CTA
                ================================================= */}

                <section className="bg-slate-50">

                    <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">

                        <div
                            className="
                                rounded-[2rem]
                                bg-slate-950
                                px-5 py-12
                                text-center text-white
                                shadow-2xl
                                shadow-slate-300/50
                                sm:px-10
                            "
                        >

                            <h2 className="text-2xl font-bold sm:text-3xl">
                                Ready to test yourself?
                            </h2>

                            <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-slate-400 sm:text-base">
                                Create your account and start taking quizzes,
                                tracking your performance, and improving.
                            </p>

                            <button
                                onClick={() =>
                                    navigate("/register")
                                }
                                className="
                                    mt-7
                                    rounded-xl
                                    bg-white
                                    px-7 py-3.5
                                    text-sm font-semibold
                                    text-slate-950
                                    transition
                                    hover:bg-slate-100
                                "
                            >
                                Create Your Account →
                            </button>

                        </div>

                    </div>

                </section>

            </main>


            {/* =====================================================
                FOOTER
            ===================================================== */}

            <footer className="bg-white">

                <div
                    className="
                        mx-auto flex max-w-7xl
                        flex-col gap-4
                        px-4 py-7
                        text-center
                        text-sm text-slate-400
                        sm:px-6
                        md:flex-row
                        md:items-center
                        md:justify-between
                        md:text-left
                        lg:px-8
                    "
                >

                    <span
                        className="
                            font-black
                            tracking-[-0.045em]
                            text-slate-700
                        "
                    >
                        TryQuizzers
                    </span>

                    <p>
                        © {new Date().getFullYear()} TryQuizzers.
                        All rights reserved.
                    </p>

                </div>

            </footer>

        </div>
    );
}

export default AuthPage;