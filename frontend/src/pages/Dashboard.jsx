// src/pages/Dashboard.jsx
// Dashboard page component (placeholder for now)

import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
              <p className="text-sm text-gray-600 mt-1">
                Welcome back, {user?.fullName}!
              </p>
            </div>
            <button
              onClick={handleLogout}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition duration-200"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            User Information
          </h2>
          <div className="space-y-2">
            <p className="text-gray-700">
              <strong>Name:</strong> {user?.fullName}
            </p>
            <p className="text-gray-700">
              <strong>Username:</strong> {user?.username}
            </p>
            <p className="text-gray-700">
              <strong>Role:</strong>{" "}
              <span
                className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                  user?.role === "manager"
                    ? "bg-blue-100 text-blue-800"
                    : "bg-green-100 text-green-800"
                }`}
              >
                {user?.role === "manager" ? "Manager" : "Employee"}
              </span>
            </p>
          </div>
        </div>

        {/* Coming Soon Section */}
        <div className="mt-8 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg shadow-lg p-8 text-white">
          <h2 className="text-2xl font-bold mb-4">
            🚧 Dashboard Under Construction
          </h2>
          <p className="text-lg mb-4">
            The full dashboard with statistics, charts, and task management is
            coming soon!
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
            <div className="bg-white bg-opacity-20 rounded-lg p-4">
              <h3 className="font-semibold mb-2">📊 Statistics</h3>
              <p className="text-sm">
                View task statistics and performance metrics
              </p>
            </div>
            <div className="bg-white bg-opacity-20 rounded-lg p-4">
              <h3 className="font-semibold mb-2">📋 Task Management</h3>
              <p className="text-sm">Create, assign, and track tasks</p>
            </div>
            <div className="bg-white bg-opacity-20 rounded-lg p-4">
              <h3 className="font-semibold mb-2">👥 User Management</h3>
              <p className="text-sm">Manage team members and permissions</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
