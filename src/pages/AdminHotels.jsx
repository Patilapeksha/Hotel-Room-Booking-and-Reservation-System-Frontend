import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import "../styles/AdminHotels.css";

function AdminHotels() {
  const navigate = useNavigate();

  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    loadHotels();
  }, []);

  const loadHotels = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/AdminHotels");

      setHotels(response.data || []);
    } catch (error) {
      console.log(
        "Hotel moderation error:",
        error.response?.data
      );

      setError(
        error.response?.data?.message ||
          "Unable to load hotels."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleModeration = async (hotelId, action) => {
    try {
      setError("");
      setMessage("");

      const response = await api.put(
        `/AdminHotels/${hotelId}/${action}`
      );

      setHotels((currentHotels) =>
        currentHotels.map((hotel) =>
          hotel.id === hotelId
            ? {
                ...hotel,
                status:
                  action === "activate"
                    ? "Active"
                    : "Inactive",
              }
            : hotel
        )
      );

      setMessage(
        response.data?.message ||
          "Hotel status updated successfully."
      );
    } catch (error) {
      console.log(
        "Hotel moderation action error:",
        error.response?.data
      );

      setError(
        error.response?.data?.message ||
          "Unable to update hotel status."
      );
    }
  };

  if (loading) {
    return (
      <div className="admin-hotels-page">
        <div className="admin-hotels-message">
          Loading hotels...
        </div>
      </div>
    );
  }

  return (
    <div className="admin-hotels-page">

      <header className="admin-hotels-header">

        <div>
          <h1>Hotel Booking</h1>
          <p>Hotel Moderation</p>
        </div>

        <button
          type="button"
          onClick={() => navigate("/admin")}
        >
          Back to Dashboard
        </button>

      </header>

      <main className="admin-hotels-content">

        <div className="admin-hotels-heading">

          <div>
            <h2>Hotel Moderation</h2>

            <p>
              Review and manage registered hotels.
            </p>
          </div>

          <button
            type="button"
            className="refresh-hotels-button"
            onClick={loadHotels}
          >
            Refresh
          </button>

        </div>

        {message && (
          <div className="hotel-success">
            {message}
          </div>
        )}

        {error && (
          <div className="admin-hotels-message error">
            <p>{error}</p>

            <button
              type="button"
              onClick={loadHotels}
            >
              Try Again
            </button>
          </div>
        )}

        {!error && hotels.length === 0 && (
          <div className="admin-hotels-message">

            <h3>No hotels found</h3>

            <p>
              There are currently no hotels to moderate.
            </p>

          </div>
        )}

        {!error && hotels.length > 0 && (

          <div className="admin-hotels-grid">

            {hotels.map((hotel) => {

              const isActive =
                hotel.status === "Active";

              return (
                <div
                  className="admin-hotel-card"
                  key={hotel.id}
                >

                  <div className="admin-hotel-top">

                    <div className="admin-hotel-icon">
                      🏨
                    </div>

                  </div>

                  <h3>
                    {hotel.name || "Hotel"}
                  </h3>

                  <div className="admin-hotel-details">

                    <div>
                      <span>Hotel ID</span>

                      <strong>
                        {hotel.id}
                      </strong>
                    </div>

                    <div>
                      <span>City</span>

                      <strong>
                        {hotel.city || "-"}
                      </strong>
                    </div>

                    <div>
                      <span>Address</span>

                      <strong>
                        {hotel.address || "-"}
                      </strong>
                    </div>

                    <div>
                      <span>Status</span>

                      <strong
                        className={
                          isActive
                            ? "hotel-status active"
                            : "hotel-status inactive"
                        }
                      >
                        {hotel.status || "Active"}
                      </strong>
                    </div>

                  </div>

                  <div className="admin-hotel-actions">

                    {isActive ? (
                      <button
                        type="button"
                        className="deactivate-hotel-button"
                        onClick={() =>
                          handleModeration(
                            hotel.id,
                            "deactivate"
                          )
                        }
                      >
                        Deactivate
                      </button>
                    ) : (
                      <button
                        type="button"
                        className="activate-hotel-button"
                        onClick={() =>
                          handleModeration(
                            hotel.id,
                            "activate"
                          )
                        }
                      >
                        Activate
                      </button>
                    )}

                  </div>

                </div>
              );
            })}

          </div>

        )}

      </main>

    </div>
  );
}

export default AdminHotels;