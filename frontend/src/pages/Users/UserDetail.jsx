// src/pages/Users/UserDetail.jsx
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { usersAPI } from "../../services/api";
import { useTranslation } from "react-i18next";
import { formatDate } from "../../utils/dateHelper";
import AppLayout from "../../components/Layout/AppLayout";
import UserMonthlyPerformanceChart from "../../components/charts/UserMonthlyPerformanceChart";

const UserDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();

  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [reports, setReports] = useState([]);
  const [activeTab, setActiveTab] = useState("all"); // all, in_progress, completed, overdue
  const [error, setError] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Fetch user data
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true);
        setError("");

        // Fetch stats
        const statsResponse = await usersAPI.getStats(id);
        setUserData(statsResponse.data);

        // Fetch tasks
        const tasksResponse = await usersAPI.getTasks(id, { limit: 100 });

        console.log("📋 Tasks from API:", tasksResponse.data.tasks);
        console.log(
          "📅 Sample task_date:",
          tasksResponse.data.tasks[0]?.task_date
        );

        setTasks(tasksResponse.data.tasks || []);

        // Fetch reports
        const reportsResponse = await usersAPI.getReports(id, { limit: 10 });
        setReports(reportsResponse.data || []);

        setLoading(false);
      } catch (err) {
        console.error("Error fetching user data:", err);
        setError(err.message || "Failed to load user data");
        setLoading(false);
      }
    };

    if (id) {
      fetchUserData();
    }
  }, [id]);

  // Filter tasks based on active tab
  const filteredTasks = tasks.filter((task) => {
    if (activeTab === "all") return true;
    if (activeTab === "in_progress") return task.status === "in_progress";
    if (activeTab === "completed") return task.status === "completed";
    if (activeTab === "overdue") {
      return (
        task.deadline &&
        new Date(task.deadline) < new Date() &&
        task.status !== "completed" &&
        task.status !== "cancelled"
      );
    }
    return true;
  });

  // Priority badge color
  const getPriorityColor = (priority) => {
    switch (priority) {
      case "urgent":
        return "bg-red-100 text-red-800";
      case "high":
        return "bg-orange-100 text-orange-800";
      case "medium":
        return "bg-blue-100 text-blue-800";
      case "low":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // Status badge color
  const getStatusColor = (status) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800";
      case "in_progress":
        return "bg-blue-100 text-blue-800";
      case "open":
        return "bg-yellow-100 text-yellow-800";
      case "cancelled":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">{t("common.loading")}</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={() => navigate("/users")}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            {t("common.back")}
          </button>
        </div>
      </div>
    );
  }

  return (
    <AppLayout
      title={userData?.user?.full_name}
      sidebarOpen={sidebarOpen}
      setSidebarOpen={setSidebarOpen}
    >
      <div className="space-y-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Total Tasks */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">
                  {t("dashboard.totalTasks")}
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {userData?.stats?.total_tasks || 0}
                </p>
              </div>
              <div className="p-3 bg-blue-100 rounded-lg">
                <svg
                  className="w-6 h-6 text-blue-600"
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

          {/* Completion Rate */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">
                  {t("dashboard.completionRate")}
                </p>
                <p className="text-2xl font-bold text-green-600">
                  {userData?.stats?.completion_rate || 0}%
                </p>
              </div>
              <div className="p-3 bg-green-100 rounded-lg">
                <svg
                  className="w-6 h-6 text-green-600"
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

          {/* In Progress */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">
                  {t("tasks.statuses.in_progress")}
                </p>
                <p className="text-2xl font-bold text-blue-600">
                  {userData?.stats?.in_progress_tasks || 0}
                </p>
              </div>
              <div className="p-3 bg-blue-100 rounded-lg">
                <svg
                  className="w-6 h-6 text-blue-600"
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

          {/* Completed */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">
                  {t("tasks.statuses.completed")}
                </p>
                <p className="text-2xl font-bold text-green-600">
                  {userData?.stats?.completed_tasks || 0}
                </p>
              </div>
              <div className="p-3 bg-green-100 rounded-lg">
                <svg
                  className="w-6 h-6 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Monthly Performance Chart */}
        <UserMonthlyPerformanceChart
          data={userData?.monthlyPerformance || []}
          userName={userData?.user?.full_name}
        />

        {/* Tasks Section */}
        <div className="bg-white rounded-lg shadow">
          {/* Tabs */}
          <div className="border-b border-gray-200">
            <div className="flex gap-4 px-6 pt-4">
              <button
                onClick={() => setActiveTab("all")}
                className={`px-4 py-2 text-sm font-medium rounded-t-lg transition ${
                  activeTab === "all"
                    ? "bg-blue-50 text-blue-600 border-b-2 border-blue-600"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                {t("common.all")} ({tasks.length})
              </button>
              <button
                onClick={() => setActiveTab("in_progress")}
                className={`px-4 py-2 text-sm font-medium rounded-t-lg transition ${
                  activeTab === "in_progress"
                    ? "bg-blue-50 text-blue-600 border-b-2 border-blue-600"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                {t("tasks.statuses.in_progress")} (
                {tasks.filter((t) => t.status === "in_progress").length})
              </button>
              <button
                onClick={() => setActiveTab("completed")}
                className={`px-4 py-2 text-sm font-medium rounded-t-lg transition ${
                  activeTab === "completed"
                    ? "bg-blue-50 text-blue-600 border-b-2 border-blue-600"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                {t("tasks.statuses.completed")} (
                {tasks.filter((t) => t.status === "completed").length})
              </button>
              <button
                onClick={() => setActiveTab("overdue")}
                className={`px-4 py-2 text-sm font-medium rounded-t-lg transition ${
                  activeTab === "overdue"
                    ? "bg-blue-50 text-blue-600 border-b-2 border-blue-600"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                {t("tasks.overdue")} ({userData?.stats?.overdue_tasks || 0})
              </button>
            </div>
          </div>

          {/* Tasks Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">
                    {t("common.title")}
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">
                    {t("tasks.priority")}
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">
                    {t("tasks.status")}
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">
                    {t("tasks.workReport")}
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredTasks.length === 0 ? (
                  <tr>
                    <td
                      colSpan="5"
                      className="px-6 py-8 text-center text-gray-500"
                    >
                      {t("tasks.noTasks")}
                    </td>
                  </tr>
                ) : (
                  filteredTasks.map((task) => (
                    <tr key={task.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div>
                          <p className="font-medium text-gray-900">
                            {task.title}
                          </p>
                          {task.description && (
                            <p className="text-sm text-gray-500 line-clamp-1">
                              {task.description}
                            </p>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`px-2 py-1 text-xs font-medium rounded-full ${getPriorityColor(
                            task.priority
                          )}`}
                        >
                          {t(`tasks.priorities.${task.priority}`)}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(
                            task.status
                          )}`}
                        >
                          {t(`tasks.statuses.${task.status}`)}
                        </span>
                      </td>

                      <td className="px-6 py-4">
                        {task.work_report ? (
                          <span className="text-green-600 text-sm">
                            ✓ {t("common.yes")}
                          </span>
                        ) : (
                          <span className="text-gray-400 text-sm">-</span>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Work Reports Timeline */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            {t("tasks.workReports") || "Work Reports"}
          </h2>

          {reports.length === 0 ? (
            <p className="text-center text-gray-500 py-8">
              {t("tasks.noReports") || "No work reports yet"}
            </p>
          ) : (
            <div className="space-y-4">
              {reports.map((report) => (
                <div
                  key={report.id}
                  className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900">
                        {report.title}
                      </h3>
                    </div>
                    <div className="flex gap-2">
                      <span
                        className={`px-2 py-1 text-xs font-medium rounded-full ${getPriorityColor(
                          report.priority
                        )}`}
                      >
                        {t(`tasks.priorities.${report.priority}`)}
                      </span>
                      <span
                        className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(
                          report.status
                        )}`}
                      >
                        {t(`tasks.statuses.${report.status}`)}
                      </span>
                    </div>
                  </div>
                  <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-700 whitespace-pre-wrap">
                      {report.work_report}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  );
};

export default UserDetail;
