// src/pages/DailyReports/DailyReportsList.jsx
import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { dailyReportsAPI, usersAPI } from "../../services/api";
import { useTranslation } from "react-i18next";
import AppLayout from "../../components/Layout/AppLayout";
import DailyReportModal from "../../components/DailyReportModal";
import { showSuccess, showError } from "../../utils/toast";
import { formatDate } from "../../utils/dateHelper";
import {
  FaPlus,
  FaEdit,
  FaTrash,
  FaSearch,
  FaCalendarAlt,
} from "react-icons/fa";

const DailyReportsList = () => {
  const { user } = useAuth();
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === "fa";
  const isManager = user?.role === "manager";

  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [employees, setEmployees] = useState([]);
  const [filters, setFilters] = useState({
    userId: "",
    startDate: "",
    endDate: "",
    search: "",
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingReport, setEditingReport] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
  });

  // Fetch employees (for manager filter)
  useEffect(() => {
    const fetchEmployees = async () => {
      if (isManager) {
        try {
          const response = await usersAPI.getAll({ limit: 100 });
          setEmployees(response.data.users || []);
        } catch (err) {
          console.error("Failed to fetch employees:", err);
        }
      }
    };
    fetchEmployees();
  }, [isManager]);

  // Fetch reports
  const fetchReports = async () => {
    try {
      setLoading(true);

      const params = {
        page: pagination.currentPage,
        limit: 20,
        ...filters,
      };

      let response;
      if (isManager) {
        response = await dailyReportsAPI.getAll(params);
      } else {
        response = await dailyReportsAPI.getMy(params);
      }

      setReports(response.data.reports || []);
      setPagination(response.data.pagination);
      setLoading(false);
    } catch (err) {
      console.error("Failed to fetch reports:", err);
      showError(err.message || "Failed to load reports");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, [pagination.currentPage, filters]);

  // Handle filter change
  const handleFilterChange = (key, value) => {
    setFilters({ ...filters, [key]: value });
    setPagination({ ...pagination, currentPage: 1 });
  };

  // Handle delete
  const handleDelete = async (reportId, reportDate) => {
    if (
      !window.confirm(
        t("dailyReports.deleteConfirm") ||
          "Are you sure you want to delete this report?"
      )
    ) {
      return;
    }

    try {
      await dailyReportsAPI.delete(reportId);
      showSuccess(
        t("dailyReports.deleteSuccess") || "Report deleted successfully"
      );
      fetchReports();
    } catch (err) {
      showError(err.message || "Failed to delete report");
    }
  };

  // Handle page change
  const handlePageChange = (newPage) => {
    setPagination({ ...pagination, currentPage: newPage });
  };

  return (
    <AppLayout
      title={t("navigation.dailyReports") || "Daily Reports"}
      sidebarOpen={sidebarOpen}
      setSidebarOpen={setSidebarOpen}
    >
      {/* Header & Filters */}
      <div className="bg-white rounded-lg shadow p-4 sm:p-6 mb-6">
        <div className="flex flex-col lg:flex-row gap-4 justify-between items-start lg:items-center mb-4">
          <h2 className="text-xl font-bold text-gray-900">
            {isManager
              ? t("dailyReports.allReports") || "All Daily Reports"
              : t("dailyReports.myReports") || "My Daily Reports"}
          </h2>

          {/* Add Report Button */}
          <button
            onClick={() => {
              setEditingReport(null);
              setIsModalOpen(true);
            }}
            className="w-full lg:w-auto bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition flex items-center justify-center gap-2"
          >
            <FaPlus />
            {t("dailyReports.addReport") || "Add Report"}
          </button>
        </div>

        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Employee Filter (Manager only) */}
          {isManager && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t("users.roles.employee")}
              </label>
              <select
                value={filters.userId}
                onChange={(e) => handleFilterChange("userId", e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">{t("tasks.filters.allUsers")}</option>
                {employees.map((emp) => (
                  <option key={emp.id} value={emp.id}>
                    {emp.full_name}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Start Date */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t("tasks.filters.fromDate")}
            </label>
            <input
              type="date"
              value={filters.startDate}
              onChange={(e) => handleFilterChange("startDate", e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* End Date */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t("tasks.filters.toDate")}
            </label>
            <input
              type="date"
              value={filters.endDate}
              onChange={(e) => handleFilterChange("endDate", e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Search */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t("common.search")}
            </label>
            <div className="relative">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={filters.search}
                onChange={(e) => handleFilterChange("search", e.target.value)}
                placeholder={
                  t("dailyReports.searchPlaceholder") || "Search in reports..."
                }
                className={`w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  isRTL ? "text-right" : "text-left"
                }`}
              />
            </div>
          </div>
        </div>

        {/* Clear Filters */}
        {(filters.userId ||
          filters.startDate ||
          filters.endDate ||
          filters.search) && (
          <div className="mt-4">
            <button
              onClick={() => {
                setFilters({
                  userId: "",
                  startDate: "",
                  endDate: "",
                  search: "",
                });
                setPagination({ ...pagination, currentPage: 1 });
              }}
              className="text-sm text-blue-600 hover:text-blue-800"
            >
              {t("common.clearAll")}
            </button>
          </div>
        )}
      </div>

      {/* Reports List */}
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      ) : reports.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-12 text-center">
          <FaCalendarAlt className="mx-auto text-gray-400 text-5xl mb-4" />
          <p className="text-gray-500 text-lg mb-4">
            {t("dailyReports.noReports") || "No reports found"}
          </p>
          <button
            onClick={() => {
              setEditingReport(null);
              setIsModalOpen(true);
            }}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition"
          >
            {t("dailyReports.addReport") || "Add Report"}
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {reports.map((report) => (
            <div
              key={report.id}
              className="bg-white rounded-lg shadow hover:shadow-md transition p-6"
            >
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <FaCalendarAlt className="text-blue-600" />
                    <h3 className="text-lg font-semibold text-gray-900">
                      {formatDate(report.report_date, i18n.language, "long")}
                    </h3>
                  </div>
                  {isManager && (
                    <p className="text-sm text-gray-600">
                      {t("common.by")}: {report.full_name || report.username}
                    </p>
                  )}
                  <p className="text-xs text-gray-500 mt-1">
                    {t("common.created")}:{" "}
                    {formatDate(report.created_at, i18n.language, "dateTime")}
                  </p>
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      setEditingReport(report);
                      setIsModalOpen(true);
                    }}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                    title={t("common.edit")}
                  >
                    <FaEdit className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => handleDelete(report.id, report.report_date)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                    title={t("common.delete")}
                  >
                    <FaTrash className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Description */}
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-gray-700 whitespace-pre-wrap">
                  {report.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <div className="bg-white rounded-lg shadow mt-6 px-4 py-3">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-sm text-gray-700">
              {t("pagination.showing")}{" "}
              <strong>{pagination.currentPage}</strong> {t("pagination.of")}{" "}
              <strong>{pagination.totalPages}</strong> (
              <strong>{pagination.totalItems}</strong>{" "}
              {t("dailyReports.totalReports") || "total reports"})
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => handlePageChange(pagination.currentPage - 1)}
                disabled={pagination.currentPage === 1}
                className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 text-sm"
              >
                {t("common.previous")}
              </button>
              <button
                onClick={() => handlePageChange(pagination.currentPage + 1)}
                disabled={pagination.currentPage === pagination.totalPages}
                className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 text-sm"
              >
                {t("common.next")}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal */}
      <DailyReportModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingReport(null);
        }}
        onSuccess={() => {
          fetchReports();
        }}
        editReport={editingReport}
      />
    </AppLayout>
  );
};

export default DailyReportsList;
