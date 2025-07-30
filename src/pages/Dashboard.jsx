// src/pages/Dashboard.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import "../styles/Dashboard.css";

const Dashboard = () => {
  const navigate = useNavigate();

  const [subjects, setSubjects] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [streams, setStreams] = useState([]);
  const [selectedStream, setSelectedStream] = useState(null);
  const [careers, setCareers] = useState([]);
  const [loading, setLoading] = useState(true);

  const tenthJobs = ["Delivery Executive", "Data Entry Operator", "Security Guard"];
  const interJobs = ["Police Constable", "Army Soldier", "Clerk", "Technician Apprentice"];
  const degreeJobs = ["Software Developer", "Bank PO", "UPSC Aspirant", "Marketing Executive"];

  const storedUser = JSON.parse(localStorage.getItem("skillcraft_user"));
  const token = storedUser?.token;

  const API_BASE = import.meta.env.VITE_API_BASE_URL;

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("skillcraft_user"));
    if (!user || user.role !== "user") {
      navigate("/login");
    }
  }, [navigate]);

  useEffect(() => {
    fetch(`${API_BASE}/admin-career/subjects`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        setSubjects(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching subjects:", err);
        setLoading(false);
        if (err?.status === 401) navigate("/login");
      });
  }, [token, navigate]);

  const handleSubjectClick = (subject) => {
    setSelectedSubject(subject);
    setSelectedStream(null);
    setCareers([]);
    setStreams([]);

    fetch(`${API_BASE}/admin-career/streams/${subject._id}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => setStreams(data || []))
      .catch((err) => {
        console.error("Error fetching streams:", err);
        setStreams([]);
      });
  };

  const handleStreamClick = (stream) => {
    setSelectedStream(stream);
    setCareers([]);

    fetch(`${API_BASE}/admin-career/careers/${stream._id}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        console.log("Fetched careers:", data);
        setCareers(data || []);
      })
      .catch((err) => {
        console.error("Error fetching careers:", err);
        setCareers([]);
      });
  };

  return (
    <>
      <Navbar />
      <div className="dashboard-container">
        <h2 className="page-title">✨ Explore Your Career Path ✨</h2>

        {loading ? (
          <p className="loading-text">Loading subjects...</p>
        ) : (
          <div className="section">
            <h3>Step 1: Choose Your Subject</h3>
            <div className="card-container">
              {subjects.map((subj) => (
                <div
                  key={subj._id}
                  className={`card ${selectedSubject?._id === subj._id ? "active" : ""}`}
                  onClick={() => handleSubjectClick(subj)}
                >
                  {subj.name}
                </div>
              ))}
            </div>
          </div>
        )}

        {selectedSubject && (
          <div className="section">
            <h3>Step 2: Select a Stream from {selectedSubject.name}</h3>
            {streams.length > 0 ? (
              <div className="card-container">
                {streams.map((stream) => (
                  <div
                    key={stream._id}
                    className={`card ${selectedStream?._id === stream._id ? "active" : ""}`}
                    onClick={() => handleStreamClick(stream)}
                  >
                    {stream.name}
                  </div>
                ))}
              </div>
            ) : (
              <p className="loading-text">No streams available for this subject.</p>
            )}
          </div>
        )}

        {selectedStream && (
          <div className="section">
            <h3>Step 3: Career Options for {selectedStream.name}</h3>
            {careers.length > 0 ? (
              <div className="career-container">
                {careers.map((career) => (
                  <div key={career._id} className="career-point">
                    <h4>{career.name}</h4>
                  </div>
                ))}
              </div>
            ) : (
              <p className="loading-text">No careers available for this stream.</p>
            )}
          </div>
        )}

        <div className="section">
          <h3>📘 Career Paths Based on Qualification</h3>
          <div className="career-section">
            <h4>10th Pass Jobs</h4>
            <ul>{tenthJobs.map((job, i) => <li key={i}>🔹 {job}</li>)}</ul>

            <h4>Intermediate Jobs</h4>
            <ul>{interJobs.map((job, i) => <li key={i}>🔹 {job}</li>)}</ul>

            <h4>Degree/B.Tech Jobs</h4>
            <ul>{degreeJobs.map((job, i) => <li key={i}>🔹 {job}</li>)}</ul>
          </div>
        </div>

        <div className="section bot-section">
          <h3>🤖 Your AI Career Companion</h3>
          <p style={{ fontSize: "18px", lineHeight: "1.6" }}>
            🌟 Not sure what path to take after 10th, Inter, or Degree?<br />
            🧠 Ask anything like:
            <ul style={{ marginTop: "10px", marginBottom: "10px" }}>
              <li>👉 “How to become an IAS officer?”</li>
              <li>👉 “Which government jobs are available after diploma?”</li>
              <li>👉 “What's the salary of a Scientist in ISRO?”</li>
            </ul>
            💬 Click on the chat bubble at the bottom-right to talk to your career guide!
          </p>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
