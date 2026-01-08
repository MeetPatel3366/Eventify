
import { Outlet } from "react-router-dom";
import Navbar from "../components/customer components/Navbar";
import Footer from "../components/customer components/Footer";

const CustomerMainLayout = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white">
      <Navbar /> 
      <div className="pt-16 px-8">
        <Outlet />
      </div>
      <Footer/>
    </div>
  );
};

export default CustomerMainLayout;
