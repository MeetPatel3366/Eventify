import { Route, Routes } from "react-router-dom";

import Login from "./components/customer components/Login";
import Register from "./components/customer components/Register";
import Logout from "./components/customer components/Logout";

import HomePage from "./pages/customer pages/HomePage";
import EventsPage from "./pages/customer pages/EventsPage";
import PaymentsPage from "./pages/customer pages/PaymentsPage";
import AboutPage from "./pages/customer pages/AboutPage";
import ContactPage from "./pages/customer pages/ContactPage";
import EventProgressPage from "./pages/customer pages/EventProgressPage";
import RecentBookingsPage from "./pages/customer pages/RecentBookingsPage";

import AdminHomePage from "./pages/admin pages/AdminHomePage";

import RoleBasedRoute from "./components/RoleBasedRoute";
import Homepage from "./pages/event organizer pages/HomePage";
import OrganizerDashboardPage from "./pages/event organizer pages/OrganizerDashboardPage";
import MyEventsPage from "./pages/event organizer pages/MyEventsPage";
import AllEventsPage from "./pages/event organizer pages/AllEventsPage";
import AddEventPage from "./pages/event organizer pages/AddEventPage";
import EditEventPage from "./pages/event organizer pages/EditEventPage";
import VerifyOtp from "./components/customer components/VerifyOtp";
import VerifyLoginOtp from "./components/customer components/VerifyLoginOtp";
import PendingEventsPage from "./pages/admin pages/PendingEventsPage";
import ApprovedEventsPage from "./pages/admin pages/ApprovedEventsPage";
import RejectedEventsPage from "./pages/admin pages/rejectedEventsPage";
import OrganizerApprovalPage from "./pages/admin pages/OrganizerApprovalPage";
import ApprovedOrganizerPage from "./pages/admin pages/ApprovedOrganizerPage";
import RejectedOrganizersPage from "./pages/admin pages/RejectedOrganizersPage";
import ContactMessagesPage from "./pages/admin pages/ContactMessagesPage";
import AdminContactReplyPage from "./pages/admin pages/AdminContactReplyPage";
import EventBookingPage from "./pages/customer pages/EventBookingPage";
import MyBookingsPage from "./pages/customer pages/MyBookingsPage";
import EventInsightsPage from "./pages/event organizer pages/EventInsightsPage";
import MyEventBookingsPage from "./pages/event organizer pages/MyEventBookingsPage";

