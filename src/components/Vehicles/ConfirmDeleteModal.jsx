import React from "react";

const ConfirmDeleteModal = ({ isOpen, onCancel, onConfirm, vehicleName }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/50">
      <div className="bg-white p-8 rounded-lg w-full max-w-md relative shadow-xl">
        <h2 className="text-2xl font-bold mb-4 text-black">Confirm Delete</h2>
        <p className="text-gray-600 mb-6">
          Are you sure you want to delete {vehicleName}? This action cannot be undone.
        </p>
        <div className="flex justify-end gap-4">
          <button
            onClick={onCancel}
            className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors duration-300"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors duration-300"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDeleteModal; 