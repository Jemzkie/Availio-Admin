import React, { useState, useMemo } from "react";
import { MdDeleteOutline } from "react-icons/md";
import { FaStar } from "react-icons/fa";
import { toast } from "react-toastify";
import ConfirmDeleteModal from "./ConfirmDeleteModal";
import { IoClose } from "react-icons/io5";
import { FaTrash } from "react-icons/fa";

const Vehicles = ({ openModal, allVehicles, setAllVehicles, onDelete }) => {
  const [selectedBrand, setSelectedBrand] = useState("All Brands");
  const [selectedVehicleId, setSelectedVehicleId] = useState(null);
  const [selectedVehicleName, setSelectedVehicleName] = useState("");
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [searchInput, setSearchInput] = useState("");
  const [sortBy, setSortBy] = useState("none");

  const brandOptions = useMemo(() => {
    const allBrands = allVehicles?.map((v) => v.brand).filter(Boolean);
    return [...new Set(allBrands)];
  }, [allVehicles]);

  const handleDeleteClick = (vehicleId, vehicleName) => {
    setSelectedVehicleId(vehicleId);
    setSelectedVehicleName(vehicleName);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!selectedVehicleId) return;

    try {
      await onDelete(selectedVehicleId);
      setIsDeleteModalOpen(false);
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete vehicle: " + error.message);
    }
  };

  const calculateAverageRating = (ratings) => {
    if (!ratings || Object.keys(ratings).length === 0) return 0;
    const sum = Object.values(ratings).reduce((acc, curr) => acc + curr.rating, 0);
    return (sum / Object.keys(ratings).length).toFixed(1);
  };

  const filteredAndSortedVehicles = allVehicles
    .filter((vehicle) => {
      // Brand filter
      const matchesBrand = selectedBrand === "All Brands" || vehicle.brand === selectedBrand;
      
      // Search filter
      const searchTerm = searchInput.toLowerCase();
      const matchesSearch = 
        vehicle.name?.toLowerCase().includes(searchTerm) ||
        vehicle.brand?.toLowerCase().includes(searchTerm) ||
        vehicle.model?.toLowerCase().includes(searchTerm) ||
        vehicle.location?.toLowerCase().includes(searchTerm) ||
        vehicle.vehicleType?.toLowerCase().includes(searchTerm) ||
        vehicle.cchp?.toLowerCase().includes(searchTerm);
      
      return matchesBrand && matchesSearch;
    })
    .sort((a, b) => {
      if (sortBy === "highest") {
        return calculateAverageRating(b.ratings) - calculateAverageRating(a.ratings);
      } else if (sortBy === "lowest") {
        return calculateAverageRating(a.ratings) - calculateAverageRating(b.ratings);
      }
      return 0;
    });

  return (
    <div className="flex flex-col font-inter flex-1 p-10 bg-white">
      {/* Header Section */}
      <div className="flex w-full h-20 flex-row items-center justify-between mb-8">
        <div className="flex flex-col">
          <h2 className="text-2xl font-semibold text-black">Vehicles</h2>
          <label className="text-gray-600">View and Manage Vehicles</label>
        </div>
        <div className="flex flex-row gap-4 items-center">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="border px-3 py-2 rounded-md text-gray-700 bg-white"
          >
            <option value="none">Sort by Rating</option>
            <option value="highest">Highest Rated</option>
            <option value="lowest">Lowest Rated</option>
          </select>
          <select
            value={selectedBrand}
            onChange={(e) => setSelectedBrand(e.target.value)}
            className="border px-3 py-2 rounded-md text-gray-700 bg-white"
          >
            <option value="All Brands">All Brands</option>
            {brandOptions.map((brand) => (
              <option key={brand} value={brand}>
                {brand}
              </option>
            ))}
          </select>
          <input
            type="text"
            placeholder="Search vehicles..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="border px-3 py-2 rounded-md text-gray-700 bg-white"
          />
        </div>
      </div>

      {filteredAndSortedVehicles?.length === 0 ? (
        <div className="text-4xl text-gray-600 text-center w-full h-full flex justify-center items-center">
          No Vehicles Found
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAndSortedVehicles?.map((vehicle) => (
            <div
              key={vehicle.id}
              className="bg-white shadow-lg rounded-lg flex flex-col relative cursor-pointer hover:shadow-xl transition-shadow duration-300"
              onClick={() => openModal(vehicle)}
            >
              <MdDeleteOutline
                onClick={(e) => {
                  e.stopPropagation();
                  handleDeleteClick(vehicle.id, vehicle.name);
                }}
                className="absolute top-4 right-4 w-6 h-6 text-red-600 cursor-pointer z-10"
              />
              <div className="w-full h-48 bg-black/5 rounded-t-lg overflow-hidden">
                <img
                  src={vehicle.defaultImg || vehicle.images?.[0]}
                  alt={vehicle.name}
                  className="w-full h-full object-cover"
                />
              </div>
              
              <div className="p-6 flex flex-col">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="text-xl font-semibold text-black">
                    {vehicle.brand} {vehicle.model}
                  </h3>
                  <div className="flex items-center gap-1">
                    <FaStar className="text-yellow-400" />
                    <span className="text-sm font-medium">
                      {calculateAverageRating(vehicle.ratings)}
                    </span>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4 mt-4">
                  <div>
                    <label className="text-sm text-gray-500">Name</label>
                    <p className="text-black font-medium">{vehicle.name}</p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-500">CCHP</label>
                    <p className="text-black font-medium">{vehicle.cchp}</p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-500">Type</label>
                    <p className="text-black font-medium">{vehicle.vehicleType}</p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-500">Daily Rate</label>
                    <p className="text-black font-medium">₱{vehicle.pricePerDay}</p>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-gray-100">
                  <div className="flex justify-between items-center">
                    <div>
                      <label className="text-sm text-gray-500">Location</label>
                      <p className="text-black font-medium">{vehicle.location}</p>
                    </div>
                    <div>
                      <label className="text-sm text-gray-500">Transmission</label>
                      <p className="text-black font-medium">{vehicle.transmissionType}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmDeleteModal
        isOpen={isDeleteModalOpen}
        onCancel={() => setIsDeleteModalOpen(false)}
        onConfirm={confirmDelete}
        vehicleName={selectedVehicleName}
      />
    </div>
  );
};

export default Vehicles; 