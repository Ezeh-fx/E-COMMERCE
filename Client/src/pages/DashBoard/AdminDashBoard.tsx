import { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../../components/static/Sidebar";
import DashBoardHeader from "../DashBoard/DashBoardHeader";

const AdminDashboard = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-30 w-64 bg-gray-800 transform transition-transform duration-300
        ${isSidebarOpen ? "translate-x-0" : "tablet:-translate-x-full "}`}
      >
        <Sidebar closeSidebar={() => setIsSidebarOpen(false)} />
      </div>

      {/* Overlay when sidebar is open */}
      {isSidebarOpen && (
        <div
          onClick={() => setIsSidebarOpen(false)}
          className="fixed inset-0 z-20 bg-black bg-opacity-50 tablet:block"
        />
      )}

      {/* Main content */}
      <div className="flex flex-col flex-1 ml-64 tablet:ml-0">
        <DashBoardHeader toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />
        <main className="p-4 pt-20">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;