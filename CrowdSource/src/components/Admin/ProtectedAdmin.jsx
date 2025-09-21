// ProtectedRoute.jsx
import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children }) {
  const userStr = localStorage.getItem("userDetail");
  if (!userStr) {
    // Not logged in → redirect to login
    return <Navigate to="/" replace />;
  }

  const user = JSON.parse(userStr);

  if (user.role !== "admin") {
    // Logged in but not authorized → redirect to home
    return <Navigate to="/signin" replace />;
  }

  // Logged in and authorized → render children
  return children;
}
