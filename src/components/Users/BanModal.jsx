import React, { useState } from "react";
import { collection, addDoc, deleteDoc, query, where, getDocs } from "firebase/firestore";
import { db } from "../../config/firebaseConfig";

const BanModal = ({ isOpen, closeModal, selectedUser, onBanComplete }) => {
  const [banReason, setBanReason] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleBan = async () => {
    if (!banReason.trim()) {
      setError("Please provide a reason for the ban");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      // Add ban record to bans collection
      const banData = {
        userId: selectedUser.id,
        userEmail: selectedUser.email || selectedUser.businessEmail,
        userName: selectedUser.businessName || selectedUser.displayName,
        reason: banReason,
        bannedAt: new Date(),
        status: "banned"
      };

      await addDoc(collection(db, "bans"), banData);

      // Get all vehicles owned by the banned user
      const vehiclesRef = collection(db, "vehicles");
      const vehiclesQuery = query(vehiclesRef, where("ownerId", "==", selectedUser.id));
      const vehiclesSnapshot = await getDocs(vehiclesQuery);

      // Delete all vehicles owned by the banned user
      const deletePromises = vehiclesSnapshot.docs.map(doc => deleteDoc(doc.ref));
      await Promise.all(deletePromises);

      onBanComplete();
      closeModal();
    } catch (error) {
      console.error("Error banning user:", error);
      setError("Failed to ban user. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/50 backdrop-blur-sm">
      <div className="bg-white p-8 rounded-lg w-full max-w-md relative shadow-xl">
        <button
          className="absolute top-4 right-4 text-gray-500 hover:text-[#ed1c24] transition-colors duration-300"
          onClick={closeModal}
        >
          ✕
        </button>

        <h2 className="text-2xl font-bold mb-4 text-black">Ban User</h2>
        <p className="text-gray-600 mb-6">
          Are you sure you want to ban {selectedUser.businessName || selectedUser.displayName}? 
          This action will delete all their vehicles and cannot be undone.
        </p>

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Reason for Ban
          </label>
          <textarea
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#ed1c24] focus:border-transparent"
            rows="4"
            value={banReason}
            onChange={(e) => setBanReason(e.target.value)}
            placeholder="Enter the reason for banning this user..."
          />
          {error && <p className="text-[#ed1c24] text-sm mt-2">{error}</p>}
        </div>

        <div className="flex gap-4">
          <button
            onClick={closeModal}
            className="flex-1 py-3 px-4 border border-gray-300 text-gray-700 font-semibold rounded-md hover:bg-gray-50 transition-colors duration-300"
            disabled={isLoading}
          >
            Cancel
          </button>
          <button
            onClick={handleBan}
            className="flex-1 py-3 px-4 bg-[#ed1c24] hover:bg-[#ed1c24]/90 text-white font-semibold rounded-md transition-colors duration-300 disabled:opacity-50"
            disabled={isLoading}
          >
            {isLoading ? "Banning..." : "Confirm Ban"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default BanModal; 