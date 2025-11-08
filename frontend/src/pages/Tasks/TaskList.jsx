// src/pages/Tasks/TaskList.jsx
// Task management page - List all tasks with filters

import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { tasksAPI, usersAPI } from "../../services/api";
import TaskModal from "../../components/TaskModal";
import WorkReportModal from "../../components/WorkReportModal";
import NotificationBell from "../../components/NotificationBell";
import { showSuccess, showError, showWarning } from "../../utils/toast";
import SkeletonTaskCard from "../../components/skeletons/SkeletonTaskCard";
import { FaBell } from "react-icons/fa";
import { useTranslation } from "react-i18next";
import { FaUsers, FaSignOutAlt, FaBars, FaTimes } from "react-icons/fa";
import { MdOutlineTaskAlt } from "react-icons/md";
import { RxDashboard } from "react-icons/rx";
import { TbLogout } from "react-icons/tb";
import { HiOutlineUsers } from "react-icons/hi2";
import { RiNotification3Line } from "react-icons/ri";
import { useNavigate } from "react-router-dom";
import { FiEdit } from "react-icons/fi";
import { FaEye } from "react-icons/fa";
import { RiDeleteBin6Fill } from "react-icons/ri";
import { MdAssignmentAdd } from "react-icons/md";
import LanguageSwitcher from "../../components/LanguageSwitcher";

