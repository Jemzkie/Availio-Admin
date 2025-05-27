import React from "react";

const VerifyUserModal = ({
  isOpen,
  closeModal,
  selectedUser,
  handleVerification,
}) => {
  if (!isOpen || !selectedUser) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/50">
      <div className="bg-white p-8 rounded-lg w-full max-w-md relative shadow-xl">
        <button
          className="absolute top-4 right-4 text-gray-500 hover:text-[#ed1c24] transition-colors duration-300"
          onClick={closeModal}
        >
          ✕
        </button>
        <h2 className="text-2xl font-bold mb-2 text-black">{selectedUser.displayName}</h2>
        <p className="text-sm text-gray-600 mb-6">{selectedUser.email}</p>
        <div className="space-y-4">
          {Object.entries(selectedUser.verificationDocs || {}).map(
            ([docName, docUrl]) => (
              <div key={docName} className="flex justify-between items-center bg-gray-50 p-3 rounded-md">
                <span className="capitalize text-black font-medium">{docName}</span>
                <a
                  href={docUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#ed1c24] hover:text-[#ed1c24]/80 text-sm font-medium transition-colors duration-300"
                >
                  View
                </a>
              </div>
            )
          )}
          <button 
            onClick={handleVerification}
            className="w-full py-3 px-4 bg-[#ed1c24] hover:bg-[#ed1c24]/90 text-white font-semibold rounded-md transition-colors duration-300 mt-6"
          >
            Verify User
          </button>
        </div>
      </div>
    </div>
  );
};

export default VerifyUserModal;
