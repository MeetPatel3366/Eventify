import React, { useState } from "react";

const ManageBookings = () => {
  // Sample data for bookings
  const initialBookings = [
    { id: 1, customer: "Alice", event: "Conference 2024", status: "Confirmed" },
    { id: 2, customer: "Bob", event: "Wedding Expo", status: "Pending" },
    { id: 3, customer: "Charlie", event: "Tech Talk", status: "Cancelled" },
  ];

  const [bookings, setBookings] = useState(initialBookings);
  const [editBooking, setEditBooking] = useState(null);
  const [updatedStatus, setUpdatedStatus] = useState("");

  // Handle edit
  const handleEditClick = (booking) => {
    setEditBooking(booking);
    setUpdatedStatus(booking.status);
  };

  // Handle update
  const handleUpdateClick = (bookingId) => {
    const updatedBookings = bookings.map((booking) =>
      booking.id === bookingId ? { ...booking, status: updatedStatus } : booking
    );
    setBookings(updatedBookings);
    setEditBooking(null);
    alert("Booking status updated successfully!");
  };

  // Handle delete
  const handleDeleteClick = (bookingId) => {
    const filteredBookings = bookings.filter(
      (booking) => booking.id !== bookingId
    );
    setBookings(filteredBookings);
    alert("Booking deleted successfully!");
  };

  return (
    <div className="manage-bookings-page">
      <h1>Manage Event Bookings</h1>
      <table className="bookings-table">
        <thead>
          <tr>
            <th>Customer</th>
            <th>Event</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {bookings.map((booking) => (
            <tr key={booking.id}>
              <td>{booking.customer}</td>
              <td>{booking.event}</td>
              <td>
                {editBooking && editBooking.id === booking.id ? (
                  <select
                    value={updatedStatus}
                    onChange={(e) => setUpdatedStatus(e.target.value)}
                  >
                    <option value="Confirmed">Confirmed</option>
                    <option value="Pending">Pending</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                ) : (
                  booking.status
                )}
              </td>
              <td>
                {editBooking && editBooking.id === booking.id ? (
                  <button onClick={() => handleUpdateClick(booking.id)}>
                    Update
                  </button>
                ) : (
                  <button onClick={() => handleEditClick(booking)}>Edit</button>
                )}
                <button onClick={() => handleDeleteClick(booking.id)}>
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ManageBookings;
