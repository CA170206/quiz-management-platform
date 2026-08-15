import { useState } from "react";

function Profile() {
    const storedUser = JSON.parse(
        localStorage.getItem("user") || "null"
    );

    const [editing, setEditing] = useState(false);

    const [profile, setProfile] = useState({
        full_name:
            storedUser?.full_name || "Admin",
        email:
            storedUser?.email ||
            "admin1@quizmaster.com",
        role:
            storedUser?.role || "admin",
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

    const handleCancel = () => {
        setProfile({
            full_name:
                storedUser?.full_name || "Admin",
            email:
                storedUser?.email ||
                "admin1@quizmaster.com",
            role:
                storedUser?.role || "admin",
        });

        setEditing(false);
    };

    return (
        <div className="min-h-screen bg-slate-50 px-4 py-6 sm:px-6 sm:py-10">

            <div className="mx-auto max-w-5xl">

                {/* Header */}

                <div className="mb-6 sm:mb-8">

                    <p className="text-sm font-semibold text-blue-600">
                        Administration
                    </p>

                    <h1 className="mt-1 text-2xl font-bold text-slate-900 sm:text-3xl">
                        Admin Profile
                    </h1>

                    <p className="mt-2 text-sm leading-6 text-slate-500 sm:text-base">
                        Manage your administrator account.
                    </p>

                </div>


                {/* Profile Card */}

                <div className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-slate-200">

                    {/* Top */}

                    <div className="bg-gradient-to-r from-slate-900 to-slate-800 px-5 py-6 sm:px-8 sm:py-8">

                        <div className="flex flex-col items-center gap-4 text-center sm:flex-row sm:gap-5 sm:text-left">

                            {/* Avatar */}

                            <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full bg-blue-600 text-3xl font-bold text-white">
                                {profile.full_name
                                    .charAt(0)
                                    .toUpperCase()}
                            </div>


                            {/* Profile Info */}

                            <div className="min-w-0">

                                <h2 className="break-words text-xl font-bold text-white sm:text-2xl">
                                    {profile.full_name}
                                </h2>

                                <p className="mt-1 break-all text-sm text-slate-300">
                                    {profile.email}
                                </p>

                                <span className="mt-3 inline-flex rounded-full bg-blue-500/20 px-3 py-1 text-xs font-semibold text-blue-300">
                                    Administrator
                                </span>

                            </div>

                        </div>

                    </div>


                    {/* Details */}

                    <div className="px-5 py-6 sm:px-8 sm:py-8">

                        <h3 className="mb-5 text-lg font-bold text-slate-900 sm:mb-6">
                            Account Information
                        </h3>


                        <div className="grid gap-5 sm:grid-cols-2 sm:gap-6">

                            {/* Name */}

                            <div className="min-w-0">

                                <label className="mb-2 block text-sm font-semibold text-slate-700">
                                    Full Name
                                </label>

                                <input
                                    name="full_name"
                                    value={
                                        profile.full_name
                                    }
                                    disabled={!editing}
                                    onChange={
                                        handleChange
                                    }
                                    className="w-full min-w-0 rounded-lg border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:bg-slate-50 disabled:text-slate-500"
                                />

                            </div>


                            {/* Email */}

                            <div className="min-w-0">

                                <label className="mb-2 block text-sm font-semibold text-slate-700">
                                    Email Address
                                </label>

                                <input
                                    name="email"
                                    type="email"
                                    value={
                                        profile.email
                                    }
                                    disabled={!editing}
                                    onChange={
                                        handleChange
                                    }
                                    className="w-full min-w-0 rounded-lg border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:bg-slate-50 disabled:text-slate-500"
                                />

                            </div>


                            {/* Role */}

                            <div className="min-w-0">

                                <label className="mb-2 block text-sm font-semibold text-slate-700">
                                    Role
                                </label>

                                <input
                                    value="Administrator"
                                    disabled
                                    className="w-full min-w-0 rounded-lg border border-slate-300 bg-slate-50 px-4 py-3 text-sm text-slate-500"
                                />

                            </div>

                        </div>


                        {/* Buttons */}

                        <div className="mt-6 flex flex-col gap-3 sm:mt-8 sm:flex-row">

                            {!editing ? (

                                <button
                                    type="button"
                                    onClick={() =>
                                        setEditing(true)
                                    }
                                    className="w-full rounded-lg bg-blue-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 sm:w-auto"
                                >
                                    Edit Profile
                                </button>

                            ) : (

                                <>

                                    <button
                                        type="button"
                                        onClick={
                                            handleSave
                                        }
                                        className="w-full rounded-lg bg-blue-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 sm:w-auto"
                                    >
                                        Save Changes
                                    </button>

                                    <button
                                        type="button"
                                        onClick={
                                            handleCancel
                                        }
                                        className="w-full rounded-lg border border-slate-300 bg-white px-6 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 sm:w-auto"
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