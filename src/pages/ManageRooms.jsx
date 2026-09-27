import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import "../styles/ManageRooms.css";

function ManageRooms() {
  const navigate = useNavigate();

  const [rooms, setRooms] = useState([]);
  const [roomTypes, setRoomTypes] = useState([]);
  const [hotel, setHotel] = useState(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [showForm, setShowForm] = useState(false);
  const [editingRoom, setEditingRoom] = useState(null);

  const [roomNumber, setRoomNumber] = useState("");
  const [roomType, setRoomType] = useState("");
  const [baseRate, setBaseRate] = useState("");
  const [maxOccupancy, setMaxOccupancy] = useState("");
  const [status, setStatus] = useState("Active");

  const [message, setMessage] = useState("");

  useEffect(() => {
    loadRooms();
  }, []);

  const loadRooms = async () => {
    try {
      setLoading(true);
      setError("");
      setMessage("");

      const hotelResponse = await api.get("/Hotels");
      const hotels = hotelResponse.data || [];

      if (hotels.length === 0) {
        setError("No hotel found.");
        return;
      }

      const currentHotel = hotels[0];

      setHotel(currentHotel);

      const roomsResponse = await api.get(
        `/Rooms/${currentHotel.id}`
      );

      setRooms(roomsResponse.data || []);

      const roomTypesResponse = await api.get(
        `/RoomTypes/${currentHotel.id}`
      );

      setRoomTypes(roomTypesResponse.data || []);
    } catch (error) {
      console.log("Rooms error:", error.response?.data);

      setError(
        error.response?.data?.message ||
          "Unable to load rooms."
      );
    } finally {
      setLoading(false);
    }
  };

  const openAddForm = () => {
    setEditingRoom(null);

    setRoomNumber("");
    setRoomType("");
    setBaseRate("");
    setMaxOccupancy("");
    setStatus("Active");

    setMessage("");
    setShowForm(true);
  };

  const openEditForm = (room) => {
    setEditingRoom(room);

    setRoomNumber(room.roomNumber || "");

    const matchingRoomType = roomTypes.find(
      (type) => type.typeName === room.roomType
    );

    setRoomType(
      matchingRoomType
        ? String(matchingRoomType.id)
        : ""
    );

    setBaseRate(room.baseRate || "");
    setMaxOccupancy(room.maxOccupancy || "");
    setStatus(room.status || "Active");

    setMessage("");
    setShowForm(true);
  };

  const closeForm = () => {
    setShowForm(false);
    setEditingRoom(null);
    setMessage("");
  };

  const handleRoomTypeChange = (e) => {
    const selectedId = e.target.value;

    setRoomType(selectedId);

    const selectedType = roomTypes.find(
      (type) => String(type.id) === selectedId
    );

    if (selectedType) {
      setBaseRate(selectedType.baseRate);
      setMaxOccupancy(selectedType.maxOccupancy);
    } else {
      setBaseRate("");
      setMaxOccupancy("");
    }
  };

  const handleSaveRoom = async (e) => {
    e.preventDefault();

    setMessage("");
    setError("");

    if (!roomNumber.trim()) {
      setMessage("Please enter room number.");
      return;
    }

    if (!roomType) {
      setMessage("Please select a room type.");
      return;
    }

    if (!baseRate || Number(baseRate) <= 0) {
      setMessage("Please select a valid room type.");
      return;
    }

    if (!maxOccupancy || Number(maxOccupancy) <= 0) {
      setMessage("Please select a valid room type.");
      return;
    }

    if (!hotel) {
      setMessage("Hotel information is not available.");
      return;
    }

    try {
      if (editingRoom) {
        await api.put(
          `/Rooms/${editingRoom.id}`,
          null,
          {
            params: {
              roomNumber: roomNumber.trim(),
              roomTypeId: Number(roomType),
              status,
            },
          }
        );

        setMessage("Room updated successfully.");
      } else {
        await api.post(
          "/Rooms",
          null,
          {
            params: {
              hotelId: hotel.id,
              roomNumber: roomNumber.trim(),
              roomTypeId: Number(roomType),
              status,
            },
          }
        );

        setMessage("Room added successfully.");
      }

      setShowForm(false);
      setEditingRoom(null);

      await loadRooms();
    } catch (error) {
      console.log(
        "Save room error:",
        error.response?.data
      );

      setMessage(
        error.response?.data?.message ||
          "Unable to save room."
      );
    }
  };

  const handleChangeStatus = async (room) => {
    if (!roomTypes.length) {
      setMessage("Room types are not available.");
      return;
    }

    const matchingRoomType = roomTypes.find(
      (type) => type.typeName === room.roomType
    );

    if (!matchingRoomType) {
      setMessage("Room type information not found.");
      return;
    }

    const newStatus =
      room.status === "Inactive"
        ? "Active"
        : "Inactive";

    try {
      setError("");
      setMessage("");

      await api.put(
        `/Rooms/${room.id}`,
        null,
        {
          params: {
            roomNumber: room.roomNumber,
            roomTypeId: matchingRoomType.id,
            status: newStatus,
          },
        }
      );

      setMessage(
        `Room ${room.roomNumber} is now ${newStatus}.`
      );

      await loadRooms();
    } catch (error) {
      console.log(
        "Status update error:",
        error.response?.data
      );

      setMessage(
        error.response?.data?.message ||
          "Unable to change room status."
      );
    }
  };

  const activeRooms = rooms.filter(
    (room) => room.status !== "Inactive"
  );

  const inactiveRooms = rooms.filter(
    (room) => room.status === "Inactive"
  );

  if (loading) {
    return (
      <div className="manage-rooms-page">
        <div className="rooms-message">
          Loading rooms...
        </div>
      </div>
    );
  }

  return (
    <div className="manage-rooms-page">

      <header className="manage-rooms-header">

        <div>
          <h1>Hotel Booking</h1>
          <p>Manage Rooms</p>
        </div>

        <button
          type="button"
          onClick={() => navigate("/manager")}
        >
          Back to Dashboard
        </button>

      </header>

      <main className="manage-rooms-content">

        <div className="rooms-heading">

          <div>
            <h2>Rooms</h2>

            <p>
              Manage rooms in {hotel?.name}
            </p>
          </div>

          <button
            type="button"
            className="add-room-button"
            onClick={openAddForm}
          >
            + Add Room
          </button>

        </div>

        {error && (
          <div className="rooms-message error">
            {error}

            <button
              type="button"
              onClick={loadRooms}
            >
              Try Again
            </button>
          </div>
        )}

        {message && !error && (
          <div className="success-message">
            {message}
          </div>
        )}

        {!error && (
          <>
            <div className="rooms-summary">

              <div className="summary-box">
                <span>Total Rooms</span>
                <strong>{rooms.length}</strong>
              </div>

              <div className="summary-box">
                <span>Active Rooms</span>
                <strong>{activeRooms.length}</strong>
              </div>

              <div className="summary-box">
                <span>Inactive Rooms</span>
                <strong>{inactiveRooms.length}</strong>
              </div>

            </div>

            {rooms.length === 0 ? (
              <div className="rooms-message">

                <h3>No rooms found</h3>

                <p>
                  Add a room to start managing your hotel rooms.
                </p>

                <button
                  type="button"
                  onClick={openAddForm}
                >
                  Add First Room
                </button>

              </div>
            ) : (
              <div className="rooms-grid">

                {rooms.map((room) => (

                  <div
                    className={`room-card ${
                      room.status === "Inactive"
                        ? "inactive-room"
                        : ""
                    }`}
                    key={room.id}
                  >

                    <div className="room-card-header">

                      <div className="room-icon">
                        🛏️
                      </div>

                      <span
                        className={`room-status ${
                          room.status === "Inactive"
                            ? "inactive"
                            : ""
                        }`}
                      >
                        {room.status === "Inactive"
                          ? "Inactive"
                          : "Active"}
                      </span>

                    </div>

                    <h3>
                      Room {room.roomNumber}
                    </h3>

                    <div className="room-details">

                      <div className="room-detail">
                        <span>Room Type</span>

                        <strong>
                          {room.roomType}
                        </strong>
                      </div>

                      <div className="room-detail">
                        <span>Base Rate</span>

                        <strong>
                          ₹
                          {Number(
                            room.baseRate || 0
                          ).toLocaleString("en-IN")}
                        </strong>
                      </div>

                      <div className="room-detail">
                        <span>Maximum Guests</span>

                        <strong>
                          {room.maxOccupancy}
                        </strong>
                      </div>

                      <div className="room-detail">
                        <span>Availability</span>

                        <strong
                          className={
                            room.status === "Inactive"
                              ? "not-available"
                              : "available"
                          }
                        >
                          {room.status === "Inactive"
                            ? "Not Available"
                            : "Available"}
                        </strong>
                      </div>

                    </div>

                    <div className="room-actions">

                      <button
                        type="button"
                        onClick={() =>
                          openEditForm(room)
                        }
                      >
                        Edit Room
                      </button>

                      <button
                        type="button"
                        className="status-button"
                        onClick={() =>
                          handleChangeStatus(room)
                        }
                      >
                        {room.status === "Inactive"
                          ? "Activate"
                          : "Deactivate"}
                      </button>

                    </div>

                  </div>

                ))}

              </div>
            )}
          </>
        )}

      </main>

      {showForm && (
        <div className="room-modal">

          <div className="room-form-box">

            <div className="room-form-header">

              <div>
                <h2>
                  {editingRoom
                    ? "Edit Room"
                    : "Add Room"}
                </h2>

                <p>
                  Enter room information below.
                </p>
              </div>

              <button
                type="button"
                className="close-button"
                onClick={closeForm}
              >
                ×
              </button>

            </div>

            <form onSubmit={handleSaveRoom}>

              <div className="form-group">

                <label>
                  Room Number
                </label>

                <input
                  type="text"
                  value={roomNumber}
                  onChange={(e) =>
                    setRoomNumber(e.target.value)
                  }
                  placeholder="Example: 101"
                />

              </div>

              <div className="form-group">

                <label>
                  Room Type
                </label>

                <select
                  value={roomType}
                  onChange={handleRoomTypeChange}
                >
                  <option value="">
                    Select Room Type
                  </option>

                  {roomTypes.map((type) => (
                    <option
                      key={type.id}
                      value={type.id}
                    >
                      {type.typeName}
                    </option>
                  ))}
                </select>

              </div>

              <div className="form-row">

                <div className="form-group">

                  <label>
                    Base Rate
                  </label>

                  <input
                    type="number"
                    value={baseRate}
                    readOnly
                  />

                </div>

                <div className="form-group">

                  <label>
                    Maximum Guests
                  </label>

                  <input
                    type="number"
                    value={maxOccupancy}
                    readOnly
                  />

                </div>

              </div>

              <div className="form-group">

                <label>
                  Status
                </label>

                <select
                  value={status}
                  onChange={(e) =>
                    setStatus(e.target.value)
                  }
                >
                  <option value="Active">
                    Active
                  </option>

                  <option value="Inactive">
                    Inactive
                  </option>
                </select>

              </div>

              {message && (
                <div className="form-error">
                  {message}
                </div>
              )}

              <div className="form-actions">

                <button
                  type="button"
                  className="cancel-button"
                  onClick={closeForm}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="save-button"
                >
                  {editingRoom
                    ? "Update Room"
                    : "Add Room"}
                </button>

              </div>

            </form>

          </div>

        </div>
      )}

    </div>
  );
}

export default ManageRooms;