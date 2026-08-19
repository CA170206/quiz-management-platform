import Navbar from "../../components/common/Navbar.jsx";
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

const API_URL =
    `${import.meta.env.VITE_API_URL}/api/quizzes`;

const CATEGORY_API_URL =
    `${import.meta.env.VITE_API_URL}/api/categories`;

function QuizList() {
    const navigate = useNavigate();

    const [quizzes, setQuizzes] = useState([]);
    const [categories, setCategories] = useState([]);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [search, setSearch] = useState("");
    const [selectedCategory, setSelectedCategory] =
        useState("all");

    const [selectedDifficulty, setSelectedDifficulty] =
        useState("all");

    const [selectedDuration, setSelectedDuration] =
        useState("all");

    const [sortBy, setSortBy] =
        useState("newest");

    // ==========================================
    // FETCH QUIZZES + CATEGORIES
    // ==========================================

    const fetchData = async () => {
        try {
            setLoading(true);
            setError("");

            const [
                quizResponse,
                categoryResponse,
            ] = await Promise.all([
                fetch(API_URL),
                fetch(CATEGORY_API_URL),
            ]);

            if (!quizResponse.ok) {
                throw new Error(
                    "Failed to fetch quizzes"
                );
            }

            if (!categoryResponse.ok) {
                throw new Error(
                    "Failed to fetch categories"
                );
            }

            const quizData =
                await quizResponse.json();

            const categoryData =
                await categoryResponse.json();

            setQuizzes(quizData);
            setCategories(categoryData);

        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    // ==========================================
    // CATEGORY NAME
    // ==========================================

    const getCategoryName = (categoryId) => {
        const category =
            categories.find(
                (item) =>
                    item.id === categoryId
            );

        return category?.name || "General";
    };

    // ==========================================
    // FILTER + SORT
    // ==========================================

    const filteredQuizzes = useMemo(() => {

        const result = quizzes.filter((quiz) => {

            const searchText =
                search.toLowerCase().trim();

            // Search
            const matchesSearch =
                !searchText ||
                quiz.title
                    ?.toLowerCase()
                    .includes(searchText) ||
                quiz.description
                    ?.toLowerCase()
                    .includes(searchText);

            // Category
            const matchesCategory =
                selectedCategory === "all" ||
                String(quiz.category_id) ===
                    String(selectedCategory);

            // Difficulty
            const matchesDifficulty =
                selectedDifficulty === "all" ||
                quiz.difficulty?.toLowerCase() ===
                    selectedDifficulty;

            // Duration
            let matchesDuration = true;

            if (selectedDuration === "short") {
                matchesDuration =
                    Number(quiz.duration) <= 15;
            }

            if (selectedDuration === "medium") {
                matchesDuration =
                    Number(quiz.duration) > 15 &&
                    Number(quiz.duration) <= 30;
            }

            if (selectedDuration === "long") {
                matchesDuration =
                    Number(quiz.duration) > 30;
            }

            return (
                matchesSearch &&
                matchesCategory &&
                matchesDifficulty &&
                matchesDuration
            );
        });

        // Sort
        return [...result].sort((a, b) => {

            if (sortBy === "newest") {
                return (
                    new Date(b.created_at || 0) -
                    new Date(a.created_at || 0)
                );
            }

            if (sortBy === "oldest") {
                return (
                    new Date(a.created_at || 0) -
                    new Date(b.created_at || 0)
                );
            }

            if (sortBy === "shortest") {
                return (
                    Number(a.duration || 0) -
                    Number(b.duration || 0)
                );
            }

            if (sortBy === "longest") {
                return (
                    Number(b.duration || 0) -
                    Number(a.duration || 0)
                );
            }

            return 0;
        });

    }, [
        quizzes,
        search,
        selectedCategory,
        selectedDifficulty,
        selectedDuration,
        sortBy,
    ]);

    // ==========================================
    // CLEAR FILTERS
    // ==========================================

    const clearFilters = () => {
        setSearch("");
        setSelectedCategory("all");
        setSelectedDifficulty("all");
        setSelectedDuration("all");
        setSortBy("newest");
    };

    const hasFilters =
        search ||
        selectedCategory !== "all" ||
        selectedDifficulty !== "all" ||
        selectedDuration !== "all" ||
        sortBy !== "newest";

    // ==========================================
    // LOADING
    // ==========================================

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-50">

                <Navbar />

                <main className="px-4 pb-10 pt-24 sm:px-6 sm:pt-28">

                    <div className="mx-auto max-w-7xl">

                        <div className="mb-7">

                            <div className="h-4 w-28 animate-pulse rounded bg-slate-200" />

                            <div className="mt-3 h-8 w-64 animate-pulse rounded bg-slate-200 sm:h-9 sm:w-72" />

                            <div className="mt-3 h-5 w-full max-w-md animate-pulse rounded bg-slate-200" />

                        </div>

                        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">

                            {[
                                1,
                                2,
                                3,
                                4,
                                5,
                                6,
                            ].map((item) => (
                                <div
                                    key={item}
                                    className="
                                        h-80
                                        animate-pulse
                                        rounded-2xl
                                        bg-white
                                        shadow-sm
                                        ring-1
                                        ring-slate-200
                                    "
                                />
                            ))}

                        </div>

                    </div>

                </main>

            </div>
        );
    }

    // ==========================================
    // UI
    // ==========================================

    return (
        <div className="min-h-screen bg-slate-50">

            <Navbar />

            <main className="px-4 pb-10 pt-24 sm:px-6 sm:pt-28">

                <div className="mx-auto max-w-7xl">

                    {/* HEADER */}

                    <div className="mb-6 sm:mb-8">

                        <p className="text-sm font-semibold text-black">
                            Student Portal
                        </p>

                        <h1 className="mt-2 text-2xl font-bold leading-tight text-slate-900 sm:text-3xl">
                            Available Quizzes
                        </h1>

                        <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
                            Choose a quiz, test your knowledge,
                            and improve your score.
                        </p>

                    </div>

                    {/* ================================= */}
                    {/* SEARCH + FILTERS */}
                    {/* ================================= */}

                    <div className="mb-6 rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-200 sm:mb-8 sm:p-5">

                        {/* Search */}

                        <div className="relative">

                            <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                                🔍
                            </span>

                            <input
                                type="text"
                                value={search}
                                onChange={(e) =>
                                    setSearch(
                                        e.target.value
                                    )
                                }
                                placeholder="Search quizzes..."
                                className="
                                    w-full
                                    rounded-xl
                                    border
                                    border-slate-200
                                    bg-slate-50
                                    py-3
                                    pl-11
                                    pr-4
                                    text-sm
                                    outline-none
                                    transition
                                    focus:border-black
                                    focus:bg-white
                                    focus:ring-2
                                    focus:ring-slate-200
                                "
                            />

                        </div>

                        {/* Filters */}

                        <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">

                            {/* Category */}

                            <select
                                value={selectedCategory}
                                onChange={(e) =>
                                    setSelectedCategory(
                                        e.target.value
                                    )
                                }
                                className="
                                    w-full
                                    rounded-xl
                                    border
                                    border-slate-200
                                    bg-slate-50
                                    px-4
                                    py-3
                                    text-sm
                                    font-medium
                                    text-slate-700
                                    outline-none
                                    focus:border-black
                                "
                            >

                                <option value="all">
                                    All Categories
                                </option>

                                {categories.map(
                                    (category) => (
                                        <option
                                            key={
                                                category.id
                                            }
                                            value={
                                                category.id
                                            }
                                        >
                                            {
                                                category.name
                                            }
                                        </option>
                                    )
                                )}

                            </select>

                            {/* Difficulty */}

                            <select
                                value={selectedDifficulty}
                                onChange={(e) =>
                                    setSelectedDifficulty(
                                        e.target.value
                                    )
                                }
                                className="
                                    w-full
                                    rounded-xl
                                    border
                                    border-slate-200
                                    bg-slate-50
                                    px-4
                                    py-3
                                    text-sm
                                    font-medium
                                    text-slate-700
                                    outline-none
                                    focus:border-black
                                "
                            >

                                <option value="all">
                                    All Difficulties
                                </option>

                                <option value="easy">
                                    Easy
                                </option>

                                <option value="medium">
                                    Medium
                                </option>

                                <option value="hard">
                                    Hard
                                </option>

                            </select>

                            {/* Duration */}

                            <select
                                value={selectedDuration}
                                onChange={(e) =>
                                    setSelectedDuration(
                                        e.target.value
                                    )
                                }
                                className="
                                    w-full
                                    rounded-xl
                                    border
                                    border-slate-200
                                    bg-slate-50
                                    px-4
                                    py-3
                                    text-sm
                                    font-medium
                                    text-slate-700
                                    outline-none
                                    focus:border-black
                                "
                            >

                                <option value="all">
                                    Any Duration
                                </option>

                                <option value="short">
                                    Short — ≤ 15 min
                                </option>

                                <option value="medium">
                                    Medium — 16–30 min
                                </option>

                                <option value="long">
                                    Long — 31+ min
                                </option>

                            </select>

                            {/* Sort */}

                            <select
                                value={sortBy}
                                onChange={(e) =>
                                    setSortBy(
                                        e.target.value
                                    )
                                }
                                className="
                                    w-full
                                    rounded-xl
                                    border
                                    border-slate-200
                                    bg-slate-50
                                    px-4
                                    py-3
                                    text-sm
                                    font-medium
                                    text-slate-700
                                    outline-none
                                    focus:border-black
                                "
                            >

                                <option value="newest">
                                    Newest First
                                </option>

                                <option value="oldest">
                                    Oldest First
                                </option>

                                <option value="shortest">
                                    Shortest First
                                </option>

                                <option value="longest">
                                    Longest First
                                </option>

                            </select>

                        </div>

                        {/* Results */}

                        <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-4">

                            <p className="text-sm text-slate-500">

                                Showing{" "}

                                <span className="font-semibold text-slate-900">
                                    {filteredQuizzes.length}
                                </span>{" "}

                                of{" "}

                                <span className="font-semibold text-slate-900">
                                    {quizzes.length}
                                </span>{" "}

                                quizzes

                            </p>

                            {hasFilters && (
                                <button
                                    type="button"
                                    onClick={clearFilters}
                                    className="
                                        shrink-0
                                        text-xs
                                        font-semibold
                                        text-slate-700
                                        hover:text-black
                                    "
                                >
                                    Clear Filters
                                </button>
                            )}

                        </div>

                    </div>

                    {/* ERROR */}

                    {error && (
                        <div className="mb-6 rounded-xl border border-red-100 bg-red-50 px-4 py-4 text-sm text-red-600">
                            {error}
                        </div>
                    )}

                    {/* EMPTY */}

                    {!error &&
                    filteredQuizzes.length === 0 ? (

                        <div className="rounded-2xl bg-white px-5 py-12 text-center shadow-sm ring-1 ring-slate-200 sm:px-6 sm:py-16">

                            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-slate-100 text-2xl">
                                🔍
                            </div>

                            <h2 className="mt-5 text-xl font-bold text-slate-900">
                                No quizzes found
                            </h2>

                            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
                                Try changing your filters
                                or search term.
                            </p>

                            <button
                                type="button"
                                onClick={clearFilters}
                                className="
                                    mt-6
                                    rounded-lg
                                    bg-black
                                    px-5
                                    py-3
                                    text-sm
                                    font-semibold
                                    text-white
                                    hover:bg-slate-800
                                "
                            >
                                Show All Quizzes
                            </button>

                        </div>

                    ) : (

                        /* QUIZZES */

                        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">

                            {filteredQuizzes.map(
                                (quiz) => (

                                    <div
                                        key={quiz.id}
                                        className="
                                            group
                                            flex
                                            min-w-0
                                            flex-col
                                            overflow-hidden
                                            rounded-2xl
                                            bg-white
                                            shadow-sm
                                            ring-1
                                            ring-slate-200
                                            transition
                                            duration-200
                                            hover:-translate-y-1
                                            hover:shadow-lg
                                        "
                                    >

                                        {/* TOP */}

                                        <div className="
                                            relative
                                            overflow-hidden
                                            bg-gradient-to-br
                                            from-slate-950
                                            via-slate-900
                                            to-slate-800
                                            px-5
                                            py-6
                                            sm:px-6
                                            sm:py-7
                                        ">

                                            <div className="relative flex items-start justify-between gap-3">

                                                <div className="
                                                    flex
                                                    h-11
                                                    w-11
                                                    shrink-0
                                                    items-center
                                                    justify-center
                                                    rounded-xl
                                                    bg-white/10
                                                    text-lg
                                                    font-bold
                                                    text-white
                                                    ring-1
                                                    ring-white/10
                                                ">
                                                    Q
                                                </div>

                                                <span className="
                                                    max-w-[65%]
                                                    truncate
                                                    rounded-full
                                                    bg-white/10
                                                    px-3
                                                    py-1.5
                                                    text-xs
                                                    font-semibold
                                                    text-white
                                                    ring-1
                                                    ring-white/10
                                                ">
                                                    {
                                                        getCategoryName(
                                                            quiz.category_id
                                                        )
                                                    }
                                                </span>

                                            </div>

                                            <h2 className="
                                                relative
                                                mt-5
                                                line-clamp-2
                                                min-h-[52px]
                                                break-words
                                                text-lg
                                                font-bold
                                                leading-7
                                                text-white
                                            ">
                                                {quiz.title}
                                            </h2>

                                        </div>

                                        {/* BODY */}

                                        <div className="
                                            flex
                                            flex-1
                                            flex-col
                                            px-5
                                            py-5
                                            sm:px-6
                                            sm:py-6
                                        ">

                                            <p className="
                                                line-clamp-3
                                                min-h-[72px]
                                                text-sm
                                                leading-6
                                                text-slate-500
                                            ">
                                                {quiz.description ||
                                                    "Test your knowledge with this quiz."}
                                            </p>

                                            {/* INFO */}

                                            <div className="
                                                mt-5
                                                grid
                                                grid-cols-3
                                                gap-2
                                                border-t
                                                border-slate-100
                                                pt-5
                                            ">

                                                <div className="rounded-xl bg-slate-50 p-3">

                                                    <p className="text-xs text-slate-400">
                                                        Duration
                                                    </p>

                                                    <p className="mt-1 text-sm font-bold text-slate-800">
                                                        {
                                                            quiz.duration
                                                        }{" "}
                                                        min
                                                    </p>

                                                </div>

                                                <div className="rounded-xl bg-slate-50 p-3">

                                                    <p className="text-xs text-slate-400">
                                                        Level
                                                    </p>

                                                    <p className="mt-1 truncate text-sm font-bold capitalize text-slate-800">
                                                        {
                                                            quiz.difficulty ||
                                                            "Medium"
                                                        }
                                                    </p>

                                                </div>

                                                <div className="rounded-xl bg-slate-50 p-3">

                                                    <p className="text-xs text-slate-400">
                                                        Category
                                                    </p>

                                                    <p className="mt-1 truncate text-sm font-bold text-slate-800">
                                                        {
                                                            getCategoryName(
                                                                quiz.category_id
                                                            )
                                                        }
                                                    </p>

                                                </div>

                                            </div>

                                            {/* BUTTON */}

                                            <button
                                                type="button"
                                                onClick={() =>
                                                    navigate(
                                                        `/student/quizzes/${quiz.id}`
                                                    )
                                                }
                                                className="
                                                    mt-5
                                                    w-full
                                                    rounded-lg
                                                    bg-black
                                                    px-5
                                                    py-3
                                                    text-sm
                                                    font-semibold
                                                    text-white
                                                    transition
                                                    hover:bg-slate-800
                                                "
                                            >
                                                View Quiz

                                                <span className="ml-2 inline-block transition-transform group-hover:translate-x-1">
                                                    →
                                                </span>

                                            </button>

                                        </div>

                                    </div>

                                )
                            )}

                        </div>

                    )}

                </div>

            </main>

        </div>
    );
}

export default QuizList;