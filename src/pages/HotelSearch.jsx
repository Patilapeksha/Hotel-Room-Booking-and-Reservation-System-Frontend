import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import "../styles/HotelSearch.css";

function HotelSearch() {
  const navigate = useNavigate();

  const [city, setCity] = useState("");
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [guests, setGuests] = useState(1);

  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    loadHotels();
  }, []);

  const loadHotels = async () => {
    try {
      const response = await api.get("/Hotels");

      setHotels(response.data || []);
    } catch (err) {
      console.log("Hotels error:", err.response?.data);

      setError("Unable to load hotels.");
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();

    setError("");
    setSearched(false);

    if (!city || !checkIn || !checkOut) {
      setError(
        "Please enter city, check-in and check-out dates."
      );
      return;
    }

    if (checkOut <= checkIn) {
      setError(
        "Check-out date must be after check-in date."
      );
      return;
    }

    if (guests < 1) {
      setError("Guests must be at least 1.");
      return;
    }

    try {
      setLoading(true);

      const matchingHotels = hotels.filter(
        (hotel) =>
          hotel.city?.toLowerCase() ===
          city.trim().toLowerCase()
      );

      const availableHotels = [];

      for (const hotel of matchingHotels) {
        try {
          const response = await api.post(
            "/Availability",
            {
              hotelId: hotel.id,
              checkInDate: checkIn,
              checkOutDate: checkOut,
              guests: Number(guests),
            }
          );

          const availableRooms =
            response.data?.availableRooms || [];

          if (availableRooms.length > 0) {
            availableHotels.push({
              ...hotel,
              availableRooms,
            });
          }
        } catch (err) {
          console.log(
            `Availability error for hotel ${hotel.id}:`,
            err.response?.data
          );
        }
      }

      setHotels(
        matchingHotels.map((hotel) => {
          const availableHotel =
            availableHotels.find(
              (item) => item.id === hotel.id
            );

          return {
            ...hotel,
            availableRooms:
              availableHotel?.availableRooms || [],
          };
        })
      );

      setSearched(true);

      if (availableHotels.length === 0) {
        setError(
          "No available rooms found for the selected dates."
        );
      }

    } catch (err) {
      console.log("Search error:", err);

      setError(
        "Unable to search hotels. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleHotelClick = (hotel) => {
    navigate(`/guest/hotel/${hotel.id}`, {
      state: {
        hotel,
        city,
        checkIn,
        checkOut,
        guests: Number(guests),
        availableRooms: hotel.availableRooms || [],
      },
    });
  };

  return (
    <div className="hotel-search-page">

      <header className="hotel-search-header">

        <div>
          <h1>Hotel Booking</h1>
          <p>Search Hotels</p>
        </div>

        <button
          type="button"
          onClick={() => navigate("/guest")}
        >
          Back to Dashboard
        </button>

      </header>

      <main className="hotel-search-content">

        <section className="hotel-search-box">

          <h2>Search Available Hotels</h2>

          <form onSubmit={handleSearch}>

            <div className="search-fields">

              <div className="search-field">
                <label>City</label>

                <input
                  type="text"
                  value={city}
                  onChange={(e) =>
                    setCity(e.target.value)
                  }
                  placeholder="Enter city"
                />
              </div>

              <div className="search-field">
                <label>Check-in</label>

                <input
                  type="date"
                  value={checkIn}
                  onChange={(e) =>
                    setCheckIn(e.target.value)
                  }
                />
              </div>

              <div className="search-field">
                <label>Check-out</label>

                <input
                  type="date"
                  value={checkOut}
                  onChange={(e) =>
                    setCheckOut(e.target.value)
                  }
                />
              </div>

              <div className="search-field">
                <label>Guests</label>

                <input
                  type="number"
                  min="1"
                  value={guests}
                  onChange={(e) =>
                    setGuests(Number(e.target.value))
                  }
                />
              </div>

            </div>

            {error && (
              <p className="search-error">
                {error}
              </p>
            )}

            <button
              type="submit"
              className="search-button"
              disabled={loading}
            >
              {loading
                ? "Searching..."
                : "Search Hotels"}
            </button>

          </form>

        </section>

        {searched && !loading && (
          <section className="hotel-results">

            <h2>Available Hotels</h2>

            {hotels.filter(
              (hotel) =>
                hotel.availableRooms?.length > 0
            ).length === 0 ? (

              <div className="no-results">
                <h3>No hotels available</h3>

                <p>
                  No rooms are available for the
                  selected dates.
                </p>
              </div>

            ) : (

              <div className="hotel-results-list">

                {hotels
                  .filter(
                    (hotel) =>
                      hotel.availableRooms?.length > 0
                  )
                  .map((hotel) => (

                    <div
                      className="hotel-result-card"
                      key={hotel.id}
                    >

                      <div>
                        <h3>{hotel.name}</h3>

                        <p>
                          {hotel.city}
                        </p>

                        <p>
                          {hotel.address}
                        </p>

                        <span>
                          {
                            hotel.availableRooms
                              .length
                          }{" "}
                          room(s) available
                        </span>
                      </div>

                      <button
                        type="button"
                        onClick={() =>
                          handleHotelClick(hotel)
                        }
                      >
                        View Rooms
                      </button>

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

export default HotelSearch;