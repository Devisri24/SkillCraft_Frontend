import React from "react";
import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div className="min-h-screen flex flex-col justify-between items-center bg-gradient-to-br from-blue-50 to-white px-6 py-10">
      
      {/* Header */}
      <header className="text-center">
        <h1 className="text-4xl md:text-5xl font-bold text-blue-900 mb-2">SkillCraft</h1>
        <p className="text-gray-600 text-lg md:text-xl">
          Craft Your Skills. Design Your Future.
        </p>
      </header>

      {/* Content */}
      <section className="text-center max-w-2xl">
        <p className="text-gray-700 text-lg md:text-xl leading-relaxed mb-8">
          Lost after 10th? SkillCraft helps you explore the right stream, 
          get resources, and follow your path all the way to your dream job.
        </p>

        {/* Buttons */}
        <div className="flex gap-4 justify-center">
          <Link
            to="/login"
            className="px-6 py-3 bg-blue-900 text-white rounded-lg shadow-md hover:bg-blue-800 transition"
          >
            Student Login
          </Link>
          <Link
            to="/admin"
            className="px-6 py-3 border-2 border-blue-900 text-blue-900 rounded-lg hover:bg-blue-50 transition"
          >
            Admin Panel
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="text-gray-500 text-sm mt-10">
        © 2025 SkillCraft. All Rights Reserved.
      </footer>
    </div>
  );
};

export default Home;
