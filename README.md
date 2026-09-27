Hotel Room Booking & Reservation System

1. Project Overview

Hotel Room Booking & Reservation System is a full-stack web application for managing hotels, rooms, availability, reservations and payments.

The system provides separate workflows for:

- Admin
- Hotel Manager
- Guest

The application includes authentication, role-based authorization, hotel and room management, availability checking, room holds, reservations and mock payment processing.

---

2. Technology Stack

Backend

- ASP.NET Core 8 Web API
- C#
- Entity Framework Core
- SQL Server
- JWT Authentication
- Swagger / OpenAPI

Frontend

- React
- Vite
- JavaScript
- Axios
- React Router

Database

- SQL Server
- Entity Framework Core Migrations

---

3. Project Structure

Hotel-Room-Booking-System/
│
├── HotelBooking.Api/
│   ├── Controllers/
│   ├── Data/
│   ├── Models/
│   ├── DTOs/
│   ├── Services/
│   ├── Middleware/
│   ├── Program.cs
│   ├── appsettings.json
│   └── HotelBooking.Api.csproj
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── context/
│   │   ├── pages/
│   │   ├── styles/
│   │   └── App.jsx
│   └── package.json
│
└── README.md

---

4. Main Features

Authentication

- User registration
- Login
- JWT-based authentication
- Password hashing
- Role-based access control
- Protected frontend routes

Admin

- Manager approval and rejection
- Hotel activation/deactivation
- Booking oversight
- Payout monitoring
- Reports and booking statistics

Hotel Manager

- Hotel management
- Room management
- Room availability
- Reservation management
- Check-in and check-out
- Payout viewing

Guest

- Hotel search
- Availability checking
- Room selection
- Room hold
- Reservation creation
- Payment processing
- Booking confirmation
- Booking history

---

5. Booking Flow

The main booking flow is:

Guest Login
    ↓
Search Hotels
    ↓
Check Room Availability
    ↓
Select Room
    ↓
Create Room Hold
    ↓
Create Reservation
    ↓
Payment
    ↓
Payment Confirmation
    ↓
Confirmed Booking

A unique booking reference is generated for confirmed reservations.

---

6. Database

Main entities include:

- Users
- HotelManagers
- Hotels
- RoomTypes
- Rooms
- RatePlans
- Reservations
- ReservationRooms
- RoomHolds
- Payments
- CancellationPolicies
- Payouts
- AuditLog

Entity Framework Core migrations are used to create and update the database schema.

---

7. Database Setup

Update the SQL Server connection string in:

HotelBooking.Api/appsettings.json

Example:

{
  "ConnectionStrings": {
    "DefaultConnection": "Server=localhost;Database=HotelBookingDb;Trusted_Connection=True;TrustServerCertificate=True;"
  }
}

Run the following commands from the backend folder:

cd E:\Hotel-Room-Booking-System\HotelBooking.Api
dotnet restore
dotnet ef database update
dotnet run

The API runs on:

http://localhost:5235

Swagger:

http://localhost:5235/swagger

---

8. Frontend Setup

Open another terminal:

cd E:\Hotel-Room-Booking-System\frontend
npm install
npm run dev

The frontend will normally run on:

http://localhost:5173

---

9. Seed Credentials

Admin

Email: admin@hotels.test
Password: Admin@123
Role: Admin

Hotel Manager

Email: manager@hotels.test
Password: Manager@123
Role: Hotel Manager

Guest

Email: guest@hotels.test
Password: Guest@123
Role: Guest

---

10. Seed Data

The database contains sample data for testing.

Seeded data includes:

- 3 hotels
- Multiple room types
- Multiple rooms
- 15+ reservations
- Confirmed, pending and cancelled booking examples
- Payment records
- Different booking dates for availability testing

---

11. Important API Endpoints

Authentication

POST /api/Auth/register
POST /api/Auth/login

Hotels

GET /api/Hotels

Availability

POST /api/Availability

Room Holds

POST /api/RoomHolds
GET /api/RoomHolds

Reservations

POST /api/Reservations
GET /api/Reservations

Payments

POST /api/Payments

Admin

GET /api/AdminManagers
PUT /api/AdminManagers/{id}/approve
PUT /api/AdminManagers/{id}/reject

GET /api/AdminHotels
PUT /api/AdminHotels/{id}/activate
PUT /api/AdminHotels/{id}/deactivate

GET /api/AdminBookings
GET /api/AdminPayouts
GET /api/AdminReports

Manager

GET /api/Payouts

Additional room, reservation and management endpoints are available through Swagger.

---

12. Concurrency and Double-Booking Protection

The booking flow checks room availability for the requested date range before creating a hold or reservation.

Overlapping reservations are checked using:

ExistingCheckIn < RequestedCheckOut
AND
ExistingCheckOut > RequestedCheckIn

This prevents a room that is already reserved for an overlapping period from being selected again.

Room holds also have an expiry time so that temporarily held rooms can become available again after the hold expires.

Reservation and payment status are tracked separately to prevent incomplete payments from being treated as confirmed bookings.

For production deployment, the reservation operation should additionally use a database transaction/appropriate isolation strategy to guarantee atomic concurrency handling under simultaneous requests.

---

13. Payment

The project uses a mock payment flow for testing.

A successful payment:

1. Creates a payment record.
2. Generates a mock gateway reference.
3. Updates the payment status to "Paid".
4. Updates the reservation status to "Confirmed".

Example gateway reference:

MOCK-XXXXXXXX

---

14. Role-Based Access

The application uses JWT authentication and role-based authorization.

Supported roles:

Admin
Hotel Manager
Guest

Protected backend endpoints use authorization attributes and protected frontend routes restrict access based on the logged-in user's role.

---

15. Error Handling and Validation

The API validates request data such as:

- Required fields
- Date ranges
- Room availability
- User authentication
- User roles
- Reservation status
- Payment status

Invalid requests return appropriate HTTP error responses.

---

16. Testing

The following core scenarios were tested:

- Admin login
- Manager login
- Guest login
- Hotel listing
- Room availability
- Room hold
- Reservation creation
- Payment processing
- Confirmed booking
- Admin manager approval
- Hotel activation/deactivation
- Admin booking oversight
- Admin payout viewing
- Admin reports
- Manager reservation management
- Manager check-in/check-out

---

17. Known Limitations

Some advanced features are partially implemented due to the assignment timeline.

These include:

- Complete password reset workflow
- Complete cancellation and refund workflow
- Advanced rate-plan management
- Detailed audit log management
- Commission and dispute management
- Automatic JWT refresh handling
- Advanced reporting/export features

The core authentication, availability, booking, payment and role-based management workflows are implemented.

---

18. Future Improvements

With additional development time, the following can be added:

- Production payment gateway integration
- Complete refund and cancellation policies
- Refresh token rotation
- Email notifications
- Advanced dynamic pricing
- Complete audit logging
- CSV report export
- Automated booking expiry background service
- Automated concurrency/load testing
- Hotel reviews and ratings

---

19. Running the Application

Start Backend

cd E:\Hotel-Room-Booking-System\HotelBooking.Api
dotnet run

Start Frontend

Open another terminal:

cd E:\Hotel-Room-Booking-System\frontend
npm run dev

Then open the frontend URL shown by Vite.

---

20. Project Status

The core Hotel Room Booking & Reservation workflow is implemented and tested with separate Admin, Hotel Manager and Guest roles.

The project demonstrates:

- Full-stack development
- REST API development
- Database integration
- JWT authentication
- Role-based authorization
- Room availability management
- Reservation management
- Payment processing
- React frontend integration
- Admin and Manager management workflows