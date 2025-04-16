import React from "react";
import Menu from "./Menu";

const Loader = ({ ViewData }) => {
  return (
    <div className="w-full flex flex-col min-h-screen h-auto">
      <div className="flex flex-row">
        <Menu ViewData={ViewData} />
        <div className="flex flex-col gap-2 px-5 py-10">
          <div className="w-32 h-4 bg-gray-400 rounded-full animate-pulse"></div>
          <div className="w-20 h-4 bg-gray-400 rounded-full animate-pulse"></div>
        </div>
      </div>
    </div>
  );
};

export default Loader;
