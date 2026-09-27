import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import "../styles/AdminManagerApprovals.css";

function AdminManagerApprovals() {
  const navigate = useNavigate();

  const [managers, setManagers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    loadManagers();
  }, []);

  const loadManagers = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/AdminManagers");

      setManagers(response.data || []);
    } catch (error) {
      console.log(
        "Manager approval error:",
        error.response?.data
      );

      setError(
        error.response?.data?.message ||
          "Unable to load manager approvals."
      );
    } finally {
      setLoading(false);
    }
  };

  const updateManagerStatus = async (managerId, action) => {
    try {
      setMessage("");
      setError("");

      const response = await api.put(
        `/AdminManagers/${managerId}/${action}`
      );

      setMessage(
        response.data?.message ||
          "Manager status updated successfully."
      );

      await loadManagers();
    } catch (error) {
      console.log(
        "Manager update error:",
        error.response?.data
      );

      setError(
        error.response?.data?.message ||
          "Unable to update manager status."
      );
    }
  };

  const getStatusClass = (status) => {
    if (status === "Approved") return "approved";
    if (status === "Rejected") return "rejected";
    return "pending";
  };

  if (loading) {
    return (
      <div className="admin-approvals-page">
        <div className="admin-approvals-message">
          Loading manager approvals...
        </div>
      </div>
    );
  }

  return (
    <div className="admin-approvals-page">

      <header className="admin-approvals-header">
        <div>
          <h1>Hotel Booking</h1>
          <p>Manager Approval Queue</p>
        </div>

        <button
          type="button"
          onClick={() => navigate("/admin")}
        >
          Back to Dashboard
        </button>
      </header>

      <main className="admin-approvals-content">

        <div className="admin-approvals-heading">
          <div>
            <h2>Manager Approval Queue</h2>
            <p>
              Review hotel manager registration requests.
            </p>
          </div>

          <button
            type="button"
            className="approval-refresh-button"
            onClick={loadManagers}
          >
            Refresh
          </button>
        </div>

        {message && (
          <div className="approval-success">
            {message}
          </div>
        )}

        {error && (
          <div className="admin-approvals-message error">
            <p>{error}</p>

            <button
              type="button"
              onClick={loadManagers}
            >
              Try Again
            </button>
          </div>
        )}

        {!error && managers.length === 0 && (
          <div className="admin-approvals-message">
            <h3>No manager requests found</h3>
            <p>
              There are currently no hotel manager records.
            </p>
          </div>
        )}

        {!error && managers.length > 0 && (
          <div className="manager-approval-list">

            {managers.map((manager) => (
              <div
                className="manager-approval-card"
                key={manager.managerId}
              >

                <div className="manager-approval-top">

                  <div className="manager-avatar">
                    👤
                  </div>

                  <div className="manager-main-info">
                    <h3>
                      {manager.name || "Hotel Manager"}
                    </h3>

                    <p>
                      {manager.email}
                    </p>
                  </div>

                  <span
                    className={`manager-status ${getStatusClass(
                      manager.approvalStatus
                    )}`}
                  >
                    {manager.approvalStatus || "Pending"}
                  </span>

                </div>

                <div className="manager-approval-details">

                  <div>
                    <span>Manager ID</span>
                    <strong>
                      {manager.managerId}
                    </strong>
                  </div>

                  <div>
                    <span>User ID</span>
                    <strong>
                      {manager.userId}
                    </strong>
                  </div>

                  <div>
                    <span>Hotels</span>
                    <strong>
                      {manager.hotels?.length || 0}
                    </strong>
                  </div>

                </div>

                {manager.hotels?.length > 0 && (
                  <div className="manager-hotels">

                    <h4>Assigned Hotels</h4>

                    {manager.hotels.map((hotel) => (
                      <div
                        className="assigned-hotel"
                        key={hotel.id}
                      >
                        <span>
                          🏨 {hotel.name}
                        </span>

                        <span>
                          {hotel.city}
                        </span>
                      </div>
                    ))}

                  </div>
                )}

                <div className="manager-approval-actions">

                  {manager.approvalStatus !== "Approved" && (
                    <button
                      type="button"
                      className="approve-button"
                      onClick={() =>
                        updateManagerStatus(
                          manager.managerId,
                          "approve"
                        )
                      }
                    >
                      Approve
                    </button>
                  )}

                  {manager.approvalStatus !== "Rejected" && (
                    <button
                      type="button"
                      className="reject-button"
                      onClick={() =>
                        updateManagerStatus(
                          manager.managerId,
                          "reject"
                        )
                      }
                    >
                      Reject
                    </button>
                  )}

                </div>

              </div>
            ))}

          </div>
        )}

      </main>

    </div>
  );
}

export default AdminManagerApprovals;