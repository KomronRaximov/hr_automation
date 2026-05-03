import { Save } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createJob } from "../services/api.js";
import StatusMessage from "./StatusMessage.jsx";

export default function JobDescriptionForm() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ title: "", description: "", required_skills: "" });
  const [status, setStatus] = useState({ type: "", message: "" });
  const [loading, setLoading] = useState(false);

  function updateField(event) {
    setForm((current) => ({ ...current, [event.target.name]: event.target.value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setLoading(true);
    setStatus({ type: "", message: "" });
    try {
      const result = await createJob(form);
      setStatus({ type: "success", message: result.message });
      navigate(`/rankings/${result.job_id}`);
    } catch (error) {
      setStatus({ type: "error", message: error.response?.data?.error || "Job creation failed." });
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 rounded-md border border-slate-200 bg-white p-5 shadow-sm">
      <label className="block space-y-1">
        <span className="text-sm font-medium text-slate-700">Job title</span>
        <input required name="title" value={form.title} onChange={updateField} className="w-full rounded-md border border-slate-300 px-3 py-2" />
      </label>
      <label className="block space-y-1">
        <span className="text-sm font-medium text-slate-700">Description</span>
        <textarea required name="description" rows={7} value={form.description} onChange={updateField} className="w-full rounded-md border border-slate-300 px-3 py-2" />
      </label>
      <label className="block space-y-1">
        <span className="text-sm font-medium text-slate-700">Required skills</span>
        <input name="required_skills" value={form.required_skills} onChange={updateField} className="w-full rounded-md border border-slate-300 px-3 py-2" />
      </label>
      <button disabled={loading} className="inline-flex items-center gap-2 rounded-md bg-slate-900 px-4 py-2 font-medium text-white hover:bg-slate-800 disabled:opacity-60">
        <Save size={18} />
        {loading ? "Saving..." : "Save and rank"}
      </button>
      <StatusMessage type={status.type}>{status.message}</StatusMessage>
    </form>
  );
}
