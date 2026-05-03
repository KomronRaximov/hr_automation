import { NavLink, Route, Routes } from "react-router-dom";
import { BarChart3, Files, FileUp, Home, UserRoundSearch } from "lucide-react";
import CandidateDetail from "./pages/CandidateDetail.jsx";
import CVList from "./pages/CVList.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import JobDescription from "./pages/JobDescription.jsx";
import RankingResults from "./pages/RankingResults.jsx";
import UploadResume from "./pages/UploadResume.jsx";

function NavItem({ to, icon: Icon, children }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `inline-flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition ${
          isActive ? "bg-slate-900 text-white" : "text-slate-600 hover:bg-slate-100 hover:text-slate-950"
        }`
      }
    >
      <Icon size={18} />
      {children}
    </NavLink>
  );
}

export default function App() {
  return (
    <div className="min-h-screen">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-md bg-emerald-600 text-white">
              <UserRoundSearch size={22} />
            </div>
            <div>
              <h1 className="text-lg font-semibold tracking-normal">Resume Screening</h1>
              <p className="text-sm text-slate-500">AI candidate ranking prototype</p>
            </div>
          </div>
          <nav className="flex flex-wrap gap-2">
            <NavItem to="/" icon={Home}>Dashboard</NavItem>
            <NavItem to="/upload" icon={FileUp}>Upload</NavItem>
            <NavItem to="/cvs" icon={Files}>CVs</NavItem>
            <NavItem to="/jobs" icon={BarChart3}>Jobs</NavItem>
          </nav>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-4 py-6">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/upload" element={<UploadResume />} />
          <Route path="/cvs" element={<CVList />} />
          <Route path="/jobs" element={<JobDescription />} />
          <Route path="/rankings/:jobId" element={<RankingResults />} />
          <Route path="/candidates/:candidateId" element={<CandidateDetail />} />
        </Routes>
      </main>
    </div>
  );
}
