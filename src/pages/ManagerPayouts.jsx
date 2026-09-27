import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import "../styles/ManagerPayouts.css";

function ManagerPayouts() {
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

      const response = await api.get("/Payouts");

      setPayouts(response.data || []);
    } catch (err) {
      console.log("Payouts error:", err.response?.data);

      setError(
        err.response?.data?.message ||
          "Unable to load payout information."
      );
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (date) => {
    if (!date) {
      return "-";
    }

    return new Date(date).toLocaleDateString("en-IN");
  };

  const formatAmount = (amount) => {
    return Number(amount || 0).toLocaleString("en-IN");
  };

  return (
    <div className="manager-payouts-page">

      <header className="manager-payouts-header">

        <div>
          <h1>Hotel Booking</h1>
          <p>Manager Payouts</p>
        </div>

        <button
          type="button"
          onClick={() => navigate("/manager")}
        >
          Back to Dashboard
        </button>

      </header>

      <main className="manager-payouts-content">

        <div className="payouts-heading">

          <div>
            <h2>Payouts</h2>

            <p>
              View payout information for your hotel bookings.
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

        {loading ? (

          <div className="payouts-message">
            Loading payouts...
          </div>

        ) : error ? (

          <div className="payouts-message error">

            <p>{error}</p>

            <button
              type="button"
              onClick={loadPayouts}
            >
              Try Again
            </button>

          </div>

        ) : payouts.length === 0 ? (

          <div className="payouts-message">

            <h3>No payouts found</h3>

            <p>
              There are no payout records available yet.
            </p>

          </div>

        ) : (

          <div className="payouts-list">

            {payouts.map((payout) => (

              <div
                className="payout-card"
                key={payout.id || payout.payoutId}
              >

                <div className="payout-top">

                  <div>
                    <span>Payout ID</span>

                    <h3>
                      {payout.id ||
                        payout.payoutId ||
                        "-"}
                    </h3>
                  </div>

                  <span className="payout-status">
                    {payout.status || "Pending"}
                  </span>

                </div>

                <div className="payout-details">

                  <div>
                    <span>Amount</span>

                    <strong>
                      ₹{formatAmount(
                        payout.amount
                      )}
                    </strong>
                  </div>

                  <div>
                    <span>Reservation</span>

                    <strong>
                      {payout.reservationId ||
                        "-"}
                    </strong>
                  </div>

                  <div>
                    <span>Created Date</span>

                    <strong>
                      {formatDate(
                        payout.createdAt
                      )}
                    </strong>
                  </div>

                  <div>
                    <span>Paid Date</span>

                    <strong>
                      {formatDate(
                        payout.paidAt
                      )}
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

export default ManagerPayouts;