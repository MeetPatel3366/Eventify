import React, { useState } from "react";
import "../../styles/employee styles/WorkStatusUpdates.css";

const WorkStatusUpdate = () => {
  const [update, setUpdate] = useState("");
  const [status, setStatus] = useState("Pending");
  const [updatesList, setUpdatesList] = useState([]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (update) {
      const newUpdate = {
        id: updatesList.length + 1,
        text: update,
        status: status,
        date: new Date().toLocaleString()
      };
      setUpdatesList([...updatesList, newUpdate]);
      setUpdate("");
      setStatus("Pending");
    }
  };

  return (
    <div className="work-status-update">
      <h1>Work Status Update</h1>
      <form onSubmit={handleSubmit} className="update-form">
        <textarea
          value={update}
          onChange={(e) => setUpdate(e.target.value)}
          placeholder="Enter your work status update here..."
          required
        />
        <select value={status} onChange={(e) => setStatus(e.target.value)}>
          <option value="Pending">Pending</option>
          <option value="In Progress">In Progress</option>
          <option value="Completed">Completed</option>
        </select>
        <button type="submit">Submit Update</button>
      </form>

      <div className="updates-list">
        <h2>Your Work Updates</h2>
        <ul>
          {updatesList.map((update) => (
            <li key={update.id}>
              <p>
                {update.text} - <strong>{update.status}</strong> on{" "}
                {update.date}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default WorkStatusUpdate;
