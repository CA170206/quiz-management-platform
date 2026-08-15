import { Navigate, Outlet } from "react-router-dom";

function ProtectedRoute({ allowedRole }) {
    // Support both storage types
    // Existing student/admin login uses sessionStorage,
    // Developer login currently uses localStorage.
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
        return (
            <Navigate
                to="/login"
                replace
            />
        );
    }

    // ==========================================
    // ROLE RESTRICTION
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