import React, { useState, useEffect } from "react";
import { fetchPendingVerification } from "../hooks/data/verifyUserData";
import { verifyUser } from "../hooks/service/userService";

const VerifyScreen = () => {
  const [pendingUserData, setPendingUserData] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const pendingUserDataRequest = await fetchPendingVerification();
        setPendingUserData(pendingUserDataRequest);
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, []);

  const openModal = (user) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedUser(null);
  };

  const handleVerification = async () => {
    console.log(selectedUser);
    try {
      const response = await verifyUser(selectedUser.uid);
      if (response.success) {
        alert(response.message);
      } else {
        alert(response.message);
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="p-6 font-jakarta">
      <h2 className="text-xl font-bold mb-4">Pending Verifications</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {pendingUserData.map((user) => (
          <div
            key={user.id}
            className="border p-4 rounded-lg shadow cursor-pointer hover:bg-gray-100"
            onClick={() => openModal(user)}
          >
            <h3 className="text-lg font-semibold">{user.displayName}</h3>
            <p className="text-gray-500">{user.email}</p>
          </div>
        ))}
      </div>

      {isModalOpen && selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-md relative shadow-xl">
            <button
              className="absolute top-2 right-2 text-gray-500 hover:text-red-500"
              onClick={closeModal}
            >
              ✕
            </button>
            <h2 className="text-xl font-bold mb-2">
              {selectedUser.displayName}
            </h2>
            <p className="text-sm text-gray-600 mb-4">{selectedUser.email}</p>
            <div className="space-y-2">
              {Object.entries(selectedUser.verificationDocs || {}).map(
                ([docName, docUrl]) => (
                  <div
                    key={docName}
                    className="flex justify-between items-center"
                  >
                    <span className="capitalize">{docName}</span>
                    <a
                      href={docUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 underline text-sm"
                    >
                      View
                    </a>
                  </div>
                )
              )}
              <button className="cursor-pointer" onClick={handleVerification}>
                Verify User
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VerifyScreen;
