import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import api from "../services/api";
import "../styles/RoomSelection.css";

function RoomSelection() {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const hotel = location.state?.hotel;

  const checkInDate =
    location.state?.checkInDate ||
    location.state?.checkIn;

  const checkOutDate =
    location.state?.checkOutDate ||
    location.state?.checkOut;

  const guests = location.state?.guests || 1;

  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadAvailableRooms();
  }, []);

  const loadAvailableRooms = async () => {
    try {
      setLoading(true);
      setError("");

      if (!checkInDate || !checkOutDate) {
        setError(
          "Please select check-in and check-out dates first."
        );
        return;
      }

      const response = await api.post("/Availability", {
        hotelId: Number(id),
        checkInDate,
        checkOutDate,
        guests: Number(guests),
      });

      setRooms(response.data?.availableRooms || []);

    } catch (error) {
      console.log(
        "Availability error:",
        error.response?.data
      );

      setError(
        error.response?.data?.message ||
          "Unable to load available rooms."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleSelectRoom = (room) => {
    navigate("/guest/rooms/hold", {
      state: {
        hotel,
        room,
        checkInDate,
        checkOutDate,
        guests,
      },
    });
  };

  return (
    <div className="room-selection-page">

      <header className="room-selection-header">

        <div>
          <h1>Hotel Booking</h1>
          <p>Available Rooms</p>
        </div>

        <button
          type="button"
          onClick={() =>
            navigate(`/guest/hotel/${id}`, {
              state: {
                hotel,
                checkIn: checkInDate,
                checkOut: checkOutDate,
                guests,
                availableRooms: rooms,
              },
            })
          }
        >
          Back
        </button>

      </header>

      <main className="room-selection-content">

        <section className="selection-summary">

          <h2>{hotel?.name || "Hotel"}</h2>

          <p>
            📍 {hotel?.city}
          </p>

          <div className="date-summary">

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

          </div>

        </section>

        <section className="available-room-section">

          <h2>Available Rooms</h2>

          {loading && (
            <div className="room-message">
              Checking room availability...
            </div>
          )}

          {error && !loading && (
            <div className="room-message error">
              {error}
            </div>
          )}

          {!loading &&
            !error &&
            rooms.length === 0 && (
              <div className="room-message">
                No rooms are available for the selected dates.
              </div>
            )}

          {!loading &&
            !error &&
            rooms.length > 0 && (

            <div className="available-room-list">

              {rooms.map((room) => (

                <div
                  className="available-room-card"
                  key={room.id}
                >

                  <div className="room-main-info">

                    <h3>
                      Room {room.roomNumber}
                    </h3>

                    <p>
                      Room Type: {room.roomType}
                    </p>

                    <p>
                      Maximum Guests: {room.maxOccupancy}
                    </p>

                  </div>

                  <div className="room-price-section">

                    <strong>
                      ₹
                      {Number(
                        room.baseRate || 0
                      ).toLocaleString("en-IN")}
                    </strong>

                    <span>
                      per night
                    </span>

                    <button
                      type="button"
                      onClick={() =>
                        handleSelectRoom(room)
                      }
                    >
                      Select Room
                    </button>

                  </div>

                </div>

              ))}

            </div>
          )}

        </section>

      </main>

    </div>
  );
}

export default RoomSelection;