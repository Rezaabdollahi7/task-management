// src/pages/Dashboard.jsx
// Enhanced dashboard with statistics and charts

import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { dashboardAPI } from "../services/api";
import StatusPieChart from "../components/charts/StatusPieChart";
import PriorityBarChart from "../components/charts/PriorityBarChart";
import DailyLineChart from "../components/charts/DailyLineChart";
import TasksTimelineChart from "../components/charts/TasksTimelineChart";
import UserPerformanceChart from "../components/charts/UserPerformanceChart";
import EmployeePerformanceTable from "../components/EmployeePerformanceTable";
import NotificationBell from "../components/NotificationBell";
import { FaBell, FaUsers, FaSignOutAlt, FaBars, FaTimes } from "react-icons/fa";
import SkeletonCard from "../components/skeletons/SkeletonCard";
import SkeletonChart from "../components/skeletons/SkeletonChart";
import { MdOutlineTaskAlt } from "react-icons/md";
import { RiNotification3Line } from "react-icons/ri";
import { RxDashboard } from "react-icons/rx";
import { TbLogout } from "react-icons/tb";
import { HiOutlineUsers } from "react-icons/hi2";

const Dashboard = () => {
  const { user, logout, isManager } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [chartData, setChartData] = useState(null);
  const [recentTasks, setRecentTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Fetch dashboard data
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);

        // Fetch stats and charts based on role
        const statsEndpoint = isManager()
          ? dashboardAPI.getStats()
          : dashboardAPI.getMyStats();

        const chartsEndpoint = isManager()
          ? dashboardAPI.getChartData()
          : dashboardAPI.getMyChartData();

        const [statsResponse, chartsResponse, tasksResponse] =
          await Promise.all([
            statsEndpoint,
            chartsEndpoint,
            dashboardAPI.getRecentTasks({ limit: 5 }),
          ]);

        setStats(statsResponse.data);
        setChartData(chartsResponse.data);
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
      open: "bg-[#5B93FF] text-white",
      in_progress: "bg-[#FF8F6B] text-blue-800",
      completed: "bg-green-400 text-green-900",
      cancelled: "bg-[#5B93FF] text-red-800",
    };
    return colors[status] || "bg-gray-100 text-gray-800";
  };

  // Get priority badge color
  const getPriorityColor = (priority) => {
    const colors = {
      urgent: "bg-red-100 text-[#D11A2A]",
      high: "bg-orange-100 text-orange-800",
      medium: "bg-yellow-100 text-yellow-600",
      low: "bg-green-100 text-green-800",
    };
    return colors[priority] || "bg-gray-100 text-gray-800";
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex">
        {/* Main content */}
        <div className="flex-1 ">
          {/* Header */}
          <header className="bg-white shadow-sm sticky top-0 z-30">
            <div className="px-4 sm:px-6 lg:px-8 py-4">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setSidebarOpen(true)}
                    className="lg:hidden text-gray-600 hover:text-gray-900 p-2"
                  >
                    <FaBars className="w-6 h-6" />
                  </button>
                  <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
                    Dashboard
                  </h1>
                </div>
                <div className="flex items-center gap-3">
                  <NotificationBell />
                </div>
              </div>
            </div>
          </header>

          {/* Skeleton Content */}
          <main className="px-4 sm:px-6 lg:px-8 py-6 sm:py-8 bg-[#FAFAFB] min-h-[calc(100vh-73px)]">
            {/* Skeleton Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
              {Array.from({ length: 4 }).map((_, i) => (
                <SkeletonCard key={i} />
              ))}
            </div>

            {/* Skeleton Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
              <div className="bg-white rounded-lg border border-gray-200 p-4 sm:p-6">
                <SkeletonChart type="pie" />
              </div>
              <div className="bg-white rounded-lg border border-gray-200 p-4 sm:p-6">
                <SkeletonChart type="bar" />
              </div>
              <div className="bg-white rounded-lg border border-gray-200 p-4 sm:p-6">
                <SkeletonChart type="line" />
              </div>
            </div>

            {/* Skeleton Week Tasks */}
            <div className="bg-white rounded-lg border border-gray-200 p-4 sm:p-6 mb-6 sm:mb-8">
              <div className="h-6 bg-gray-200 rounded w-64 mx-auto mb-6 animate-pulse"></div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div
                    key={i}
                    className="text-center p-3 sm:p-4 rounded-lg bg-gray-50 animate-pulse"
                  >
                    <div className="h-8 bg-gray-200 rounded w-12 mx-auto mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-20 mx-auto"></div>
                  </div>
                ))}
              </div>
            </div>

            {/* Skeleton Recent Tasks */}
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <div className="p-4 sm:p-6 border-b border-gray-200">
                <div className="h-6 bg-gray-200 rounded w-32 animate-pulse"></div>
              </div>
              <div className="divide-y divide-gray-200">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="p-4 animate-pulse">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                      <div className="flex-1">
                        <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                        <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                      </div>
                      <div className="flex gap-2">
                        <div className="h-6 w-16 bg-gray-200 rounded-full"></div>
                        <div className="h-6 w-16 bg-gray-200 rounded-full"></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex ">
      {/* Sidebar - Fixed on desktop, slide-in on mobile */}
      <aside
        className={`fixed top-0 left-0 h-full bg-white shadow-lg z-50 transition-transform duration-300 ease-in-out w-full lg:w-[20%] flex flex-col ${
          sidebarOpen ? "translate-x-0" : "translate-x-full"
        } lg:translate-x-0`}
      >
        {/* Close button for mobile */}
        <div className="lg:hidden flex justify-end items-center p-6 relative">
          <div className="flex container absolute lg:hidden right-[50%] translate-x-1/2  items-center justify-center  py-1 -z-10 ">
            <img
              src="../../public/icons/full_rounded.png"
              alt=""
              className="size-16 mr-[30%]"
            />
            <span className="text-xl absolute italic">ero Task</span>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="text-gray-500 hover:text-gray-700 z-10"
          >
            <FaTimes className="w-6 h-6" />
          </button>
        </div>

        {/* header & logo */}
        <div className="hidden container lg:flex  items-center justify-center relative py-1 border border-b mb-8">
          <img
            src="../../public/icons/full_rounded.png"
            alt=""
            className="size-24 mr-[30%]"
          />
          <span className="text-xl absolute italic">ero Task</span>
        </div>
        {/* Navigation */}
        <nav className="flex-1  overflow-y-auto">
          <div className="space-y-2">
            <button
              onClick={() => {
                navigate("/dashboard");
                setSidebarOpen(false);
              }}
              className="w-full flex items-center gap-3 px-4 py-3 text-[#605BFF] bg-gradient-to-r from-[#aca9ff8c] from-10% via-[#aca9ff21] via-50% to-white "
            >
              <RxDashboard className="size-6 flex-shrink-0" />
              <span className="font-medium">Dashboard</span>
            </button>

            <button
              onClick={() => {
                navigate("/tasks");
                setSidebarOpen(false);
              }}
              className="w-full flex items-center gap-3 px-4 py-3 text-gray-600 text-lg hover:bg-myYellow-50/10 hover:text-yellow-600 rounded-lg transition-colors"
            >
              <MdOutlineTaskAlt className="size-6 flex-shrink-0" />
              <span className="font-medium">Tasks</span>
            </button>

            {isManager() && (
              <button
                onClick={() => {
                  navigate("/users");
                  setSidebarOpen(false);
                }}
                className="w-full flex items-center gap-3 px-4 py-3 text-gray-700 text-lg hover:bg-purple-50 hover:text-purple-600 rounded-lg transition-colors"
              >
                <HiOutlineUsers className="size-6 flex-shrink-0" />
                <span className="font-medium">Users</span>
              </button>
            )}
            <button
              onClick={() => {
                navigate("/notifications");
                setSidebarOpen(false);
              }}
              className="w-full flex items-center gap-3 px-4 py-3 text-gray-700 text-lg hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-colors"
            >
              <RiNotification3Line className="size-6 flex-shrink-0" />
              <span className="font-medium">Notifications</span>
            </button>
          </div>
        </nav>

        <div className="user-info flex flex-row-reverse items-center justify-between px-4 border border-t-gray-200">
          {/* Logout button at bottom */}
          <div className="">
            <button
              onClick={handleLogout}
              className=" text-gray-700 hover:bg-red-50 hover:text-red-600 p-4 rounded-lg transition-colors"
            >
              <TbLogout className="size-6 flex-shrink-0" />
            </button>
          </div>
          {/* User info */}
          <div className="p-4 ">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
                {user?.fullName?.charAt(0).toUpperCase()}
              </div>
              <div className="min-w-0">
                <p className="font-semibold text-gray-900 truncate">
                  {user?.fullName}
                </p>
                <p className="text-xs text-gray-500 capitalize">{user?.role}</p>
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* Main content - with margin for fixed sidebar on desktop */}
      <div className="flex-1 lg:ml-[20%]">
        {/* Header - Sticky */}
        <header className="bg-white shadow-sm sticky top-0 z-30">
          <div className="px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-3">
                {/* Mobile menu button */}
                <button
                  onClick={() => setSidebarOpen(true)}
                  className="lg:hidden text-gray-600 hover:text-gray-900 p-2"
                >
                  <FaBars className="w-6 h-6" />
                </button>
                <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
                  Dashboard
                </h1>
              </div>
              <div className="flex items-center gap-3">
                <NotificationBell />
              </div>
            </div>
          </div>
        </header>

        {/* Main Content - Scrollable */}
        <main className="px-4 sm:px-6 lg:px-8 py-6 sm:py-8 bg-[#FAFAFB] min-h-[calc(100vh-73px)]">
          {/* Statistics Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
            {/* Total Tasks */}
            <div className="bg-white rounded-xl border border-gray-200 px-4 py-5">
              <div className="flex flex-row-reverse items-start justify-between gap-3">
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-600">
                    Total Tasks
                  </p>
                  <p className="text-2xl sm:text-3xl font-bold text-gray-900">
                    {stats?.tasks?.total || 0}
                  </p>
                </div>
                <div className="bg-blue-100 p-3 rounded-full flex-shrink-0">
                  <svg
                    className="w-6 h-6 sm:w-8 sm:h-8 text-blue-600"
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
            </div>

            {/* Completed Tasks */}
            <div className="bg-white rounded-xl border border-gray-200 px-4 py-5">
              <div className="flex flex-row-reverse items-start justify-between gap-3">
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-600">Completed</p>
                  <p className="text-2xl sm:text-3xl font-bold text-green-600">
                    {stats?.tasks?.completed || 0}
                  </p>
                </div>
                <div className="bg-green-100 p-3 rounded-full flex-shrink-0">
                  <svg
                    className="w-6 h-6 sm:w-8 sm:h-8 text-green-600"
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
            </div>

            {/* Today's Tasks */}
            <div className="bg-white rounded-xl border border-gray-200 px-4 py-5">
              <div className="flex flex-row-reverse items-start justify-between gap-3">
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-600">
                    Today's Tasks
                  </p>
                  <p className="text-2xl sm:text-3xl font-bold text-purple-600">
                    {chartData?.todayTasks?.total || 0}
                  </p>
                </div>
                <div className="bg-purple-100 p-3 rounded-full flex-shrink-0">
                  <svg
                    className="w-6 h-6 sm:w-8 sm:h-8 text-purple-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                </div>
              </div>
            </div>

            {/* Overdue Tasks */}
            <div className="bg-white rounded-xl border border-gray-200 px-4 py-5">
              <div className="flex flex-row-reverse items-start justify-between gap-3">
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-600">Overdue</p>
                  <p className="text-2xl sm:text-3xl font-bold text-red-600">
                    {stats?.tasks?.overdue || 0}
                  </p>
                </div>
                <div className="bg-red-100 p-3 rounded-full flex-shrink-0">
                  <svg
                    className="w-6 h-6 sm:w-8 sm:h-8 text-red-600"
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
            </div>
          </div>

          {/* Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-6 gap-4 sm:gap-6 mb-6 sm:mb-8">
            {/* Status Distribution */}
            <div className="bg-white rounded-lg border border-gray-200 p-4 sm:p-2 col-span-2">
              <StatusPieChart data={chartData?.statusChart} />
            </div>

            {/* Priority Distribution */}
            <div className="bg-white rounded-lg shadow p-2 col-span-2">
              <PriorityBarChart data={chartData?.priorityChart} />
            </div>

            {/* Daily Tasks (Last 7 Days) */}
            <div className="bg-white rounded-lg shadow p-2 col-span-2">
              <DailyLineChart data={chartData?.dailyChart} />
            </div>

            <div className="bg-white rounded-lg shadow p-2 mb-6 sm:mb-8 col-span-3">
              <UserPerformanceChart data={chartData?.userPerformanceChart} />
            </div>

            {/* Tasks Timeline Chart (Full Width) */}
            <div className="bg-white rounded-lg shadow p-2 mb-6 sm:mb-8 col-span-3">
              <TasksTimelineChart data={chartData?.timelineChart} />
            </div>
          </div>

          {/* This Week Tasks */}
          <div className="bg-white rounded-lg border border-gray-200 p-4 sm:p-6 mb-6 sm:mb-8">
            <h2 className="text-base sm:text-xl font-semibold text-gray-900 mb-4 sm:mb-6 text-center">
              This Week's Tasks Breakdown
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
              {chartData?.weeklyTasks?.map((item) => (
                <div
                  key={item.status}
                  className={`text-center p-3 sm:p-4 rounded-lg border border-gray-200 ${
                    item.status === "completed"
                      ? "bg-green-50"
                      : item.status === "in_progress"
                      ? "bg-blue-50"
                      : item.status === "open"
                      ? "bg-gray-50"
                      : "bg-red-50"
                  }`}
                >
                  <p
                    className={`text-xl sm:text-2xl font-bold ${
                      item.status === "completed"
                        ? "text-green-600"
                        : item.status === "in_progress"
                        ? "text-blue-600"
                        : item.status === "open"
                        ? "text-gray-600"
                        : "text-red-600"
                    }`}
                  >
                    {item.count}
                  </p>
                  <p className="text-xs sm:text-sm text-gray-600 mt-1 capitalize">
                    {item.status.replace("_", " ")}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Employee Performance Table (Manager Only) */}
          {isManager() && chartData?.employeePerformance && (
            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden mb-6 sm:mb-8">
              <div className="p-4 sm:p-6 border-b border-gray-200">
                <h2 className="text-base sm:text-lg font-semibold text-gray-900">
                  Employee Performance
                </h2>
              </div>
              <div className="overflow-x-auto">
                <EmployeePerformanceTable
                  data={chartData.employeePerformance}
                />
              </div>
            </div>
          )}

          {/* Recent Tasks */}
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            <div className="p-4 sm:p-6 border-b border-gray-200 flex justify-between items-center">
              <h2 className="text-base sm:text-lg font-semibold text-gray-900">
                Recent Tasks
              </h2>
              <button
                onClick={() => navigate("/tasks")}
                className="text-white px-5 py-2 rounded-md bg-[#605BFF] hover:text-blue-800 text-sm font-medium"
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
                    className="p-4 hover:bg-gray-50 cursor-pointer transition"
                    onClick={() => navigate("/tasks")}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <h3 className="text-sm font-medium text-gray-900 truncate">
                          {task.title}
                        </h3>
                        <p className="text-xs text-gray-500 mt-1">
                          Assigned to: {task.employee_name}
                        </p>
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <span
                          className={`px-4 py-2 inline-flex text-xs leading-5 font-medium rounded-full ${getPriorityColor(
                            task.priority
                          )}`}
                        >
                          {task.priority}
                        </span>
                        <span
                          className={`px-4 py-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(
                            task.status
                          )}`}
                        >
                          {task.status.replace("_", " ")}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
