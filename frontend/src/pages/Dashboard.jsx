// src/pages/Dashboard.jsx
// Enhanced dashboard with statistics and charts

import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { dashboardAPI } from "../services/api";

const Dashboard = () => {
  const { user, logout, isManager } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [recentTasks, setRecentTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch dashboard data
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);

        // Fetch stats based on role
        const statsEndpoint = isManager()
          ? dashboardAPI.getStats()
          : dashboardAPI.getMyStats();

        const [statsResponse, tasksResponse] = await Promise.all([
          statsEndpoint,
          dashboardAPI.getRecentTasks({ limit: 5 }),
        ]);

        setStats(statsResponse.data);
        setRecentTasks(tasksResponse.data);
        setLoading(false);
      } catch (err) {
        console.error("Failed to fetch dashboard data:", err);
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  // Get status badge color
  const getStatusColor = (status) => {
    const colors = {
      open: "bg-gray-100 text-gray-800",
      in_progress: "bg-blue-100 text-blue-800",
      completed: "bg-green-100 text-green-800",
      cancelled: "bg-red-100 text-red-800",
    };
    return colors[status] || "bg-gray-100 text-gray-800";
  };

  // Get priority badge color
  const getPriorityColor = (priority) => {
    const colors = {
      urgent: "bg-red-100 text-red-800",
      high: "bg-orange-100 text-orange-800",
      medium: "bg-yellow-100 text-yellow-800",
      low: "bg-green-100 text-green-800",
    };
    return colors[priority] || "bg-gray-100 text-gray-800";
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
              <p className="text-sm text-gray-600 mt-1">
                Welcome back, <strong>{user?.fullName}</strong>!
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => navigate("/tasks")}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition"
              >
                Tasks
              </button>
              {isManager() && (
                <button
                  onClick={() => navigate("/users")}
                  className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition"
                >
                  Users
                </button>
              )}
              <button
                onClick={handleLogout}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Total Tasks */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Tasks</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">
                  {stats?.tasks?.total || 0}
                </p>
              </div>
              <div className="bg-blue-100 p-3 rounded-full">
                <svg
                  className="w-8 h-8 text-blue-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                  />
                </svg>
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm">
              <span className="text-gray-600">
                {stats?.tasks?.open || 0} open, {stats?.tasks?.inProgress || 0}{" "}
                in progress
              </span>
            </div>
          </div>

          {/* Completed Tasks */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Completed</p>
                <p className="text-3xl font-bold text-green-600 mt-2">
                  {stats?.tasks?.completed || 0}
                </p>
              </div>
              <div className="bg-green-100 p-3 rounded-full">
                <svg
                  className="w-8 h-8 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm">
              <span className="text-green-600">
                +{stats?.tasks?.recentCompleted || 0} this week
              </span>
            </div>
          </div>

          {/* In Progress Tasks */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">In Progress</p>
                <p className="text-3xl font-bold text-blue-600 mt-2">
                  {stats?.tasks?.inProgress || 0}
                </p>
              </div>
              <div className="bg-blue-100 p-3 rounded-full">
                <svg
                  className="w-8 h-8 text-blue-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  />
                </svg>
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm">
              <span className="text-gray-600">Active work in progress</span>
            </div>
          </div>

          {/* Overdue Tasks */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Overdue</p>
                <p className="text-3xl font-bold text-red-600 mt-2">
                  {stats?.tasks?.overdue || 0}
                </p>
              </div>
              <div className="bg-red-100 p-3 rounded-full">
                <svg
                  className="w-8 h-8 text-red-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm">
              <span className="text-red-600">Needs immediate attention</span>
            </div>
          </div>
        </div>

        {/* Priority Distribution */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Tasks by Priority (Active)
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-red-50 rounded-lg">
              <p className="text-2xl font-bold text-red-600">
                {stats?.priority?.urgent || 0}
              </p>
              <p className="text-sm text-gray-600 mt-1">Urgent</p>
            </div>
            <div className="text-center p-4 bg-orange-50 rounded-lg">
              <p className="text-2xl font-bold text-orange-600">
                {stats?.priority?.high || 0}
              </p>
              <p className="text-sm text-gray-600 mt-1">High</p>
            </div>
            <div className="text-center p-4 bg-yellow-50 rounded-lg">
              <p className="text-2xl font-bold text-yellow-600">
                {stats?.priority?.medium || 0}
              </p>
              <p className="text-sm text-gray-600 mt-1">Medium</p>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <p className="text-2xl font-bold text-green-600">
                {stats?.priority?.low || 0}
              </p>
              <p className="text-sm text-gray-600 mt-1">Low</p>
            </div>
          </div>
        </div>

        {/* Recent Tasks */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="p-6 border-b border-gray-200 flex justify-between items-center">
            <h2 className="text-lg font-semibold text-gray-900">
              Recent Tasks
            </h2>
            <button
              onClick={() => navigate("/tasks")}
              className="text-blue-600 hover:text-blue-800 text-sm font-medium"
            >
              View All →
            </button>
          </div>
          {recentTasks.length === 0 ? (
            <div className="p-6 text-center text-gray-500">
              <p>No recent tasks</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {recentTasks.map((task) => (
                <div
                  key={task.id}
                  className="p-4 hover:bg-gray-50 cursor-pointer"
                  onClick={() => navigate("/tasks")}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h3 className="text-sm font-medium text-gray-900">
                        {task.title}
                      </h3>
                      <p className="text-xs text-gray-500 mt-1">
                        Assigned to: {task.employee_name}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span
                        className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getPriorityColor(
                          task.priority
                        )}`}
                      >
                        {task.priority}
                      </span>
                      <span
                        className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(
                          task.status
                        )}`}
                      >
                        {task.status}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Manager Only: User Statistics */}
        {isManager() && stats?.users && (
          <div className="bg-white rounded-lg shadow p-6 mt-8">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              System Users
            </h2>
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <p className="text-2xl font-bold text-purple-600">
                  {stats.users.total}
                </p>
                <p className="text-sm text-gray-600 mt-1">Total Users</p>
              </div>
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <p className="text-2xl font-bold text-blue-600">
                  {stats.users.managers}
                </p>
                <p className="text-sm text-gray-600 mt-1">Managers</p>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <p className="text-2xl font-bold text-green-600">
                  {stats.users.employees}
                </p>
                <p className="text-sm text-gray-600 mt-1">Employees</p>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Dashboard;
