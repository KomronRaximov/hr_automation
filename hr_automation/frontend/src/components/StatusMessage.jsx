export default function StatusMessage({ type = "info", children }) {
  const classes = {
    info: "border-sky-200 bg-sky-50 text-sky-800",
    success: "border-emerald-200 bg-emerald-50 text-emerald-800",
    error: "border-red-200 bg-red-50 text-red-800",
  };

  if (!children) return null;
  return <div className={`rounded-md border px-4 py-3 text-sm ${classes[type]}`}>{children}</div>;
}
