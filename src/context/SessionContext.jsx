import { createContext, useContext, useState, useEffect } from "react";
import { auth } from "../config/firebaseConfig";

const SessionContext = createContext();

export const SessionProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const login = (userData) => {
    console.log("User data on login:", userData);
    setUser(userData);
  };

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((firebaseUser) => {
      if (firebaseUser) {
        // ✅ Map photoURL to profilePicture
        setUser({
          ...firebaseUser,
          profilePicture: firebaseUser.photoURL || null,
        });
      } else {
        setUser(null);
      }
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return (
    <SessionContext.Provider value={{ user, setUser, isLoading }}>
      {children}
    </SessionContext.Provider>
  );
};

export const useSession = () => useContext(SessionContext);
