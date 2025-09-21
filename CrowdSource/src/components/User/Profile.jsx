import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Navbar from "./NavbarUser";
import ReportedIssuesPanel from "./ReportedIssuesPanel";

export default function ProfilePage() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const [newPassword, setNewPassword] = useState(""); // for input field
  const [currentPassword, setCurrentPassword] = useState("");
  const [passwordUpdated, setPasswordUpdated] = useState(false);
  const [showPasswordInput, setShowPasswordInput] = useState(false);
  const [modalPasswordMessage, setModalPasswordMessage] = useState("");
  const [showPasswordModal, setShowPasswordModal] = useState(false);

  useEffect(() => {
    const getUserData = async () => {
      const response = await axios.get("/user/profile", {
        withCredentials: true,
      });
      const userData = response.data;
      // console.log(data);
      console.log(userData);
      setUser(userData);
    };
    getUserData();
  }, []);
  const handleLogout = async () => {
    try {
      await axios.post(
        "/user/logout",
        {},
        { withCredentials: true }
      );
      localStorage.removeItem("userDetail");
      navigate("/");
    } catch (err) {
      console.error("Logout Failed", err);
    }
  };

  const handlePasswordChange = () => {
    if (!currentPassword || !newPassword) {
      setModalPasswordMessage("Please enter both current and new password");
      setShowPasswordModal(true);
      return;
    }
    // Make a passowrd change route for user
    axios
      .post(
        "/user/updatePassword",
        { current: currentPassword, newPass: newPassword },
        { withCredentials: true }
      )
      .then(() => {
        setModalPasswordMessage("Password updated successfully!");
        setShowPasswordModal(true);
        setCurrentPassword("");
        setNewPassword("");
        setTimeout(() => setShowPasswordModal(false), 3000);
      })
      .catch(() => {
        setModalPasswordMessage("Incorrect current password");
        setShowPasswordModal(true);
        setTimeout(() => setShowPasswordModal(false), 3000);
      });
  };

  if (!user) {
    return (
      <>
        <Navbar />
        <div className="flex flex-col bg-white min-h-screen">
          <div className="flex justify-center items-center flex-1">
            <p className="text-gray-700 text-xl">Loading profile...</p>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="flex flex-col bg-white min-h-screen">
        <div className="container mx-auto px-4 py-6">
          <div className="max-w-4xl mx-auto">
            <button
              onClick={() => navigate("/user")}
              className="flex items-center text-blue-600 hover:text-blue-800 mb-6 transition-colors"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 mr-2"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z"
                  clipRule="evenodd"
                />
              </svg>
              Back to Dashboard
            </button>
          </div>
        </div>
        <div className="flex flex-col items-center py-10 px-4">
          <div className="w-full max-w-5xl bg-gray-100 rounded-lg shadow-lg p-8">
            <h1 className="text-3xl font-bold text-blue-600 mb-8 text-center">
              User Profile
            </h1>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
              {/* Profile Picture → First on mobile, right side on desktop */}
              <div className="order-1 md:order-2 flex flex-col items-center justify-center bg-white rounded-lg shadow-sm p-6">
                <img
                  src="https://via.placeholder.com/150"
                  alt="Profile"
                  className="w-32 h-32 rounded-full border-4 border-blue-500 object-cover"
                />
                <p className="mt-3 text-gray-600 text-sm">Profile Picture</p>
                <button className="px-6 py-2 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-lg shadow-md transition duration-200">
                  Change Photo
                </button>
              </div>

              {/* User Info → Below picture on mobile, left side on desktop */}
              <div className="order-2 md:order-1 md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white p-4 rounded-lg shadow-sm">
                  <p className="text-gray-500 text-sm">Name</p>
                  <p className="text-lg font-semibold text-black">{user.name}</p>
                </div>

                <div className="bg-white p-4 rounded-lg shadow-sm">
                  <p className="text-gray-500 text-sm">Email</p>
                  <p className="text-lg font-semibold text-black">{user.email}</p>
                </div>

                <div className="bg-white p-4 rounded-lg shadow-sm">
                  <p className="text-gray-500 text-sm">Phone</p>
                  <p className="text-lg font-semibold text-black">
                    {user.phone || "Not Provided"}
                  </p>
                </div>

                <div className="bg-white p-4 rounded-lg shadow-sm">
                  <p className="text-gray-500 text-sm">Aadhaar</p>
                  <p className="text-lg font-semibold text-black">{user.aadhaar}</p>
                </div>

                <div className="bg-white p-4 rounded-lg shadow-sm">
                  <p className="text-gray-500 text-sm">Role</p>
                  <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
                    {user.role}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex gap-4 mt-4">
              <button
                className="px-6 py-2 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-lg shadow-md transition duration-200"
                onClick={handleLogout}
              >
                Logout
              </button>
            </div>
            <div className="flex gap-2 mt-4 items-center flex-wrap">
              {/* Change Password Button */}
              <button
                className="px-6 py-2 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-lg shadow-md transition duration-200"
                onClick={() => setShowPasswordInput((prev) => !prev)}
              >
                Change Password
              </button>

              {/* Current + New Password Inputs & Save Button */}
              {showPasswordInput && (
                <>
                  <input
                    type="password"
                    placeholder="Current password"
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                  />
                  <input
                    type="password"
                    placeholder="New password"
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-black"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                  />
                  <button
                    className="px-6 py-2 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-lg shadow-md transition duration-200"
                    onClick={handlePasswordChange}
                  >
                    Save
                  </button>
                </>
              )}
            </div>
            {passwordUpdated && (
              <p className="text-green-600 font-medium mt-2">
                Password updated successfully!
              </p>
            )}
            {showPasswordModal && (
              <div className="fixed inset-0 flex items-center justify-center  z-50">
                <div className="bg-white rounded-lg p-6 shadow-lg max-w-sm w-full text-center">
                  <p className="text-gray-800 font-medium">
                    {modalPasswordMessage}
                  </p>
                  <button
                    className="mt-4 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg"
                    onClick={() => setShowPasswordModal(false)}
                  >
                    Close
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
