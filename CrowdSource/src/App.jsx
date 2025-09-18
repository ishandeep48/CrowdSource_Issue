import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import './App.css'
import User from  './components/User/User'
import Heatmap from './components/Admin/Heatmap';
import AdminLogin from './components/Admin/AdminLogin';
import Dashboard from './components/Admin/Dashboard';

export default function App() {
return(
  <Router>
    <Routes>
      <Route path="/" element={<User />} />
      <Route path="/heatmap" element={<Heatmap />} />
      <Route path="/admin/login" element={<AdminLogin />} />
      <Route path="/admin/dashboard" element={<Dashboard />} />
    </Routes>
  </Router>
)
}


