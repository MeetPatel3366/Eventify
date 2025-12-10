import React, { useState, useEffect } from "react";
import "../../styles/EventProgress.css";

const EventProgress = () => {
  const [events, setEvents] = useState([
    { id: 1, name: "Annual Tech Conference", status: "Planned", progress: 30 },
    { id: 2, name: "Music Festival", status: "Ongoing", progress: 60 },
    { id: 3, name: "Startup Expo", status: "Completed", progress: 100 },
    { id: 4, name: "Charity Run", status: "Planned", progress: 20 },
  ]);

  const getStatusColor = (status) => {
    switch (status) {
      case "Planned":
        return "orange";
      case "Ongoing":
        return "blue";
      case "Completed":
        return "green";
      default:
        return "grey";
    }
  };

  return (
    <div className="event-progress-page">
      <h1>Event Progress Tracking</h1>
      <div className="event-list">
        {events.map((event) => (
          <div key={event.id} className="event-card">
            <h2>{event.name}</h2>
            <p>
              Status:{" "}
              <span style={{ color: getStatusColor(event.status) }}>
                {event.status}
              </span>
            </p>
            <div className="progress-bar">
              <div
                className="progress"
                style={{
                  width: `${event.progress}%`,
                  backgroundColor: getStatusColor(event.status),
                }}
              >
                {event.progress}%
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EventProgress;
