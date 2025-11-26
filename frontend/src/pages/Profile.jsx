import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import AuthContext from "../context/AuthContext";
import Navbar from "../components/Navbar";
import "./Profile.css";

const Profile = () => {
  const { user, updateUser } = useContext(AuthContext);
  const [formData, setFormData] = useState({
    name: "",
    age: "",
    gender: "male",
    height: "",
    weight: "",
    activityLevel: "sedentary",
    primaryGoal: "maintain_fitness",
    workoutLocation: "gym",
    workoutDaysPerWeek: 4,
    dietaryPreference: "non_vegetarian",
    dietaryRestrictions: "",
    hasEquipment: true,
    constraints: "",
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        age: user.age || "",
        gender: user.gender || "male",
        height: user.height || "",
        weight: user.weight || "",
        activityLevel: user.activityLevel || "sedentary",
        primaryGoal: user.primaryGoal || "maintain_fitness",
        workoutLocation: user.workoutLocation || "gym",
        workoutDaysPerWeek: user.workoutDaysPerWeek || 4,
        dietaryPreference: user.dietaryPreference || "non_vegetarian",
        dietaryRestrictions: user.dietaryRestrictions || "",
        hasEquipment:
          user.hasEquipment !== undefined ? user.hasEquipment : true,
        constraints: user.constraints || "",
      });
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    const submitData = {
      ...formData,
      age: parseInt(formData.age),
      height: parseFloat(formData.height),
      weight: parseFloat(formData.weight),
      workoutDaysPerWeek: parseInt(formData.workoutDaysPerWeek),
    };

    const result = await updateUser(submitData);

    if (result.success) {
      setMessage("Profile updated successfully!");
    } else {
      setMessage(result.message || "Update failed");
    }

    setLoading(false);
  };

  if (!user) {
    return (
      <div className="profile-page">
        <Navbar />
        <div className="container">
          <div className="spinner"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="profile-page">
      <Navbar />
      <div className="container">
        <div className="profile-header">
          <h1>Profile & Preferences</h1>
          <p>Update your fitness profile and preferences</p>
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

        <form onSubmit={handleSubmit} className="profile-form">
          <div className="form-section">
            <h2>Basic Information</h2>
            <div className="form-row">
              <div className="form-group">
                <label>Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Age</label>
                <input
                  type="number"
                  name="age"
                  value={formData.age}
                  onChange={handleChange}
                  required
                  min="13"
                  max="100"
                />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Gender</label>
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                >
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div className="form-group">
                <label>Height (cm)</label>
                <input
                  type="number"
                  name="height"
                  value={formData.height}
                  onChange={handleChange}
                  required
                  min="100"
                  max="250"
                />
              </div>
            </div>
            <div className="form-row">
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
                />
              </div>
              <div className="form-group">
                <label>Activity Level</label>
                <select
                  name="activityLevel"
                  value={formData.activityLevel}
                  onChange={handleChange}
                >
                  <option value="sedentary">Sedentary</option>
                  <option value="lightly_active">Lightly Active</option>
                  <option value="active">Active</option>
                  <option value="very_active">Very Active</option>
                </select>
              </div>
            </div>
          </div>

          <div className="form-section">
            <h2>Fitness Goals</h2>
            <div className="form-group">
              <label>Primary Goal</label>
              <select
                name="primaryGoal"
                value={formData.primaryGoal}
                onChange={handleChange}
              >
                <option value="lose_weight">Lose Weight</option>
                <option value="gain_muscle">Gain Muscle</option>
                <option value="improve_endurance">Improve Endurance</option>
                <option value="maintain_fitness">Maintain Fitness</option>
              </select>
            </div>
            <div className="form-group">
              <label>Constraints/Injuries</label>
              <textarea
                name="constraints"
                value={formData.constraints}
                onChange={handleChange}
                rows="3"
                placeholder="Any injuries or constraints we should know about?"
              />
            </div>
          </div>

          <div className="form-section">
            <h2>Workout Preferences</h2>
            <div className="form-row">
              <div className="form-group">
                <label>Workout Location</label>
                <select
                  name="workoutLocation"
                  value={formData.workoutLocation}
                  onChange={handleChange}
                >
                  <option value="gym">Gym</option>
                  <option value="home">Home</option>
                </select>
              </div>
              <div className="form-group">
                <label>Days Per Week</label>
                <select
                  name="workoutDaysPerWeek"
                  value={formData.workoutDaysPerWeek}
                  onChange={handleChange}
                >
                  <option value="3">3 days</option>
                  <option value="4">4 days</option>
                  <option value="5">5 days</option>
                  <option value="6">6 days</option>
                </select>
              </div>
            </div>
            <div className="form-group">
              <label>
                <input
                  type="checkbox"
                  name="hasEquipment"
                  checked={formData.hasEquipment}
                  onChange={handleChange}
                />
                I have access to gym equipment
              </label>
            </div>
          </div>

          <div className="form-section">
            <h2>Dietary Preferences</h2>
            <div className="form-group">
              <label>Dietary Preference</label>
              <select
                name="dietaryPreference"
                value={formData.dietaryPreference}
                onChange={handleChange}
              >
                <option value="vegetarian">Vegetarian</option>
                <option value="non_vegetarian">Non-Vegetarian</option>
                <option value="vegan">Vegan</option>
              </select>
            </div>
            <div className="form-group">
              <label>Dietary Restrictions</label>
              <textarea
                name="dietaryRestrictions"
                value={formData.dietaryRestrictions}
                onChange={handleChange}
                rows="3"
                placeholder="e.g., lactose-free, gluten-free, etc."
              />
            </div>
          </div>

          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? "Updating..." : "Update Profile"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Profile;
