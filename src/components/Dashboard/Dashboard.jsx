import React from "react";

const Dashboard = () => {
  return (
    <div className="w-full h-auto flex flex-row mb-5 gap-6 p-6">
      <div className="w-1/3 h-36 p-6 rounded-lg bg-white shadow-lg hover:shadow-xl transition-shadow duration-300">
        <h3 className="text-xl font-semibold text-black mb-2">Renters</h3>
        <p className="text-gray-600">Total number of active renters</p>
      </div>
      <div className="w-1/3 h-36 p-6 rounded-lg bg-white shadow-lg hover:shadow-xl transition-shadow duration-300">
        <h3 className="text-xl font-semibold text-black mb-2">Suppliers</h3>
        <p className="text-gray-600">Total number of active suppliers</p>
      </div>
      <div className="w-1/3 h-36 p-6 rounded-lg bg-white shadow-lg hover:shadow-xl transition-shadow duration-300">
        <h3 className="text-xl font-semibold text-black mb-2">Vehicles</h3>
        <p className="text-gray-600">Total number of available vehicles</p>
      </div>
    </div>
  );
};

export default Dashboard;
