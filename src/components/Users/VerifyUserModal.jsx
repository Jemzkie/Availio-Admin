import React, { useState, useEffect } from "react";
import { collection, getDocs, query, where, doc, getDoc } from "firebase/firestore";
import { db } from "../../config/firebaseConfig";
import { FaStar } from "react-icons/fa";
import BanModal from "./BanModal";

const VerifyUserModal = ({
  isOpen,
  closeModal,
  selectedUser,
  handleVerification,
  userType,
}) => {
  const [ratings, setRatings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isBanModalOpen, setIsBanModalOpen] = useState(false);

  useEffect(() => {
    const fetchRatings = async () => {
      if (!selectedUser) return;
      
      try {
        if (userType === "owners") {
          // Fetch supplier ratings for owners
          const ratingsRef = collection(db, `users/${selectedUser.id}/supplierRatings`);
          const ratingsSnapshot = await getDocs(ratingsRef);

          // Fetch user details for each rating
          const ratingsWithDetails = await Promise.all(
            ratingsSnapshot.docs.map(async (ratingDoc) => {
              const rating = ratingDoc.data();
              const userDoc = await getDoc(doc(db, "users", rating.userId));
              const user = userDoc.exists() ? userDoc.data() : null;
              
              return {
                id: ratingDoc.id,
                rating: rating.rating,
                comment: rating.comment || "",
                userName: user?.username || "Unknown",
                userEmail: user?.email || "No email",
                date: rating.createdAt,
              };
            })
          );

          setRatings(ratingsWithDetails);
        } else {
          // For renters, fetch their ratings from bookings
          const bookingsRef = collection(db, "bookings");
          const bookingsQuery = query(
            bookingsRef,
            where("renterId", "==", selectedUser.id),
            where("bookingStatus", "==", "Complete"),
            where("rated", "==", true)
          );
          const bookingsSnapshot = await getDocs(bookingsQuery);

          // Fetch vehicle and owner details for each booking
          const ratingsWithDetails = await Promise.all(
            bookingsSnapshot.docs.map(async (bookingDoc) => {
              const booking = bookingDoc.data();
              
              // Get vehicle details to find the owner
              const vehicleDoc = await getDoc(doc(db, "vehicles", booking.vehicleId));
              const vehicle = vehicleDoc.exists() ? vehicleDoc.data() : null;
              
              // Get owner details
              const ownerDoc = vehicle ? await getDoc(doc(db, "users", vehicle.ownerId)) : null;
              const owner = ownerDoc?.exists() ? ownerDoc.data() : null;
              
              return {
                id: bookingDoc.id,
                rating: booking.renterRating,
                comment: booking.details || "",
                userName: owner?.businessName || "Unknown",
                userEmail: owner?.businessEmail || "No email",
                date: booking.completedAt,
              };
            })
          );

          setRatings(ratingsWithDetails);
        }
      } catch (error) {
        console.error("Error fetching ratings:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (isOpen && selectedUser) {
      fetchRatings();
    }
  }, [isOpen, selectedUser, userType]);

  const handleBanComplete = () => {
    closeModal();
  };

  if (!isOpen || !selectedUser) return null;

  const averageRating = ratings.length > 0
    ? (ratings.reduce((sum, r) => sum + r.rating, 0) / ratings.length).toFixed(1)
    : "No ratings";

  return (
    <>
      <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/50">
        <div className="bg-white p-8 rounded-lg w-[90%] max-w-7xl h-[80vh] relative shadow-xl flex gap-8">
          <button
            className="absolute top-4 right-4 text-gray-500 hover:text-[#ed1c24] transition-colors duration-300"
            onClick={closeModal}
          >
            ✕
          </button>

          {/* Left Side - User Info */}
          <div className="w-1/2 flex flex-col">
            <div className="flex-1">
              <h2 className="text-2xl font-bold mb-2 text-black">
                {userType === "owners" 
                  ? selectedUser.businessName || selectedUser.displayName
                  : `${selectedUser.firstName} ${selectedUser.lastName}`
                }
              </h2>
              <p className="text-sm text-gray-600 mb-6">{selectedUser.email}</p>
              
              {userType === "owners" ? (
                // Owner Information
                <>
                  {/* Business Details */}
                  <div className="space-y-4 mb-8">
                    <div className="bg-gray-50 p-6 rounded-lg">
                      <h3 className="font-semibold text-lg mb-4 text-black">Business Information</h3>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-3">
                          <div>
                            <p className="text-sm text-gray-500 mb-1">Wallet Balance</p>
                            <p className="font-medium text-lg">₱{selectedUser.walletBalance?.toFixed(2) || "0.00"}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500 mb-1">Phone Number</p>
                            <p className="font-medium">{selectedUser.phoneNum || "Not provided"}</p>
                          </div>
                        </div>
                        <div className="space-y-3">
                          <div>
                            <p className="text-sm text-gray-500 mb-1">Business Address</p>
                            <p className="font-medium">{selectedUser.businessAddress || "Not provided"}</p>
                          </div>
                          {selectedUser.businessCoordinates && (
                            <div>
                              <p className="text-sm text-gray-500 mb-1">Coordinates</p>
                              <p className="font-medium">
                                {selectedUser.businessCoordinates.latitude.toFixed(6)}, {selectedUser.businessCoordinates.longitude.toFixed(6)}
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Verification Documents */}
                  <div className="space-y-4">
                    <h3 className="font-semibold">Verification Documents</h3>
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
                  </div>
                </>
              ) : (
                // Renter Information
                <div className="space-y-4 mb-8">
                  <div className="bg-gray-50 p-6 rounded-lg">
                    <h3 className="font-semibold text-lg mb-4 text-black">Personal Information</h3>
                    <div className="space-y-4">
                      <div>
                        <p className="text-sm text-gray-500 mb-1">First Name</p>
                        <p className="font-medium">{selectedUser.firstName || "Not provided"}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500 mb-1">Last Name</p>
                        <p className="font-medium">{selectedUser.lastName || "Not provided"}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500 mb-1">Phone Number</p>
                        <p className="font-medium">{selectedUser.phoneNum || "Not provided"}</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4 mt-6">
              {userType === "owners" && (
                <button 
                  onClick={handleVerification}
                  className="flex-1 py-3 px-4 bg-[#ed1c24] hover:bg-[#ed1c24]/90 text-white font-semibold rounded-md transition-colors duration-300"
                >
                  Verify User
                </button>
              )}
              <button 
                onClick={() => setIsBanModalOpen(true)}
                className={`py-3 px-4 border border-[#ed1c24] text-[#ed1c24] hover:bg-[#ed1c24] hover:text-white font-semibold rounded-md transition-colors duration-300 ${
                  userType === "owners" ? "flex-1" : "w-full"
                }`}
              >
                Ban Account
              </button>
            </div>
          </div>

          {/* Right Side - Ratings */}
          <div className="w-1/2 border-l pl-8">
            <div className="mb-6">
              <h3 className="text-xl font-semibold mb-2">
                {userType === "owners" ? "Owner Ratings" : "Renter Ratings"}
              </h3>
              <div className="flex items-center gap-2">
                <div className="flex items-center">
                  <FaStar className="text-yellow-400 w-5 h-5" />
                  <span className="ml-1 font-semibold">{averageRating}</span>
                </div>
                <span className="text-gray-500">({ratings.length} ratings)</span>
              </div>
            </div>

            <div className="space-y-4 max-h-[calc(80vh-200px)] overflow-y-auto pr-4">
              {isLoading ? (
                <p>Loading ratings...</p>
              ) : ratings.length > 0 ? (
                ratings.map((rating) => (
                  <div key={rating.id} className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <p className="font-medium">{rating.userName}</p>
                        <p className="text-sm text-gray-500">{rating.userEmail}</p>
                      </div>
                      <div className="flex items-center">
                        <FaStar className="text-yellow-400 w-4 h-4" />
                        <span className="ml-1 font-medium">{rating.rating}</span>
                      </div>
                    </div>
                    {rating.comment && (
                      <p className="text-gray-600 text-sm mt-2">{rating.comment}</p>
                    )}
                    <p className="text-xs text-gray-400 mt-2">
                      {rating.date?.toDate().toLocaleString()}
                    </p>
                  </div>
                ))
              ) : (
                <p className="text-gray-500">No ratings yet</p>
              )}
            </div>
          </div>
        </div>
      </div>

      <BanModal
        isOpen={isBanModalOpen}
        closeModal={() => setIsBanModalOpen(false)}
        selectedUser={selectedUser}
        onBanComplete={handleBanComplete}
      />
    </>
  );
};

export default VerifyUserModal;