const TaskList = () => {
  const { user, logout, isManager } = useAuth();
  const navigate = useNavigate();
  const [tasks, setTasks] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === "fa";
  const [filters, setFilters] = useState({
    status: "",
    priority: "",
    employeeId: "",
  });
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
  });

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [viewOnlyMode, setViewOnlyMode] = useState(false);

  // Work Report Modal states
  const [isWorkReportModalOpen, setIsWorkReportModalOpen] = useState(false);
  const [reportTask, setReportTask] = useState(null);

  // Fetch employees for filter (managers only)
  useEffect(() => {
    const fetchEmployees = async () => {
      if (isManager()) {
        try {
          const response = await usersAPI.getAll({
            role: "employee",
            limit: 100,
          });
          setEmployees(response.data.users);
        } catch (err) {
          console.error("Failed to fetch employees:", err);
        }
      }
    };
    fetchEmployees();
  }, []);

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };
  // Fetch tasks from API
  const fetchTasks = async () => {
    try {
      setLoading(true);
      setError("");

      const params = {
        page: pagination.currentPage,
        limit: 10,
        ...filters,
      };

      if (search) params.search = search;

      const response = await tasksAPI.getAll(params);

      setTasks(response.data.tasks);
      setPagination(response.data.pagination);
      setLoading(false);
    } catch (err) {
      setError(err.message || "Failed to fetch tasks");
      setLoading(false);
    }
  };

  // Load tasks on mount and when filters change
  useEffect(() => {
    fetchTasks();
  }, [pagination.currentPage, search, filters]);

  // Handle search input
  const handleSearchChange = (e) => {
    setSearch(e.target.value);
    setPagination({ ...pagination, currentPage: 1 });
  };

  // Handle filter change
  const handleFilterChange = (filterName, value) => {
    setFilters({ ...filters, [filterName]: value });
    setPagination({ ...pagination, currentPage: 1 });
  };

  // Handle delete task
  const handleDelete = async (taskId, title) => {
    if (!window.confirm(`Are you sure you want to delete task "${title}"?`)) {
      return;
    }

    try {
      await tasksAPI.delete(taskId);
      showSuccess("Task deleted successfully");
      fetchTasks();
    } catch (err) {
      showError("Failed to delete task");
    }
  };

  // Handle status change
  const handleStatusChange = async (taskId, newStatus) => {
    try {
      await tasksAPI.updateStatus(taskId, newStatus);
      showSuccess(`Task status updated to ${newStatus.replace("_", " ")}`);
      fetchTasks();
    } catch (err) {
      showError("Failed to update task status");
    }
  };

  // Handle page change
  const handlePageChange = (newPage) => {
    setPagination({ ...pagination, currentPage: newPage });
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

  // Format status text
  const formatStatus = (status) => {
    const statusText = {
      open: "Open",
      in_progress: "In Progress",
      completed: "Completed",
      cancelled: "Cancelled",
    };
    return statusText[status] || status;
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar - Fixed on desktop, slide-in on mobile */}
      <aside
        className={`fixed top-0 ${
          isRTL ? "right-0" : "left-0"
        } h-full bg-white shadow-lg z-50 transition-transform duration-300 ease-in-out w-full lg:w-[20%] flex flex-col ${
          sidebarOpen
            ? "translate-x-0"
            : isRTL
            ? "translate-x-full"
            : "-translate-x-full"
        } lg:translate-x-0`}
      >
        {/* Close button for mobile */}
        <div className="lg:hidden flex justify-end items-center p-6 relative">
          <div
            className={`flex container absolute lg:hidden ${
              isRTL
                ? "left-[50%] -translate-x-1/2"
                : "right-[50%] translate-x-1/2"
            } items-center justify-center py-1 -z-10`}
          >
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
              className="w-full flex items-center gap-3 px-4 py-3 text-gray-700 text-lg hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-colors"
            >
              <RxDashboard className="size-6 flex-shrink-0" />
              <span className="font-medium">{t("navigation.dashboard")}</span>
            </button>

            <button
              onClick={() => {
                navigate("/tasks");
                setSidebarOpen(false);
              }}
              className="w-full flex items-center gap-3 px-4 py-3 text-[#2b7fff] font-bold text-xl "
            >
              <MdOutlineTaskAlt className="size-6 flex-shrink-0" />
              <span className="font-medium">{t("navigation.tasks")}</span>
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
                <span className="font-medium">{t("navigation.users")}</span>
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
              <span className="font-medium">
                {t("navigation.notifications")}
              </span>
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
                <p className="text-xs text-gray-500 capitalize"></p>
                {t(`users.roles.${user?.role}`)}
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* Main content - with margin for fixed sidebar on desktop */}
      <div className={`flex-1 ${isRTL ? "lg:mr-[20%]" : "lg:ml-[20%]"}`}>
        {/* Header - Sticky (از داشبورد کپی شده) */}
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
                  {t("navigation.tasks")}
                </h1>
              </div>
              <div className="flex items-center gap-3">
                <LanguageSwitcher />
                <NotificationBell />
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main
          className={`flex-1 px-4 sm:px-6 lg:px-8 py-8 bg-[#FAFAFB] min-h-[calc(100vh-73px)]`}
        >
          {/* Filters and Actions */}
          <div className="bg-white rounded-lg shadow p-6 mb-6">
            {/* Search */}
            <div className="mb-6">
              <input
                type="text"
                placeholder={t("tasks.searchBy")}
                value={search}
                onChange={handleSearchChange}
                className="w-full px-4 py-2 border text-end border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Filters Row */}
            <div className="flex flex-col md:flex-row gap-4 justify-between items-baseline md:items-center">
              {/* Status Filter */}
              <div>
                <label className="block text-lg  font-medium text-gray-700 mb-1">
                  {t("tasks.status")} :
                </label>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleFilterChange("status", "")}
                    className={`px-3 py-2 rounded-lg text-sm transition ${
                      filters.status === ""
                        ? "bg-blue-600 text-white"
                        : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                    }`}
                  >
                    {t("tasks.filters.all")}
                  </button>
                  <button
                    onClick={() => handleFilterChange("status", "open")}
                    className={`px-3 py-2 rounded-lg text-sm transition ${
                      filters.status === "open"
                        ? "bg-blue-600 text-white"
                        : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                    }`}
                  >
                    {t("tasks.statuses.open")}
                  </button>
                  <button
                    onClick={() => handleFilterChange("status", "in_progress")}
                    className={`px-3 py-2 rounded-lg text-sm transition ${
                      filters.status === "in_progress"
                        ? "bg-blue-600 text-white"
                        : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                    }`}
                  >
                    {t("tasks.statuses.in_progress")}
                  </button>
                  <button
                    onClick={() => handleFilterChange("status", "completed")}
                    className={`px-3 py-2 rounded-lg text-sm transition ${
                      filters.status === "completed"
                        ? "bg-blue-600 text-white"
                        : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                    }`}
                  >
                    {t("tasks.statuses.completed")}
                  </button>
                </div>
              </div>

              {/* Priority Filter */}
              <div>
                <label className="block text-lg font-medium text-gray-700 mb-1">
                  {t("tasks.priority")} :
                </label>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleFilterChange("priority", "")}
                    className={`px-3 py-2 rounded-lg text-sm transition ${
                      filters.priority === ""
                        ? "bg-blue-600 text-white"
                        : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                    }`}
                  >
                    {t("tasks.filters.all")}
                  </button>
                  <button
                    onClick={() => handleFilterChange("priority", "urgent")}
                    className={`px-3 py-2 rounded-lg text-sm transition ${
                      filters.priority === "urgent"
                        ? "bg-blue-600 text-white"
                        : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                    }`}
                  >
                    {t("tasks.priorities.urgent")}
                  </button>
                  <button
                    onClick={() => handleFilterChange("priority", "high")}
                    className={`px-3 py-2 rounded-lg text-sm transition ${
                      filters.priority === "high"
                        ? "bg-blue-600 text-white"
                        : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                    }`}
                  >
                    {t("tasks.priorities.high")}
                  </button>
                  <button
                    onClick={() => handleFilterChange("priority", "medium")}
                    className={`px-3 py-2 rounded-lg text-sm transition ${
                      filters.priority === "medium"
                        ? "bg-blue-600 text-white"
                        : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                    }`}
                  >
                    {t("tasks.priorities.medium")}
                  </button>
                  <button
                    onClick={() => handleFilterChange("priority", "low")}
                    className={`px-3 py-2 rounded-lg text-sm transition ${
                      filters.priority === "low"
                        ? "bg-blue-600 text-white"
                        : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                    }`}
                  >
                    {t("tasks.priorities.low")}
                  </button>
                </div>
              </div>

              {/* Employee Filter (Manager only) */}
              {isManager() && (
                <div>
                  <label className="block text-lg font-medium text-gray-700 mb-1">
                    {t("tasks.employee")} :
                  </label>
                  <select
                    value={filters.employeeId}
                    onChange={(e) =>
                      handleFilterChange("employeeId", e.target.value)
                    }
                    className="px-3 py-1 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">All Employees</option>
                    {employees.map((emp) => (
                      <option key={emp.id} value={emp.id}>
                        {emp.full_name}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Create Button (Manager only) */}
              {isManager() && (
                <button
                  onClick={() => {
                    setEditingTask(null);
                    setViewOnlyMode(false);
                    setIsModalOpen(true);
                  }}
                  className="self-end bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg transition whitespace-nowrap"
                >
                  + {t("tasks.createTask")}
                </button>
              )}
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
              {error}
            </div>
          )}

          {/* Tasks Table */}
          <div className="bg-white rounded-lg shadow overflow-hidden">
            {loading ? (
              <div className="min-h-screen bg-gray-50">
                {/* Skeleton Filters */}
                <div className="p-6">
                  <div className="mb-6 flex flex-col md:flex-row gap-4">
                    <div className="flex-1 h-10 bg-gray-200 rounded-lg animate-pulse"></div>
                  </div>
                  <div className="flex flex-col md:flex-row gap-4">
                    <div className="w-full md:w-1/3 h-10 bg-gray-200 rounded-lg animate-pulse"></div>
                    <div className="w-full md:w-1/3 h-10 bg-gray-200 rounded-lg animate-pulse"></div>
                    <div className="w-full md:w-1/3 h-10 bg-gray-200 rounded-lg animate-pulse"></div>
                  </div>
                </div>

                {/* Skeleton Task Cards */}
                <div className="grid grid-cols-1 gap-6 p-6">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <SkeletonTaskCard key={i} />
                  ))}
                </div>
              </div>
            ) : tasks.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <p className="text-lg">No tasks found</p>
                <p className="text-sm mt-2">
                  Try adjusting your search or filters
                </p>
              </div>
            ) : (
              <>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3  text-xs font-medium text-gray-500 uppercase">
                          ID
                        </th>
                        <th className="px-4 py-3  text-xs font-medium text-gray-500 uppercase">
                          {t("tasks.title")}
                        </th>
                        <th className="px-4 py-3  text-xs font-medium text-gray-500 uppercase">
                          {t("tasks.device")}
                        </th>
                        <th className="px-4 py-3  text-xs font-medium text-gray-500 uppercase">
                          {t("tasks.employee")}
                        </th>
                        <th className="px-4 py-3  text-xs font-medium text-gray-500 uppercase">
                          {t("tasks.priority")}
                        </th>
                        <th className="px-4 py-3  text-xs font-medium text-gray-500 uppercase">
                          {t("tasks.status")}
                        </th>
                        <th className="px-4 py-3  text-xs font-medium text-gray-500 uppercase">
                          {t("tasks.deadline")}
                        </th>
                        <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                          {t("tasks.actions")}
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {tasks.map((task) => (
                        <tr key={task.id} className="hover:bg-gray-50">
                          <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                            {task.id}
                          </td>
                          <td className="px-4 py-3">
                            <div className="text-sm font-medium text-gray-900">
                              {task.title}
                            </div>
                            <div className="text-xs text-gray-500 truncate max-w-xs">
                              {task.description}
                            </div>
                          </td>
                          <td className="px-4 py-3">
                            <div className="text-sm text-gray-900">
                              {task.device_model}
                            </div>
                            <div className="text-xs text-gray-500">
                              {task.serial_number}
                            </div>
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                            {task.employee_name}
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap">
                            <span
                              className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getPriorityColor(
                                task.priority
                              )}`}
                            >
                              {task.priority}
                            </span>
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap">
                            <select
                              value={task.status}
                              onChange={(e) =>
                                handleStatusChange(task.id, e.target.value)
                              }
                              className={`text-xs font-semibold rounded-full px-3 py-2 ${getStatusColor(
                                task.status
                              )} border-0 focus:ring-2 focus:ring-blue-500`}
                              disabled={
                                !isManager() && task.employee_id !== user?.id
                              }
                            >
                              <option value="open">Open</option>
                              <option value="in_progress">In Progress</option>
                              <option value="completed">Completed</option>
                              <option value="cancelled">Cancelled</option>
                            </select>
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                            {task.deadline
                              ? new Date(task.deadline).toLocaleDateString()
                              : "N/A"}
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-right text-sm font-medium">
                            <button
                              onClick={() => {
                                setEditingTask(task);
                                setViewOnlyMode(!isManager());
                                setIsModalOpen(true);
                              }}
                              className="text-blue-600 hover:text-blue-900 me-3"
                            >
                              {isManager() ? (
                                <FiEdit className="size-6" />
                              ) : (
                                <FaEye className="size-6" />
                              )}
                            </button>

                            {isManager() && (
                              <button
                                onClick={() =>
                                  handleDelete(task.id, task.title)
                                }
                                className="text-red-600 hover:text-red-900"
                              >
                                <RiDeleteBin6Fill className="size-6" />
                              </button>
                            )}
                            {/* Add Report Button */}
                            {(isManager() || task.employee_id === user?.id) &&
                              task.status !== "cancelled" && (
                                <button
                                  onClick={() => {
                                    setReportTask(task);
                                    setIsWorkReportModalOpen(true);
                                  }}
                                  className=" hover:text-green-900 me-3 min-w-48 ms-3"
                                  title="Add Work Report"
                                >
                                  {task.work_report ? (
                                    <div className="flex justify-center items-center gap-1 border rounded-lg px-2 py-1">
                                      <FaEye className="size-6 text-purple-700" />
                                      <span>{t("tasks.viewReport")}</span>
                                    </div>
                                  ) : (
                                    <div className="flex justify-center items-center gap-1 border rounded-lg px-2 py-1">
                                      <MdAssignmentAdd className="size-6 text-green-600" />
                                      <span>{t("tasks.addReport")}</span>
                                    </div>
                                  )}
                                </button>
                              )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Pagination */}
                {pagination.totalPages > 1 && (
                  <div className="bg-white px-4 py-3 border-t border-gray-200 sm:px-6">
                    <div className="flex items-center justify-between">
                      <div className="text-sm text-gray-700">
                        Showing page <strong>{pagination.currentPage}</strong>{" "}
                        of <strong>{pagination.totalPages}</strong> (
                        <strong>{pagination.totalItems}</strong> total tasks)
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() =>
                            handlePageChange(pagination.currentPage - 1)
                          }
                          disabled={pagination.currentPage === 1}
                          className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                        >
                          {t("common.previous")}
                        </button>
                        <button
                          onClick={() =>
                            handlePageChange(pagination.currentPage + 1)
                          }
                          disabled={
                            pagination.currentPage === pagination.totalPages
                          }
                          className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                        >
                          {t("common.next")}
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </main>
      </div>
      {/* Task Modal */}
      <TaskModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingTask(null);
          setViewOnlyMode(false);
        }}
        onSuccess={() => {
          fetchTasks();
        }}
        editTask={editingTask}
        viewOnly={viewOnlyMode}
      />

      {/* Work Report Modal */}
      <WorkReportModal
        isOpen={isWorkReportModalOpen}
        onClose={() => {
          setIsWorkReportModalOpen(false);
          setReportTask(null);
        }}
        onSuccess={() => {
          fetchTasks();
        }}
        task={reportTask}
      />
    </div>
  );
};

export default TaskList;
