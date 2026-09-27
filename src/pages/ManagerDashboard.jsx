import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import "../styles/ManagerDashboard.css";

function ManagerDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="manager-dashboard">

      <header className="manager-header">

        <div className="manager-header-left">
          <div className="manager-icon">
            🏨
          </div>

          <div>
            <h1>Hotel Booking</h1>
            <p>Hotel Manager Dashboard</p>
          </div>
        </div>

        <div className="manager-header-right">
          <span>
            Welcome, {user?.name}
          </span>

          <button
            type="button"
            onClick={handleLogout}
          >
            Logout
          </button>
        </div>

      </header>

      <main className="manager-content">

        <section className="manager-welcome">
          <h2>Welcome to Manager Dashboard</h2>

          <p>
            Manage your hotel, rooms, availability, reservations and payouts.
          </p>
        </section>

        <section className="manager-cards">

          <div className="manager-card">
            <div className="manager-card-icon">
              🏨
            </div>

            <h3>Hotel Management</h3>

            <p>
              Manage hotel information and room details.
            </p>

            <button
              type="button"
              onClick={() => navigate("/manager/hotel")}
            >
              Manage Hotel
            </button>
          </div>


          <div className="manager-card">
            <div className="manager-card-icon">
              🛏️
            </div>

            <h3>Room Types & Rate Plans</h3>

            <p>
              Create room types and manage pricing plans.
            </p>

            <button
              type="button"
              onClick={() => navigate("/manager/rooms")}
            >
              Manage Rooms
            </button>
          </div>


          <div className="manager-card">
            <div className="manager-card-icon">
              📅
            </div>

            <h3>Availability Calendar</h3>

            <p>
              View room availability for different dates.
            </p>

            <button
              type="button"
              onClick={() => navigate("/manager/availability")}
            >
              View Calendar
            </button>
          </div>


          <div className="manager-card">
            <div className="manager-card-icon">
              📋
            </div>

            <h3>Reservations</h3>

            <p>
              View bookings and manage guest check-in and check-out.
            </p>

            <button
              type="button"
              onClick={() => navigate("/manager/reservations")}
            >
              View Reservations
            </button>
          </div>


          <div className="manager-card">
            <div className="manager-card-icon">
              💰
            </div>

            <h3>Payouts</h3>

            <p>
              View payout information for your hotel bookings.
            </p>

            <button
              type="button"
              onClick={() => navigate("/manager/payouts")}
            >
              View Payouts
            </button>
          </div>

        </section>

      </main>

    </div>
  );
}

export default ManagerDashboard;