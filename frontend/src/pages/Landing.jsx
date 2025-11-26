import React from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import "./Landing.css";

const Landing = () => {
  return (
    <div className="landing">
      <Navbar />
      <section className="hero">
        <div className="hero-content">
          <h1>Your Personal AI-Driven Fitness & Diet Coach</h1>
          <p className="hero-subtitle">
            Get custom workouts and meal plans based on your body, goals, and
            lifestyle.
          </p>
          <div className="hero-buttons">
            <Link to="/signup" className="btn btn-primary">
              Get Started
            </Link>
            <Link to="/login" className="btn btn-secondary">
              Login
            </Link>
          </div>
        </div>
      </section>

      <section className="features">
        <div className="container">
          <h2 className="section-title">Why Choose Charged Up?</h2>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">💪</div>
              <h3>Personalized Workout Plans</h3>
              <p>
                Get workout routines tailored to your fitness level, goals, and
                available equipment.
              </p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🥗</div>
              <h3>Goal-Based Diet Suggestions</h3>
              <p>
                Receive meal plans designed to help you achieve your specific
                fitness goals.
              </p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">📊</div>
              <h3>Progress Tracking</h3>
              <p>
                Monitor your weight, workouts, and overall progress with
                detailed analytics.
              </p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🎯</div>
              <h3>Smart Recommendations</h3>
              <p>
                AI-powered suggestions that adapt to your progress and
                preferences.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Landing;
