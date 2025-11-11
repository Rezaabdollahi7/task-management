// src/components/Calendar/CalendarFilters.jsx
import React from "react";
import { useTranslation } from "react-i18next";

const CalendarFilters = ({
  filters,
  onFilterChange,
  isManager,
  employees,
  onRefresh,
  onClearAll,
}) => {
  const { t } = useTranslation();

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Status Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {t("tasks.status")}
          </label>
          <select
            value={filters.status}
            onChange={(e) => onFilterChange("status", e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="">{t("calendar.filters.allStatuses")}</option>
            <option value="open">{t("tasks.statuses.open")}</option>
            <option value="in_progress">
              {t("tasks.statuses.in_progress")}
            </option>
            <option value="completed">{t("tasks.statuses.completed")}</option>
            <option value="cancelled">{t("tasks.statuses.cancelled")}</option>
          </select>
        </div>

        {/* Priority Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {t("tasks.priority")}
          </label>
          <select
            value={filters.priority}
            onChange={(e) => onFilterChange("priority", e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="">{t("calendar.filters.allPriorities")}</option>
            <option value="urgent">{t("tasks.priorities.urgent")}</option>
            <option value="high">{t("tasks.priorities.high")}</option>
            <option value="medium">{t("tasks.priorities.medium")}</option>
            <option value="low">{t("tasks.priorities.low")}</option>
          </select>
        </div>

        {/* Employee Filter (Manager only) */}
        {isManager && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t("tasks.employee")}
            </label>
            <select
              value={filters.employeeId}
              onChange={(e) => onFilterChange("employeeId", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="">{t("calendar.filters.allEmployees")}</option>
              {employees.map((employee) => (
                <option key={employee.id} value={employee.id}>
                  {employee.full_name}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Quick Actions */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {t("calendar.quickActions")}
          </label>
          <div className="flex gap-2">
            <button
              onClick={onClearAll}
              className="flex-1 px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 text-sm transition-colors"
            >
              {t("common.clearAll")}
            </button>
            <button
              onClick={onRefresh}
              className="flex-1 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm transition-colors"
            >
              {t("calendar.refresh")}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CalendarFilters;
