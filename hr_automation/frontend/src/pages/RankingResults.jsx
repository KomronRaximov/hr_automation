import { RefreshCw, SearchCheck } from "lucide-react";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import RankingTable from "../components/RankingTable.jsx";
import StatusMessage from "../components/StatusMessage.jsx";
import { listResumes, matchJob } from "../services/api.js";

export default function RankingResults() {
  const { jobId } = useParams();
  const [resumes, setResumes] = useState([]);
  const [selectedResumeIds, setSelectedResumeIds] = useState([]);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingResumes, setLoadingResumes] = useState(true);
  const [hasCalculated, setHasCalculated] = useState(false);
  const [error, setError] = useState("");

  async function loadResults() {
    if (!selectedResumeIds.length) {
      setError("Select at least one resume to rank.");
      setResults([]);
      return;
    }

    setLoading(true);
    setError("");
    try {
      setResults(await matchJob(jobId, selectedResumeIds));
      setHasCalculated(true);
    } catch (err) {
      const serverMessage = err.response?.data?.error || err.response?.data?.detail;
      const status = err.response?.status;
      const networkMessage = err.code === "ERR_NETWORK" ? "Backend API is not reachable. Start Django on port 8000." : "";
      setError(serverMessage || networkMessage || `Could not calculate ranking${status ? ` (HTTP ${status})` : ""}.`);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    setLoadingResumes(true);
    listResumes()
      .then((items) => {
        setResumes(items);
        setSelectedResumeIds(items.map((resume) => resume.resume_id));
      })
      .catch(() => setError("Could not load uploaded resumes."))
      .finally(() => setLoadingResumes(false));
  }, [jobId]);

  function toggleResume(resumeId) {
    setSelectedResumeIds((current) =>
      current.includes(resumeId) ? current.filter((id) => id !== resumeId) : [...current, resumeId],
    );
  }

  function toggleAll() {
    setSelectedResumeIds((current) => (current.length === resumes.length ? [] : resumes.map((resume) => resume.resume_id)));
  }

  return (
    <section className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-semibold">Ranking results</h2>
          <p className="text-sm text-slate-600">Job ID: {jobId}</p>
        </div>
        <button onClick={loadResults} disabled={loading} className="inline-flex items-center gap-2 rounded-md border border-slate-300 bg-white px-4 py-2 font-medium hover:bg-slate-50 disabled:opacity-60">
          {loading ? <RefreshCw size={18} /> : <SearchCheck size={18} />}
          {loading ? "Ranking..." : "Calculate ranking"}
        </button>
      </div>
      <div className="rounded-md border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h3 className="font-semibold">Select resumes</h3>
            <p className="text-sm text-slate-600">{selectedResumeIds.length} of {resumes.length} selected</p>
          </div>
          <button type="button" onClick={toggleAll} disabled={!resumes.length} className="rounded-md border border-slate-300 px-3 py-2 text-sm font-medium hover:bg-slate-50 disabled:opacity-60">
            {selectedResumeIds.length === resumes.length ? "Clear all" : "Select all"}
          </button>
        </div>
        <div className="mt-4 grid gap-3 md:grid-cols-2">
          {loadingResumes && <p className="text-sm text-slate-600">Loading resumes...</p>}
          {!loadingResumes && !resumes.length && <p className="text-sm text-slate-600">No uploaded resumes yet.</p>}
          {resumes.map((resume) => (
            <label key={resume.resume_id} className="flex cursor-pointer items-start gap-3 rounded-md border border-slate-200 p-3 hover:bg-slate-50">
              <input
                type="checkbox"
                checked={selectedResumeIds.includes(resume.resume_id)}
                onChange={() => toggleResume(resume.resume_id)}
                className="mt-1 h-4 w-4"
              />
              <span className="min-w-0">
                <span className="block font-medium">{resume.candidate_name}</span>
                <span className="block truncate text-sm text-slate-600">{resume.file_name}</span>
                <span className="block text-xs text-slate-500">{resume.email || resume.phone || "No contact"}</span>
              </span>
            </label>
          ))}
        </div>
      </div>
      <StatusMessage type="error">{error}</StatusMessage>
      {loading && <div className="rounded-md border border-slate-200 bg-white p-5 text-slate-600">Calculating semantic matches...</div>}
      {!loading && hasCalculated && <RankingTable results={results} />}
    </section>
  );
}
