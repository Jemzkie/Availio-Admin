import React from "react";

const Verify = ({ openModal, allUsers }) => {
  return (
    <div className="flex flex-col flex-1 font-inter p-10">
      <div className="flex flex-col mb-5">
        <h2 className="text-xl font-semibold">Users</h2>
        <label className="text-gray-600">All Users Displayed Here</label>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {allUsers.map((user) => (
          <div
            key={user.id}
            className="shadow-xy rounded-md flex flex-col relative shadow cursor-pointer hover:bg-gray-100"
            onClick={() => openModal(user)}
          >
            <img
              className="w-[100%] h-48 object-cover rounded-t-md"
              src={user.businessProfile}
            />
            <img
              className="absolute w-20 h-20 rounded-full border bottom-24 left-2 border-gray-400 object-cover"
              src={user.personalProfile || user.photoURL}
            />
            <div className="p-4 flex mt-5 flex-col">
              <h3 className="text-lg font-semibold">
                {user.businessName || "No Business Name"}
              </h3>
              <label className="text-sm text-gray-400 font-semibold">
                @
                {user.firstName + " " + user.lastName ||
                  user.userName ||
                  user.displayName}
              </label>
              <label className="text-sm text-gray-400">
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
