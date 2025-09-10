// src/pages/Dashboard.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";

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
      .then((data) => setCareers(data || []))
      .catch((err) => {
        console.error("Error fetching careers:", err);
        setCareers([]);
      });
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-b from-orange-50 via-white to-orange-100 px-6 py-10">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-10">
          ✨ Explore Your Career Path ✨
        </h2>

        {loading ? (
          <p className="text-center text-gray-500 italic">Loading subjects...</p>
        ) : (
          <div className="mb-10">
            <h3 className="text-xl font-semibold text-gray-700 mb-4 border-l-4 border-indigo-600 pl-3">
              Step 1: Choose Your Subject
            </h3>
            <div className="flex flex-wrap gap-4 justify-center">
              {subjects.map((subj) => (
                <div
                  key={subj._id}
                  className={`cursor-pointer px-6 py-4 rounded-xl shadow-md transition text-center font-medium min-w-[130px]
                    ${
                      selectedSubject?._id === subj._id
                        ? "bg-indigo-600 text-white"
                        : "bg-white border border-gray-200 hover:bg-indigo-50"
                    }`}
                  onClick={() => handleSubjectClick(subj)}
                >
                  {subj.name}
                </div>
              ))}
            </div>
          </div>
        )}

        {selectedSubject && (
          <div className="mb-10">
            <h3 className="text-xl font-semibold text-gray-700 mb-4 border-l-4 border-green-500 pl-3">
              Step 2: Select a Stream from{" "}
              <span className="text-indigo-600">{selectedSubject.name}</span>
            </h3>
            {streams.length > 0 ? (
              <div className="flex flex-wrap gap-4 justify-center">
                {streams.map((stream) => (
                  <div
                    key={stream._id}
                    className={`cursor-pointer px-6 py-4 rounded-xl shadow-md transition text-center font-medium min-w-[150px]
                      ${
                        selectedStream?._id === stream._id
                          ? "bg-green-500 text-white"
                          : "bg-white border border-gray-200 hover:bg-green-50"
                      }`}
                    onClick={() => handleStreamClick(stream)}
                  >
                    {stream.name}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-gray-500 italic">
                No streams available for this subject.
              </p>
            )}
          </div>
        )}

        {selectedStream && (
          <div className="mb-10">
            <h3 className="text-xl font-semibold text-gray-700 mb-4 border-l-4 border-orange-500 pl-3">
              Step 3: Career Options for{" "}
              <span className="text-indigo-600">{selectedStream.name}</span>
            </h3>
            {careers.length > 0 ? (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {careers.map((career) => (
                  <div
                    key={career._id}
                    className="bg-white p-6 rounded-xl shadow-md border border-gray-200 hover:shadow-lg transition"
                  >
                    <h4 className="text-lg font-semibold text-gray-800">
                      🎯 {career.name}
                    </h4>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-gray-500 italic">
                No careers available for this stream.
              </p>
            )}
          </div>
        )}

        {/* Career Paths Section */}
        <div className="mb-10">
          <h3 className="text-xl font-semibold text-gray-700 mb-6 border-l-4 border-purple-500 pl-3">
            📘 Career Paths Based on Qualification
          </h3>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
              <h4 className="text-lg font-bold mb-3 text-indigo-600">
                10th Pass Jobs
              </h4>
              <ul className="space-y-2">
                {tenthJobs.map((job, i) => (
                  <li key={i} className="text-gray-700">🔹 {job}</li>
                ))}
              </ul>
            </div>

            <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
              <h4 className="text-lg font-bold mb-3 text-green-600">
                Intermediate Jobs
              </h4>
              <ul className="space-y-2">
                {interJobs.map((job, i) => (
                  <li key={i} className="text-gray-700">🔹 {job}</li>
                ))}
              </ul>
            </div>

            <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
              <h4 className="text-lg font-bold mb-3 text-orange-600">
                Degree/B.Tech Jobs
              </h4>
              <ul className="space-y-2">
                {degreeJobs.map((job, i) => (
                  <li key={i} className="text-gray-700">🔹 {job}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* AI Assistant Section */}
        <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl p-8 shadow-md">
          <h3 className="text-xl font-semibold text-gray-700 mb-4 border-l-4 border-indigo-500 pl-3">
            🤖 Your AI Career Companion
          </h3>
          <p className="text-gray-700 leading-relaxed">
            🌟 Not sure what path to take after 10th, Inter, or Degree?
            <br />
            🧠 Ask anything like:
          </p>
          <ul className="list-disc list-inside text-gray-700 mt-3 space-y-1">
            <li>👉 “How to become an IAS officer?”</li>
            <li>👉 “Which government jobs are available after diploma?”</li>
            <li>👉 “What's the salary of a Scientist in ISRO?”</li>
          </ul>
          <p className="mt-4 text-gray-700">
            💬 Click on the chat bubble at the bottom-right to talk to your career guide!
          </p>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
