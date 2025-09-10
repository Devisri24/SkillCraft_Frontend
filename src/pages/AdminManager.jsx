import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { BookOpen, Layers, Briefcase, LogOut } from "lucide-react"; // icons

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

      setCareerOption("");
      fetchCareersForStream(selectedStreamId);
    } catch (err) {
      console.error("Error adding career:", err);
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
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-100 p-6">
      <div className="max-w-6xl mx-auto bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
        {/* Header */}
        <div className="flex justify-between items-center mb-10 border-b pb-4">
          <div className="flex items-center gap-3">
            <BookOpen className="text-orange-600 w-7 h-7" />
            <h2 className="text-2xl font-bold text-gray-800">Admin Dashboard</h2>
          </div>
          <button
            className="flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white font-medium px-4 py-2 rounded-lg shadow transition"
            onClick={handleLogout}
          >
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </div>

        {/* Subjects */}
        <div className="flex flex-wrap gap-3 mb-8">
          {subjectsList.map((subj) => (
            <button
              key={subj}
              className={`px-4 py-2 rounded-lg font-medium shadow-sm transition ${
                selectedSubject === subj
                  ? "bg-green-500 text-white"
                  : "bg-blue-500 hover:bg-blue-600 text-white"
              }`}
              onClick={() => handleSubjectClick(subj)}
            >
              {subj}
            </button>
          ))}
        </div>

        {/* Stream Section */}
        {selectedSubject && (
          <>
            <div className="bg-gradient-to-r from-orange-50 to-orange-100 p-6 rounded-xl mb-6 shadow-md">
              <h3 className="text-lg font-semibold mb-4">
                Add Stream to{" "}
                <span className="text-blue-600">{selectedSubject}</span>
              </h3>
              <form onSubmit={handleAddStream} className="flex gap-3">
                <input
                  type="text"
                  placeholder="Enter new stream"
                  value={newStream}
                  onChange={(e) => setNewStream(e.target.value)}
                  required
                  className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-400 outline-none"
                />
                <button
                  type="submit"
                  className="bg-green-500 hover:bg-green-600 text-white font-semibold px-4 py-2 rounded-lg shadow"
                >
                  Add Stream
                </button>
              </form>
            </div>

            <div className="mb-6">
              <h4 className="font-semibold text-gray-700 mb-3">
                Streams under{" "}
                <span className="text-blue-600">{selectedSubject}</span>
              </h4>
              <ul className="space-y-3">
                {streams.map((stream) => (
                  <li
                    key={stream._id}
                    className="flex justify-between items-center bg-blue-50 hover:bg-blue-100 transition px-4 py-3 rounded-lg shadow-sm"
                  >
                    <div className="flex items-center gap-2 text-gray-700">
                      <Layers className="w-4 h-4 text-blue-500" />
                      <strong>{stream.name}</strong>
                    </div>
                    <button
                      className="bg-orange-500 hover:bg-orange-600 text-white px-3 py-1 rounded-lg shadow"
                      onClick={() => {
                        setSelectedStreamId(stream._id);
                        fetchCareersForStream(stream._id);
                      }}
                    >
                      ➕ Add Career
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </>
        )}

        {/* Career Section */}
        {selectedStreamId && (
          <div className="bg-gradient-to-r from-orange-50 to-orange-100 p-6 rounded-xl shadow-md">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Briefcase className="w-5 h-5 text-orange-600" />
              Add Career Option
            </h3>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleAddCareer();
              }}
              className="flex gap-3 mb-4"
            >
              <input
                type="text"
                placeholder="Enter career option"
                value={careerOption}
                onChange={(e) => setCareerOption(e.target.value)}
                required
                className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-orange-400 outline-none"
              />
              <button
                type="submit"
                className="bg-green-500 hover:bg-green-600 text-white font-semibold px-4 py-2 rounded-lg shadow"
              >
                Add Career
              </button>
            </form>

            <div>
              <h4 className="font-semibold text-gray-700 mb-2">
                Careers under this stream:
              </h4>
              <ul className="space-y-2">
                {careerList.map((career) => (
                  <li
                    key={career._id}
                    className="flex items-center gap-2 bg-white px-4 py-2 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition"
                  >
                    🎯 {career.name}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminManager;
