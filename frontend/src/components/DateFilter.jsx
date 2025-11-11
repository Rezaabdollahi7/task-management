// src/components/DateFilter.jsx
// Date range filter component with Persian calendar support

import { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  getDateRange,
  jalaliToGregorian,
  getCurrentJalaliDate,
} from "../utils/dateHelper";

const DateFilter = ({ onFilterChange, startDate, endDate }) => {
  const { t, i18n } = useTranslation();
  const isPersian = i18n.language === "fa";

  const [quickFilter, setQuickFilter] = useState("");

  // Handle quick filter buttons
  const handleQuickFilter = (range) => {
    const dates = getDateRange(range);
    setQuickFilter(range);
    onFilterChange(dates.startDate, dates.endDate);
  };

  // Handle custom date change
  const handleDateChange = (type, value) => {
    setQuickFilter(""); // Clear quick filter

    if (type === "start") {
      const dateToSend = isPersian ? jalaliToGregorian(value) : value;
      onFilterChange(dateToSend, endDate);
    } else {
      const dateToSend = isPersian ? jalaliToGregorian(value) : value;
      onFilterChange(startDate, dateToSend);
    }
  };

  // Clear filter
  const handleClear = () => {
    setQuickFilter("");
    onFilterChange("", "");
  };

  return (
    <div className="space-y-4">
      {/* Quick Filters */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {t("tasks.filters.quickDate")}
        </label>
        <div className="flex gap-2 flex-wrap">
          <button
            onClick={() => handleQuickFilter("today")}
            className={`px-3 py-2 rounded-lg text-sm transition ${
              quickFilter === "today"
                ? "bg-blue-600 text-white"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            {t("tasks.filters.today")}
          </button>
          <button
            onClick={() => handleQuickFilter("week")}
            className={`px-3 py-2 rounded-lg text-sm transition ${
              quickFilter === "week"
                ? "bg-blue-600 text-white"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            {t("tasks.filters.thisWeek")}
          </button>
          <button
            onClick={() => handleQuickFilter("month")}
            className={`px-3 py-2 rounded-lg text-sm transition ${
              quickFilter === "month"
                ? "bg-blue-600 text-white"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            {t("tasks.filters.thisMonth")}
          </button>
          {(startDate || endDate || quickFilter) && (
            <button
              onClick={handleClear}
              className="px-3 py-2 rounded-lg text-sm bg-red-100 text-red-700 hover:bg-red-200 transition"
            >
              {t("tasks.filters.clearDate")}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default DateFilter;
