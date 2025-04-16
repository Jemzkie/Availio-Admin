import React from "react";
import Menu from "../components/General/Menu";

const DashboardScreen = () => {
  const ViewData = "Dashboard";
  return (
    <div className="w-full flex flex-col min-h-screen h-auto">
      <div className="flex flex-row">
        <Menu ViewData={ViewData} />
      </div>
    </div>
  );
};

export default DashboardScreen;
