import { Outlet } from "react-router-dom";
import Footer from "../components/customer components/Footer";
import Navbar from "../components/admin components/Navbar";

const AdminMainLayout = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-slate-900 to-black text-white">
      <Navbar /> 
      <div className="pt-2 px-8">
        <Outlet />
      </div>
      <Footer/>
    </div>
  );
};

export default AdminMainLayout;
