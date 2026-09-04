import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../services/api";
import Sidebar from "../../components/admin/Sidebar";
import TopBar from "../../components/admin/TopBar";

const priorityStyles = {
  low: "bg-slate-100 text-slate-700",
  medium: "bg-amber-100 text-amber-700",
  high: "bg-rose-100 text-rose-700",
};

const statusStyles = {
  pending: "bg-slate-200 text-slate-700",
  assigned: "bg-purple-100 text-purple-700",
  "in progress": "bg-indigo-100 text-indigo-700",
  resolved: "bg-emerald-100 text-emerald-700",
  rejected: "bg-rose-100 text-rose-700",
};

const formatText = (value) => {
  if (!value) return "Not provided";

  return value
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

const formatDate = (value) => {
  if (!value) return "Not provided";

  return new Date(value).toLocaleString("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
  });
};

const DetailItem = ({ label, value }) => (
  <div>
    <dt className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
      {label}
    </dt>
    <dd className="mt-2 break-words text-sm font-medium text-slate-800">{value || "Not provided"}</dd>
  </div>
);

const ComplaintDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [complaint, setComplaint] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [staffMembers, setStaffMembers] = useState([]);
  const [selectedStaff, setSelectedStaff] = useState("");
  const [staffLoading, setStaffLoading] = useState(true);

  useEffect(() => {
    const fetchComplaint = async () => {
      try {
        setLoading(true);
        setError(false);
        setComplaint(null);

        const response = await api.get(`/complaints/admin/${id}`);

        if (response.data.success) {
          setComplaint(response.data.complaint);
        }
      } catch (error) {
        console.error("Error fetching complaint:", error);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchComplaint();
  }, [id]);

  useEffect(() => {
    const fetchStaffMembers = async () => {
      try {
        setStaffLoading(true);

        const response = await api.get("/auth/staff");

        if (response.data.success) {
          setStaffMembers(response.data.staffMembers || []);
        }
      } catch (error) {
        console.error("Error fetching staff members:", error);
        setStaffMembers([]);
      } finally {
        setStaffLoading(false);
      }
    };

    fetchStaffMembers();
  }, []);

  const handleAssignStaff = async () => {
    if(!selectedStaff){
      return;
    }
    try {
      const response = await api.patch(`/complaints/${id}/assign`,{
        staffId: selectedStaff,
      });
      if(response.data.success){
        alert("Complaint assigned Successfully");

        // refresh complaint details
        const updatedComplaint = await api.get(`/complaints/admin/${id}`);

        // Update complaint directly from response
        setComplaint((prev) => ({
        ...prev,
        status: response.data.complaint.status,
        assignedTo: response.data.complaint.assignedTo,
      }));

        // clear dropdown
        setSelectedStaff("");
      }
    } catch (error) {
      console.error("Error assigning complaint:",error);

      alert(
        error.response?.data?.message || "Failed to assign complaint");   
    }
  };

  const pageState = (content) => (
    <div className="min-h-screen bg-slate-100 text-slate-800">
      <div className="flex min-h-screen">
        <Sidebar />
        <main className="flex-1">
          <TopBar />
          <div className="flex min-h-[calc(100vh-89px)] items-center justify-center p-6">
            <section className="w-full max-w-lg rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
              {content}
            </section>
          </div>
        </main>
      </div>
    </div>
  );

  if (loading) {
    return pageState(
      <>
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full border-4 border-indigo-100 border-t-indigo-600" />
        <p className="mt-5 text-sm font-medium text-slate-600">Loading complaint...</p>
      </>
    );
  }

  if (error) {
    return pageState(
      <>
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-rose-100 text-xl text-rose-600">!</div>
        <h1 className="mt-5 text-xl font-bold text-slate-900">Unable to load complaint</h1>
        <p className="mt-2 text-sm text-slate-500">There was a problem retrieving this complaint. Please try again.</p>
        <button
          type="button"
          onClick={() => navigate("/admin/complaints")}
          className="mt-6 inline-flex items-center rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-500"
        >
          Back to Complaints
        </button>
      </>
    );
  }

  if (!complaint) {
    return pageState(
      <>
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-xl text-slate-500">?</div>
        <h1 className="mt-5 text-xl font-bold text-slate-900">Complaint not found</h1>
        <p className="mt-2 text-sm text-slate-500">The complaint may have been removed or the link may be incorrect.</p>
        <button
          type="button"
          onClick={() => navigate("/admin/complaints")}
          className="mt-6 inline-flex items-center rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-500"
        >
          Back to Complaints
        </button>
      </>
    );
  }

  const priority = formatText(complaint.priority);
  const status = formatText(complaint.status);
  const student = complaint.createdBy;
  const assignedStaff = complaint.assignedTo;

  return (
    <div className="min-h-screen bg-slate-100 text-slate-800">
      <div className="flex min-h-screen">
        <Sidebar />
        <main className="min-w-0 flex-1">
          <TopBar />
          <div className="space-y-6 p-4 sm:p-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <button
                  type="button"
                  onClick={() => navigate("/admin/complaints")}
                  className="mb-3 inline-flex items-center gap-2 text-sm font-semibold text-indigo-600 transition hover:text-indigo-500"
                >
                  <span aria-hidden="true">←</span> Back to Complaints
                </button>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-indigo-600">Complaint details</p>
                <h1 className="mt-2 max-w-3xl text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">{complaint.title}</h1>
                <p className="mt-2 break-all text-xs text-slate-500">ID: {complaint._id || id}</p>
              </div>
              <div className="flex gap-2 self-start sm:self-center">
                <span className={`rounded-full px-3 py-1.5 text-xs font-semibold ${priorityStyles[String(complaint.priority).toLowerCase()] || "bg-slate-100 text-slate-700"}`}>{priority}</span>
                <span className={`rounded-full px-3 py-1.5 text-xs font-semibold ${statusStyles[String(complaint.status).toLowerCase()] || "bg-slate-100 text-slate-700"}`}>{status}</span>
              </div>
            </div>

            <div className="grid gap-6 xl:grid-cols-[1.5fr_1fr]">
              <div className="space-y-6">
                <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
                  <h2 className="text-lg font-bold text-slate-900">Description</h2>
                  <p className="mt-4 whitespace-pre-wrap text-sm leading-7 text-slate-600">{complaint.description || "No description provided."}</p>
                </section>

                <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
                  <h2 className="text-lg font-bold text-slate-900">Complaint information</h2>
                  <dl className="mt-5 grid gap-5 sm:grid-cols-2">
                    <DetailItem label="Category" value={formatText(complaint.category)} />
                    <DetailItem label="Location" value={complaint.location} />
                    <DetailItem label="Created date" value={formatDate(complaint.createdAt)} />
                    <DetailItem label="Updated date" value={formatDate(complaint.updatedAt)} />
                  </dl>
                </section>
              </div>

              <div className="space-y-6">
                <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
                  <h2 className="text-lg font-bold text-slate-900">Submitted by</h2>
                  <dl className="mt-5 space-y-5">
                    <DetailItem label="Student name" value={student?.name} />
                    <DetailItem label="Student email" value={student?.email} />
                    <DetailItem label="Student phone" value={student?.phone} />
                  </dl>
                </section>

                <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
                  <h2 className="text-lg font-bold text-slate-900">Assigned staff</h2>
                  {assignedStaff ? (
                    <dl className="mt-5 space-y-5">
                      <DetailItem label="Staff name" value={assignedStaff.name} />
                      <DetailItem label="Staff email" value={assignedStaff.email} />
                      <DetailItem label="Staff phone" value={assignedStaff.phone} />
                    </dl>
                  ) : (
                    <p className="mt-5 rounded-xl bg-slate-50 px-4 py-3 text-sm font-medium text-slate-600">Not Assigned</p>
                  )}
                </section>

                <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
                  <h2 className="text-lg font-bold text-slate-900">Assign Staff</h2>
                  <p className="mt-1 text-sm text-slate-500">Choose a staff member for this complaint.</p>

                  {staffLoading ? (
                    <p className="mt-5 rounded-xl bg-slate-50 px-4 py-3 text-sm font-medium text-slate-600">Loading staff...</p>
                  ) : staffMembers.length === 0 ? (
                    <p className="mt-5 rounded-xl bg-slate-50 px-4 py-3 text-sm font-medium text-slate-600">No staff members available.</p>
                  ) : (
                    <div className="mt-5 space-y-4">
                      <label className="block">
                        <span className="sr-only">Select Staff Member</span>
                        <select
                          value={selectedStaff}
                          onChange={(event) => setSelectedStaff(event.target.value)}
                          className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-700 shadow-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                        >
                          <option value="">Select Staff Member</option>
                          {staffMembers.map((staffMember) => (
                            <option key={staffMember._id} value={staffMember._id}>
                              {staffMember.name}
                            </option>
                          ))}
                        </select>
                      </label>
                      <button
                        type="button"
                        disabled={!selectedStaff}
                        onClick={handleAssignStaff}
                        className="w-full rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-500 disabled:cursor-not-allowed disabled:bg-slate-200 disabled:text-slate-500"
                      >
                        Assign Staff
                      </button>
                    </div>
                  )}
                </section>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default ComplaintDetails;