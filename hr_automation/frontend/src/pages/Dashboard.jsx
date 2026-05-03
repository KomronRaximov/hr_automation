import { Link } from "react-router-dom";
import { BriefcaseBusiness, FileUp } from "lucide-react";

export default function Dashboard() {
  return (
    <section className="grid gap-5 md:grid-cols-[1.2fr_0.8fr]">
      <div className="rounded-md border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-2xl font-semibold tracking-normal">AI-based Resume Screening and Ranking</h2>
        <p className="mt-3 max-w-2xl text-slate-600">
          Upload PDF or DOCX resumes, create a job description, and rank candidates by semantic match score.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link to="/upload" className="inline-flex items-center gap-2 rounded-md bg-emerald-600 px-4 py-2 font-medium text-white hover:bg-emerald-700">
            <FileUp size={18} />
            Upload resumes
          </Link>
          <Link to="/jobs" className="inline-flex items-center gap-2 rounded-md border border-slate-300 px-4 py-2 font-medium hover:bg-slate-50">
            <BriefcaseBusiness size={18} />
            Create job
          </Link>
        </div>
      </div>
      <div className="rounded-md border border-slate-200 bg-white p-6 shadow-sm">
        <h3 className="font-semibold">Pipeline</h3>
        <ol className="mt-4 space-y-3 text-sm text-slate-600">
          <li>1. Extract resume text</li>
          <li>2. Generate embeddings</li>
          <li>3. Compare with job description</li>
          <li>4. Return ranked candidates</li>
        </ol>
      </div>
    </section>
  );
}
