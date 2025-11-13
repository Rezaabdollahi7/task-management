// src/pages/Users/UserList.jsx
import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { usersAPI } from "../../services/api";
import UserModal from "../../components/UserModal";
import AppLayout from "../../components/Layout/AppLayout";
import SkeletonTable from "../../components/skeletons/SkeletonTable";
import { showSuccess, showError } from "../../utils/toast";
import { useTranslation } from "react-i18next";
import { FaEdit, FaSearch } from "react-icons/fa";
import { RiDeleteBin6Fill } from "react-icons/ri";

const UserList = () => {
  const { user } = useAuth();
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === "fa";

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

  // Loading state
  if (loading) {
    return (
      <AppLayout
        title={t("navigation.users")}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
      >
        {/* Skeleton Content */}
        <div className="space-y-6">
          {/* Skeleton Filters */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex flex-col md:flex-row gap-4 justify-between">
              <div className="flex-1 h-10 bg-gray-200 rounded-lg animate-pulse"></div>
              <div className="flex gap-2">
                <div className="w-20 h-10 bg-gray-200 rounded-lg animate-pulse"></div>
                <div className="w-20 h-10 bg-gray-200 rounded-lg animate-pulse"></div>
                <div className="w-20 h-10 bg-gray-200 rounded-lg animate-pulse"></div>
              </div>
              <div className="w-32 h-10 bg-gray-200 rounded-lg animate-pulse"></div>
            </div>
          </div>

          {/* Skeleton Table */}
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <SkeletonTable rows={8} columns={6} />
          </div>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout
      title={t("navigation.users")}
      sidebarOpen={sidebarOpen}
      setSidebarOpen={setSidebarOpen}
    >
      {/* Filters and Actions */}
      <div className="bg-white rounded-lg shadow p-4 sm:p-6 mb-6">
        <div className="flex flex-col lg:flex-row gap-4 justify-between items-start lg:items-center">
          {/* Search */}
          <div className="flex-1 w-full lg:w-auto relative">
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder={t("users.searchPlaceholder")}
              value={search}
              onChange={handleSearchChange}
              className={`w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base ${
                isRTL ? "text-right" : "text-left"
              }`}
            />
          </div>

          {/* Role Filter */}
          <div className="flex flex-wrap gap-2 w-full lg:w-auto justify-center lg:justify-start">
            <button
              onClick={() => handleRoleFilter("")}
              className={`px-3 sm:px-4 py-2 rounded-lg transition text-xs sm:text-sm ${
                roleFilter === ""
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              {t("users.filters.all")}
            </button>
            <button
              onClick={() => handleRoleFilter("manager")}
              className={`px-3 sm:px-4 py-2 rounded-lg transition text-xs sm:text-sm ${
                roleFilter === "manager"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              {t("users.filters.managers")}
            </button>
            <button
              onClick={() => handleRoleFilter("employee")}
              className={`px-3 sm:px-4 py-2 rounded-lg transition text-xs sm:text-sm ${
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
            className="w-full lg:w-auto bg-green-600 hover:bg-green-700 text-white px-4 sm:px-6 py-2 rounded-lg transition text-sm sm:text-base"
          >
            + {t("users.createUser")}
          </button>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6 text-sm sm:text-base">
          {error}
        </div>
      )}

      {/* Users Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        {users.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <p className="text-base sm:text-lg">{t("users.noUsersFound")}</p>
            <p className="text-xs sm:text-sm mt-2">
              {t("users.adjustFiltersMessage")}
            </p>
          </div>
        ) : (
          <>
            {/* Desktop Table */}
            <div className="hidden lg:block overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 sm:px-6 py-3 text-center  sm:text-sm font-medium text-gray-500 uppercase tracking-wider">
                      ID
                    </th>
                    <th className="px-4 sm:px-6 py-3 text-center  sm:text-sm font-medium text-gray-500 uppercase tracking-wider">
                      {t("users.table.fullName")}
                    </th>
                    <th className="px-4 sm:px-6 py-3 text-center  sm:text-sm font-medium text-gray-500 uppercase tracking-wider">
                      {t("users.table.username")}
                    </th>
                    <th className="px-4 sm:px-6 py-3 text-center  sm:text-sm font-medium text-gray-500 uppercase tracking-wider">
                      {t("users.table.role")}
                    </th>
                    <th className="px-4 sm:px-6 py-3 text-center  sm:text-sm font-medium text-gray-500 uppercase tracking-wider">
                      {t("users.table.createdAt")}
                    </th>
                    <th className="px-4 sm:px-6 py-3 text-center  sm:text-sm font-medium text-gray-500 uppercase tracking-wider">
                      {t("users.table.actions")}
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {users.map((u) => (
                    <tr key={u.id} className="hover:bg-gray-50">
                      <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-center">
                        {u.id}
                      </td>
                      <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-center">
                        <div className="text-sm font-medium text-gray-900">
                          {u.full_name}
                        </div>
                      </td>
                      <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">
                        {u.username}
                      </td>
                      <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-center">
                        <span
                          className={`px-2 sm:px-3 py-1 inline-flex text-xs  font-semibold rounded-full capitalize ${
                            u.role === "manager"
                              ? "bg-blue-100 text-blue-800"
                              : "bg-green-100 text-green-800"
                          }`}
                        >
                          {u.role}
                        </span>
                      </td>
                      <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">
                        {new Date(u.created_at).toLocaleDateString()}
                      </td>
                      <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                        <div className="flex justify-center items-center gap-3 sm:gap-4">
                          <button
                            onClick={() => {
                              setEditingUser(u);
                              setIsModalOpen(true);
                            }}
                            className="text-blue-600 hover:text-blue-900 flex items-center gap-1"
                            title={t("common.edit")}
                          >
                            <FaEdit className="size-4 sm:size-5" />
                            <span className="hidden sm:inline">
                              {t("common.edit")}
                            </span>
                          </button>
                          <button
                            onClick={() => handleDelete(u.id, u.username)}
                            disabled={u.id === user?.id}
                            className={`flex items-center gap-1 ${
                              u.id === user?.id
                                ? "text-gray-400 cursor-not-allowed"
                                : "text-red-600 hover:text-red-900"
                            }`}
                            title={t("common.delete")}
                          >
                            <RiDeleteBin6Fill className="size-4 sm:size-5" />
                            <span className="hidden sm:inline">
                              {t("common.delete")}
                            </span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Cards */}
            <div className="lg:hidden space-y-4 p-4">
              {users.map((u) => (
                <div
                  key={u.id}
                  className="border border-gray-200 rounded-lg p-4 bg-white shadow-sm"
                >
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="font-semibold text-gray-900 text-sm sm:text-base">
                        {u.full_name}
                      </h3>
                      <p className="text-xs text-gray-500 mt-1">ID: {u.id}</p>
                    </div>
                    <span
                      className={`px-2 py-1 inline-flex text-xs font-semibold rounded-full capitalize ${
                        u.role === "manager"
                          ? "bg-blue-100 text-blue-800"
                          : "bg-green-100 text-green-800"
                      }`}
                    >
                      {u.role}
                    </span>
                  </div>

                  <div className="flex gap-2">
                    <span className="text-gray-600">
                      {t("users.table.username")}:
                    </span>
                    <p className="font-medium">{u.username}</p>
                  </div>

                  <div className="flex justify-between items-center pt-3 border-t border-gray-100">
                    <button
                      onClick={() => {
                        setEditingUser(u);
                        setIsModalOpen(true);
                      }}
                      className="text-blue-600 hover:text-blue-800 flex items-center gap-1 text-xs"
                    >
                      <FaEdit className="size-3 sm:size-4" />
                      <span>{t("common.edit")}</span>
                    </button>
                    <button
                      onClick={() => handleDelete(u.id, u.username)}
                      disabled={u.id === user?.id}
                      className={`flex items-center gap-1 text-xs ${
                        u.id === user?.id
                          ? "text-gray-400 cursor-not-allowed"
                          : "text-red-600 hover:text-red-800"
                      }`}
                    >
                      <RiDeleteBin6Fill className="size-3 sm:size-4" />
                      <span>{t("common.delete")}</span>
                    </button>
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
                {t("pagination.showing")}{" "}
                <strong>{pagination.currentPage}</strong> {t("pagination.of")}{" "}
                <strong>{pagination.totalPages}</strong> (
                <strong>{pagination.totalItems}</strong>{" "}
                {t("pagination.totalUsers")})
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
    </AppLayout>
  );
};

export default UserList;
