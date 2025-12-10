import React, { useState } from "react";
import "../../styles/admin styles/ManageTasks.css";

const ManageTasks = () => {
  // Sample data for tasks
  const initialTasks = [
    {
      id: 1,
      employee: "John Doe",
      event: "Conference 2024",
      task: "Setup conference hall"
    },
    {
      id: 2,
      employee: "Jane Smith",
      event: "Wedding Expo",
      task: "Coordinate with vendors"
    },
    {
      id: 3,
      employee: "Mike Johnson",
      event: "Tech Talk",
      task: "Handle tech equipment"
    }
  ];

  const [tasks, setTasks] = useState(initialTasks);
  const [editTask, setEditTask] = useState(null);
  const [updatedTask, setUpdatedTask] = useState("");

  // Handle edit
  const handleEditClick = (task) => {
    setEditTask(task);
    setUpdatedTask(task.task);
  };

  // Handle update
  const handleUpdateClick = (taskId) => {
    const updatedTasks = tasks.map((task) =>
      task.id === taskId ? { ...task, task: updatedTask } : task
    );
    setTasks(updatedTasks);
    setEditTask(null);
    alert("Task updated successfully!");
  };

  // Handle delete
  const handleDeleteClick = (taskId) => {
    const filteredTasks = tasks.filter((task) => task.id !== taskId);
    setTasks(filteredTasks);
    alert("Task deleted successfully!");
  };

  return (
    <div className="manage-tasks-page">
      <h1>Manage Assigned Tasks</h1>
      <table className="tasks-table">
        <thead>
          <tr>
            <th>Employee</th>
            <th>Event</th>
            <th>Task</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {tasks.map((task) => (
            <tr key={task.id}>
              <td>{task.employee}</td>
              <td>{task.event}</td>
              <td>
                {editTask && editTask.id === task.id ? (
                  <input
                    type="text"
                    value={updatedTask}
                    onChange={(e) => setUpdatedTask(e.target.value)}
                  />
                ) : (
                  task.task
                )}
              </td>
              <td>
                {editTask && editTask.id === task.id ? (
                  <button onClick={() => handleUpdateClick(task.id)}>
                    Update
                  </button>
                ) : (
                  <button onClick={() => handleEditClick(task)}>Edit</button>
                )}
                <button onClick={() => handleDeleteClick(task.id)}>
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

export default ManageTasks;
