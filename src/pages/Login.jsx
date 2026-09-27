import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "../styles/Login.css";

function Login() {
  const [role, setRole] = useState("Guest");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setLoading(true);

    try {
      const user = await login(email, password);

      // Convert both possible role formats
      const backendRole = user.role
        ?.replace(/\s/g, "")
        .toLowerCase();

      const selectedRole = role
        ?.replace(/\s/g, "")
        .toLowerCase();

      console.log("Backend role:", user.role);
      console.log("Selected role:", role);

      if (backendRole !== selectedRole) {
        setError(
          `This account is registered as ${user.role}. Please select the correct role.`
        );
        return;
      }

      // Navigate based on actual backend role
      if (backendRole === "admin") {
        navigate("/admin");
      } else if (backendRole === "hotelmanager") {
        navigate("/manager");
      } else if (backendRole === "guest") {
        navigate("/guest");
      } else {
        setError("Invalid user role.");
      }

    } catch (error) {
      console.log(
        "Login error:",
        error.response?.data
      );

      setError(
        error.response?.data?.message ||
          "Invalid email or password."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">

      <div className="login-container">

        <div className="login-header">

          <div className="hotel-icon">
            🏨
          </div>

          <h1>Hotel Booking</h1>

          <p>
            Room Reservation System
          </p>

        </div>


        <div className="login-box">

          <h2>Welcome Back</h2>

          <p className="login-subtitle">
            Sign in to access your account
          </p>


          <div className="role-section">

            <label>
              Select Role
            </label>

            <div className="role-options">

              <button
                type="button"
                className={`role-button ${
                  role === "Guest"
                    ? "active"
                    : ""
                }`}
                onClick={() => {
                  setRole("Guest");
                  setError("");
                }}
              >
                <span>👤</span>
                <strong>Guest</strong>
              </button>


              <button
                type="button"
                className={`role-button ${
                  role === "Hotel Manager"
                    ? "active"
                    : ""
                }`}
                onClick={() => {
                  setRole("Hotel Manager");
                  setError("");
                }}
              >
                <span>🏨</span>
                <strong>Hotel Manager</strong>
              </button>


              <button
                type="button"
                className={`role-button ${
                  role === "Admin"
                    ? "active"
                    : ""
                }`}
                onClick={() => {
                  setRole("Admin");
                  setError("");
                }}
              >
                <span>⚙️</span>
                <strong>Admin</strong>
              </button>

            </div>

          </div>


          <form onSubmit={handleSubmit}>

            <div className="form-group">

              <label htmlFor="email">
                Email Address
              </label>

              <input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) =>
                  setEmail(e.target.value)
                }
                required
              />

            </div>


            <div className="form-group">

              <label htmlFor="password">
                Password
              </label>

              <input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) =>
                  setPassword(e.target.value)
                }
                required
              />

            </div>


            {error && (
              <div className="login-error">
                {error}
              </div>
            )}


            <button
              type="submit"
              className="login-button"
              disabled={loading}
            >
              {loading
                ? "Signing in..."
                : "Sign In"}
            </button>

          </form>

        </div>


        <div className="login-footer">

          <p>
            Secure Hotel Room Reservation System
          </p>

        </div>

      </div>

    </div>
  );
}

export default Login;