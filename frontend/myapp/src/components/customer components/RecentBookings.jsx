import React, { useState } from "react";

const RecentBookings = () => {
  const [bookings] = useState([
    {
      id: 1,
      eventName: "Annual Tech Conference",
      date: "2024-05-12",
      status: "Confirmed",
    },
    {
      id: 2,
      eventName: "Music Festival",
      date: "2024-06-18",
      status: "Pending",
    },
    {
      id: 3,
      eventName: "Startup Expo",
      date: "2024-07-25",
      status: "Cancelled",
    },
    {
      id: 4,
      eventName: "Charity Run",
      date: "2024-08-10",
      status: "Confirmed",
    },
  ]);

  return (
    <div className="recent-bookings-page">
      <h1>Your Recent Bookings</h1>
      {bookings.length > 0 ? (
        <table className="bookings-table">
          <thead>
            <tr>
              <th>Event Name</th>
              <th>Date</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map((booking) => (
              <tr key={booking.id}>
                <td>{booking.eventName}</td>
                <td>{booking.date}</td>
                <td>{booking.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No recent bookings found.</p>
      )}
    </div>
  );
};

export default RecentBookings;