function App() {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/logout" element={<Logout />} />
      <Route path="/verify-otp" element={<VerifyOtp />} />
      <Route path="/login-otp-verify" element={<VerifyLoginOtp />} />

      {/* Customer routes */}
      <Route
        path="/home"
        element={
          <RoleBasedRoute allowedRoles={["customer"]}>
            <HomePage />
          </RoleBasedRoute>
        }
      />
      <Route
        path="/events"
        element={
          <RoleBasedRoute allowedRoles={["customer"]}>
            <EventsPage />
          </RoleBasedRoute>
        }
      />
      <Route
        path="/about"
        element={
          <RoleBasedRoute allowedRoles={["customer"]}>
            <AboutPage />
          </RoleBasedRoute>
        }
      />
      <Route
        path="/contact"
        element={
          <RoleBasedRoute allowedRoles={["customer"]}>
            <ContactPage />
          </RoleBasedRoute>
        }
      />
      <Route
        path="/events/:id/book"
        element={
          <RoleBasedRoute allowedRoles={["customer"]}>
            <EventBookingPage />
          </RoleBasedRoute>
        }
      />
      <Route
        path="/my-bookings"
        element={
          <RoleBasedRoute allowedRoles={["customer"]}>
            <MyBookingsPage />
          </RoleBasedRoute>
        }
      />
      <Route
        path="/payments"
        element={
          <RoleBasedRoute allowedRoles={["customer"]}>
            <PaymentsPage />
          </RoleBasedRoute>
        }
      />
      <Route
        path="/event-progress"
        element={
          <RoleBasedRoute allowedRoles={["customer"]}>
            <EventProgressPage />
          </RoleBasedRoute>
        }
      />
      <Route
        path="/recent-bookings"
        element={
          <RoleBasedRoute allowedRoles={["customer"]}>
            <RecentBookingsPage />
          </RoleBasedRoute>
        }
      />

      {/* Admin routes */}
      <Route path="/admin" element={<Login />} />
      <Route
        path="/admin/home"
        element={
          <RoleBasedRoute allowedRoles={["admin"]}>
            <AdminHomePage />
          </RoleBasedRoute>
        }
      />
      <Route
        path="/admin/pending-events"
        element={
          <RoleBasedRoute allowedRoles={["admin"]}>
            <PendingEventsPage />
          </RoleBasedRoute>
        }
      />
      <Route
        path="/admin/events"
        element={
          <RoleBasedRoute allowedRoles={["admin"]}>
            <ApprovedEventsPage />
          </RoleBasedRoute>
        }
      />
      <Route
        path="/admin/rejected-events"
        element={
          <RoleBasedRoute allowedRoles={["admin"]}>
            <RejectedEventsPage />
          </RoleBasedRoute>
        }
      />
      <Route
        path="/admin/pending-organizers"
        element={
          <RoleBasedRoute allowedRoles={["admin"]}>
            <OrganizerApprovalPage />
          </RoleBasedRoute>
        }
      />
      <Route
        path="/admin/approved-organizers"
        element={
          <RoleBasedRoute allowedRoles={["admin"]}>
            <ApprovedOrganizerPage />
          </RoleBasedRoute>
        }
      />
      <Route
        path="/admin/contact-messages"
        element={
          <RoleBasedRoute allowedRoles={["admin"]}>
            <ContactMessagesPage />
          </RoleBasedRoute>
        }
      />
      <Route
        path="/admin/rejected-organizers"
        element={
          <RoleBasedRoute allowedRoles={["admin"]}>
            <RejectedOrganizersPage />
          </RoleBasedRoute>
        }
      />
      <Route
        path="/admin/contact/:id"
        element={
          <RoleBasedRoute allowedRoles={["admin"]}>
            <AdminContactReplyPage />
          </RoleBasedRoute>
        }
      />

      {/* Event Organizer routes */}

      <Route path="/organizer/register" element={<Register />} />
      <Route path="/organizer/verify-otp" element={<VerifyOtp />} />
      <Route path="/organizer" element={<Login />} />
      <Route
        path="/organizer/home"
        element={
          <RoleBasedRoute allowedRoles={["eventorganizer"]}>
            <Homepage />
          </RoleBasedRoute>
        }
      />
      <Route
        path="/organizer/dashboard"
        element={
          <RoleBasedRoute allowedRoles={["eventorganizer"]}>
            <OrganizerDashboardPage />
          </RoleBasedRoute>
        }
      />
      <Route
        path="/organizer/events"
        element={
          <RoleBasedRoute allowedRoles={["eventorganizer"]}>
            <MyEventsPage />
          </RoleBasedRoute>
        }
      />
      <Route
        path="/organizer/events-stats"
        element={
          <RoleBasedRoute allowedRoles={["eventorganizer"]}>
            <EventInsightsPage />
          </RoleBasedRoute>
        }
      />
      <Route
        path="/organizer/allevents"
        element={
          <RoleBasedRoute allowedRoles={["eventorganizer"]}>
            <AllEventsPage />
          </RoleBasedRoute>
        }
      />
      <Route
        path="/organizer/events/add"
        element={
          <RoleBasedRoute allowedRoles={["eventorganizer"]}>
            <AddEventPage />
          </RoleBasedRoute>
        }
      />
      <Route
        path="/organizer/events/edit/:id"
        element={
          <RoleBasedRoute allowedRoles={["eventorganizer"]}>
            <EditEventPage />
          </RoleBasedRoute>
        }
      />
      <Route
        path="/organizer/events/:eventId/bookings"
        element={
          <RoleBasedRoute allowedRoles={["eventorganizer"]}>
            <MyEventBookingsPage />
          </RoleBasedRoute>
        }
      />
    </Routes>
  );
}

export default App;
