import { useState, useEffect } from "react";
import "./App.css";

export default function App() {
  const [jobs, setJobs] = useState([]);
  const [company, setCompany] = useState("");
  const [role, setRole] = useState("");
  const [date, setDate] = useState("");
  const [filter, setFilter] = useState("All");

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("jobs")) || [];
    setJobs(saved);
  }, []);

  useEffect(() => {
    localStorage.setItem("jobs", JSON.stringify(jobs));
  }, [jobs]);

  const addJob = () => {
    if (!company || !role || !date) return;
    setJobs([
      ...jobs,
      { id: Date.now(), company, role, date, status: "Applied" },
    ]);
    setCompany("");
    setRole("");
    setDate("");
  };

  const updateStatus = (id, status) => {
    setJobs(jobs.map(j => j.id === id ? { ...j, status } : j));
  };

  const deleteJob = id => {
    setJobs(jobs.filter(j => j.id !== id));
  };

  const filteredJobs =
    filter === "All" ? jobs : jobs.filter(j => j.status === filter);

  return (
    <div className="container">
      <h1>Job Application Tracker</h1>

      <div className="form-row">
        <input placeholder="Company" value={company} onChange={e => setCompany(e.target.value)} />
        <input placeholder="Role" value={role} onChange={e => setRole(e.target.value)} />
        <input type="date" value={date} onChange={e => setDate(e.target.value)} />
        <button onClick={addJob}>Add</button>
      </div>

      <div className="top-row">
        <p>Total jobs: {jobs.length}</p>
        <select value={filter} onChange={e => setFilter(e.target.value)}>
          <option>All</option>
          <option>Applied</option>
          <option>Interview</option>
          <option>Offer</option>
          <option>Rejected</option>
        </select>
      </div>

      <div className="table-header">
        <span>Company</span>
        <span>Role</span>
        <span>Status</span>
        <span>Follow-up</span>
        <span>Action</span>
      </div>

      {filteredJobs.map(job => (
        <div className="job-row" key={job.id}>
          <span>{job.company}</span>
          <span>{job.role}</span>

          <select
            className={`status ${job.status.toLowerCase()}`}
            value={job.status}
            onChange={e => updateStatus(job.id, e.target.value)}
          >
            <option>Applied</option>
            <option>Interview</option>
            <option>Offer</option>
            <option>Rejected</option>
          </select>

          <span>{job.date}</span>
          <button className="delete" onClick={() => deleteJob(job.id)}>✕</button>
        </div>
      ))}
    </div>
  );
}
