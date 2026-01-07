import { Outlet } from "react-router-dom";
import Footer from "../src/components/customer components/Footer";
import Navbar from "../src/components/event organizer components/Navbar";

const EventOrganizerLayout = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-slate-900 to-black text-white">
      <Navbar /> 
      <div className="pt-16 px-8">
        <Outlet />
      </div>
      <Footer/>
    </div>
  );
};

export default EventOrganizerLayout;
