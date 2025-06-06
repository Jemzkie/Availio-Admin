import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import "./App.css";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
import LoginScreen from "./screens/LoginScreen";
import { fetchUserRole } from "./hooks/data/userData";
import DashboardScreen from "./screens/DashboardScreen";
import ProtectedRoute from "./components/ProtectedRoute";
import { auth } from "./config/firebaseConfig";
import UsersScreen from "./screens/UsersScreen";
import VehiclesScreen from "./screens/VehiclesScreen";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const [getUser, setUser] = useState(null);
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        const userRequest = await fetchUserRole(user.uid);
        setUserRole(userRequest);
        setUser(user);
        setIsLoggedIn(true);
      } else {
        setIsLoggedIn(false);
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <Router>
      <ToastContainer
        position="top-center"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable={false}
        pauseOnHover
        theme="light"
      />
      <Routes>
        <Route path="/" element={<LoginScreen />} />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute role={userRole} allowedRoles={["admin"]}>
              <DashboardScreen getUser={getUser} />
            </ProtectedRoute>
          }
        />

        <Route
          path="/owners"
          element={
            <ProtectedRoute role={userRole} allowedRoles={["admin"]}>
              <UsersScreen getUser={getUser} />
            </ProtectedRoute>
          }
        />

        <Route
          path="/renters"
          element={
            <ProtectedRoute role={userRole} allowedRoles={["admin"]}>
              <UsersScreen getUser={getUser} />
            </ProtectedRoute>
          }
        />

        <Route
          path="/vehicles"
          element={
            <ProtectedRoute role={userRole} allowedRoles={["admin"]}>
              <VehiclesScreen getUser={getUser} />
            </ProtectedRoute>
          }
        />

        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;
