// DepartmentDashboard.jsx
import React, { useState } from 'react';
import { IoDocumentTextOutline, IoTrendingUp } from "react-icons/io5";
import { FaRegClock } from "react-icons/fa6";
import { CiCircleCheck } from "react-icons/ci";
import { FaChartBar, FaFileAlt, FaBuilding, FaChartLine, FaMap, FaUser, FaBars, FaTimes, FaFilter, FaMapMarkerAlt, FaBell, FaCog, FaShare, FaExclamationTriangle } from 'react-icons/fa';
import Heatmap from "../Admin/Heatmap";
import { LoadScript } from "@react-google-maps/api";
import DepartmentFilterToolbar from './DepartmentFilterToolbar';
import DepartmentIssuesTable from './DepartmentIssuesTable';
import DepartmentIssueModal from './DepartmentIssueModal';
import DepartmentSidebar from './DepartmentSidebar';
import DepartmentDashboardCards from './DepartmentDashboardCards';
import { Navigate, useNavigate } from 'react-router-dom';

const DepartmentDashboard = () => {
  const navigate = useNavigate();
  const API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [selectedIssue, setSelectedIssue] = useState(null);
  const [filters, setFilters] = useState({
    category: '',
    location: '',
    priority: '',
    status: ''
  });

  // Mock current department (in a real app, this would come from authentication)
  const currentDepartment = 'Water Department';

  // Mock data - filtered by department
  const allIssues = [
    {
      id: 1,
      title: 'Broken Street Light on Main Road',
      category: 'Infrastructure',
      location: 'Main Road, Sector 15',
      priority: 'High',
      status: 'Pending',
      reportedDate: '2024-01-15',
      citizenName: 'Rajesh Kumar',
      citizenPhone: '+91 98765 43210',
      description: 'Street light has been non-functional for 3 days causing safety issues.',
      department: 'Public Works',
      lat: 25.7743393653043,
      lng: 84.1444480419159
    },
    {
      id: 2,
      title: 'Water Leakage in Residential Area',
      category: 'Water',
      location: 'Green Valley Colony',
      priority: 'Medium',
      status: 'In Progress',
      reportedDate: '2024-01-14',
      citizenName: 'Priya Sharma',
      citizenPhone: '+91 98765 43211',
      description: 'Major water leakage causing road damage and water wastage.',
      department: 'Water Department',
      lat: 25.775,
      lng: 84.145
    },
    {
      id: 3,
      title: 'Garbage Collection Missed',
      category: 'Sanitation',
      location: 'Park Street',
      priority: 'Low',
      status: 'Resolved',
      reportedDate: '2024-01-13',
      citizenName: 'Amit Patel',
      citizenPhone: '+91 98765 43212',
      description: 'Garbage has not been collected for 2 days.',
      department: 'Sanitation',
      lat: 25.773,
      lng: 84.143
    },
    {
      id: 4,
      title: 'Water Pipeline Burst',
      category: 'Water',
      location: 'Central Avenue',
      priority: 'High',
      status: 'Pending',
      reportedDate: '2024-01-16',
      citizenName: 'Sneha Verma',
      citizenPhone: '+91 98765 43213',
      description: 'Water pipeline burst causing flooding in the area.',
      department: 'Water Department',
      lat: 25.776,
      lng: 84.146
    }
  ];

  // Filter issues by current department
  const departmentIssues = allIssues.filter(issue => issue.department === currentDepartment);

  const filteredIssues = departmentIssues.filter(issue => {
    return (
      (filters.category === '' || issue.category === filters.category) &&
      (filters.location === '' || issue.location.toLowerCase().includes(filters.location.toLowerCase())) &&
      (filters.priority === '' || issue.priority === filters.priority) &&
      (filters.status === '' || issue.status === filters.status)
    );
  });

  // Calculate summary data for the department
  const departmentSummaryData = [
    { 
      title: 'Total Issues', 
      count: departmentIssues.length, 
      color: 'bg-blue-500', 
      icon: <IoDocumentTextOutline /> 
    },
    { 
      title: 'Pending', 
      count: departmentIssues.filter(issue => issue.status === 'Pending').length, 
      color: 'bg-orange-500', 
      icon: <FaRegClock /> 
    },
    { 
      title: 'In Progress', 
      count: departmentIssues.filter(issue => issue.status === 'In Progress').length, 
      color: 'bg-yellow-500', 
      icon: <IoTrendingUp /> 
    },
    { 
      title: 'Resolved', 
      count: departmentIssues.filter(issue => issue.status === 'Resolved').length, 
      color: 'bg-green-500', 
      icon: <CiCircleCheck /> 
    }
  ];

  const handleNavClick = (page) => {
    setCurrentPage(page);
    if (window.innerWidth < 768) {
        setSidebarOpen(false);
    }
  };

  const handleFilterChange = (filterType, value) => {
    setFilters(prev => ({ ...prev, [filterType]: value }));
  };

  const clearFilters = () => {
    setFilters({
      category: '',
      location: '',
      priority: '',
      status: ''
    });
  };

  const openIssueModal = (issue) => setSelectedIssue(issue);
  const closeIssueModal = () => setSelectedIssue(null);
  
  const updateIssueStatus = (issueId, newStatus) => {
    // In a real app, this would make an API call to update the issue status
    alert(`Issue ${issueId} status updated to ${newStatus}`);
    closeIssueModal();
  };

  const renderMainContent = () => {
    switch (currentPage) {
      case 'issues': return (
        <div className="space-y-4 sm:space-y-6">
          <DepartmentFilterToolbar 
            filters={filters} 
            handleFilterChange={handleFilterChange} 
            clearFilters={clearFilters} 
          />
          <DepartmentIssuesTable 
            filteredIssues={filteredIssues} 
            openIssueModal={openIssueModal} 
          />
        </div>
      );
      case 'map': return (
        <div className="bg-white rounded-lg shadow-md p-3 sm:p-4 mx-2 sm:mx-0">
          <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-3 sm:mb-4">
            Department Issue Locations
          </h2>
          <div 
            style={{ width: "100%", height: "400px" }} 
            className="rounded-lg overflow-hidden sm:h-[600px]"
          >
            <Heatmap issues={departmentIssues} />
          </div>
        </div>
      );
      default: return (
        <div className="space-y-4 sm:space-y-6">
          <DepartmentDashboardCards summaryData={departmentSummaryData} />
          <DepartmentFilterToolbar 
            filters={filters} 
            handleFilterChange={handleFilterChange} 
            clearFilters={clearFilters} 
          />
          <DepartmentIssuesTable 
            filteredIssues={filteredIssues} 
            openIssueModal={openIssueModal} 
          />
        </div>
      );
    }
  };

  return (
    <LoadScript googleMapsApiKey={API_KEY} libraries={["visualization"]}>
      <div className="min-h-screen bg-gray-100">
        <DepartmentSidebar
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
          currentPage={currentPage}
          handleNavClick={handleNavClick}
          departmentName={currentDepartment}
        />
        
        {/* Mobile backdrop overlay */}
        {sidebarOpen && (
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-20 md:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}
        
        <div className="md:ml-64 transition-all duration-300 ease-in-out">
          <header className="bg-white shadow-sm p-3 sm:p-4 flex justify-between items-center sticky top-0 z-30">
            <div className="flex items-center gap-3">
              <button 
                className="md:hidden text-gray-600 hover:text-gray-800 p-1" 
                onClick={() => setSidebarOpen(true)}
              >
                <FaBars size={20} />
              </button>
              <div>
                <h1 className="text-lg sm:text-xl font-bold text-gray-800 capitalize">
                  {currentPage}
                </h1>
                <p className="text-xs sm:text-sm text-gray-600 hidden sm:block">
                  {currentDepartment} - Manage department issues
                </p>
              </div>
            </div>
             <div className="flex items-center gap-2 sm:gap-4">
              
              <button 
                onClick={() => navigate('/profile')}
                className="p-2 text-gray-600 hover:text-gray-800 rounded-full hover:bg-gray-100 transition-colors"
              >
                <FaUser size={18} />
              </button>
            </div>
           
          </header>
          
          <main className="p-3 sm:p-4 lg:p-6">
            {renderMainContent()}
          </main>
        </div>
        
        {selectedIssue && (
          <DepartmentIssueModal 
            issue={selectedIssue} 
            onClose={closeIssueModal}
            onUpdateStatus={updateIssueStatus}
          />
        )}
      </div>
    </LoadScript>
  );
};

export default DepartmentDashboard;