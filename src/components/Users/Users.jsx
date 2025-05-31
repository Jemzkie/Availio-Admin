import React, { useState, useEffect } from "react";
import UserImg from "../../assets/images/User.jpg";
import { FaSearch, FaStar } from "react-icons/fa";
import { collection, getDocs, query, where, doc, getDoc } from "firebase/firestore";
import { db } from "../../config/firebaseConfig";
import VerifyUserModal from "./VerifyUserModal";

const Users = ({ openModal: openUserModal, allUsers, userType }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortByRating, setSortByRating] = useState("none");
  const [bannedUsers, setBannedUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [userRatings, setUserRatings] = useState({});

  useEffect(() => {
    const fetchBannedUsers = async () => {
      try {
        const bansRef = collection(db, "bans");
        const bansSnapshot = await getDocs(bansRef);
        const bannedUserIds = bansSnapshot.docs.map(doc => doc.data().userId);
        setBannedUsers(bannedUserIds);
      } catch (error) {
        console.error("Error fetching banned users:", error);
      }
    };

    const fetchUserRatings = async () => {
      try {
        const ratings = {};
        
        for (const user of allUsers) {
          if (userType === "owners") {
            // Fetch supplier ratings for owners
            const ratingsRef = collection(db, `users/${user.id}/supplierRatings`);
            const ratingsSnapshot = await getDocs(ratingsRef);
            const userRatings = ratingsSnapshot.docs
              .map(doc => {
                const rating = doc.data().rating;
                return typeof rating === 'number' && !isNaN(rating) ? rating : 0;
              });
            
            if (userRatings.length > 0) {
              const average = userRatings.reduce((sum, rating) => sum + rating, 0) / userRatings.length;
              ratings[user.id] = {
                average: average.toFixed(1),
                count: userRatings.length
              };
            } else {
              ratings[user.id] = {
                average: "0",
                count: 0
              };
            }
          } else {
            // Fetch renter ratings from bookings
            const bookingsRef = collection(db, "bookings");
            const bookingsQuery = query(
              bookingsRef,
              where("renterId", "==", user.id),
              where("bookingStatus", "==", "Complete"),
              where("rated", "==", true)
            );
            const bookingsSnapshot = await getDocs(bookingsQuery);
            const userRatings = bookingsSnapshot.docs
              .map(doc => {
                const rating = doc.data().renterRating;
                return typeof rating === 'number' && !isNaN(rating) ? rating : 0;
              });
            
            if (userRatings.length > 0) {
              const average = userRatings.reduce((sum, rating) => sum + rating, 0) / userRatings.length;
              ratings[user.id] = {
                average: average.toFixed(1),
                count: userRatings.length
              };
            } else {
              ratings[user.id] = {
                average: "0",
                count: 0
              };
            }
          }
        }
        
        setUserRatings(ratings);
      } catch (error) {
        console.error("Error fetching user ratings:", error);
      }
    };

    fetchBannedUsers();
    fetchUserRatings();
  }, [allUsers, userType]);

  // Calculate average rating for all users
  const calculateAverageRating = (ratings) => {
    if (!ratings || ratings.length === 0) return 0;
    const sum = ratings.reduce((acc, rating) => acc + rating, 0);
    return (sum / ratings.length).toFixed(1);
  };

  // Filter users based on userType, search query, and status filter
  const filteredUsers = allUsers.filter((user) => {
    // First filter by user type
    const isCorrectType = userType === "owners" 
      ? user.role === "Owner"
      : !user.role;

    if (!isCorrectType) return false;

    // Then filter by ban status
    const isBanned = bannedUsers.includes(user.id);
    if (statusFilter === "banned" && !isBanned) return false;
    if (statusFilter === "active" && isBanned) return false;

    // Finally filter by search query if one exists
    if (!searchQuery.trim()) return true;

    const query = searchQuery.toLowerCase().trim();
    const searchableFields = [
      user.businessName,
      user.username,
      user.email,
      user.businessEmail,
      `${user.firstName} ${user.lastName}`,
      user.displayName
    ].filter(Boolean);

    return searchableFields.some(field => 
      field.toLowerCase().includes(query)
    );
  });

  // Sort and filter users
  const filteredAndSortedUsers = filteredUsers.sort((a, b) => {
    const ratingA = parseFloat(userRatings[a.id]?.average || "0");
    const ratingB = parseFloat(userRatings[b.id]?.average || "0");

    // Handle NaN values
    if (isNaN(ratingA)) return 1;  // Move NaN to the end
    if (isNaN(ratingB)) return -1; // Move NaN to the end

    if (sortByRating === "high") {
      return ratingB - ratingA;
    } else if (sortByRating === "low") {
      return ratingA - ratingB;
    }
    return 0;
  });

  const handleUserClick = (user) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  return (
    <div className="flex flex-col flex-1 font-inter p-10 bg-white">
      <div className="flex justify-between items-center mb-8">
        <div className="flex flex-col">
          <h2 className="text-2xl font-semibold text-black">{userType === "owners" ? "Owners" : "Renters"}</h2>
          <label className="text-gray-600">
            {userType === "owners" ? "All Vehicle Owners" : "All Renters"} Displayed Here
          </label>
        </div>

        <div className="flex items-center gap-4">
          {/* Sort by Rating */}
          <div className="relative">
            <select
              value={sortByRating}
              onChange={(e) => setSortByRating(e.target.value)}
              className="appearance-none bg-white p-3 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ed1c24] focus:border-transparent cursor-pointer"
            >
              <option value="none">Sort by Rating</option>
              <option value="high">Highest Rating</option>
              <option value="low">Lowest Rating</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
              <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/>
              </svg>
            </div>
          </div>

          {/* Status Filter */}
          <div className="relative">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="appearance-none bg-white p-3 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ed1c24] focus:border-transparent cursor-pointer"
            >
              <option value="all">All Users</option>
              <option value="active">Active Users</option>
              <option value="banned">Banned Users</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
              <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/>
              </svg>
            </div>
          </div>

          {/* Search Bar */}
          <div className="w-80">
            <div className="relative">
              <input
                type="text"
                placeholder={`Search ${userType === "owners" ? "owners" : "renters"}...`}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full p-3 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ed1c24] focus:border-transparent"
              />
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {filteredAndSortedUsers.length > 0 ? (
          filteredAndSortedUsers.map((user) => (
            <div
              key={user.id}
              className={`bg-white shadow-lg rounded-lg flex flex-col relative cursor-pointer hover:shadow-xl transition-shadow duration-300 ${
                bannedUsers.includes(user.id) ? 'border-2 border-[#ed1c24]' : ''
              }`}
              onClick={() => handleUserClick(user)}
            >
              <div className="w-full h-48 bg-black/5 rounded-t-lg flex items-center justify-center">
                {user.businessProfile ? (
                  <img
                    className="w-full h-full object-cover rounded-t-lg"
                    src={user.businessProfile}
                    alt="Business Profile"
                  />
                ) : (
                  <div className="w-full h-full object-cover rounded-t-lg bg-gray-100"></div>
                )}
              </div>

              <div className="absolute w-20 h-20 rounded-full border-4 border-white bottom-24 left-4 bg-black/5 flex items-center justify-center overflow-hidden">
                {user?.personalProfile || user?.photoURL ? (
                  <img
                    className="w-full h-full object-cover"
                    src={user.personalProfile || user.photoURL}
                    alt="User Profile"
                  />
                ) : (
                  <img src={UserImg} className="w-full h-full object-cover" />
                )}
              </div>

              <div className="p-6 flex mt-5 flex-col">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-xl font-semibold text-black">
                      {user.businessName || user.username || "No Name"}
                    </h3>
                    <label className="text-sm text-gray-500 font-medium mt-1">
                      @
                      {user?.firstName + " " + user?.lastName ||
                        user.userName ||
                        user.displayName ||
                        "No Name"}
                    </label>
                    <label className="text-sm text-gray-500 mt-1">
                      {user.email || user.businessEmail}
                    </label>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex items-center">
                      <FaStar className="text-yellow-400 w-4 h-4" />
                      <span className="ml-1 font-medium">{userRatings[user.id]?.average || "0"}</span>
                    </div>
                    <span className="text-sm text-gray-500">({userRatings[user.id]?.count || 0})</span>
                  </div>
                </div>
                {bannedUsers.includes(user.id) && (
                  <span className="text-[#ed1c24] text-sm font-medium mt-2">Banned</span>
                )}
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-3 text-center py-8">
            <p className="text-gray-500">
              {searchQuery 
                ? "No users found matching your search"
                : `No ${userType === "owners" ? "owners" : "renters"} found`}
            </p>
          </div>
        )}
      </div>

      <VerifyUserModal
        isOpen={isModalOpen}
        closeModal={() => setIsModalOpen(false)}
        selectedUser={selectedUser}
        handleVerification={openUserModal}
        userType={userType}
      />
    </div>
  );
};

export default Users;
