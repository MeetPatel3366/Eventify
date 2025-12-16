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

import AdminHomePage from "./pages/admin pages/HomePage";
import AddEmployeePage from "./pages/admin pages/AddEmployeePage";
import AssignTaskPage from "./pages/admin pages/AssignTaskPage";
import ManageTasksPage from "./pages/admin pages/ManageTasksPage";
import ManageBookingsPage from "./pages/admin pages/ManageBookingsPage";
import ManageEventsPage from "./pages/admin pages/ManageEventsPage";

import RoleBasedRoute from "./components/RoleBasedRoute";
import Homepage from "./pages/event organizer pages/HomePage";
import OrganizerDashboardPage from "./pages/event organizer pages/OrganizerDashboardPage";
import MyEventsPage from "./pages/event organizer pages/MyEventsPage";
import AllEventsPage from "./pages/event organizer pages/AllEventsPage";
import AddEventPage from "./pages/event organizer pages/AddEventPage";


function App() {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/logout" element={<Logout />} />

      {/* Customer routes */}
      <Route
        path="/customer"
        element={
          <RoleBasedRoute allowedRoles={["customer"]}>
            <HomePage />
          </RoleBasedRoute>
        }
      />
      <Route
        path="/customer/events"
        element={
          <RoleBasedRoute allowedRoles={["customer"]}>
            <EventsPage />
          </RoleBasedRoute>
        }
      />
      <Route
        path="/customer/payments"
        element={
          <RoleBasedRoute allowedRoles={["customer"]}>
            <PaymentsPage />
          </RoleBasedRoute>
        }
      />
      <Route
        path="/customer/about"
        element={
          <RoleBasedRoute allowedRoles={["customer"]}>
            <AboutPage />
          </RoleBasedRoute>
        }
      />
      <Route
        path="/customer/contact"
        element={
          <RoleBasedRoute allowedRoles={["customer"]}>
            <ContactPage />
          </RoleBasedRoute>
        }
      />
      <Route
        path="/customer/event-progress"
        element={
          <RoleBasedRoute allowedRoles={["customer"]}>
            <EventProgressPage />
          </RoleBasedRoute>
        }
      />
      <Route
        path="/customer/recent-bookings"
        element={
          <RoleBasedRoute allowedRoles={["customer"]}>
            <RecentBookingsPage />
          </RoleBasedRoute>
        }
      />

      {/* Admin routes */}
      <Route
        path="/admin"
        element={
          <RoleBasedRoute allowedRoles={["admin"]}>
            <AdminHomePage />
          </RoleBasedRoute>
        }
      />
      <Route
        path="/admin/add-employee"
        element={
          <RoleBasedRoute allowedRoles={["admin"]}>
            <AddEmployeePage />
          </RoleBasedRoute>
        }
      />
      <Route
        path="/admin/assign-task"
        element={
          <RoleBasedRoute allowedRoles={["admin"]}>
            <AssignTaskPage />
          </RoleBasedRoute>
        }
      />
      <Route
        path="/admin/manage-tasks"
        element={
          <RoleBasedRoute allowedRoles={["admin"]}>
            <ManageTasksPage />
          </RoleBasedRoute>
        }
      />
      <Route
        path="/admin/manage-bookings"
        element={
          <RoleBasedRoute allowedRoles={["admin"]}>
            <ManageBookingsPage />
          </RoleBasedRoute>
        }
      />
      <Route
        path="/admin/manage-events"
        element={
          <RoleBasedRoute allowedRoles={["admin"]}>
            <ManageEventsPage />
          </RoleBasedRoute>
        }
      />

      {/* Event Organizer routes */}
      <Route
        path="/organizer"
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


    </Routes>
  );
}

export default App;
