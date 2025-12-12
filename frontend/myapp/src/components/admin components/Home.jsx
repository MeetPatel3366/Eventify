import React from "react";
import { Link } from "react-router-dom";

const AdminHome = () => {
  return (
    <div className="admin-home-page">
      <div className="admin-content">
        <h1>Admin Dashboard</h1>
        <div className="admin-actions">
          <div className="action">
            <h2>Add Event Manager</h2>
            <Link to="/admin/add-employee">
              <button>Add New event-manager</button>
            </Link>
          </div>
          <div className="action">
            <h2>Manage Bookings</h2>
            <Link to="/admin/manage-bookings">
              <button>Manage Bookings</button>
            </Link>
          </div>
          <div className="action">
            <h2>Manage Events</h2>
            <Link to="/admin/manage-events">
              <button>Manage Categories</button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminHome;
