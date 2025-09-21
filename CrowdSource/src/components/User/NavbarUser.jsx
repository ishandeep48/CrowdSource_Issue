import React from "react";
import { useNavigate } from "react-router-dom";
import { User, Menu, X } from "lucide-react";
import { useState } from "react";


export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();


  const menuItems = [
    { label: "Report an issue", path: "/report-issue" },
    { label: "Reported issues", path: "/reported-issues" },
    { label: "Issues in Your Area", path: "/area-issues" },
  ];

  return (
      <header className="w-full bg-white shadow">
      <div className="max-w-7xl mx-auto flex items-center justify-between py-3 px-4 lg:px-8">
        {/* Logo */}
        <div className="text-2xl lg:text-3xl font-bold text-black">
          <span className="text-black">Civic</span>
          <span className="text-[#1E5EFF]">Sewa</span>
        </div>

        {/* Desktop menu */}
        <div className="hidden md:flex items-center gap-3 lg:gap-5">
          {menuItems.map((item) => (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={`${
                item.path === "/report-issue" || item.path === "/area-issues"
                  ? "bg-[#1E5EFF] text-white hover:bg-[#164bcc]"
                  : "border-2 border-[#1E5EFF] text-[#1E5EFF] hover:bg-[#f0f4ff]"
              } text-sm lg:text-lg font-semibold py-2 px-3 lg:px-4 rounded-lg transition-colors duration-200`}
            >
              {item.label}
            </button>
          ))}
          <button
            onClick={() => navigate("/profile")}
            className="p-2 rounded-full hover:bg-gray-100 transition-colors duration-200"
          >
            <User className="w-6 h-6 lg:w-7 lg:h-7 text-gray-700" />
          </button>
        </div>

        {/* Mobile hamburger */}
        <div className="md:hidden flex items-center">
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="p-2 rounded-md hover:bg-gray-100"
          >
            {menuOpen ? <X className="w-6 h-6 text-gray-800" /> : <Menu className="w-6 h-6 text-gray-800" />}
          </button>
        </div>
      </div>

    {/* Mobile dropdown */}
  {menuOpen && (
    <div className="md:hidden bg-white border-t border-gray-200 shadow-inner">
      <div className="flex flex-col items-center px-4 py-3 space-y-3">
        {menuItems.map((item) => (
          <button
            key={item.path}
            onClick={() => {
              navigate(item.path);
              setMenuOpen(false);
            }}
            className={`${
              item.path === "/report-issue" || item.path === "/area-issues"
                ? "bg-[#1E5EFF] text-white hover:bg-[#164bcc]"
                : "border border-[#1E5EFF] text-[#1E5EFF] hover:bg-[#f0f4ff]"
            } font-semibold py-2 px-4 rounded-lg transition-colors duration-200 w-3/4 max-w-xs`}
          >
            {item.label}
          </button>
        ))}
        <button
          onClick={() => {
            navigate("/profile");
            setMenuOpen(false);
          }}
          className="flex items-center gap-2 py-2 px-4 rounded-lg hover:bg-gray-100 w-3/4 max-w-xs"
        >
          <User className="w-5 h-5 text-gray-700" />
          <span className="font-semibold">Profile</span>
        </button>
      </div>
    </div>

      )}
    </header>

  );
}