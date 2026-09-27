import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import "../styles/ManageHotel.css";

function ManageHotel() {
  const navigate = useNavigate();

  const [hotel, setHotel] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    getHotel();
  }, []);

  const getHotel = async () => {
    try {
      const response = await api.get("/Hotels");

      if (response.data && response.data.length > 0) {
        setHotel(response.data[0]);
      } else {
        setError("No hotel found.");
      }
    } catch (error) {
      console.log(error);

      setError(
        error.response?.data?.message ||
          "Unable to load hotel information."
      );
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="manage-hotel-page">
        <div className="loading-box">
          Loading hotel information...
        </div>
      </div>
    );
  }

  return (
    <div className="manage-hotel-page">

      <header className="manage-hotel-header">

        <div>
          <h1>Hotel Booking</h1>
          <p>Manage Hotel</p>
        </div>

        <button
          type="button"
          onClick={() => navigate("/manager")}
        >
          Back to Dashboard
        </button>

      </header>


      <main className="manage-hotel-content">

        <div className="page-heading">

          <h2>My Hotel</h2>

          <p>
            View and manage your hotel information.
          </p>

        </div>


        {error ? (

          <div className="error-box">
            {error}
          </div>

        ) : (

          <div className="hotel-card">

            <div className="hotel-title">

              <div className="hotel-icon">
                🏨
              </div>

              <div>
                <h3>{hotel?.name}</h3>
                <p>{hotel?.city}</p>
              </div>

            </div>


            <div className="hotel-information">

              <div className="information-box">

                <span>Hotel ID</span>

                <strong>
                  {hotel?.id}
                </strong>

              </div>


              <div className="information-box">

                <span>Hotel Name</span>

                <strong>
                  {hotel?.name}
                </strong>

              </div>


              <div className="information-box">

                <span>City</span>

                <strong>
                  {hotel?.city}
                </strong>

              </div>


              <div className="information-box">

                <span>Address</span>

                <strong>
                  {hotel?.address}
                </strong>

              </div>


              <div className="information-box">

                <span>Status</span>

                <strong className="status">
                  Active
                </strong>

              </div>

            </div>


            <div className="hotel-buttons">

              <button
                type="button"
                onClick={() =>
                  alert("Edit Hotel will be added later.")
                }
              >
                Edit Hotel
              </button>

              <button
                type="button"
                className="back-button"
                onClick={() => navigate("/manager")}
              >
                Back to Dashboard
              </button>

            </div>

          </div>

        )}

      </main>

    </div>
  );
}

export default ManageHotel;