import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import './App.css'
import User from  './components/User'

export default function App() {
return(
  <Router>
    <Routes>
      <Route path="/" element={<User />} />
    </Routes>
  </Router>
)
}


