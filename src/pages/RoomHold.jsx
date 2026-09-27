import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import api from "../services/api";
import "../styles/RoomHold.css";

function RoomHold() {
  const location = useLocation();
  const navigate = useNavigate();

  const hotel = location.state?.hotel;
  const room = location.state?.room;

  const checkInDate =
    location.state?.checkInDate ||
    location.state?.checkIn;

  const checkOutDate =
    location.state?.checkOutDate ||
    location.state?.checkOut;

  const guests = location.state?.guests || 1;

  const [hold, setHold] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleHoldRoom = async () => {
    try {
      setLoading(true);
      setError("");

      if (!checkInDate || !checkOutDate) {
        setError(
          "Please select check-in and check-out dates first."
        );
        return;
      }

      const response = await api.post("/RoomHolds", {
        roomId: room.id,
        checkInDate,
        checkOutDate,
      });

      setHold(response.data);

    } catch (error) {
      console.log(
        "Room hold error:",
        error.response?.data
      );

      setError(
        error.response?.data?.message ||
          "Unable to hold the room."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    navigate(`/guest/rooms/${hotel.id}`, {
      state: {
        hotel,
        checkInDate,
        checkOutDate,
        guests,
      },
    });
  };

  if (!hotel || !room) {
    return (
      <div className="hold-page">

        <div className="hold-card">

          <h2>Booking details not found</h2>

          <button
            type="button"
            onClick={() => navigate("/guest/search")}
          >
            Back to Search
          </button>

        </div>

      </div>
    );
  }

  return (
    <div className="hold-page">

      <header className="hold-header">

        <div>
          <h1>Hotel Booking</h1>
          <p>Reservation Details</p>
        </div>

        <button
          type="button"
          onClick={handleBack}
        >
          Back
        </button>

      </header>

      <main className="hold-content">

        <div className="hold-card">

          <h2>Booking Details</h2>

          <div className="booking-details">

            <div>
              <span>Hotel</span>
              <strong>{hotel.name}</strong>
            </div>

            <div>
              <span>Location</span>
              <strong>{hotel.city}</strong>
            </div>

            <div>
              <span>Room</span>
              <strong>{room.roomNumber}</strong>
            </div>

            <div>
              <span>Room Type</span>
              <strong>{room.roomType}</strong>
            </div>

            <div>
              <span>Check-in</span>
              <strong>{checkInDate}</strong>
            </div>

            <div>
              <span>Check-out</span>
              <strong>{checkOutDate}</strong>
            </div>

            <div>
              <span>Guests</span>
              <strong>{guests}</strong>
            </div>

            <div>
              <span>Maximum Guests</span>
              <strong>{room.maxOccupancy}</strong>
            </div>

            <div>
              <span>Price per Night</span>
              <strong>
                ₹{Number(room.baseRate || 0).toLocaleString("en-IN")}
              </strong>
            </div>

          </div>

          {!hold && (
            <>
              <div className="hold-note">
                Your selected room will be held temporarily.
                You can then continue with payment.
              </div>

              {error && (
                <div className="hold-error">
                  {error}
                </div>
              )}

              <button
                type="button"
                className="hold-button"
                onClick={handleHoldRoom}
                disabled={loading}
              >
                {loading
                  ? "Holding Room..."
                  : "Hold Room"}
              </button>
            </>
          )}

          {hold && (
            <div className="hold-success">

              <h3>Room Held Successfully</h3>

              <p>
                Your room is temporarily reserved.
              </p>

              <p>
                Hold expires:
              </p>

              <strong>
                {hold.heldUntil
                  ? new Date(
                      hold.heldUntil
                    ).toLocaleString()
                  : "-"}
              </strong>

              <button
                type="button"
                className="continue-button"
                onClick={() =>
                  navigate("/guest/checkout", {
                    state: {
                      hotel,
                      room,
                      checkInDate,
                      checkOutDate,
                      guests,
                      hold,
                    },
                  })
                }
              >
                Continue to Payment
              </button>

            </div>
          )}

        </div>

      </main>

    </div>
  );
}

export default RoomHold;