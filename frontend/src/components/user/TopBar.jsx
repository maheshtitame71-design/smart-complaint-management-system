import { useState } from "react";

const TopBar = () => {
  const [user] = useState(() => {
    const storedUser = localStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : null;
  });

  return (
    <header className="border-b border-slate-200 bg-white/90 px-4 py-4 backdrop-blur-sm sm:px-6">

      <div>
        <p className="text-sm font-medium uppercase tracking-[0.2em] text-indigo-600">
          Student Portal
        </p>

        <h1 className="mt-1 text-xl font-bold text-slate-900 sm:text-2xl">
          Welcome back, {user?.name || "User"}
        </h1>
      </div>

    </header>
  );
};

export default TopBar;