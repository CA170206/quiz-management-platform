import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../../context/ThemeContext";

function AuthPage() {
    const navigate = useNavigate();

    const [menuOpen, setMenuOpen] = useState(false);
    const [activeSection, setActiveSection] = useState("home");

    // =========================================================
    // DARK / LIGHT MODE
    // =========================================================

    // =========================================================
// GLOBAL DARK / LIGHT MODE
// =========================================================

const {
    darkMode,
    toggleTheme,
} = useTheme();

    // =========================================================
    // REAL PLATFORM DATA
    // =========================================================

    const [stats, setStats] = useState({
        categories: 0,
        quizzes: 0,
        questions: 0,
    });

    const [loadingStats, setLoadingStats] = useState(true);

    // =========================================================
    // ANIMATED PRODUCT DEMO
    // =========================================================

    const [demoStep, setDemoStep] = useState(0);
    const [demoQuestion, setDemoQuestion] = useState(0);
    const [demoAnswer, setDemoAnswer] = useState(null);
    const [demoScore, setDemoScore] = useState(0);

    const demoStages = [
        {
            small: "STEP 01",
            title: "Attempt quizzes.",
            description:
                "Challenge yourself with quizzes across different categories.",
        },
        {
            small: "STEP 02",
            title: "Get instant results.",
            description:
                "See your score, correct answers, and performance immediately.",
        },
        {
            small: "STEP 03",
            title: "View your rank.",
            description:
                "Compare your performance and see where you stand.",
        },
    ];

    const quizQuestions = [
        {
            question: "What does HTML stand for?",
            options: [
                "HyperText Markup Language",
                "HighText Machine Language",
                "Hyperlink Text Management Language",
                "Home Tool Markup Language",
            ],
            correct: 0,
        },
        {
            question: "Which language is used for React?",
            options: [
                "Python",
                "JavaScript",
                "SQL",
                "C++",
            ],
            correct: 1,
        },
    ];

    const currentQuestion = quizQuestions[demoQuestion];

    // =========================================================
    // ANIMATED DEMO
    // =========================================================

    useEffect(() => {
        let timer;
        let nextTimer;

        if (demoStep === 0) {
            setDemoAnswer(null);

            timer = setTimeout(() => {
                setDemoAnswer(currentQuestion.correct);
            }, 1800);

            nextTimer = setTimeout(() => {
                if (demoQuestion === 0) {
                    setDemoQuestion(1);
                } else {
                    setDemoStep(1);
                }
            }, 3700);
        }

        if (demoStep === 1) {
            setDemoScore(0);

            let score = 0;

            const scoreTimer = setInterval(() => {
                score += 3;

                if (score >= 87) {
                    score = 87;
                    clearInterval(scoreTimer);
                }

                setDemoScore(score);
            }, 35);

            nextTimer = setTimeout(() => {
                setDemoStep(2);
            }, 5000);

            return () => {
                clearInterval(scoreTimer);
                clearTimeout(nextTimer);
            };
        }

        if (demoStep === 2) {
            nextTimer = setTimeout(() => {
                setDemoStep(0);
                setDemoQuestion(0);
                setDemoAnswer(null);
                setDemoScore(0);
            }, 5200);
        }

        return () => {
            clearTimeout(timer);
            clearTimeout(nextTimer);
        };
    }, [
        demoStep,
        demoQuestion,
        currentQuestion.correct,
    ]);

    // =========================================================
    // ACTIVE NAVBAR SECTION
    // =========================================================

    useEffect(() => {
        const sections = [
            "home",
            "features",
            "how-it-works",
            "about",
        ];

        const handleScroll = () => {
            const scrollPosition = window.scrollY + 180;

            let currentSection = "home";

            sections.forEach((id) => {
                const section = document.getElementById(id);

                if (
                    section &&
                    section.offsetTop <= scrollPosition
                ) {
                    currentSection = id;
                }
            });

            setActiveSection(currentSection);
        };

        window.addEventListener("scroll", handleScroll, {
            passive: true,
        });

        handleScroll();

        return () => {
            window.removeEventListener(
                "scroll",
                handleScroll
            );
        };
    }, []);

    // =========================================================
    // FETCH REAL PLATFORM DATA
    // =========================================================

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

                const categoriesData =
                    categoriesRes.ok
                        ? await categoriesRes.json()
                        : {};

                const quizzesData =
                    quizzesRes.ok
                        ? await quizzesRes.json()
                        : {};

                const questionsData =
                    questionsRes.ok
                        ? await questionsRes.json()
                        : {};

                setStats({
                    categories:
                        Array.isArray(
                            categoriesData.categories
                        )
                            ? categoriesData.categories.length
                            : Array.isArray(categoriesData)
                            ? categoriesData.length
                            : 0,

                    quizzes:
                        Array.isArray(
                            quizzesData.quizzes
                        )
                            ? quizzesData.quizzes.length
                            : Array.isArray(quizzesData)
                            ? quizzesData.length
                            : 0,

                    questions:
                        Array.isArray(
                            questionsData.questions
                        )
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

    // =========================================================
    // SCROLL
    // =========================================================

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

    const navItems = [
        {
            id: "home",
            label: "Home",
        },
        {
            id: "features",
            label: "Features",
        },
        {
            id: "how-it-works",
            label: "How It Works",
        },
        {
            id: "about",
            label: "About",
        },
    ];

    // =========================================================
    // THEME CLASSES
    // =========================================================

    const pageBg = darkMode
        ? "bg-[#0a0a0a]"
        : "bg-white";

    const mainText = darkMode
        ? "text-white"
        : "text-slate-950";

    const mutedText = darkMode
        ? "text-slate-400"
        : "text-slate-500";

    const subtleText = darkMode
        ? "text-slate-500"
        : "text-slate-400";

    const softBg = darkMode
        ? "bg-[#151515]"
        : "bg-slate-50";

    const softBgHover = darkMode
        ? "hover:bg-[#1c1c1c]"
        : "hover:bg-slate-100";

    const cardBg = darkMode
        ? "bg-[#111111]"
        : "bg-white";

    const borderColor = darkMode
        ? "ring-1 ring-white/10"
        : "ring-1 ring-slate-100";

    return (
        <div
            className={`
                min-h-screen
                overflow-x-hidden
                transition-colors
                duration-500
                ${pageBg}
                ${mainText}
            `}
        >

            {/* =====================================================
                FLOATING NAVBAR
            ===================================================== */}

            <header className="fixed left-0 right-0 top-0 z-50 px-3 pt-3 sm:px-5 sm:pt-4 lg:px-8">

                <div
                    className={`
                        navbar-shimmer
                        relative mx-auto flex max-w-6xl
                        items-center justify-between
                        overflow-hidden
                        rounded-full
                        px-4 py-2.5
                        shadow-[0_12px_35px_rgba(15,23,42,0.10)]
                        backdrop-blur-xl
                        transition-all
                        duration-500
                        sm:px-6
                        ${
                            darkMode
                                ? "bg-[#151515]/95 shadow-black/40"
                                : "bg-[#f5f3ee]/95"
                        }
                    `}
                >

                    <div className="pointer-events-none absolute inset-0 overflow-hidden">
                        <div className="navbar-light-sweep" />
                    </div>

                    {/* BRAND */}

                    <button
                        onClick={() =>
                            scrollToSection("home")
                        }
                        className="relative z-10 shrink-0 rounded-full px-1 py-1"
                    >
                        <span
                            className={`
                                block
                                text-[18px]
                                font-black
                                tracking-[-0.055em]
                                transition-colors
                                duration-500
                                sm:text-[20px]
                                ${
                                    darkMode
                                        ? "text-white"
                                        : "text-slate-950"
                                }
                            `}
                        >
                            TryQuizzers
                        </span>
                    </button>

                    {/* DESKTOP NAV */}

                    <nav className="relative z-10 hidden items-center gap-1 lg:flex">

                        {navItems.map((item) => {
                            const isActive =
                                activeSection === item.id;

                            return (
                                <button
                                    key={item.id}
                                    onClick={() =>
                                        scrollToSection(item.id)
                                    }
                                    className={`
                                        relative
                                        rounded-full
                                        px-4 py-2
                                        text-[12px]
                                        font-semibold
                                        transition-all
                                        duration-300
                                        ${
                                            isActive
                                                ? darkMode
                                                    ? "bg-white text-black shadow-sm"
                                                    : "bg-white text-black shadow-sm"
                                                : darkMode
                                                ? "text-slate-400 hover:bg-white/10 hover:text-white"
                                                : "text-slate-500 hover:bg-white/80 hover:text-black"
                                        }
                                    `}
                                >
                                    {item.label}
                                </button>
                            );
                        })}

                    </nav>

                    {/* RIGHT ACTIONS */}

                    <div className="relative z-10 hidden items-center gap-1.5 lg:flex">

                        {/* THEME BUTTON */}

                        <button
                            onClick={toggleTheme}
                            aria-label={
                                darkMode
                                    ? "Switch to light mode"
                                    : "Switch to dark mode"
                            }
                            title={
                                darkMode
                                    ? "Light mode"
                                    : "Dark mode"
                            }
                            className={`
                                flex
                                h-9
                                w-9
                                items-center
                                justify-center
                                rounded-full
                                text-sm
                                transition-all
                                duration-300
                                ${
                                    darkMode
                                        ? "bg-white/10 text-white hover:bg-white hover:text-black"
                                        : "bg-white/70 text-slate-700 hover:bg-white hover:text-black"
                                }
                            `}
                        >
                            {darkMode ? "☀" : "☾"}
                        </button>

                        <button
                            onClick={() =>
                                navigate("/login")
                            }
                            className={`
                                rounded-full
                                px-4 py-2
                                text-[12px]
                                font-semibold
                                transition-all
                                duration-300
                                ${
                                    darkMode
                                        ? "text-slate-400 hover:bg-white/10 hover:text-white"
                                        : "text-slate-500 hover:bg-white/80 hover:text-black"
                                }
                            `}
                        >
                            Sign In
                        </button>

                        <button
                            onClick={() =>
                                navigate("/register")
                            }
                            className="
                                group
                                flex items-center gap-2
                                rounded-full
                                bg-black
                                px-4 py-2.5
                                text-[11px]
                                font-bold
                                tracking-wide
                                text-white
                                shadow-sm
                                transition-all
                                duration-300
                                hover:bg-slate-800
                                hover:shadow-lg
                            "
                        >
                            <span className="h-1.5 w-1.5 rounded-full bg-white transition-transform duration-300 group-hover:scale-125" />
                            Start a Quiz
                        </button>

                    </div>

                    {/* MOBILE */}

                    <div className="relative z-10 flex items-center gap-2 lg:hidden">

                        {/* MOBILE THEME BUTTON */}

                        <button
                            onClick={toggleTheme}
                            aria-label={
                                darkMode
                                    ? "Switch to light mode"
                                    : "Switch to dark mode"
                            }
                            className={`
                                flex
                                h-10
                                w-10
                                items-center
                                justify-center
                                rounded-full
                                transition-all
                                duration-300
                                ${
                                    darkMode
                                        ? "bg-white/10 text-white hover:bg-white hover:text-black"
                                        : "bg-white/70 text-slate-800 hover:bg-white"
                                }
                            `}
                        >
                            <span className="text-base">
                                {darkMode ? "☀" : "☾"}
                            </span>
                        </button>

                        <button
                            onClick={() =>
                                setMenuOpen(!menuOpen)
                            }
                            className={`
                                flex h-10 w-10
                                items-center justify-center
                                rounded-full
                                transition
                                ${
                                    darkMode
                                        ? "bg-white/10 text-white hover:bg-white hover:text-black"
                                        : "bg-white/70 text-slate-800 hover:bg-white"
                                }
                            `}
                            aria-label="Toggle navigation"
                        >

                            {menuOpen ? (
                                <span className="text-2xl leading-none">
                                    ×
                                </span>
                            ) : (
                                <div className="space-y-1.5">
                                    <span className="block h-0.5 w-5 rounded-full bg-current" />
                                    <span className="block h-0.5 w-5 rounded-full bg-current" />
                                    <span className="block h-0.5 w-5 rounded-full bg-current" />
                                </div>
                            )}

                        </button>

                    </div>

                </div>

                {/* MOBILE MENU */}

                {menuOpen && (
                    <div
                        className={`
                            mx-auto mt-2 max-w-6xl
                            overflow-hidden
                            rounded-[1.75rem]
                            p-2
                            shadow-[0_15px_40px_rgba(15,23,42,0.12)]
                            backdrop-blur-xl
                            transition-colors
                            duration-500
                            lg:hidden
                            ${
                                darkMode
                                    ? "bg-[#151515]/95 shadow-black/50"
                                    : "bg-[#f5f3ee]/95"
                            }
                        `}
                    >

                        {navItems.map((item) => {
                            const isActive =
                                activeSection === item.id;

                            return (
                                <button
                                    key={item.id}
                                    onClick={() =>
                                        scrollToSection(item.id)
                                    }
                                    className={`
                                        w-full
                                        rounded-2xl
                                        px-4 py-3
                                        text-left
                                        text-sm
                                        font-semibold
                                        transition-all
                                        duration-300
                                        ${
                                            isActive
                                                ? "bg-black text-white"
                                                : darkMode
                                                ? "text-slate-400 hover:bg-white/10 hover:text-white"
                                                : "text-slate-600 hover:bg-white hover:text-black"
                                        }
                                    `}
                                >
                                    {item.label}
                                </button>
                            );
                        })}

                        <div className="mt-1 grid grid-cols-2 gap-2 p-1">

                            <button
                                onClick={() => {
                                    setMenuOpen(false);
                                    navigate("/login");
                                }}
                                className={`
                                    rounded-2xl
                                    px-4 py-3
                                    text-sm
                                    font-semibold
                                    transition
                                    ${
                                        darkMode
                                            ? "bg-white/10 text-white hover:bg-white/20"
                                            : "bg-white text-slate-700 hover:bg-slate-100"
                                    }
                                `}
                            >
                                Sign In
                            </button>

                            <button
                                onClick={() => {
                                    setMenuOpen(false);
                                    navigate("/register");
                                }}
                                className="rounded-2xl bg-black px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
                            >
                                Get Started
                            </button>

                        </div>

                    </div>
                )}

            </header>

            {/* =====================================================
                ANIMATIONS
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
                            rgba(255,255,255,0.65) 23px,
                            rgba(255,255,255,0.65) 48px,
                            rgba(255,255,255,0) 49px,
                            rgba(255,255,255,0) 72px
                        );

                    filter: blur(1px);

                    animation:
                        navbarSweep
                        7s
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

                .demo-enter {
                    animation:
                        demoEnter
                        650ms
                        cubic-bezier(0.22, 1, 0.36, 1)
                        both;
                }

                .demo-question {
                    animation:
                        questionIn
                        500ms
                        cubic-bezier(0.22, 1, 0.36, 1)
                        both;
                }

                .demo-option {
                    animation:
                        optionIn
                        450ms
                        cubic-bezier(0.22, 1, 0.36, 1)
                        both;
                }

                .demo-score {
                    animation:
                        scorePop
                        650ms
                        cubic-bezier(0.22, 1, 0.36, 1)
                        both;
                }

                .demo-rank {
                    animation:
                        rankIn
                        550ms
                        cubic-bezier(0.22, 1, 0.36, 1)
                        both;
                }

                .hero-stage-text {
                    animation:
                        heroTextIn
                        600ms
                        cubic-bezier(0.22, 1, 0.36, 1)
                        both;
                }

                .hero-stage-word {
                    display: block;
                    animation:
                        heroWordIn
                        700ms
                        cubic-bezier(0.22, 1, 0.36, 1)
                        both;
                }

                @keyframes heroTextIn {

                    from {
                        opacity: 0;
                        transform: translateY(12px);
                    }

                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }

                @keyframes heroWordIn {

                    0% {
                        opacity: 0;
                        transform: translateY(22px);
                    }

                    65% {
                        opacity: 1;
                        transform: translateY(-2px);
                    }

                    100% {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }

                @keyframes demoEnter {

                    from {
                        opacity: 0;
                        transform: translateY(16px) scale(0.98);
                    }

                    to {
                        opacity: 1;
                        transform: translateY(0) scale(1);
                    }
                }

                @keyframes questionIn {

                    from {
                        opacity: 0;
                        transform: translateY(12px);
                    }

                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }

                @keyframes optionIn {

                    from {
                        opacity: 0;
                        transform: translateX(-12px);
                    }

                    to {
                        opacity: 1;
                        transform: translateX(0);
                    }
                }

                @keyframes scorePop {

                    0% {
                        opacity: 0;
                        transform: scale(0.65);
                    }

                    70% {
                        transform: scale(1.08);
                    }

                    100% {
                        opacity: 1;
                        transform: scale(1);
                    }
                }

                @keyframes rankIn {

                    from {
                        opacity: 0;
                        transform: translateX(20px);
                    }

                    to {
                        opacity: 1;
                        transform: translateX(0);
                    }
                }

                .progress-demo {
                    transition:
                        width
                        700ms
                        cubic-bezier(0.22, 1, 0.36, 1);
                }

                @media (prefers-reduced-motion: reduce) {

                    .navbar-light-sweep,
                    .demo-enter,
                    .demo-question,
                    .demo-option,
                    .demo-score,
                    .demo-rank,
                    .hero-stage-text,
                    .hero-stage-word {
                        animation: none !important;
                    }

                    .progress-demo {
                        transition: none;
                    }
                }

            `}</style>

            {/* =====================================================
                MAIN
            ===================================================== */}

            <main
                className={`
                    pt-20
                    transition-colors
                    duration-500
                    sm:pt-24
                    ${pageBg}
                `}
            >

                {/* =================================================
                    HERO
                ================================================= */}

                <section
                    id="home"
                    className={`
                        scroll-mt-24
                        transition-colors
                        duration-500
                        ${pageBg}
                    `}
                >

                    <div className="mx-auto grid max-w-7xl items-start gap-10 px-4 py-7 sm:px-6 sm:py-9 lg:grid-cols-[0.95fr_1.05fr] lg:gap-14 lg:px-8 lg:py-10">

                        {/* LEFT */}

                        <div className="max-w-2xl pt-4 sm:pt-6 lg:pt-10">

                            <div
                                className={`
                                    mb-5 inline-flex items-center gap-2
                                    rounded-full px-4 py-2
                                    text-xs font-semibold
                                    shadow-sm
                                    transition-colors
                                    duration-500
                                    sm:text-sm
                                    ${
                                        darkMode
                                            ? "bg-[#171717] text-white"
                                            : "bg-slate-100 text-black"
                                    }
                                `}
                            >

                                <span className="h-2 w-2 rounded-full bg-black dark:bg-white" />

                                Smarter way to practice

                            </div>

                            {/* ANIMATED HEADLINE */}

                            <h1
                                key={demoStep}
                                className={`
                                    hero-stage-word
                                    min-h-[5.3rem]
                                    text-[2.7rem]
                                    font-black
                                    leading-[0.98]
                                    tracking-[-0.055em]
                                    transition-colors
                                    duration-500
                                    sm:min-h-[7rem]
                                    sm:text-5xl
                                    md:text-6xl
                                    lg:min-h-[7.2rem]
                                    lg:text-[3.7rem]
                                    ${
                                        darkMode
                                            ? "text-white"
                                            : "text-black"
                                    }
                                `}
                            >
                                {demoStages[demoStep].title}
                            </h1>

                            {/* TEXT DESCRIPTION */}

                            <div
                                key={`stage-${demoStep}`}
                                className="hero-stage-text mt-5 min-h-[92px] sm:min-h-[100px]"
                            >

                                <div className="flex items-center gap-3">

                                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-black text-xs font-bold text-white">
                                        {String(
                                            demoStep + 1
                                        ).padStart(2, "0")}
                                    </span>

                                    <span
                                        className={`
                                            text-xs
                                            font-bold
                                            uppercase
                                            tracking-[0.18em]
                                            ${subtleText}
                                        `}
                                    >
                                        {
                                            demoStages[
                                                demoStep
                                            ].small
                                        }
                                    </span>

                                </div>

                                <p
                                    className={`
                                        mt-3
                                        max-w-xl
                                        text-base
                                        leading-7
                                        transition-colors
                                        duration-500
                                        sm:text-lg
                                        sm:leading-8
                                        ${mutedText}
                                    `}
                                >
                                    {
                                        demoStages[
                                            demoStep
                                        ].description
                                    }
                                </p>

                            </div>

                            {/* STAGE INDICATORS */}

                            <div className="mb-6 flex items-center gap-2">

                                {demoStages.map(
                                    (stage, index) => (
                                        <button
                                            key={
                                                stage.small
                                            }
                                            type="button"
                                            onClick={() => {
                                                setDemoStep(
                                                    index
                                                );

                                                if (
                                                    index ===
                                                    0
                                                ) {
                                                    setDemoQuestion(
                                                        0
                                                    );
                                                    setDemoAnswer(
                                                        null
                                                    );
                                                }

                                                if (
                                                    index ===
                                                    1
                                                ) {
                                                    setDemoScore(
                                                        87
                                                    );
                                                }
                                            }}
                                            aria-label={`Show ${stage.title}`}
                                            className={`
                                                h-1.5
                                                rounded-full
                                                transition-all
                                                duration-500
                                                ${
                                                    demoStep ===
                                                    index
                                                        ? "w-10 bg-black dark:bg-white"
                                                        : darkMode
                                                        ? "w-2 bg-slate-700"
                                                        : "w-2 bg-slate-300"
                                                }
                                            `}
                                        />
                                    )
                                )}

                            </div>

                            {/* CTA */}

                            <div className="flex flex-col gap-3 sm:flex-row">

                                <button
                                    onClick={() =>
                                        navigate(
                                            "/register"
                                        )
                                    }
                                    className="
                                        rounded-xl
                                        bg-black
                                        px-6 py-3.5
                                        text-sm
                                        font-semibold
                                        text-white
                                        shadow-lg
                                        shadow-slate-300
                                        transition
                                        hover:-translate-y-0.5
                                        hover:bg-slate-800
                                        dark:shadow-black/40
                                    "
                                >
                                    Get Started →
                                </button>

                                <button
                                    onClick={() =>
                                        navigate("/login")
                                    }
                                    className={`
                                        rounded-xl
                                        px-6 py-3.5
                                        text-sm
                                        font-semibold
                                        shadow-sm
                                        transition
                                        ${
                                            darkMode
                                                ? "bg-[#171717] text-white hover:bg-[#222]"
                                                : "bg-slate-100 text-slate-700 hover:bg-slate-200 hover:text-black"
                                        }
                                    `}
                                >
                                    Sign In
                                </button>

                            </div>

                            <div
                                className={`
                                    mt-6
                                    flex flex-wrap
                                    gap-x-5 gap-y-2
                                    text-xs
                                    sm:text-sm
                                    ${subtleText}
                                `}
                            >

                                <span>
                                    ✓ Practice quizzes
                                </span>

                                <span>
                                    ✓ Instant results
                                </span>

                                <span>
                                    ✓ Performance analytics
                                </span>

                            </div>

                        </div>

                        {/* =================================================
                            PRODUCT PREVIEW
                        ================================================= */}

                        <div className="relative w-full">

                            <div
                                className={`
                                    absolute -right-10 -top-10 -z-10
                                    h-40 w-40 rounded-full blur-3xl
                                    ${
                                        darkMode
                                            ? "bg-white/5"
                                            : "bg-slate-100"
                                    }
                                `}
                            />

                            <div
                                className={`
                                    absolute -bottom-10 -left-10 -z-10
                                    h-40 w-40 rounded-full blur-3xl
                                    ${
                                        darkMode
                                            ? "bg-white/5"
                                            : "bg-slate-100"
                                    }
                                `}
                            />

                            <div
                                className={`
                                    relative
                                    overflow-hidden
                                    rounded-[1.75rem]
                                    p-4
                                    shadow-2xl
                                    transition-colors
                                    duration-500
                                    sm:p-5
                                    ${
                                        darkMode
                                            ? "bg-[#111111] shadow-black/50 ring-1 ring-white/10"
                                            : "bg-white shadow-slate-300/40 ring-1 ring-slate-100"
                                    }
                                `}
                            >

                                {/* TOP */}

                                <div className="flex items-center justify-between">

                                    <div>

                                        <p
                                            className={`
                                                text-lg
                                                font-black
                                                tracking-[-0.04em]
                                                ${
                                                    darkMode
                                                        ? "text-white"
                                                        : "text-black"
                                                }
                                            `}
                                        >
                                            TryQuizzers
                                        </p>

                                        <p
                                            className={`
                                                text-[11px]
                                                sm:text-xs
                                                ${subtleText}
                                            `}
                                        >
                                            Learn. Practice. Improve.
                                        </p>

                                    </div>

                                    <div className="flex items-center gap-2">

                                        {[
                                            "QUIZ",
                                            "RESULT",
                                            "RANK",
                                        ].map(
                                            (label, index) => (
                                                <span
                                                    key={
                                                        label
                                                    }
                                                    className={`
                                                        ${
                                                            index ===
                                                            2
                                                                ? "hidden sm:inline-flex"
                                                                : "inline-flex"
                                                        }
                                                        rounded-full
                                                        px-3 py-1
                                                        text-[10px]
                                                        font-bold
                                                        transition-all
                                                        duration-300
                                                        ${
                                                            demoStep ===
                                                            index
                                                                ? "bg-black text-white dark:bg-white dark:text-black"
                                                                : darkMode
                                                                ? "bg-white/10 text-slate-500"
                                                                : "bg-slate-100 text-slate-400"
                                                        }
                                                    `}
                                                >
                                                    {label}
                                                </span>
                                            )
                                        )}

                                    </div>

                                </div>

                                {/* QUIZ */}

                                {demoStep === 0 && (
                                    <div
                                        key={`quiz-${demoQuestion}`}
                                        className="demo-enter mt-5"
                                    >

                                        <div className="rounded-2xl bg-black p-5 text-white sm:p-6">

                                            <div className="flex items-center justify-between">

                                                <div>

                                                    <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                                                        Computer Science
                                                    </p>

                                                    <p className="mt-1 text-xs text-slate-400">
                                                        Question{" "}
                                                        {demoQuestion +
                                                            1}{" "}
                                                        of 2
                                                    </p>

                                                </div>

                                                <div className="rounded-full bg-white/10 px-3 py-1 text-[10px] font-semibold text-slate-300">
                                                    30 sec
                                                </div>

                                            </div>

                                            <div
                                                key={
                                                    currentQuestion.question
                                                }
                                                className="demo-question"
                                            >

                                                <h2 className="mt-5 text-lg font-bold leading-6 sm:text-xl">
                                                    {
                                                        currentQuestion.question
                                                    }
                                                </h2>

                                                <div className="mt-4 space-y-2.5">

                                                    {currentQuestion.options.map(
                                                        (
                                                            option,
                                                            index
                                                        ) => {

                                                            const selected =
                                                                demoAnswer ===
                                                                index;

                                                            const isCorrect =
                                                                index ===
                                                                currentQuestion.correct;

                                                            return (
                                                                <div
                                                                    key={
                                                                        option
                                                                    }
                                                                    className={`
                                                                        demo-option
                                                                        flex
                                                                        items-center
                                                                        gap-3
                                                                        rounded-xl
                                                                        border
                                                                        px-3
                                                                        py-3
                                                                        text-xs
                                                                        transition-all
                                                                        duration-500
                                                                        sm:px-4
                                                                        sm:py-3.5
                                                                        sm:text-sm
                                                                        ${
                                                                            selected &&
                                                                            isCorrect
                                                                                ? "border-white bg-white text-black"
                                                                                : "border-white/10 bg-white/5 text-slate-300"
                                                                        }
                                                                    `}
                                                                    style={{
                                                                        animationDelay: `${
                                                                            index *
                                                                            80
                                                                        }ms`,
                                                                    }}
                                                                >

                                                                    <span
                                                                        className={`
                                                                            flex
                                                                            h-6
                                                                            w-6
                                                                            shrink-0
                                                                            items-center
                                                                            justify-center
                                                                            rounded-full
                                                                            border
                                                                            text-[10px]
                                                                            font-bold
                                                                            ${
                                                                                selected &&
                                                                                isCorrect
                                                                                    ? "border-black bg-black text-white"
                                                                                    : "border-white/20 text-slate-400"
                                                                            }
                                                                        `}
                                                                    >
                                                                        {String.fromCharCode(
                                                                            65 +
                                                                                index
                                                                        )}
                                                                    </span>

                                                                    <span className="min-w-0 flex-1">
                                                                        {
                                                                            option
                                                                        }
                                                                    </span>

                                                                    {selected &&
                                                                        isCorrect && (
                                                                            <span className="font-bold">
                                                                                ✓
                                                                            </span>
                                                                        )}

                                                                </div>
                                                            );
                                                        }
                                                    )}

                                                </div>

                                            </div>

                                            <div className="mt-5">

                                                <div className="flex justify-between text-[10px] text-slate-400">

                                                    <span>
                                                        Progress
                                                    </span>

                                                    <span>
                                                        {demoQuestion ===
                                                        0
                                                            ? "50%"
                                                            : "100%"}
                                                    </span>

                                                </div>

                                                <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-white/10">

                                                    <div
                                                        className="progress-demo h-full rounded-full bg-white"
                                                        style={{
                                                            width:
                                                                demoQuestion ===
                                                                0
                                                                    ? "50%"
                                                                    : "100%",
                                                        }}
                                                    />

                                                </div>

                                            </div>

                                        </div>

                                    </div>
                                )}

                                {/* RESULT */}

                                {demoStep === 1 && (
                                    <div
                                        key="result"
                                        className="demo-enter mt-5"
                                    >

                                        <div
                                            className={`
                                                rounded-2xl
                                                p-5
                                                transition-colors
                                                duration-500
                                                sm:p-6
                                                ${
                                                    darkMode
                                                        ? "bg-[#181818]"
                                                        : "bg-slate-50"
                                                }
                                            `}
                                        >

                                            <div className="text-center">

                                                <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                                                    Quiz Completed
                                                </p>

                                                <div className="demo-score mx-auto mt-4 flex h-28 w-28 items-center justify-center rounded-full border-[8px] border-black bg-white shadow-sm sm:h-32 sm:w-32">

                                                    <div>

                                                        <p className="text-3xl font-black tracking-tight text-black sm:text-4xl">
                                                            {demoScore}%
                                                        </p>

                                                        <p className="mt-0.5 text-[9px] font-semibold uppercase tracking-wide text-slate-400">
                                                            Score
                                                        </p>

                                                    </div>

                                                </div>

                                                <h2
                                                    className={`
                                                        mt-4
                                                        text-xl
                                                        font-black
                                                        ${
                                                            darkMode
                                                                ? "text-white"
                                                                : "text-black"
                                                        }
                                                    `}
                                                >
                                                    Excellent Work!
                                                </h2>

                                                <p className="mt-1 text-xs text-slate-500">
                                                    Your result is available instantly.
                                                </p>

                                            </div>

                                            <div className="mt-5 grid grid-cols-2 gap-3">

                                                <div
                                                    className={`
                                                        rounded-xl
                                                        p-4
                                                        text-center
                                                        shadow-sm
                                                        ${
                                                            darkMode
                                                                ? "bg-[#222]"
                                                                : "bg-white"
                                                        }
                                                    `}
                                                >

                                                    <p
                                                        className={`
                                                            text-xl
                                                            font-black
                                                            ${
                                                                darkMode
                                                                    ? "text-white"
                                                                    : "text-black"
                                                            }
                                                        `}
                                                    >
                                                        18
                                                    </p>

                                                    <p className="mt-1 text-[10px] font-medium text-slate-400">
                                                        Correct
                                                    </p>

                                                </div>

                                                <div
                                                    className={`
                                                        rounded-xl
                                                        p-4
                                                        text-center
                                                        shadow-sm
                                                        ${
                                                            darkMode
                                                                ? "bg-[#222]"
                                                                : "bg-white"
                                                        }
                                                    `}
                                                >

                                                    <p
                                                        className={`
                                                            text-xl
                                                            font-black
                                                            ${
                                                                darkMode
                                                                    ? "text-white"
                                                                    : "text-black"
                                                            }
                                                        `}
                                                    >
                                                        2
                                                    </p>

                                                    <p className="mt-1 text-[10px] font-medium text-slate-400">
                                                        Incorrect
                                                    </p>

                                                </div>

                                            </div>

                                            <div className="mt-4 rounded-xl bg-black px-4 py-3 text-center text-xs font-semibold text-white">
                                                Review your answers →
                                            </div>

                                        </div>

                                    </div>
                                )}

                                {/* LEADERBOARD */}

                                {demoStep === 2 && (
                                    <div
                                        key="leaderboard"
                                        className="demo-enter mt-5"
                                    >

                                        <div className="rounded-2xl bg-black p-5 text-white sm:p-6">

                                            <div className="flex items-center justify-between">

                                                <div>

                                                    <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                                                        Leaderboard
                                                    </p>

                                                    <h2 className="mt-1 text-xl font-black">
                                                        Top Performers
                                                    </h2>

                                                </div>

                                                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-lg">
                                                    🏆
                                                </div>

                                            </div>

                                            <div className="mt-5 space-y-2.5">

                                                {[
                                                    {
                                                        rank: 1,
                                                        name: "Alex",
                                                        score: "96%",
                                                    },
                                                    {
                                                        rank: 2,
                                                        name: "Rahul",
                                                        score: "92%",
                                                    },
                                                    {
                                                        rank: 3,
                                                        name: "You",
                                                        score: "87%",
                                                        you: true,
                                                    },
                                                    {
                                                        rank: 4,
                                                        name: "Priya",
                                                        score: "84%",
                                                    },
                                                ].map(
                                                    (
                                                        person,
                                                        index
                                                    ) => (
                                                        <div
                                                            key={
                                                                person.name
                                                            }
                                                            className={`
                                                                demo-rank
                                                                flex
                                                                items-center
                                                                gap-3
                                                                rounded-xl
                                                                px-3
                                                                py-3
                                                                ${
                                                                    person.you
                                                                        ? "bg-white text-black"
                                                                        : "bg-white/5 text-white"
                                                                }
                                                            `}
                                                            style={{
                                                                animationDelay: `${
                                                                    index *
                                                                    100
                                                                }ms`,
                                                            }}
                                                        >

                                                            <span
                                                                className={`
                                                                    flex
                                                                    h-7
                                                                    w-7
                                                                    items-center
                                                                    justify-center
                                                                    rounded-full
                                                                    text-[10px]
                                                                    font-black
                                                                    ${
                                                                        person.you
                                                                            ? "bg-black text-white"
                                                                            : "bg-white/10 text-slate-300"
                                                                    }
                                                                `}
                                                            >
                                                                {
                                                                    person.rank
                                                                }
                                                            </span>

                                                            <div className="min-w-0 flex-1">

                                                                <p className="truncate text-xs font-bold">
                                                                    {
                                                                        person.name
                                                                    }

                                                                    {person.you &&
                                                                        " ⭐"}
                                                                </p>

                                                                {person.you && (
                                                                    <p className="text-[9px] text-slate-400">
                                                                        Your position
                                                                    </p>
                                                                )}

                                                            </div>

                                                            <span className="text-xs font-black">
                                                                {
                                                                    person.score
                                                                }
                                                            </span>

                                                        </div>
                                                    )
                                                )}

                                            </div>

                                            <div className="mt-4 flex items-center justify-between rounded-xl bg-white/5 px-4 py-3">

                                                <span className="text-[10px] font-semibold text-slate-400">
                                                    Your rank
                                                </span>

                                                <span className="text-sm font-black">
                                                    #3
                                                </span>

                                            </div>

                                        </div>

                                    </div>
                                )}

                                {/* DEMO FOOTER */}

                                <div
                                    className={`
                                        mt-5
                                        flex items-center
                                        justify-between
                                        border-t
                                        pt-4
                                        ${
                                            darkMode
                                                ? "border-white/10"
                                                : "border-slate-100"
                                        }
                                    `}
                                >

                                    <div>

                                        <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">
                                            How TryQuizzers works
                                        </p>

                                        <p
                                            key={demoStep}
                                            className={`
                                                hero-stage-text
                                                mt-1
                                                text-xs
                                                font-bold
                                                sm:text-sm
                                                ${
                                                    darkMode
                                                        ? "text-white"
                                                        : "text-black"
                                                }
                                            `}
                                        >
                                            {
                                                demoStages[
                                                    demoStep
                                                ].title
                                            }
                                        </p>

                                    </div>

                                    <div className="flex items-center gap-1.5">

                                        {[0, 1, 2].map(
                                            (index) => (
                                                <span
                                                    key={
                                                        index
                                                    }
                                                    className={`
                                                        h-2
                                                        rounded-full
                                                        transition-all
                                                        duration-500
                                                        ${
                                                            demoStep ===
                                                            index
                                                                ? "w-6 bg-black dark:bg-white"
                                                                : darkMode
                                                                ? "w-2 bg-slate-700"
                                                                : "w-2 bg-slate-200"
                                                        }
                                                    `}
                                                />
                                            )
                                        )}

                                    </div>

                                </div>

                                {/* REAL PLATFORM DATA */}

                                <div
                                    className={`
                                        mt-4
                                        rounded-2xl
                                        p-4
                                        shadow-sm
                                        transition-colors
                                        duration-500
                                        ${softBg}
                                    `}
                                >

                                    <div className="flex items-center justify-between">

                                        <div>

                                            <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-400 sm:text-xs">
                                                TRYQUIZZERS PLATFORM
                                            </p>

                                            <p
                                                className={`
                                                    mt-1
                                                    text-sm
                                                    font-bold
                                                    sm:text-base
                                                    ${
                                                        darkMode
                                                            ? "text-white"
                                                            : "text-black"
                                                    }
                                                `}
                                            >
                                                Ready to start learning?
                                            </p>

                                        </div>

                                        <span className="text-lg">
                                            🚀
                                        </span>

                                    </div>

                                    <div className="mt-3 grid grid-cols-3 gap-2.5">

                                        {[
                                            [
                                                stats.categories,
                                                "Categories",
                                            ],
                                            [
                                                stats.quizzes,
                                                "Quizzes",
                                            ],
                                            [
                                                stats.questions,
                                                "Questions",
                                            ],
                                        ].map(
                                            ([value, label]) => (
                                                <div
                                                    key={
                                                        label
                                                    }
                                                    className={`
                                                        rounded-xl
                                                        px-2 py-3
                                                        text-center
                                                        ${
                                                            darkMode
                                                                ? "bg-[#222]"
                                                                : "bg-white"
                                                        }
                                                    `}
                                                >

                                                    <p
                                                        className={`
                                                            text-xl
                                                            font-bold
                                                            sm:text-2xl
                                                            ${
                                                                darkMode
                                                                    ? "text-white"
                                                                    : "text-black"
                                                            }
                                                        `}
                                                    >
                                                        {loadingStats
                                                            ? "—"
                                                            : value}
                                                    </p>

                                                    <p className="text-[10px] text-slate-500 sm:text-xs">
                                                        {label}
                                                    </p>

                                                </div>
                                            )
                                        )}

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
                    className={`scroll-mt-24 ${pageBg}`}
                >

                    <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">

                        <div className="mx-auto max-w-2xl text-center">

                            <p
                                className={`
                                    text-sm
                                    font-semibold
                                    uppercase
                                    tracking-wide
                                    ${subtleText}
                                `}
                            >
                                Everything you need
                            </p>

                            <h2
                                className={`
                                    mt-2
                                    text-3xl
                                    font-black
                                    tracking-tight
                                    sm:text-4xl
                                    ${
                                        darkMode
                                            ? "text-white"
                                            : "text-black"
                                    }
                                `}
                            >
                                Built for better learning
                            </h2>

                            <p
                                className={`
                                    mt-3
                                    ${mutedText}
                                `}
                            >
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
                            ].map(
                                ([icon, title, text]) => (
                                    <div
                                        key={title}
                                        className={`
                                            rounded-2xl
                                            p-6
                                            shadow-sm
                                            transition-all
                                            duration-500
                                            hover:-translate-y-1
                                            hover:shadow-xl
                                            ${cardBg}
                                            ${borderColor}
                                        `}
                                    >

                                        <div
                                            className={`
                                                flex
                                                h-12 w-12
                                                items-center
                                                justify-center
                                                rounded-2xl
                                                text-xl
                                                ${
                                                    darkMode
                                                        ? "bg-[#222]"
                                                        : "bg-slate-50"
                                                }
                                            `}
                                        >
                                            {icon}
                                        </div>

                                        <h3
                                            className={`
                                                mt-5
                                                text-lg
                                                font-bold
                                                ${
                                                    darkMode
                                                        ? "text-white"
                                                        : "text-black"
                                                }
                                            `}
                                        >
                                            {title}
                                        </h3>

                                        <p
                                            className={`
                                                mt-2
                                                text-sm
                                                leading-6
                                                ${mutedText}
                                            `}
                                        >
                                            {text}
                                        </p>

                                    </div>
                                )
                            )}

                        </div>

                    </div>

                </section>

                {/* =================================================
                    HOW IT WORKS
                ================================================= */}

                <section
                    id="how-it-works"
                    className={`scroll-mt-24 ${pageBg}`}
                >

                    <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">

                        <div className="mx-auto max-w-2xl text-center">

                            <p
                                className={`
                                    text-sm
                                    font-semibold
                                    uppercase
                                    tracking-wide
                                    ${subtleText}
                                `}
                            >
                                Simple process
                            </p>

                            <h2
                                className={`
                                    mt-2
                                    text-3xl
                                    font-black
                                    tracking-tight
                                    ${
                                        darkMode
                                            ? "text-white"
                                            : "text-black"
                                    }
                                `}
                            >
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
                            ].map(
                                ([number, title, text]) => (
                                    <div
                                        key={number}
                                        className={`
                                            rounded-2xl
                                            p-6
                                            transition-all
                                            duration-500
                                            hover:shadow-lg
                                            ${
                                                darkMode
                                                    ? "bg-[#151515] ring-1 ring-white/10"
                                                    : "bg-slate-50 ring-1 ring-slate-100"
                                            }
                                        `}
                                    >

                                        <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-black text-xs font-bold text-white">
                                            {number}
                                        </span>

                                        <h3
                                            className={`
                                                mt-5
                                                text-lg
                                                font-bold
                                                ${
                                                    darkMode
                                                        ? "text-white"
                                                        : "text-black"
                                                }
                                            `}
                                        >
                                            {title}
                                        </h3>

                                        <p
                                            className={`
                                                mt-2
                                                text-sm
                                                leading-6
                                                ${mutedText}
                                            `}
                                        >
                                            {text}
                                        </p>

                                    </div>
                                )
                            )}

                        </div>

                    </div>

                </section>

                {/* =================================================
                    ABOUT
                ================================================= */}

                <section
                    id="about"
                    className={`scroll-mt-24 ${pageBg}`}
                >

                    <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">

                        <div className="grid items-center gap-10 lg:grid-cols-2">

                            <div>

                                <p
                                    className={`
                                        text-sm
                                        font-semibold
                                        uppercase
                                        tracking-wide
                                        ${subtleText}
                                    `}
                                >
                                    About TryQuizzers
                                </p>

                                <h2
                                    className={`
                                        mt-2
                                        text-3xl
                                        font-black
                                        tracking-tight
                                        sm:text-4xl
                                        ${
                                            darkMode
                                                ? "text-white"
                                                : "text-black"
                                        }
                                    `}
                                >
                                    A smarter way to prepare.
                                </h2>

                                <p
                                    className={`
                                        mt-5
                                        max-w-xl
                                        leading-7
                                        ${mutedText}
                                    `}
                                >
                                    TryQuizzers is designed to make quiz-based
                                    learning simple, measurable, and engaging.
                                    Practice, understand your results, and
                                    continuously improve your knowledge.
                                </p>

                                <button
                                    onClick={() =>
                                        navigate("/register")
                                    }
                                    className="mt-6 rounded-xl bg-black px-6 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
                                >
                                    Start Learning →
                                </button>

                            </div>

                            <div className="grid grid-cols-2 gap-4">

                                {[
                                    [
                                        loadingStats
                                            ? "—"
                                            : stats.categories,
                                        "Quiz Categories",
                                    ],
                                    [
                                        loadingStats
                                            ? "—"
                                            : stats.quizzes,
                                        "Available Quizzes",
                                    ],
                                    [
                                        loadingStats
                                            ? "—"
                                            : stats.questions,
                                        "Questions",
                                    ],
                                    [
                                        "✓",
                                        "Instant Results",
                                    ],
                                ].map(
                                    ([value, label]) => (
                                        <div
                                            key={label}
                                            className={`
                                                rounded-2xl
                                                p-5
                                                shadow-sm
                                                transition-all
                                                duration-500
                                                ${
                                                    darkMode
                                                        ? "bg-[#151515] ring-1 ring-white/10"
                                                        : "bg-slate-50 ring-1 ring-slate-100"
                                                }
                                            `}
                                        >

                                            <p
                                                className={`
                                                    text-3xl
                                                    font-black
                                                    ${
                                                        darkMode
                                                            ? "text-white"
                                                            : "text-black"
                                                    }
                                                `}
                                            >
                                                {value}
                                            </p>

                                            <p
                                                className={`
                                                    mt-1
                                                    text-sm
                                                    ${
                                                        darkMode
                                                            ? "text-slate-400"
                                                            : "text-slate-600"
                                                    }
                                                `}
                                            >
                                                {label}
                                            </p>

                                        </div>
                                    )
                                )}

                            </div>

                        </div>

                    </div>

                </section>

                {/* =================================================
                    CTA
                ================================================= */}

                <section className={pageBg}>

                    <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">

                        <div className="rounded-[2rem] bg-black px-5 py-12 text-center text-white shadow-2xl shadow-slate-300/50 sm:px-10">

                            <h2 className="text-2xl font-black sm:text-3xl">
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
                                className="mt-7 rounded-xl bg-white px-7 py-3.5 text-sm font-semibold text-black transition hover:bg-slate-100"
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

            <footer className={pageBg}>

                <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-7 text-center text-sm text-slate-400 sm:px-6 md:flex-row md:items-center md:justify-between md:text-left lg:px-8">

                    <span
                        className={`
                            font-black
                            tracking-[-0.045em]
                            ${
                                darkMode
                                    ? "text-white"
                                    : "text-black"
                            }
                        `}
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