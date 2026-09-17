import { useEffect, useState } from 'react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';
const statuses = ['all', 'pending', 'running', 'completed', 'failed'];

function App() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [form, setForm] = useState({ id: '', title: '', type: '' });
  const [filter, setFilter] = useState('all');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadJobs();
  }, []);

  async function loadJobs() {
    setLoading(true);
    setError('');

    try {
      const response = await fetch(`${API_URL}/jobs`);
      if (!response.ok) {
        throw new Error('Failed to load jobs.');
      }
      const data = await response.json();
      const normalizedJobs = Array.isArray(data)
        ? data.map((job) => ({
            ...job,
            id: job.id ?? job.jobId ?? job.job_id ?? 'N/A',
          }))
        : [];
      setJobs(normalizedJobs);
    } catch (err) {
      setJobs([]);
      setError(err.message || 'Failed to load jobs.');
    } finally {
      setLoading(false);
    }
  }

  async function createJob(event) {
    event.preventDefault();
    if (!form.id.trim() || !form.title.trim() || !form.type.trim()) {
      setError('Job ID, title and type are required.');
      return;
    }

    setSaving(true);
    setError('');

    try {
      const response = await fetch(`${API_URL}/jobs`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: form.id,
          title: form.title,
          type: form.type,
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Failed to create job.');
      }

      setForm({ id: '', title: '', type: '' });
      loadJobs();
    } catch (err) {
      setError(err.message || 'Failed to create job.');
    } finally {
      setSaving(false);
    }
  }

  async function updateJobStatus(id, status) {
    setSaving(true);
    setError('');

    try {
      const response = await fetch(`${API_URL}/jobs/${id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Failed to update job.');
      }

      loadJobs();
    } catch (err) {
      setError(err.message || 'Failed to update job.');
    } finally {
      setSaving(false);
    }
  }

  async function deleteJob(id) {
    setSaving(true);
    setError('');

    try {
      const response = await fetch(`${API_URL}/jobs/${id}`, {
        method: 'DELETE',
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Failed to delete job.');
      }

      loadJobs();
    } catch (err) {
      setError(err.message || 'Failed to delete job.');
    } finally {
      setSaving(false);
    }
  }

  const filteredJobs = filter === 'all' ? jobs : jobs.filter((job) => job.status === filter);

  const counts = {
    pending: jobs.filter((job) => job.status === 'pending').length,
    running: jobs.filter((job) => job.status === 'running').length,
    completed: jobs.filter((job) => job.status === 'completed').length,
    failed: jobs.filter((job) => job.status === 'failed').length,
  };

  return (
    <div className="app-shell">
      <div className="container">
        <header className="header">
          <h1>Job Queue Dashboard</h1>
          
        </header>

        <section className="status-cards">
          <div className="status-card pending"><span>Pending</span><strong>{counts.pending}</strong></div>
          <div className="status-card running"><span>Running</span><strong>{counts.running}</strong></div>
          <div className="status-card completed"><span>Completed</span><strong>{counts.completed}</strong></div>
          <div className="status-card failed"><span>Failed</span><strong>{counts.failed}</strong></div>
        </section>

        <section className="panel">
          <h2>Create Job</h2>
          <form className="job-form" onSubmit={createJob}>
            <div className="field">
              <label htmlFor="jobId">Job ID</label>
              <input
                id="jobId"
                value={form.id}
                onChange={(event) => setForm({ ...form, id: event.target.value })}
                placeholder="JOB-001"
              />
            </div>
            <div className="field">
              <label htmlFor="title">Title</label>
              <input
                id="title"
                value={form.title}
                onChange={(event) => setForm({ ...form, title: event.target.value })}
                placeholder="Enter the title of Job"
              />
            </div>
            <div className="field">
              <label htmlFor="type">Type</label>
              <input
                id="type"
                value={form.type}
                onChange={(event) => setForm({ ...form, type: event.target.value })}
                placeholder="Enter the type of job"
              />
            </div>
            <button type="submit" className="primary" disabled={saving}>
              {saving ? 'Creating...' : 'Create Job'}
            </button>
          </form>
        </section>

        <section className="panel">
          <div className="toolbar">
            <h2>Jobs</h2>
            <select value={filter} onChange={(event) => setFilter(event.target.value)}>
              {statuses.map((status) => (
                <option key={status} value={status}>
                  {status === 'all' ? 'All' : status.charAt(0).toUpperCase() + status.slice(1)}
                </option>
              ))}
            </select>
          </div>

          {error && !loading && !jobs.length && filter === 'all' ? (
            <div className="error-box">{error}</div>
          ) : null}

          {loading ? (
            <p>Loading jobs...</p>
          ) : filteredJobs.length === 0 ? (
            <p>No jobs available.</p>
          ) : (
            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>Job ID</th>
                    <th>Title</th>
                    <th>Type</th>
                    <th>Status</th>
                    <th>Created At</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredJobs.map((job) => {
                    const jobId = job.id ?? job.jobId ?? job.job_id ?? 'N/A';

                    return (
                      <tr key={jobId}>
                        <td>{jobId}</td>
                        <td>{job.title}</td>
                        <td>{job.type}</td>
                      <td>
                        <span className={`badge ${job.status}`}>{job.status}</span>
                      </td>
                      <td>{new Date(job.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}</td>
                      <td className="action-cell">
                        {job.status === 'pending' && (
                          <>
                            <button onClick={() => updateJobStatus(jobId, 'running')} disabled={saving}>Start</button>
                            <button onClick={() => updateJobStatus(jobId, 'failed')} className="warning" disabled={saving}>Fail</button>
                          </>
                        )}
                        {job.status === 'running' && (
                          <>
                            <button onClick={() => updateJobStatus(jobId, 'completed')} disabled={saving}>Complete</button>
                            <button onClick={() => updateJobStatus(jobId, 'failed')} className="warning" disabled={saving}>Fail</button>
                          </>
                        )}
                        {(job.status === 'completed' || job.status === 'failed') && <></>}
                        <button onClick={() => deleteJob(jobId)} className="danger" disabled={saving}>Delete</button>
                      </td>
                    </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

export default App;
