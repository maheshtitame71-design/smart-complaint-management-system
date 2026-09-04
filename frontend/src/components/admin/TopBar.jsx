import { useState } from "react";

const TopBar = () => {
  const [user] = useState(() => {
    const storedUser = localStorage.getItem('user');
    return storedUser ? JSON.parse(storedUser) : null;
  });
  return (
    <header className="flex flex-col gap-4 border-b border-slate-200 bg-white/90 px-4 py-4 backdrop-blur-sm sm:px-6 lg:flex-row lg:items-center lg:justify-between">
      <div>
        <p className="text-sm font-medium uppercase tracking-[0.2em] text-indigo-600">Dashboard</p>
        <h1 className="mt-1 text-xl font-bold text-slate-900 sm:text-2xl">Welcome back, {user?.name || "Admin"}</h1>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
       
      </div>
    </header>
  );
};

export default TopBar;
