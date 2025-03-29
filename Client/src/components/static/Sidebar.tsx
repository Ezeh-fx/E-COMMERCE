import { Link } from "react-router-dom";

const Sidebar = () => {
  return (
    <div className="w-64 h-full p-5 text-white bg-blue-800">
      <h2 className="text-xl font-bold">Admin Panel</h2>
      <nav className="mt-5">
        <ul>
          <li className="mb-3">
            <Link to="/admin/dashboard" className="hover:text-gray-300">Dashboard</Link>
          </li>
          <li className="mb-3">
            <Link to="/admin/orders" className="hover:text-gray-300">Orders</Link>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;