import React from "react";
import { Routes, Route } from "react-router-dom";
// import './App.css'

import User from  './components/User/User'
import Heatmap from './components/Admin/Heatmap';
// import AdminLogin from './components/Admin/AdminLogin';
import Dashboard from './components/Admin/Dashboard';
import Home from './pages/Home'
import Admin from './components/Admin/Heatmap' 
// import User from './components/User/User'
import Signup from "./pages/Signup";
import Signin from "./pages/Signin";
import ReportIssue from "./components/User/ReportIssue";
import ProfilePage from "./components/User/Profile";
import ReportedIssuesPage from "./components/User/ReportedIssuesPanel";

export default function App() {
  return (
    <Routes>

      <Route path="/" element={<User />} />
      <Route path="/heatmap" element={<Heatmap />} />
      {/* <Route path="/admin/login" element={<AdminLogin />} /> */}
      <Route path="/admin/dashboard" element={<Dashboard />} />
      <Route path="/" element={<Home />} />
      {/* <Route path="/heatmap" element={<Heatmap />} /> */}
      {/* <Route path="/admin/login" element={<AdminLogin />} /> */}
      <Route path="/admin/" element={<Dashboard />} />

      {/* <Route path="/admin" element={<Admin/>}/> */}
      <Route path="/user" element={<User />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/signin" element={<Signin />} />
      <Route path="/report-issue" element={<ReportIssue />} />
      <Route path="/profile" element={<ProfilePage />} />
      <Route path="/reported-issues" element={<ReportedIssuesPage />} />
    </Routes>
  );
}
