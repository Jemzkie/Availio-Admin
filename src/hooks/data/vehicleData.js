import {
  doc,
  getDoc,
  query,
  where,
  collection,
  getDocs,
  updateDoc,
  deleteDoc,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../../config/firebaseConfig";

export const fetchVehicle = async (vehicleId) => {
  try {
    const docRef = doc(db, "vehicles", vehicleId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() };
    } else {
      return null;
    }
  } catch (error) {
    console.error("Error fetching vehicle:", error);
    return null;
  }
};

export const fetchAllVehicles = async () => {
  try {
    const vehiclesRef = collection(db, "vehicles");
    const querySnapshot = await getDocs(vehiclesRef);

    const vehicles = [];
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      vehicles.push({ id: doc.id, ...data });
    });

    return vehicles;
  } catch (error) {
    console.error("Error fetching vehicles:", error);
    return [];
  }
};

export const updateVehicleStatus = async (vehicleId, newStatus) => {
  try {
    if (!vehicleId || !newStatus) {
      throw new Error("Vehicle ID and new status are required");
    }

    const vehicleRef = doc(db, "vehicles", vehicleId);
    const vehicleSnap = await getDoc(vehicleRef);

    if (!vehicleSnap.exists()) {
      throw new Error("Vehicle not found");
    }

    await updateDoc(vehicleRef, {
      status: newStatus,
      updatedAt: serverTimestamp(),
    });

    return {
      success: true,
      message: `Vehicle status updated to '${newStatus}'`,
    };
  } catch (error) {
    console.error("Error updating vehicle status:", error);
    return { success: false, error: error.message };
  }
};

export const deleteVehicle = async (vehicleId) => {
  try {
    if (!vehicleId) {
      throw new Error("Vehicle ID is required");
    }

    const vehicleRef = doc(db, "vehicles", vehicleId);
    const vehicleSnap = await getDoc(vehicleRef);

    if (!vehicleSnap.exists()) {
      throw new Error("Vehicle not found");
    }

    await deleteDoc(vehicleRef);
    return { success: true, message: "Vehicle deleted successfully" };
  } catch (error) {
    console.error("Error deleting vehicle:", error);
    return { success: false, error: error.message };
  }
};

export const fetchVehiclesByStatus = async (status) => {
  try {
    const vehiclesQuery = query(
      collection(db, "vehicles"),
      where("status", "==", status)
    );
    const querySnapshot = await getDocs(vehiclesQuery);

    const vehicles = [];
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      vehicles.push({ id: doc.id, ...data });
    });

    return vehicles;
  } catch (error) {
    console.error("Error fetching vehicles by status:", error);
    return [];
  }
}; 