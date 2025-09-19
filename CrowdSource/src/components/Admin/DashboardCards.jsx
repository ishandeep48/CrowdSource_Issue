import React from "react";

const DashboardCards = ({ summaryData }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {summaryData.map((item, index) => (
        <div
          key={index}
          className="bg-white rounded-lg shadow-md p-6 flex items-center justify-between"
        >
          <div>
            <h3 className="text-sm font-medium text-gray-600 mb-1">{item.title}</h3>
            <p className="text-2xl font-bold text-gray-800">{item.count}</p>
          </div>
          <div className={`${item.color} text-white p-3 rounded-full text-2xl`}>
            {item.icon}
          </div>
        </div>
      ))}
    </div>
  );
};

export default DashboardCards;
