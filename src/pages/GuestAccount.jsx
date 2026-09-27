import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";
import "../styles/GuestAccount.css";

function GuestAccount() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

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

  const handleCancel = async (reservationId) => {
    const confirmed = window.confirm(
      "Are you sure you want to cancel this reservation?"
    );

    if (!confirmed) {
      return;
    }

    try {
      await api.put(
        `/Reservations/${reservationId}/cancel`
      );

      loadReservations();
    } catch (error) {
      alert(
        error.response?.data?.message ||
          "Unable to cancel reservation."
      );
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
    <div className="guest-account-page">

      <header className="guest-account-header">

        <div>
          <h1>Hotel Booking</h1>
          <p>My Account</p>
        </div>

        <button
          type="button"
          onClick={() => navigate("/guest")}
        >
          Back to Dashboard
        </button>

      </header>

      <main className="guest-account-content">

        <section className="profile-card">

          <h2>My Profile</h2>

          <div className="profile-details">

            <div>
              <span>Name</span>
              <strong>{user?.name || "-"}</strong>
            </div>

            <div>
              <span>Email</span>
              <strong>{user?.email || "-"}</strong>
            </div>

            <div>
              <span>Role</span>
              <strong>{user?.role || "-"}</strong>
            </div>

          </div>

        </section>

        <section className="reservations-section">

          <div className="section-heading">

            <div>
              <h2>My Reservations</h2>
              <p>View and manage your hotel bookings.</p>
            </div>

            <button
              type="button"
              onClick={() => navigate("/guest/search")}
            >
              Book a Room
            </button>

          </div>

          {loading && (
            <div className="account-message">
              Loading reservations...
            </div>
          )}

          {error && !loading && (
            <div className="account-message error">
              {error}

              <button
                type="button"
                onClick={loadReservations}
              >
                Try Again
              </button>
            </div>
          )}

          {!loading &&
            !error &&
            reservations.length === 0 && (

            <div className="account-message">

              <h3>No Reservations</h3>

              <p>
                You have not made any reservations yet.
              </p>

              <button
                type="button"
                onClick={() =>
                  navigate("/guest/search")
                }
              >
                Search Hotels
              </button>

            </div>
          )}

          {!loading &&
            !error &&
            reservations.length > 0 && (

            <div className="reservation-list">

              {reservations.map((reservation) => (

                <div
                  className="reservation-card"
                  key={reservation.reservationId}
                >

                  <div className="reservation-top">

                    <div>
                      <span>
                        Booking Reference
                      </span>

                      <strong>
                        {reservation.bookingReference ||
                          `Reservation #${reservation.reservationId}`}
                      </strong>
                    </div>

                    <span className="reservation-status">
                      {reservation.status || "Unknown"}
                    </span>

                  </div>

                  <div className="reservation-details">

                    <div>
                      <span>Hotel</span>

                      <strong>
                        {reservation.hotel?.name || "-"}
                      </strong>

                      <small>
                        📍{" "}
                        {reservation.hotel?.city || "-"}
                      </small>
                    </div>

                    <div>
                      <span>Room</span>

                      {reservation.rooms?.length > 0 ? (
                        reservation.rooms.map((room) => (
                          <strong key={room.roomId}>
                            {room.roomNumber} -{" "}
                            {room.roomType}
                          </strong>
                        ))
                      ) : (
                        <strong>-</strong>
                      )}
                    </div>

                    <div>
                      <span>Check-in</span>

                      <strong>
                        {formatDate(
                          reservation.checkInDate
                        )}
                      </strong>
                    </div>

                    <div>
                      <span>Check-out</span>

                      <strong>
                        {formatDate(
                          reservation.checkOutDate
                        )}
                      </strong>
                    </div>

                    <div>
                      <span>Total Amount</span>

                      <strong>
                        ₹
                        {formatAmount(
                          reservation.totalAmount
                        )}
                      </strong>
                    </div>

                    <div>
                      <span>Payment</span>

                      <strong>
                        {reservation.paymentStatus ||
                          "Not Paid"}
                      </strong>
                    </div>

                  </div>

                  {reservation.status !== "Cancelled" &&
                    reservation.status !== "Completed" && (

                    <div className="reservation-actions">

                      <button
                        type="button"
                        className="cancel-button"
                        onClick={() =>
                          handleCancel(
                            reservation.reservationId
                          )
                        }
                      >
                        Cancel Reservation
                      </button>

                    </div>
                  )}

                </div>

              ))}

            </div>
          )}

        </section>

      </main>

    </div>
  );
}

export default GuestAccount;