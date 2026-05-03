import { Play } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import JobDescriptionForm from "../components/JobDescriptionForm.jsx";
import { listJobs } from "../services/api.js";

export default function JobDescription() {
  const [jobs, setJobs] = useState([]);

  useEffect(() => {
    listJobs().then(setJobs).catch(() => setJobs([]));
  }, []);

  return (
    <section className="grid gap-5 lg:grid-cols-[1fr_360px]">
      <div className="space-y-4">
        <div>
          <h2 className="text-xl font-semibold">Job description</h2>
          <p className="text-sm text-slate-600">Create a job and immediately generate candidate rankings.</p>
        </div>
        <JobDescriptionForm />
      </div>
      <aside className="rounded-md border border-slate-200 bg-white p-5 shadow-sm">
        <h3 className="font-semibold">Recent jobs</h3>
        <div className="mt-4 space-y-3">
          {jobs.map((job) => (
            <div key={job.job_id} className="rounded-md border border-slate-200 p-3">
              <p className="font-medium">{job.title}</p>
              <p className="mt-1 line-clamp-2 text-sm text-slate-600">{job.description}</p>
              <Link to={`/rankings/${job.job_id}`} className="mt-3 inline-flex items-center gap-2 rounded-md border border-slate-300 px-3 py-2 text-sm hover:bg-slate-50">
                <Play size={15} />
                Rank
              </Link>
            </div>
          ))}
          {!jobs.length && <p className="text-sm text-slate-500">No jobs yet.</p>}
        </div>
      </aside>
    </section>
  );
}
