import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthContext from "../context/AuthContext";
import Navbar from "../components/Navbar";
import "./Auth.css";

const Signup = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    age: "",
    gender: "male",
    height: "",
    weight: "",
    activityLevel: "sedentary",
    primaryGoal: "maintain_fitness",
    constraints: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { signup } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleNext = () => {
    if (step === 1) {
      if (!formData.name || !formData.email || !formData.password) {
        setError("Please fill in all fields");
        return;
      }
    } else if (step === 2) {
      if (!formData.age || !formData.height || !formData.weight) {
        setError("Please fill in all fields");
        return;
      }
    }
    setError("");
    setStep(step + 1);
  };

  const handleBack = () => {
    setStep(step - 1);
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const submitData = {
      ...formData,
      age: parseInt(formData.age),
      height: parseFloat(formData.height),
      weight: parseFloat(formData.weight),
    };

    const result = await signup(submitData);

    if (result.success) {
      navigate("/dashboard");
    } else {
      setError(result.message || "Signup failed. Please try again.");
      if (result.errors) {
        setError(result.errors.map((e) => e.msg).join(", "));
      }
    }

    setLoading(false);
  };

  return (
    <div className="auth-page">
      <Navbar />
      <div className="auth-container">
        <div className="auth-card">
          <h2>Create Your Account</h2>
          <p className="auth-subtitle">Step {step} of 3</p>

          {error && <div className="error-message">{error}</div>}

          <form
            onSubmit={
              step === 3
                ? handleSubmit
                : (e) => {
                    e.preventDefault();
                    handleNext();
                  }
            }
          >
            {step === 1 && (
              <>
                <div className="form-group">
                  <label>Full Name</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    placeholder="Enter your name"
                  />
                </div>

                <div className="form-group">
                  <label>Email</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    placeholder="Enter your email"
                  />
                </div>

                <div className="form-group">
                  <label>Password</label>
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    minLength="6"
                    placeholder="At least 6 characters"
                  />
                </div>
              </>
            )}

            {step === 2 && (
              <>
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
                    placeholder="Enter your age"
                  />
                </div>

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
                    placeholder="Enter height in cm"
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
                    placeholder="Enter weight in kg"
                  />
                </div>
              </>
            )}

            {step === 3 && (
              <>
                <div className="form-group">
                  <label>Activity Level</label>
                  <select
                    name="activityLevel"
                    value={formData.activityLevel}
                    onChange={handleChange}
                  >
                    <option value="sedentary">
                      Sedentary (little or no exercise)
                    </option>
                    <option value="lightly_active">
                      Lightly Active (light exercise 1-3 days/week)
                    </option>
                    <option value="active">
                      Active (moderate exercise 3-5 days/week)
                    </option>
                    <option value="very_active">
                      Very Active (hard exercise 6-7 days/week)
                    </option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Primary Goal</label>
                  <select
                    name="primaryGoal"
                    value={formData.primaryGoal}
                    onChange={handleChange}
                    required
                  >
                    <option value="lose_weight">Lose Weight</option>
                    <option value="gain_muscle">Gain Muscle</option>
                    <option value="improve_endurance">Improve Endurance</option>
                    <option value="maintain_fitness">Maintain Fitness</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Constraints/Injuries (Optional)</label>
                  <textarea
                    name="constraints"
                    value={formData.constraints}
                    onChange={handleChange}
                    rows="3"
                    placeholder="Any injuries or constraints we should know about?"
                  />
                </div>
              </>
            )}

            <div className="form-actions">
              {step > 1 && (
                <button
                  type="button"
                  onClick={handleBack}
                  className="btn btn-secondary"
                >
                  Back
                </button>
              )}
              {step < 3 ? (
                <button type="submit" className="btn btn-primary">
                  Next
                </button>
              ) : (
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={loading}
                >
                  {loading ? "Creating Account..." : "Sign Up"}
                </button>
              )}
            </div>
          </form>

          <p className="auth-footer">
            Already have an account? <Link to="/login">Login here</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;
