import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import "../styles/GuestDashboard.css";

function GuestDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="guest-dashboard">

      <header className="guest-header">
        <div className="header-left">
          <div className="header-icon">🏨</div>

          <div>
            <h1>Hotel Booking</h1>
            <p>Guest Dashboard</p>
          </div>
        </div>

        <div className="header-right">
          <span>Welcome, {user?.name}</span>

          <button onClick={handleLogout}>
            Logout
          </button>
        </div>
      </header>

      <main className="guest-content">

        <section className="welcome-section">
          <h2>Find Your Perfect Stay</h2>

          <p>
            Search hotels, check room availability and make your reservation.
          </p>
        </section>

        <section className="guest-cards">

          <div className="guest-card">
            <div className="card-icon">🔍</div>

            <h3>Search Hotels</h3>

            <p>
              Search available hotels and rooms based on your travel dates.
            </p>

            <button onClick={() => navigate("/guest/search")}>
              Search Hotels
            </button>
          </div>

          <div className="guest-card">
            <div className="card-icon">📅</div>

            <h3>My Reservations</h3>

            <p>
              View your upcoming and previous hotel reservations.
            </p>

            <button onClick={() => navigate("/guest/account")}>
              View Reservations
            </button>
          </div>

          <div className="guest-card">
            <div className="card-icon">👤</div>

            <h3>My Profile</h3>

            <p>
              View your account and personal information.
            </p>

            <button onClick={() => navigate("/guest/account")}>
              View Profile
            </button>
          </div>

        </section>

      </main>

    </div>
  );
}

export default GuestDashboard;