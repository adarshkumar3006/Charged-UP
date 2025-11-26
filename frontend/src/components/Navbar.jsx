import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthContext from "../context/AuthContext";
import "./Navbar.css";

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          <span>CHARGED</span>UP
        </Link>
        {user ? (
          <div className="navbar-menu">
            <Link to="/dashboard">Dashboard</Link>
            <Link to="/workout-plan">Workout Plan</Link>
            <Link to="/diet-plan">Diet Plan</Link>
            <Link to="/progress">Progress</Link>
            <Link to="/profile">Profile</Link>
            <button onClick={handleLogout} className="btn-logout">
              Logout
            </button>
          </div>
        ) : (
          <div className="navbar-menu">
            <Link to="/login">Login</Link>
            <Link to="/signup" className="btn-primary">
              Get Started
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
