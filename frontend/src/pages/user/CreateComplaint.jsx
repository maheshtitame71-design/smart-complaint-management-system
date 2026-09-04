import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../../components/user/Sidebar";
import TopBar from "../../components/user/TopBar";
import api from "../../services/api";

const CreateComplaint = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    priority: "medium",
    location: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");

    if (!formData.title.trim()) {
      setError("Please enter a complaint title.");
      return;
    }

    if (!formData.description.trim()) {
      setError("Please describe your complaint.");
      return;
    }

    if (!formData.category) {
      setError("Please select a complaint category.");
      return;
    }

    try {
      setLoading(true);

      const response = await api.post("/complaints", formData);

      if (response.data.success) {
        navigate("/user/dashboard");
      }
    } catch (error) {
      console.error("Create complaint error:", error);

      setError(
        error.response?.data?.message ||
          "Unable to submit complaint. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-50">

      {/* Sidebar */}
      <Sidebar />

      {/* Main */}
      <div className="flex min-w-0 flex-1 flex-col">

        <TopBar />

        <main className="flex-1 px-4 py-6 sm:px-6 lg:px-10">

          <div className="mx-auto max-w-5xl">

            {/* Header */}
            <div className="mb-8">

              <div className="mb-3 flex items-center gap-2 text-sm text-slate-500">
                <button
                  onClick={() => navigate("/user/dashboard")}
                  className="transition hover:text-indigo-600"
                >
                  Dashboard
                </button>

                <span>›</span>

                <span className="text-slate-700">
                  Create Complaint
                </span>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">

                <div>
                  <h1 className="text-3xl font-bold tracking-tight text-slate-900">
                    Submit a Complaint
                  </h1>

                  <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
                    Tell us about the issue you're facing. Your complaint
                    will be reviewed and handled by the appropriate department.
                  </p>
                </div>

                <div className="hidden rounded-xl border border-indigo-100 bg-indigo-50 px-4 py-3 sm:block">
                  <p className="text-xs font-medium text-indigo-500">
                    RESPONSE TIME
                  </p>

                  <p className="mt-1 text-sm font-semibold text-indigo-700">
                    Usually within 24–48 hours
                  </p>
                </div>

              </div>
            </div>


            {/* Error */}
            {error && (
              <div className="mb-6 flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 p-4">

                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-red-100 text-red-600">
                  !
                </div>

                <div>
                  <p className="text-sm font-semibold text-red-700">
                    Unable to submit complaint
                  </p>

                  <p className="mt-1 text-sm text-red-600">
                    {error}
                  </p>
                </div>

              </div>
            )}


            <form onSubmit={handleSubmit}>

              {/* Main Form Card */}
              <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">

                {/* Card Header */}
                <div className="border-b border-slate-100  from-indigo-50/80 to-white px-6 py-6 sm:px-8">

                  <div className="flex items-center gap-4">

                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-600 text-xl text-white shadow-lg shadow-indigo-200">
                      +
                    </div>

                    <div>
                      <h2 className="font-bold text-slate-900">
                        Complaint Information
                      </h2>

                      <p className="mt-1 text-sm text-slate-500">
                        Provide accurate details so we can resolve your issue faster.
                      </p>
                    </div>

                  </div>

                </div>


                <div className="space-y-8 p-6 sm:p-8">

                  {/* Basic Information */}
                  <section>

                    <div className="mb-5">
                      <h3 className="font-bold text-slate-900">
                        Basic Information
                      </h3>

                      <p className="mt-1 text-sm text-slate-500">
                        Give your complaint a clear title and description.
                      </p>
                    </div>


                    {/* Title */}
                    <div>
                      <label className="mb-2 block text-sm font-semibold text-slate-700">
                        Complaint Title
                        <span className="ml-1 text-red-500">*</span>
                      </label>

                      <input
                        type="text"
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                        maxLength={100}
                        placeholder="e.g. Wi-Fi not working in Computer Lab"
                        className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-sm text-slate-800 placeholder:text-slate-400 outline-none transition focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-50"
                      />

                      <div className="mt-2 flex justify-end">
                        <span className="text-xs text-slate-400">
                          {formData.title.length}/100
                        </span>
                      </div>
                    </div>


                    {/* Description */}
                    <div className="mt-6">

                      <label className="mb-2 block text-sm font-semibold text-slate-700">
                        Description
                        <span className="ml-1 text-red-500">*</span>
                      </label>

                      <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        maxLength={1000}
                        rows={7}
                        placeholder="Explain the problem in detail. Include relevant information such as when the issue started, what you experienced, and any other details that may help."
                        className="w-full resize-none rounded-xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-sm leading-6 text-slate-800 placeholder:text-slate-400 outline-none transition focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-50"
                      />

                      <div className="mt-2 flex justify-between">
                        <span className="text-xs text-slate-400">
                          Be as specific as possible.
                        </span>

                        <span className="text-xs text-slate-400">
                          {formData.description.length}/1000
                        </span>
                      </div>

                    </div>

                  </section>


                  {/* Classification */}
                  <section className="border-t border-slate-100 pt-8">

                    <div className="mb-5">
                      <h3 className="font-bold text-slate-900">
                        Classification
                      </h3>

                      <p className="mt-1 text-sm text-slate-500">
                        Help us route your complaint to the right team.
                      </p>
                    </div>


                    <div className="grid gap-6 md:grid-cols-2">

                      {/* Category */}
                      <div>

                        <label className="mb-2 block text-sm font-semibold text-slate-700">
                          Category
                          <span className="ml-1 text-red-500">*</span>
                        </label>

                        <select
                          name="category"
                          value={formData.category}
                          onChange={handleChange}
                          className="w-full appearance-none rounded-xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-sm text-slate-700 outline-none transition focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-50"
                        >

                          <option value="">
                            Select a category
                          </option>

                          <option value="academic">Academic</option>
                          <option value="classroom">Classroom</option>
                          <option value="laboratory">Laboratory</option>
                          <option value="library">Library</option>
                          <option value="examination">Examination</option>
                          <option value="fees">Fees</option>
                          <option value="hostel">Hostel</option>
                          <option value="canteen">Canteen</option>
                          <option value="cleanliness">Cleanliness</option>
                          <option value="electricity">Electricity</option>
                          <option value="water">Water</option>
                          <option value="internet">Internet</option>
                          <option value="transport">Transport</option>
                          <option value="security">Security</option>
                          <option value="maintenance">Maintenance</option>
                          <option value="sports">Sports</option>
                          <option value="events">Events</option>
                          <option value="other">Other</option>

                          
                        </select>

                      </div>


                      {/* Priority */}
                      <div>

                        <label className="mb-2 block text-sm font-semibold text-slate-700">
                          Priority
                        </label>

                        <div className="grid grid-cols-4 gap-2">

                          {["low", "medium", "high"].map(
                            (priority) => (
                              <button
                                key={priority}
                                type="button"
                                onClick={() =>
                                  setFormData((prev) => ({
                                    ...prev,
                                    priority,
                                  }))
                                }
                                className={`rounded-xl border px-2 py-3 text-xs font-semibold transition ${
                                  formData.priority === priority
                                    ? "border-indigo-500 bg-indigo-50 text-indigo-700 ring-2 ring-indigo-100"
                                    : "border-slate-200 bg-slate-50 text-slate-500 hover:border-slate-300 hover:bg-white"
                                }`}
                              >
                                {priority}
                              </button>
                            )
                          )}

                        </div>

                        <p className="mt-2 text-xs text-slate-400">
                          Select how urgently the issue needs attention.
                        </p>

                      </div>

                    </div>

                  </section>


                  {/* Location */}
                  <section className="border-t border-slate-100 pt-8">

                    <div className="mb-5">
                      <h3 className="font-bold text-slate-900">
                        Location
                      </h3>

                      <p className="mt-1 text-sm text-slate-500">
                        Where is the issue occurring?
                      </p>
                    </div>

                    <input
                      type="text"
                      name="location"
                      value={formData.location}
                      onChange={handleChange}
                      placeholder="e.g. Block A, Room 204 / Computer Lab"
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-sm text-slate-800 placeholder:text-slate-400 outline-none transition focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-50"
                    />

                  </section>


                  {/* Notice */}
                  <div className="rounded-2xl border border-amber-100 bg-amber-50 p-4">

                    <div className="flex gap-3">

                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-amber-100 text-amber-700">
                        i
                      </div>

                      <div>
                        <p className="text-sm font-semibold text-amber-800">
                          Before submitting
                        </p>

                        <p className="mt-1 text-sm leading-5 text-amber-700">
                          Please make sure the information provided is accurate.
                          You can track the status of your complaint from the
                          dashboard after submission.
                        </p>
                      </div>

                    </div>

                  </div>

                </div>


                {/* Footer */}
                <div className="flex flex-col-reverse gap-3 border-t border-slate-100 bg-slate-50/70 px-6 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-8">

                  <p className="text-xs text-slate-400">
                    <span className="text-red-500">*</span> Required fields
                  </p>

                  <div className="flex flex-col gap-3 sm:flex-row">

                    <button
                      type="button"
                      onClick={() => navigate("/user/dashboard")}
                      className="rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-600 transition hover:bg-slate-100"
                    >
                      Cancel
                    </button>

                    <button
                      type="submit"
                      disabled={loading}
                      className="rounded-xl bg-indigo-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-200 transition hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {loading ? "Submitting..." : "Submit Complaint"}
                    </button>

                  </div>

                </div>

              </div>

            </form>

          </div>

        </main>

      </div>

    </div>
  );
};

export default CreateComplaint;