// src/components/TaskModal.jsx
// Modal component for creating and editing tasks

import { useState, useEffect } from "react";
import { tasksAPI, usersAPI } from "../services/api";
import { showSuccess, showError } from "../utils/toast"; // showError was missing in original imports
import { useTranslation } from "react-i18next";
import { useModal } from "../../hooks/useModal";

const TaskModal = ({
  isOpen,
  onClose,
  onSuccess,
  editTask = null,
  viewOnly = false,
  initialTaskDate = null,
}) => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    priority: "medium",
    taskDate: "",
    deadline: "",
    deviceModel: "",
    serialNumber: "",
    reportedIssue: "",
    employeeId: "",
  });
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { t } = useTranslation();
  const { handleBackdropClick } = useModal(isOpen, onClose);

  // Fetch assignable users (all active users)
  useEffect(() => {
    const fetchAssignableUsers = async () => {
      try {
        const response = await usersAPI.getAssignable();
        setEmployees(response.data);
      } catch (err) {
        console.error("Failed to fetch assignable users:", err);
      }
    };

    if (isOpen && !viewOnly) {
      fetchAssignableUsers();
    }
  }, [isOpen, viewOnly]);

  // Load task data when editing or viewing
  useEffect(() => {
    if (editTask) {
      setFormData({
        title: editTask.title || "",
        description: editTask.description || "",
        priority: editTask.priority || "medium",
        taskDate: editTask.task_date ? editTask.task_date.split("T")[0] : "",
        deadline: editTask.deadline ? editTask.deadline.split("T")[0] : "",
        deviceModel: editTask.device_model || "",
        serialNumber: editTask.serial_number || "",
        reportedIssue: editTask.reported_issue || "",
        employeeId: editTask.employee_id || "",
      });
    } else {
      const defaultDate = initialTaskDate
        ? new Date(initialTaskDate).toISOString().split("T")[0]
        : new Date().toISOString().split("T")[0];

      setFormData({
        title: "",
        description: "",
        priority: "medium",
        taskDate: defaultDate,
        deadline: "",
        deviceModel: "",
        serialNumber: "",
        reportedIssue: "",
        employeeId: "",
      });
    }
    setError("");
  }, [editTask, isOpen, initialTaskDate]);

  // Handle input change
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError("");
  };

  // Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // Validation
      if (!formData.title || !formData.employeeId) {
        setError(
          t("tasks.messages.titleEmployeeRequired") ||
            "Title and employee are required"
        );
        setLoading(false);
        return;
      }

      // Prepare data
      const taskData = {
        title: formData.title,
        description: formData.description,
        priority: formData.priority,
        taskDate: formData.taskDate || null,
        deadline: formData.deadline || null,
        deviceModel: formData.deviceModel,
        serialNumber: formData.serialNumber,
        reportedIssue: formData.reportedIssue,
        employeeId: parseInt(formData.employeeId),
      };

      if (editTask) {
        // Update existing task
        await tasksAPI.update(editTask.id, taskData);

        showSuccess(t("tasks.messages.updateSuccess"));
      } else {
        // Create new task
        await tasksAPI.create(taskData);

        showSuccess(t("tasks.messages.createSuccess"));
      }

      setLoading(false);
      onSuccess();
      onClose();
    } catch (err) {
      setError(err.message || t("common.error"));
      showError(
        err.response?.data?.message || t("tasks.messages.createFailed")
      ); // 👈 ترجمه شد
      setLoading(false);
    }
  };

  // Don't render if not open
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      onClick={handleBackdropClick}
    >
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white flex justify-between items-center p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">
            {viewOnly
              ? t("tasks.taskDetails")
              : editTask
              ? t("tasks.editTask")
              : t("tasks.createTask")}
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

          {/* View Only Info */}
          {viewOnly && editTask && (
            <div className="mb-6 p-4 bg-blue-50 rounded-lg space-y-2">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-gray-600">{t("tasks.status")}</p>
                  <p className="text-sm font-medium">{editTask.status}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-600">
                    {t("common.created") || "Created"}
                  </p>
                  <p className="text-sm font-medium">
                    {new Date(editTask.created_at).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-600">
                    {t("tasks.createdBy") || "Creator"}
                  </p>
                  <p className="text-sm font-medium">{editTask.creator_name}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-600">
                    {t("tasks.assignedTo")}
                  </p>
                  <p className="text-sm font-medium">
                    {editTask.employee_name}
                  </p>
                </div>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Title */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                *{t("common.title")}
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder={t("tasks.placeholders.title")}
                disabled={loading || viewOnly}
                required
              />
            </div>

            {/* Description */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t("tasks.description")}
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows="3"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder={t("tasks.placeholders.description")}
                disabled={loading || viewOnly}
              />
            </div>

            {/* Priority */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                *{t("tasks.priority")}
              </label>
              <select
                name="priority"
                value={formData.priority}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                disabled={loading || viewOnly}
                required
              >
                <option value="low">{t("tasks.priorities.low")}</option>
                <option value="medium">{t("tasks.priorities.medium")}</option>
                <option value="high">{t("tasks.priorities.high")}</option>
                <option value="urgent">{t("tasks.priorities.urgent")}</option>
              </select>
            </div>

            {/* Employee */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                *{t("tasks.assignedTo")}
              </label>
              <select
                name="employeeId"
                value={formData.employeeId}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                disabled={loading || viewOnly}
                required
              >
                <option value="">
                  {t("tasks.placeholders.selectEmployee")}
                </option>
                {employees.map((emp) => (
                  <option key={emp.id} value={emp.id}>
                    {emp.full_name}
                  </option>
                ))}
              </select>
            </div>

            {/* Task Date */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t("tasks.taskDate") || "Task Date"}
              </label>
              <input
                type="date"
                name="taskDate"
                value={formData.taskDate}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                disabled={loading || viewOnly}
              />
            </div>

            {/* Deadline */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t("tasks.deadline")}
              </label>
              <input
                type="date"
                name="deadline"
                value={formData.deadline}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                disabled={loading || viewOnly}
              />
            </div>

            {/* Device Model */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t("tasks.deviceModel")}
              </label>
              <input
                type="text"
                name="deviceModel"
                value={formData.deviceModel}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder={t("tasks.placeholders.deviceModel")}
                disabled={loading || viewOnly}
              />
            </div>

            {/* Serial Number */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t("tasks.serialNumber")}
              </label>
              <input
                type="text"
                name="serialNumber"
                value={formData.serialNumber}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder={t("tasks.placeholders.serialNumber")}
                disabled={loading || viewOnly}
              />
            </div>

            {/* Reported Issue */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t("tasks.reportedIssue")}
              </label>
              <textarea
                name="reportedIssue"
                value={formData.reportedIssue}
                onChange={handleChange}
                rows="2"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder={t("tasks.placeholders.reportedIssue")}
                disabled={loading || viewOnly}
              />
            </div>

            {/* Work Report (View Only) */}
            {viewOnly && editTask && editTask.work_report && (
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t("tasks.workReport") || "Work Report"}
                </label>
                <div className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50">
                  {editTask.work_report}
                </div>
              </div>
            )}
          </div>

          {/* Buttons */}
          {!viewOnly && (
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
                ) : editTask ? (
                  t("tasks.editTask")
                ) : (
                  t("tasks.createTask")
                )}
              </button>
            </div>
          )}

          {viewOnly && (
            <div className="flex justify-end mt-6">
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition"
              >
                {t("common.close")}
              </button>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default TaskModal;
