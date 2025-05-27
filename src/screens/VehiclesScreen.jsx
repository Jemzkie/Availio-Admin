import React, { useState, useEffect } from "react";
import Menu from "../components/General/Menu";
import Vehicles from "../components/Vehicles/Vehicles";
import VehicleModal from "../components/Vehicles/VehicleModal";
import Loader from "../components/General/Loader";
import { collection, getDocs, doc, getDoc } from "firebase/firestore";
import { db } from "../config/firebaseConfig";
import { deleteVehicle } from "../hooks/service/vehicleService";
import { toast } from "react-toastify";

const VehiclesScreen = () => {
  const ViewData = "Vehicles";
  const [allVehicles, setAllVehicles] = useState([]);
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const fetchVehicleRatings = async (vehicleId) => {
    try {
      const ratingsRef = collection(db, `vehicles/${vehicleId}/ratings`);
      const ratingsSnapshot = await getDocs(ratingsRef);
      const ratings = {};
      
      for (const ratingDoc of ratingsSnapshot.docs) {
        const ratingData = ratingDoc.data();
        // Fetch user data for each rating
        const userRef = doc(db, "users", ratingData.userId);
        const userSnap = await getDoc(userRef);
        const userData = userSnap.exists() ? userSnap.data() : null;
        
        // Get the user's name from their data
        const userName = userData?.firstName && userData?.lastName 
          ? `${userData.firstName} ${userData.lastName}`
          : userData?.displayName || userData?.name || 'Anonymous User';
        
        ratings[ratingDoc.id] = {
          ...ratingData,
          userName: userName,
          userEmail: userData?.email || 'No email'
        };
      }
      
      return ratings;
    } catch (error) {
      console.error("Error fetching ratings:", error);
      return {};
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const vehiclesRef = collection(db, "vehicles");
        const querySnapshot = await getDocs(vehiclesRef);
        const vehicles = await Promise.all(
          querySnapshot.docs.map(async (doc) => {
            const vehicleData = doc.data();
            const ratings = await fetchVehicleRatings(doc.id);
            return {
              id: doc.id,
              ...vehicleData,
              ratings
            };
          })
        );
        setAllVehicles(vehicles);
      } catch (error) {
        console.error(error);
        toast.error("Failed to fetch vehicles: " + error.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const openModal = (vehicle) => {
    setSelectedVehicle(vehicle);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedVehicle(null);
  };

  const handleDelete = async (vehicleId) => {
    try {
      const result = await deleteVehicle(vehicleId);
      
      if (result.success) {
        setAllVehicles(prevVehicles =>
          prevVehicles.filter(vehicle => vehicle.id !== vehicleId)
        );
        
        toast.success(result.message);
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete vehicle: " + error.message);
    }
  };

  if (isLoading) {
    return <Loader ViewData={ViewData} />;
  }

  return (
    <div className="w-full flex flex-col min-h-screen h-auto">
      <div className={`flex flex-row ${isModalOpen ? "blur-md" : ""}`}>
        <Menu ViewData={ViewData} />
        <Vehicles
          openModal={openModal}
          allVehicles={allVehicles}
          setAllVehicles={setAllVehicles}
          onDelete={handleDelete}
        />
      </div>

      <VehicleModal
        isOpen={isModalOpen}
        closeModal={closeModal}
        selectedVehicle={selectedVehicle}
      />
    </div>
  );
};

export default VehiclesScreen;
