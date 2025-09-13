import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import './App.css'
import User from  './components/User/User'
import Heatmap from './components/Admin/Heatmap';

export default function App() {
return(
  <Router>
    <Routes>
      <Route path="/" element={<User />} />
      <Route path="/heatmap" element={<Heatmap />} />
    </Routes>
  </Router>
)
}


