import React from 'react';
import { FaChartBar, FaFileAlt, FaTimes, FaBuilding, FaUser } from 'react-icons/fa';

const DepartmentSidebar = ({ 
  sidebarOpen, 
  setSidebarOpen, 
  currentPage, 
  handleNavClick, 
  departmentName 
}) => {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: <FaChartBar /> },
    { id: 'issues', label: 'Issues', icon: <FaFileAlt /> },
    { id: 'profile', label: 'Profile', icon: <FaUser /> },
  ];

  // Map departments to bg, text, and border colors
  const deptStyles = {
    Road: { bg: "bg-gray-200", text: "text-gray-900", border: "border-gray-400", hover: "hover:bg-gray-300" },
    Water: { bg: "bg-blue-800", text: "text-white", border: "border-blue-700", hover: "hover:bg-blue-700" },
    Electricity: { bg: "bg-yellow-400", text: "text-gray-900", border: "border-yellow-600", hover: "hover:bg-yellow-300" },
    Gas: { bg: "bg-green-700", text: "text-white", border: "border-green-600", hover: "hover:bg-green-600" },
    Garbage: { bg: "bg-red-600", text: "text-white", border: "border-red-700", hover: "hover:bg-red-500" },
  };

  const currentStyle = deptStyles[departmentName] || { 
    bg: "bg-blue-800", text: "text-white", border: "border-blue-700", hover: "hover:bg-blue-700" 
  };

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
        md:translate-x-0 transition duration-300 ease-in-out z-50 w-64 
        ${currentStyle.bg} ${currentStyle.text}
      `}>
        {/* Header */}
        <div className={`flex items-center justify-between p-4 border-b ${currentStyle.border}`}>
          <div className="flex items-center space-x-2">
            <FaBuilding className="text-2xl" />
            <span className="text-xl font-semibold">CivicSeva</span>
          </div>
          <button 
            className="md:hidden" 
            onClick={() => setSidebarOpen(false)}
          >
            <FaTimes />
          </button>
        </div>

        {/* Logged in info */}
        <div className={`p-4 border-b ${currentStyle.border}`}>
          <p className={`text-sm opacity-70`}>Logged in as:</p>
          <p className="font-medium truncate">{departmentName} Department</p>
        </div>

        {/* Menu */}
        <nav className="p-4">
          <ul className="space-y-2">
            {menuItems.map(item => (
              <li key={item.id}>
                <button
                  onClick={() => handleNavClick(item.id)}
                  className={`
                    w-full flex items-center space-x-3 p-3 rounded-lg transition-colors 
                    ${currentPage === item.id 
                      ? `${currentStyle.hover} ${currentStyle.text} font-semibold` 
                      : `${currentStyle.text} ${currentStyle.hover} opacity-80 hover:opacity-100`}
                  `}
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
