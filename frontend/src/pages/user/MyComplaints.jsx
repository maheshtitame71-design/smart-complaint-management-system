import { useEffect, useState } from "react";
import api from "../../services/api.js";

const MyComplaints = () => {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch user's complaints
  const fetchMyComplaints = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/complaints/my");

      if (response.data.success) {
        setComplaints(response.data.complaints || []);
      }
    } catch (error) {
      console.error("Error fetching complaints:", error);

      setError(
        error.response?.data?.message ||
          "Unable to load your complaints."
      );
    } finally {
      setLoading(false);
    }
  };

  // Delete complaint
  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this complaint?"
    );

    if (!confirmDelete) return;

    try {
      const response = await api.delete(
        `/complaints/my/${id}`
      );

      if (response.data.success) {
        setComplaints((prev) =>
          prev.filter((complaint) => complaint._id !== id)
        );
      }
    } catch (error) {
      console.error("Delete complaint error:", error);

      alert(
        error.response?.data?.message ||
          "Unable to delete complaint."
      );
    }
  };

  useEffect(() => {
    fetchMyComplaints();
  }, []);

  // -------------------------------
  // Loading UI
  // -------------------------------
  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto"></div>

          <p className="mt-4 text-slate-500">
            Loading your complaints...
          </p>
        </div>
      </div>
    );
  }

  // -------------------------------
  // UI
  // -------------------------------
  return (
    <div className="min-h-screen bg-slate-50">

      {/* ================= HEADER ================= */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-6 py-7">

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">

            <div>
              <p className="text-sm font-medium text-blue-600 mb-1">
                Dashboard
              </p>

              <h1 className="text-3xl font-bold text-slate-800">
                My Complaints
              </h1>

              <p className="text-slate-500 mt-1">
                Track and manage complaints submitted by you.
              </p>
            </div>

            {/* Complaint Count */}
            <div className="bg-blue-50 border border-blue-100 rounded-xl px-6 py-4">
              <p className="text-sm text-blue-600">
                Total Complaints
              </p>

              <p className="text-2xl font-bold text-blue-700">
                {complaints.length}
              </p>
            </div>

          </div>

        </div>
      </div>

      {/* ================= MAIN ================= */}
      <main className="max-w-7xl mx-auto px-6 py-8">

        {/* Error */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-xl p-4 flex items-center gap-3">
            <div className="w-9 h-9 bg-red-100 rounded-full flex items-center justify-center text-red-600">
              !
            </div>

            <p className="text-red-700 text-sm">
              {error}
            </p>
          </div>
        )}

        {/* ================= EMPTY STATE ================= */}
        {!error && complaints.length === 0 && (
          <div className="bg-white border border-slate-200 rounded-2xl shadow-sm">

            <div className="flex flex-col items-center justify-center py-20 px-6 text-center">

              {/* Icon */}
              <div className="w-20 h-20 rounded-full bg-blue-50 flex items-center justify-center mb-5">
                <svg
                  className="w-10 h-10 text-blue-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="1.7"
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h7l5 5v11a2 2 0 01-2 2z"
                  />
                </svg>
              </div>

              <h2 className="text-xl font-semibold text-slate-800">
                No complaints yet
              </h2>

              <p className="text-slate-500 mt-2 max-w-md">
                You haven't submitted any complaints. Once you
                submit a complaint, it will appear here.
              </p>

            </div>
          </div>
        )}

        {/* ================= COMPLAINT GRID ================= */}
        {!error && complaints.length > 0 && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

            {complaints.map((complaint) => (

              <div
                key={complaint._id}
                className="bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden"
              >

                {/* ================= CARD TOP ================= */}
                <div className="p-6">

                  <div className="flex items-start justify-between gap-4">

                    {/* Title */}
                    <div className="min-w-0">
                      <h2 className="text-lg font-bold text-slate-800 truncate">
                        {complaint.title}
                      </h2>

                      <p className="text-xs text-slate-400 mt-1">
                        Complaint ID:{" "}
                        {complaint._id.slice(-8)}
                      </p>
                    </div>

                    {/* Status */}
                    <StatusBadge status={complaint.status} />

                  </div>

                  {/* ================= DETAILS ================= */}
                  <div className="grid grid-cols-2 gap-4 mt-6">

                    {/* Category */}
                    <InfoItem
                      label="Category"
                      value={complaint.category}
                    />

                    {/* Priority */}
                    <InfoItem
                      label="Priority"
                      value={complaint.priority}
                    />

                    {/* Location */}
                    {complaint.location && (
                      <InfoItem
                        label="Location"
                        value={complaint.location}
                        full
                      />
                    )}

                  </div>

                  {/* ================= DESCRIPTION ================= */}
                  <div className="mt-5">

                    <p className="text-xs font-medium text-slate-400 uppercase tracking-wide">
                      Description
                    </p>

                    <p className="text-sm text-slate-600 leading-6 mt-2 line-clamp-3">
                      {complaint.description}
                    </p>

                  </div>

                  {/* ================= DATE ================= */}
                  <div className="flex items-center gap-2 mt-5 text-sm text-slate-400">

                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="1.8"
                        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>

                    <span>
                      Submitted on{" "}
                      {new Date(
                        complaint.createdAt
                      ).toLocaleDateString("en-IN", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })}
                    </span>

                  </div>

                </div>

                {/* ================= DELETE SECTION ================= */}

                {complaint.status === "pending" && (
                  <div className="border-t border-slate-100 bg-slate-50 px-6 py-4">

                    <button
                      onClick={() =>
                        handleDelete(complaint._id)
                      }
                      className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg bg-red-50 border border-red-200 text-red-600 font-medium text-sm hover:bg-red-500 hover:text-white transition-all duration-200"
                    >

                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="1.8"
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6M9 7V4a1 1 0 011-1h4a1 1 0 011 1v3m-8 0h10"
                        />
                      </svg>

                      Delete Complaint

                    </button>

                  </div>
                )}

                {/* ================= NON-PENDING ================= */}

                {complaint.status !== "pending" && (
                  <div className="border-t border-slate-100 px-6 py-4">

                    <p className="text-xs text-slate-400 text-center">
                      This complaint cannot be deleted because
                      it is already being processed.
                    </p>

                  </div>
                )}

              </div>

            ))}

          </div>
        )}

      </main>
    </div>
  );
};


