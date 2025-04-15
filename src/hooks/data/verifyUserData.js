import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../../config/firebaseConfig";

export const fetchPendingVerification = async () => {
  try {
    const usersRef = collection(db, "users");

    const q = query(
      usersRef,
      where("verificationDocs", "!=", null),
      where("businessVerified", "!=", false)
    );

    const querySnapshot = await getDocs(q);

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
