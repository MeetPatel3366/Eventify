import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Login from "./components/customer components/Login";
import HomePage from "./pages/customer pages/HomePage";
import Logout from "./components/customer components/Logout";
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

import EmployeeHomePage from "./pages/employee pages/HomePage";
import ManageTasksPage1 from "./pages/employee pages/ManageTasksPage";
import WorkStatusUpdatesPage from "./pages/employee pages/WorkStatusUpdatesPage";
import Register from "./components/customer components/Register";

function App() {
  return (
    <Router>
      <Routes>
        <Route exact path="/" element={<Login />} />
        <Route exact path="/customer" element={<HomePage />} />
        <Route exact path="/logout" element={<Logout />} />
        <Route exact path="/customer/events" element={<EventsPage />} />
        <Route exact path="/customer/payments" element={<PaymentsPage />} />
        <Route exact path="/customer/about" element={<AboutPage />} />
        <Route exact path="/customer/contact" element={<ContactPage />} />
        <Route exact path="/register" element={<Register />} />
        <Route
          exact
          path="/customer/event-progress"
          element={<EventProgressPage />}
        />
        <Route
          exact
          path="/customer/recent-bookings"
          element={<RecentBookingsPage />}
        />

        <Route exact path="/admin" element={<AdminHomePage />} />
        <Route exact path="/admin/add-employee" element={<AddEmployeePage />} />
        <Route exact path="/admin/assign-task" element={<AssignTaskPage />} />
        <Route exact path="/admin/manage-tasks" element={<ManageTasksPage />} />
        <Route
          exact
          path="/admin/manage-bookings"
          element={<ManageBookingsPage />}
        />
        <Route
          exact
          path="/admin/manage-events"
          element={<ManageEventsPage />}
        />

        <Route exact path="/employee" element={<EmployeeHomePage />} />
        <Route
          exact
          path="/employee/manage-tasks"
          element={<ManageTasksPage1 />}
        />
        <Route
          exact
          path="/employee/work-status-updates"
          element={<WorkStatusUpdatesPage />}
        />
      </Routes>
    </Router>
  );
}

export default App;
