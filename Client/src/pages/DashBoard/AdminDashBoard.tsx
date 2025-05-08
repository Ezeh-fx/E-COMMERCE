import { Outlet } from "react-router-dom";
import Sidebar from "../../components/static/Sidebar";
import Header from "./DashBoardHeader";

const AdminDashboard = () => {
  return (
    <div className="flex h-screen bg-gray-100">
      {/* Always-visible Sidebar (desktop only layout) */}
      <div className="w-64 text-white bg-blue-800">
        <Sidebar />
      </div>

      {/* Main content area */}
      <div className="flex flex-col flex-1 overflow-y-auto">
        {/* Fixed Header */}
        <Header />

        {/* Page content (add pt-20 to match header height) */}
        <main className="p-4 pt-20 sm:p-6 md:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;
