import React from "react";
import "../styles/Home.css";
import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div className="home-container">
      <header className="header">
        <h1 className="home-title">SkillCraft</h1>
        <p className="home-tagline">Craft Your Skills. Design Your Future.</p>
      </header>

      <section className="home-content">
        <p className="home-description">
          Lost after 10th? SkillCraft helps you explore the right stream, get resources, and follow your path all the way to your dream job.
        </p>

        <div className="home-buttons">
          <Link to="/login" className="btn primary-btn">Student Login</Link>
          <Link to="/admin" className="btn secondary-btn">Admin Panel</Link>
        </div>
      </section>

      <footer className="footer">© 2025 SkillCraft. All Rights Reserved.</footer>
    </div>
  );
};

export default Home;
