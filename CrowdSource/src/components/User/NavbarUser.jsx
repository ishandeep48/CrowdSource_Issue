import React from "react";
import { useNavigate } from "react-router-dom";
import { User } from "lucide-react";


export default function Navbar() {
  const navigate = useNavigate();
  return (
    <header className="w-full bg-white">
      <div className="max-w-7xl mx-auto flex items-center justify-between py-4 px-6 lg:px-8">
        
        <div className="text-2xl lg:text-3xl font-bold text-black">
          <span className="text-black">Civic</span><span className="text-[#1E5EFF]">Sewa</span>
        </div>

        <div className="flex items-center gap-3 lg:gap-5 pr-0">
          <button
            className="bg-[#1E5EFF] text-white text-sm lg:text-lg font-semibold py-2 px-3 lg:px-4 rounded-lg hover:bg-[#164bcc] transition-colors duration-200"
            onClick={() => navigate("/report-issue")}
          >
            Report an issue
          </button>
          <button
            className="bg-transparent border-2 border-[#1E5EFF] text-[#1E5EFF] text-sm lg:text-lg font-semibold py-2 px-2 lg:px-3 rounded-lg hover:bg-[#f0f4ff] transition-colors duration-200"
            onClick={() => navigate("/reported-issues")}
          >
            Reported issues
          </button>
          <button
  className="bg-[#1E5EFF] text-white text-sm lg:text-lg font-semibold py-2 px-3 lg:px-4 rounded-lg hover:bg-[#164bcc] transition-colors duration-200"
  onClick={() => navigate("/area-issues")}
>
  Issues in Your Area
</button>

          <button
            className="p-2 rounded-full hover:bg-gray-100 transition-colors duration-200"
            onClick={() => navigate("/profile")}
          >
            <User className="w-6 h-6 lg:w-7 lg:h-7 text-gray-700" />
          </button>
        </div>
      </div>
    </header>
  );
}