import { useNavigate } from "react-router-dom";

function AuthPage() {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-slate-50 px-6 py-12">
            <div className="mx-auto flex min-h-[80vh] max-w-5xl items-center justify-center">

                <div className="grid w-full gap-8 md:grid-cols-2">

                    {/* Left */}
                    <div className="flex flex-col justify-center">
                        <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-600 text-2xl font-bold text-white">
                            Q
                        </div>

                        <h1 className="text-4xl font-bold text-slate-900">
                            QuizMaster
                        </h1>

                        <p className="mt-4 max-w-md text-lg text-slate-500">
                            Test your knowledge, track your performance,
                            and compete with other students.
                        </p>
                    </div>

                    {/* Auth Card */}
                    <div className="rounded-2xl bg-white p-8 shadow-sm ring-1 ring-slate-200">

                        <h2 className="text-2xl font-bold text-slate-900">
                            Welcome
                        </h2>

                        <p className="mt-2 text-sm text-slate-500">
                            Sign in to your account or create a new one.
                        </p>

                        <div className="mt-8 space-y-4">

                            <button
                                onClick={() => navigate("/login")}
                                className="w-full rounded-lg bg-blue-600 px-5 py-3 font-semibold text-white transition hover:bg-blue-700"
                            >
                                Sign In
                            </button>

                            <button
                                onClick={() => navigate("/register")}
                                className="w-full rounded-lg border border-slate-300 bg-white px-5 py-3 font-semibold text-slate-700 transition hover:bg-slate-50"
                            >
                                Create Account
                            </button>

                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
}

export default AuthPage;