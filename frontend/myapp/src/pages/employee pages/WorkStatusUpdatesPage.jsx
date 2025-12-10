import Navbar from "../../components/employee components/Navbar";
import Footer from "../../components/customer components/Footer";
import WorkStatusUpdate from "../../components/employee components/WorkStatusUpdates";

export default function WorkStatusUpdatesPage() {
  return (
    <div>
      <Navbar />
      <WorkStatusUpdate />
      <Footer />
    </div>
  );
}
