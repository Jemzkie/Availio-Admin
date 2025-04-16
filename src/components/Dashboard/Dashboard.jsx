import React from "react";

const Dashboard = () => {
  return (
    <div className="w-full h-auto flex flex-row mb-5 gap-5">
      <div className="w-1/3 h-36 p-5 rounded-md shadow-xy">
        <label>Renters</label>
      </div>
      <div className="w-1/3 h-36 p-5 rounded-md shadow-xy">
        <label>Suppliers</label>
      </div>
      <div className="w-1/3 h-36 p-5 rounded-md shadow-xy">
        <label>Vehicles</label>
      </div>
    </div>
  );
};

export default Dashboard;
