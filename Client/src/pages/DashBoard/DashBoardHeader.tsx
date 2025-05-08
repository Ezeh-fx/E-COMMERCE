import { Search, Bell, ChevronDown } from 'lucide-react';

const Header = () => {
  return (
    <header className="fixed top-0 left-64 z-10 w-[calc(100%-16rem)] bg-white shadow-sm">
      <div className="flex items-center justify-between p-4">
        {/* Search Bar */}
        <div className="flex items-center w-64 px-3 py-2 bg-gray-100 rounded-lg">
          <Search size={20} className="text-gray-500" />
          <input 
            type="text" 
            placeholder="Search..." 
            className="w-full ml-2 bg-transparent border-none focus:outline-none"
          />
        </div>

        {/* Notifications & Profile */}
        <div className="flex items-center">
          <button className="relative p-2 rounded-full hover:bg-gray-100">
            <Bell size={20} />
            <span className="absolute w-2 h-2 bg-red-500 rounded-full top-1 right-1"></span>
          </button>
          <div className="flex items-center ml-4">
            <div className="flex items-center justify-center w-8 h-8 font-medium text-white bg-blue-500 rounded-full">
              A
            </div>
            <div className="flex items-center ml-2">
              <span className="font-medium">Admin</span>
              <ChevronDown size={16} className="ml-1" />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
