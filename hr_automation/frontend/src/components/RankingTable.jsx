import { Download, Eye } from "lucide-react";
import { Link } from "react-router-dom";

export default function RankingTable({ results }) {
  function downloadCsv() {
    const header = ["Rank", "Candidate", "Email", "Phone", "Match Score", "Resume ID", "Explanation"];
    const lines = results.map((row) => [
      row.rank,
      row.candidate_name,
      row.email || "",
      row.phone || "",
      row.match_score,
      row.resume_id,
      row.explanation,
    ]);
    const csv = [header, ...lines].map((line) => line.map((value) => `"${String(value).replaceAll('"', '""')}"`).join(",")).join("\n");
    const url = URL.createObjectURL(new Blob([csv], { type: "text/csv" }));
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = "candidate-ranking.csv";
    anchor.click();
    URL.revokeObjectURL(url);
  }

  if (!results.length) {
    return <div className="rounded-md border border-slate-200 bg-white p-5 text-slate-600">No processed resumes found yet.</div>;
  }

  return (
    <div className="rounded-md border border-slate-200 bg-white shadow-sm">
      <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
        <h2 className="text-base font-semibold">Candidate ranking</h2>
        <button onClick={downloadCsv} className="inline-flex items-center gap-2 rounded-md border border-slate-300 px-3 py-2 text-sm font-medium hover:bg-slate-50">
          <Download size={17} />
          CSV
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[760px] border-collapse text-left text-sm">
          <thead className="bg-slate-50 text-slate-600">
            <tr>
              <th className="px-5 py-3">Rank</th>
              <th className="px-5 py-3">Candidate</th>
              <th className="px-5 py-3">Contact</th>
              <th className="px-5 py-3">Score</th>
              <th className="px-5 py-3">Explanation</th>
              <th className="px-5 py-3">Detail</th>
            </tr>
          </thead>
          <tbody>
            {results.map((row) => (
              <tr key={row.resume_id} className="border-t border-slate-200">
                <td className="px-5 py-3 font-semibold">{row.rank}</td>
                <td className="px-5 py-3">{row.candidate_name}</td>
                <td className="px-5 py-3 text-slate-600">{row.email || row.phone || "-"}</td>
                <td className="px-5 py-3">
                  <span className="rounded-md bg-emerald-50 px-2 py-1 font-semibold text-emerald-700">{row.match_score}%</span>
                </td>
                <td className="px-5 py-3 text-slate-600">{row.explanation}</td>
                <td className="px-5 py-3">
                  <Link to={`/candidates/${row.candidate_id}`} className="inline-flex items-center gap-2 rounded-md border border-slate-300 px-3 py-2 hover:bg-slate-50">
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
  );
}
