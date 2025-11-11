// src/pages/Users/UserList.jsx
import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { usersAPI } from "../../services/api";
import UserModal from "../../components/UserModal";
import AppLayout from "../../components/Layout/AppLayout";
import SkeletonTable from "../../components/skeletons/SkeletonTable";
import { showSuccess, showError } from "../../utils/toast";
import { useTranslation } from "react-i18next";
import { FaEdit } from "react-icons/fa";
import { RiDeleteBin6Fill } from "react-icons/ri";

const UserList = () => {
  const { user } = useAuth();
  const { t } = useTranslation();

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
        {users.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <p className="text-lg">{t("users.noUsersFound")}</p>
            <p className="text-sm mt-2">{t("users.adjustFiltersMessage")}</p>
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
