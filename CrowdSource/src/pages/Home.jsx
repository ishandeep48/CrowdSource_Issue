import React from "react";
import Navbar from "../components/Navbar";
import Illustrationsection from "../components/Illustrationsection";

export default function Home() {
  return (
    <div className="flex flex-col bg-white min-h-screen">
      <Navbar />
      
      <div className="flex-1 flex flex-col items-center justify-center px-4 sm:px-6 py-8 sm:py-12 lg:py-16">
        <div className="text-center max-w-5xl mx-auto w-full">
          <h1 className="font-bold text-black leading-tight px-2" style={{ 
            fontSize: 'clamp(1.5rem, 5vw, 3.75rem)',
            marginBottom: 'clamp(1rem, 3vw, 2rem)'
          }}>
            Report <span className="text-[#1E5EFF] italic">civic</span> issues instantly.<br className="hidden sm:block" />
            <span className="sm:hidden"> </span>Be heard by your local <span className="text-[#1E5EFF] italic">government</span>.
          </h1>
          
          <p className="text-gray-600 max-w-3xl mx-auto leading-relaxed px-4" style={{
            fontSize: 'clamp(0.875rem, 2.5vw, 1.25rem)',
            marginBottom: 'clamp(1.5rem, 4vw, 2.5rem)'
          }}>
            Spotted a pothole, broken streetlight, or overflowing trash bin? 
            Report it in seconds with a photo and location.
          </p>
          
          <button className="bg-[#1E5EFF] text-white font-bold rounded-lg hover:bg-[#164bcc] transition-colors duration-200 shadow-lg w-full sm:w-auto max-w-xs sm:max-w-none" style={{
            padding: 'clamp(0.75rem, 2vw, 1.25rem) clamp(1.5rem, 4vw, 2.5rem)',
            fontSize: 'clamp(1rem, 2.5vw, 1.25rem)'
          }}>
            Get Started
          </button>
        </div>
      </div>
      <Illustrationsection />
    </div>
  );
}
