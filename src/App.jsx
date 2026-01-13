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
  const [notification, setNotification] = useState("");
  const [theme, setTheme] = useState(
    () => localStorage.getItem("theme") || "light"
  );

  const isDark = theme === "dark";

  useEffect(() => {
    localStorage.setItem("jobs", JSON.stringify(jobs));
  }, [jobs]);

  useEffect(() => {
    localStorage.setItem("theme", theme);
  }, [theme]);

  useEffect(() => {
    const today = new Date().toLocaleDateString("en-CA");
    const dueToday = jobs.filter(j => j.followUp === today);
    if (dueToday.length > 0) {
      setNotification("Follow-up today: " + dueToday.map(j => j.company).join(", "));
      setTimeout(() => setNotification(""), 5000);
    }
  }, []);

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

        .light { background:#eef2f7; color:#111; }
        .dark { background:#0f172a; color:#f1f5f9; }

        .app { width:900px; }

        h1 { text-align:center; margin-bottom:20px; }

        .card {
          padding:20px;
          border-radius:12px;
          box-shadow:0 10px 20px rgba(0,0,0,.15);
          margin-bottom:20px;
        }

        .light .card { background:white; }
        .dark .card { background:#1e293b; }

        .form {
          display:grid;
          grid-template-columns:1fr 1fr 1fr auto;
          gap:10px;
        }

        input, select {
          padding:10px;
          border-radius:8px;
          border:1px solid #ccc;
        }

        .dark input, .dark select {
          background:#0f172a;
          color:#f1f5f9;
          border:1px solid #334155;
        }

        button {
          padding:10px 14px;
          border-radius:8px;
          border:none;
          background:#4f46e5;
          color:white;
          cursor:pointer;
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
          margin-top:20px;
        }

        .job {
          display:grid;
          grid-template-columns:2fr 2fr 1fr 1fr auto;
          gap:10px;
          align-items:center;
          padding:16px;
          border-radius:10px;
          border:1px solid #e5e7eb;
        }

        .dark .job {
          border:1px solid #334155;
          background:#1e293b;
        }

        .light .job {
          background:white;
        }

        .badge {
          padding:4px 12px;
          border-radius:20px;
          font-size:12px;
          color:white;
          text-align:center;
        }

        .Applied { background:#2563eb; }
        .Interview { background:#d97706; }
        .Offer { background:#16a34a; }
        .Rejected { background:#dc2626; }

        .notify {
          background:#fde68a;
          color:#111;
          padding:10px;
          border-radius:10px;
          margin-bottom:15px;
          font-weight:600;
        }

        .dark .notify {
          background:#facc15;
          color:#000;
        }

        .theme-btn {
          background:transparent;
          border:1px solid currentColor;
          color:inherit;
          margin-bottom:15px;
        }
      `}</style>

      <div className="app">
        <button className="theme-btn" onClick={() => setTheme(isDark ? "light" : "dark")}>
          {isDark ? "☀️ Light Mode" : "🌙 Dark Mode"}
        </button>

        {notification && <div className="notify">🔔 {notification}</div>}

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
          {filteredJobs.map((job, index) => (
            <div className="job" key={index}>
              <div><strong>{job.company}</strong></div>
              <div>{job.role}</div>
              <div className={`badge ${job.status}`}>{job.status}</div>
              <div>{job.followUp || "No date"}</div>
              <button onClick={() => setJobs(jobs.filter(j => j !== filteredJobs[index]))}>✕</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;
