import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import "../styles/AdminDashboard.css";

function AdminDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="admin-dashboard">

      <header className="admin-header">

        <div className="admin-header-left">
          <div className="admin-icon">
            🏨
          </div>

          <div>
            <h1>Hotel Booking</h1>
            <p>Admin Dashboard</p>
          </div>
        </div>

        <div className="admin-header-right">
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

      <main className="admin-content">

        <section className="admin-welcome">
          <h2>Welcome to Admin Dashboard</h2>

          <p>
            Manage managers, hotels, bookings, payouts and reports.
          </p>
        </section>

        <section className="admin-cards">

          {/* Manager Approval */}

          <div className="admin-card">
            <div className="admin-card-icon">
              👥
            </div>

            <h3>Manager Approval Queue</h3>

            <p>
              Review and approve hotel manager registration requests.
            </p>

            <button
              type="button"
              onClick={() =>
                navigate("/admin/manager-approvals")
              }
            >
              Review Approvals
            </button>
          </div>

          {/* Hotel Moderation */}

          <div className="admin-card">
            <div className="admin-card-icon">
              🏨
            </div>

            <h3>Hotel Moderation</h3>

            <p>
              Review registered hotels and manage hotel information.
            </p>

            <button
              type="button"
              onClick={() =>
                navigate("/admin/hotels")
              }
            >
              Manage Hotels
            </button>
          </div>

          {/* Booking Oversight */}

          <div className="admin-card">
            <div className="admin-card-icon">
              📋
            </div>

            <h3>Booking Oversight</h3>

            <p>
              Monitor reservations, booking status and payment status.
            </p>

            <button
              type="button"
              onClick={() =>
                navigate("/admin/bookings")
              }
            >
              View Bookings
            </button>
          </div>

          {/* Payout Processing */}

          <div className="admin-card">
            <div className="admin-card-icon">
              💰
            </div>

            <h3>Payout Processing</h3>

            <p>
              Review payments and manage hotel payout information.
            </p>

            <button
              type="button"
              onClick={() =>
                navigate("/admin/payouts")
              }
            >
              Process Payouts
            </button>
          </div>

          {/* Reports */}

          <div className="admin-card">
            <div className="admin-card-icon">
              📊
            </div>

            <h3>Reports</h3>

            <p>
              View booking, hotel, payment and revenue summaries.
            </p>

            <button
              type="button"
              onClick={() =>
                navigate("/admin/reports")
              }
            >
              View Reports
            </button>
          </div>

        </section>

      </main>

    </div>
  );
}

export default AdminDashboard;