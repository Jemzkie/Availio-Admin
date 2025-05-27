import {
  collection,
  addDoc,
  getDocs,
  getDoc,
  doc,
  serverTimestamp,
  query,
  where,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";
import { db } from "../../config/firebaseConfig.js";

// ✅ Add a vehicle
export const addVehicle = async (vehicleData) => {
  try {
    const {
      ownerId,
      images,
      name,
      model,
      transmissionType,
      fuelType,
      cchp,
      vehicleType,
      pricePerDay,
      location,
      brand,
    } = vehicleData;

    if (
      !ownerId ||
      !images ||
      images.length !== 4 ||
      !name ||
      !model ||
      !fuelType ||
      !pricePerDay ||
      !vehicleType ||
      !cchp ||
      !location ||
      !transmissionType ||
      !brand
    ) {
      console.log(vehicleData);
      throw new Error("All fields are required, including 4 images.");
    }

    const newVehicleRef = await addDoc(collection(db, "vehicles"), {
      ownerId,
      images,
      name,
      model,
      fuelType,
      vehicleType,
      transmissionType,
      cchp,
      pricePerDay,
      location,
      brand,
      defaultImg: vehicleData.images[0],
      createdAt: serverTimestamp(),
    });

    return {
      success: true,
      message: "Vehicle added successfully",
      vehicleId: newVehicleRef.id,
    };
  } catch (error) {
    console.error("Error adding vehicle:", error);
    return { success: false, error: error.message };
  }
};

// ✅ Fetch bookings for a specific vehicle
const fetchBookingsForVehicle = async (vehicleId) => {
  try {
    const bookingsQuery = query(
      collection(db, "bookings"),
      where("vehicleId", "==", vehicleId)
    );

    const bookingsSnapshot = await getDocs(bookingsQuery);
    const bookings = bookingsSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return bookings;
  } catch (error) {
    console.error(`Error fetching bookings for vehicle ${vehicleId}:`, error);
    return [];
  }
};

// ✅ Get all vehicles (with bookings)
export const fetchVehicles = async () => {
  try {
    const vehiclesSnapshot = await getDocs(collection(db, "vehicles"));
    const vehicles = await Promise.all(
      vehiclesSnapshot.docs.map(async (doc) => {
        const vehicle = { id: doc.id, ...doc.data() };
        const bookings = await fetchBookingsForVehicle(vehicle.id);
        return { ...vehicle, bookings };
      })
    );

    return vehicles;
  } catch (error) {
    console.error("Error fetching vehicles:", error);
    return [];
  }
};

// ✅ Get specific vehicle by ID (with bookings)
export const fetchVehicleById = async (vehicleId) => {
  try {
    const vehicleRef = doc(db, "vehicles", vehicleId);
    const vehicleSnap = await getDoc(vehicleRef);

    if (vehicleSnap.exists()) {
      const vehicle = { id: vehicleSnap.id, ...vehicleSnap.data() };
      const bookings = await fetchBookingsForVehicle(vehicleId);
      return { ...vehicle, bookings };
    } else {
      throw new Error("Vehicle not found");
    }
  } catch (error) {
    console.error(`Error fetching vehicle ${vehicleId}:`, error);
    return { success: false, error: error.message };
  }
};

// ✅ Update booking status (by owner)
export const updateBookingStatus = async (bookingId, newStatus) => {
  try {
    if (!bookingId || !newStatus) {
      throw new Error("Booking ID and new status are required.");
    }

    const bookingRef = doc(db, "bookings", bookingId);

    // Check if booking exists
    const bookingSnap = await getDoc(bookingRef);
    if (!bookingSnap.exists()) {
      throw new Error("Booking not found");
    }

    // Update booking status
    await updateDoc(bookingRef, {
      bookingStatus: newStatus,
    });

    return {
      success: true,
      message: `Booking status updated to '${newStatus}'`,
    };
  } catch (error) {
    console.error("Error updating booking status:", error);
    return { success: false, error: error.message };
  }
};

// ✅ Delete a vehicle by ID
export const deleteVehicleById = async (vehicleId) => {
  try {
    await deleteDoc(doc(db, "vehicles", vehicleId));
    return { success: true };
  } catch (error) {
    console.error("Error deleting vehicle:", error);
    return { success: false, error: error.message };
  }
};

export const fetchBookedVehiclesWithRenters = async (ownerId) => {
  try {
    // Step 1: Get vehicles owned by the owner
    const vehicleSnapshot = await getDocs(
      query(collection(db, "vehicles"), where("ownerId", "==", ownerId))
    );

    const vehicles = vehicleSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    const vehicleIdSet = new Set(vehicles.map((v) => v.id));

    // Step 2: Get all bookings
    const bookingSnapshot = await getDocs(collection(db, "bookings"));

    const matchedResults = [];

    for (const bookingDoc of bookingSnapshot.docs) {
      const booking = bookingDoc.data();
      const vehicleId = booking.vehicleId;

      // Only continue if the booking is for an owner's vehicle
      if (vehicleIdSet.has(vehicleId)) {
        const vehicle = vehicles.find((v) => v.id === vehicleId);

        // Get renter info
        const renterRef = doc(db, "users", booking.renterId);
        const renterSnap = await getDoc(renterRef);
        const renter = renterSnap.exists() ? renterSnap.data() : null;

        matchedResults.push({
          bookingId: bookingDoc.id,
          ...booking,
          vehicle,
          renter,
        });
      }
    }

    return matchedResults;
  } catch (error) {
    console.error("Error fetching booked vehicles with renters:", error);
    return [];
  }
};

// ✅ Update vehicle status
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
