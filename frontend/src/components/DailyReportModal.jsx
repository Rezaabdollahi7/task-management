// src/components/DailyReportModal.jsx
// Modal component for creating and editing daily reports

import { useState, useEffect } from "react";
import { dailyReportsAPI } from "../services/api";
import { showSuccess, showError } from "../utils/toast";
import { useTranslation } from "react-i18next";
import { useModal } from "../../hooks/useModal";
import BilingualDatePicker from "./DatePicker/BilingualDatePicker";
import { formatDate, subtractDays } from "../utils/dateHelper";

const DailyReportModal = ({
  isOpen,
  onClose,
  onSuccess,
  editReport = null,
}) => {
  const [formData, setFormData] = useState({
    reportDate: "",
    description: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { t, i18n } = useTranslation();
  const { handleBackdropClick } = useModal(isOpen, onClose);

  // Set today as default date
  useEffect(() => {
    if (isOpen) {
      if (editReport) {
        // Load existing report data
        setFormData({
          reportDate: editReport.report_date
            ? editReport.report_date.split("T")[0]
            : "",
          description: editReport.description || "",
        });
      } else {
        // Set today's date as default
        const today = new Date().toISOString().split("T")[0];
        setFormData({
          reportDate: today,
          description: "",
        });
      }
      setError("");
    }
  }, [editReport, isOpen]);

  // Handle input change
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError("");
  };

  // Handle date change from DatePicker
  const handleDateChange = (isoDate) => {
    setFormData({
      ...formData,
      reportDate: isoDate || "",
    });
    setError("");
  };

  // Validate date (today or up to 2 days ago)
  const isValidDate = (dateString) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const selectedDate = new Date(dateString);
    selectedDate.setHours(0, 0, 0, 0);

    const diffTime = today - selectedDate;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    return diffDays >= 0 && diffDays <= 2;
  };

  // Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // Validation
      if (!formData.reportDate || !formData.description) {
        setError(
          t("dailyReports.messages.allFieldsRequired") ||
            "Report date and description are required"
        );
        setLoading(false);
        return;
      }

      if (formData.description.trim().length < 10) {
        setError(
          t("dailyReports.messages.descriptionMinLength") ||
            "Description must be at least 10 characters"
        );
        setLoading(false);
        return;
      }

      // Validate date range (unless editing)
      if (!editReport && !isValidDate(formData.reportDate)) {
        setError(
          t("dailyReports.messages.invalidDate") ||
            "You can only create reports for today or up to 2 days ago"
        );
        setLoading(false);
        return;
      }

      // Prepare data
      const reportData = {
        reportDate: formData.reportDate,
        description: formData.description.trim(),
      };

      if (editReport) {
        // Update existing report
        await dailyReportsAPI.update(editReport.id, reportData);
        showSuccess(
          t("dailyReports.messages.updateSuccess") ||
            "Report updated successfully"
        );
      } else {
        // Create new report
        await dailyReportsAPI.create(reportData);
        showSuccess(
          t("dailyReports.messages.createSuccess") ||
            "Report created successfully"
        );
      }

      setLoading(false);
      onSuccess();
      onClose();
    } catch (err) {
      setError(err.message || t("common.error"));
      showError(
        err.response?.data?.message ||
          err.message ||
          t("dailyReports.messages.createFailed")
      );
      setLoading(false);
    }
  };

  // Don't render if not open
  if (!isOpen) return null;

  // Calculate min and max dates
  const today = new Date().toISOString().split("T")[0];
  const twoDaysAgo = subtractDays(today, 2);

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      onClick={handleBackdropClick}
    >
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white flex justify-between items-center p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">
            {editReport
              ? t("dailyReports.editReport") || "Edit Report"
              : t("dailyReports.addReport") || "Add Report"}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6">
          {/* Error Message */}
          {error && (
            <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          {/* Info Box */}
          {!editReport && (
            <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-sm text-blue-800">
                {t("dailyReports.dateInfo") ||
                  "You can create reports for today or up to 2 days ago."}
              </p>
            </div>
          )}

          <div className="space-y-4">
            {/* Report Date */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <span className="text-red-500">*</span>
                {t("dailyReports.reportDate") || "Report Date"}
              </label>
              {editReport ? (
                <div className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-700">
                  {formatDate(formData.reportDate, i18n.language, "long")}
                </div>
              ) : (
                <BilingualDatePicker
                  value={formData.reportDate}
                  onChange={(isoDate) =>
                    setFormData({ ...formData, reportDate: isoDate })
                  }
                  placeholder={t("dailyReports.reportDate")}
                  minDate={subtractDays(new Date(), 2)}
                  maxDate={new Date()}
                  disabled={loading}
                />
              )}
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <span className="text-red-500">*</span>
                {t("dailyReports.description") || "Description"}
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows="10"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder={
                  t("dailyReports.placeholders.description") ||
                  "Describe what you worked on today...\n\nExample:\n- Completed task X\n- Fixed issue Y\n- Met with team about Z\n- Worked on feature W for 3 hours"
                }
                disabled={loading}
                required
              />
              <p className="mt-2 text-sm text-gray-500">
                {formData.description.length} / {10}{" "}
                {t("common.characters") || "characters"}
              </p>
            </div>
          </div>

          {/* Guidelines */}
          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <h3 className="text-sm font-semibold text-gray-700 mb-2">
              {t("dailyReports.guidelines") || "Report Guidelines:"}
            </h3>
            <ul className="text-sm text-gray-600 space-y-1 list-disc list-inside">
              <li>
                {t("dailyReports.guideline1") || "Be specific and detailed"}
              </li>
              <li>
                {t("dailyReports.guideline2") ||
                  "Include tasks completed and time spent"}
              </li>
              <li>
                {t("dailyReports.guideline3") ||
                  "Mention any challenges or blockers"}
              </li>
              <li>
                {t("dailyReports.guideline4") ||
                  "Note any help or resources needed"}
              </li>
            </ul>
          </div>

          {/* Buttons */}
          <div className="flex gap-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition disabled:opacity-50"
            >
              {t("common.cancel")}
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition disabled:opacity-50 flex items-center justify-center"
            >
              {loading ? (
                <>
                  <svg
                    className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  {t("common.loading")}
                </>
              ) : editReport ? (
                t("dailyReports.updateReport") || "Update Report"
              ) : (
                t("dailyReports.createReport") || "Create Report"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default DailyReportModal;
