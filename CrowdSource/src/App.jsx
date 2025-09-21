import React from "react";
import { Routes, Route } from "react-router-dom";
// import './App.css'

import ProtectedUser from "./components/User/ProtectedUser";
import User from "./components/User/User";
import Heatmap from "./components/Admin/Heatmap";
// import AdminLogin from './components/Admin/AdminLogin';
import Dashboard from "./components/Admin/Dashboard";
import Home from "./pages/Home";
import Admin from "./components/Admin/Heatmap";
// import User from './components/User/User'
import Signup from "./pages/Signup";
import Signin from "./pages/Signin";
import ReportIssue from "./components/User/ReportIssue";
import ProfilePage from "./components/User/Profile";
import ReportedIssuesPage from "./components/User/ReportedIssuesPanel";
import AreaIssuesPage from "./components/User/AreaIssuesPage";
import DepartmentDashboard from "./components/Department/DepartmentDashboard";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/admin/" element={<Dashboard />} />
      <Route
        path="/user"
        element={
          <ProtectedUser>
            <User />
         </ProtectedUser>
        }
      />
      <Route path="/signup" element={<Signup />} />
      <Route path="/signin" element={<Signin />} />
      <Route
        path="/report-issue"
        element={
          <ProtectedUser>
            <ReportIssue />
         </ProtectedUser>
        }
      />
      <Route
        path="/profile"
        element={
          <ProtectedUser>
            <ProfilePage />
         </ProtectedUser>
        }
      />
      <Route
        path="/reported-issues"
        element={
          <ProtectedUser>
            <ReportedIssuesPage />
         </ProtectedUser>
        }
      />
      <Route
       path="/area-issues"
        element=
        {<ProtectedUser><AreaIssuesPage /></ProtectedUser>} /> 
      <Route
      path="/dept-dashboard"
      element= {<DepartmentDashboard />} />
      
    </Routes>
  );
}
