// src/pages/Dashboard.jsx
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
import SkeletonDashboard from "../components/skeletons/SkeletonDashboard";
import AppLayout from "../components/Layout/AppLayout";
import { useTranslation } from "react-i18next";

const Dashboard = () => {
  const { user, isManager } = useAuth();
  const navigate = useNavigate();
  const { t } = useTranslation();

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

  // Get status badge color
  const getStatusColor = (status) => {
    const colors = {
      open: "bg-[#eaf9fd] text-[#26C0E2]",
      in_progress: "bg-[#FF8F6B] text-blue-800",
      completed: "bg-green-100 text-green-900",
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

  // Loading state
  if (loading) {
    return (
      <AppLayout
        title={t("navigation.dashboard")}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
      >
        <SkeletonDashboard />
      </AppLayout>
    );
  }

  return (
    <AppLayout
      title={t("navigation.dashboard")}
      sidebarOpen={sidebarOpen}
      setSidebarOpen={setSidebarOpen}
    >
      {/* Statistics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
        {/* Total Tasks */}
        <div className="bg-white rounded-xl border border-gray-200 px-4 py-5">
          <div className="flex flex-row-reverse items-start justify-between gap-3">
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-600">
                {t("dashboard.totalTasks")}
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
              <p className="text-sm font-medium text-gray-600">
                {t("dashboard.charts.completed")}
              </p>
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
                {t("dashboard.charts.todayTasks")}
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
              <p className="text-sm font-medium text-gray-600">
                {t("dashboard.overdueTasks")}
              </p>
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

      {/* Employee Performance Table (Manager Only) */}
      {isManager() && chartData?.employeePerformance && (
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden mb-6 sm:mb-8">
          <div className="p-4 sm:p-6 border-b border-gray-200">
            <h2 className="text-base sm:text-lg font-semibold text-gray-900 text-center">
              {t("dashboard.charts.userPerformance")}
            </h2>
          </div>
          <div className="overflow-x-auto">
            <EmployeePerformanceTable data={chartData.employeePerformance} />
          </div>
        </div>
      )}

      {/* Recent Tasks */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="p-4 sm:p-6 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-base sm:text-lg font-semibold text-gray-900">
            {t("tasks.recentTasks")}
          </h2>
          <button
            onClick={() => navigate("/tasks")}
            className="text-white px-5 py-2 rounded-md bg-[#605BFF] hover:text-blue-800 text-sm font-medium"
          >
            {t("tasks.viewAll")}
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
                      {t("tasks.assignedTo")} : {task.employee_name}
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
    </AppLayout>
  );
};

export default Dashboard;
