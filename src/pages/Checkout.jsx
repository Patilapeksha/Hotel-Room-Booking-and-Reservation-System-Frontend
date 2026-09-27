import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import api from "../services/api";
import "../styles/Checkout.css";

function Checkout() {
  const location = useLocation();
  const navigate = useNavigate();

  const hotel = location.state?.hotel;
  const room = location.state?.room;
  const checkInDate = location.state?.checkInDate;
  const checkOutDate = location.state?.checkOutDate;
  const hold = location.state?.hold;

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(null);

  const calculateNights = () => {
    if (!checkInDate || !checkOutDate) {
      return 0;
    }

    const start = new Date(checkInDate);
    const end = new Date(checkOutDate);

    return Math.round(
      (end - start) / (1000 * 60 * 60 * 24)
    );
  };

  const nights = calculateNights();

  const totalAmount =
    nights * Number(room?.baseRate || 0);

  const handlePayment = async () => {
    try {
      setLoading(true);
      setError("");

      if (!room) {
        setError("Room information is missing.");
        return;
      }

      if (!hold?.holdId) {
        setError("Room hold information is missing.");
        return;
      }

      if (!checkInDate || !checkOutDate) {
        setError("Booking dates are missing.");
        return;
      }

      // Temporary debug information
      console.log("BOOKING DATA:", {
        roomId: room.id,
        roomNumber: room.roomNumber,
        holdId: hold.holdId,
        checkInDate: checkInDate,
        checkOutDate: checkOutDate
      });

      // Create reservation
      const reservationResponse = await api.post(
        "/Reservations",
        {
          roomId: room.id,
          holdId: hold.holdId,
          checkInDate: checkInDate,
          checkOutDate: checkOutDate
        }
      );

      const reservation = reservationResponse.data;

      console.log(
        "RESERVATION RESPONSE:",
        reservation
      );

      // Make payment
      const paymentResponse = await api.post(
  "/Payments",
  {
    reservationId: reservation.reservationId,
    paymentSuccessful: true
  }
);

      console.log(
        "PAYMENT RESPONSE:",
        paymentResponse.data
      );

      setSuccess(paymentResponse.data);

    } catch (error) {
      console.log(
        "PAYMENT ERROR:",
        error.response?.data
      );

      setError(
        error.response?.data?.message ||
          "Unable to complete the booking."
      );
    } finally {
      setLoading(false);
    }
  };

  if (!hotel || !room || !hold) {
    return (
      <div className="checkout-message">
        <h2>Booking information not found.</h2>

        <button
          type="button"
          onClick={() => navigate("/guest/search")}
        >
          Back to Search
        </button>
      </div>
    );
  }

  return (
    <div className="checkout-page">

      <header className="checkout-header">
        <div>
          <h1>Hotel Booking</h1>
          <p>Checkout & Payment</p>
        </div>
      </header>

      <main className="checkout-content">

        {!success ? (

          <section className="checkout-card">

            <h2>Booking Summary</h2>

            <div className="checkout-details">

              <div>
                <span>Hotel</span>
                <strong>
                  {hotel.name}
                </strong>
              </div>

              <div>
                <span>Location</span>
                <strong>
                  {hotel.city}
                </strong>
              </div>

              <div>
                <span>Room</span>
                <strong>
                  {room.roomNumber}
                </strong>
              </div>

              <div>
                <span>Room Type</span>
                <strong>
                  {room.roomType}
                </strong>
              </div>

              <div>
                <span>Check-in</span>
                <strong>
                  {checkInDate}
                </strong>
              </div>

              <div>
                <span>Check-out</span>
                <strong>
                  {checkOutDate}
                </strong>
              </div>

              <div>
                <span>Nights</span>
                <strong>
                  {nights}
                </strong>
              </div>

              <div>
                <span>Price per Night</span>
                <strong>
                  ₹{room.baseRate}
                </strong>
              </div>

              <div className="total-row">
                <span>Total Amount</span>

                <strong>
                  ₹{totalAmount}
                </strong>
              </div>

            </div>

            <div className="payment-info">

              <h3>Payment</h3>

              <p>
                This assignment uses a simulated
                payment gateway.
              </p>

              <p>
                Clicking the button will create the
                reservation and confirm the payment.
              </p>

              <p>
                Your room hold is valid for 10 minutes.
              </p>

            </div>

            {error && (
              <div className="checkout-error">
                {error}
              </div>
            )}

            <button
              type="button"
              className="payment-button"
              onClick={handlePayment}
              disabled={loading}
            >
              {loading
                ? "Processing Payment..."
                : `Pay ₹${totalAmount}`}
            </button>

          </section>

        ) : (

          <section className="success-card">

            <div className="success-icon">
              ✓
            </div>

            <h2>
              Booking Confirmed
            </h2>

            <p>
              Your hotel reservation has been
              successfully confirmed.
            </p>

            <div className="confirmation-details">

              <div>
                <span>Booking Reference</span>

                <strong>
                  {success.bookingReference}
                </strong>
              </div>

              <div>
                <span>Hotel</span>

                <strong>
                  {hotel.name}
                </strong>
              </div>

              <div>
                <span>Location</span>

                <strong>
                  {hotel.city}
                </strong>
              </div>

              <div>
                <span>Room</span>

                <strong>
                  {room.roomNumber}
                </strong>
              </div>

              <div>
                <span>Check-in</span>

                <strong>
                  {checkInDate}
                </strong>
              </div>

              <div>
                <span>Check-out</span>

                <strong>
                  {checkOutDate}
                </strong>
              </div>

              <div>
                <span>Amount Paid</span>

                <strong>
                  ₹{success.amount}
                </strong>
              </div>

              <div>
                <span>Payment Status</span>

                <strong>
                  {success.paymentStatus}
                </strong>
              </div>

              <div>
                <span>Reservation Status</span>

                <strong>
                  {success.reservationStatus}
                </strong>
              </div>

            </div>

            <button
              type="button"
              className="dashboard-button"
              onClick={() =>
                navigate("/guest")
              }
            >
              Back to Dashboard
            </button>

          </section>

        )}

      </main>

    </div>
  );
}

export default Checkout;