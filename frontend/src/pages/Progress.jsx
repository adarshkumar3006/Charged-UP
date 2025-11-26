import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";
import Navbar from "../components/Navbar";
import "./Progress.css";

const Progress = () => {
  const [logs, setLogs] = useState([]);
  const [stats, setStats] = useState(null);
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split("T")[0],
    weight: "",
    notes: "",
    workoutCompleted: false,
  });
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetchProgress();
  }, []);

  const fetchProgress = async () => {
    try {
      const [logsRes, statsRes] = await Promise.all([
        axios.get("/api/progress"),
        axios.get("/api/progress/stats"),
      ]);
      setLogs(logsRes.data);
      setStats(statsRes.data);
    } catch (error) {
      console.error("Fetch progress error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setMessage("");

    try {
      await axios.post("/api/progress", formData);
      setMessage("Progress logged successfully!");
      setFormData({
        date: new Date().toISOString().split("T")[0],
        weight: "",
        notes: "",
        workoutCompleted: false,
      });
      fetchProgress();
    } catch (error) {
      setMessage(error.response?.data?.message || "Failed to log progress");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this entry?")) {
      try {
        await axios.delete(`/api/progress/${id}`);
        fetchProgress();
      } catch (error) {
        console.error("Delete error:", error);
      }
    }
  };

  const chartData = logs
    .slice()
    .reverse()
    .slice(0, 30)
    .map((log) => ({
      date: new Date(log.date).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      }),
      weight: log.weight,
    }));

  const weeklyWorkouts =
    stats?.recentLogs?.filter((log) => log.workoutCompleted) || [];
  const workoutData = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (6 - i));
    const dayLogs = weeklyWorkouts.filter((log) => {
      const logDate = new Date(log.date);
      return logDate.toDateString() === date.toDateString();
    });
    return {
      day: date.toLocaleDateString("en-US", { weekday: "short" }),
      workouts: dayLogs.length,
    };
  });

  if (loading) {
    return (
      <div className="progress-page">
        <Navbar />
        <div className="container">
          <div className="spinner"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="progress-page">
      <Navbar />
      <div className="container">
        <div className="progress-header">
          <h1>Progress Tracking</h1>
          <p>Monitor your fitness journey</p>
        </div>

        {message && (
          <div
            className={
              message.includes("success") ? "success-message" : "error-message"
            }
          >
            {message}
          </div>
        )}

        <div className="progress-grid">
          <div className="progress-card">
            <h2>Add Progress Entry</h2>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Date</label>
                <input
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Weight (kg)</label>
                <input
                  type="number"
                  name="weight"
                  value={formData.weight}
                  onChange={handleChange}
                  required
                  min="30"
                  max="300"
                  step="0.1"
                  placeholder="Enter your weight"
                />
              </div>
              <div className="form-group">
                <label>Notes (Optional)</label>
                <textarea
                  name="notes"
                  value={formData.notes}
                  onChange={handleChange}
                  rows="3"
                  placeholder="Any notes about today?"
                />
              </div>
              <div className="form-group">
                <label>
                  <input
                    type="checkbox"
                    name="workoutCompleted"
                    checked={formData.workoutCompleted}
                    onChange={handleChange}
                  />
                  Workout completed today
                </label>
              </div>
              <button
                type="submit"
                className="btn btn-primary"
                disabled={submitting}
              >
                {submitting ? "Logging..." : "Log Progress"}
              </button>
            </form>
          </div>

          <div className="progress-card">
            <h2>Statistics</h2>
            {stats ? (
              <div className="stats-grid">
                <div className="stat-item">
                  <span className="stat-label">Latest Weight</span>
                  <span className="stat-value">
                    {stats.latestWeight ? `${stats.latestWeight} kg` : "N/A"}
                  </span>
                </div>
                {stats.weightChange !== 0 && (
                  <div className="stat-item">
                    <span className="stat-label">Weight Change</span>
                    <span
                      className={`stat-value ${
                        stats.weightChange > 0 ? "positive" : "negative"
                      }`}
                    >
                      {stats.weightChange > 0 ? "+" : ""}
                      {stats.weightChange} kg
                    </span>
                  </div>
                )}
                <div className="stat-item">
                  <span className="stat-label">Total Entries</span>
                  <span className="stat-value">{stats.totalEntries}</span>
                </div>
                <div className="stat-item">
                  <span className="stat-label">Workouts (Last 7 Days)</span>
                  <span className="stat-value">{stats.workoutsLast7Days}</span>
                </div>
              </div>
            ) : (
              <p>No statistics available</p>
            )}
          </div>
        </div>

        {chartData.length > 0 && (
          <div className="progress-card">
            <h2>Weight Trend (Last 30 Days)</h2>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#2a2a2a" />
                <XAxis dataKey="date" stroke="#ccc" />
                <YAxis stroke="#ccc" />
                <Tooltip
                  contentStyle={{
                    background: "#1a1a1a",
                    border: "1px solid #2a2a2a",
                    color: "#fff",
                  }}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="weight"
                  stroke="#667eea"
                  strokeWidth={2}
                  dot={{ fill: "#667eea" }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}

        {workoutData.length > 0 && (
          <div className="progress-card">
            <h2>Workouts This Week</h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={workoutData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#2a2a2a" />
                <XAxis dataKey="day" stroke="#ccc" />
                <YAxis stroke="#ccc" />
                <Tooltip
                  contentStyle={{
                    background: "#1a1a1a",
                    border: "1px solid #2a2a2a",
                    color: "#fff",
                  }}
                />
                <Bar dataKey="workouts" fill="#667eea" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}

        <div className="progress-card">
          <h2>Recent Entries</h2>
          {logs.length > 0 ? (
            <div className="logs-list">
              {logs.slice(0, 10).map((log) => (
                <div key={log._id} className="log-item">
                  <div className="log-date">
                    {new Date(log.date).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </div>
                  <div className="log-weight">{log.weight} kg</div>
                  {log.workoutCompleted && (
                    <span className="workout-badge">✓ Workout</span>
                  )}
                  {log.notes && <div className="log-notes">{log.notes}</div>}
                  <button
                    onClick={() => handleDelete(log._id)}
                    className="btn-delete"
                  >
                    Delete
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <p>No progress entries yet. Start logging your progress!</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Progress;
