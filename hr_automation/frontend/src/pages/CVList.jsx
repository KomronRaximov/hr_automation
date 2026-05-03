import { Eye, FileText, RefreshCw, Upload } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import StatusMessage from "../components/StatusMessage.jsx";
import { listResumes } from "../services/api.js";

export default function CVList() {
  const [resumes, setResumes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function loadResumes() {
    setLoading(true);
    setError("");
    try {
      setResumes(await listResumes());
    } catch (err) {
      const networkMessage = err.code === "ERR_NETWORK" ? "Backend API is not reachable. Start Django on port 8000." : "";
      setError(networkMessage || "Could not load CVs.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadResumes();
  }, []);

  return (
    <section className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-semibold">CVs</h2>
          <p className="text-sm text-slate-600">Uploaded resumes available for job ranking.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button onClick={loadResumes} disabled={loading} className="inline-flex items-center gap-2 rounded-md border border-slate-300 bg-white px-4 py-2 font-medium hover:bg-slate-50 disabled:opacity-60">
            <RefreshCw size={18} />
            Refresh
          </button>
          <Link to="/upload" className="inline-flex items-center gap-2 rounded-md bg-emerald-600 px-4 py-2 font-medium text-white hover:bg-emerald-700">
            <Upload size={18} />
            Upload CV
          </Link>
        </div>
      </div>

      <StatusMessage type="error">{error}</StatusMessage>

      {loading && <div className="rounded-md border border-slate-200 bg-white p-5 text-slate-600">Loading CVs...</div>}

      {!loading && !resumes.length && (
        <div className="rounded-md border border-slate-200 bg-white p-6 text-slate-600">
          <p>No CVs uploaded yet.</p>
          <Link to="/upload" className="mt-4 inline-flex items-center gap-2 rounded-md bg-emerald-600 px-4 py-2 font-medium text-white hover:bg-emerald-700">
            <Upload size={18} />
            Upload first CV
          </Link>
        </div>
      )}

      {!loading && resumes.length > 0 && (
        <div className="rounded-md border border-slate-200 bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[760px] border-collapse text-left text-sm">
              <thead className="bg-slate-50 text-slate-600">
                <tr>
                  <th className="px-5 py-3">Candidate</th>
                  <th className="px-5 py-3">Contact</th>
                  <th className="px-5 py-3">File</th>
                  <th className="px-5 py-3">Uploaded</th>
                  <th className="px-5 py-3">Detail</th>
                </tr>
              </thead>
              <tbody>
                {resumes.map((resume) => (
                  <tr key={resume.resume_id} className="border-t border-slate-200">
                    <td className="px-5 py-3 font-medium">{resume.candidate_name}</td>
                    <td className="px-5 py-3 text-slate-600">{resume.email || resume.phone || "-"}</td>
                    <td className="px-5 py-3">
                      <span className="inline-flex max-w-[260px] items-center gap-2 truncate text-slate-700">
                        <FileText size={16} />
                        {resume.file_name}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-slate-600">{new Date(resume.uploaded_at).toLocaleString()}</td>
                    <td className="px-5 py-3">
                      <Link to={`/candidates/${resume.candidate_id}`} className="inline-flex items-center gap-2 rounded-md border border-slate-300 px-3 py-2 hover:bg-slate-50">
                        <Eye size={16} />
                        View
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </section>
  );
}
