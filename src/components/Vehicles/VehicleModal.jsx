import React from "react";
import { IoClose } from "react-icons/io5";
import { FaStar } from "react-icons/fa";

const VehicleModal = ({ isOpen, closeModal, selectedVehicle }) => {
  if (!isOpen || !selectedVehicle) return null;

  const calculateAverageRating = (ratings) => {
    if (!ratings || Object.keys(ratings).length === 0) return 0;
    const sum = Object.values(ratings).reduce((acc, curr) => acc + curr.rating, 0);
    return (sum / Object.keys(ratings).length).toFixed(1);
  };

  const formatDate = (timestamp) => {
    if (!timestamp) return '';
    const date = timestamp.toDate();
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-[1000px] max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-2xl font-semibold text-black">
            Vehicle Details
          </h2>
          <button
            onClick={closeModal}
            className="text-gray-500 hover:text-gray-700"
          >
            <IoClose size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="grid grid-cols-3 gap-6">
            {/* Left Column - Vehicle Details */}
            <div className="col-span-2">
              {/* Image Section */}
              <div className="w-full h-64 bg-black/5 rounded-lg overflow-hidden mb-6">
                <img
                  src={selectedVehicle.defaultImg || selectedVehicle.images?.[0]}
                  alt={selectedVehicle.name}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Details Section */}
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <h3 className="text-xl font-semibold text-black mb-4">
                    {selectedVehicle.brand} {selectedVehicle.model}
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm text-gray-500">Name</label>
                      <p className="text-black font-medium">{selectedVehicle.name}</p>
                    </div>
                    <div>
                      <label className="text-sm text-gray-500">CCHP</label>
                      <p className="text-black font-medium">{selectedVehicle.cchp}</p>
                    </div>
                    <div>
                      <label className="text-sm text-gray-500">Type</label>
                      <p className="text-black font-medium">{selectedVehicle.vehicleType}</p>
                    </div>
                    <div>
                      <label className="text-sm text-gray-500">Daily Rate</label>
                      <p className="text-black font-medium">₱{selectedVehicle.pricePerDay}</p>
                    </div>
                  </div>
                </div>

                <div>
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm text-gray-500">Location</label>
                      <p className="text-black font-medium">{selectedVehicle.location}</p>
                    </div>
                    <div>
                      <label className="text-sm text-gray-500">Fuel Type</label>
                      <p className="text-black font-medium">{selectedVehicle.fuelType}</p>
                    </div>
                    <div>
                      <label className="text-sm text-gray-500">Transmission</label>
                      <p className="text-black font-medium">{selectedVehicle.transmissionType}</p>
                    </div>
                    <div>
                      <label className="text-sm text-gray-500">Created At</label>
                      <p className="text-black font-medium">{formatDate(selectedVehicle.createdAt)}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Additional Images */}
              {selectedVehicle.images && selectedVehicle.images.length > 1 && (
                <div className="mt-6 pt-6 border-t">
                  <h3 className="text-lg font-semibold text-black mb-4">Additional Images</h3>
                  <div className="grid grid-cols-4 gap-4">
                    {selectedVehicle.images.slice(1).map((image, index) => (
                      <div key={index} className="h-24 bg-black/5 rounded-lg overflow-hidden">
                        <img
                          src={image}
                          alt={`${selectedVehicle.name} - Image ${index + 2}`}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Right Column - Ratings and Reviews */}
            <div className="col-span-1 border-l pl-6">
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-black mb-2">Ratings & Reviews</h3>
                <div className="flex items-center gap-2 mb-4">
                  <FaStar className="text-yellow-400 text-2xl" />
                  <span className="text-2xl font-semibold">
                    {calculateAverageRating(selectedVehicle.ratings)}
                  </span>
                  <span className="text-gray-500">
                    ({Object.keys(selectedVehicle.ratings || {}).length} reviews)
                  </span>
                </div>
              </div>

              <div className="space-y-4 max-h-[500px] overflow-y-auto">
                {selectedVehicle.ratings && Object.entries(selectedVehicle.ratings).map(([id, review]) => (
                  <div key={id} className="border-b pb-4">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <FaStar
                            key={i}
                            className={`${
                              i < review.rating ? 'text-yellow-400' : 'text-gray-300'
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-sm text-gray-500">
                        {formatDate(review.createdAt)}
                      </span>
                    </div>
                    <div className="mb-2">
                      <p className="font-medium text-black">{review.userName}</p>
                      <p className="text-sm text-gray-500">{review.userEmail}</p>
                    </div>
                    <p className="text-black">{review.comment}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VehicleModal; 