import { useLocation, useNavigate } from "react-router-dom";
import "../styles/HotelDetails.css";

function HotelDetails() {
  const navigate = useNavigate();
  const location = useLocation();

  const {
    hotel,
    checkIn,
    checkOut,
    guests,
    availableRooms = [],
  } = location.state || {};

  if (!hotel) {
    return (
      <div className="hotel-details-page">
        <div className="hotel-details-message">
          <h2>Hotel details not available</h2>

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

  const handleViewRooms = () => {
    navigate(`/guest/rooms/${hotel.id}`, {
      state: {
        hotel,
        checkIn,
        checkOut,
        guests,
        availableRooms,
      },
    });
  };

  return (
    <div className="hotel-details-page">

      <header className="hotel-details-header">

        <div>
          <h1>Hotel Booking</h1>
          <p>Hotel Details</p>
        </div>

        <button
          type="button"
          onClick={() => navigate("/guest/search")}
        >
          Back to Search
        </button>

      </header>

      <main className="hotel-details-content">

        <section className="hotel-info-card">

          <div className="hotel-info">

            <h2>{hotel.name}</h2>

            <p>
              <strong>City:</strong> {hotel.city}
            </p>

            <p>
              <strong>Address:</strong> {hotel.address}
            </p>

            <p>
              <strong>Status:</strong> {hotel.status || "Active"}
            </p>

          </div>

          <div className="booking-info">

            <h3>Search Details</h3>

            <p>
              <strong>Check-in:</strong> {checkIn}
            </p>

            <p>
              <strong>Check-out:</strong> {checkOut}
            </p>

            <p>
              <strong>Guests:</strong> {guests}
            </p>

          </div>

        </section>

        <section className="available-room-summary">

          <div>
            <h2>Available Rooms</h2>

            <p>
              {availableRooms.length} room(s) available
              for your selected dates.
            </p>
          </div>

          <button
            type="button"
            onClick={handleViewRooms}
            disabled={availableRooms.length === 0}
          >
            View Rooms
          </button>

        </section>

      </main>

    </div>
  );
}

export default HotelDetails;