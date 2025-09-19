import React from "react";
import { 
  FaTimes, FaChartBar, FaFileAlt, FaBuilding, FaChartLine, FaMap, FaUser 
} from "react-icons/fa";

const Sidebar = ({ sidebarOpen, setSidebarOpen, currentPage, handleNavClick }) => {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: <FaChartBar /> },
    { id: 'issues', label: 'Issues', icon: <FaFileAlt /> },
    { id: 'departments', label: 'Departments', icon: <FaBuilding /> },
    { id: 'reports', label: 'Reports', icon: <FaChartLine /> },
    { id: 'map', label: 'Map', icon: <FaMap /> },
    { id: 'profile', label: 'Profile', icon: <FaUser /> }
  ];

  return (
    <aside className={`bg-white shadow-lg h-screen fixed left-0 top-0 z-40 transform transition-transform duration-300 ease-in-out ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0 md:w-64`}>
      <div className="flex items-center justify-between p-6 border-b border-gray-200">
        <h1 className="text-xl font-bold text-blue-600">CivicSeva Admin</h1>
        <button className="md:hidden text-gray-500 hover:text-gray-700" onClick={() => setSidebarOpen(false)}>
          <FaTimes size={20} />
        </button>
      </div>

      <nav className="mt-6">
        {menuItems.map(item => (
          <button
            key={item.id}
            onClick={() => handleNavClick(item.id)}
            className={`w-full flex items-center px-6 py-3 text-left hover:bg-blue-50 transition-colors ${
              currentPage === item.id ? 'bg-blue-50 text-blue-600 border-r-4 border-blue-600' : 'text-gray-600'
            }`}
          >
            <span className="w-6 h-6 mr-3 flex items-center justify-center text-lg">{item.icon}</span>
            <span>{item.label}</span>
          </button>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;
