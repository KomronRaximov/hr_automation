import ResumeUploadForm from "../components/ResumeUploadForm.jsx";

export default function UploadResume() {
  return (
    <section className="space-y-4">
      <div>
        <h2 className="text-xl font-semibold">Upload resume</h2>
        <p className="text-sm text-slate-600">Supported files: PDF and DOCX.</p>
      </div>
      <ResumeUploadForm />
    </section>
  );
}
