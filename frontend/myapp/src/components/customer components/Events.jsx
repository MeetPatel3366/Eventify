import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/Events.css";

const Events = () => {
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEvents = () => {
      const eventData = [
        {
          category: "Technology",
          events: [
            {
              id: 1,
              name: "Annual Tech Conference",
              date: "2024-11-05",
              location: "New York",
              description: "A tech event focusing on the latest advancements.",
              image:
                "https://imgs.search.brave.com/fPT5GlgBN2Trb3boIDasCKFWTCxFC-xLfCnbIciWgMA/rs:fit:500:0:0:0/g:ce/aHR0cHM6Ly9tZWRp/YS5nZXR0eWltYWdl/cy5jb20vaWQvNDg2/OTg4MDU3L3Bob3Rv/L2VhcnRoLWRheS1j/aGFsbGVuZ2UuanBn/P3M9NjEyeDYxMiZ3/PTAmaz0yMCZjPU8x/MUlEMEhRUVB4OFhx/M1JjeGRRLUNYTHdx/ZEZmM0Ryd1RKQ0Vf/OTl6MzQ9"
            },
            {
              id: 2,
              name: "AI & Robotics Summit",
              date: "2024-10-12",
              location: "San Francisco",
              description: "A summit discussing the future of AI and robotics.",
              image:
                "https://imgs.search.brave.com/fPT5GlgBN2Trb3boIDasCKFWTCxFC-xLfCnbIciWgMA/rs:fit:500:0:0:0/g:ce/aHR0cHM6Ly9tZWRp/YS5nZXR0eWltYWdl/cy5jb20vaWQvNDg2/OTg4MDU3L3Bob3Rv/L2VhcnRoLWRheS1j/aGFsbGVuZ2UuanBn/P3M9NjEyeDYxMiZ3/PTAmaz0yMCZjPU8x/MUlEMEhRUVB4OFhx/M1JjeGRRLUNYTHdx/ZEZmM0Ryd1RKQ0Vf/OTl6MzQ9"
            }
          ]
        },
        {
          category: "Marketing",
          events: [
            {
              id: 3,
              name: "Marketing Summit",
              date: "2024-12-10",
              location: "Los Angeles",
              description:
                "Gathering marketing professionals to discuss strategies.",
              image:
                "https://imgs.search.brave.com/fPT5GlgBN2Trb3boIDasCKFWTCxFC-xLfCnbIciWgMA/rs:fit:500:0:0:0/g:ce/aHR0cHM6Ly9tZWRp/YS5nZXR0eWltYWdl/cy5jb20vaWQvNDg2/OTg4MDU3L3Bob3Rv/L2VhcnRoLWRheS1j/aGFsbGVuZ2UuanBn/P3M9NjEyeDYxMiZ3/PTAmaz0yMCZjPU8x/MUlEMEhRUVB4OFhx/M1JjeGRRLUNYTHdx/ZEZmM0Ryd1RKQ0Vf/OTl6MzQ9"
            },
            {
              id: 4,
              name: "Digital Marketing Expo",
              date: "2024-09-25",
              location: "Chicago",
              description:
                "A conference on the latest digital marketing trends.",
              image:
                "https://imgs.search.brave.com/fPT5GlgBN2Trb3boIDasCKFWTCxFC-xLfCnbIciWgMA/rs:fit:500:0:0:0/g:ce/aHR0cHM6Ly9tZWRp/YS5nZXR0eWltYWdl/cy5jb20vaWQvNDg2/OTg4MDU3L3Bob3Rv/L2VhcnRoLWRheS1j/aGFsbGVuZ2UuanBn/P3M9NjEyeDYxMiZ3/PTAmaz0yMCZjPU8x/MUlEMEhRUVB4OFhx/M1JjeGRRLUNYTHdx/ZEZmM0Ryd1RKQ0Vf/OTl6MzQ9"
            }
          ]
        },
        {
          category: "Entertainment",
          events: [
            {
              id: 5,
              name: "Music Festival",
              date: "2024-08-22",
              location: "Chicago",
              description: "A grand music festival featuring various artists.",
              image:
                "https://imgs.search.brave.com/fPT5GlgBN2Trb3boIDasCKFWTCxFC-xLfCnbIciWgMA/rs:fit:500:0:0:0/g:ce/aHR0cHM6Ly9tZWRp/YS5nZXR0eWltYWdl/cy5jb20vaWQvNDg2/OTg4MDU3L3Bob3Rv/L2VhcnRoLWRheS1j/aGFsbGVuZ2UuanBn/P3M9NjEyeDYxMiZ3/PTAmaz0yMCZjPU8x/MUlEMEhRUVB4OFhx/M1JjeGRRLUNYTHdx/ZEZmM0Ryd1RKQ0Vf/OTl6MzQ9"
            },
            {
              id: 6,
              name: "Film Awards Night",
              date: "2024-11-15",
              location: "Los Angeles",
              description: "Celebrating excellence in the film industry.",
              image:
                "https://imgs.search.brave.com/fPT5GlgBN2Trb3boIDasCKFWTCxFC-xLfCnbIciWgMA/rs:fit:500:0:0:0/g:ce/aHR0cHM6Ly9tZWRp/YS5nZXR0eWltYWdl/cy5jb20vaWQvNDg2/OTg4MDU3L3Bob3Rv/L2VhcnRoLWRheS1j/aGFsbGVuZ2UuanBn/P3M9NjEyeDYxMiZ3/PTAmaz0yMCZjPU8x/MUlEMEhRUVB4OFhx/M1JjeGRRLUNYTHdx/ZEZmM0Ryd1RKQ0Vf/OTl6MzQ9"
            }
          ]
        },
        {
          category: "Art & Culture",
          events: [
            {
              id: 7,
              name: "Art Expo",
              date: "2024-09-15",
              location: "San Francisco",
              description: "Showcasing the work of contemporary artists.",
              image:
                "https://imgs.search.brave.com/fPT5GlgBN2Trb3boIDasCKFWTCxFC-xLfCnbIciWgMA/rs:fit:500:0:0:0/g:ce/aHR0cHM6Ly9tZWRp/YS5nZXR0eWltYWdl/cy5jb20vaWQvNDg2/OTg4MDU3L3Bob3Rv/L2VhcnRoLWRheS1j/aGFsbGVuZ2UuanBn/P3M9NjEyeDYxMiZ3/PTAmaz0yMCZjPU8x/MUlEMEhRUVB4OFhx/M1JjeGRRLUNYTHdx/ZEZmM0Ryd1RKQ0Vf/OTl6MzQ9"
            },
            {
              id: 8,
              name: "Cultural Heritage Festival",
              date: "2024-10-05",
              location: "New York",
              description:
                "An event celebrating diverse cultures and traditions.",
              image:
                "https://imgs.search.brave.com/fPT5GlgBN2Trb3boIDasCKFWTCxFC-xLfCnbIciWgMA/rs:fit:500:0:0:0/g:ce/aHR0cHM6Ly9tZWRp/YS5nZXR0eWltYWdl/cy5jb20vaWQvNDg2/OTg4MDU3L3Bob3Rv/L2VhcnRoLWRheS1j/aGFsbGVuZ2UuanBn/P3M9NjEyeDYxMiZ3/PTAmaz0yMCZjPU8x/MUlEMEhRUVB4OFhx/M1JjeGRRLUNYTHdx/ZEZmM0Ryd1RKQ0Vf/OTl6MzQ9"
            }
          ]
        }
      ];
      setCategories(eventData);
    };

    fetchEvents();
  }, []);

  const handleCategoryClick = (category) => {
    setSelectedCategory(selectedCategory === category ? null : category);
  };

  const handlePayment = (event) => {
    navigate("/customer/payments", { state: { event } });
  };

  return (
    <div className="events-page">
      <h1>Upcoming Events</h1>
      <div className="categories">
        {categories.map((categoryData) => (
          <div key={categoryData.category} className="category-section">
            <h2
              onClick={() => handleCategoryClick(categoryData.category)}
              className="category-title"
            >
              {categoryData.category}
            </h2>
            {selectedCategory === categoryData.category && (
              <div className="events-list">
                {categoryData.events.map((event) => (
                  <div key={event.id} className="event-card">
                    <img
                      src={event.image}
                      alt={event.name}
                      className="event-image"
                    />
                    <h3>{event.name}</h3>
                    <p>
                      <strong>Date:</strong> {event.date}
                    </p>
                    <p>
                      <strong>Location:</strong> {event.location}
                    </p>
                    <p>
                      <strong>Description:</strong> {event.description}
                    </p>
                    <button
                      className="btn-primary"
                      onClick={() => handlePayment(event)}
                    >
                      Proceed to Payment
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Events;
