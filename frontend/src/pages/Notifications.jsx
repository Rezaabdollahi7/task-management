// src/pages/Notifications.jsx
// Notification history page

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { notificationsAPI } from "../services/api";
import { showSuccess, showError } from "../utils/toast";
import SkeletonNotification from "../components/skeletons/SkeletonNotification";
import {
  FaBars,
  FaTimes,
  FaUsers,
  FaSignOutAlt,
  FaTrash,
  FaCheckDouble,
  FaBell,
  FaBellSlash,
} from "react-icons/fa";
import { MdSpaceDashboard } from "react-icons/md";
import { SiGoogletasks } from "react-icons/si";

const Notifications = () => {
  const { user, logout, isManager } = useAuth();
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all"); // all, unread, read
  const [typeFilter, setTypeFilter] = useState("all");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const params = {};
      if (filter === "unread") {
        params.unreadOnly = true;
      }
      const response = await notificationsAPI.getAll(params);
      let data = response.data;

      // Filter read notifications if needed
      if (filter === "read") {
        data = data.filter((n) => n.is_read);
      }

      // Filter by type
      if (typeFilter !== "all") {
        data = data.filter((n) => n.type === typeFilter);
      }

      setNotifications(data);
      setLoading(false);
    } catch (error) {
      console.error("Failed to fetch notifications:", error);
      showError("Failed to load notifications");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, [filter, typeFilter]);

  // Mark as read
  const handleMarkAsRead = async (notificationId) => {
    try {
      await notificationsAPI.markAsRead(notificationId);
      fetchNotifications();
    } catch (error) {
      console.error("Failed to mark as read:", error);
      showError("Failed to mark as read");
    }
  };

  // Mark all as read
  const handleMarkAllAsRead = async () => {
    try {
      await notificationsAPI.markAllAsRead();
      showSuccess("All notifications marked as read");
      fetchNotifications();
    } catch (error) {
      console.error("Failed to mark all as read:", error);
      showError("Failed to mark all as read");
    }
  };

  // Delete notification
  const handleDelete = async (notificationId) => {
    if (!window.confirm("Are you sure you want to delete this notification?")) {
      return;
    }

    try {
      await notificationsAPI.delete(notificationId);
      showSuccess("Notification deleted");
      fetchNotifications();
    } catch (error) {
      console.error("Failed to delete notification:", error);
      showError("Failed to delete notification");
    }
  };

  // Delete all notifications
  const handleDeleteAll = async () => {
    if (
      !window.confirm(
        "Are you sure you want to delete ALL notifications? This action cannot be undone."
      )
    ) {
      return;
    }

    try {
      const response = await notificationsAPI.deleteAll();
      showSuccess(response.message || "All notifications deleted");
      fetchNotifications();
    } catch (error) {
      console.error("Failed to delete all notifications:", error);
      showError("Failed to delete all notifications");
    }
  };
  // Get time ago
  const getTimeAgo = (date) => {
    const seconds = Math.floor((new Date() - new Date(date)) / 1000);

    if (seconds < 60) return "همین الان";
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes} دقیقه پیش`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours} ساعت پیش`;
    const days = Math.floor(hours / 24);
    if (days < 7) return `${days} روز پیش`;
    const weeks = Math.floor(days / 7);
    if (weeks < 4) return `${weeks} هفته پیش`;
    return new Date(date).toLocaleDateString("fa-IR");
  };

  // Get priority color
  const getPriorityColor = (priority) => {
    const colors = {
      urgent: "text-red-600",
      high: "text-orange-600",
      normal: "text-blue-600",
      low: "text-gray-600",
    };
    return colors[priority] || "text-gray-600";
  };

  // Get notification icon
  const getNotificationIcon = (type) => {
    switch (type) {
      case "task_assigned":
      case "task_reassigned":
        return (
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
            <path
              fillRule="evenodd"
              d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z"
              clipRule="evenodd"
            />
          </svg>
        );
      case "task_completed":
        return (
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
              clipRule="evenodd"
            />
          </svg>
        );
      case "deadline_approaching":
        return (
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
              clipRule="evenodd"
            />
          </svg>
        );
      case "task_overdue":
        return (
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
              clipRule="evenodd"
            />
          </svg>
        );
      case "status_changed":
        return (
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z"
              clipRule="evenodd"
            />
          </svg>
        );
      case "work_report_added":
        return (
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M18 13V5a2 2 0 00-2-2H4a2 2 0 00-2 2v8a2 2 0 002 2h3l3 3 3-3h3a2 2 0 002-2zM5 7a1 1 0 011-1h8a1 1 0 110 2H6a1 1 0 01-1-1zm1 3a1 1 0 100 2h3a1 1 0 100-2H6z"
              clipRule="evenodd"
            />
          </svg>
        );
      default:
        return (
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z" />
          </svg>
        );
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  // Count by filter
  const unreadCount = notifications.filter((n) => !n.is_read).length;
  const readCount = notifications.filter((n) => n.is_read).length;

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside
        className={`fixed top-0 right-0 h-full bg-white shadow-lg z-50 transition-transform duration-300 ease-in-out w-64 flex flex-col ${
          sidebarOpen ? "translate-x-0" : "translate-x-full"
        } lg:translate-x-0`}
      >
        {/* Close button for mobile */}
        <div className="lg:hidden flex justify-end p-4">
          <button
            onClick={() => setSidebarOpen(false)}
            className="text-gray-500 hover:text-gray-700"
          >
            <FaTimes className="w-6 h-6" />
          </button>
        </div>

        {/* User info */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
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

        {/* Navigation */}
        <nav className="flex-1 p-4 overflow-y-auto">
          <div className="space-y-2">
            <button
              onClick={() => {
                navigate("/dashboard");
                setSidebarOpen(false);
              }}
              className="w-full flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-green-50 hover:text-green-600 rounded-lg transition-colors"
            >
              <MdSpaceDashboard className="w-5 h-5 flex-shrink-0" />
              <span className="font-medium">Dashboard</span>
            </button>

            <button
              onClick={() => {
                navigate("/tasks");
                setSidebarOpen(false);
              }}
              className="w-full flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-colors"
            >
              <SiGoogletasks className="w-5 h-5 flex-shrink-0" />
              <span className="font-medium">Tasks</span>
            </button>

            {isManager() && (
              <button
                onClick={() => {
                  navigate("/users");
                  setSidebarOpen(false);
                }}
                className="w-full flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-purple-50 hover:text-purple-600 rounded-lg transition-colors"
              >
                <FaUsers className="w-5 h-5 flex-shrink-0" />
                <span className="font-medium">Users</span>
              </button>
            )}

            <button
              onClick={() => {
                navigate("/notifications");
                setSidebarOpen(false);
              }}
              className="w-full flex items-center gap-3 px-4 py-3 text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
            >
              <FaBell className="w-5 h-5 flex-shrink-0" />
              <span className="font-medium">Notifications</span>
            </button>
          </div>
        </nav>

        {/* Logout button at bottom */}
        <div className="p-4 border-t border-gray-200">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-red-50 hover:text-red-600 rounded-lg transition-colors"
          >
            <FaSignOutAlt className="w-5 h-5 flex-shrink-0" />
            <span className="font-medium">Logout</span>
          </button>
        </div>
      </aside>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}

      {/* Main content */}
      <div className="flex-1 lg:mr-64">
        {/* Header */}
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
                  Notifications
                </h1>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="px-4 sm:px-6 lg:px-8 py-6 sm:py-8 bg-[#FAFAFB] min-h-[calc(100vh-73px)]">
          {/* Filters and Actions */}
          <div className="bg-white rounded-lg shadow mb-6">
            <div className="p-4 border-b border-gray-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              {/* Filter Tabs */}
              <div className="flex gap-2 flex-wrap">
                <button
                  onClick={() => setFilter("all")}
                  className={`px-4 py-2 rounded-lg font-medium transition ${
                    filter === "all"
                      ? "bg-blue-600 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  All ({notifications.length})
                </button>
                <button
                  onClick={() => setFilter("unread")}
                  className={`px-4 py-2 rounded-lg font-medium transition ${
                    filter === "unread"
                      ? "bg-blue-600 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  Unread ({unreadCount})
                </button>
                <button
                  onClick={() => setFilter("read")}
                  className={`px-4 py-2 rounded-lg font-medium transition ${
                    filter === "read"
                      ? "bg-blue-600 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  Read ({readCount})
                </button>
                <select
                  value={typeFilter}
                  onChange={(e) => setTypeFilter(e.target.value)}
                  className="px-4 py-2 rounded-lg border border-gray-300 bg-white text-gray-700 hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                >
                  <option value="all">All Types</option>
                  <option value="task_assigned">Task Assigned</option>
                  <option value="task_completed">Task Completed</option>
                  {/* <option value="task_reassigned">Task Reassigned</option> */}
                  <option value="deadline_approaching">
                    Deadline Approaching
                  </option>
                  <option value="task_overdue">Task Overdue</option>
                  {/* <option value="status_changed">Status Changed</option> */}
                  <option value="work_report_added">Work Report Added</option>
                </select>
              </div>

              {/* Actions */}
              <div className="flex gap-2">
                {unreadCount > 0 && (
                  <button
                    onClick={handleMarkAllAsRead}
                    className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
                  >
                    <FaCheckDouble className="w-4 h-4" />
                    <span className="hidden sm:inline">Mark All Read</span>
                  </button>
                )}
                {notifications.length > 0 && (
                  <button
                    onClick={handleDeleteAll}
                    className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
                  >
                    <FaTrash className="w-4 h-4" />
                    <span className="hidden sm:inline">Delete All</span>
                  </button>
                )}
              </div>
            </div>

            {/* Notifications List */}
            <div className="divide-y divide-gray-200">
              {loading ? (
                // Skeleton Loading
                Array.from({ length: 8 }).map((_, i) => (
                  <SkeletonNotification key={i} />
                ))
              ) : notifications.length === 0 ? (
                // Empty State
                <div className="text-center py-16 text-gray-500">
                  {filter === "all" ? (
                    <>
                      <FaBellSlash className="mx-auto h-16 w-16 text-gray-400 mb-4" />
                      <p className="text-lg font-medium">No notifications</p>
                      <p className="text-sm mt-2">
                        You don't have any notifications yet
                      </p>
                    </>
                  ) : filter === "unread" ? (
                    <>
                      <FaCheckDouble className="mx-auto h-16 w-16 text-gray-400 mb-4" />
                      <p className="text-lg font-medium">All caught up!</p>
                      <p className="text-sm mt-2">
                        You have no unread notifications
                      </p>
                    </>
                  ) : (
                    <>
                      <FaBellSlash className="mx-auto h-16 w-16 text-gray-400 mb-4" />
                      <p className="text-lg font-medium">
                        No read notifications
                      </p>
                      <p className="text-sm mt-2">
                        You haven't read any notifications yet
                      </p>
                    </>
                  )}
                </div>
              ) : (
                // Notification Items
                notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`p-4 hover:bg-gray-50 transition ${
                      !notification.is_read ? "bg-blue-50" : ""
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      {/* Icon */}
                      <div
                        className={`mt-1 flex-shrink-0 ${getPriorityColor(
                          notification.priority
                        )}`}
                      >
                        {getNotificationIcon(notification.type)}
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2 mb-1">
                          <p className="text-sm font-medium text-gray-900">
                            {notification.title}
                          </p>
                          {!notification.is_read && (
                            <span className="w-2 h-2 bg-blue-600 rounded-full flex-shrink-0 mt-1"></span>
                          )}
                        </div>
                        <p className="text-sm text-gray-600 mb-2">
                          {notification.message}
                        </p>
                        {notification.task_title && (
                          <p className="text-xs text-gray-500 mb-2">
                            Task: {notification.task_title}
                          </p>
                        )}
                        <div className="flex items-center justify-between">
                          <p className="text-xs text-gray-400">
                            {getTimeAgo(notification.created_at)}
                          </p>
                          <div className="flex gap-2">
                            {!notification.is_read && (
                              <button
                                onClick={() =>
                                  handleMarkAsRead(notification.id)
                                }
                                className="text-xs text-blue-600 hover:text-blue-800 font-medium"
                              >
                                Mark as read
                              </button>
                            )}
                            {notification.task_id && (
                              <button
                                onClick={() => {
                                  if (!notification.is_read) {
                                    handleMarkAsRead(notification.id);
                                  }
                                  navigate("/tasks");
                                }}
                                className="text-xs text-blue-600 hover:text-blue-800 font-medium"
                              >
                                View task
                              </button>
                            )}
                            <button
                              onClick={() => handleDelete(notification.id)}
                              className="text-xs text-red-600 hover:text-red-800 font-medium"
                            >
                              Delete
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Notifications;
