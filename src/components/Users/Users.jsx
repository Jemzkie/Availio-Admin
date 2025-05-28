import React from "react";
import UserImg from "../../assets/images/User.jpg";
const Verify = ({ openModal, allUsers }) => {
  // Filter out admin users
  const filteredUsers = allUsers.filter((user) => user.role !== "admin");

  return (
    <div className="flex flex-col flex-1 font-inter p-10 bg-white">
      <div className="flex flex-col mb-8">
        <h2 className="text-2xl font-semibold text-black">Users</h2>
        <label className="text-gray-600">All Users Displayed Here</label>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {filteredUsers.map((user) => (
          <div
            key={user.id}
            className="bg-white shadow-lg rounded-lg flex flex-col relative cursor-pointer hover:shadow-xl transition-shadow duration-300"
            onClick={() => openModal(user)}
          >
            <div className="w-full h-48 bg-black/5 rounded-t-lg flex items-center justify-center">
              {user.businessProfile ? (
                <img
                  className="w-full h-full object-cover rounded-t-lg"
                  src={user.businessProfile}
                  alt="Business Profile"
                />
              ) : (
                <div className="w-full h-full object-cover rounded-t-lg bg-gray-100"></div>
              )}
            </div>

            <div className="absolute w-20 h-20 rounded-full border-4 border-white bottom-24 left-4 bg-black/5 flex items-center justify-center overflow-hidden">
              {user?.personalProfile || user?.photoURL ? (
                <img
                  className="w-full h-full object-cover"
                  src={user.personalProfile || user.photoURL}
                  alt="User Profile"
                />
              ) : (
                <img src={UserImg} className="w-full h-full object-cover" />
              )}
            </div>

            <div className="p-6 flex mt-5 flex-col">
              <h3 className="text-xl font-semibold text-black">
                {user.businessName || user.username || "No Name"}
              </h3>
              <label className="text-sm text-gray-500 font-medium mt-1">
                @
                {user?.firstName + " " + user?.lastName ||
                  user.userName ||
                  user.displayName ||
                  "No Name"}
              </label>
              <label className="text-sm text-gray-500 mt-1">
                {user.email || user.businessEmail}
              </label>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Verify;
