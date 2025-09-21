// DepartmentDashboard.jsx
import React, { useState, useEffect } from "react";
import { IoDocumentTextOutline, IoTrendingUp } from "react-icons/io5";
import { FaRegClock } from "react-icons/fa6";
import { CiCircleCheck } from "react-icons/ci";
import axios from 'axios'
import {
  FaChartBar,
  FaFileAlt,
  FaBuilding,
  FaChartLine,
  FaMap,
  FaUser,
  FaBars,
  FaTimes,
  FaFilter,
  FaMapMarkerAlt,
  FaBell,
  FaCog,
  FaShare,
  FaExclamationTriangle,
} from "react-icons/fa";
import Heatmap from "../Admin/Heatmap";
import { useJsApiLoader } from "@react-google-maps/api";
import DepartmentFilterToolbar from "./DepartmentFilterToolbar";
import DepartmentIssuesTable from "./DepartmentIssuesTable";
import DepartmentIssueModal from "./DepartmentIssueModal";
import DepartmentSidebar from "./DepartmentSidebar";
import DepartmentDashboardCards from "./DepartmentDashboardCards";
import { Navigate, useNavigate } from "react-router-dom";
import ProfilePage  from "./DepartmentProfile";
// import { set } from "mongoose";

const DepartmentDashboard = () => {
  const navigate = useNavigate();
  const API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState("dashboard");
  const [selectedIssue, setSelectedIssue] = useState(null);
  const [filters, setFilters] = useState({
    category: "",
    location: "",
    priority: "",
    status: "",
  });
  const libraries = ["visualization"];
  const { isLoaded, loadError } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: API_KEY,
    libraries: libraries,
  });
  // Mock current department (in a real app, this would come from authentication)
  const [currentDepartment, setCurrentDepartment] = useState("");
  // Mock data - filtered by department
  const [issuesCount, setIssuesCount] = useState({
    total: 0,
    inProgress: 0,
    resolved: 0,
  });
  const [allIssues , setAllIssues] = useState([  ]);


  const filteredIssues = allIssues.filter((issue) => {
    return (
      (filters.category === "" || issue.category === filters.category) &&
      (filters.location === "" ||
        issue.location
          .toLowerCase()
          .includes(filters.location.toLowerCase())) &&
      (filters.priority === "" || issue.priority === filters.priority) &&
      (filters.status === "" || issue.status === filters.status)
    );
  });

useEffect(() => {
  const userDetail = JSON.parse(localStorage.getItem('userDetail'));
  if (userDetail?.department) {
    setCurrentDepartment(userDetail.department);
  }
}, []);
  useEffect(() => {
    const getIssueCount = async () => {
      try {
        const dept = JSON.parse(localStorage.getItem('userDetail')).department;
        const response = await axios.post("/dept/issueCount", {dept},{
          withCredentials: true,
        });
        const data = response.data;
        console.log(data);
        if (data.message) {
          const counts = data.data;
          setIssuesCount(counts);
        }
      } catch(err) {
        console.error(err);
      }
    };
    const getAllIssues = async () => {
      try{
        const response = await axios.get('/dept/allIssues',{withCredentials:true});
        const data = response.data;
        console.log(data)
        if(data.message){
          const issues = data.data;
          setAllIssues(issues);
        }else{
          console.warn(data.error);
        }
      }catch(err){
        console.error(err);
      }
    }
    getIssueCount();
    getAllIssues();
  }, []);

  // Calculate summary data for the department
  const departmentSummaryData = [
    {
      title: "Total Issues",
      count: issuesCount.total,
      color: "bg-blue-500",
      icon: <IoDocumentTextOutline />,
    },
    // {
    //   title: 'Pending',
    //   count: departmentIssues.filter(issue => issue.status === 'Pending').length,
    //   color: 'bg-orange-500',
    //   icon: <FaRegClock />
    // },
    {
      title: "In Progress",
      count: issuesCount.inProgress,
      color: "bg-yellow-500",
      icon: <IoTrendingUp />,
    },
    {
      title: "Resolved",
      count: issuesCount.resolved,
      color: "bg-green-500",
      icon: <CiCircleCheck />,
    },
  ];

  const handleNavClick = (page) => {
    setCurrentPage(page);
    if (window.innerWidth < 768) {
      setSidebarOpen(false);
    }
  };

  const handleFilterChange = (filterType, value) => {
    setFilters((prev) => ({ ...prev, [filterType]: value }));
  };

  const clearFilters = () => {
    setFilters({
      category: "",
      location: "",
      priority: "",
      status: "",
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
      case "profile":
        return <ProfilePage 
        adminData ={localStorage.getItem('userDetail')}
        />;
      case "issues":
        return (
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
      case "map":
        return (
          <div className="bg-white rounded-lg shadow-md p-3 sm:p-4 mx-2 sm:mx-0">
            <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-3 sm:mb-4">
              Department Issue Locations
            </h2>
            <div
              style={{ width: "100%", height: "400px" }}
              className="rounded-lg overflow-hidden sm:h-[600px]"
            >
              <Heatmap showFilters={true} />
            </div>
          </div>
        );
      default:
        return (
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
    <>
      {isLoaded ? (
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
              {/* <div className="flex items-center gap-2 sm:gap-4">
                <button
                  onClick={() => navigate("/profile")}
                  className="p-2 text-gray-600 hover:text-gray-800 rounded-full hover:bg-gray-100 transition-colors"
                >
                  <FaUser size={18} />
                </button>
              </div> */}
            </header>

            <main className="p-3 sm:p-4 lg:p-6">{renderMainContent()}</main>
          </div>

          {selectedIssue && (
            <DepartmentIssueModal
              issue={selectedIssue}
              onClose={closeIssueModal}
              onUpdateStatus={updateIssueStatus}
            />
          )}
        </div>
      ) : (
        <p>Cant load</p>
      )}
    </>
  );
};

export default DepartmentDashboard;
