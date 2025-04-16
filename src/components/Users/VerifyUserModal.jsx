import React from "react";

const VerifyUserModal = ({
  isOpen,
  closeModal,
  selectedUser,
  handleVerification,
}) => {
  if (!isOpen || !selectedUser) return null;

  return (
    <div className={`fixed inset-0 flex items-center justify-center z-50`}>
      <div className="bg-white p-6 rounded-lg w-full max-w-md relative shadow-xl">
        <button
          className="absolute top-2 right-2 text-gray-500 hover:text-red-500"
          onClick={closeModal}
        >
          ✕
        </button>
        <h2 className="text-xl font-bold mb-2">{selectedUser.displayName}</h2>
        <p className="text-sm text-gray-600 mb-4">{selectedUser.email}</p>
        <div className="space-y-2">
          {Object.entries(selectedUser.verificationDocs || {}).map(
            ([docName, docUrl]) => (
              <div key={docName} className="flex justify-between items-center">
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
  );
};

export default VerifyUserModal;
