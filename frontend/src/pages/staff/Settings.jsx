import React, { useEffect, useState } from "react";
import api from "../../services/api";
import Sidebar from "../../components/staff/Sidebar";
import TopBar from "../../components/staff/TopBar";

const StaffSettings = () => {
  // ==========================================
  // USER
  // ==========================================
  const [user, setUser] = useState(null);
  const [loadingUser, setLoadingUser] = useState(true);

  // ==========================================
  // CHANGE PASSWORD
  // ==========================================
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [passwordLoading, setPasswordLoading] = useState(false);
  const [passwordMessage, setPasswordMessage] = useState("");
  const [passwordError, setPasswordError] = useState("");

  // NOTIFICATION SETTINGS
  const [notificationSettings, setNotificationSettings] = useState({
    assigned: true,
    inProgress: true,
    resolved: true,
  });

  // APPEARANCE
  const [appearance, setAppearance] = useState("light");


  // FETCH USER
  useEffect(() => {
    const fetchUser = async () => {
      try {
        setLoadingUser(true);

        const response = await api.get("/auth/me");

        setUser(response.data.user);
      } catch (error) {
        console.error("Error fetching user:", error);

        // Fallback to localStorage
        const storedUser = localStorage.getItem("user");

        if (storedUser) {
          try {
            setUser(JSON.parse(storedUser));
          } catch (storageError) {
            console.error(
              "Local storage error:",
              storageError
            );
          }
        }
      } finally {
        setLoadingUser(false);
      }
    };

    fetchUser();
  }, []);

  // PASSWORD INPUT CHANGE
  const handlePasswordChange = (e) => {
    const { name, value } = e.target;

    setPasswordData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear old messages while typing
    setPasswordError("");
    setPasswordMessage("");
  };


  // CHANGE PASSWORD
  const handleChangePassword = async (e) => {
    e.preventDefault();

    setPasswordError("");
    setPasswordMessage("");

    const {
      currentPassword,
      newPassword,
      confirmPassword,
    } = passwordData;


    // VALIDATION
    if (
      !currentPassword ||
      !newPassword ||
      !confirmPassword
    ) {
      setPasswordError(
        "Please fill in all password fields."
      );
      return;
    }

    if (newPassword.length < 6) {
      setPasswordError(
        "New password must be at least 6 characters."
      );
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordError(
        "New password and confirm password do not match."
      );
      return;
    }

    // API REQUEST
    try {
      setPasswordLoading(true);

      console.log("Sending change password request...");


      const response = await api.patch(
        "/auth/change-password",

        {
          currentPassword: currentPassword,
          newPassword: newPassword,
          confirmPassword: confirmPassword,
        }
      );

      console.log(
        "Change password response:",
        response.data
      );

      // SUCCESS
      setPasswordMessage(
        response.data?.message ||
          "Password changed successfully."
      );

      // Clear inputs
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (error) {
      console.error(
        "Change password error:",
        error
      );

      // IMPORTANT:
      // Show the actual backend response
      console.log(
        "Backend status:",
        error.response?.status
      );

      console.log(
        "Backend response:",
        error.response?.data
      );

      const backendMessage =
        error.response?.data?.message;

      setPasswordError(
        backendMessage ||
          "Unable to change password. Please try again."
      );
    } finally {
      setPasswordLoading(false);
    }
  };

  


  // LOAD APPEARANCE
  useEffect(() => {
    const savedAppearance =
      localStorage.getItem("appearance");

    if (savedAppearance) {
      setAppearance(savedAppearance);

      if (savedAppearance === "dark") {
        document.documentElement.classList.add(
          "dark"
        );
      }
    }
  }, []);


  // CHANGE APPEARANCE
  const handleAppearanceChange = (value) => {
    setAppearance(value);

    localStorage.setItem("appearance", value);

    if (value === "dark") {
      document.documentElement.classList.add(
        "dark"
      );
    } else {
      document.documentElement.classList.remove(
        "dark"
      );
    }
  };


  // LOGOUT
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    window.location.href = "/login";
  };

  return (
    <div className="flex min-h-screen bg-slate-50">

      {/* =====================================
          SIDEBAR
      ===================================== */}
      <Sidebar />

      {/* =====================================
          MAIN AREA
      ===================================== */}
      <div className="flex min-w-0 flex-1 flex-col">

        {/* TOPBAR */}
        <TopBar />

        {/* =====================================
            CONTENT
        ===================================== */}
        <main className="flex-1 p-6">

          <div className="mx-auto max-w-5xl">

            {/* =================================
                HEADER
            ================================= */}
            <div className="mb-8">

              <h1 className="text-2xl font-bold text-slate-800">
                Settings
              </h1>

              <p className="mt-1 text-sm text-slate-500">
                Manage your account and application
                preferences
              </p>

            </div>

            {/* =================================
                ACCOUNT
            ================================= */}
            <div className="mb-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

              <div className="mb-5">

                <h2 className="text-lg font-semibold text-slate-800">
                  Account
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Your account information
                </p>

              </div>

              {loadingUser ? (
                <p className="text-sm text-slate-500">
                  Loading account information...
                </p>
              ) : (
                <div className="grid gap-5 sm:grid-cols-2">

                  {/* NAME */}
                  <div>
                    <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                      Name
                    </p>

                    <p className="mt-1 text-sm font-medium text-slate-700">
                      {user?.name || "Not available"}
                    </p>
                  </div>

                  {/* EMAIL */}
                  <div>
                    <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                      Email
                    </p>

                    <p className="mt-1 text-sm font-medium text-slate-700">
                      {user?.email || "Not available"}
                    </p>
                  </div>

                  {/* PHONE */}
                  <div>
                    <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                      Phone
                    </p>

                    <p className="mt-1 text-sm font-medium text-slate-700">
                      {user?.phone || "Not available"}
                    </p>
                  </div>

                  {/* ROLE */}
                  <div>
                    <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                      Role
                    </p>

                    <span className="mt-1 inline-flex rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold capitalize text-blue-700">
                      {user?.role || "user"}
                    </span>
                  </div>

                </div>
              )}

            </div>

            {/* =================================
                CHANGE PASSWORD
            ================================= */}
            <div className="mb-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

              <div className="mb-6">

                <h2 className="text-lg font-semibold text-slate-800">
                  Change Password
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Update your account password
                </p>

              </div>

              <form
                onSubmit={handleChangePassword}
                className="max-w-xl space-y-5"
              >

                {/* CURRENT PASSWORD */}
                <div>

                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Current Password
                  </label>

                  <input
                    type="password"
                    name="currentPassword"
                    value={
                      passwordData.currentPassword
                    }
                    onChange={handlePasswordChange}
                    placeholder="Enter current password"
                    autoComplete="current-password"
                    className="w-full rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  />

                </div>

                {/* NEW PASSWORD */}
                <div>

                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    New Password
                  </label>

                  <input
                    type="password"
                    name="newPassword"
                    value={
                      passwordData.newPassword
                    }
                    onChange={handlePasswordChange}
                    placeholder="Enter new password"
                    autoComplete="new-password"
                    className="w-full rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  />

                  <p className="mt-1.5 text-xs text-slate-400">
                    Password must contain at least 6
                    characters.
                  </p>

                </div>

                {/* CONFIRM PASSWORD */}
                <div>

                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Confirm New Password
                  </label>

                  <input
                    type="password"
                    name="confirmPassword"
                    value={
                      passwordData.confirmPassword
                    }
                    onChange={handlePasswordChange}
                    placeholder="Confirm new password"
                    autoComplete="new-password"
                    className="w-full rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  />

                </div>

                {/* ERROR MESSAGE */}
                {passwordError && (
                  <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3">

                    <p className="text-sm font-medium text-red-600">
                      {passwordError}
                    </p>

                  </div>
                )}

                {/* SUCCESS MESSAGE */}
                {passwordMessage && (
                  <div className="rounded-lg border border-green-200 bg-green-50 px-4 py-3">

                    <p className="text-sm font-medium text-green-600">
                      {passwordMessage}
                    </p>

                  </div>
                )}

                {/* SUBMIT */}
                <button
                  type="submit"
                  disabled={passwordLoading}
                  className="rounded-lg bg-blue-600 px-5 py-3 text-sm font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {passwordLoading
                    ? "Changing Password..."
                    : "Change Password"}
                </button>

              </form>

            </div>


            {/* =================================
                APPEARANCE
            ================================= */}
            <div className="mb-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

              <div className="mb-6">

                <h2 className="text-lg font-semibold text-slate-800">
                  Appearance
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Choose how the application looks
                </p>

              </div>

              <div className="grid gap-4 sm:grid-cols-2">

                {/* LIGHT */}
                <button
                  type="button"
                  onClick={() =>
                    handleAppearanceChange("light")
                  }
                  className={`rounded-xl border p-4 text-left transition ${
                    appearance === "light"
                      ? "border-blue-500 bg-blue-50"
                      : "border-slate-200 bg-white hover:bg-slate-50"
                  }`}
                >

                  <div className="flex items-center gap-3">

                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white shadow-sm">
                      ☀️
                    </div>

                    <div>

                      <p className="text-sm font-semibold text-slate-700">
                        Light
                      </p>

                      <p className="text-xs text-slate-400">
                        Light appearance
                      </p>

                    </div>

                  </div>

                </button>

                {/* DARK */}
                <button
                  type="button"
                  onClick={() =>
                    handleAppearanceChange("dark")
                  }
                  className={`rounded-xl border p-4 text-left transition ${
                    appearance === "dark"
                      ? "border-blue-500 bg-blue-50"
                      : "border-slate-200 bg-white hover:bg-slate-50"
                  }`}
                >

                  <div className="flex items-center gap-3">

                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-800 text-white shadow-sm">
                      🌙
                    </div>

                    <div>

                      <p className="text-sm font-semibold text-slate-700">
                        Dark
                      </p>

                      <p className="text-xs text-slate-400">
                        Dark appearance
                      </p>

                    </div>

                  </div>

                </button>

              </div>

            </div>

            {/* =================================
                ACCOUNT ACTIONS
            ================================= */}
            <div className="rounded-2xl border border-red-100 bg-white p-6 shadow-sm">

              <h2 className="text-lg font-semibold text-slate-800">
                Account Actions
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Sign out of your account
              </p>

              <button
                type="button"
                onClick={handleLogout}
                className="mt-5 rounded-lg border border-red-200 bg-red-50 px-5 py-2.5 text-sm font-medium text-red-600 transition hover:bg-red-100"
              >
                Logout
              </button>

            </div>

          </div>

        </main>

      </div>

    </div>
  );
};

export default StaffSettings;
