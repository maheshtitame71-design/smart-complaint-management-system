import React, { useEffect, useState } from "react";
import api from "../../services/api";
import Sidebar from "../../components/staff/Sidebar";
import TopBar from "../../components/staff/TopBar";

const StaffDashboard = () => {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);

  // =====================================================
  // FETCH ASSIGNED COMPLAINTS
  // =====================================================
  const fetchAssignedComplaints = async () => {
    try {
      setLoading(true);

      const response = await api.get("/complaints/assigned");

      console.log("Assigned complaints:", response.data);

      const complaintsData =
        response.data.complaints ||
        response.data.data ||
        [];

      setComplaints(complaintsData);
    } catch (error) {
      console.error(
        "Error fetching assigned complaints:",
        error
      );
    } finally {
      setLoading(false);
    }
  };

  // Fetch complaints when dashboard loads
  useEffect(() => {
    fetchAssignedComplaints();
  }, []);

  // =====================================================
  // UPDATE COMPLAINT STATUS
  // =====================================================
  const handleStatusChange = async (complaintId, newStatus) => {
    try {
      setUpdatingId(complaintId);

      console.log(
        "Updating complaint:",
        complaintId,
        "to:",
        newStatus
      );

      // Send status update to backend
      await api.patch(
        `/complaints/${complaintId}/status`,
        {
          status: newStatus,
        }
      );

      // =================================================
      // IMPORTANT:
      // Update React state immediately
      // =================================================
      setComplaints((prevComplaints) =>
        prevComplaints.map((complaint) => {
          if (complaint._id === complaintId) {
            return {
              ...complaint,
              status: newStatus,
              updatedAt: new Date().toISOString(),
            };
          }

          return complaint;
        })
      );

    } catch (error) {
      console.error(
        "Error updating complaint status:",
        error
      );

      alert(
        error.response?.data?.message ||
          "Failed to update complaint status"
      );
    } finally {
      setUpdatingId(null);
    }
  };

  // =====================================================
  // CALCULATE DASHBOARD COUNTS
  // =====================================================

  const totalAssigned = complaints.length;

  const assignedCount = complaints.filter(
    (complaint) =>
      complaint.status?.toLowerCase() === "assigned"
  ).length;

  const inProgressCount = complaints.filter(
    (complaint) =>
      complaint.status?.toLowerCase() === "in-progress"
  ).length;

  const resolvedCount = complaints.filter(
    (complaint) =>
      complaint.status?.toLowerCase() === "resolved"
  ).length;

  // =====================================================
  // STATUS BADGE
  // =====================================================
  const getStatusStyle = (status) => {
    switch (status?.toLowerCase()) {
      case "assigned":
        return "bg-yellow-100 text-yellow-700";

      case "in-progress":
        return "bg-blue-100 text-blue-700";

      case "resolved":
        return "bg-green-100 text-green-700";

      default:
        return "bg-slate-100 text-slate-600";
    }
  };

  // =====================================================
  // DASHBOARD
  // =====================================================
  return (
    <div className="flex min-h-screen bg-slate-50">

      {/* ================= SIDEBAR ================= */}
      <Sidebar />

      {/* ================= MAIN AREA ================= */}
      <div className="flex min-w-0 flex-1 flex-col">

        {/* ================= TOPBAR ================= */}
        <TopBar />

        {/* ================= CONTENT ================= */}
        <main className="flex-1 p-6">

          <div className="mx-auto max-w-7xl">

            {/* ================= HEADER ================= */}
            <div className="mb-8">
              <h1 className="text-2xl font-bold text-slate-800">
                Staff Dashboard
              </h1>

              <p className="mt-1 text-sm text-slate-500">
                Manage and resolve your assigned complaints
              </p>
            </div>

            {/* ================= STATISTICS ================= */}
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">

              {/* TOTAL ASSIGNED */}
              <div className="rounded-2xl bg-white p-6 shadow-sm">
                <div className="flex items-center justify-between">

                  <div>
                    <p className="text-sm font-medium text-slate-500">
                      Total Assigned
                    </p>

                    <h2 className="mt-2 text-3xl font-bold text-slate-800">
                      {loading ? "-" : totalAssigned}
                    </h2>
                  </div>

                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-purple-100">
                    <span className="text-xl">
                      📋
                    </span>
                  </div>

                </div>
              </div>

              {/* ASSIGNED */}
              <div className="rounded-2xl bg-white p-6 shadow-sm">
                <div className="flex items-center justify-between">

                  <div>
                    <p className="text-sm font-medium text-slate-500">
                      Assigned
                    </p>

                    <h2 className="mt-2 text-3xl font-bold text-yellow-600">
                      {loading ? "-" : assignedCount}
                    </h2>
                  </div>

                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-yellow-100">
                    <span className="text-xl">
                      ⏳
                    </span>
                  </div>

                </div>
              </div>

              {/* IN PROGRESS */}
              <div className="rounded-2xl bg-white p-6 shadow-sm">
                <div className="flex items-center justify-between">

                  <div>
                    <p className="text-sm font-medium text-slate-500">
                      In Progress
                    </p>

                    <h2 className="mt-2 text-3xl font-bold text-blue-600">
                      {loading ? "-" : inProgressCount}
                    </h2>
                  </div>

                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100">
                    <span className="text-xl">
                      🔧
                    </span>
                  </div>

                </div>
              </div>

              {/* RESOLVED */}
              <div className="rounded-2xl bg-white p-6 shadow-sm">
                <div className="flex items-center justify-between">

                  <div>
                    <p className="text-sm font-medium text-slate-500">
                      Resolved
                    </p>

                    <h2 className="mt-2 text-3xl font-bold text-green-600">
                      {loading ? "-" : resolvedCount}
                    </h2>
                  </div>

                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-green-100">
                    <span className="text-xl">
                      ✓
                    </span>
                  </div>

                </div>
              </div>

            </div>

            {/* ================= COMPLAINTS ================= */}
            <div className="mt-8 rounded-2xl bg-white shadow-sm">

              {/* Section Header */}
              <div className="border-b border-slate-100 px-6 py-5">

                <h2 className="text-lg font-semibold text-slate-800">
                  Assigned Complaints
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Manage your assigned complaints
                </p>

              </div>

              {/* ================= LOADING ================= */}
              {loading && (
                <div className="p-10 text-center">
                  <p className="text-sm text-slate-500">
                    Loading complaints...
                  </p>
                </div>
              )}

              {/* ================= EMPTY ================= */}
              {!loading && complaints.length === 0 && (
                <div className="p-10 text-center">

                  <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-slate-100">
                    <span className="text-2xl">
                      📋
                    </span>
                  </div>

                  <h3 className="text-lg font-semibold text-slate-700">
                    No Complaints Assigned
                  </h3>

                  <p className="mt-2 text-sm text-slate-500">
                    You don't have any complaints assigned
                    to you yet.
                  </p>

                </div>
              )}

              {/* ================= COMPLAINT LIST ================= */}
              {!loading && complaints.length > 0 && (
                <div className="divide-y divide-slate-100">

                  {complaints.map((complaint) => (

                    <div
                      key={complaint._id}
                      className="px-6 py-6 transition hover:bg-slate-50"
                    >

                      {/* TOP */}
                      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">

                        <div className="min-w-0">

                          <h3 className="text-base font-semibold text-slate-800">
                            {complaint.title}
                          </h3>

                          <p className="mt-2 text-sm leading-6 text-slate-500">
                            {complaint.description}
                          </p>

                        </div>

                        {/* STATUS */}
                        <span
                          className={`w-fit shrink-0 rounded-full px-3 py-1 text-xs font-semibold capitalize ${getStatusStyle(
                            complaint.status
                          )}`}
                        >
                          {complaint.status}
                        </span>

                      </div>

                      {/* DETAILS */}
                      <div className="mt-5 flex flex-wrap gap-x-6 gap-y-2 text-xs text-slate-400">

                        <span className="capitalize">
                          Category:{" "}
                          {complaint.category || "N/A"}
                        </span>

                        <span>
                          Priority:{" "}
                          {complaint.priority || "Normal"}
                        </span>

                        <span>
                          Created:{" "}
                          {complaint.createdAt
                            ? new Date(
                                complaint.createdAt
                              ).toLocaleDateString()
                            : "N/A"}
                        </span>

                        {complaint.updatedAt && (
                          <span>
                            Updated:{" "}
                            {new Date(
                              complaint.updatedAt
                            ).toLocaleDateString()}
                          </span>
                        )}

                      </div>

                      {/* ================= ACTION ================= */}
                      <div className="mt-5 flex justify-end">

                        {/* ASSIGNED */}
                        {complaint.status?.toLowerCase() ===
                          "assigned" && (
                          <button
                            onClick={() =>
                              handleStatusChange(
                                complaint._id,
                                "in-progress"
                              )
                            }
                            disabled={
                              updatingId === complaint._id
                            }
                            className="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
                          >
                            {updatingId === complaint._id
                              ? "Starting..."
                              : "Start Work"}
                          </button>
                        )}

                        {/* IN PROGRESS */}
                        {complaint.status?.toLowerCase() ===
                          "in-progress" && (
                          <button
                            onClick={() =>
                              handleStatusChange(
                                complaint._id,
                                "resolved"
                              )
                            }
                            disabled={
                              updatingId === complaint._id
                            }
                            className="rounded-lg bg-green-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-50"
                          >
                            {updatingId === complaint._id
                              ? "Resolving..."
                              : "Mark as Resolved"}
                          </button>
                        )}

                        {/* RESOLVED */}
                        {complaint.status?.toLowerCase() ===
                          "resolved" && (
                          <div className="flex items-center gap-2 rounded-lg bg-green-50 px-5 py-2.5 text-sm font-semibold text-green-700">
                            <span className="text-lg">
                              ✓
                            </span>

                            Resolved
                          </div>
                        )}

                      </div>

                    </div>

                  ))}

                </div>
              )}

            </div>

          </div>

        </main>
      </div>
    </div>
  );
};

export default StaffDashboard;

