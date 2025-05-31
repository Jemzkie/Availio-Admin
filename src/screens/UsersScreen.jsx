import React, { useState, useEffect } from "react";
import { fetchAllUsers } from "../hooks/data/userData";
import { verifyUser } from "../hooks/service/userService";
import Users from "../components/Users/Users";
import Menu from "../components/General/Menu";
import Loader from "../components/General/Loader";
import VerifyUserModal from "../components/Users/VerifyUserModal";
import { useLocation } from "react-router-dom";

const UsersScreen = () => {
  const location = useLocation();
  const userType = location.pathname.includes("owners") ? "owners" : "renters";
  const ViewData = userType === "owners" ? "Owners" : "Renters";

  const [allUsers, setAllUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const requestAllUsers = await fetchAllUsers();
        setAllUsers(requestAllUsers);
        setIsLoading(false);
      } catch (error) {
        console.log(error);
        setIsLoading(false);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const openModal = (user) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedUser(null);
  };

  const handleVerification = async () => {
    try {
      const response = await verifyUser(selectedUser.uid);
      if (response.success) {
        alert(response.message);
      } else {
        alert(response.message);
      }
      allUsers;
    } catch (error) {
      console.error(error);
    }
  };

  if (isLoading) {
    return <Loader ViewData={ViewData} />;
  }

  return (
    <div className="w-full flex flex-col min-h-screen h-auto">
      <div className={`flex flex-row ${isModalOpen ? "blur-md" : ""}`}>
        <Menu ViewData={ViewData} />
        <Users
          openModal={openModal}
          allUsers={allUsers}
          selectedUser={selectedUser}
          userType={userType}
        />
      </div>

      <VerifyUserModal
        isOpen={isModalOpen}
        closeModal={closeModal}
        selectedUser={selectedUser}
        handleVerification={handleVerification}
      />
    </div>
  );
};

export default UsersScreen;
