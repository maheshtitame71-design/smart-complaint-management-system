import Sidebar from "../../components/admin/Sidebar";
import TopBar from "../../components/admin/TopBar";
import StatCard from "../../components/admin/StatCard";
import ComplaintTable from "../../components/admin/ComplaintTable";
import api from "../../services/api.js";
import { useEffect, useState } from "react";

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    assigned: 0,
    inProgress: 0,
    resolved: 0,
    rejected: 0,
  });

  // ================= FETCH COMPLAINT STATS =================
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await api.get("/complaints/stats");

        console.log("Stats response:", response.data);

        if (response.data.success) {
          setStats(response.data.stats);
        }
      } catch (error) {
        console.error(
          "Error fetching complaint stats:",
          error
        );
      }
    };

    fetchStats();
  }, []);

  // ================= STAT CARDS =================
  const statCards = [
    {
      title: "Total complaints",
      value: stats.total,
      icon: "▣",
      accent: "bg-indigo-100 text-indigo-700",
    },
    {
      title: "Resolved",
      value: stats.resolved,
      icon: "✓",
      accent: "bg-emerald-100 text-emerald-700",
    },
    {
      title: "In progress",
      value: stats.inProgress,
      icon: "⏳",
      accent: "bg-amber-100 text-amber-700",
    },
    {
      title: "Pending",
      value: stats.pending,
      icon: "⚑",
      accent: "bg-rose-100 text-rose-700",
    },
  ];

  return (
    <div className="min-h-screen bg-slate-100 text-slate-800">
      <div className="flex min-h-screen">

        {/* ================= SIDEBAR ================= */}
        <Sidebar />

        {/* ================= MAIN CONTENT ================= */}
        <main className="flex-1">

          {/* ================= TOPBAR ================= */}
          <TopBar />

          <div className="space-y-6 p-6">

            {/* ================= STAT CARDS ================= */}
            <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              {statCards.map((item) => (
                <StatCard
                  key={item.title}
                  {...item}
                />
              ))}
            </section>

            {/* ================= COMPLAINT TABLE ================= */}
            <section>
              <ComplaintTable />
            </section>

          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;
