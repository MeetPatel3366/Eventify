import React, { useState } from "react";
import { useLocation } from "react-router-dom";

const Payments = () => {
  const location = useLocation();
  const { event } = location.state || {};
  const [paymentDone, setPaymentDone] = useState(false); // State to track if payment is done

  // Function to simulate payment process
  const handlePayment = () => {
    // Simulate a payment process (e.g., contacting a payment gateway)
    // After the process is done, show an acknowledgment
    setTimeout(() => {
      setPaymentDone(true); // Set payment done to true after the simulated process
    }, 2000); // Simulating a 2-second delay for payment processing
  };

  if (!event) {
    return <p>No event selected for payment.</p>;
  }

  return (
    <div className="payments-page">
      <h1>Payment for {event.name}</h1>
      <p>
        <strong>Date:</strong> {event.date}
      </p>
      <p>
        <strong>Location:</strong> {event.location}
      </p>
      <p>
        <strong>Description:</strong> {event.description}
      </p>

      {paymentDone ? (
        // Show acknowledgment after payment is done
        <div className="payment-acknowledgment">
          <h2>Payment Successful!</h2>
          <p>
            Thank you for your payment. Your registration for the event is
            confirmed.
          </p>
        </div>
      ) : (
        // Show payment button if payment is not done yet
        <button className="btn-primary" onClick={handlePayment}>
          Proceed to Payment
        </button>
      )}
    </div>
  );
};

export default Payments;
