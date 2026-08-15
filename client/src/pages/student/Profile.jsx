import { useEffect, useState } from "react";

const API_URL = `${import.meta.env.VITE_API_URL}/api/users/profile`;

function Profile() {
    const [profile, setProfile] = useState(null);

    const [formData, setFormData] = useState({
        full_name: "",
        email: "",
    });

    const [editing, setEditing] = useState(false);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    // ==========================================
    // FETCH PROFILE
    // ==========================================

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const token =
                    localStorage.getItem("token");

                if (!token) {
                    throw new Error(
                        "You are not logged in."
                    );
                }

                const response = await fetch(API_URL, {
                    method: "GET",
                    headers: {
                        Authorization:
                            `Bearer ${token}`,
                    },
                });

                const data = await response.json();

                if (!response.ok) {
                    throw new Error(
                        data.message ||
                            "Failed to fetch profile"
                    );
                }

                setProfile(data);

                setFormData({
                    full_name: data.full_name || "",
                    email: data.email || "",
                });

                const storedUser = JSON.parse(
                    localStorage.getItem("user") ||
                        "null"
                );

                if (storedUser) {
                    localStorage.setItem(
                        "user",
                        JSON.stringify({
                            ...storedUser,
                            id: data.id,
                            full_name: data.full_name,
                            email: data.email,
                            role: data.role,
                        })
                    );
                }
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, []);

    // ==========================================
    // HANDLE INPUT
    // ==========================================

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });

        setError("");
        setSuccess("");
    };

    // ==========================================
    // SAVE PROFILE
    // ==========================================

    const handleSave = async () => {
        try {
            setSaving(true);
            setError("");
            setSuccess("");

            const token =
                localStorage.getItem("token");

            if (!token) {
                throw new Error(
                    "You are not logged in."
                );
            }

            if (
                !formData.full_name.trim() ||
                !formData.email.trim()
            ) {
                throw new Error(
                    "Full name and email are required."
                );
            }

            const response = await fetch(API_URL, {
                method: "PUT",
                headers: {
                    "Content-Type":
                        "application/json",
                    Authorization:
                        `Bearer ${token}`,
                },
                body: JSON.stringify({
                    full_name:
                        formData.full_name.trim(),
                    email:
                        formData.email.trim(),
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message ||
                        "Failed to update profile"
                );
            }

            setProfile(data.user);

            setFormData({
                full_name: data.user.full_name,
                email: data.user.email,
            });

            const storedUser = JSON.parse(
                localStorage.getItem("user") ||
                    "null"
            );

            if (storedUser) {
                localStorage.setItem(
                    "user",
                    JSON.stringify({
                        ...storedUser,
                        id: data.user.id,
                        full_name:
                            data.user.full_name,
                        email: data.user.email,
                        role: data.user.role,
                    })
                );
            }

            setSuccess(
                "Profile updated successfully."
            );

            setEditing(false);
        } catch (err) {
            setError(err.message);
        } finally {
            setSaving(false);
        }
    };

    // ==========================================
    // CANCEL EDIT
    // ==========================================

    const handleCancel = () => {
        setFormData({
            full_name: profile.full_name,
            email: profile.email,
        });

        setError("");
        setSuccess("");
        setEditing(false);
    };

    // ==========================================
    // LOADING
    // ==========================================

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-50 px-4 py-6 sm:px-6 sm:py-10">

                <div className="mx-auto max-w-4xl">

                    <div className="animate-pulse">

                        <div className="h-4 w-20 rounded bg-slate-200" />

                        <div className="mt-3 h-8 w-44 rounded bg-slate-200 sm:h-9 sm:w-48" />

                        <div className="mt-2 h-5 w-full max-w-xs rounded bg-slate-200 sm:w-72" />

                    </div>

                    <div className="mt-6 h-96 animate-pulse rounded-2xl bg-white shadow-sm ring-1 ring-slate-200 sm:mt-8" />

                </div>

            </div>
        );
    }

    // ==========================================
    // ERROR
    // ==========================================

    if (error && !profile) {
        return (
            <div className="min-h-screen bg-slate-50 px-4 py-6 sm:px-6 sm:py-10">

                <div className="mx-auto max-w-4xl">

                    <div className="rounded-xl border border-red-100 bg-red-50 px-4 py-4 text-sm text-red-600 sm:px-5">
                        {error}
                    </div>

                </div>

            </div>
        );
    }

    if (!profile) {
        return null;
    }

    // ==========================================
    // UI
    // ==========================================

    return (
        <div className="min-h-screen bg-slate-50 px-4 py-6 sm:px-6 sm:py-10">

            <div className="mx-auto max-w-4xl">

                {/* Header */}

                <div className="mb-6 sm:mb-8">

                    <p className="text-sm font-semibold text-blue-600">
                        Account
                    </p>

                    <h1 className="mt-1 text-2xl font-bold text-slate-900 sm:text-3xl">
                        User Profile
                    </h1>

                    <p className="mt-2 text-sm leading-6 text-slate-500 sm:text-base">
                        View and manage your account information.
                    </p>

                </div>


                {/* Profile Card */}

                <div className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-slate-200">

                    {/* Profile Header */}

                    <div className="border-b border-slate-100 px-5 py-6 sm:px-8 sm:py-8">

                        <div className="flex flex-col items-center gap-4 text-center sm:flex-row sm:gap-5 sm:text-left">

                            {/* Avatar */}

                            <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full bg-blue-600 text-2xl font-bold text-white">

                                {profile.full_name
                                    ?.charAt(0)
                                    .toUpperCase()}

                            </div>


                            {/* Name */}

                            <div className="min-w-0">

                                <h2 className="break-words text-xl font-bold text-slate-900 sm:text-2xl">
                                    {profile.full_name}
                                </h2>

                                <p className="mt-1 break-all text-sm text-slate-500 sm:text-base">
                                    {profile.email}
                                </p>

                                <span className="mt-3 inline-flex rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold capitalize text-blue-600">
                                    {profile.role}
                                </span>

                            </div>

                        </div>

                    </div>


                    {/* Account Details */}

                    <div className="px-5 py-6 sm:px-8 sm:py-8">

                        <h3 className="mb-5 text-lg font-bold text-slate-900 sm:mb-6">
                            Account Information
                        </h3>


                        {/* Success */}

                        {success && (
                            <div className="mb-5 rounded-lg border border-green-100 bg-green-50 px-4 py-3 text-sm text-green-600 sm:mb-6">
                                {success}
                            </div>
                        )}


                        {/* Error */}

                        {error && (
                            <div className="mb-5 rounded-lg border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-600 sm:mb-6">
                                {error}
                            </div>
                        )}


                        <div className="grid gap-5 sm:grid-cols-2 sm:gap-6">

                            {/* Full Name */}

                            <div className="min-w-0">

                                <label className="mb-2 block text-sm font-semibold text-slate-700">
                                    Full Name
                                </label>

                                <input
                                    name="full_name"
                                    type="text"
                                    value={
                                        formData.full_name
                                    }
                                    disabled={!editing}
                                    onChange={
                                        handleChange
                                    }
                                    className="w-full min-w-0 rounded-lg border border-slate-300 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:bg-slate-50 disabled:text-slate-500"
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
                                        formData.email
                                    }
                                    disabled={!editing}
                                    onChange={
                                        handleChange
                                    }
                                    className="w-full min-w-0 rounded-lg border border-slate-300 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:bg-slate-50 disabled:text-slate-500"
                                />

                            </div>


                            {/* Role */}

                            <div className="min-w-0">

                                <label className="mb-2 block text-sm font-semibold text-slate-700">
                                    Role
                                </label>

                                <input
                                    value={
                                        profile.role
                                    }
                                    disabled
                                    className="w-full min-w-0 rounded-lg border border-slate-300 bg-slate-50 px-4 py-3 text-sm capitalize text-slate-500"
                                />

                            </div>


                            {/* User ID */}

                            <div className="min-w-0">

                                <label className="mb-2 block text-sm font-semibold text-slate-700">
                                    User ID
                                </label>

                                <input
                                    value={`#${profile.id}`}
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
                                    className="w-full rounded-lg bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 sm:w-auto"
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
                                        disabled={saving}
                                        className="w-full rounded-lg bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
                                    >
                                        {saving
                                            ? "Saving..."
                                            : "Save Changes"}
                                    </button>


                                    <button
                                        type="button"
                                        onClick={
                                            handleCancel
                                        }
                                        disabled={saving}
                                        className="w-full rounded-lg border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
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