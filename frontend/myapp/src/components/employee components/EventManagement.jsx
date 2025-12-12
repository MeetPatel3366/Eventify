import React, { useState } from "react";

const EventManagement = () => {
  // Predefined categories (Admin-defined)
  const predefinedCategories = [
    "Conferences",
    "Workshops",
    "Meetings",
    "Seminars"
  ];

  // State for events within categories
  const [events, setEvents] = useState(
    predefinedCategories.reduce(
      (acc, category) => ({ ...acc, [category]: [] }),
      {}
    )
  );

  // State for new event input
  const [newEvent, setNewEvent] = useState({ category: "", name: "" });

  // Add an event to a category
  const handleAddEvent = () => {
    if (newEvent.category && newEvent.name.trim()) {
      setEvents((prevEvents) => ({
        ...prevEvents,
        [newEvent.category]: [
          ...prevEvents[newEvent.category],
          newEvent.name.trim()
        ]
      }));
      setNewEvent({ category: "", name: "" }); // Reset input
    }
  };

  // Edit an event inside a category
  const handleEditEvent = (category, index, newName) => {
    if (newName.trim()) {
      setEvents((prevEvents) => {
        const updatedEvents = [...prevEvents[category]];
        updatedEvents[index] = newName.trim();
        return { ...prevEvents, [category]: updatedEvents };
      });
    }
  };

  // Delete an event from a category
  const handleDeleteEvent = (category, index) => {
    setEvents((prevEvents) => ({
      ...prevEvents,
      [category]: prevEvents[category].filter((_, i) => i !== index)
    }));
  };

  return (
    <div className="event-management">
      <h1>Event Management</h1>

      {/* Event Section */}
      <div className="event-section">
        <h2>Add New Event</h2>
        <select
          value={newEvent.category}
          onChange={(e) =>
            setNewEvent({ ...newEvent, category: e.target.value })
          }
        >
          <option value="">Select Category</option>
          {predefinedCategories.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
        <input
          type="text"
          placeholder="Event Name"
          value={newEvent.name}
          onChange={(e) => setNewEvent({ ...newEvent, name: e.target.value })}
        />
        <button onClick={handleAddEvent}>Add Event</button>
      </div>

      {/* Display Events by Category */}
      {predefinedCategories.map((category) => (
        <div key={category} className="category-events">
          <h3>{category} Events</h3>
          {events[category].length > 0 ? (
            <ul>
              {events[category].map((event, index) => (
                <li key={index}>
                  <input
                    type="text"
                    value={event}
                    onChange={(e) =>
                      handleEditEvent(category, index, e.target.value)
                    }
                  />
                  <button onClick={() => handleDeleteEvent(category, index)}>
                    Delete
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <p className="no-events">No events added in this category.</p>
          )}
        </div>
      ))}
    </div>
  );
};

export default EventManagement;
