import { useEffect, useState } from "react";
import Sidebar from "../../components/user/Sidebar";
import TopBar from "../../components/user/TopBar";
import api from "../../services/api";

const UserDashboard = () => {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMyComplaints = async () => {
      try {
        const response = await api.get("/complaints/my");

        setComplaints(response.data.complaints);
      } catch (error) {
        console.error("Error fetching complaints:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMyComplaints();
  }, []);

  const totalComplaints = complaints.length;

  const pendingComplaints = complaints.filter(
    (complaint) => complaint.status === "pending"
  ).length;

  const inProgressComplaints = complaints.filter(
    (complaint) => complaint.status === "in-progress"
  ).length;

  const resolvedComplaints = complaints.filter(
    (complaint) => complaint.status === "resolved"
  ).length;

  return (
    <div className="flex min-h-screen bg-slate-50">

      <Sidebar />

      <div className="flex min-w-0 flex-1 flex-col">

        <TopBar />

        <main className="flex-1 p-4 sm:p-6 lg:p-8">

          {/* Heading */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-slate-900">
              Your Complaint Overview
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Track your submitted complaints and their current status.
            </p>
          </div>


          {/* Loading */}
          {loading ? (
            <p className="text-slate-500">
              Loading your complaints...
            </p>
          ) : (
            <>
              {/* Statistics */}
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">

                <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                  <p className="text-sm text-slate-500">
                    Total Complaints
                  </p>

                  <h3 className="mt-2 text-3xl font-bold text-slate-900">
                    {totalComplaints}
                  </h3>
                </div>


                <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                  <p className="text-sm text-slate-500">
                    Pending
                  </p>

                  <h3 className="mt-2 text-3xl font-bold text-amber-600">
                    {pendingComplaints}
                  </h3>
                </div>


                <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                  <p className="text-sm text-slate-500">
                    In Progress
                  </p>

                  <h3 className="mt-2 text-3xl font-bold text-blue-600">
                    {inProgressComplaints}
                  </h3>
                </div>


                <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                  <p className="text-sm text-slate-500">
                    Resolved
                  </p>

                  <h3 className="mt-2 text-3xl font-bold text-emerald-600">
                    {resolvedComplaints}
                  </h3>
                </div>

              </div>


              {/* Recent Complaints */}
              <div className="mt-8 rounded-2xl border border-slate-200 bg-white shadow-sm">

                <div className="border-b border-slate-200 px-5 py-4">

                  <h2 className="font-bold text-slate-900">
                    Recent Complaints
                  </h2>

                  <p className="text-sm text-slate-500">
                    Your latest complaints
                  </p>

                </div>


                <div className="divide-y divide-slate-100">

                  {complaints.length === 0 ? (

                    <div className="p-6 text-center text-slate-500">
                      You have not submitted any complaints yet.
                    </div>

                  ) : (

                    complaints.slice(0, 5).map((complaint) => (

                      <div
                        key={complaint._id}
                        className="flex flex-col gap-3 px-5 py-4 sm:flex-row sm:items-center sm:justify-between"
                      >

                        <div>

                          <h3 className="font-semibold text-slate-800">
                            {complaint.title}
                          </h3>

                          <p className="mt-1 text-xs text-slate-400">
                            Complaint ID: {complaint._id}
                          </p>

                        </div>


                        <span className="w-fit rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
                          {complaint.status}
                        </span>

                      </div>

                    ))

                  )}

                </div>

              </div>

            </>
          )}

        </main>

      </div>

    </div>
  );
};

export default UserDashboard;