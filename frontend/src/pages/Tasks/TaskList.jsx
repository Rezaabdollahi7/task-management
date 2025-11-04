// src/pages/Tasks/TaskList.jsx
// Task management page - List all tasks with filters

import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { tasksAPI, usersAPI } from "../../services/api";
import TaskModal from "../../components/TaskModal";
import WorkReportModal from "../../components/WorkReportModal";
import NotificationBell from "../../components/NotificationBell";

const TaskList = () => {
  const { user, logout, isManager } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
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
      fetchTasks();
    } catch (err) {
      alert(err.message || "Failed to delete task");
    }
  };

  // Handle status change
  const handleStatusChange = async (taskId, newStatus) => {
    try {
      await tasksAPI.updateStatus(taskId, newStatus);
      fetchTasks();
    } catch (err) {
      alert(err.message || "Failed to update status");
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
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Zero Task</h1>
              <p className="text-sm text-gray-600 mt-1">
                Logged in as: <strong>{user?.fullName}</strong> ({user?.role})
              </p>
            </div>
            <div className="flex items-center gap-3">
              <NotificationBell />

              {isManager() && (
                <button
                  onClick={() => (window.location.href = "/users")}
                  className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition"
                >
                  Users
                </button>
              )}
              <button
                onClick={() => (window.location.href = "/dashboard")}
                className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg transition"
              >
                Dashboard
              </button>
              <button
                onClick={logout}
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
        {/* Filters and Actions */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          {/* Search */}
          <div className="mb-4">
            <input
              type="text"
              placeholder="Search by title, description, device model, or serial number..."
              value={search}
              onChange={handleSearchChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Filters Row */}
          <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
            {/* Status Filter */}
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Status:
              </label>
              <div className="flex gap-2">
                <button
                  onClick={() => handleFilterChange("status", "")}
                  className={`px-3 py-1 rounded-lg text-sm transition ${
                    filters.status === ""
                      ? "bg-blue-600 text-white"
                      : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                  }`}
                >
                  All
                </button>
                <button
                  onClick={() => handleFilterChange("status", "open")}
                  className={`px-3 py-1 rounded-lg text-sm transition ${
                    filters.status === "open"
                      ? "bg-blue-600 text-white"
                      : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                  }`}
                >
                  Open
                </button>
                <button
                  onClick={() => handleFilterChange("status", "in_progress")}
                  className={`px-3 py-1 rounded-lg text-sm transition ${
                    filters.status === "in_progress"
                      ? "bg-blue-600 text-white"
                      : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                  }`}
                >
                  In Progress
                </button>
                <button
                  onClick={() => handleFilterChange("status", "completed")}
                  className={`px-3 py-1 rounded-lg text-sm transition ${
                    filters.status === "completed"
                      ? "bg-blue-600 text-white"
                      : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                  }`}
                >
                  Completed
                </button>
              </div>
            </div>

            {/* Priority Filter */}
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Priority:
              </label>
              <div className="flex gap-2">
                <button
                  onClick={() => handleFilterChange("priority", "")}
                  className={`px-3 py-1 rounded-lg text-sm transition ${
                    filters.priority === ""
                      ? "bg-blue-600 text-white"
                      : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                  }`}
                >
                  All
                </button>
                <button
                  onClick={() => handleFilterChange("priority", "urgent")}
                  className={`px-3 py-1 rounded-lg text-sm transition ${
                    filters.priority === "urgent"
                      ? "bg-blue-600 text-white"
                      : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                  }`}
                >
                  Urgent
                </button>
                <button
                  onClick={() => handleFilterChange("priority", "high")}
                  className={`px-3 py-1 rounded-lg text-sm transition ${
                    filters.priority === "high"
                      ? "bg-blue-600 text-white"
                      : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                  }`}
                >
                  High
                </button>
                <button
                  onClick={() => handleFilterChange("priority", "medium")}
                  className={`px-3 py-1 rounded-lg text-sm transition ${
                    filters.priority === "medium"
                      ? "bg-blue-600 text-white"
                      : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                  }`}
                >
                  Medium
                </button>
              </div>
            </div>

            {/* Employee Filter (Manager only) */}
            {isManager() && (
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Employee:
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
                className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg transition whitespace-nowrap"
              >
                + Create Task
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
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
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
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        ID
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Title
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Device
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Employee
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Priority
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Status
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Deadline
                      </th>
                      <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                        Actions
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
                            className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getPriorityColor(
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
                            className={`text-xs font-semibold rounded-full px-2 py-1 ${getStatusColor(
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
                            className="text-blue-600 hover:text-blue-900 mr-3"
                          >
                            {isManager() ? "Edit" : "View"}
                          </button>

                          {/* Add Report Button */}
                          {(isManager() || task.employee_id === user?.id) &&
                            task.status !== "cancelled" && (
                              <button
                                onClick={() => {
                                  setReportTask(task);
                                  setIsWorkReportModalOpen(true);
                                }}
                                className="text-green-600 hover:text-green-900 mr-3"
                                title="Add Work Report"
                              >
                                {task.work_report ? "📋" : "📝"}
                              </button>
                            )}

                          {isManager() && (
                            <button
                              onClick={() => handleDelete(task.id, task.title)}
                              className="text-red-600 hover:text-red-900"
                            >
                              Delete
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
                      Showing page <strong>{pagination.currentPage}</strong> of{" "}
                      <strong>{pagination.totalPages}</strong> (
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
                        Previous
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
                        Next
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </main>
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
