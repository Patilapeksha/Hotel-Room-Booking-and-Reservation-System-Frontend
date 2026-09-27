import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./pages/Login";

import AdminDashboard from "./pages/AdminDashboard";
import AdminManagerApprovals from "./pages/AdminManagerApprovals";
import AdminHotels from "./pages/AdminHotels";
import AdminBookings from "./pages/AdminBookings";
import AdminPayouts from "./pages/AdminPayouts";
import AdminReports from "./pages/AdminReports";


import ManagerDashboard from "./pages/ManagerDashboard";
import ManageHotel from "./pages/ManageHotel";
import ManageRooms from "./pages/ManageRooms";
import ManagerReservations from "./pages/ManagerReservations";
import ManagerAvailability from "./pages/ManagerAvailability";
import ManagerPayouts from "./pages/ManagerPayouts";

import GuestDashboard from "./pages/GuestDashboard";
import GuestAccount from "./pages/GuestAccount";
import HotelSearch from "./pages/HotelSearch";
import HotelDetails from "./pages/HotelDetails";
import RoomSelection from "./pages/RoomSelection";
import RoomHold from "./pages/RoomHold";
import Checkout from "./pages/Checkout";

import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* Login */}
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />

        {/* ================= ADMIN ================= */}

        <Route
          path="/admin"
          element={
            <ProtectedRoute allowedRoles={["Admin"]}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />

         <Route
          path="/admin/manager-approvals"
          element={
            <ProtectedRoute allowedRoles={["Admin"]}>
              <AdminManagerApprovals />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/hotels"
          element={
            <ProtectedRoute allowedRoles={["Admin"]}>
              <AdminHotels />
            </ProtectedRoute>
          }
        />

         <Route
          path="/admin/bookings"
          element={
            <ProtectedRoute allowedRoles={["Admin"]}>
              <AdminBookings />
            </ProtectedRoute>
          }
        />

         <Route
          path="/admin/payouts"
          element={
            <ProtectedRoute allowedRoles={["Admin"]}>
              <AdminPayouts />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/reports"
          element={
            <ProtectedRoute allowedRoles={["Admin"]}>
              <AdminReports />
            </ProtectedRoute>
          }
        />




        {/* ================= HOTEL MANAGER ================= */}

        <Route
          path="/manager"
          element={
            <ProtectedRoute allowedRoles={["Hotel Manager"]}>
              <ManagerDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/manager/hotel"
          element={
            <ProtectedRoute allowedRoles={["Hotel Manager"]}>
              <ManageHotel />
            </ProtectedRoute>
          }
        />

        <Route
          path="/manager/rooms"
          element={
            <ProtectedRoute allowedRoles={["Hotel Manager"]}>
              <ManageRooms />
            </ProtectedRoute>
          }
        />

        <Route
          path="/manager/availability"
          element={
            <ProtectedRoute allowedRoles={["Hotel Manager"]}>
              <ManagerAvailability />
            </ProtectedRoute>
          }
        />

        <Route
          path="/manager/reservations"
          element={
            <ProtectedRoute allowedRoles={["Hotel Manager"]}>
              <ManagerReservations />
            </ProtectedRoute>
          }
        />

        <Route
          path="/manager/payouts"
          element={
            <ProtectedRoute allowedRoles={["Hotel Manager"]}>
              <ManagerPayouts />
            </ProtectedRoute>
          }
        />

        {/* ================= GUEST ================= */}

        <Route
          path="/guest"
          element={
            <ProtectedRoute allowedRoles={["Guest"]}>
              <GuestDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/guest/account"
          element={
            <ProtectedRoute allowedRoles={["Guest"]}>
              <GuestAccount />
            </ProtectedRoute>
          }
        />

        <Route
          path="/guest/search"
          element={
            <ProtectedRoute allowedRoles={["Guest"]}>
              <HotelSearch />
            </ProtectedRoute>
          }
        />

        <Route
          path="/guest/hotel/:id"
          element={
            <ProtectedRoute allowedRoles={["Guest"]}>
              <HotelDetails />
            </ProtectedRoute>
          }
        />

        <Route
          path="/guest/rooms/:id"
          element={
            <ProtectedRoute allowedRoles={["Guest"]}>
              <RoomSelection />
            </ProtectedRoute>
          }
        />

        <Route
          path="/guest/rooms/hold"
          element={
            <ProtectedRoute allowedRoles={["Guest"]}>
              <RoomHold />
            </ProtectedRoute>
          }
        />

        <Route
          path="/guest/checkout"
          element={
            <ProtectedRoute allowedRoles={["Guest"]}>
              <Checkout />
            </ProtectedRoute>
          }
        />

        {/* ================= ACCESS DENIED ================= */}

        <Route
          path="/forbidden"
          element={
            <div
              style={{
                padding: "50px",
                textAlign: "center",
              }}
            >
              <h1>403 - Access Denied</h1>
              <p>
                You do not have permission to access this page.
              </p>
            </div>
          }
        />

        {/* ================= FALLBACK ================= */}

        <Route
          path="*"
          element={<Login />}
        />

      </Routes>
    </BrowserRouter>
  );
}

export default App;