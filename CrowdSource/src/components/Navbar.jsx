import React from "react";

export default function Navbar() {
  return (
    <header className="w-full bg-white">
      <div className="max-w-7xl mx-auto flex items-center justify-between py-4 px-6 lg:px-8">
        
        <div className="text-2xl lg:text-3xl font-bold text-black">
          <span className="text-black">Civic</span><span className="text-[#1E5EFF]">Sewa</span>
        </div>

        <div className="flex items-center gap-3 lg:gap-5">
          <button
            className="bg-[#1E5EFF] text-white text-sm lg:text-lg font-semibold py-2 px-4 lg:px-8 rounded-lg hover:bg-[#164bcc] transition-colors duration-200"
            onClick={() => alert("Sign in pressed!")}
          >
            Sign in
          </button>
          <button
            className="bg-transparent border-2 border-[#1E5EFF] text-black text-sm lg:text-lg font-semibold py-2 px-4 lg:px-8 rounded-lg hover:bg-[#f0f4ff] transition-colors duration-200"
            onClick={() => alert("Sign up pressed!")}
          >
            Sign up
          </button>
        </div>
      </div>
    </header>
  );
}
