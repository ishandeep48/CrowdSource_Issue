import React from 'react';
import { FaChartBar, FaFileAlt, FaMap, FaUser, FaTimes, FaBuilding } from 'react-icons/fa';

const DepartmentSidebar = ({ sidebarOpen, setSidebarOpen, currentPage, handleNavClick, departmentName }) => {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: <FaChartBar /> },
    { id: 'issues', label: 'Issues', icon: <FaFileAlt /> },
    { id: 'map', label: 'Map View', icon: <FaMap /> },
    
  ];

  return (
    <>
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-gray-800 bg-opacity-50 z-40 md:hidden" 
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}
      
      {/* Sidebar */}
      <div className={`
        fixed inset-y-0 left-0 transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} 
        md:translate-x-0 transition duration-300 ease-in-out z-50 w-64 bg-blue-800 text-white
      `}>
        <div className="flex items-center justify-between p-4 border-b border-blue-700">
          <div className="flex items-center space-x-2">
            <FaBuilding className="text-2xl" />
            <span className="text-xl font-semibold">CivicSeva</span>
          </div>
          <button 
            className="md:hidden text-white" 
            onClick={() => setSidebarOpen(false)}
          >
            <FaTimes />
          </button>
        </div>
        
        <div className="p-4 border-b border-blue-700">
          <p className="text-sm text-blue-200">Logged in as:</p>
          <p className="font-medium truncate">{departmentName}</p>
        </div>
        
        <nav className="p-4">
          <ul className="space-y-2">
            {menuItems.map(item => (
              <li key={item.id}>
                <button
                  onClick={() => handleNavClick(item.id)}
                  className={`w-full flex items-center space-x-3 p-3 rounded-lg transition-colors ${
                    currentPage === item.id 
                      ? 'bg-blue-900 text-white' 
                      : 'text-blue-200 hover:bg-blue-700'
                  }`}
                >
                  <span className="text-lg">{item.icon}</span>
                  <span>{item.label}</span>
                </button>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </>
  );
};

export default DepartmentSidebar;