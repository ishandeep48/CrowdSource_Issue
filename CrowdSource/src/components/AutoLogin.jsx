// ProtectedRoute.jsx
import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children }) {
  const userStr = localStorage.getItem("userDetail");
  if (!userStr) {
    // Not logged in → redirect to login
    return children;
  }

  const user = JSON.parse(userStr);

  if (user.role == "department") {
    // Logged in but not authorized → redirect to home
    return <Navigate to="/dept-dashboard" replace />;
  }
  if (user.role == "admin") {
    return <Navigate to="/admin/" replace />;
  }
if(user.role == 'user'){
    return <Navigate to="/user" replace />;
}

  // Logged in and authorized → render children
  return children;
}
