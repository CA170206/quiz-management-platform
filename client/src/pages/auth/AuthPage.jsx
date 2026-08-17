import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../../context/ThemeContext";

function AuthPage() {
    const navigate = useNavigate();

    const { darkMode, toggleTheme } = useTheme();

    const [menuOpen, setMenuOpen] = useState(false);
    const [activeSection, setActiveSection] = useState("home");

    // =========================================================
    // PLATFORM STATS
    // =========================================================

    const [stats, setStats] = useState({
        categories: 0,
        quizzes: 0,
        questions: 0,
    });

    const [loadingStats, setLoadingStats] = useState(true);

    // =========================================================
    // DEMO ANIMATION
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
    // DEMO ANIMATION
    // =========================================================

    useEffect(() => {
        let answerTimer;
        let nextTimer;
        let scoreTimer;

        if (demoStep === 0) {
            setDemoAnswer(null);

            answerTimer = setTimeout(() => {
                setDemoAnswer(currentQuestion.correct);
            }, 1600);

            nextTimer = setTimeout(() => {
                if (demoQuestion === 0) {
                    setDemoQuestion(1);
                } else {
                    setDemoStep(1);
                }
            }, 3500);
        }

        if (demoStep === 1) {
            setDemoScore(0);

            let score = 0;

            scoreTimer = setInterval(() => {
                score += 3;

                if (score >= 87) {
                    score = 87;
                    clearInterval(scoreTimer);
                }

                setDemoScore(score);
            }, 35);

            nextTimer = setTimeout(() => {
                setDemoStep(2);
            }, 4800);
        }

        if (demoStep === 2) {
            nextTimer = setTimeout(() => {
                setDemoStep(0);
                setDemoQuestion(0);
                setDemoAnswer(null);
                setDemoScore(0);
            }, 5000);
        }

        return () => {
            clearTimeout(answerTimer);
            clearTimeout(nextTimer);
            clearInterval(scoreTimer);
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
            const position = window.scrollY + 180;

            let current = "home";

            sections.forEach((id) => {
                const section =
                    document.getElementById(id);

                if (
                    section &&
                    section.offsetTop <= position
                ) {
                    current = id;
                }
            });

            setActiveSection(current);
        };

        window.addEventListener(
            "scroll",
            handleScroll,
            { passive: true }
        );

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
                setLoadingStats(true);

                const API_URL =
                    import.meta.env.VITE_API_URL ||
                    "http://localhost:5000";

                const [
                    categoriesResponse,
                    quizzesResponse,
                    questionsResponse,
                ] = await Promise.all([
                    fetch(
                        `${API_URL}/api/categories`
                    ),
                    fetch(
                        `${API_URL}/api/quizzes`
                    ),
                    fetch(
                        `${API_URL}/api/questions`
                    ),
                ]);

                const categoriesData =
                    categoriesResponse.ok
                        ? await categoriesResponse.json()
                        : {};

                const quizzesData =
                    quizzesResponse.ok
                        ? await quizzesResponse.json()
                        : {};

                const questionsData =
                    questionsResponse.ok
                        ? await questionsResponse.json()
                        : {};

                const categories =
                    Array.isArray(
                        categoriesData.categories
                    )
                        ? categoriesData.categories.length
                        : Array.isArray(categoriesData)
                        ? categoriesData.length
                        : 0;

                const quizzes =
                    Array.isArray(
                        quizzesData.quizzes
                    )
                        ? quizzesData.quizzes.length
                        : Array.isArray(quizzesData)
                        ? quizzesData.length
                        : 0;

                const questions =
                    Array.isArray(
                        questionsData.questions
                    )
                        ? questionsData.questions.length
                        : Array.isArray(questionsData)
                        ? questionsData.length
                        : 0;

                setStats({
                    categories,
                    quizzes,
                    questions,
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

        const section =
            document.getElementById(id);

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

    const cardBg = darkMode
        ? "bg-[#141414]"
        : "bg-white";

    const mainText = darkMode
        ? "text-white"
        : "text-black";

    const mutedText = darkMode
        ? "text-slate-400"
        : "text-slate-500";

    const subtleText = darkMode
        ? "text-slate-500"
        : "text-slate-400";

    const borderColor = darkMode
        ? "ring-1 ring-white/10"
        : "ring-1 ring-slate-100";

    // =========================================================
    // RENDER
    // =========================================================

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
                NAVBAR
            ===================================================== */}

            <header className="fixed left-0 right-0 top-0 z-50 px-3 pt-3 sm:px-5 lg:px-8">

                <div
                    className={`
                        relative
                        mx-auto
                        flex
                        max-w-6xl
                        items-center
                        justify-between
                        overflow-hidden
                        rounded-full
                        px-4
                        py-2.5
                        backdrop-blur-xl
                        shadow-[0_12px_35px_rgba(15,23,42,0.10)]
                        transition-colors
                        duration-500
                        sm:px-6
                        ${
                            darkMode
                                ? "bg-[#151515]/95 shadow-black/40"
                                : "bg-[#f5f3ee]/95"
                        }
                    `}
                >

                    {/* Navbar animation */}

                    <div className="pointer-events-none absolute inset-0 overflow-hidden">
                        <div className="navbar-sweep" />
                    </div>

                    {/* Logo */}

                    <button
                        onClick={() =>
                            scrollToSection("home")
                        }
                        className="relative z-10"
                    >
                        <span
                            className={`
                                text-[18px]
                                font-black
                                tracking-[-0.055em]
                                sm:text-[20px]
                                ${
                                    darkMode
                                        ? "text-white"
                                        : "text-black"
                                }
                            `}
                        >
                            TryQuizzers
                        </span>
                    </button>

                    {/* Desktop nav */}

                    <nav className="relative z-10 hidden items-center gap-1 lg:flex">

                        {navItems.map((item) => {
                            const active =
                                activeSection ===
                                item.id;

                            return (
                                <button
                                    key={item.id}
                                    onClick={() =>
                                        scrollToSection(
                                            item.id
                                        )
                                    }
                                    className={`
                                        rounded-full
                                        px-4
                                        py-2
                                        text-[12px]
                                        font-semibold
                                        transition-all
                                        duration-300
                                        ${
                                            active
                                                ? "bg-white text-black shadow-sm"
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

                    {/* Desktop actions */}

                    <div className="relative z-10 hidden items-center gap-2 lg:flex">

                        <button
                            onClick={toggleTheme}
                            className={`
                                flex
                                h-9
                                w-9
                                items-center
                                justify-center
                                rounded-full
                                text-sm
                                transition
                                ${
                                    darkMode
                                        ? "bg-white/10 text-white hover:bg-white hover:text-black"
                                        : "bg-white/70 text-slate-700 hover:bg-white hover:text-black"
                                }
                            `}
                        >
                            {darkMode
                                ? "☀"
                                : "☾"}
                        </button>

                        <button
                            onClick={() =>
                                navigate("/login")
                            }
                            className={`
                                rounded-full
                                px-4
                                py-2
                                text-[12px]
                                font-semibold
                                transition
                                ${
                                    darkMode
                                        ? "text-slate-400 hover:text-white"
                                        : "text-slate-500 hover:text-black"
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
                                flex
                                items-center
                                gap-2
                                rounded-full
                                bg-black
                                px-4
                                py-2.5
                                text-[11px]
                                font-bold
                                text-white
                                transition
                                hover:bg-slate-800
                            "
                        >
                            <span className="h-1.5 w-1.5 rounded-full bg-white" />
                            Start a Quiz
                        </button>

                    </div>

                    {/* Mobile actions */}

                    <div className="relative z-10 flex items-center gap-2 lg:hidden">

                        <button
                            onClick={toggleTheme}
                            className={`
                                flex
                                h-10
                                w-10
                                items-center
                                justify-center
                                rounded-full
                                ${
                                    darkMode
                                        ? "bg-white/10 text-white"
                                        : "bg-white/70 text-slate-800"
                                }
                            `}
                        >
                            {darkMode
                                ? "☀"
                                : "☾"}
                        </button>

                        <button
                            onClick={() =>
                                setMenuOpen(
                                    (current) =>
                                        !current
                                )
                            }
                            className={`
                                flex
                                h-10
                                w-10
                                items-center
                                justify-center
                                rounded-full
                                ${
                                    darkMode
                                        ? "bg-white/10 text-white"
                                        : "bg-white/70 text-slate-800"
                                }
                            `}
                        >
                            {menuOpen ? (
                                <span className="text-2xl">
                                    ×
                                </span>
                            ) : (
                                <div className="space-y-1.5">
                                    <span className="block h-0.5 w-5 bg-current" />
                                    <span className="block h-0.5 w-5 bg-current" />
                                    <span className="block h-0.5 w-5 bg-current" />
                                </div>
                            )}
                        </button>

                    </div>

                </div>

                {/* Mobile menu */}

                {menuOpen && (
                    <div
                        className={`
                            mx-auto
                            mt-2
                            max-w-6xl
                            rounded-[1.75rem]
                            p-2
                            backdrop-blur-xl
                            shadow-xl
                            lg:hidden
                            ${
                                darkMode
                                    ? "bg-[#151515]"
                                    : "bg-[#f5f3ee]"
                            }
                        `}
                    >

                        {navItems.map((item) => (
                            <button
                                key={item.id}
                                onClick={() =>
                                    scrollToSection(
                                        item.id
                                    )
                                }
                                className={`
                                    w-full
                                    rounded-2xl
                                    px-4
                                    py-3
                                    text-left
                                    text-sm
                                    font-semibold
                                    ${
                                        activeSection ===
                                        item.id
                                            ? "bg-black text-white"
                                            : darkMode
                                            ? "text-slate-400 hover:bg-white/10"
                                            : "text-slate-600 hover:bg-white"
                                    }
                                `}
                            >
                                {item.label}
                            </button>
                        ))}

                        <div className="grid grid-cols-2 gap-2 p-1">

                            <button
                                onClick={() => {
                                    setMenuOpen(false);
                                    navigate("/login");
                                }}
                                className={`
                                    rounded-2xl
                                    px-4
                                    py-3
                                    text-sm
                                    font-semibold
                                    ${
                                        darkMode
                                            ? "bg-white/10 text-white"
                                            : "bg-white text-slate-700"
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
                                className="rounded-2xl bg-black px-4 py-3 text-sm font-semibold text-white"
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
                .navbar-sweep {
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

                    10% {
                        opacity: 0.7;
                    }

                    50% {
                        opacity: 0.9;
                    }

                    90% {
                        opacity: 0.7;
                    }

                    100% {
                        transform: translateX(330%);
                        opacity: 0;
                    }
                }

                .demo-enter {
                    animation:
                        demoEnter
                        600ms
                        cubic-bezier(0.22, 1, 0.36, 1)
                        both;
                }

                @keyframes demoEnter {
                    from {
                        opacity: 0;
                        transform:
                            translateY(15px)
                            scale(0.98);
                    }

                    to {
                        opacity: 1;
                        transform:
                            translateY(0)
                            scale(1);
                    }
                }

                .demo-option {
                    animation:
                        optionIn
                        450ms
                        cubic-bezier(0.22, 1, 0.36, 1)
                        both;
                }

                @keyframes optionIn {
                    from {
                        opacity: 0;
                        transform: translateX(-10px);
                    }

                    to {
                        opacity: 1;
                        transform: translateX(0);
                    }
                }

                .demo-score {
                    animation:
                        scorePop
                        650ms
                        cubic-bezier(0.22, 1, 0.36, 1)
                        both;
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

                .demo-rank {
                    animation:
                        rankIn
                        550ms
                        cubic-bezier(0.22, 1, 0.36, 1)
                        both;
                }

                @keyframes rankIn {
                    from {
                        opacity: 0;
                        transform: translateX(15px);
                    }

                    to {
                        opacity: 1;
                        transform: translateX(0);
                    }
                }

                .stage-animation {
                    animation:
                        stageIn
                        650ms
                        cubic-bezier(0.22, 1, 0.36, 1)
                        both;
                }

                @keyframes stageIn {
                    from {
                        opacity: 0;
                        transform: translateY(15px);
                    }

                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }

                .progress-demo {
                    transition:
                        width
                        700ms
                        cubic-bezier(0.22, 1, 0.36, 1);
                }

                @media (prefers-reduced-motion: reduce) {
                    .navbar-sweep,
                    .demo-enter,
                    .demo-option,
                    .demo-score,
                    .demo-rank,
                    .stage-animation {
                        animation: none !important;
                    }

                    .progress-demo {
                        transition: none;
                    }
                }

                /*
                 * MOBILE ORDER
                 *
                 * text
                 * ↓
                 * animation
                 * ↓
                 * buttons
                 * ↓
                 * feature points
                 */

                @media (max-width: 639px) {
                    .hero-flow {
                        display: flex !important;
                        flex-direction: column !important;
                    }

                    .hero-left {
                        display: contents !important;
                    }

                    .hero-badge {
                        order: 1;
                    }

                    .hero-title {
                        order: 2;
                    }

                    .hero-description {
                        order: 3;
                    }

                    .hero-indicators {
                        order: 4;
                    }

                    .hero-preview {
                        order: 5;
                        margin-top: 1rem;
                    }

                    .hero-mobile-actions {
                        order: 6;
                        margin-top: 1.25rem;
                    }

                    .hero-mobile-features {
                        order: 7;
                        margin-top: 1.25rem;
                    }

                    .hero-desktop-actions,
                    .hero-desktop-features {
                        display: none !important;
                    }
                }
            `}</style>

            {/* =====================================================
                MAIN
            ===================================================== */}

            <main className={`pt-20 ${pageBg}`}>

                {/* =================================================
                    HERO
                ================================================= */}

                <section
                    id="home"
                    className="scroll-mt-24"
                >

                    <div
                        className="
                            hero-flow
                            mx-auto
                            grid
                            max-w-7xl
                            items-start
                            gap-8
                            px-4
                            py-7
                            sm:px-6
                            sm:py-10
                            lg:grid-cols-[0.9fr_1.1fr]
                            lg:gap-14
                            lg:px-8
                            lg:py-12
                        "
                    >

                        {/* =================================================
                            LEFT / TEXT
                        ================================================= */}

                        <div
                            className="
                                hero-left
                                max-w-2xl
                                pt-3
                                sm:pt-6
                                lg:pt-10
                            "
                        >

                            {/* Badge */}

                            <div
                                className={`
                                    hero-badge
                                    inline-flex
                                    items-center
                                    gap-2
                                    rounded-full
                                    px-4
                                    py-2
                                    text-xs
                                    font-semibold
                                    shadow-sm
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

                            {/* Heading */}

                            <h1
                                key={demoStep}
                                className={`
                                    hero-title
                                    stage-animation
                                    mt-5
                                    min-h-[3.8rem]
                                    text-[2.7rem]
                                    font-black
                                    leading-[0.98]
                                    tracking-[-0.055em]
                                    sm:min-h-[5rem]
                                    sm:text-5xl
                                    lg:min-h-[5.5rem]
                                    lg:text-[3.7rem]
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
                            </h1>

                            {/* Description */}

                            <div
                                key={`description-${demoStep}`}
                                className="
                                    hero-description
                                    stage-animation
                                    mt-5
                                "
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

                            {/* Indicators */}

                            <div className="hero-indicators mt-5 flex items-center gap-2">

                                {demoStages.map(
                                    (stage, index) => (
                                        <button
                                            key={
                                                stage.small
                                            }
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

                            {/* Desktop CTA */}

                            <div className="hero-desktop-actions mt-6 flex flex-col gap-3 sm:flex-row">

                                <button
                                    onClick={() =>
                                        navigate(
                                            "/register"
                                        )
                                    }
                                    className="
                                        rounded-xl
                                        bg-black
                                        px-6
                                        py-3.5
                                        text-sm
                                        font-semibold
                                        text-white
                                        shadow-lg
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
                                    className={`
                                        rounded-xl
                                        px-6
                                        py-3.5
                                        text-sm
                                        font-semibold
                                        shadow-sm
                                        transition
                                        ${
                                            darkMode
                                                ? "bg-[#171717] text-white hover:bg-[#222]"
                                                : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                                        }
                                    `}
                                >
                                    Sign In
                                </button>

                            </div>

                            {/* Desktop features */}

                            <div
                                className={`
                                    hero-desktop-features
                                    mt-6
                                    flex
                                    flex-wrap
                                    gap-x-5
                                    gap-y-2
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
                            ANIMATION / PRODUCT PREVIEW
                        ================================================= */}

                        <div className="hero-preview relative w-full">

                            <div
                                className={`
                                    absolute
                                    -right-10
                                    -top-10
                                    -z-10
                                    h-40
                                    w-40
                                    rounded-full
                                    blur-3xl
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
                                    sm:p-5
                                    ${
                                        darkMode
                                            ? "bg-[#111111] shadow-black/50 ring-1 ring-white/10"
                                            : "bg-white shadow-slate-300/40 ring-1 ring-slate-100"
                                    }
                                `}
                            >

                                {/* Preview top */}

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
                                                ${subtleText}
                                            `}
                                        >
                                            Learn. Practice. Improve.
                                        </p>

                                    </div>

                                    <div className="flex gap-1.5">

                                        {[
                                            "QUIZ",
                                            "RESULT",
                                            "RANK",
                                        ].map(
                                            (
                                                label,
                                                index
                                            ) => (
                                                <span
                                                    key={
                                                        label
                                                    }
                                                    className={`
                                                        rounded-full
                                                        px-2.5
                                                        py-1
                                                        text-[9px]
                                                        font-bold
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

                                {/* =================================================
                                    QUIZ
                                ================================================= */}

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

                                                <span className="rounded-full bg-white/10 px-3 py-1 text-[10px] text-slate-300">
                                                    30 sec
                                                </span>

                                            </div>

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

                                                        const correct =
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
                                                                    ${
                                                                        selected &&
                                                                        correct
                                                                            ? "border-white bg-white text-black"
                                                                            : "border-white/10 bg-white/5 text-slate-300"
                                                                    }
                                                                `}
                                                                style={{
                                                                    animationDelay: `${index * 80}ms`,
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
                                                                            correct
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
                                                                    correct && (
                                                                        <span>
                                                                            ✓
                                                                        </span>
                                                                    )}

                                                            </div>
                                                        );
                                                    }
                                                )}

                                            </div>

                                            {/* Progress */}

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

                                {/* =================================================
                                    RESULT
                                ================================================= */}

                                {demoStep === 1 && (
                                    <div className="demo-enter mt-5">

                                        <div
                                            className={`
                                                rounded-2xl
                                                p-5
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

                                                <div className="demo-score mx-auto mt-4 flex h-28 w-28 items-center justify-center rounded-full border-[8px] border-black bg-white sm:h-32 sm:w-32">

                                                    <div>

                                                        <p className="text-3xl font-black text-black sm:text-4xl">
                                                            {demoScore}%
                                                        </p>

                                                        <p className="text-[9px] font-semibold uppercase text-slate-400">
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

                                                    <p className="mt-1 text-[10px] text-slate-400">
                                                        Correct
                                                    </p>
                                                </div>

                                                <div
                                                    className={`
                                                        rounded-xl
                                                        p-4
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

                                                    <p className="mt-1 text-[10px] text-slate-400">
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

                                {/* =================================================
                                    LEADERBOARD
                                ================================================= */}

                                {demoStep === 2 && (
                                    <div className="demo-enter mt-5">

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

                                                <span className="text-2xl">
                                                    🏆
                                                </span>

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
                                                                        : "bg-white/5"
                                                                }
                                                            `}
                                                            style={{
                                                                animationDelay: `${index * 100}ms`,
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

                                                <span className="text-[10px] text-slate-400">
                                                    Your rank
                                                </span>

                                                <span className="text-sm font-black">
                                                    #3
                                                </span>

                                            </div>

                                        </div>

                                    </div>
                                )}

                                {/* Preview footer */}

                                <div
                                    className={`
                                        mt-5
                                        flex
                                        items-center
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
                                                stage-animation
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

                                    <div className="flex gap-1.5">

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

                                {/* Real platform stats */}

                                <div
                                    className={`
                                        mt-4
                                        rounded-2xl
                                        p-4
                                        ${
                                            darkMode
                                                ? "bg-[#151515]"
                                                : "bg-slate-50"
                                        }
                                    `}
                                >

                                    <div className="flex items-center justify-between">

                                        <div>

                                            <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">
                                                TRYQUIZZERS PLATFORM
                                            </p>

                                            <p
                                                className={`
                                                    mt-1
                                                    text-sm
                                                    font-bold
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

                                        <span>
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
                                                        px-2
                                                        py-3
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

                                                    <p className="text-[10px] text-slate-500">
                                                        {label}
                                                    </p>

                                                </div>
                                            )
                                        )}

                                    </div>

                                </div>

                            </div>

                        </div>

                        {/* =================================================
                            MOBILE CTA
                        ================================================= */}

                        <div className="hero-mobile-actions hidden">

                            <div className="flex flex-col gap-3">

                                <button
                                    onClick={() =>
                                        navigate(
                                            "/register"
                                        )
                                    }
                                    className="
                                        w-full
                                        rounded-xl
                                        bg-black
                                        px-6
                                        py-3.5
                                        text-sm
                                        font-semibold
                                        text-white
                                        shadow-lg
                                        transition
                                        hover:bg-slate-800
                                    "
                                >
                                    Get Started →
                                </button>

                                <button
                                    onClick={() =>
                                        navigate("/login")
                                    }
                                    className={`
                                        w-full
                                        rounded-xl
                                        px-6
                                        py-3.5
                                        text-sm
                                        font-semibold
                                        ${
                                            darkMode
                                                ? "bg-[#171717] text-white"
                                                : "bg-slate-100 text-slate-700"
                                        }
                                    `}
                                >
                                    Sign In
                                </button>

                            </div>

                        </div>

                        {/* =================================================
                            MOBILE FEATURES
                        ================================================= */}

                        <div
                            className={`
                                hero-mobile-features
                                hidden
                                flex-wrap
                                gap-x-4
                                gap-y-2
                                text-xs
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

                </section>

                {/* =====================================================
                    FEATURES
                ===================================================== */}

                <section
                    id="features"
                    className="scroll-mt-24"
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
                                                h-12
                                                w-12
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

                                        <h3 className="mt-5 text-lg font-bold">
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

                {/* =====================================================
                    HOW IT WORKS
                ===================================================== */}

                <section
                    id="how-it-works"
                    className="scroll-mt-24"
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

                            <h2 className="mt-2 text-3xl font-black tracking-tight sm:text-4xl">
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

                                        <h3 className="mt-5 text-lg font-bold">
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

                {/* =====================================================
                    ABOUT
                ===================================================== */}

                <section
                    id="about"
                    className="scroll-mt-24"
                >

                    <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">

                        <div
                            className={`
                                rounded-[2rem]
                                p-8
                                text-center
                                sm:p-12
                                ${
                                    darkMode
                                        ? "bg-[#151515] ring-1 ring-white/10"
                                        : "bg-[#f5f3ee] ring-1 ring-slate-100"
                                }
                            `}
                        >

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

                            <h2 className="mx-auto mt-3 max-w-2xl text-3xl font-black tracking-tight sm:text-4xl">
                                Learn by practicing.
                                Improve by understanding.
                            </h2>

                            <p
                                className={`
                                    mx-auto
                                    mt-4
                                    max-w-2xl
                                    text-sm
                                    leading-7
                                    sm:text-base
                                    ${mutedText}
                                `}
                            >
                                TryQuizzers helps students practice
                                through quizzes, understand their
                                results, and track their progress over
                                time.
                            </p>

                            <button
                                onClick={() =>
                                    navigate(
                                        "/register"
                                    )
                                }
                                className="
                                    mt-7
                                    rounded-xl
                                    bg-black
                                    px-7
                                    py-3.5
                                    text-sm
                                    font-semibold
                                    text-white
                                    transition
                                    hover:bg-slate-800
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

            <footer className={pageBg}>

                <div
                    className={`
                        mx-auto
                        flex
                        max-w-7xl
                        flex-col
                        gap-4
                        px-4
                        py-8
                        text-center
                        text-sm
                        ${subtleText}
                        sm:px-6
                        md:flex-row
                        md:items-center
                        md:justify-between
                        md:text-left
                        lg:px-8
                    `}
                >

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
                        ©{" "}
                        {new Date().getFullYear()}{" "}
                        TryQuizzers. All rights reserved.
                    </p>

                </div>

            </footer>

        </div>
    );
}

export default AuthPage;