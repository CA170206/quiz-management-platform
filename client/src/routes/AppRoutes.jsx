import { BrowserRouter, Routes, Route } from "react-router-dom";
import Questions from "../pages/admin/Questions";
import Categories from "../pages/admin/Categories";
import Quizzes from "../pages/admin/Quizzes";

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
            </Routes>
        </BrowserRouter>
    );
}

export default AppRoutes;