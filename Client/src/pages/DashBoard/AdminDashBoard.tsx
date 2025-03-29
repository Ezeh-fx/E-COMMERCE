import { Outlet } from "react-router-dom";
import Sidebar from "../../components/static/Sidebar";
import Header from "./DashBoardHeader";

const AdminDashBoard = () => {
  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex flex-col flex-1">
        {/* Header */}
        <Header />
        
        {/* Pages inside Admin Dashboard */}
        <div className="p-6">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AdminDashBoard;