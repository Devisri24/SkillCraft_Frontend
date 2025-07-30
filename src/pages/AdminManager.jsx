import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/AdminManager.css";

const subjectsList = ["Maths", "Science", "Social", "English", "Hindi", "Telugu"];

const AdminManager = () => {
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [streams, setStreams] = useState([]);
  const [subjectIdMap, setSubjectIdMap] = useState({});
  const [newStream, setNewStream] = useState("");
  const [selectedStreamId, setSelectedStreamId] = useState(null);
  const [careerOption, setCareerOption] = useState("");
  const [careerList, setCareerList] = useState([]);
  const navigate = useNavigate();

  const API_BASE = import.meta.env.VITE_API_BASE_URL;

  useEffect(() => {
    fetch(`${API_BASE}/admin-career/subjects`)
      .then((res) => res.json())
      .then((data) => {
        const map = {};
        data.forEach((subj) => {
          map[subj.name.toLowerCase()] = subj._id;
        });
        setSubjectIdMap(map);
      })
      .catch((err) => console.log("Error loading subjects:", err));
  }, []);

  const handleSubjectClick = (subject) => {
    setSelectedSubject(subject);
    setCareerList([]);
    setSelectedStreamId(null);

    const subjectId = subjectIdMap[subject.toLowerCase()];
    if (!subjectId) return;

    fetch(`${API_BASE}/admin-career/streams/${subjectId}`)
      .then((res) => res.json())
      .then((data) => setStreams(data))
      .catch((err) => console.log(err));
  };

  const handleAddStream = async (e) => {
    e.preventDefault();
    const subjectId = subjectIdMap[selectedSubject.toLowerCase()];
    if (!newStream || !subjectId) return;

    try {
      await fetch(`${API_BASE}/admin-career/stream`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ subjectId, streamName: newStream }),
      });

      alert("Stream added successfully ✅");
      setNewStream("");

      const res = await fetch(`${API_BASE}/admin-career/streams/${subjectId}`);
      const data = await res.json();
      setStreams(data);
    } catch (err) {
      console.error("Error adding stream:", err);
    }
  };

  const handleAddCareer = async () => {
    try {
      await fetch(`${API_BASE}/admin-career/add-career`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ streamId: selectedStreamId, name: careerOption }),
      });

      alert("Career option added successfully ✅");
      setCareerOption("");
      fetchCareersForStream(selectedStreamId);
    } catch (err) {
      console.error("Error adding career:", err);
      alert("Failed to add career option ❌");
    }
  };

  const fetchCareersForStream = async (streamId) => {
    try {
      const res = await fetch(`${API_BASE}/admin-career/careers/${streamId}`);
      const data = await res.json();
      setCareerList(data);
    } catch (err) {
      console.error("Error fetching careers:", err);
    }
  };

  const handleLogout = () => {
    navigate("/");
  };

  return (
    <div className="admin-manager-container">
      <div className="admin-header">
        <h2>Admin Dashboard</h2>
        <button className="logout-btn" onClick={handleLogout}>Logout</button>
      </div>

      <div className="subject-buttons">
        {subjectsList.map((subj) => (
          <button
            key={subj}
            className={`subject-btn ${selectedSubject === subj ? "active" : ""}`}
            onClick={() => handleSubjectClick(subj)}
          >
            {subj}
          </button>
        ))}
      </div>

      {selectedSubject && (
        <>
          <div className="form-section">
            <h3>Add Stream to <span>{selectedSubject}</span></h3>
            <form onSubmit={handleAddStream}>
              <input
                type="text"
                placeholder="Enter new stream"
                value={newStream}
                onChange={(e) => setNewStream(e.target.value)}
                required
              />
              <button type="submit">Add Stream</button>
            </form>
          </div>

          <div className="stream-list">
            <h4>Streams under <span>{selectedSubject}</span></h4>
            <ul>
              {streams.map((stream) => (
                <li key={stream._id}>
                  <strong>{stream.name}</strong>{" "}
                  <button onClick={() => {
                    setSelectedStreamId(stream._id);
                    fetchCareersForStream(stream._id);
                  }}>
                    ➕ Add Career
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </>
      )}

      {selectedStreamId && (
        <div className="form-section career-form">
          <h3>Add Career Option</h3>
          <form onSubmit={(e) => {
            e.preventDefault();
            handleAddCareer();
          }}>
            <input
              type="text"
              placeholder="Enter career option"
              value={careerOption}
              onChange={(e) => setCareerOption(e.target.value)}
              required
            />
            <button type="submit">Add Career</button>
          </form>

          <div className="career-list">
            <h4>Careers under this stream:</h4>
            <ul>
              {careerList.map((career) => (
                <li key={career._id}>🎯 {career.name}</li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminManager;
