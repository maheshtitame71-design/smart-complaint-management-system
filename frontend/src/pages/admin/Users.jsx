import { useEffect, useState } from "react";
import api from "../../services/api";
import Sidebar from "../../components/admin/Sidebar";
import TopBar from "../../components/admin/TopBar";

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await api.get("/auth/users");

        setUsers(response.data.users);
      } catch (error) {
        console.error("Error fetching users:", error);
        setError("Failed to load users");
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  // Delete user
  const handleDeleteUser = async (userId, userName) => {
    const confirmDelete = window.confirm(
      `Are you sure you want to delete ${userName}?`
    );

    if (!confirmDelete) {
      return;
    }

    try {
      setDeletingId(userId);

      await api.delete(`/auth/users/${userId}`);

      // Remove deleted user from UI
      setUsers((prevUsers) =>
        prevUsers.filter((user) => user._id !== userId)
      );

    } catch (error) {
      console.error("Error deleting user:", error);

      alert(
        error.response?.data?.message || "Failed to delete user"
      );
    } finally {
      setDeletingId(null);
    }
  };

  // Loading
  if (loading) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold">
          Loading users...
        </h1>
      </div>
    );
  }

  // Error
  if (error) {
    return (
      <div className="p-6">
        <p className="text-red-500">
          {error}
        </p>
      </div>
    );
  }

  const filteredUsers = users.filter((user) => {
    const searchValue = searchTerm.trim().toLowerCase();

    return (
      !searchValue ||
      [user.name, user.email, user.phone, user.role].some((value) =>
        String(value || "")
          .toLowerCase()
          .includes(searchValue)
      )
    );
  });

  return (
    <div className="min-h-screen bg-slate-100 text-slate-800">
      <div className="flex min-h-screen">

        <Sidebar />

        <main className="min-w-0 flex-1">

          <TopBar />

          <div className="space-y-5 p-4 sm:space-y-6 sm:p-6">

            {/* Header */}
            <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">

              <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">

                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-indigo-600">
                    Administration
                  </p>

                  <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900">
                    User directory
                  </h1>

                  <p className="mt-2 text-sm text-slate-500">
                    Manage registered users and review their account details.
                  </p>
                </div>

                <span className="w-fit rounded-full bg-indigo-50 px-3 py-1.5 text-sm font-semibold text-indigo-700">
                  {filteredUsers.length}{" "}
                  {filteredUsers.length === 1 ? "user" : "users"}
                </span>

              </div>

            </section>


            {/* Search */}
            <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">

              <label className="block">

                <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                  Search users
                </span>

                <div className="relative">

                  <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                    ⌕
                  </span>

                  <input
                    type="search"
                    value={searchTerm}
                    onChange={(event) =>
                      setSearchTerm(event.target.value)
                    }
                    placeholder="Search by name, email, phone, or role"
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-10 pr-4 text-sm text-slate-700 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                  />

                </div>

              </label>

            </section>


            {/* No users */}
            {filteredUsers.length === 0 ? (

              <section className="rounded-2xl border border-dashed border-slate-300 bg-white px-5 py-16 text-center shadow-sm">

                <p className="text-lg font-semibold text-slate-700">
                  No users found
                </p>

                <p className="mt-1 text-sm text-slate-500">
                  Try a different search term.
                </p>

              </section>

            ) : (

              /* Users Table */
              <section className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-sm">

                <div className="min-w-205">

                  {/* Table Header */}
                  <div className="grid grid-cols-[minmax(180px,1.2fr)_minmax(220px,1.5fr)_minmax(140px,1fr)_minmax(100px,.6fr)_80px] gap-4 border-b border-slate-200 bg-slate-50 px-5 py-4 text-xs font-semibold uppercase tracking-[0.15em] text-slate-500">

                    <span>Name</span>
                    <span>Email</span>
                    <span>Phone</span>
                    <span>Role</span>
                    <span>Action</span>

                  </div>


                  {/* Users */}
                  {filteredUsers.map((user) => (

                    <div
                      key={user._id}
                      className="grid grid-cols-[minmax(180px,1.2fr)_minmax(220px,1.5fr)_minmax(140px,1fr)_minmax(100px,.6fr)_80px] items-center gap-4 border-b border-slate-100 px-5 py-4 text-sm transition last:border-b-0 hover:bg-indigo-50/40"
                    >

                      {/* Name */}
                      <span className="flex min-w-0 items-center gap-3">

                        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-50 font-bold text-indigo-700">
                          {(user.name || "U")
                            .charAt(0)
                            .toUpperCase()}
                        </span>

                        <span className="truncate font-semibold text-slate-900">
                          {user.name || "Unnamed user"}
                        </span>

                      </span>


                      {/* Email */}
                      <span className="truncate text-slate-600">
                        {user.email || "No email provided"}
                      </span>


                      {/* Phone */}
                      <span className="truncate text-slate-600">
                        {user.phone || "Not provided"}
                      </span>


                      {/* Role */}
                      <span className="truncate font-medium capitalize text-slate-700">
                        {user.role || "User"}
                      </span>


                      {/* Delete Button */}
                      <button
                        type="button"
                        disabled={deletingId === user._id}
                        onClick={() =>
                          handleDeleteUser(
                            user._id,
                            user.name || "this user"
                          )
                        }
                        className="flex h-10 w-10 items-center justify-center rounded-xl border border-red-200 bg-white text-red-500 transition hover:bg-red-50 hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-50"
                        title="Delete user"
                      >
                        {deletingId === user._id ? (
                          <span className="text-xs">
                            ...
                          </span>
                        ) : (
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            className="h-5 w-5"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M3 6h18"
                            />
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M8 6V4h8v2"
                            />
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M19 6l-1 14H6L5 6"
                            />
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M10 11v5M14 11v5"
                            />
                          </svg>
                        )}
                      </button>

                    </div>

                  ))}

                </div>

              </section>

            )}

          </div>

        </main>

      </div>
    </div>
  );
};

export default Users;