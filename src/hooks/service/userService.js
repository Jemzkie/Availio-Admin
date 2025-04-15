import { signInWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../../config/firebaseConfig";
import { doc, updateDoc } from "firebase/firestore";

export const loginUser = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );
    const user = userCredential.user;

    return { success: true, message: "Login successful", userId: user.uid };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

export const verifyUser = async (uid) => {
  try {
    const userRef = doc(db, "users", uid);

    await updateDoc(userRef, {
      businessVerified: true,
    });
    return {
      success: true,
      message: "Verification successful",
    };
  } catch (error) {
    return { success: false, error: error.message };
  }
};
