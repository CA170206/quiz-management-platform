import { Navigate, Outlet } from "react-router-dom";

function ProtectedRoute({ allowedRole }) {
    const token =
        sessionStorage.getItem("token") ||
        localStorage.getItem("token");

    const storedUser =
        sessionStorage.getItem("user") ||
        localStorage.getItem("user");

    const user = JSON.parse(
        storedUser || "null"
    );

    // ==========================================
    // NOT LOGGED IN
    // ==========================================

    if (!token || !user) {
        if (allowedRole === "developer") {
            return (
                <Navigate
                    to="/developer/login"
                    replace
                />
            );
        }

        return (
            <Navigate
                to="/login"
                replace
            />
        );
    }


    // ==========================================
    // WRONG ROLE
    // ==========================================

    if (
        allowedRole &&
        user.role !== allowedRole
    ) {

        // Developer
        if (user.role === "developer") {
            return (
                <Navigate
                    to="/developer"
                    replace
                />
            );
        }

        // Admin
        if (user.role === "admin") {
            return (
                <Navigate
                    to="/admin/dashboard"
                    replace
                />
            );
        }

        // Student
        return (
            <Navigate
                to="/student/dashboard"
                replace
            />
        );
    }


    // ==========================================
    // AUTHORIZED
    // ==========================================

    return <Outlet />;
}

export default ProtectedRoute;