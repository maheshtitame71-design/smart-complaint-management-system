import { useEffect, useState } from "react";
import api from "../../services/api";

const priorityStyles = {
  Low: "bg-slate-100 text-slate-700",
  Medium: "bg-amber-100 text-amber-700",
  High: "bg-rose-100 text-rose-700",
};

const statusStyles = {
  Pending: "bg-slate-200 text-slate-700",
  Assigned: "bg-purple-100 text-purple-700",
  "In Progress": "bg-indigo-100 text-indigo-700",
  Resolved: "bg-emerald-100 text-emerald-700",
  Rejected: "bg-rose-100 text-rose-700",
};

const formatText = (value) => {
  if (!value) return "-";

  return value
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

const ComplaintTable = () => {
  const [complaints, setComplaints] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);

  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    hasNextPage: false,
    hasPreviousPage: false,
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchComplaints = async () => {
      try {
        setLoading(true);

        const response = await api.get(
          `/complaints/all?page=${currentPage}&limit=5`
        );

        console.log("Complaints response:", response.data);

        if (response.data.success) {
          setComplaints(response.data.complaints);
          setPagination(response.data.pagination);
        }
      } catch (error) {
        console.error("Error fetching complaints:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchComplaints();
  }, [currentPage]);

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

      {/* Header */}
      <div className="mb-5 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-900">
            Recent complaints
          </h2>

          <p className="text-sm text-slate-500">
            Latest service requests and ticket activity
          </p>
        </div>

        <button
          type="button"
          className="text-sm font-medium text-indigo-600 hover:text-indigo-500"
        >
          View all
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full text-left text-sm">

          <thead>
            <tr className="border-b border-slate-200 text-slate-500">
              <th className="pb-3 font-medium">Complaint</th>
              <th className="pb-3 font-medium">Category</th>
              <th className="pb-3 font-medium">Priority</th>
              <th className="pb-3 font-medium">Status</th>
              <th className="pb-3 font-medium">Assignee</th>
              <th className="pb-3 font-medium">Date</th>
            </tr>
          </thead>

          <tbody>

            {/* Loading */}
            {loading ? (
              <tr>
                <td
                  colSpan="6"
                  className="py-8 text-center text-slate-500"
                >
                  Loading complaints...
                </td>
              </tr>

            ) : complaints.length === 0 ? (

              /* No complaints */
              <tr>
                <td
                  colSpan="6"
                  className="py-8 text-center text-slate-500"
                >
                  No complaints found.
                </td>
              </tr>

            ) : (

              /* Complaints */
              complaints.map((complaint) => {

                const priority = formatText(complaint.priority);
                const status = formatText(complaint.status);

                return (
                  <tr
                    key={complaint._id}
                    className="border-b border-slate-100 last:border-b-0"
                  >

                    {/* Complaint */}
                    <td className="py-4 pr-4">
                      <div>
                        <p className="font-semibold text-slate-800">
                          {complaint.title}
                        </p>

                        <p className="text-xs text-slate-500">
                          #{complaint._id.slice(-6).toUpperCase()}
                        </p>
                      </div>
                    </td>

                    {/* Category */}
                    <td className="py-4 pr-4 text-slate-600">
                      {formatText(complaint.category)}
                    </td>

                    {/* Priority */}
                    <td className="py-4 pr-4">
                      <span
                        className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${
                          priorityStyles[priority] ||
                          "bg-slate-100 text-slate-700"
                        }`}
                      >
                        {priority}
                      </span>
                    </td>

                    {/* Status */}
                    <td className="py-4 pr-4">
                      <span
                        className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${
                          statusStyles[status] ||
                          "bg-slate-100 text-slate-700"
                        }`}
                      >
                        {status}
                      </span>
                    </td>

                    {/* Assignee */}
                    <td className="py-4 pr-4 text-slate-600">
                      {complaint.assignedTo?.name || "Unassigned"}
                    </td>

                    {/* Date */}
                    <td className="py-4 text-slate-600">
                      {new Date(
                        complaint.createdAt
                      ).toLocaleDateString("en-IN")}
                    </td>

                  </tr>
                );
              })
            )}

          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {!loading && complaints.length > 0 && (
        <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-4">

          {/* Page information */}
          <p className="text-sm text-slate-500">
            Page {pagination.currentPage} of {pagination.totalPages}
          </p>

          {/* Buttons */}
          <div className="flex gap-2">

            <button
              type="button"
              disabled={!pagination.hasPreviousPage}
              onClick={() =>
                setCurrentPage((page) => page - 1)
              }
              className="rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Previous
            </button>

            <button
              type="button"
              disabled={!pagination.hasNextPage}
              onClick={() =>
                setCurrentPage((page) => page + 1)
              }
              className="rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Next
            </button>

          </div>
        </div>
      )}

    </div>
  );
};

export default ComplaintTable;