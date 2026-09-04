import { useLocation, useNavigate } from "react-router-dom";

const navigation = [
  { label: 'Dashboard', path: '/user/dashboard', icon: '◫' },
  { label: 'My Complaints', path: '/user/my-complaints', icon: '▣' },
  { label: 'Create Complaint', path: '/user/create-complaint', icon: '+' },
  { label: 'Notifications', path: '/user/notifications', icon: '◉' },
  { label: 'My Profile', path: '/user/profile', icon: '◔' },
  { label: 'Settings', path: '/user/settings', icon: '⚙' },
];

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    navigate("/login")
  }
  return (
    <aside className="hidden w-72 shrink-0 border-r border-slate-200 bg-slate-950 text-slate-200 lg:flex lg:flex-col">
      <div className="flex items-center gap-3 border-b border-slate-800 px-6 py-6">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-500 text-lg font-bold text-white shadow-lg shadow-indigo-500/30">
          S
        </div>
        <div>
          <p className="text-lg font-bold text-white">SmartComplaint</p>
          <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Student Portal</p>
        </div>
      </div>

      <nav className="flex-1 space-y-2 px-4 py-6">
        {navigation.map((item) => (
          <button
            key={item.label}
            type="button"
            onClick={() => navigate(item.path)}
            className={`flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-sm font-medium transition-colors ${location.pathname === item.path
              ? 'bg-slate-800 text-white shadow-inner shadow-slate-700/60'
              : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
              }`}
          >
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-800 text-base text-indigo-300">
              {item.icon}
            </span>
            {item.label}
          </button>
        ))}
      </nav>

      <div className="border-t border-slate-800 p-4">
        <div className="rounded-2xl bg-slate-900 p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-linear-to-br from-indigo-500 to-cyan-400 text-sm font-bold text-white">
              AD
            </div>
            <div>
              <p className="font-semibold text-white">Student</p>
              <p className="text-xs text-slate-400">College User</p>
            </div>
          </div>
        </div>
      </div>
      <button onClick={handleLogout} type="button" className="w-full rounded-2xl px-4 py-4 text-center text-lg font-medium text-red-400 transition hover:bg-red-500/10 hover:text-red-300">Logout</button>
    </aside>
  );
};

export default Sidebar;
