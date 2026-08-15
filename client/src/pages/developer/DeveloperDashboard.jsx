import { useNavigate } from "react-router-dom";

function DeveloperDashboard() {
    const navigate = useNavigate();

    const user = JSON.parse(
        localStorage.getItem("user") || "null"
    );

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/developer/login");
    };

    const cards = [
        {
            title: "User Management",
            description:
                "View, manage, and control student accounts.",
            icon: "👥",
            path: "/developer/users",
        },
        {
            title: "Admin Management",
            description:
                "Create and manage administrator accounts.",
            icon: "🛡️",
            path: "/developer/admins",
        },
        {
            title: "Database",
            description:
                "Inspect database records and system data.",
            icon: "🗄️",
            path: "/developer/database",
        },
        {
            title: "System Analytics",
            description:
                "View platform statistics and activity.",
            icon: "📊",
            path: "/developer/analytics",
        },
    ];

    return (
        <div className="min-h-screen bg-slate-50 px-4 py-6 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-7xl">

                {/* Header */}

                <div className="mb-8 rounded-2xl bg-slate-950 px-6 py-7 text-white shadow-sm sm:px-8">

                    <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">

                        <div>
                            <p className="text-sm font-semibold text-blue-400">
                                Restricted Access
                            </p>

                            <h1 className="mt-1 text-2xl font-bold sm:text-3xl">
                                Developer Control Panel
                            </h1>

                            <p className="mt-2 text-sm text-slate-400">
                                Manage and monitor the QuizMaster platform.
                            </p>
                        </div>

                        <button
                            onClick={handleLogout}
                            className="rounded-lg border border-slate-700 px-4 py-2.5 text-sm font-semibold text-slate-300 transition hover:bg-slate-800 hover:text-white"
                        >
                            Logout
                        </button>

                    </div>

                </div>


                {/* Developer Information */}

                <div className="mb-6 rounded-xl bg-white p-5 shadow-sm ring-1 ring-slate-200">

                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center">

                        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-blue-100 text-2xl">
                            ⚙️
                        </div>

                        <div>
                            <p className="text-sm text-slate-500">
                                Developer account
                            </p>

                            <h2 className="font-bold text-slate-900">
                                {user?.full_name || "Developer"}
                            </h2>

                            <p className="text-sm text-slate-500">
                                {user?.email || "Authorized developer"}
                            </p>
                        </div>

                        <div className="sm:ml-auto">
                            <span className="inline-flex rounded-full bg-green-50 px-3 py-1 text-xs font-semibold text-green-700">
                                Developer Verified
                            </span>
                        </div>

                    </div>

                </div>


                {/* Quick Actions */}

                <div className="mb-6">

                    <div className="mb-4">
                        <h2 className="text-xl font-bold text-slate-900">
                            Developer Tools
                        </h2>

                        <p className="mt-1 text-sm text-slate-500">
                            Administrative tools available only to you.
                        </p>
                    </div>


                    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">

                        {cards.map((card) => (
                            <button
                                key={card.title}
                                onClick={() =>
                                    navigate(card.path)
                                }
                                className="group rounded-2xl bg-white p-6 text-left shadow-sm ring-1 ring-slate-200 transition hover:-translate-y-0.5 hover:shadow-md hover:ring-blue-200"
                            >

                                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-2xl transition group-hover:bg-blue-100">
                                    {card.icon}
                                </div>

                                <h3 className="mt-5 font-bold text-slate-900">
                                    {card.title}
                                </h3>

                                <p className="mt-2 text-sm leading-5 text-slate-500">
                                    {card.description}
                                </p>

                                <p className="mt-4 text-sm font-semibold text-blue-600">
                                    Open →
                                </p>

                            </button>
                        ))}

                    </div>

                </div>


                {/* System Status */}

                <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">

                    <div className="flex items-center justify-between">

                        <div>
                            <h2 className="font-bold text-slate-900">
                                System Status
                            </h2>

                            <p className="mt-1 text-sm text-slate-500">
                                Current platform status.
                            </p>
                        </div>

                        <span className="flex items-center gap-2 rounded-full bg-green-50 px-3 py-1.5 text-xs font-semibold text-green-700">
                            <span className="h-2 w-2 rounded-full bg-green-500" />
                            Online
                        </span>

                    </div>


                    <div className="mt-6 grid gap-4 sm:grid-cols-3">

                        <div className="rounded-xl bg-slate-50 p-4">
                            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                                Backend
                            </p>

                            <p className="mt-2 font-bold text-green-600">
                                Connected
                            </p>
                        </div>

                        <div className="rounded-xl bg-slate-50 p-4">
                            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                                Database
                            </p>

                            <p className="mt-2 font-bold text-green-600">
                                Connected
                            </p>
                        </div>

                        <div className="rounded-xl bg-slate-50 p-4">
                            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                                Authentication
                            </p>

                            <p className="mt-2 font-bold text-green-600">
                                Secure
                            </p>
                        </div>

                    </div>

                </div>

            </div>
        </div>
    );
}

export default DeveloperDashboard;