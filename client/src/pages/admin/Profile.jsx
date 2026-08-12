import { useState } from "react";

function Profile() {
    const storedUser = JSON.parse(
        localStorage.getItem("user") || "null"
    );

    const [editing, setEditing] = useState(false);

    const [profile, setProfile] = useState({
        full_name: storedUser?.full_name || "Admin",
        email: storedUser?.email || "admin1@quizmaster.com",
        role: storedUser?.role || "admin",
    });

    const handleChange = (e) => {
        setProfile({
            ...profile,
            [e.target.name]: e.target.value,
        });
    };

    const handleSave = () => {
        const updatedUser = {
            ...storedUser,
            full_name: profile.full_name,
            email: profile.email,
            role: profile.role,
        };

        localStorage.setItem(
            "user",
            JSON.stringify(updatedUser)
        );

        setEditing(false);
    };

    return (
        <div className="min-h-screen bg-slate-50 px-6 py-10">
            <div className="mx-auto max-w-5xl">

                {/* Header */}
                <div className="mb-8">
                    <p className="text-sm font-semibold text-blue-600">
                        Administration
                    </p>

                    <h1 className="mt-1 text-3xl font-bold text-slate-900">
                        Admin Profile
                    </h1>

                    <p className="mt-2 text-slate-500">
                        Manage your administrator account.
                    </p>
                </div>

                {/* Profile Card */}
                <div className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-slate-200">

                    {/* Top */}
                    <div className="bg-gradient-to-r from-slate-900 to-slate-800 px-8 py-8">
                        <div className="flex items-center gap-5">

                            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-blue-600 text-3xl font-bold text-white">
                                {profile.full_name
                                    .charAt(0)
                                    .toUpperCase()}
                            </div>

                            <div>
                                <h2 className="text-2xl font-bold text-white">
                                    {profile.full_name}
                                </h2>

                                <p className="mt-1 text-sm text-slate-300">
                                    {profile.email}
                                </p>

                                <span className="mt-3 inline-flex rounded-full bg-blue-500/20 px-3 py-1 text-xs font-semibold text-blue-300">
                                    Administrator
                                </span>
                            </div>

                        </div>
                    </div>

                    {/* Details */}
                    <div className="px-8 py-8">

                        <h3 className="mb-6 text-lg font-bold text-slate-900">
                            Account Information
                        </h3>

                        <div className="grid gap-6 sm:grid-cols-2">

                            {/* Name */}
                            <div>
                                <label className="mb-2 block text-sm font-semibold text-slate-700">
                                    Full Name
                                </label>

                                <input
                                    name="full_name"
                                    value={
                                        profile.full_name
                                    }
                                    disabled={!editing}
                                    onChange={handleChange}
                                    className="w-full rounded-lg border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:bg-slate-50 disabled:text-slate-500"
                                />
                            </div>

                            {/* Email */}
                            <div>
                                <label className="mb-2 block text-sm font-semibold text-slate-700">
                                    Email Address
                                </label>

                                <input
                                    name="email"
                                    type="email"
                                    value={profile.email}
                                    disabled={!editing}
                                    onChange={handleChange}
                                    className="w-full rounded-lg border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:bg-slate-50 disabled:text-slate-500"
                                />
                            </div>

                            {/* Role */}
                            <div>
                                <label className="mb-2 block text-sm font-semibold text-slate-700">
                                    Role
                                </label>

                                <input
                                    value="Administrator"
                                    disabled
                                    className="w-full rounded-lg border border-slate-300 bg-slate-50 px-4 py-3 text-sm text-slate-500"
                                />
                            </div>

                        </div>

                        {/* Buttons */}
                        <div className="mt-8 flex gap-3">

                            {!editing ? (
                                <button
                                    onClick={() =>
                                        setEditing(true)
                                    }
                                    className="rounded-lg bg-blue-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
                                >
                                    Edit Profile
                                </button>
                            ) : (
                                <>
                                    <button
                                        onClick={handleSave}
                                        className="rounded-lg bg-blue-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
                                    >
                                        Save Changes
                                    </button>

                                    <button
                                        onClick={() =>
                                            setEditing(false)
                                        }
                                        className="rounded-lg border border-slate-300 bg-white px-6 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                                    >
                                        Cancel
                                    </button>
                                </>
                            )}

                        </div>

                    </div>
                </div>

            </div>
        </div>
    );
}

export default Profile;