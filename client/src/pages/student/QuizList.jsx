import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

const API_URL = "http://localhost:5000/api/quizzes";
const CATEGORY_API_URL =
    "http://localhost:5000/api/categories";

function QuizList() {
    const navigate = useNavigate();

    const [quizzes, setQuizzes] = useState([]);
    const [categories, setCategories] = useState([]);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [search, setSearch] = useState("");
    const [selectedCategory, setSelectedCategory] =
        useState("all");

    const fetchData = async () => {
        try {
            setLoading(true);
            setError("");

            const [quizResponse, categoryResponse] =
                await Promise.all([
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

            const quizData = await quizResponse.json();
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

    const getCategoryName = (categoryId) => {
        const category = categories.find(
            (item) => item.id === categoryId
        );

        return category?.name || "General";
    };

    const filteredQuizzes = useMemo(() => {
        return quizzes.filter((quiz) => {
            const searchText = search
                .toLowerCase()
                .trim();

            const matchesSearch =
                !searchText ||
                quiz.title
                    ?.toLowerCase()
                    .includes(searchText) ||
                quiz.description
                    ?.toLowerCase()
                    .includes(searchText);

            const matchesCategory =
                selectedCategory === "all" ||
                String(quiz.category_id) ===
                    String(selectedCategory);

            return (
                matchesSearch &&
                matchesCategory
            );
        });
    }, [
        quizzes,
        search,
        selectedCategory,
    ]);

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-50 px-6 py-10">
                <div className="mx-auto max-w-7xl">

                    <div className="mb-8">
                        <div className="h-4 w-28 animate-pulse rounded bg-slate-200" />

                        <div className="mt-3 h-9 w-72 animate-pulse rounded bg-slate-200" />

                        <div className="mt-3 h-5 w-96 max-w-full animate-pulse rounded bg-slate-200" />
                    </div>

                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        {[1, 2, 3, 4, 5, 6].map(
                            (item) => (
                                <div
                                    key={item}
                                    className="h-80 animate-pulse rounded-2xl bg-white shadow-sm ring-1 ring-slate-200"
                                />
                            )
                        )}
                    </div>

                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 px-6 py-10">
            <div className="mx-auto max-w-7xl">

                {/* HEADER */}
                <div className="mb-8">
                    <p className="text-sm font-semibold text-blue-600">
                        Student Portal
                    </p>

                    <h1 className="mt-2 text-3xl font-bold text-slate-900">
                        Available Quizzes
                    </h1>

                    <p className="mt-2 text-slate-500">
                        Choose a quiz, test your knowledge,
                        and improve your score.
                    </p>
                </div>

                {/* SEARCH + FILTER */}
                <div className="mb-8 rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-200 sm:p-5">

                    <div className="flex flex-col gap-4 lg:flex-row">

                        {/* Search */}
                        <div className="relative flex-1">

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
                                className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-11 pr-4 text-sm outline-none transition focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100"
                            />

                        </div>

                        {/* Category */}
                        <select
                            value={selectedCategory}
                            onChange={(e) =>
                                setSelectedCategory(
                                    e.target.value
                                )
                            }
                            className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-700 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100"
                        >
                            <option value="all">
                                All Categories
                            </option>

                            {categories.map(
                                (category) => (
                                    <option
                                        key={category.id}
                                        value={category.id}
                                    >
                                        {category.name}
                                    </option>
                                )
                            )}
                        </select>

                    </div>

                    {/* Results count */}
                    <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-4">

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

                        {(search ||
                            selectedCategory !==
                                "all") && (
                            <button
                                type="button"
                                onClick={() => {
                                    setSearch("");
                                    setSelectedCategory(
                                        "all"
                                    );
                                }}
                                className="text-xs font-semibold text-blue-600 hover:text-blue-700"
                            >
                                Clear Filters
                            </button>
                        )}

                    </div>
                </div>

                {/* ERROR */}
                {error && (
                    <div className="mb-6 rounded-xl border border-red-100 bg-red-50 px-5 py-4 text-sm text-red-600">
                        {error}
                    </div>
                )}

                {/* EMPTY */}
                {!error &&
                filteredQuizzes.length === 0 ? (
                    <div className="rounded-2xl bg-white px-6 py-16 text-center shadow-sm ring-1 ring-slate-200">

                        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-slate-100 text-2xl">
                            🔍
                        </div>

                        <h2 className="mt-5 text-xl font-bold text-slate-900">
                            No quizzes found
                        </h2>

                        <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
                            Try changing your search or
                            selecting a different category.
                        </p>

                        <button
                            type="button"
                            onClick={() => {
                                setSearch("");
                                setSelectedCategory(
                                    "all"
                                );
                            }}
                            className="mt-6 rounded-lg bg-blue-600 px-5 py-3 text-sm font-semibold text-white hover:bg-blue-700"
                        >
                            Show All Quizzes
                        </button>

                    </div>
                ) : (
                    /* QUIZZES */
                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">

                        {filteredQuizzes.map(
                            (quiz, index) => (
                                <div
                                    key={quiz.id}
                                    className="group flex flex-col overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-slate-200 transition duration-200 hover:-translate-y-1 hover:shadow-lg"
                                >

                                    {/* TOP */}
                                    <div className="relative overflow-hidden bg-gradient-to-br from-blue-600 to-blue-700 px-6 py-7">

                                        <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-white/5" />

                                        <div className="relative flex items-start justify-between gap-3">

                                            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/15 text-lg font-bold text-white backdrop-blur-sm">
                                                Q
                                            </div>

                                            <span className="rounded-full bg-white/15 px-3 py-1.5 text-xs font-semibold text-white backdrop-blur-sm">
                                                {getCategoryName(
                                                    quiz.category_id
                                                )}
                                            </span>

                                        </div>

                                        <h2 className="relative mt-6 line-clamp-2 min-h-[56px] text-xl font-bold leading-7 text-white">
                                            {quiz.title}
                                        </h2>

                                    </div>

                                    {/* BODY */}
                                    <div className="flex flex-1 flex-col px-6 py-6">

                                        <p className="line-clamp-3 min-h-[72px] text-sm leading-6 text-slate-500">
                                            {quiz.description ||
                                                "Test your knowledge with this quiz."}
                                        </p>

                                        {/* INFO */}
                                        <div className="mt-6 grid grid-cols-2 gap-3 border-t border-slate-100 pt-5">

                                            <div className="rounded-xl bg-slate-50 p-3">
                                                <p className="text-xs text-slate-400">
                                                    Duration
                                                </p>

                                                <p className="mt-1 text-sm font-bold text-slate-800">
                                                    {quiz.duration}{" "}
                                                    min
                                                </p>
                                            </div>

                                            <div className="rounded-xl bg-slate-50 p-3">
                                                <p className="text-xs text-slate-400">
                                                    Category
                                                </p>

                                                <p className="mt-1 truncate text-sm font-bold text-slate-800">
                                                    {getCategoryName(
                                                        quiz.category_id
                                                    )}
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
                                            className="mt-5 w-full rounded-lg bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-600"
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
        </div>
    );
}

export default QuizList;