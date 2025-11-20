// src/pages/Tasks/TaskList.jsx
import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { tasksAPI, usersAPI } from "../../services/api";
import TaskModal from "../../components/TaskModal";
import WorkReportModal from "../../components/WorkReportModal";
import AppLayout from "../../components/Layout/AppLayout";
import DateFilter from "../../components/DateFilter";
import { showSuccess, showError } from "../../utils/toast";
import { formatDate } from "../../utils/dateHelper";
import { useTranslation } from "react-i18next";
import { FiEdit } from "react-icons/fi";
import { FaEye } from "react-icons/fa";
import { RiDeleteBin6Fill } from "react-icons/ri";
import { MdAssignmentAdd } from "react-icons/md";
import { LuSearch } from "react-icons/lu";
import { useDebounce } from "../../../hooks/useDebounce";
import SkeletonTaskLists from "../../components/skeletons/SkeletonTaskLists";

const TaskList = () => {
  const { user, isManager } = useAuth();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === "fa";
  const [tasks, setTasks] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 1000);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [filters, setFilters] = useState({
    status: "",
    priority: "",
    employeeId: "",
    startDate: "",
    endDate: "",
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
    const fetchAssignableUsers = async () => {
      if (isManager()) {
        try {
          const response = await usersAPI.getAssignable();
          setEmployees(response.data);
        } catch (err) {
          console.error("Failed to fetch assignable users:", err);
        }
      }
    };
    fetchAssignableUsers();
  }, [isManager]);

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
  }, [pagination.currentPage, debouncedSearch, filters]);

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

  // Handle date filter change
  const handleDateFilterChange = (startDate, endDate) => {
    setFilters({
      ...filters,
      startDate,
      endDate,
    });
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

  // Loading state
  if (loading) {
    return (
      <AppLayout
        title={t("navigation.tasks")}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
      >
        <SkeletonTaskLists />
      </AppLayout>
    );
  }

  return (
    <AppLayout
      title={t("navigation.tasks")}
      sidebarOpen={sidebarOpen}
      setSidebarOpen={setSidebarOpen}
    >
      {/* Filters and Actions */}
      <div className="bg-white rounded-lg shadow p-4 sm:p-6 mb-6">
        {/* Search */}
        <div className="mb-6 relative">
          <LuSearch className="size-5 sm:size-7 absolute top-1/2 ms-2 -translate-y-1/2 text-gray-300" />
          <input
            type="text"
            placeholder={t("tasks.searchBy")}
            value={search}
            onChange={handleSearchChange}
            className={`w-full px-4 py-2 sm:py-3 ps-8 sm:ps-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base ${
              isRTL ? "text-right" : "text-left"
            }`}
          />
        </div>

        {/* Filters Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4 gap-y-6 items-center">
          {/* Status Filter */}
          <div className="sm:col-span-2 lg:col-span-2">
            <label className="block text-sm sm:text-lg font-medium text-gray-700 mb-1 sm:mb-2">
              {t("tasks.status")} :
            </label>
            <div className="flex flex-wrap gap-1 sm:gap-2">
              <button
                onClick={() => handleFilterChange("status", "")}
                className={`px-2 sm:px-3 py-1 sm:py-2 rounded-lg text-xs sm:text-sm transition ${
                  filters.status === ""
                    ? "bg-blue-600 text-white"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
              >
                {t("tasks.filters.all")}
              </button>
              <button
                onClick={() => handleFilterChange("status", "open")}
                className={`px-2 sm:px-3 py-1 sm:py-2 rounded-lg text-xs sm:text-sm transition ${
                  filters.status === "open"
                    ? "bg-blue-600 text-white"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
              >
                {t("tasks.statuses.open")}
              </button>
              <button
                onClick={() => handleFilterChange("status", "in_progress")}
                className={`px-2 sm:px-3 py-1 sm:py-2 rounded-lg text-xs sm:text-sm transition ${
                  filters.status === "in_progress"
                    ? "bg-blue-600 text-white"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
              >
                {t("tasks.statuses.in_progress")}
              </button>
              <button
                onClick={() => handleFilterChange("status", "completed")}
                className={`px-2 sm:px-3 py-1 sm:py-2 rounded-lg text-xs sm:text-sm transition ${
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
          <div className="sm:col-span-2 lg:col-span-2">
            <label className="block text-sm sm:text-lg font-medium text-gray-700 mb-1 sm:mb-2">
              {t("tasks.priority")} :
            </label>
            <div className="flex flex-wrap gap-1 sm:gap-2">
              <button
                onClick={() => handleFilterChange("priority", "")}
                className={`px-2 sm:px-3 py-1 sm:py-2 rounded-lg text-xs sm:text-sm transition ${
                  filters.priority === ""
                    ? "bg-blue-600 text-white"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
              >
                {t("tasks.filters.all")}
              </button>
              <button
                onClick={() => handleFilterChange("priority", "urgent")}
                className={`px-2 sm:px-3 py-1 sm:py-2 rounded-lg text-xs sm:text-sm transition ${
                  filters.priority === "urgent"
                    ? "bg-blue-600 text-white"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
              >
                {t("tasks.priorities.urgent")}
              </button>
              <button
                onClick={() => handleFilterChange("priority", "high")}
                className={`px-2 sm:px-3 py-1 sm:py-2 rounded-lg text-xs sm:text-sm transition ${
                  filters.priority === "high"
                    ? "bg-blue-600 text-white"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
              >
                {t("tasks.priorities.high")}
              </button>
              <button
                onClick={() => handleFilterChange("priority", "medium")}
                className={`px-2 sm:px-3 py-1 sm:py-2 rounded-lg text-xs sm:text-sm transition ${
                  filters.priority === "medium"
                    ? "bg-blue-600 text-white"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
              >
                {t("tasks.priorities.medium")}
              </button>
              <button
                onClick={() => handleFilterChange("priority", "low")}
                className={`px-2 sm:px-3 py-1 sm:py-2 rounded-lg text-xs sm:text-sm transition ${
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
            <div className="sm:col-span-2 lg:col-span-2">
              <label className="block text-sm sm:text-lg font-medium text-gray-700 mb-1 sm:mb-2">
                {t("tasks.filters.allUsers")} :
              </label>
              <select
                value={filters.employeeId}
                onChange={(e) =>
                  handleFilterChange("employeeId", e.target.value)
                }
                className="px-3 sm:px-4 py-2 w-full border border-gray-300 rounded-lg text-xs sm:text-sm focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Employees</option>
                {employees.map((emp) => (
                  <option key={emp.id} value={emp.id}>
                    {emp.full_name} {emp.role === "manager" ? "(Manager)" : ""}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Date Filter */}
          <div className="sm:col-span-3 lg:col-span-3">
            <DateFilter
              onFilterChange={handleDateFilterChange}
              startDate={filters.startDate}
              endDate={filters.endDate}
            />
          </div>

          {/* Create Button (Manager only) */}
          {isManager() && (
            <div className="sm:col-span-3 lg:col-span-3 flex items-center justify-start sm:justify-end">
              <button
                onClick={() => {
                  setEditingTask(null);
                  setViewOnlyMode(false);
                  setIsModalOpen(true);
                }}
                className="w-full sm:w-auto bg-green-600 hover:bg-green-700 text-white px-4 sm:px-6 py-2 sm:py-2 rounded-lg transition whitespace-nowrap text-sm sm:text-base"
              >
                + {t("tasks.createTask")}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6 text-sm sm:text-base">
          {error}
        </div>
      )}

      {/* Tasks Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        {tasks.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <p className="text-base sm:text-lg">No tasks found</p>
            <p className="text-xs sm:text-sm mt-2">
              Try adjusting your search or filters
            </p>
          </div>
        ) : (
          <>
            {/* Desktop Table */}
            <div className="hidden lg:block overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3  font-medium text-gray-500 uppercase">
                      ID
                    </th>
                    <th className="px-4 py-3  font-medium text-gray-500 uppercase">
                      {t("tasks.title")}
                    </th>
                    <th className="px-4 py-3  font-medium text-gray-500 uppercase">
                      {t("tasks.device")}
                    </th>
                    <th className="px-4 py-3  font-medium text-gray-500 uppercase">
                      {t("tasks.employee")}
                    </th>
                    <th className="px-4 py-3  font-medium text-gray-500 uppercase">
                      {t("tasks.priority")}
                    </th>
                    <th className="px-4 py-3  font-medium text-gray-500 uppercase">
                      {t("tasks.status")}
                    </th>
                    <th className="px-4 py-3  font-medium text-gray-500 uppercase">
                      {t("tasks.deadline")}
                    </th>
                    <th className="px-4 py-3  text-center font-medium text-gray-500 uppercase">
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
                          className={`px-3 py-2 inline-flex text-xs  font-semibold rounded-full ${getPriorityColor(
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
                          ? formatDate(task.deadline, i18n.language)
                          : "N/A"}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-right  font-medium">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => {
                              setEditingTask(task);
                              setViewOnlyMode(!isManager());
                              setIsModalOpen(true);
                            }}
                            className="text-blue-600 hover:text-blue-900"
                            title={
                              isManager() ? t("common.edit") : t("common.view")
                            }
                          >
                            {isManager() ? (
                              <FiEdit className="size-5" />
                            ) : (
                              <FaEye className="size-5" />
                            )}
                          </button>

                          {isManager() && (
                            <button
                              onClick={() => handleDelete(task.id, task.title)}
                              className="text-red-600 hover:text-red-900"
                              title={t("common.delete")}
                            >
                              <RiDeleteBin6Fill className="size-5" />
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
                                className="text-green-600 hover:text-green-900 flex items-center gap-1 border px-4 py-2 rounded-md"
                                title={
                                  task.work_report
                                    ? t("tasks.viewReport")
                                    : t("tasks.addReport")
                                }
                              >
                                {task.work_report ? (
                                  <>
                                    <FaEye className="size-4" />
                                    <span className="hidden sm:inline">
                                      {t("tasks.viewReport")}
                                    </span>
                                  </>
                                ) : (
                                  <>
                                    <MdAssignmentAdd className="size-4" />
                                    <span className="hidden sm:inline">
                                      {t("tasks.addReport")}
                                    </span>
                                  </>
                                )}
                              </button>
                            )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Cards */}
            <div className="lg:hidden space-y-4 p-4">
              {tasks.map((task) => (
                <div
                  key={task.id}
                  className="border border-gray-200 rounded-lg p-4 bg-white shadow-sm"
                >
                  {/* Header */}
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="font-semibold text-gray-900 text-sm sm:text-base">
                        {task.title}
                      </h3>
                      <p className="text-xs text-gray-500 mt-1">
                        ID: {task.id}
                      </p>
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      <span
                        className={`px-2 py-1 inline-flex text-xs  font-semibold rounded-full ${getPriorityColor(
                          task.priority
                        )}`}
                      >
                        {task.priority}
                      </span>
                      <select
                        value={task.status}
                        onChange={(e) =>
                          handleStatusChange(task.id, e.target.value)
                        }
                        className={`text-xs font-semibold rounded-full px-2 py-1 ${getStatusColor(
                          task.status
                        )} border-0 focus:ring-1 focus:ring-blue-500`}
                        disabled={!isManager() && task.employee_id !== user?.id}
                      >
                        <option value="open">Open</option>
                        <option value="in_progress">In Progress</option>
                        <option value="completed">Completed</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </div>
                  </div>

                  {/* Details */}
                  <div className="grid grid-cols-2 gap-3 text-xs sm:text-sm mb-3">
                    <div>
                      <span className="text-gray-600">
                        {t("tasks.employee")}:
                      </span>
                      <p className="font-medium">{task.employee_name}</p>
                    </div>
                    <div>
                      <span className="text-gray-600">
                        {t("tasks.deadline")}:
                      </span>
                      <p className="font-medium">
                        {task.deadline
                          ? formatDate(task.deadline, i18n.language)
                          : "N/A"}
                      </p>
                    </div>
                    {task.device_model && (
                      <div className="col-span-2">
                        <span className="text-gray-600">
                          {t("tasks.device")}:
                        </span>
                        <p className="font-medium">{task.device_model}</p>
                        {task.serial_number && (
                          <p className="text-xs text-gray-500">
                            SN: {task.serial_number}
                          </p>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Description */}
                  {task.description && (
                    <div className="mb-3">
                      <p className="text-xs text-gray-600 line-clamp-2">
                        {task.description}
                      </p>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex justify-between items-center pt-3 border-t border-gray-100">
                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          setEditingTask(task);
                          setViewOnlyMode(!isManager());
                          setIsModalOpen(true);
                        }}
                        className="text-blue-600 hover:text-blue-800"
                        title={
                          isManager() ? t("common.edit") : t("common.view")
                        }
                      >
                        {isManager() ? (
                          <FiEdit className="size-4 sm:size-5" />
                        ) : (
                          <FaEye className="size-4 sm:size-5" />
                        )}
                      </button>

                      {isManager() && (
                        <button
                          onClick={() => handleDelete(task.id, task.title)}
                          className="text-red-600 hover:text-red-800"
                          title={t("common.delete")}
                        >
                          <RiDeleteBin6Fill className="size-4 sm:size-5" />
                        </button>
                      )}
                    </div>

                    {/* Report Button */}
                    {(isManager() || task.employee_id === user?.id) &&
                      task.status !== "cancelled" && (
                        <button
                          onClick={() => {
                            setReportTask(task);
                            setIsWorkReportModalOpen(true);
                          }}
                          className="text-green-600 hover:text-green-800 flex items-center gap-1 text-xs"
                        >
                          {task.work_report ? (
                            <>
                              <FaEye className="size-3 sm:size-4" />
                              <span>{t("tasks.viewReport")}</span>
                            </>
                          ) : (
                            <>
                              <MdAssignmentAdd className="size-3 sm:size-4" />
                              <span>{t("tasks.addReport")}</span>
                            </>
                          )}
                        </button>
                      )}
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <div className="bg-white px-4 py-3 border-t border-gray-200">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="text-xs sm:text-sm text-gray-700 text-center sm:text-left">
                Showing page <strong>{pagination.currentPage}</strong> of{" "}
                <strong>{pagination.totalPages}</strong> (
                <strong>{pagination.totalItems}</strong> total tasks)
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handlePageChange(pagination.currentPage - 1)}
                  disabled={pagination.currentPage === 1}
                  className="px-3 sm:px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 text-xs sm:text-sm"
                >
                  {t("common.previous")}
                </button>
                <button
                  onClick={() => handlePageChange(pagination.currentPage + 1)}
                  disabled={pagination.currentPage === pagination.totalPages}
                  className="px-3 sm:px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 text-xs sm:text-sm"
                >
                  {t("common.next")}
                </button>
              </div>
            </div>
          </div>
        )}
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
    </AppLayout>
  );
};

export default TaskList;
