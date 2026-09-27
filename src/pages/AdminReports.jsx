import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import "../styles/AdminReports.css";

function AdminReports() {
  const navigate = useNavigate();

  const [reports, setReports] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadReports();
  }, []);

  const loadReports = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/AdminReports");

      setReports(response.data);
    } catch (error) {
      console.log(
        "Admin reports error:",
        error.response?.data
      );

      setError(
        error.response?.data?.message ||
          "Unable to load reports."
      );
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="admin-reports-page">
        <div className="admin-reports-message">
          Loading reports...
        </div>
      </div>
    );
  }

  return (
    <div className="admin-reports-page">
      <header className="admin-reports-header">
        <div>
          <h1>Hotel Booking</h1>
          <p>Reports</p>
        </div>

        <button
          type="button"
          onClick={() => navigate("/admin")}
        >
          Back to Dashboard
        </button>
      </header>

      <main className="admin-reports-content">
        <div className="admin-reports-heading">
          <div>
            <h2>Reports</h2>
            <p>
              View hotel, booking and payment summaries.
            </p>
          </div>

          <button
            type="button"
            className="refresh-reports-button"
            onClick={loadReports}
          >
            Refresh
          </button>
        </div>

        {error && (
          <div className="admin-reports-message error">
            {error}
          </div>
        )}

        {!error && reports && (
          <div className="reports-grid">
            <div className="report-card">
              <span>🏨</span>
              <p>Total Hotels</p>
              <h3>{reports.totalHotels}</h3>
            </div>

            <div className="report-card">
              <span>✅</span>
              <p>Active Hotels</p>
              <h3>{reports.activeHotels}</h3>
            </div>

            <div className="report-card">
              <span>👥</span>
              <p>Total Managers</p>
              <h3>{reports.totalManagers}</h3>
            </div>

            <div className="report-card">
              <span>📋</span>
              <p>Total Bookings</p>
              <h3>{reports.totalBookings}</h3>
            </div>

            <div className="report-card">
              <span>🎫</span>
              <p>Confirmed Bookings</p>
              <h3>{reports.confirmedBookings}</h3>
            </div>

            <div className="report-card">
              <span>⏳</span>
              <p>Pending Payments</p>
              <h3>{reports.pendingPayments}</h3>
            </div>

            <div className="report-card">
              <span>💳</span>
              <p>Paid Payments</p>
              <h3>{reports.paidPayments}</h3>
            </div>

            <div className="report-card revenue-card">
              <span>💰</span>
              <p>Total Revenue</p>
              <h3>₹{reports.totalRevenue}</h3>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default AdminReports;