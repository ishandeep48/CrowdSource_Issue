import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Navbar from "./NavbarUser";
import ReportedIssuesPanel from "./ReportedIssuesPanel";

export default function ProfilePage() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  useEffect(() => {
    const getUserData = async () => {
      const response = await axios.get("http://localhost/user/profile", {
        withCredentials: true,
      });
      const userData = response.data;
      // console.log(data);
      console.log(userData);
      setUser(userData);
    };
    getUserData();
  }, []);
  const handleLogout = () => {
    localStorage.removeItem("userDetail");
    navigate("/");
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
        <div className="flex flex-col items-center py-10 px-4">
          <div className="w-full max-w-5xl bg-gray-100 rounded-lg shadow-lg p-8">
            <h1 className="text-3xl font-bold text-blue-600 mb-8 text-center">
              User Profile
            </h1>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
              {/* Left & Middle: User Info */}
              <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white p-4 rounded-lg shadow-sm">
                  <p className="text-gray-500 text-sm">Name</p>
                  <p className="text-lg font-semibold text-black">
                    {user.name}
                  </p>
                </div>

                <div className="bg-white p-4 rounded-lg shadow-sm">
                  <p className="text-gray-500 text-sm">Email</p>
                  <p className="text-lg font-semibold text-black">
                    {user.email}
                  </p>
                </div>

                <div className="bg-white p-4 rounded-lg shadow-sm">
                  <p className="text-gray-500 text-sm ">Phone</p>
                  <p className="text-lg font-semibold text-black">
                    {user.phone || "Not Provided"}
                  </p>
                </div>

                <div className="bg-white p-4 rounded-lg shadow-sm">
                  <p className="text-gray-500 text-sm">Aadhaar</p>
                  <p className="text-lg font-semibold text-black">
                    {user.aadhaar}
                  </p>
                </div>

                <div className="bg-white p-4 rounded-lg shadow-sm">
                  <p className="text-gray-500 text-sm">Role</p>
                  <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
                    {user.role}
                  </span>
                </div>
              </div>

              {/* Right: Profile Picture */}
              <div className="flex flex-col items-center justify-center bg-white rounded-lg shadow-sm p-6">
                <img
                  src="https://static.vecteezy.com/system/resources/thumbnails/003/337/584/small_2x/default-avatar-photo-placeholder-profile-icon-vector.jpg"
                  alt="Profile"
                  className="w-32 h-32 rounded-full border-4 border-blue-500 object-cover"
                />
                <p className="mt-3 text-gray-600 text-sm">Profile Picture</p>
                <button className="mt-4 px-4 py-2 bg-blue-500 text-white text-sm rounded-lg hover:bg-blue-600">
                  Change Photo
                </button>
              </div>
            </div>
            <button
              className="mt-4 px-4 py-2 bg-red-500 text-white text-sm rounded-sm hover:bg-red-600"
              onClick={handleLogout}
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
