import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchEvents } from "../../store/eventSlice";
import "../../styles/Events.css";

const Events = () => {
  const dispatch = useDispatch();
  const { events, loading } = useSelector((state) => state.event);

  useEffect(() => {
    dispatch(fetchEvents());
  }, [dispatch]);

  if (loading) return <p className="loading">Loading events...</p>;

  return (
    <div className="events-container">
      <h1 className="page-title">Upcoming Events</h1>

      <div className="events-grid">
        {events.map((event) => (
          <div className="event-card" key={event._id}>
            <div className="image-wrapper">
              <img src={event.image} alt={event.name} />
            </div>

            <div className="card-body">
              <div className="price-tag">₹{event.price}</div>
              <h2 className="event-name">{event.name}</h2>

              <div className="event-info">
                <span>{new Date(event.date).toLocaleDateString("en-IN", {
                  day: "2-digit", month: "short", year: "numeric"
                })}</span>

                <span className="location">{event.location}</span>
              </div>

              <p className="event-description">{event.description}</p>

              <button className="book-btn">Book Now</button>
            </div>
          </div>
        ))}
      </div>
    </div>

  );
};

export default Events;