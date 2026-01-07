import { Route, Routes } from "react-router-dom";

import Login from "./components/customer components/Login";
import Register from "./components/customer components/Register";
import Logout from "./components/customer components/Logout";

import EventProgressPage from "./pages/customer pages/EventProgressPage";

import AdminHomePage from "./pages/admin pages/AdminHomePage";

import RoleBasedRoute from "./components/RoleBasedRoute";
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

import AllUsersPage from "./pages/admin pages/AllUsersPage";
import AllBookingsPage from "./pages/admin pages/AllBookingsPage";
import Home from "./components/customer components/Home";
import Events from "./components/customer components/Events";
import About from "./components/customer components/About";
import Contact from "./components/customer components/Contact";
import EventBooking from "./components/customer components/EventBooking";
import MyBookings from "./components/customer components/MyBookings";
import CustomerMainLayout from "../layouts/CustomerMainLayout";
import EventOrganizerLayout from "../layouts/EventOrganizerLayout";
import OrganizerHome from "./components/event organizer components/OrganizerHome";
import OrganizerDashboard from "./components/event organizer components/OrganizerDashboard";
import MyEvents from "./components/event organizer components/MyEvents";
import EventInsights from "./components/event organizer components/EventInsights";
import AddEvent from "./components/event organizer components/AddEvent";
import EditEvent from "./components/event organizer components/EditEvent";
import MyEventBookings from "./components/event organizer components/MyEventBookings";

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
              <EventProgressPage />
            </RoleBasedRoute>
          }
        />
      </Route>

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
        path="/admin/users"
        element={
          <RoleBasedRoute allowedRoles={["admin"]}>
            <AllUsersPage />
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
      <Route
        path="/admin/all-bookings"
        element={
          <RoleBasedRoute allowedRoles={["admin"]}>
            <AllBookingsPage />
          </RoleBasedRoute>
        }
      />

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
      </Route>
    </Routes>
  );
}

export default App;
