import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import "../styles/ManagerReservations.css";

function ManagerReservations() {
  const navigate = useNavigate();

  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [actionMessage, setActionMessage] = useState("");

  useEffect(() => {
    loadReservations();
  }, []);

  const loadReservations = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/Reservations");

      setReservations(response.data || []);
    } catch (error) {
      console.log(
        "Reservations error:",
        error.response?.data
      );

      setError(
        error.response?.data?.message ||
          "Unable to load reservations."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleCheckIn = async (reservationId) => {
    try {
      setActionMessage("");
      setError("");

      const response = await api.put(
        `/ManagerReservations/${reservationId}/check-in`
      );

      setActionMessage(
        response.data?.message ||
          "Guest checked in successfully."
      );

      await loadReservations();
    } catch (error) {
      console.log(
        "Check-in error:",
        error.response?.data
      );

      setError(
        error.response?.data?.message ||
          "Unable to check in guest."
      );
    }
  };

  const handleCheckOut = async (reservationId) => {
    try {
      setActionMessage("");
      setError("");

      const response = await api.put(
        `/ManagerReservations/${reservationId}/check-out`
      );

      setActionMessage(
        response.data?.message ||
          "Guest checked out successfully."
      );

      await loadReservations();
    } catch (error) {
      console.log(
        "Check-out error:",
        error.response?.data
      );

      setError(
        error.response?.data?.message ||
          "Unable to check out guest."
      );
    }
  };

  const getStatusClass = (status) => {
    if (status === "Confirmed") {
      return "confirmed";
    }

    if (status === "CheckedIn") {
      return "checked-in";
    }

    if (status === "CheckedOut") {
      return "checked-out";
    }

    if (status === "Cancelled") {
      return "cancelled";
    }

    if (status === "PendingPayment") {
      return "pending";
    }

    return "";
  };

  const formatDate = (date) => {
    if (!date) {
      return "-";
    }

    return new Date(date).toLocaleDateString("en-IN");
  };

  if (loading) {
    return (
      <div className="manager-reservations-page">
        <div className="reservations-message">
          Loading reservations...
        </div>
      </div>
    );
  }

  return (
    <div className="manager-reservations-page">

      <header className="manager-reservations-header">
        <div>
          <h1>Hotel Booking</h1>
          <p>Manager Reservations</p>
        </div>

        <button
          type="button"
          onClick={() => navigate("/manager")}
        >
          Back to Dashboard
        </button>
      </header>

      <main className="manager-reservations-content">

        <div className="reservations-heading">
          <div>
            <h2>Reservations</h2>

            <p>
              View bookings and manage guest check-in and check-out.
            </p>
          </div>

          <button
            type="button"
            className="refresh-button"
            onClick={loadReservations}
          >
            Refresh
          </button>
        </div>

        {actionMessage && (
          <div className="reservation-success">
            {actionMessage}
          </div>
        )}

        {error ? (
          <div className="reservations-message error">

            <p>{error}</p>

            <button
              type="button"
              onClick={loadReservations}
            >
              Try Again
            </button>

          </div>
        ) : reservations.length === 0 ? (
          <div className="reservations-message">

            <h3>No reservations found</h3>

            <p>
              There are no reservations available at the moment.
            </p>

          </div>
        ) : (
          <div className="reservations-list">

            {reservations.map((reservation) => (

              <div
                className="reservation-card"
                key={reservation.reservationId}
              >

                <div className="reservation-top">

                  <div>
                    <span className="booking-label">
                      Booking Reference
                    </span>

                    <h3>
                      {reservation.bookingReference ||
                        `Reservation #${reservation.reservationId}`}
                    </h3>
                  </div>

                  <span
                    className={`reservation-status ${getStatusClass(
                      reservation.status
                    )}`}
                  >
                    {reservation.status}
                  </span>

                </div>

                <div className="reservation-details">

                  <div className="reservation-detail">
                    <span>Reservation ID</span>
                    <strong>
                      {reservation.reservationId}
                    </strong>
                  </div>

                  <div className="reservation-detail">
                    <span>Guest</span>
                    <strong>
                      {reservation.guestName || "Guest"}
                    </strong>
                  </div>

                  <div className="reservation-detail">
                    <span>Hotel</span>
                    <strong>
                      {reservation.hotel?.name || "-"}
                    </strong>
                  </div>

                  <div className="reservation-detail">
                    <span>Room</span>
                    <strong>
                      {reservation.rooms?.length > 0
                        ? reservation.rooms
                            .map(
                              (room) =>
                                room.roomNumber
                            )
                            .join(", ")
                        : "-"}
                    </strong>
                  </div>

                  <div className="reservation-detail">
                    <span>Check-in</span>
                    <strong>
                      {formatDate(
                        reservation.checkInDate
                      )}
                    </strong>
                  </div>

                  <div className="reservation-detail">
                    <span>Check-out</span>
                    <strong>
                      {formatDate(
                        reservation.checkOutDate
                      )}
                    </strong>
                  </div>

                  <div className="reservation-detail">
                    <span>Total Amount</span>
                    <strong>
                      ₹
                      {Number(
                        reservation.totalAmount || 0
                      ).toLocaleString("en-IN")}
                    </strong>
                  </div>

                  <div className="reservation-detail">
                    <span>Payment</span>
                    <strong>
                      {reservation.paymentStatus ||
                        "Pending"}
                    </strong>
                  </div>

                </div>

                <div className="reservation-actions">

                  {reservation.status === "Confirmed" && (
                    <button
                      type="button"
                      className="check-in-button"
                      onClick={() =>
                        handleCheckIn(
                          reservation.reservationId
                        )
                      }
                    >
                      Check In
                    </button>
                  )}

                  {reservation.status === "CheckedIn" && (
                    <button
                      type="button"
                      className="check-out-button"
                      onClick={() =>
                        handleCheckOut(
                          reservation.reservationId
                        )
                      }
                    >
                      Check Out
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

export default ManagerReservations;