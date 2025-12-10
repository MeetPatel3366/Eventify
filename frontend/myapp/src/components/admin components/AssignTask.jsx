import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate for navigation
import "../../styles/admin styles/AssignTask.css";

const AssignTask = () => {
  const [taskData, setTaskData] = useState({
    employee: "",
    event: "",
    task: ""
  });

  const employees = ["John Doe", "Jane Smith", "Mike Johnson"]; // Sample employee list
  const events = ["Conference 2024", "Wedding Expo", "Tech Talk"]; // Sample event list

  const navigate = useNavigate(); // useNavigate hook for navigation

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTaskData((prevState) => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle task assignment logic
    console.log("Task Assigned:", taskData);
    alert("Task assigned successfully!");
    // Reset form
    setTaskData({
      employee: "",
      event: "",
      task: ""
    });
  };

  const handleViewAssignedTasks = () => {
    navigate("/assigned-tasks"); // Navigate to the AssignedTasks page
  };

  return (
    <div className="assign-task-page">
      <h1>Assign Task to Employee</h1>
      <form onSubmit={handleSubmit} className="task-form">
        <div className="form-group">
          <label htmlFor="employee">Select Employee:</label>
          <select
            id="employee"
            name="employee"
            value={taskData.employee}
            onChange={handleChange}
            required
          >
            <option value="">-- Select Employee --</option>
            {employees.map((employee, index) => (
              <option key={index} value={employee}>
                {employee}
              </option>
            ))}
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="event">Select Event:</label>
          <select
            id="event"
            name="event"
            value={taskData.event}
            onChange={handleChange}
            required
          >
            <option value="">-- Select Event --</option>
            {events.map((event, index) => (
              <option key={index} value={event}>
                {event}
              </option>
            ))}
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="task">Task Description:</label>
          <input
            type="text"
            id="task"
            name="task"
            value={taskData.task}
            onChange={handleChange}
            placeholder="Enter task description"
            required
          />
        </div>
        <button type="submit">Assign Task</button>
      </form>

      {/* Button to navigate to the Assigned Tasks page */}
      <div className="view-tasks-button">
        <button onClick={handleViewAssignedTasks}>View Assigned Tasks</button>
      </div>
    </div>
  );
};

export default AssignTask;
