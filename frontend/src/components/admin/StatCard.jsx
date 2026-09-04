const StatCard = ({ title, value, change, trend, icon, accent }) => {
  const isPositive = trend === 'up';

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-shadow hover:shadow-md">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-slate-500">{title}</p>
          <p className="mt-3 text-3xl font-bold tracking-tight text-slate-900">{value}</p>
        </div>

        <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${accent}`}>
          {icon}
        </div>
      </div>

      <div className="mt-4 flex items-center gap-2 text-sm">
        <span
          className={`inline-flex items-center rounded-full px-2 py-1 font-medium ${isPositive
              ? 'bg-emerald-100 text-emerald-700'
              : 'bg-amber-100 text-amber-700'
            }`}
        >
          {isPositive ? '↑' : '↓'} {change}
        </span>
        <span className="text-slate-500">vs last month</span>
      </div>
    </div>
  );
};

export default StatCard;
