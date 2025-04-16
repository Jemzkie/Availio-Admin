import {
  doc,
  getDoc,
  query,
  where,
  collection,
  getDocs,
} from "firebase/firestore";
import { db } from "../../config/firebaseConfig";

export const fetchUser = async (uid) => {
  try {
    const docRef = doc(db, "users", uid);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return docSnap.data();
    } else {
      return null;
    }
  } catch (error) {
    return null;
  }
};

export const fetchUserRole = async (uid) => {
  try {
    const docRef = doc(db, "users", uid);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return docSnap.data().role || null;
    } else {
      console.warn("No user found for UID:", uid);
      return null;
    }
  } catch (error) {
    console.error("Error fetching user role:", error);
    return null;
  }
};

export const fetchUserEmail = async (email) => {
  try {
    const userQuery = query(
      collection(db, "users"),
      where("email", "==", email)
    );
    const querySnapshot = await getDocs(userQuery);

    if (!querySnapshot.empty) {
      const userDoc = querySnapshot.docs[0];
      const userData = userDoc.data();

      if (userData.role === "admin") {
        return { success: true };
      } else {
        return { success: false, message: "Insufficient Permission" };
      }
    } else {
      console.warn("No user found with email:", email);
      return { success: false, message: "User not found" };
    }
  } catch (error) {
    console.error("Error fetching user:", error);
    return { success: false, message: "Something went wrong" };
  }
};

export const fetchAllUsers = async () => {
  try {
    const usersRef = collection(db, "users");

    const querySnapshot = await getDocs(usersRef);

    const usersWithVerification = [];

    querySnapshot.forEach((doc) => {
      const data = doc.data();
      usersWithVerification.push({ id: doc.id, ...data });
    });

    return usersWithVerification;
  } catch (error) {
    console.log("Error fetching pending verifications:", error);
    return [];
  }
};
