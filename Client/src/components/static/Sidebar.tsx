import { Link, useLocation } from 'react-router-dom';
import { 
  Users, 
  ShoppingCart, 
  Package, 
  BarChart3, 
  Settings,
  LogOut 
} from 'lucide-react';

const Sidebar = () => {
  const location = useLocation();
  const currentPath = location.pathname;
  
  const navItems = [
    { path: '/admin', title: 'Dashboard', icon: <BarChart3 className="mr-3" size={20} /> },
    { path: '/admin/products', title: 'Products', icon: <Package className="mr-3" size={20} /> },
    { path: '/admin/users', title: 'Users', icon: <Users className="mr-3" size={20} /> },
    { path: '/admin/orders', title: 'Orders', icon: <ShoppingCart className="mr-3" size={20} /> },
    { path: '/admin/settings', title: 'Settings', icon: <Settings className="mr-3" size={20} /> },
  ];

  return (
    <div className="fixed w-64 h-screen text-white bg-gray-800">
      <div className="p-4 text-xl font-bold">E-Shop Admin</div>
      <nav className="mt-8">
        {navItems.map((item) => (
          <Link 
            key={item.path}
            to={item.path}
            className={`flex items-center p-4 w-full ${
              currentPath === item.path ? 'bg-gray-700' : 'hover:bg-gray-700'
            }`}
          >
            {item.icon}
            {item.title}
          </Link>
        ))}
      </nav>
      <div className="absolute bottom-0 left-0 w-64 p-4">
        <button className="flex items-center text-gray-400 hover:text-white">
          <LogOut size={20} className="mr-2" />
          Logout
        </button>
      </div>
    </div>
  );
};

export default Sidebar;