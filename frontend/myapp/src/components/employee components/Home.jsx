import React, { useState } from "react";

const EmployeeHome = () => {
  // Assume you get this data for an individual employee from an API or context
  const [employee, setEmployee] = useState({
    name: "John Doe",
    role: "Event Manager",
    eventsHandled: 12,
    tasksCompleted: 48
  });

  return (
    <div className="employee-home">
      <div className="home-container">
        <h1>Welcome, {employee.name}!</h1>

        {/* Employee Information Section */}
        <div className="employee-info">
          <h2>Event Manager Information</h2>
          <p>
            <strong>Role:</strong> {employee.role}
          </p>
          <p>
            <strong>Events Handled:</strong> {employee.eventsHandled}
          </p>
          <p>
            <strong>Events Completed:</strong> {employee.tasksCompleted}
          </p>
        </div>

        {/* Task Section */}
        <div className="tasks">
          <h2>Your Assigned Tasks</h2>
          {/* Add your task management logic here */}
          <p>You have X pending Events.</p>
        </div>
      </div>
    </div>
  );
};

export default EmployeeHome;
