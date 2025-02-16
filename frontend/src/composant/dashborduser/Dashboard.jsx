import { useState } from 'react';
import { CgMenuLeftAlt } from "react-icons/cg";
import logo from '../../assets/img/logo.svg';
import {
  FileText,
  User,
  Search,
  Bell,
  Sun,
  Home,
  X
} from 'lucide-react';
import { NavLink } from "react-router-dom";
import {Outlet} from 'react-router-dom'


const Dashboard = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeItem, setActiveItem] = useState('Accueil');

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const menuItems = [
    { icon: Home, text: "Licked", path: "/interfaceuser/" },
    { icon: User, text: "Profile", path: "/interfaceuser/profile" },
    { icon: FileText, text: "Mes Offres Emplois", path: "/interfaceuser/offers" }
  ];

  const NavItem = ({ icon : Icon , text, isActive, path }) => (
    
    <NavLink
        to={path}
        onClick={() => setActiveItem(text)}
        className={`group flex items-center relative space-x-3 p-2 cursor-pointer 
          transition-all duration-200 ease-in-out
          ${isActive 
            ? 'text-blue-600 bg-blue-50 rounded-lg' 
            : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900 rounded-lg'
          }`}
    >
      <div className="flex items-center space-x-3">
        <Icon 
          size={20} 
          className={`transition-transform duration-200 
            ${isActive ? 'transform scale-110' : 'group-hover:scale-110'}`}
        />
        <span className="font-medium lg:block">
          {text}
        </span>
      </div>
      
      {/* Animated indicator */}
      {isActive && (
        <div className="absolute right-0 w-1 h-8 -translate-y-1/2 bg-blue-600 rounded-r-full animate-slide-in" 
        />
      )}
      
      {/* Hover indicator */}
      <div className={`absolute right-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-gray-300 rounded-r-full
        transition-opacity duration-200
        ${isActive ? 'opacity-0' : 'opacity-0 group-hover:opacity-100'}`} 
      />
    </NavLink>
  );

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Overlay for mobile sidebar */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 z-20 bg-black bg-opacity-50 lg:hidden animate-fade-in"
          onClick={toggleSidebar}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed lg:static lg:flex w-[240px] lg:w-72 z-30 transform  
          transition-all duration-300 ease-in-out 
          ${isSidebarOpen ? 'translate-x-0 h-full' : '-translate-x-full lg:translate-x-0 '}`}
      >
        <div className="flex flex-col w-full h-full bg-white border-r">
          <div className="flex items-center justify-between p-4 border-b logo">
            <div className="flex items-center space-x-2">
              <img 
                src={logo} 
                width={37} 
                height={37} 
                alt="JobFind Logo"
                className="transition-transform duration-300 hover:scale-110" 
              />
              <span className="text-xl font-semibold">JobFind</span>
            </div>
            <button
              className="text-gray-600 transition-transform duration-200 lg:hidden hover:text-gray-800 hover:scale-110"
              onClick={toggleSidebar}
            >
              <X size={20} />
            </button>
          </div>
          <nav className="flex-1 p-4 space-y-1">
            {menuItems.map((item) => (
              <NavItem
                key={item.text}
                icon={item.icon}
                text={item.text}
                path={item.path}
                isActive={activeItem === item.text}
              />
            ))}
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-col w-full">
        {/* Navbar */}
        <div className="border-b bg-white h-[70px] flex items-center px-4 justify-between">
          <div className="flex items-center gap-2">
            <button
              className="transition-transform duration-200 lg:hidden hover:scale-110"
              onClick={toggleSidebar}
            >
              <CgMenuLeftAlt size={20} />
            </button>
            <div className="flex items-center px-3 py-1 transition-all duration-200 rounded-lg bg-gray-50 focus-within:ring-2 focus-within:ring-blue-400">
              <Search className="text-gray-400 min-w-[20px]" size={20} />
              <input
                type="text"
                placeholder="Search"
                className="w-full p-2 bg-transparent outline-none sm:w-64"
              />
            </div>
          </div>
          <div className="flex items-center space-x-2 sm:space-x-4">
            <button className="p-2 transition-all duration-200 rounded-lg hover:bg-gray-100 hover:scale-110">
              <Bell size={20} className="text-gray-600" />
            </button>
            <button className="p-2 transition-all duration-200 rounded-lg hover:bg-gray-100 hover:scale-110">
              <Sun size={20} className="text-gray-600" />
            </button>
            <button className="flex items-center justify-center w-8 h-8 transition-transform duration-200 bg-gray-200 rounded-full hover:scale-110">
              <User size={20} className="text-gray-600" />
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 h-full p-4 bg-gray-50">
            <Outlet/>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

