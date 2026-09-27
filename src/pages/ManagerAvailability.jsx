import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import "../styles/ManagerAvailability.css";

function ManagerAvailability() {
  const navigate = useNavigate();

  const [hotel, setHotel] = useState(null);
  const [rooms, setRooms] = useState([]);
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    loadHotel();
  }, []);

  const loadHotel = async () => {
    try {
      const response = await api.get("/Hotels");

      const hotels = response.data || [];

      if (hotels.length > 0) {
        setHotel(hotels[0]);
      }
    } catch (err) {
      setError("Unable to load hotel information.");
    }
  };

  const searchAvailability = async (e) => {
    e.preventDefault();

    setError("");
    setSearched(false);

    // Make sure both dates are selected
    if (!checkIn || !checkOut) {
      setError("Please select both check-in and check-out dates.");
      return;
    }

    // Compare the actual YYYY-MM-DD strings
    if (checkOut <= checkIn) {
      setError("Check-out date must be after check-in date.");
      return;
    }

    if (!hotel) {
      setError("Hotel information is not available.");
      return;
    }

    try {
      setLoading(true);

      const response = await api.post("/Availability", {
        hotelId: hotel.id || hotel.hotelId,
        checkInDate: checkIn,
        checkOutDate: checkOut,
        guests: 1,
      });

      const availableRooms =
        response.data?.availableRooms ||
        response.data?.rooms ||
        [];

      setRooms(availableRooms);
      setSearched(true);

    } catch (err) {
      setRooms([]);

      setError(
        err.response?.data?.message ||
        "Unable to check room availability."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="manager-availability">

      <header className="availability-header">
        <div>
          <h1>Hotel Booking</h1>
          <p>Availability Calendar</p>
        </div>

        <button
          type="button"
          onClick={() => navigate("/manager")}
        >
          Back to Dashboard
        </button>
      </header>

      <main className="availability-content">

        <section className="availability-card">

          <h2>Check Room Availability</h2>

          {hotel && (
            <p className="hotel-name">
              Hotel: <strong>{hotel.name}</strong>
            </p>
          )}

          <form onSubmit={searchAvailability}>

            <div className="availability-fields">

              <div>
                <label>Check-in Date</label>

                <input
                  type="date"
                  value={checkIn}
                  onChange={(e) => setCheckIn(e.target.value)}
                />
              </div>

              <div>
                <label>Check-out Date</label>

                <input
                  type="date"
                  value={checkOut}
                  onChange={(e) => setCheckOut(e.target.value)}
                />
              </div>

              <button
                type="submit"
                disabled={loading}
              >
                {loading ? "Checking..." : "Check Availability"}
              </button>

            </div>

          </form>

          {error && (
            <div className="availability-error">
              {error}
            </div>
          )}

        </section>

        {searched && !loading && (
          <section className="rooms-section">

            <h2>Available Rooms</h2>

            {rooms.length === 0 ? (
              <div className="no-rooms">
                No available rooms found for these dates.
              </div>
            ) : (
              <div className="rooms-list">

                {rooms.map((room, index) => (
                  <div
                    className="availability-room"
                    key={room.roomId || room.id || index}
                  >

                    <div>
                      <h3>
                        Room {room.roomNumber || room.number || "-"}
                      </h3>

                      <p>
                        Room Type:{" "}
                        {room.roomTypeName ||
                          room.roomType ||
                          "Standard"}
                      </p>

                      <p>
                        Price: ₹
                        {room.baseRate ||
                          room.price ||
                          0}{" "}
                        / night
                      </p>
                    </div>

                    <span className="available-status">
                      Available
                    </span>

                  </div>
                ))}

              </div>
            )}

          </section>
        )}

      </main>

    </div>
  );
}

export default ManagerAvailability;