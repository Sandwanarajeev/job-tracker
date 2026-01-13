import { useState, useEffect } from "react";

function App() {
  const [jobs, setJobs] = useState(() => {
    const saved = localStorage.getItem("jobs");
    return saved ? JSON.parse(saved) : [];
  });

  const [company, setCompany] = useState("");
  const [role, setRole] = useState("");
  const [followUp, setFollowUp] = useState("");
  const [filter, setFilter] = useState("All");
  const [theme, setTheme] = useState(() => localStorage.getItem("theme") || "dark");

  const isDark = theme === "dark";

  useEffect(() => {
    localStorage.setItem("jobs", JSON.stringify(jobs));
  }, [jobs]);

  useEffect(() => {
    localStorage.setItem("theme", theme);
  }, [theme]);

  function addJob() {
    if (!company || !role) return;
    setJobs([...jobs, { company, role, status: "Applied", followUp }]);
    setCompany("");
    setRole("");
    setFollowUp("");
  }

  const filteredJobs = filter === "All" ? jobs : jobs.filter(j => j.status === filter);

  return (
    <div className={isDark ? "page dark" : "page light"}>
      <style>{`
        body { margin:0; }

        .page {
          min-height:100vh;
          display:flex;
          justify-content:center;
          align-items:center;
          font-family:system-ui;
        }

        .dark { background:#0b1220; color:#f1f5f9; }
        .light { background:#eef2f7; color:#111; }

        .app { width:900px; }

        h1 { text-align:center; margin:15px 0 25px; }

        .card {
          padding:18px;
          border-radius:14px;
          background:#1e293b;
          box-shadow:0 15px 30px rgba(0,0,0,.3);
          margin-bottom:20px;
        }

        .light .card { background:white; }

        .form {
          display:grid;
          grid-template-columns:1fr 1fr 1fr auto;
          gap:10px;
        }

        input, select {
          height:42px;
          padding:0 12px;
          border-radius:10px;
          border:1px solid #334155;
          background:#0f172a;
          color:#f1f5f9;
        }

        .light input, .light select {
          background:white;
          color:#111;
          border:1px solid #ccc;
        }

        button {
          height:42px;
          padding:0 18px;
          border-radius:10px;
          border:none;
          background:#6366f1;
          color:white;
          cursor:pointer;
        }

        .theme-btn {
          background:transparent;
          border:1px solid currentColor;
          color:inherit;
          margin-bottom:15px;
        }

        .topbar {
          display:flex;
          justify-content:space-between;
          align-items:center;
          margin-bottom:10px;
        }

        .list {
          display:grid;
          gap:12px;
        }

        /* SAME GRID FOR HEADER AND ROWS */
        .row {
          display:grid;
          grid-template-columns:2fr 2fr 1.2fr 1.2fr auto;
          align-items:center;
          gap:12px;
          padding:14px 16px;
          border-radius:14px;
          background:#1e293b;
          border:1px solid #334155;
        }

        .light .row { background:white; border:1px solid #e5e7eb; }

        .header {
          background:transparent;
          border:none;
          font-weight:700;
          opacity:.7;
        }

        .status {
          height:32px;
          border-radius:20px;
          font-size:12px;
          font-weight:700;
          padding:0 10px;
          color:white;
          border:none;
        }

        .Applied { background:#2563eb; }
        .Interview { background:#d97706; }
        .Offer { background:#16a34a; }
        .Rejected { background:#dc2626; }

        .delete-btn {
          width:40px;
          height:40px;
          border-radius:12px;
          background:#4f46e5;
        }
      `}</style>

      <div className="app">
        <button className="theme-btn" onClick={() => setTheme(isDark ? "light" : "dark")}>
          {isDark ? "☀ Light" : "🌙 Dark"}
        </button>

        <h1>Job Application Tracker</h1>

        <div className="card">
          <div className="form">
            <input placeholder="Company" value={company} onChange={e => setCompany(e.target.value)} />
            <input placeholder="Role" value={role} onChange={e => setRole(e.target.value)} />
            <input type="date" value={followUp} onChange={e => setFollowUp(e.target.value)} />
            <button onClick={addJob}>Add</button>
          </div>
        </div>

        <div className="topbar">
          <p>Total jobs: {jobs.length}</p>
          <select value={filter} onChange={e => setFilter(e.target.value)}>
            <option>All</option>
            <option>Applied</option>
            <option>Interview</option>
            <option>Offer</option>
            <option>Rejected</option>
          </select>
        </div>

        <div className="list">
          {/* Header */}
          <div className="row header">
            <div>Company</div>
            <div>Role</div>
            <div>Status</div>
            <div>Follow-up</div>
            <div>Action</div>
          </div>

          {filteredJobs.map((job, index) => (
            <div className="row" key={index}>
              <div><strong>{job.company}</strong></div>
              <div>{job.role}</div>

              <select
                className={`status ${job.status}`}
                value={job.status}
                onChange={e => {
                  const updated = [...jobs];
                  updated[jobs.indexOf(filteredJobs[index])].status = e.target.value;
                  setJobs(updated);
                }}
              >
                <option>Applied</option>
                <option>Interview</option>
                <option>Offer</option>
                <option>Rejected</option>
              </select>

              <div>{job.followUp || "—"}</div>
              <button className="delete-btn" onClick={() => setJobs(jobs.filter(j => j !== filteredJobs[index]))}>✕</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;
