import { Upload } from "lucide-react";
import { useState } from "react";
import { uploadResume } from "../services/api.js";
import StatusMessage from "./StatusMessage.jsx";

export default function ResumeUploadForm() {
  const [form, setForm] = useState({ full_name: "", email: "", phone: "", file: null });
  const [status, setStatus] = useState({ type: "", message: "" });
  const [loading, setLoading] = useState(false);

  function updateField(event) {
    const { name, value, files } = event.target;
    setForm((current) => ({ ...current, [name]: files ? files[0] : value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setLoading(true);
    setStatus({ type: "", message: "" });
    try {
      const result = await uploadResume(form);
      setStatus({ type: "success", message: `${result.message}. Resume ID: ${result.resume_id}` });
      setForm({ full_name: "", email: "", phone: "", file: null });
      event.target.reset();
    } catch (error) {
      setStatus({ type: "error", message: error.response?.data?.error || "Resume upload failed." });
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 rounded-md border border-slate-200 bg-white p-5 shadow-sm">
      <div className="grid gap-4 md:grid-cols-3">
        <label className="space-y-1">
          <span className="text-sm font-medium text-slate-700">Full name</span>
          <input required name="full_name" value={form.full_name} onChange={updateField} className="w-full rounded-md border border-slate-300 px-3 py-2" />
        </label>
        <label className="space-y-1">
          <span className="text-sm font-medium text-slate-700">Email</span>
          <input name="email" type="email" value={form.email} onChange={updateField} className="w-full rounded-md border border-slate-300 px-3 py-2" />
        </label>
        <label className="space-y-1">
          <span className="text-sm font-medium text-slate-700">Phone</span>
          <input name="phone" value={form.phone} onChange={updateField} className="w-full rounded-md border border-slate-300 px-3 py-2" />
        </label>
      </div>
      <label className="block space-y-1">
        <span className="text-sm font-medium text-slate-700">Resume file</span>
        <input required name="file" type="file" accept=".pdf,.docx" onChange={updateField} className="w-full rounded-md border border-slate-300 bg-white px-3 py-2" />
      </label>
      <div className="flex items-center gap-3">
        <button disabled={loading} className="inline-flex items-center gap-2 rounded-md bg-emerald-600 px-4 py-2 font-medium text-white hover:bg-emerald-700 disabled:opacity-60">
          <Upload size={18} />
          {loading ? "Processing..." : "Upload resume"}
        </button>
      </div>
      <StatusMessage type={status.type}>{status.message}</StatusMessage>
    </form>
  );
}