// ==========================================
// Status Badge
// ==========================================

const StatusBadge = ({ status }) => {

  const styles = {
    pending: "bg-amber-50 text-amber-700 border-amber-200",
    assigned: "bg-blue-50 text-blue-700 border-blue-200",
    "in-progress":
      "bg-purple-50 text-purple-700 border-purple-200",
    resolved:
      "bg-emerald-50 text-emerald-700 border-emerald-200",
    rejected:
      "bg-red-50 text-red-700 border-red-200",
  };

  const labels = {
    pending: "Pending",
    assigned: "Assigned",
    "in-progress": "In Progress",
    resolved: "Resolved",
    rejected: "Rejected",
  };

  return (
    <span
      className={`shrink-0 px-3 py-1.5 rounded-full border text-xs font-semibold ${
        styles[status] ||
        "bg-slate-50 text-slate-600 border-slate-200"
      }`}
    >
      {labels[status] || status}
    </span>
  );
};


// ==========================================
// Info Item
// ==========================================

const InfoItem = ({ label, value, full = false }) => {
  return (
    <div className={full ? "col-span-2" : ""}>

      <p className="text-xs font-medium text-slate-400 uppercase tracking-wide">
        {label}
      </p>

      <p className="text-sm font-medium text-slate-700 mt-1 capitalize truncate">
        {value || "Not provided"}
      </p>

    </div>
  );
};

export default MyComplaints;