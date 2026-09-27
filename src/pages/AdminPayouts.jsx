import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import "../styles/AdminPayouts.css";

function AdminPayouts() {
  const navigate = useNavigate();

  const [payouts, setPayouts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadPayouts();
  }, []);

  const loadPayouts = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/AdminPayouts");

      setPayouts(response.data || []);
    } catch (error) {
      console.log(
        "Admin payout error:",
        error.response?.data
      );

      setError(
        error.response?.data?.message ||
          "Unable to load payout information."
      );
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (date) => {
    if (!date) return "-";

    return new Date(date).toLocaleDateString("en-IN");
  };

  if (loading) {
    return (
      <div className="admin-payouts-page">
        <div className="admin-payouts-message">
          Loading payouts...
        </div>
      </div>
    );
  }

  return (
    <div className="admin-payouts-page">

      <header className="admin-payouts-header">

        <div>
          <h1>Hotel Booking</h1>
          <p>Payout Processing</p>
        </div>

        <button
          type="button"
          onClick={() => navigate("/admin")}
        >
          Back to Dashboard
        </button>

      </header>

      <main className="admin-payouts-content">

        <div className="admin-payouts-heading">

          <div>
            <h2>Payout Processing</h2>

            <p>
              Review paid reservations and hotel payout information.
            </p>
          </div>

          <button
            type="button"
            className="refresh-payouts-button"
            onClick={loadPayouts}
          >
            Refresh
          </button>

        </div>

        {error && (
          <div className="admin-payouts-message error">
            {error}
          </div>
        )}

        {!error && payouts.length === 0 && (
          <div className="admin-payouts-message">

            <h3>No payouts found</h3>

            <p>
              There are currently no paid reservations available for payout processing.
            </p>

          </div>
        )}

        {!error && payouts.length > 0 && (

          <div className="admin-payouts-list">

            {payouts.map((payout) => (

              <div
                className="admin-payout-card"
                key={payout.payoutId}
              >

                <div className="payout-card-header">

                  <div>
                    <h3>
                      {payout.bookingReference}
                    </h3>

                    <span>
                      Payout ID: {payout.payoutId}
                    </span>
                  </div>

                  <span className="payout-status">
                    {payout.paymentStatus}
                  </span>

                </div>

                <div className="payout-details">

                  <div>
                    <span>Guest</span>

                    <strong>
                      {payout.guestName || "-"}
                    </strong>
                  </div>

                  <div>
                    <span>Hotel</span>

                    <strong>
                      {payout.hotelName || "-"}
                    </strong>
                  </div>

                  <div>
                    <span>Amount</span>

                    <strong>
                      ₹{payout.amount}
                    </strong>
                  </div>

                  <div>
                    <span>Gateway Reference</span>

                    <strong>
                      {payout.gatewayReference || "-"}
                    </strong>
                  </div>

                  <div>
                    <span>Payment Date</span>

                    <strong>
                      {formatDate(payout.createdAt)}
                    </strong>
                  </div>

                </div>

              </div>

            ))}

          </div>

        )}

      </main>

    </div>
  );
}

export default AdminPayouts;