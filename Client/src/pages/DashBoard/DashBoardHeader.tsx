import { Search, Bell, ChevronDown, Menu } from "lucide-react";

interface HeaderProps {
  toggleSidebar: () => void;
}

const Header = ({ toggleSidebar }: HeaderProps) => {
  return (
    <header className="fixed top-0 left-64 z-10 bg-white shadow-md w-[calc(100%-16rem)] tablet:left-0 tablet:w-full tablet:ml-0">
      <div className="flex items-center justify-between p-4">
        {/* Burger Icon for mobile/tablet */}
        <button className="hidden tablet:block" onClick={toggleSidebar}>
          <Menu size={24} />
        </button>

        {/* Search Bar */}
        <div className="flex items-center w-64 px-3 py-2 bg-gray-100 rounded-lg">
          <Search size={20} className="text-gray-500" />
          <input
            type="text"
            placeholder="Search..."
            className="w-full ml-2 bg-transparent border-none focus:outline-none"
          />
        </div>

        {/* Notification & Profile */}
        <div className="flex items-center space-x-4">
          <button className="relative p-2 rounded-full hover:bg-gray-100">
            <Bell size={20} />
            <span className="absolute w-2 h-2 bg-red-500 rounded-full top-1 right-1"></span>
          </button>
          <div className="flex items-center">
            <div className="flex items-center justify-center w-8 h-8 text-white bg-blue-500 rounded-full">
              A
            </div>
            <div className="flex items-center ml-2 font-medium">
              Admin
              <ChevronDown size={16} className="ml-1" />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
