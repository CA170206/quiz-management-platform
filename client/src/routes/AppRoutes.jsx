import {
    BrowserRouter,
    Routes,
    Route,
    useLocation,
} from "react-router-dom";

// Authentication
import AuthPage from "../pages/auth/AuthPage";
import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";

// Common
import Navbar from "../components/common/Navbar";

// Admin
import AdminDashboard from "../pages/admin/Dashboard";
import Questions from "../pages/admin/Questions";
import Categories from "../pages/admin/Categories";
import Quizzes from "../pages/admin/Quizzes";
import AdminProfile from "../pages/admin/Profile";
import AdminAnalytics from "../pages/admin/Analytics";

// Student
import Dashboard from "../pages/student/Dashboard";
import QuizList from "../pages/student/QuizList";
import QuizDetails from "../pages/student/QuizDetails";
import AttemptQuiz from "../pages/student/AttemptQuiz";
import Results from "../pages/student/Results";
import Leaderboard from "../pages/student/Leaderboard";
import Profile from "../pages/student/Profile";
import Analytics from "../pages/student/Analytics";


function AppContent() {
    const location = useLocation();

    // Pages where Navbar should NOT appear
    const publicPages = [
        "/",
        "/login",
        "/register",
    ];

    const isPublicPage = publicPages.includes(
        location.pathname
    );

    return (
        <>
            {!isPublicPage && <Navbar />}

            <main className="min-h-screen bg-slate-50">

                <Routes>

                    {/* ================================= */}
                    {/* PUBLIC / AUTHENTICATION */}
                    {/* ================================= */}

                    <Route
                        path="/"
                        element={<AuthPage />}
                    />

                    <Route
                        path="/login"
                        element={<Login />}
                    />

                    <Route
                        path="/register"
                        element={<Register />}
                    />


                    {/* ================================= */}
                    {/* ADMIN */}
                    {/* ================================= */}

                    <Route
                        path="/admin/dashboard"
                        element={<AdminDashboard />}
                    />

                    <Route
                        path="/admin/categories"
                        element={<Categories />}
                    />

                    <Route
                        path="/admin/questions"
                        element={<Questions />}
                    />

                    <Route
                        path="/admin/quizzes"
                        element={<Quizzes />}
                    />

                    <Route
                        path="/admin/profile"
                        element={<AdminProfile />}
                    />

                    <Route
                        path="/admin/analytics"
                        element={<AdminAnalytics />}
                    />


                    {/* ================================= */}
                    {/* STUDENT */}
                    {/* ================================= */}

                    <Route
                        path="/student/dashboard"
                        element={<Dashboard />}
                    />

                    <Route
                        path="/student/quizzes"
                        element={<QuizList />}
                    />

                    <Route
                        path="/student/quizzes/:id"
                        element={<QuizDetails />}
                    />

                    <Route
                        path="/student/quizzes/:id/attempt"
                        element={<AttemptQuiz />}
                    />

                    <Route
                        path="/student/results/:id"
                        element={<Results />}
                    />

                    <Route
                        path="/student/leaderboard"
                        element={<Leaderboard />}
                    />

                    <Route
                        path="/student/profile"
                        element={<Profile />}
                    />

                    <Route
                        path="/student/analytics"
                        element={<Analytics />}
                    />

                </Routes>

            </main>
        </>
    );
}


function AppRoutes() {
    return (
        <BrowserRouter>
            <AppContent />
        </BrowserRouter>
    );
}


export default AppRoutes;