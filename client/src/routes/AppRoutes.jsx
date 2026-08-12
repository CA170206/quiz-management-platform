import { BrowserRouter, Routes, Route } from "react-router-dom";
import Questions from "../pages/admin/Questions";
import Categories from "../pages/admin/Categories";
import Quizzes from "../pages/admin/Quizzes";
import QuizList from "../pages/student/QuizList";
import QuizDetails from "../pages/student/QuizDetails";
import AttemptQuiz from "../pages/student/AttemptQuiz";
import Results from "../pages/student/Results";
import Leaderboard from "../pages/student/Leaderboard";
import Dashboard from "../pages/student/Dashboard";

function AppRoutes() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<h1>Quiz Management Platform</h1>} />

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
                    path="/student/dashboard"
                    element={<Dashboard />}
                />
            </Routes>
        </BrowserRouter>
    );
}

export default AppRoutes;