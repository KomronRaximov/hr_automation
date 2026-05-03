import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import StatusMessage from "../components/StatusMessage.jsx";
import { getCandidate } from "../services/api.js";

export default function CandidateDetail() {
  const { candidateId } = useParams();
  const [candidate, setCandidate] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    getCandidate(candidateId)
      .then(setCandidate)
      .catch(() => setError("Candidate not found."));
  }, [candidateId]);

  if (error) return <StatusMessage type="error">{error}</StatusMessage>;
  if (!candidate) return <div className="rounded-md border border-slate-200 bg-white p-5 text-slate-600">Loading candidate...</div>;

  return (
    <section className="space-y-4">
      <div className="rounded-md border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="text-xl font-semibold">{candidate.full_name}</h2>
        <p className="mt-1 text-sm text-slate-600">{candidate.email || "No email"} · {candidate.phone || "No phone"}</p>
      </div>
      {candidate.resumes.map((resume) => (
        <article key={resume.resume_id} className="rounded-md border border-slate-200 bg-white p-5 shadow-sm">
          <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
            <h3 className="font-semibold">Resume #{resume.resume_id}</h3>
            <span className="text-sm text-slate-500">{new Date(resume.uploaded_at).toLocaleString()}</span>
          </div>
          <pre className="max-h-[520px] overflow-auto whitespace-pre-wrap rounded-md bg-slate-50 p-4 text-sm text-slate-700">{resume.extracted_text}</pre>
        </article>
      ))}
    </section>
  );
}
