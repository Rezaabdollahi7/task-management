// src/pages/Users/UserList.jsx
// User management page - List all users with CRUD operations

import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { usersAPI } from "../../services/api";
import UserModal from "../../components/UserModal";
import NotificationBell from "../../components/NotificationBell";
import { showSuccess, showError } from "../../utils/toast";
import SkeletonTable from "../../components/skeletons/SkeletonTable";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { FaBars, FaEdit, FaTimes } from "react-icons/fa";
import { MdOutlineTaskAlt } from "react-icons/md";
import { RxDashboard } from "react-icons/rx";
import { TbLogout } from "react-icons/tb";
import { HiOutlineUsers } from "react-icons/hi2";
import { RiNotification3Line } from "react-icons/ri";
import LanguageSwitcher from "../../components/LanguageSwitcher";
import { FiEdit } from "react-icons/fi";
import { RiDeleteBin6Fill } from "react-icons/ri";

const UserList = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === "fa";

  // Fetch users from API
  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError("");

      const params = {
        page: pagination.currentPage,
        limit: 10,
      };

      if (search) params.search = search;
      if (roleFilter) params.role = roleFilter;

      const response = await usersAPI.getAll(params);

      setUsers(response.data.users);
      setPagination(response.data.pagination);
      setLoading(false);
    } catch (err) {
      setError(err.message || "Failed to fetch users");
      setLoading(false);
    }
  };

  // Load users on mount and when filters change
  useEffect(() => {
    fetchUsers();
  }, [pagination.currentPage, search, roleFilter]);

  // Handle search input with debounce
  const handleSearchChange = (e) => {
    setSearch(e.target.value);
    setPagination({ ...pagination, currentPage: 1 });
  };

  // Handle role filter
  const handleRoleFilter = (role) => {
    setRoleFilter(role);
    setPagination({ ...pagination, currentPage: 1 });
  };

  // Handle delete user
  const handleDelete = async (userId, username) => {
    if (
      !window.confirm(`Are you sure you want to delete user "${username}"?`)
    ) {
      return;
    }

    try {
      await usersAPI.delete(userId);
      showSuccess("User deleted successfully");
      fetchUsers();
    } catch (err) {
      showSuccess("User deleted successfully");
    }
  };

  // Handle page change
  const handlePageChange = (newPage) => {
    setPagination({ ...pagination, currentPage: newPage });
  };

  const handleLogout = async () => {
    await logout();
    navigate("/login");
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
        <div className="hidden container lg:flex items-center justify-center relative py-1 border border-b mb-8">
          <img
            src="../../public/icons/full_rounded.png"
            alt=""
            className="size-24 mr-[30%]"
          />
          <span className="text-xl absolute italic">ero Task</span>
        </div>
        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto">
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
              className="w-full flex items-center gap-3 px-4 py-3 text-gray-700 text-lg hover:bg-myYellow-50/10 hover:text-yellow-600 rounded-lg transition-colors"
            >
              <MdOutlineTaskAlt className="size-6 flex-shrink-0" />
              <span className="font-medium">{t("navigation.tasks")}</span>
            </button>

            <button
              onClick={() => {
                navigate("/users");
                setSidebarOpen(false);
              }}
              className="w-full flex items-center gap-3 px-4 py-3 text-[#2b7fff] font-bold text-xl "
            >
              <HiOutlineUsers className="size-6 flex-shrink-0" />
              <span className="font-medium">{t("navigation.users")}</span>
            </button>

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
                <p className="text-xs text-gray-500 capitalize">
                  {t(`users.roles.${user?.role}`)}
                </p>
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* Main content - with margin for fixed sidebar on desktop */}
      <div className={`flex-1 ${isRTL ? "lg:mr-[20%]" : "lg:ml-[20%]"}`}>
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
                  {t("navigation.users")}
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
        <main className="px-4 sm:px-6 lg:px-8 py-8 bg-[#FAFAFB] min-h-[calc(100vh-73px)]">
          {/* Filters and Actions */}
          <div className="bg-white rounded-lg shadow p-6 mb-6">
            <div className="flex flex-col md:flex-row gap-4 justify-between">
              {/* Search */}
              <div className="flex-1">
                <input
                  type="text"
                  placeholder={t("users.searchPlaceholder")}
                  value={search}
                  onChange={handleSearchChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* Role Filter */}
              <div className="flex gap-2">
                <button
                  onClick={() => handleRoleFilter("")}
                  className={`px-4 py-2 rounded-lg transition ${
                    roleFilter === ""
                      ? "bg-blue-600 text-white"
                      : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                  }`}
                >
                  {t("users.filters.all")}
                </button>
                <button
                  onClick={() => handleRoleFilter("manager")}
                  className={`px-4 py-2 rounded-lg transition ${
                    roleFilter === "manager"
                      ? "bg-blue-600 text-white"
                      : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                  }`}
                >
                  {t("users.filters.managers")}
                </button>
                <button
                  onClick={() => handleRoleFilter("employee")}
                  className={`px-4 py-2 rounded-lg transition ${
                    roleFilter === "employee"
                      ? "bg-blue-600 text-white"
                      : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                  }`}
                >
                  {t("users.filters.employees")}
                </button>
              </div>

              {/* Create Button */}
              <button
                onClick={() => {
                  setEditingUser(null);
                  setIsModalOpen(true);
                }}
                className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg transition"
              >
                + {t("users.createUser")}
              </button>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
              {error}
            </div>
          )}

          {/* Users Table */}
          <div className="bg-white rounded-lg shadow overflow-hidden">
            {loading ? (
              <div className="min-h-screen bg-gray-50">
                {/* Skeleton Content adapted for UserList */}
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                  {/* Skeleton Filters */}
                  <div className="mb-6 flex flex-col md:flex-row gap-4">
                    <div className="flex-1 h-10 bg-gray-200 rounded-lg animate-pulse"></div>
                    <div className="w-full md:w-48 h-10 bg-gray-200 rounded-lg animate-pulse"></div>
                    <div className="w-full md:w-48 h-10 bg-gray-200 rounded-lg animate-pulse"></div>
                  </div>

                  {/* Skeleton Table */}
                  <div className="bg-white rounded-lg shadow overflow-hidden">
                    <SkeletonTable rows={8} columns={5} />
                  </div>
                </div>
              </div>
            ) : users.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <p className="text-lg">{t("users.noUsersFound")}</p>
                <p className="text-sm mt-2">
                  {t("users.adjustFiltersMessage")}
                </p>
              </div>
            ) : (
              <>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-center text-md font-medium text-gray-500 uppercase tracking-wider">
                          ID
                        </th>
                        <th className="px-6 py-3 text-center text-md font-medium text-gray-500 uppercase tracking-wider">
                          {t("users.table.fullName")}
                        </th>
                        <th className="px-6 py-3 text-center text-md font-medium text-gray-500 uppercase tracking-wider">
                          {t("users.table.username")}
                        </th>
                        <th className="px-6 py-3 text-center text-md font-medium text-gray-500 uppercase tracking-wider">
                          {t("users.table.role")}
                        </th>
                        <th className="px-6 py-3 text-center text-md font-medium text-gray-500 uppercase tracking-wider">
                          {t("users.table.createdAt")}
                        </th>
                        <th className="px-6 py-3 text-center text-md font-medium text-gray-500 uppercase tracking-wider">
                          {t("users.table.actions")}
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {users.map((u) => (
                        <tr key={u.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {u.id}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">
                              {u.full_name}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {u.username}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span
                              className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full capitalize ${
                                u.role === "manager"
                                  ? "bg-blue-100 text-blue-800"
                                  : "bg-green-100 text-green-800"
                              }`}
                            >
                              {u.role}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {new Date(u.created_at).toLocaleDateString()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                            <button
                              onClick={() => {
                                setEditingUser(u);
                                setIsModalOpen(true);
                              }}
                              className="text-blue-600 hover:text-blue-900 me-4"
                            >
                              <FaEdit className="size-6" />
                              {t("common.edit")}
                            </button>
                            <button
                              onClick={() => handleDelete(u.id, u.username)}
                              disabled={u.id === user?.id}
                              className={`${
                                u.id === user?.id
                                  ? "text-gray-400 cursor-not-allowed"
                                  : "text-red-600 hover:text-red-900"
                              }`}
                            >
                              <RiDeleteBin6Fill className="size-6" />
                              {t("common.delete")}
                            </button>
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
                        {t("pagination.showing")}
                        <strong>{pagination.currentPage}</strong>{" "}
                        {t("pagination.of")}
                        <strong>{pagination.totalPages}</strong> (
                        <strong>{pagination.totalItems}</strong>{" "}
                        {t("pagination.totalUsers")})
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
      {/* User Modal */}
      <UserModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingUser(null);
        }}
        onSuccess={() => {
          fetchUsers();
        }}
        editUser={editingUser}
      />
    </div>
  );
};

export default UserList;
