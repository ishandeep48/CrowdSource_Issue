import React, { useState } from "react";
import { IoDocumentTextOutline, IoTrendingUp } from "react-icons/io5";
import { FaRegClock } from "react-icons/fa6";
import { CiCircleCheck } from "react-icons/ci";
import axios from 'axios'
import {
  // FaChartBar,
  // FaFileAlt,
  // FaBuilding,
  // FaChartLine,
  // FaMap,
  // FaUser,
  FaBars,
  // FaTimes,
  // FaFilter,
  // FaMapMarkerAlt,
  FaBell,
  FaCog,
  // FaShare,
  // FaExclamationTriangle,
} from "react-icons/fa";
import Heatmap from "./Heatmap"; // Assuming Heatmap component is in this path
import { useJsApiLoader } from "@react-google-maps/api";
import FilterToolbars from "./FilterToolbar";
import IssuesTables from "./IssuesTable";
import ProfilePage from "./ProfilePage";
import IssueModals from "./IssueModal";
import Sidebars from "./Sidebar";
import DashboardCardss from "./DashboardCards";
import { useEffect } from "react";

const CivicSevaAdminDashboard = () => {
  const API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState("dashboard");
  const [selectedIssue, setSelectedIssue] = useState(null);
  const [issueCount, setIssueCount] = useState({
    total: 0,
    pending: 0,
    inProgress: 0,
    resolved: 0,
  });
  const [filters, setFilters] = useState({
    category: "",
    location: "",
    priority: "",
    department: "",
  });

  const libraries = ["visualization"];
  const { isLoaded, loadError } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: API_KEY,
    libraries: libraries,
  });

  // Mock data
  const [issues,setIssues] = useState([]);
  // Get all the counts from the backend
  useEffect(() => {
    const getIssueCount = async () => {
      try {
        const response = await axios.get("http://localhost/admin/issueDetails", {withCredentials:true});
        if (response.data.message) {
          const counts = response.data.data;
          console.log(counts)
          setIssueCount(counts);
        } else {
          console.warn("Couldnt Reach the Server please check your internet");
        }
      } catch (err) {
        console.error(err);
      }
    };
    const getAllIssues = async()=>{
      try{
        const response = await axios.get('http://localhost/admin/issues',{withCredentials:true});
        if(response.data.message){
          const iss = response.data.data;
          setIssues(iss);
        }else{
          console.warn('Couldnt get the data')
        }
      }catch(err){
        console.error("Some Error Occured")
      }
    }
    getIssueCount();
    getAllIssues();
  }, []);
  const filteredIssues = issues.filter((issue) => {
    return (
      (filters.category === "" || issue.category === filters.category) &&
      (filters.location === "" ||
        issue.location
          .toLowerCase()
          .includes(filters.location.toLowerCase())) &&
      (filters.priority === "" || issue.priority === filters.priority) &&
      (filters.department === "" || issue.department === filters.department)
    );
  });

  const summaryData = [
    {
      title: "Total Issues",
      count: issueCount.total,
      color: "bg-blue-500",
      icon: <IoDocumentTextOutline />,
    },
    {
      title: "Pending",
      count: issueCount.pending,
      color: "bg-orange-500",
      icon: <FaRegClock />,
    },
    {
      title: "In Progress",
      count: issueCount.inProgress,
      color: "bg-yellow-500",
      icon: <IoTrendingUp />,
    },
    {
      title: "Resolved",
      count: issueCount.resolved,
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
      department: "",
    });
  };

  const openIssueModal = (issue) => setSelectedIssue(issue);
  const closeIssueModal = () => setSelectedIssue(null);
  const forwardToDepartment = () => {
    alert("Issue forwarded to department successfully!");
    closeIssueModal();
  };
  const changePriority = () => {
    alert("Priority updated successfully!");
    closeIssueModal();
  };

  const Sidebar = () => (
    <Sidebars
      sidebarOpen={sidebarOpen}
      setSidebarOpen={setSidebarOpen}
      currentPage={currentPage}
      handleNavClick={handleNavClick}
    />
  );

  const DashboardCards = () => <DashboardCardss summaryData={summaryData} />;

  const FilterToolbar = () => (
    <FilterToolbars
      filters={filters}
      handleFilterChange={handleFilterChange}
      clearFilters={clearFilters}
    />
  );

  const IssuesTable = () => (
    <IssuesTables
      filteredIssues={filteredIssues}
      openIssueModal={openIssueModal}
    />
    
  );
  const handlePriorityChange = async(ID, priority) =>{
    // alert(`ID: ${ID}, Priority: ${priority}`);
    try{
      const response = await axios.post('http://localhost/admin/changePriority',{ID,priority},{withCredentials:true});
      const data = response.data;
      if(data.message){
        alert('changed Priority')
      }else{
        alert(data.error)
      }
    }catch(err){
      console.warn(err)
    }
  }
  const IssueModal = () => (
    <IssueModals
      issue={selectedIssue}
      onClose={() => setSelectedIssue(null)}
      onForward={() => alert("Forwarded!")}
      onChangePriority={handlePriorityChange}
    />
  );

  // const ProfilePage = () => <ProfilePages />; why tf is this line of code here

  const PlaceholderPage = ({ title, description }) => (
    <div className="bg-white rounded-lg shadow-md p-6 text-center">
      <h2 className="text-2xl font-bold text-gray-800 mb-2">{title}</h2>
      <p className="text-gray-600">{description}</p>
    </div>
  );

  const renderMainContent = () => {
    switch (currentPage) {
      case "profile":
        return <ProfilePage 
        adminData ={localStorage.getItem('userDetail')}
        />;
      case "departments":
        return (
          <PlaceholderPage
            title="Departments"
            description="Department management interface coming soon..."
          />
        );
      case "reports":
        return (
          <PlaceholderPage
            title="Reports"
            description="Reporting and analytics interface coming soon..."
          />
        );
      case "issues":
        return (
          <div>
            <FilterToolbar />
            <IssuesTable />
          </div>
        );
      case "map":
        return (
          <div className="bg-white rounded-lg shadow-md p-4">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              City-Wide Issue Hotspots
            </h2>
            <div
              style={{ width: "100%", height: "600px" }}
              className="rounded-lg overflow-hidden"
            >
              <Heatmap />
            </div>
          </div>
        );
      default:
        return (
          <div>
            <DashboardCards />
            <FilterToolbar />
            <IssuesTable />
          </div>
        );
    }
  };

  return (
    <>
      {isLoaded ? (
        <div className="min-h-screen bg-gray-100">
          <Sidebar />
          <div className="md:ml-64 transition-all duration-300 ease-in-out">
            <header className="bg-white shadow-sm p-4 flex justify-between items-center sticky top-0 z-30">
              <button
                className="md:hidden text-gray-600 hover:text-gray-800"
                onClick={() => setSidebarOpen(true)}
              >
                <FaBars size={20} />
              </button>
              <div className="flex-grow md:flex-grow-0">
                <h1 className="text-xl font-bold text-gray-800 capitalize">
                  {currentPage}
                </h1>
                <p className="text-sm text-gray-600 hidden sm:block">
                  Manage civic issues and citizen requests
                </p>
              </div>
              <div className="flex items-center gap-4">
                <button className="p-2 text-gray-600 hover:text-gray-800 rounded-full hover:bg-gray-100">
                  <FaBell size={20} />
                </button>
                <button className="p-2 text-gray-600 hover:text-gray-800 rounded-full hover:bg-gray-100">
                  <FaCog size={20} />
                </button>
              </div>
            </header>
            <main className="p-6">{renderMainContent()}</main>
          </div>
          <IssueModal />
        </div>
      ) : (
        <p>Cant load</p>
      )}
      {/* <LoadScript
        googleMapsApiKey={API_KEY}
        libraries={["visualization"]}
      ></LoadScript> */}
    </>
  );
};

export default CivicSevaAdminDashboard;
