import React from "react";
import { useState } from "react";
import{useNavigate} from 'react-router-dom'
import axios from "axios";


const ProfilePage = ({ adminData }) => {
  const navigate = useNavigate();
  const parsedData = JSON.parse(adminData);
  const [pass, setPass] = useState({
    current: "",
    new: "",
  });

  const handlePassChange = (e) => {
    const { name, value } = e.target;
    setPass((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  const handleUpdatePassword = async () => {
    // alert(`Password changed to: ${pass.new}`)
    try {
      const response = await axios.post(
        "http://localhost/dept/updatePassword",
        { email: parsedData.email, current: pass.current, newPass: pass.new },
        { withCredentials: true }
      );
      const data = response.data;
      console.log(data);
      if (data.message) {
        alert("Password Updated Successfully");
      } else {
        alert("Couldnt update password");
      }
    } catch (err) {
      alert("Couldnt update password");
    }
  };
  const handleLogout = async() => {
    await axios.post("http://localhost/admin/logout", {}, { withCredentials: true });
    localStorage.removeItem("userDetail");
    // window.location.reload();
    navigate('/');
  }
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold text-gray-800 mb-6">
        Admin Profile
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Name
          </label>
          <input
            type="text"
            // defaultValue="Admin User"
            value={parsedData.name}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-black"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2 ">
            Email
          </label>
          <input
            type="email"
            // defaultValue="admin@civicseva.gov"
            value={parsedData.email}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-black disabled"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Role
          </label>
          <input
            type="text"
            // defaultValue="System Administrator"
            value={parsedData.role}
            disabled
            className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-100 text-gray-600"
          />
        </div>
        {/* <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Department</label>
        <input
          type="text"
          defaultValue="IT Administration"
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
        />
      </div> */}
      </div>
      <div className="mt-6 pt-6 border-t border-gray-200">
        <h3 className="text-lg font-medium text-gray-800 mb-4">
          Change Password
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Current Password
            </label>
            <input
              type="password"
              name="current"
              value={pass.current}
              onChange={handlePassChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-black"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              New Password
            </label>
            <input
              type="password"
              name="new"
              value={pass.new}
              onChange={handlePassChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-black"
            />
          </div>
        </div>
      </div>
      <div className="mt-6 flex justify-end gap-3">
        <button className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50">
          Cancel
        </button>
        <button
          onClick={handleUpdatePassword}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Update Password
        </button>
        <button
          className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
          onClick={handleLogout}
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default ProfilePage;
