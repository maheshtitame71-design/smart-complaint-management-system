const activities = [
  {
    title: 'New complaint assigned to Utilities Team',
    time: '10 minutes ago',
    tone: 'indigo',
  },
  {
    title: 'Roads department completed 3 inspections',
    time: '1 hour ago',
    tone: 'emerald',
  },
  {
    title: 'Escalated issue requires city manager approval',
    time: '3 hours ago',
    tone: 'amber',
  },
  {
    title: 'Weekly report exported successfully',
    time: 'Yesterday',
    tone: 'sky',
  },
];

const toneStyles = {
  indigo: 'bg-indigo-100 text-indigo-700',
  emerald: 'bg-emerald-100 text-emerald-700',
  amber: 'bg-amber-100 text-amber-700',
  sky: 'bg-sky-100 text-sky-700',
};

const RecentActivity = () => {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="mb-5 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Recent activity</h2>
          <p className="text-sm text-slate-500">Operations updates across the city</p>
        </div>
      </div>

      <div className="space-y-4">
        {activities.map((item) => (
          <div key={item.title} className="flex items-start gap-3 rounded-xl bg-slate-50 p-3">
            <span className={`mt-1 h-2.5 w-2.5 rounded-full ${toneStyles[item.tone]}`} />
            <div className="flex-1">
              <p className="text-sm font-medium text-slate-700">{item.title}</p>
              <p className="mt-1 text-xs text-slate-500">{item.time}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecentActivity;
