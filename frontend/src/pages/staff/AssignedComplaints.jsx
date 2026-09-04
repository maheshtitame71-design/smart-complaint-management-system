import React, { useEffect, useState } from "react";
import api from "../../services/api";
import Sidebar from "../../components/staff/Sidebar";
import TopBar from "../../components/staff/TopBar";

const AssignedComplaints = () => {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);

  // Fetch complaints assigned to logged-in staff
  const fetchAssignedComplaints = async () => {
    try {
      setLoading(true);

      const response = await api.get("/complaints/assigned");

      setComplaints(response.data.complaints || []);
    } catch (error) {
      console.error("Error fetching assigned complaints:", error);

      alert(
        error.response?.data?.message ||
        "Failed to fetch assigned complaints"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAssignedComplaints();
  }, []);

  // Update complaint status
  const handleStatusChange = async (complaintId, status) => {
    try {
      setUpdatingId(complaintId);

      const response = await api.patch(
        `/complaints/${complaintId}/status`,
        {
          status,
        }
      );

      // Update complaint in UI
      setComplaints((prevComplaints) =>
        prevComplaints.map((complaint) =>
          complaint._id === complaintId
            ? {
              ...complaint,
              status: response.data.complaint.status,
              updatedAt: response.data.complaint.updatedAt,
            }
            : complaint
        )
      );
    } catch (error) {
      console.error("Error updating complaint status:", error);

      alert(
        error.response?.data?.message ||
        "Failed to update complaint status"
      );
    } finally {
      setUpdatingId(null);
    }
  };

  // Status badge style
  const getStatusStyle = (status) => {
    switch (status) {
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

  return (
    <div className="flex min-h-screen bg-slate-50">

      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex min-w-0 flex-1 flex-col">

        {/* TopBar */}
        <TopBar />

        {/* Page Content */}
        <main className="flex-1 p-6">

          <div className="mx-auto max-w-6xl">

            {/* Page Header */}
            <div className="mb-6">
              <h1 className="text-2xl font-bold text-slate-800">
                Assigned Complaints
              </h1>

              <p className="mt-1 text-sm text-slate-500">
                Complaints assigned to you
              </p>
            </div>

            {/* Complaint Count */}
            <div className="mb-6">
              <div className="inline-flex items-center rounded-lg bg-white px-4 py-3 shadow-sm">
                <span className="text-sm text-slate-500">
                  Total Assigned
                </span>

                <span className="ml-2 text-sm font-semibold text-slate-800">
                  {complaints.length}
                </span>
              </div>
            </div>

            {/* Loading */}
            {loading ? (
              <div className="rounded-2xl bg-white p-10 text-center shadow-sm">
                <p className="text-sm text-slate-500">
                  Loading assigned complaints...
                </p>
              </div>
            ) : complaints.length === 0 ? (

              /* No Complaints */
              <div className="rounded-2xl bg-white p-10 text-center shadow-sm">

                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-slate-100">
                  <span className="text-2xl">📋</span>
                </div>

                <h2 className="text-lg font-semibold text-slate-700">
                  No Assigned Complaints
                </h2>

                <p className="mt-2 text-sm text-slate-500">
                  You currently don't have any complaints assigned to you.
                </p>

              </div>

            ) : (

              /* Complaints */
              <div className="space-y-5">

                {complaints.map((complaint) => (

                  <div
                    key={complaint._id}
                    className="rounded-2xl bg-white p-6 shadow-sm transition hover:shadow-md"
                  >

                    {/* Header */}
                    <div className="flex flex-col justify-between gap-4 md:flex-row">

                      <div>
                        <h2 className="text-lg font-semibold text-slate-800">
                          {complaint.title}
                        </h2>

                        <p className="mt-1 text-xs text-slate-400">
                          Complaint ID: {complaint._id}
                        </p>
                      </div>

                      {/* Status */}
                      <span
                        className={`h-fit w-fit rounded-full px-3 py-1 text-xs font-semibold capitalize ${getStatusStyle(
                          complaint.status
                        )}`}
                      >
                        {complaint.status}
                      </span>

                    </div>

                    {/* Description */}
                    <div className="mt-5">
                      <p className="text-sm leading-6 text-slate-600">
                        {complaint.description}
                      </p>
                    </div>

                    {/* Complaint Details */}
                    <div className="mt-5 grid grid-cols-1 gap-4 border-t border-slate-100 pt-5 sm:grid-cols-2 md:grid-cols-4">

                      {/* Category */}
                      <div>
                        <p className="text-xs font-medium text-slate-400">
                          Category
                        </p>

                        <p className="mt-1 text-sm font-medium capitalize text-slate-700">
                          {complaint.category || "N/A"}
                        </p>
                      </div>

                      {/* Priority */}
                      <div>
                        <p className="text-xs font-medium text-slate-400">
                          Priority
                        </p>

                        <p className="mt-1 text-sm font-medium capitalize text-slate-700">
                          {complaint.priority || "Normal"}
                        </p>
                      </div>

                      {/* Created */}
                      <div>
                        <p className="text-xs font-medium text-slate-400">
                          Created
                        </p>

                        <p className="mt-1 text-sm font-medium text-slate-700">
                          {complaint.createdAt
                            ? new Date(
                              complaint.createdAt
                            ).toLocaleDateString()
                            : "N/A"}
                        </p>
                      </div>

                      {/* Updated */}
                      <div>
                        <p className="text-xs font-medium text-slate-400">
                          Last Updated
                        </p>

                        <p className="mt-1 text-sm font-medium text-slate-700">
                          {complaint.updatedAt
                            ? new Date(
                              complaint.updatedAt
                            ).toLocaleDateString()
                            : "N/A"}
                        </p>
                      </div>

                    </div>

                    {/* Action */}
                    <div className="mt-6 flex justify-end border-t border-slate-100 pt-5">

                      {/* Assigned → In Progress */}
                      {complaint.status === "assigned" && (
                        <button
                          onClick={() =>
                            handleStatusChange(
                              complaint._id,
                              "in-progress"
                            )
                          }
                          disabled={updatingId === complaint._id}
                          className="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          {updatingId === complaint._id
                            ? "Starting..."
                            : "Start Work"}
                        </button>
                      )}

                      {/* In Progress → Resolved */}
                      {complaint.status === "in-progress" && (
                        <button
                          onClick={() =>
                            handleStatusChange(
                              complaint._id,
                              "resolved"
                            )
                          }
                          disabled={updatingId === complaint._id}
                          className="rounded-lg bg-green-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          {updatingId === complaint._id
                            ? "Resolving..."
                            : "Mark as Resolved"}
                        </button>
                      )}

                      {/* Resolved */}
                      {complaint.status === "resolved" && (
                        <div className="flex items-center gap-2 rounded-lg bg-green-50 px-5 py-2.5 text-sm font-semibold text-green-700">
                          <span>✓</span>
                          Resolved
                        </div>
                      )}

                    </div>

                  </div>

                ))}

              </div>

            )}

          </div>

        </main>
      </div>
    </div>
  );
};

export default AssignedComplaints;
