import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import "../styles/AdminBookings.css";

function AdminBookings() {
  const navigate = useNavigate();

  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadBookings();
  }, []);

  const loadBookings = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/AdminBookings");

      setBookings(response.data || []);
    } catch (error) {
      console.log(
        "Booking oversight error:",
        error.response?.data
      );

      setError(
        error.response?.data?.message ||
          "Unable to load bookings."
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
      <div className="admin-bookings-page">
        <div className="admin-bookings-message">
          Loading bookings...
        </div>
      </div>
    );
  }

  return (
    <div className="admin-bookings-page">

      <header className="admin-bookings-header">

        <div>
          <h1>Hotel Booking</h1>
          <p>Booking Oversight</p>
        </div>

        <button
          type="button"
          onClick={() => navigate("/admin")}
        >
          Back to Dashboard
        </button>

      </header>

      <main className="admin-bookings-content">

        <div className="admin-bookings-heading">

          <div>
            <h2>Booking Oversight</h2>

            <p>
              Monitor reservations, guests and payment status.
            </p>
          </div>

          <button
            type="button"
            className="refresh-bookings-button"
            onClick={loadBookings}
          >
            Refresh
          </button>

        </div>

        {error && (
          <div className="admin-bookings-message error">
            {error}
          </div>
        )}

        {!error && bookings.length === 0 && (
          <div className="admin-bookings-message">
            <h3>No bookings found</h3>

            <p>
              There are currently no reservations to display.
            </p>
          </div>
        )}

        {!error && bookings.length > 0 && (
          <div className="admin-bookings-list">

            {bookings.map((booking) => (

              <div
                className="admin-booking-card"
                key={booking.id}
              >

                <div className="booking-card-header">

                  <div>
                    <h3>
                      {booking.bookingReference}
                    </h3>

                    <span>
                      Booking ID: {booking.id}
                    </span>
                  </div>

                  <span className="booking-status">
                    {booking.status}
                  </span>

                </div>

                <div className="booking-details">

                  <div>
                    <span>Guest</span>
                    <strong>
                      {booking.guestName || "-"}
                    </strong>
                  </div>

                  <div>
                    <span>Email</span>
                    <strong>
                      {booking.guestEmail || "-"}
                    </strong>
                  </div>

                  <div>
                    <span>Hotel</span>
                    <strong>
                      {booking.hotelName || "-"}
                    </strong>
                  </div>

                  <div>
                    <span>City</span>
                    <strong>
                      {booking.hotelCity || "-"}
                    </strong>
                  </div>

                  <div>
                    <span>Check-in</span>
                    <strong>
                      {formatDate(booking.checkInDate)}
                    </strong>
                  </div>

                  <div>
                    <span>Check-out</span>
                    <strong>
                      {formatDate(booking.checkOutDate)}
                    </strong>
                  </div>

                  <div>
                    <span>Amount</span>
                    <strong>
                      ₹{booking.totalAmount}
                    </strong>
                  </div>

                  <div>
                    <span>Payment</span>
                    <strong>
                      {booking.paymentStatus || "Pending"}
                    </strong>
                  </div>

                </div>

                <div className="booking-rooms">

                  <span>Room(s)</span>

                  {booking.rooms?.length > 0 ? (
                    booking.rooms.map((room) => (
                      <span
                        className="room-tag"
                        key={room.roomId}
                      >
                        Room {room.roomNumber}
                      </span>
                    ))
                  ) : (
                    <span>-</span>
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

export default AdminBookings;