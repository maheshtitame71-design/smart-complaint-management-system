import { useEffect, useState } from "react";
import Sidebar from "../../components/user/Sidebar";
import TopBar from "../../components/user/TopBar";
import api from "../../services/api";

const UserProfile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);

        const response = await api.get("/auth/me");

        if (response.data.success) {
          setUser(response.data.user);
        }
      } catch (error) {
        console.error("Error fetching profile:", error);

        setError(
          error.response?.data?.message ||
            "Unable to load your profile."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const getInitials = (name) => {
    if (!name) return "U";

    return name
      .split(" ")
      .map((word) => word[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();
  };

  return (
    <div className="flex min-h-screen bg-slate-50">

      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex min-w-0 flex-1 flex-col">

        <TopBar />

        <main className="flex-1 p-4 sm:p-6 lg:p-8">

          <div className="mx-auto max-w-5xl">

            {/* Page Header */}
            <div className="mb-8">
              <p className="text-sm font-medium uppercase tracking-[0.2em] text-indigo-600">
                Account
              </p>

              <h1 className="mt-1 text-2xl font-bold text-slate-900 sm:text-3xl">
                My Profile
              </h1>

              <p className="mt-2 text-sm text-slate-500">
                View your personal information and account details.
              </p>
            </div>


            {/* Loading */}
            {loading && (
              <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center shadow-sm">
                <p className="text-sm text-slate-500">
                  Loading your profile...
                </p>
              </div>
            )}


            {/* Error */}
            {!loading && error && (
              <div className="rounded-2xl border border-red-200 bg-red-50 p-5">
                <p className="text-sm font-medium text-red-600">
                  {error}
                </p>
              </div>
            )}


            {/* Profile */}
            {!loading && !error && user && (
              <div className="space-y-6">

                {/* Profile Header Card */}
                <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

                  <div className="h-28 bg-slate-950"></div>

                  <div className="px-6 pb-6 sm:px-8">

                    <div className="-mt-12 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">

                      <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-end">

                        {/* Avatar */}
                        <div className="flex h-24 w-24 items-center justify-center rounded-2xl border-4 border-white bg-indigo-600 text-2xl font-bold text-white shadow-lg mt-10">
                          {getInitials(user.name)}
                        </div>

                        <div className="pb-1">

                          <h2 className="text-2xl font-bold text-slate-900">
                            {user.name}
                          </h2>

                          <p className="mt-1 text-sm text-slate-500">
                            {user.email}
                          </p>

                        </div>

                      </div>

                      <div className="w-fit rounded-full bg-emerald-50 px-4 py-2 text-xs font-semibold capitalize text-emerald-700">
                        {user.role || "User"}
                      </div>

                    </div>

                  </div>
                </div>


                {/* Personal Information */}
                <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">

                  <div className="border-b border-slate-100 px-6 py-5 sm:px-8">

                    <h3 className="text-lg font-bold text-slate-900">
                      Personal Information
                    </h3>

                    <p className="mt-1 text-sm text-slate-500">
                      Your registered account information.
                    </p>

                  </div>


                  <div className="grid gap-6 p-6 sm:grid-cols-2 sm:p-8">

                    {/* Name */}
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                        Full Name
                      </p>

                      <p className="mt-2 font-medium text-slate-800">
                        {user.name || "Not available"}
                      </p>
                    </div>


                    {/* Email */}
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                        Email Address
                      </p>

                      <p className="mt-2 font-medium text-slate-800">
                        {user.email || "Not available"}
                      </p>
                    </div>


                    {/* Phone */}
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                        Phone Number
                      </p>

                      <p className="mt-2 font-medium text-slate-800">
                        {user.phone || "Not available"}
                      </p>
                    </div>


                    {/* Role */}
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                        Account Role
                      </p>

                      <p className="mt-2 font-medium capitalize text-slate-800">
                        {user.role || "User"}
                      </p>
                    </div>

                  </div>

                </div>


                {/* Account Information */}
                <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">

                  <div className="border-b border-slate-100 px-6 py-5 sm:px-8">

                    <h3 className="text-lg font-bold text-slate-900">
                      Account Information
                    </h3>

                  </div>


                  <div className="grid gap-6 p-6 sm:grid-cols-2 sm:p-8">

                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                        User ID
                      </p>

                      <p className="mt-2 break-all font-mono text-sm text-slate-700">
                        {user.userId || user.id || user._id || "Not available"}
                      </p>
                    </div>


                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                        Account Status
                      </p>

                      <div className="mt-2 flex items-center gap-2">

                        <span className="h-2.5 w-2.5 rounded-full bg-emerald-500"></span>

                        <span className="text-sm font-medium text-emerald-700">
                          Active
                        </span>

                      </div>
                    </div>

                  </div>

                </div>

              </div>
            )}

          </div>

        </main>

      </div>

    </div>
  );
};

export default UserProfile;