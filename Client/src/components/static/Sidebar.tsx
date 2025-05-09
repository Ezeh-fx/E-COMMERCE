import { Link, useLocation } from "react-router-dom";
import { Users, ShoppingCart, Package, BarChart3,  LogOut, X } from "lucide-react";

interface SidebarProps {
  closeSidebar: () => void;
}

const Sidebar = ({ closeSidebar }: SidebarProps) => {
  const location = useLocation();
  const currentPath = location.pathname;

  const navItems = [
    { path: '/admin', title: 'Dashboard', icon: <BarChart3 size={20} className="mr-3" /> },
    { path: '/admin/products', title: 'Products', icon: <Package size={20} className="mr-3" /> },
    { path: '/admin/users', title: 'Users', icon: <Users size={20} className="mr-3" /> },
    { path: '/admin/orders', title: 'Orders', icon: <ShoppingCart size={20} className="mr-3" /> },
  ];

  return (
    <div className="relative h-full text-white">
      {/* Close Icon for mobile */}
      <button
        className="absolute hidden top-4 right-4 tablet:block"
        onClick={closeSidebar}
      >
        <X size={24} />
      </button>

      <div className="p-4 text-xl font-bold">E-Shop Admin</div>
      <nav className="mt-8">
        {navItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`flex items-center p-4 ${currentPath === item.path ? 'bg-gray-700' : 'hover:bg-gray-700'}`}
          >
            {item.icon}
            {item.title}
          </Link>
        ))}
      </nav>
      <div className="absolute bottom-0 left-0 w-full p-4">
        <button className="flex items-center text-gray-400 hover:text-white">
          <LogOut size={20} className="mr-2" />
          Logout
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
