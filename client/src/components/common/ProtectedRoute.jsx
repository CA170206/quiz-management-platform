import { Navigate, Outlet } from "react-router-dom";

function ProtectedRoute({ allowedRole }) {
    const token = localStorage.getItem("token");
    const user = JSON.parse(
        localStorage.getItem("user") || "null"
    );

    // Not logged in
    if (!token || !user) {
        return <Navigate to="/login" replace />;
    }

    // Role restriction
    if (
        allowedRole &&
        user.role !== allowedRole
    ) {
        if (user.role === "admin") {
            return (
                <Navigate
                    to="/admin/dashboard"
                    replace
                />
            );
        }

        return (
            <Navigate
                to="/student/dashboard"
                replace
            />
        );
    }

    return <Outlet />;
}

export default ProtectedRoute;