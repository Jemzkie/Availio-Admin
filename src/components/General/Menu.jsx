import React, { useState } from "react";
import logo from "../../assets/images/AvailioL.png";
import { RxDashboard } from "react-icons/rx";
import { GiScooter } from "react-icons/gi";
import { VscAccount } from "react-icons/vsc";
import { LuBookCheck } from "react-icons/lu";
import { AiOutlineTransaction } from "react-icons/ai";
import { MdLogout } from "react-icons/md";
import { Link } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth } from "../../config/firebaseConfig";
import { useNavigate } from "react-router-dom";
import { LuMessageCircleMore } from "react-icons/lu";
import { MoonLoader } from "react-spinners";

const Menu = ({ ViewData }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const logout = async () => {
    try {
      setLoading(true);
      await signOut(auth);
      setLoading(false);
      navigate("/");
    } catch (error) {
      console.error("Error signing out: ", error);
    }
  };

  return (
    <div className="flex flex-col w-[275px] bg-[#1A1919] min-h-screen px-4">
      <Link to="/" className="w-[250px] mt-5">
        <div className="w-full h-24 rounded-lg flex items-center justify-center">
          <img src={logo} alt="Logo" className="max-h-full max-w-full object-contain" />
        </div>
      </Link>
      <div className="w-full h-auto flex flex-col gap-1 px-6">
        <Link
          to="/dashboard"
          className={`flex gap-2 items-center py-3 mt-5 rounded-md duration-300 ${
            ViewData === "Dashboard" ? "bg-[#E60000]" : "hover:bg-white/10"
          }`}
        >
          {ViewData === "Dashboard" ? (
            <div className="bg-white h-8 w-1 rounded-md"></div>
          ) : null}
          <RxDashboard className="text-white w-6 h-6" />
          <label className="text-white text-lg cursor-pointer">Dashboard</label>
        </Link>

        <Link
          to="/users"
          className={`flex gap-2 items-center py-3 rounded-md duration-300 ${
            ViewData === "Users" ? "bg-[#E60000]" : "hover:bg-white/10"
          }`}
        >
          {ViewData === "Users" ? (
            <div className="bg-white h-8 w-1 rounded-md"></div>
          ) : null}
          <LuBookCheck className="text-white w-6 h-6" />
          <label className="text-white text-lg cursor-pointer">Users</label>
        </Link>

        <Link
          to="/vehicles"
          className={`flex gap-2 items-center py-3 rounded-md duration-300 ${
            ViewData === "Vehicles" ? "bg-[#E60000]" : "hover:bg-white/10"
          }`}
        >
          {ViewData === "Vehicles" ? (
            <div className="bg-white h-8 w-1 rounded-md"></div>
          ) : null}
          <GiScooter className="text-white w-6 h-6" />
          <label className="text-white text-lg cursor-pointer">Vehicles</label>
        </Link>

        <button 
          onClick={logout}
          className="flex h-12 justify-center gap-2 items-center w-full py-5 mt-20 bg-[#E60000] hover:bg-[#E60000]/80 rounded-md cursor-pointer transition-colors duration-300"
        >
          {loading ? (
            <div className="w-full h-auto mt-10 duration-300 rounded-lg flex items-center justify-center">
              <MoonLoader color="#ffffff" size={24} />
            </div>
          ) : (
            <>
              <MdLogout className="text-white w-6 h-6" />
              <label className="text-white text-lg cursor-pointer">
                Logout
              </label>
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default Menu;
