import { useState } from 'react';
import api from "../../services/api.js"

import Sidebar from '../../components/admin/Sidebar';
import TopBar from '../../components/admin/TopBar';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const statusOptions = ['All statuses', 'Pending', 'In Progress', 'Resolved', 'Rejected'];
const priorityOptions = ['All priorities', 'Low', 'Medium', 'High'];
const categoryOptions = ['All categories', "academic","classroom","laboratory","library","examination","fees","hostel","canteen","cleanliness","electricity","water","internet","transport","security","maintenance","sports","events","other"];

const FilterSelect = ({ label, value, onChange, options }) => (
  <label className="block min-w-0 flex-1">
    <span className="mb-2 block text-xs font-medium uppercase tracking-[0.18em] text-slate-500">
      {label}
    </span>
    <select
      value={value}
      onChange={onChange}
      className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-700 shadow-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
    >
      {options.map((option) => (
        <option key={option} value={option}>
          {option}
        </option>
      ))}
    </select>
  </label>
);

const Complaints = () => {
  const [complaints,setComplaints] = useState([]);
  const [loading,setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [status, setStatus] = useState('All statuses');
  const [priority, setPriority] = useState('All priorities');
  const [category, setCategory] = useState('All categories');
  const navigate = useNavigate();

  useEffect(() => {
  const fetchComplaints = async () => {
    try {
      setLoading(true);

      let url = '/complaints/all?pages=1&limit=10';

      // Status filter
      if(status !== "All statuses"){
        const statusValue = status
        .toLowerCase()
        .replace(" ","-");

        url += `&status=${statusValue}`
      }

      // Priority filter
      if(priority !== "All priorities"){
        const priorityValue = priority.toLowerCase();

        url += `&priority=${priorityValue}`;
      }

      // category filter
      if(category !== 'All categories'){

        url += `&category=${category}`;

      }

       // Search
      if (searchTerm.trim() !== "") {
        url += `&search=${encodeURIComponent(searchTerm.trim())}`;
      }

      const response = await api.get(url);

      console.log("Complaints response:", response.data);

      if (response.data.success) {
        setComplaints(response.data.complaints);
      }

    } catch (error) {
      console.error("Error fetching complaints:", error);
    } finally {
      setLoading(false);
    }
  };

  const timer =setTimeout(()=>{
    fetchComplaints();
  },500);

  return () => clearTimeout(timer);


  }, [status, priority, category, searchTerm]);

  return (
    <div className="min-h-screen bg-slate-100 text-slate-800">
      <div className="flex min-h-screen">
        <Sidebar />

        <main className="flex-1">
          <TopBar />

          <div className="space-y-6 p-6">
            <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-indigo-600">Operations</p>
                  <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900">Complaints</h1>
                  <p className="mt-2 text-sm text-slate-500">
                    Review and manage all submitted complaints across departments.
                  </p>
                </div>

                <button
                  type="button"
                  className="inline-flex items-center justify-center rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-500"
                >
                  Export Report
                </button>
              </div>
            </section>

            <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
              <div className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
                <label className="block w-full max-w-xl">
                  <span className="mb-2 block text-xs font-medium uppercase tracking-[0.18em] text-slate-500">
                    Search
                  </span>
                  <div className="relative">
                    <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                      ⌕
                    </span>
                    <input
                      type="text"
                      value={searchTerm}
                      onChange={(event) => setSearchTerm(event.target.value)}
                      placeholder="Search complaints"
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-4 text-sm text-slate-700 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                    />
                  </div>
                </label>

                <div className="grid w-full gap-3 md:grid-cols-3 xl:max-w-2xl">
                  <FilterSelect
                    label="Status"
                    value={status}
                    onChange={(event) => setStatus(event.target.value)}
                    options={statusOptions}
                  />
                  <FilterSelect
                    label="Priority"
                    value={priority}
                    onChange={(event) => setPriority(event.target.value)}
                    options={priorityOptions}
                  />
                  <FilterSelect
                    label="Category"
                    value={category}
                    onChange={(event) => setCategory(event.target.value)}
                    options={categoryOptions}
                  />
                </div>
              </div>
            </section>

            <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
              <div className="overflow-x-auto">
                <table className="min-w-full text-left text-sm">
                  <thead className="bg-slate-50">
                    <tr className="border-b border-slate-200 text-slate-600">
                      <th className="px-5 py-4 font-semibold">Complaint</th>
                      <th className="px-5 py-4 
                      font-semibold">Category</th>
                      <th className="px-5 py-4 font-semibold">Priority</th>
                      <th className="px-5 py-4 font-semibold">Status</th>
                      <th className="px-5 py-4 font-semibold">Assigned To</th>
                      <th className="px-5 py-4 font-semibold">Date</th>
                    </tr>
                  </thead>

                                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan={6} className="px-5 py-20 text-center text-slate-500">
                        Loading complaints...
                      </td>
                    </tr>
                  ) : complaints.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="px-5 py-20">
                        <div className="flex flex-col items-center justify-center text-center">
                          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-slate-100 text-2xl text-slate-400">
                            ◌
                          </div>

                          <p className="mt-4 text-lg font-semibold text-slate-700">
                            No complaints found
                          </p>

                          <p className="mt-1 text-sm text-slate-500">
                            There are currently no complaints to display.
                          </p>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    complaints.map((complaint) => (
                      <tr
                        key={complaint._id}
                        onClick={()=>navigate(`/admin/complaints/${complaint._id}`)}
                        className=" cursor-pointer border-b border-slate-100 last:border-b-0"
                        transition hover:bg-slate-50
                      >
                        {/* Complaint */}
                        <td className="px-5 py-4">
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
                        <td className="px-5 py-4 text-slate-600">
                          {complaint.category || "-"}
                        </td>

                        {/* Priority */}
                        <td className="px-5 py-4">
                          <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-700">
                            {complaint.priority || "-"}
                          </span>
                        </td>

                        {/* Status */}
                        <td className="px-5 py-4">
                          <span className="rounded-full bg-indigo-100 px-2.5 py-1 text-xs font-semibold text-indigo-700">
                            {complaint.status || "-"}
                          </span>
                        </td>

                        {/* Assigned To */}
                        <td className="px-5 py-4 text-slate-600">
                          {complaint.assignedTo?.name || "Unassigned"}
                        </td>

                        {/* Date */}
                        <td className="px-5 py-4 text-slate-600">
                          {complaint.createdAt
                            ? new Date(complaint.createdAt).toLocaleDateString("en-IN")
                            : "-"}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
                </table>
              </div>

              <div className="flex flex-col gap-3 border-t border-slate-200 bg-slate-50 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-sm text-slate-500">Showing 0 results</p>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-500 transition hover:border-slate-300 hover:text-slate-700 disabled:cursor-not-allowed disabled:opacity-50"
                    disabled
                  >
                    Previous
                  </button>
                  <span className="inline-flex min-w-20 items-center justify-center rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700">
                    Page 1
                  </span>
                  <button
                    type="button"
                    className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-500 transition hover:border-slate-300 hover:text-slate-700 disabled:cursor-not-allowed disabled:opacity-50"
                    disabled
                  >
                    Next
                  </button>
                </div>
              </div>
            </section>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Complaints;
