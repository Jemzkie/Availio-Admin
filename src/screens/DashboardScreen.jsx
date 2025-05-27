import React, { useState, useEffect } from "react";
import Menu from "../components/General/Menu";
import { collection, getDocs, query, orderBy, limit, where, doc, getDoc } from "firebase/firestore";
import { db } from "../config/firebaseConfig";
import { FaUsers, FaCar, FaMoneyBillWave, FaCalendarCheck } from "react-icons/fa";
import { format } from "date-fns";
import { fetchAllUsers } from "../hooks/data/userData";
import { fetchAllVehicles } from "../hooks/data/vehicleData";
import Loader from "../components/General/Loader";

const DashboardScreen = () => {
  const ViewData = "Dashboard";
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalVehicles: 0,
    totalBookings: 0,
    totalRevenue: 0,
  });
  const [recentBookings, setRecentBookings] = useState([]);
  const [recentTransactions, setRecentTransactions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        console.log("Starting to fetch dashboard data...");

        // Fetch total users using the hook
        const users = await fetchAllUsers();
        const totalUsers = users.length;
        console.log("Total users fetched:", totalUsers);

        // Fetch total vehicles using the hook
        const vehicles = await fetchAllVehicles();
        const totalVehicles = vehicles.length;
        console.log("Total vehicles fetched:", totalVehicles);

        // Fetch total bookings and calculate revenue
        const bookingsRef = collection(db, "bookings");
        const bookingsSnapshot = await getDocs(bookingsRef);
        const totalBookings = bookingsSnapshot.size;
        const totalRevenue = bookingsSnapshot.docs.reduce((sum, doc) => {
          const booking = doc.data();
          return sum + (booking.totalPrice || 0);
        }, 0);
        console.log("Total bookings:", totalBookings, "Total revenue:", totalRevenue);

        // Fetch recent bookings with user and vehicle details
        const recentBookingsQuery = query(
          bookingsRef,
          orderBy("createdAt", "desc"),
          limit(5)
        );
        const recentBookingsSnapshot = await getDocs(recentBookingsQuery);
        console.log("Recent bookings fetched:", recentBookingsSnapshot.size);

        const bookings = await Promise.all(
          recentBookingsSnapshot.docs.map(async (bookingDoc) => {
            const booking = bookingDoc.data();
            // Fetch renter details
            const renterDoc = await getDoc(doc(db, "users", booking.renterId));
            const renter = renterDoc.exists() ? renterDoc.data() : null;
            // Fetch vehicle details
            const vehicleDoc = await getDoc(doc(db, "vehicles", booking.vehicleId));
            const vehicle = vehicleDoc.exists() ? vehicleDoc.data() : null;
            
            return {
              id: bookingDoc.id,
              ...booking,
              renter: renter ? `${renter.firstName} ${renter.lastName}` : 'Unknown',
              vehicle: vehicle ? `${vehicle.brand} ${vehicle.model}` : 'Unknown',
            };
          })
        );
        console.log("Processed bookings:", bookings);

        // Fetch recent transactions
        const transactionsRef = collection(db, "transactions");
        const transactionsQuery = query(
          transactionsRef,
          orderBy("createdAt", "desc"),
          limit(5)
        );
        const transactionsSnapshot = await getDocs(transactionsQuery);
        console.log("Recent transactions fetched:", transactionsSnapshot.size);

        const transactions = await Promise.all(
          transactionsSnapshot.docs.map(async (transactionDoc) => {
            const transaction = transactionDoc.data();
            // Fetch user details
            const userDoc = await getDoc(doc(db, "users", transaction.userId));
            const user = userDoc.exists() ? userDoc.data() : null;
            
            return {
              id: transactionDoc.id,
              ...transaction,
              userName: user ? `${user.firstName} ${user.lastName}` : 'Unknown',
            };
          })
        );
        console.log("Processed transactions:", transactions);

        setStats({
          totalUsers,
          totalVehicles,
          totalBookings,
          totalRevenue,
        });
        setRecentBookings(bookings);
        setRecentTransactions(transactions);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const formatDate = (timestamp) => {
    if (!timestamp) return '';
    const date = timestamp.toDate();
    return format(date, 'MMM dd, yyyy hh:mm a');
  };

  if (isLoading) {
    return <Loader ViewData={ViewData} />;
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <div className="flex">
        <Menu ViewData={ViewData} />
        <div className="flex-1 p-8">
          <h1 className="text-2xl font-bold text-gray-800 mb-8">Dashboard</h1>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-blue-100 text-blue-600">
                  <FaUsers className="w-6 h-6" />
                </div>
                <div className="ml-4">
                  <p className="text-sm text-gray-500">Total Users</p>
                  <p className="text-2xl font-semibold text-gray-800">{stats.totalUsers}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-green-100 text-green-600">
                  <FaCar className="w-6 h-6" />
                </div>
                <div className="ml-4">
                  <p className="text-sm text-gray-500">Total Vehicles</p>
                  <p className="text-2xl font-semibold text-gray-800">{stats.totalVehicles}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-yellow-100 text-yellow-600">
                  <FaCalendarCheck className="w-6 h-6" />
                </div>
                <div className="ml-4">
                  <p className="text-sm text-gray-500">Total Bookings</p>
                  <p className="text-2xl font-semibold text-gray-800">{stats.totalBookings}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-red-100 text-red-600">
                  <FaMoneyBillWave className="w-6 h-6" />
                </div>
                <div className="ml-4">
                  <p className="text-sm text-gray-500">Total Revenue</p>
                  <p className="text-2xl font-semibold text-gray-800">₱{stats.totalRevenue.toLocaleString()}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Recent Bookings */}
            <div className="bg-white rounded-lg shadow">
              <div className="p-6 border-b">
                <h2 className="text-lg font-semibold text-gray-800">Recent Bookings</h2>
              </div>
              <div className="p-6">
                {recentBookings.length === 0 ? (
                  <p className="text-gray-500 text-center">No recent bookings</p>
                ) : (
                  recentBookings.map((booking) => (
                    <div key={booking.id} className="mb-4 last:mb-0">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-medium text-gray-800">{booking.vehicle}</p>
                          <p className="text-sm text-gray-500">Rented by {booking.renter}</p>
                          <p className="text-sm text-gray-500">
                            {formatDate(booking.pickupDate)} - {formatDate(booking.returnDate)}
                          </p>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-sm ${
                          booking.bookingStatus === 'Cancelled' ? 'bg-red-100 text-red-800' :
                          booking.bookingStatus === 'Completed' ? 'bg-green-100 text-green-800' :
                          'bg-blue-100 text-blue-800'
                        }`}>
                          {booking.bookingStatus}
                        </span>
                      </div>
                      <div className="mt-2 text-sm text-gray-600">
                        Total: ₱{booking.totalPrice.toLocaleString()}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Recent Transactions */}
            <div className="bg-white rounded-lg shadow">
              <div className="p-6 border-b">
                <h2 className="text-lg font-semibold text-gray-800">Recent Transactions</h2>
              </div>
              <div className="p-6">
                {recentTransactions.length === 0 ? (
                  <p className="text-gray-500 text-center">No recent transactions</p>
                ) : (
                  recentTransactions.map((transaction) => (
                    <div key={transaction.id} className="mb-4 last:mb-0">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-medium text-gray-800">{transaction.type}</p>
                          <p className="text-sm text-gray-500">By {transaction.userName}</p>
                          <p className="text-sm text-gray-500">{formatDate(transaction.createdAt)}</p>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-sm ${
                          transaction.status === 'paid' ? 'bg-green-100 text-green-800' :
                          'bg-yellow-100 text-yellow-800'
                        }`}>
                          {transaction.status}
                        </span>
                      </div>
                      <div className="mt-2 text-sm text-gray-600">
                        Amount: ₱{transaction.amount.toLocaleString()}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardScreen;
