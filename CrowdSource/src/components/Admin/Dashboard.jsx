import React, { useState } from 'react';
// import './Dashboard.css';
import { IoDocumentTextOutline } from "react-icons/io5";
import { FaRegClock } from "react-icons/fa6";
import { IoTrendingUp } from "react-icons/io5";
import { CiCircleCheck } from "react-icons/ci";
import Heatmap from "../Admin/Heatmap"
import { LoadScript } from "@react-google-maps/api";

const CivicSevaAdminDashboard = () => {
  const API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [selectedIssue, setSelectedIssue] = useState(null);
  const [filters, setFilters] = useState({
  category: '',
  location: '',
  priority: '',
  department: ''
});
  

  // Mock data
  const issues = [
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
      lat:25.7743393653043,
      lng:84.1444480419159
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
      department: 'Water Department'
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
      department: 'Sanitation'
    }
  ];
  const filteredIssues = issues.filter(issue => {
  return (
    (filters.category === '' || issue.category === filters.category) &&
    (filters.location === '' || issue.location.toLowerCase().includes(filters.location.toLowerCase())) &&
    (filters.priority === '' || issue.priority === filters.priority) &&
    (filters.department === '' || issue.department === filters.department)
  );
});

  const summaryData = [
    { title: 'Total Issues', count: 156, color: 'blue', icon: <IoDocumentTextOutline /> },
    { title: 'Pending', count: 42, color: 'orange', icon: <FaRegClock /> },
    { title: 'In Progress', count: 28, color: 'yellow', icon: <IoTrendingUp /> },
    { title: 'Resolved', count: 86, color: 'green', icon: <CiCircleCheck /> }
  ];

  const activityLog = [
    { action: 'Forwarded issue #1245 to Water Department', date: '2024-01-15 10:30 AM' },
    { action: 'Updated priority of issue #1244 to High', date: '2024-01-15 09:15 AM' },
    { action: 'Resolved issue #1243', date: '2024-01-14 04:45 PM' },
    { action: 'Assigned issue #1242 to Public Works', date: '2024-01-14 02:30 PM' }
  ];

  const handleNavClick = (page) => {
    setCurrentPage(page);
  };

  const handleFilterChange = (filterType, value) => {
    setFilters(prev => ({ ...prev, [filterType]: value }));
  };

  const clearFilters = () => {
    setFilters({
      category: '',
      location: '',
      priority: '',
      department: ''
    });
  };

  const openIssueModal = (issue) => {
    setSelectedIssue(issue);
  };

  const closeIssueModal = () => {
    setSelectedIssue(null);
  };

  const forwardToDepartment = () => {
    alert('Issue forwarded to department successfully!');
    closeIssueModal();
  };

  const changePriority = () => {
    alert('Priority updated successfully!');
    closeIssueModal();
  };

  const Sidebar = () => (
    <aside className={`sidebar ${sidebarOpen ? "open" : ""}`}>
      <div className="sidebar-header">
        <h1 className="sidebar-title">CivicSeva Admin</h1>
        <button
        className="sidebar-close-btn"
        onClick={() => setSidebarOpen(false)}
      >
        <i className="fas fa-times"></i>
      </button>
      </div>
      <nav className="sidebar-nav">
        <button 
          className={`nav-item ${currentPage === 'dashboard' ? 'active' : ''}`}
          onClick={() => handleNavClick('dashboard')}
        >
          <i className="fas fa-chart-bar"></i>
          <span>Dashboard</span>
        </button>
        <button 
          className={`nav-item ${currentPage === 'issues' ? 'active' : ''}`}
          onClick={() => handleNavClick('issues')}
        >
          <i className="fas fa-file-text"></i>
          <span>Issues</span>
        </button>
        <button 
          className={`nav-item ${currentPage === 'departments' ? 'active' : ''}`}
          onClick={() => handleNavClick('departments')}
        >
          <i className="fas fa-building"></i>
          <span>Departments</span>
        </button>
        <button 
          className={`nav-item ${currentPage === 'reports' ? 'active' : ''}`}
          onClick={() => handleNavClick('reports')}
        >
          <i className="fas fa-chart-line"></i>
          <span>Reports</span>
        </button>
        <button 
          className={`nav-item ${currentPage === 'map' ? 'active' : ''}`}
          onClick={() => handleNavClick('map')}
        >
          <i className="fas fa-map"></i>
          <span>Map</span>
        </button>

        <button 
          className={`nav-item ${currentPage === 'profile' ? 'active' : ''}`}
          onClick={() => handleNavClick('profile')}
        >
          <i className="fas fa-user"></i>
          <span>Profile</span>
        </button>
      </nav>
    </aside>
  );

  const DashboardCards = () => (
    <div className="dashboard-cards">
      {summaryData.map((item, index) => (
        <div key={index} className="summary-card">
          <div className="card-content">
            <div className="card-info">
              <h3 className="card-title">{item.title}</h3>
              <p className="card-count">{item.count}</p>
            </div>
            <div className={`card-icon ${item.color}`}>
              <span>{item.icon}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  const FilterToolbar = () => (
    <div className="filter-toolbar">
      <div className="filter-content">
        <div className="filter-label">
          <i className="fas fa-filter"></i>
          <span>Filters:</span>
        </div>
        
        <select
          value={filters.category}
          onChange={(e) => handleFilterChange('category', e.target.value)}
          className="filter-select"
        >
          <option value="">All Categories</option>
          <option value="Infrastructure">Infrastructure</option>
          <option value="Water">Water</option>
          <option value="Sanitation">Sanitation</option>
          <option value="Roads">Roads</option>
        </select>

        <div className="filter-input-wrapper">
          <i className="fas fa-map-marker-alt"></i>
          <input
            type="text"
            placeholder="Location"
            value={filters.location}
            onChange={(e) => handleFilterChange('location', e.target.value)}
            className="filter-input"
          />
        </div>

        <select
          value={filters.priority}
          onChange={(e) => handleFilterChange('priority', e.target.value)}
          className="filter-select"
        >
          <option value="">All Priorities</option>
          <option value="High">High</option>
          <option value="Medium">Medium</option>
          <option value="Low">Low</option>
        </select>

        <select
          value={filters.department}
          onChange={(e) => handleFilterChange('department', e.target.value)}
          className="filter-select"
        >
          <option value="">All Departments</option>
          <option value="Public Works">Public Works</option>
          <option value="Water Department">Water Department</option>
          <option value="Sanitation">Sanitation</option>
        </select>

        <button className="clear-filters-btn" onClick={clearFilters}>
          Clear Filters
        </button>
      </div>
    </div>
  );

  const IssuesTable = () => (
    <div className="issues-table-container">
      <div className="table-wrapper">
        <table className="issues-table">
          <thead>
            <tr>
              <th>Issue Title</th>
              <th>Category</th>
              <th>Location</th>
              <th>Priority</th>
              <th>Status</th>
              <th>Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredIssues.map((issue) => (
              <tr key={issue.id}>
                <td>
                  <div className="issue-title">{issue.title}</div>
                </td>
                <td>
                  <span className="category-badge">{issue.category}</span>
                </td>
                <td className="location-text">{issue.location}</td>
                <td>
                  <span className={`priority-badge ${issue.priority.toLowerCase()}`}>
                    {issue.priority}
                  </span>
                </td>
                <td>
                  <span className={`status-badge ${issue.status.toLowerCase().replace(' ', '-')}`}>
                    {issue.status}
                  </span>
                </td>
                <td className="date-text">{issue.reportedDate}</td>
                <td>
                  <button 
                    className="view-details-btn"
                    onClick={() => openIssueModal(issue)}
                  >
                    View Details
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const IssueModal = () => (
    selectedIssue && (
      <div className="modal-overlay" onClick={closeIssueModal}>
        <div className="modal-content" onClick={(e) => e.stopPropagation()}>
          <div className="modal-header">
            <h2>Issue Details</h2>
            <button className="modal-close" onClick={closeIssueModal}>
              <i className="fas fa-times"></i>
            </button>
          </div>
          
          <div className="modal-body">
            <div className="issue-description">
              <h3>{selectedIssue.title}</h3>
              <p>{selectedIssue.description}</p>
            </div>

            <div className="issue-details-grid">
              <div className="detail-item">
                <label>Category</label>
                <p>{selectedIssue.category}</p>
              </div>
              <div className="detail-item">
                <label>Priority</label>
                <p>{selectedIssue.priority}</p>
              </div>
              <div className="detail-item">
                <label>Location</label>
                <p>{selectedIssue.location}</p>
              </div>
              <div className="detail-item">
                <label>Reported Date</label>
                <p>{selectedIssue.reportedDate}</p>
              </div>
            </div>

            <div className="citizen-info">
              <label>Citizen Information</label>
              <p>{selectedIssue.citizenName}</p>
              <p>{selectedIssue.citizenPhone}</p>
            </div>

            <div className="location-map" style={{display: selectedIssue ? 'block' : 'none'}}>
              <h4>Location Map</h4>
              <div style={{ width: "100%", height: "300px" }}>
                <Heatmap center={selectedIssue ? { lat: selectedIssue.lat, lng: selectedIssue.lng } : undefined} />
              </div>
            </div>


            <div className="action-controls">
              <div className="control-group">
                <label>Forward to Department</label>
                <select className="action-select">
                  <option>Public Works</option>
                  <option>Water Department</option>
                  <option>Sanitation</option>
                </select>
              </div>
              
              <div className="control-group">
                <label>Change Priority</label>
                <select className="action-select">
                  <option>High</option>
                  <option>Medium</option>
                  <option>Low</option>
                </select>
              </div>
              
              <div className="control-group">
                <label>Update Status</label>
                <select className="action-select" disabled>
                  <option>Pending</option>
                  <option>In Progress</option>
                  <option>Resolved</option>
                </select>
              </div>
            </div>
          </div>

          <div className="modal-footer">
            <button className="btn-cancel" onClick={closeIssueModal}>
              Cancel
            </button>
            <button className="btn-forward" onClick={forwardToDepartment}>
              <i className="fas fa-share"></i>
              Forward to Department
            </button>
            <button className="btn-priority" onClick={changePriority}>
              <i className="fas fa-exclamation-triangle"></i>
              Change Priority
            </button>
          </div>
        </div>
      </div>
    )
  );

  const ProfilePage = () => (
    <div className="profile-page">
      <div className="profile-card">
        <h2>Admin Profile</h2>
        
        <div className="profile-form">
          <div className="form-row">
            <div className="form-group">
              <label>Name</label>
              <input type="text" defaultValue="Admin" />
            </div>
            <div className="form-group">
              <label>Email</label>
              <input type="email" defaultValue="admin@civicseva.gov" />
            </div>
          </div>
          
          <div className="form-row">
            <div className="form-group">
              <label>Role</label>
              <input type="text" defaultValue="System Administrator" disabled />
            </div>
            <div className="form-group">
              <label>Department</label>
              <input type="text" defaultValue="IT Administration" />
            </div>
          </div>
        </div>
        
        <div className="password-section">
          <h3>Change Password</h3>
          <div className="form-row">
            <div className="form-group">
              <label>Current Password</label>
              <input type="password" />
            </div>
            <div className="form-group">
              <label>New Password</label>
              <input type="password" />
            </div>
          </div>
        </div>
        
        <div className="profile-actions">
          <button className="btn-cancel">Cancel</button>
          <button className="btn-primary">Update Profile</button>
        </div>
      </div>
    </div>
  );

  const renderMainContent = () => {
    switch (currentPage) {
      case 'profile':
        return <ProfilePage />;
      case 'departments':
        return (
          <div className="placeholder-page">
            <h2>Departments</h2>
            <p>Department management interface coming soon...</p>
          </div>
        );
      case 'reports':
        return (
          <div className="placeholder-page">
            <h2>Reports</h2>
            <p>Reporting and analytics interface coming soon...</p>
          </div>
        );
      case 'issues':
        return (
          <div>
            <FilterToolbar />
            <IssuesTable />
          </div>
        );
      case 'map':
        return (
          <div className="map-page">
            {/* <h2>City Issues Map</h2> */}
            <div style={{ width: "100%", height: "600px" }}>
              {/* No center prop → will show full heatmap with issues */}
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
    <LoadScript googleMapsApiKey={API_KEY} libraries={["visualization"]}>
    <div className="dashboard-container">
      <Sidebar />
      <div className="main-wrapper">
        <header className="main-header">
          <button 
            className="hamburger-btn" 
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            <i className="fas fa-bars"></i>
          </button>

          <div className="header-content">
            <div>
              <h1 className="page-title">
                {currentPage === 'dashboard' ? 'Dashboard' : 
                 currentPage.charAt(0).toUpperCase() + currentPage.slice(1)}
              </h1>
              <p className="page-subtitle">Manage civic issues and citizen requests</p>
            </div>
            <div className="header-actions">
              <button className="header-btn">
                <i className="fas fa-bell"></i>
              </button>
              <button className="header-btn">
                <i className="fas fa-cog"></i>
              </button>
            </div>
          </div>
        </header>
        
        <main className="main-content">
          {renderMainContent()}
        </main>
      </div>
      
      <IssueModal />
    </div>
    </LoadScript>
  );
};

export default CivicSevaAdminDashboard;