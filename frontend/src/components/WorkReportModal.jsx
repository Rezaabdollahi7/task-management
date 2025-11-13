// src/components/WorkReportModal.jsx

import { useState, useEffect } from "react";
import { tasksAPI } from "../services/api";
import { useModal } from "../../hooks/useModal";
import { useTranslation } from "react-i18next";

const WorkReportModal = ({ isOpen, onClose, onSuccess, task }) => {
  const [workReport, setWorkReport] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === "fa";
  const { handleBackdropClick } = useModal(isOpen, onClose);

  // بارگذاری گزارش کار موجود وقتی تسک تغییر می‌کند
  useEffect(() => {
    if (task) {
      setWorkReport(task.work_report || "");
    }
    setError("");
  }, [task, isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (!workReport.trim()) {
        setError(t("workReport.errors.emptyReport"));
        setLoading(false);
        return;
      }

      await tasksAPI.addReport(task.id, workReport);

      setLoading(false);
      onSuccess();
      onClose();
    } catch (err) {
      setError(err.message || t("workReport.errors.submitFailed"));
      setLoading(false);
    }
  };

  if (!isOpen || !task) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      onClick={handleBackdropClick}
      dir={isRTL ? "rtl" : "ltr"}
    >
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white flex justify-between items-center p-6 border-b border-gray-200">
          <div className={isRTL ? "text-right" : "text-left"}>
            <h2 className="text-xl font-bold text-gray-900">
              {t("workReport.title")}
            </h2>
            <p className="text-sm text-gray-600 mt-1">
              {t("workReport.task")}: {task.title}
            </p>
          </div>
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

        <div className="p-6 bg-blue-50 border-b border-blue-100">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className={isRTL ? "text-right" : "text-left"}>
              <p className="text-gray-600">{t("tasks.employee")}</p>
              <p className="font-medium text-gray-900">{task.employee_name}</p>
            </div>
            <div className={isRTL ? "text-right" : "text-left"}>
              <p className="text-gray-600">{t("tasks.status")}</p>
              <p className="font-medium text-gray-900 capitalize">
                {task.status === "in_progress"
                  ? t("tasks.statuses.in_progress")
                  : t(`tasks.statuses.${task.status}`)}
              </p>
            </div>
            <div className={isRTL ? "text-right" : "text-left"}>
              <p className="text-gray-600">{t("tasks.deviceModel")}</p>
              <p className="font-medium text-gray-900">
                {task.device_model || t("common.notAvailable")}
              </p>
            </div>
            <div className={isRTL ? "text-right" : "text-left"}>
              <p className="text-gray-600">{t("tasks.serialNumber")}</p>
              <p className="font-medium text-gray-900">
                {task.serial_number || t("common.notAvailable")}
              </p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          {error && (
            <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          {task.work_report && (
            <div className="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
              <h3 className="text-sm font-semibold text-gray-700 mb-2">
                {t("workReport.currentReport")}:
              </h3>
              <p className="text-sm text-gray-900 whitespace-pre-wrap">
                {task.work_report}
              </p>
              <p className="text-xs text-gray-500 mt-2">
                {t("workReport.replaceNote")}
              </p>
            </div>
          )}

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {task.work_report
                ? t("workReport.updateReport") + " *"
                : t("workReport.workReport") + " *"}
            </label>
            <textarea
              value={workReport}
              onChange={(e) => setWorkReport(e.target.value)}
              rows="8"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              placeholder={t("workReport.placeholder")}
              disabled={loading}
              required
            />
            <p className="mt-2 text-xs text-gray-500">
              {t("workReport.guidelinesBrief")}
            </p>
          </div>

          <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <h3 className="text-sm font-semibold text-yellow-800 mb-2">
              📝 {t("workReport.guidelinesTitle")}:
            </h3>
            <ul className="text-xs text-yellow-700 space-y-1">
              <li>• {t("workReport.guideline1")}</li>
              <li>• {t("workReport.guideline2")}</li>
              <li>• {t("workReport.guideline3")}</li>
              <li>• {t("workReport.guideline4")}</li>
              <li>• {t("workReport.guideline5")}</li>
            </ul>
          </div>

          <div className={`flex gap-3 ${isRTL ? "flex-row-reverse" : ""}`}>
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="flex-1 px-4 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition disabled:opacity-50 font-medium"
            >
              {t("common.cancel")}
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 rounded-lg transition disabled:opacity-50 flex items-center justify-center font-medium"
            >
              {loading ? (
                <>
                  <svg
                    className="animate-spin -ml-1 mr-2 h-5 w-5 text-white"
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
                  {t("workReport.saving")}
                </>
              ) : (
                <>
                  <svg
                    className="w-5 h-5 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                  {task.work_report
                    ? t("workReport.updateReport")
                    : t("workReport.submitReport")}
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default WorkReportModal;
