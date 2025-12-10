import { useEffect, useState } from "react";

const apiBase = (() => {
  const fromEnv = import.meta.env.VITE_API_BASE_URL;
  if (fromEnv) {
    return fromEnv.replace(/\/$/, "");
  }
  return "http://localhost:4000";
})();

function App() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [formState, setFormState] = useState({
    title: "",
    department: "",
    description: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const fetchJobs = async () => {
    setLoading(true);
    setLoadError("");
    try {
      const response = await fetch(`${apiBase}/api/jobs`);
      if (!response.ok) {
        throw new Error("Sorry, could not load jobs right now.");
      }
      const data = await response.json();
      setJobs(data);
    } catch (error) {
      console.error("Failed to fetch jobs:", error);
      setLoadError("Sorry, could not load jobs right now.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormState((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitError("");
    setSubmitting(true);

    try {
      const response = await fetch(`${apiBase}/api/jobs`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formState),
      });

      const payload = await response.json().catch(() => null);
      if (!response.ok) {
        throw new Error(payload?.message || "Failed to create job posting.");
      }

      setJobs((prev) => [payload, ...prev]);
      setFormState({ title: "", department: "", description: "" });
    } catch (error) {
      console.error("Failed to submit job:", error);
      setSubmitError(error.message || "Failed to create job posting.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <div className="mx-auto w-full max-w-6xl px-6 sm:px-10 lg:px-12 py-16">
        <header className="mb-12 space-y-3">
          <h1 className="text-4xl font-semibold text-slate-900 sm:text-5xl">
            Internal Job Board
          </h1>
        </header>

        <div className="flex flex-col gap-6">
          <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm lg:p-7">
            <h2 className="text-2xl font-semibold text-slate-900">
              Post a new job
            </h2>
            <form className="mt-4 space-y-4" onSubmit={handleSubmit}>
              <div className="space-y-1">
                <label
                  className="text-sm font-medium text-slate-800"
                  htmlFor="title"
                >
                  Title *
                </label>
                <input
                  id="title"
                  name="title"
                  value={formState.title}
                  onChange={handleChange}
                  required
                  maxLength={120}
                  placeholder="Senior Backend Engineer"
                  className="w-full rounded-lg border border-slate-200 bg-white px-3.5 py-2.5 text-base text-slate-900 shadow-sm transition focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100"
                />
              </div>

              <div className="space-y-1">
                <label
                  className="text-sm font-medium text-slate-800"
                  htmlFor="department"
                >
                  Department *
                </label>
                <input
                  id="department"
                  name="department"
                  value={formState.department}
                  onChange={handleChange}
                  required
                  maxLength={120}
                  placeholder="Platform Engineering"
                  className="w-full rounded-lg border border-slate-200 bg-white px-3.5 py-2.5 text-base text-slate-900 shadow-sm transition focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100"
                />
              </div>

              <div className="space-y-1">
                <label
                  className="text-sm font-medium text-slate-800"
                  htmlFor="description"
                >
                  Description
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={formState.description}
                  onChange={handleChange}
                  maxLength={1000}
                  placeholder="Share responsibilities, requirements, location, etc."
                  className="w-full min-h-[140px] rounded-lg border border-slate-200 bg-white px-3.5 py-2.5 text-base text-slate-900 shadow-sm transition focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100"
                />
              </div>

              {submitError ? (
                <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                  {submitError}
                </div>
              ) : null}

              <button
                type="submit"
                disabled={submitting}
                className="flex w-full items-center justify-center gap-2 rounded-lg bg-indigo-600 px-5 py-3 text-base font-semibold text-white transition hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-200 disabled:cursor-not-allowed disabled:opacity-70"
              >
                {submitting ? "Posting..." : "Submit job"}
              </button>
            </form>
          </section>

          <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm lg:p-7">
            <div className="flex items-center justify-between gap-3">
              <div>
                <h2 className="text-2xl font-semibold text-slate-900">
                  Open roles
                </h2>
                <p className="text-sm text-slate-600">
                  Sorted by newest first
                </p>
              </div>
              {loading && (
                <span className="text-sm text-slate-500">Loading...</span>
              )}
            </div>

            {loadError ? (
              <div className="mt-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {loadError}
              </div>
            ) : (
              <div className="mt-6 space-y-4">
                {!loading && jobs.length === 0 ? (
                  <p className="rounded-lg border border-dashed border-slate-200 bg-slate-50 px-5 py-8 text-base text-slate-600">
                    No jobs yet. Be the first to post a role.
                  </p>
                ) : (
                  jobs.map((job) => (
                    <article
                      key={job._id ?? job.id ?? `${job.title}-${job.createdAt}`}
                      className="rounded-lg border border-slate-200 bg-white px-5 py-4 shadow-sm"
                    >
                      <div className="flex flex-wrap items-start justify-between gap-2">
                        <div className="space-y-1">
                          <h3 className="text-lg font-semibold text-slate-900">
                            {job.title}
                          </h3>
                          <p className="text-base font-medium text-slate-700">
                            {job.department}
                          </p>
                        </div>
                        {job.createdAt ? (
                          <time className="text-xs uppercase tracking-wide text-slate-500">
                            {new Date(job.createdAt).toLocaleDateString()}
                          </time>
                        ) : null}
                      </div>
                      {job.description ? (
                        <p className="mt-3 whitespace-pre-line text-base text-slate-700">
                          {job.description}
                        </p>
                      ) : null}
                    </article>
                  ))
                )}
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}

export default App;
