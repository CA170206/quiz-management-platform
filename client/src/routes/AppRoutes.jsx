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
import DeveloperLogin from "../pages/developer/DeveloperLogin";

// Common
import Navbar from "../components/common/Navbar";
import ProtectedRoute from "../components/common/ProtectedRoute";

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

// Developer
import DeveloperDashboard from "../pages/developer/DeveloperDashboard";
import DeveloperUsers from "../pages/developer/Users";
import DeveloperAdmins from "../pages/developer/Admins";
import DeveloperDatabase from "../pages/developer/Database";
import DeveloperAnalytics from "../pages/developer/Analytics";


function AppContent() {
    const location = useLocation();

    // Pages where Navbar should NOT appear
    const publicPages = [
        "/",
        "/login",
        "/register",
        "/developer/login",
    ];

    const isPublicPage = publicPages.includes(
        location.pathname
    );

    // Developer pages use their own navigation
    const isDeveloperPage =
        location.pathname.startsWith("/developer");

    return (
        <>
            {!isPublicPage &&
                !isDeveloperPage &&
                <Navbar />}

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

                    {/* Developer Login */}

                    <Route
                        path="/developer/login"
                        element={<DeveloperLogin />}
                    />


                    {/* ================================= */}
                    {/* DEVELOPER PROTECTED ROUTES */}
                    {/* ================================= */}

                    <Route
                        element={
                            <ProtectedRoute
                                allowedRole="developer"
                            />
                        }
                    >

                        <Route
                            path="/developer"
                            element={<DeveloperDashboard />}
                        />

                        <Route
                            path="/developer/users"
                            element={<DeveloperUsers />}
                        />

                        <Route
                            path="/developer/admins"
                            element={<DeveloperAdmins />}
                        />

                        <Route
                            path="/developer/database"
                            element={<DeveloperDatabase />}
                        />

                        <Route
                            path="/developer/analytics"
                            element={<DeveloperAnalytics />}
                        />

                    </Route>


                    {/* ================================= */}
                    {/* ADMIN PROTECTED ROUTES */}
                    {/* ================================= */}

                    <Route
                        element={
                            <ProtectedRoute
                                allowedRole="admin"
                            />
                        }
                    >

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

                    </Route>


                    {/* ================================= */}
                    {/* STUDENT PROTECTED ROUTES */}
                    {/* ================================= */}

                    <Route
                        element={
                            <ProtectedRoute
                                allowedRole="student"
                            />
                        }
                    >

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

                    </Route>

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