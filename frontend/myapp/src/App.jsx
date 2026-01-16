import { Route, Routes } from "react-router-dom";

import Login from "./components/customer components/Login";
import Register from "./components/customer components/Register";
import Logout from "./components/customer components/Logout";

import RoleBasedRoute from "./components/RoleBasedRoute";
import VerifyOtp from "./components/customer components/VerifyOtp";
import VerifyLoginOtp from "./components/customer components/VerifyLoginOtp";
import Home from "./components/customer components/Home";
import Events from "./components/customer components/Events";
import About from "./components/customer components/About";
import Contact from "./components/customer components/Contact";
import EventBooking from "./components/customer components/EventBooking";
import MyBookings from "./components/customer components/MyBookings";
import CustomerMainLayout from "./layouts/CustomerMainLayout";
import EventOrganizerLayout from "./layouts/EventOrganizerLayout";
import OrganizerHome from "./components/event organizer components/OrganizerHome";
import OrganizerDashboard from "./components/event organizer components/OrganizerDashboard";
import MyEvents from "./components/event organizer components/MyEvents";
import EventInsights from "./components/event organizer components/EventInsights";
import AddEvent from "./components/event organizer components/AddEvent";
import EditEvent from "./components/event organizer components/EditEvent";
import MyEventBookings from "./components/event organizer components/MyEventBookings";
import AdminMainLayout from "./layouts/AdminMainLayout";
import AdminHome from "./components/admin components/Home";
import AllUsers from "./components/admin components/AllUsers";
import PendingEvents from "./components/admin components/PendingEvents";
import ApprovedEvents from "./components/admin components/ApprovedEvents";
import RejectedEvents from "./components/admin components/rejectedEvents";
import OrganizerApproval from "./components/admin components/OrganizerApproval";
import ApprovedOrganizers from "./components/admin components/ApprovedOrganizers";
import ContactMessages from "./components/admin components/ContactMessages";
import RejectedOrganizers from "./components/admin components/RejectedOrganizers";
import AdminContactReply from "./components/admin components/AdminContactReply";
import AllBookings from "./components/admin components/AllBookings";
import EventProgress from "./components/customer components/EventProgress";
import BookingAnalytics from "./components/admin components/BookingAnalytics";
import MyEventReviews from "./components/event organizer components/MyEventReviews";
import AdminEventInsights from "./components/admin components/AdminEventInsights";
import EventBookings from "./components/admin components/EventBookings";
import EventReviews from "./components/admin components/EventReviews";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/logout" element={<Logout />} />
      <Route path="/verify-otp" element={<VerifyOtp />} />
      <Route path="/login-otp-verify" element={<VerifyLoginOtp />} />

      <Route element={<CustomerMainLayout />}>
        <Route
          path="/home"
          element={
            <RoleBasedRoute allowedRoles={["customer"]}>
              <Home />
            </RoleBasedRoute>
          }
        />
        <Route
          path="/events"
          element={
            <RoleBasedRoute allowedRoles={["customer"]}>
              <Events />
            </RoleBasedRoute>
          }
        />
        <Route
          path="/about"
          element={
            <RoleBasedRoute allowedRoles={["customer"]}>
              <About />
            </RoleBasedRoute>
          }
        />
        <Route
          path="/contact"
          element={
            <RoleBasedRoute allowedRoles={["customer"]}>
              <Contact />
            </RoleBasedRoute>
          }
        />
        <Route
          path="/events/:id/book"
          element={
            <RoleBasedRoute allowedRoles={["customer"]}>
              <EventBooking />
            </RoleBasedRoute>
          }
        />
        <Route
          path="/my-bookings"
          element={
            <RoleBasedRoute allowedRoles={["customer"]}>
              <MyBookings />
            </RoleBasedRoute>
          }
        />
        <Route
          path="/event-progress"
          element={
            <RoleBasedRoute allowedRoles={["customer"]}>
              <EventProgress />
            </RoleBasedRoute>
          }
        />
      </Route>

      <Route path="/admin" element={<Login />} />
      <Route element={<AdminMainLayout />}>
        <Route
          path="/admin/home"
          element={
            <RoleBasedRoute allowedRoles={["admin"]}>
              <AdminHome />
            </RoleBasedRoute>
          }
        />
        <Route
          path="/admin/users"
          element={
            <RoleBasedRoute allowedRoles={["admin"]}>
              <AllUsers />
            </RoleBasedRoute>
          }
        />
        <Route
          path="/admin/pending-events"
          element={
            <RoleBasedRoute allowedRoles={["admin"]}>
              <PendingEvents />
            </RoleBasedRoute>
          }
        />
        <Route
          path="/admin/events"
          element={
            <RoleBasedRoute allowedRoles={["admin"]}>
              <AdminEventInsights />
            </RoleBasedRoute>
          }
        />
        <Route
          path="/admin/rejected-events"
          element={
            <RoleBasedRoute allowedRoles={["admin"]}>
              <RejectedEvents />
            </RoleBasedRoute>
          }
        />
        <Route
          path="/admin/pending-organizers"
          element={
            <RoleBasedRoute allowedRoles={["admin"]}>
              <OrganizerApproval />
            </RoleBasedRoute>
          }
        />
        <Route
          path="/admin/approved-organizers"
          element={
            <RoleBasedRoute allowedRoles={["admin"]}>
              <ApprovedOrganizers />
            </RoleBasedRoute>
          }
        />
        <Route
          path="/admin/contact-messages"
          element={
            <RoleBasedRoute allowedRoles={["admin"]}>
              <ContactMessages />
            </RoleBasedRoute>
          }
        />
        <Route
          path="/admin/rejected-organizers"
          element={
            <RoleBasedRoute allowedRoles={["admin"]}>
              <RejectedOrganizers />
            </RoleBasedRoute>
          }
        />
        <Route
          path="/admin/contact/:id"
          element={
            <RoleBasedRoute allowedRoles={["admin"]}>
              <AdminContactReply />
            </RoleBasedRoute>
          }
        />
        <Route
          path="/admin/all-bookings"
          element={
            <RoleBasedRoute allowedRoles={["admin"]}>
              <AllBookings />
            </RoleBasedRoute>
          }
        />
        <Route
          path="/admin/booking-analytics"
          element={
            <RoleBasedRoute allowedRoles={["admin"]}>
              <BookingAnalytics />
            </RoleBasedRoute>
          }
        />
        <Route
          path="/admin/events/:eventId/bookings"
          element={
            <RoleBasedRoute allowedRoles={["admin"]}>
              <EventBookings />
            </RoleBasedRoute>
          }
        />
        <Route
          path="/admin/events/reviews/:eventId"
          element={
            <RoleBasedRoute allowedRoles={["admin"]}>
              <EventReviews />
            </RoleBasedRoute>
          }
        />
      </Route>

      <Route path="/organizer/register" element={<Register />} />
      <Route path="/organizer/verify-otp" element={<VerifyOtp />} />
      <Route path="/organizer" element={<Login />} />

      <Route element={<EventOrganizerLayout />}>
        <Route
          path="/organizer/home"
          element={
            <RoleBasedRoute allowedRoles={["eventorganizer"]}>
              <OrganizerHome />
            </RoleBasedRoute>
          }
        />
        <Route
          path="/organizer/dashboard"
          element={
            <RoleBasedRoute allowedRoles={["eventorganizer"]}>
              <OrganizerDashboard />
            </RoleBasedRoute>
          }
        />
        <Route
          path="/organizer/events"
          element={
            <RoleBasedRoute allowedRoles={["eventorganizer"]}>
              <MyEvents />
            </RoleBasedRoute>
          }
        />
        <Route
          path="/organizer/events-stats"
          element={
            <RoleBasedRoute allowedRoles={["eventorganizer"]}>
              <EventInsights />
            </RoleBasedRoute>
          }
        />
        <Route
          path="/organizer/events/add"
          element={
            <RoleBasedRoute allowedRoles={["eventorganizer"]}>
              <AddEvent />
            </RoleBasedRoute>
          }
        />
        <Route
          path="/organizer/events/edit/:id"
          element={
            <RoleBasedRoute allowedRoles={["eventorganizer"]}>
              <EditEvent />
            </RoleBasedRoute>
          }
        />
        <Route
          path="/organizer/events/:eventId/bookings"
          element={
            <RoleBasedRoute allowedRoles={["eventorganizer"]}>
              <MyEventBookings />
            </RoleBasedRoute>
          }
        />
        <Route
          path="/organizer/events/:eventId/reviews"
          element={
            <RoleBasedRoute allowedRoles={["eventorganizer"]}>
              <MyEventReviews />
            </RoleBasedRoute>
          }
        />
      </Route>
    </Routes>
  );
}

export default App;
