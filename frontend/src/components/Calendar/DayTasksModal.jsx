// src/components/Calendar/DayTasksModal.jsx
import React, { useState, useEffect } from "react";
import {
  FaTimes,
  FaUser,
  FaCalendar,
  FaPlus,
  FaEdit,
  FaEye,
} from "react-icons/fa";
import { useTranslation } from "react-i18next";
import TaskModal from "../TaskModal";
import { tasksAPI } from "../../services/api";
import { showSuccess, showError } from "../../utils/toast";
import { MdOutlineFileDownloadDone } from "react-icons/md";
import { useModal } from "../../../hooks/useModal";

const DayTasksModal = ({
  isOpen,
  onClose,
  selectedDate,
  tasks,
  onTaskCreated,
  onTaskUpdated,
}) => {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === "fa";

  const [isCreateTaskModalOpen, setIsCreateTaskModalOpen] = useState(false);
  const [isEditTaskModalOpen, setIsEditTaskModalOpen] = useState(false);
  const [isViewTaskModalOpen, setIsViewTaskModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [loadingTaskId, setLoadingTaskId] = useState(null);
  const [localTasks, setLocalTasks] = useState(tasks);

  useEffect(() => {
    setLocalTasks(tasks);
  }, [tasks]);

  const { handleBackdropClick } = useModal(isOpen, onClose);
  if (!isOpen) return null;

  const getStatusColor = (status) => {
    const colors = {
      open: "text-blue-600 bg-blue-50",
      in_progress: "text-yellow-600 bg-yellow-50",
      completed: "text-green-600 bg-green-50",
      cancelled: "text-gray-600 bg-gray-50",
    };
    return colors[status] || "text-gray-600 bg-gray-50";
  };

  const formatDate = (date) => {
    if (isRTL) {
      const gregorianDate = new Date(date);
      const options = {
        year: "numeric",
        month: "long",
        day: "numeric",
        calendar: "persian",
        numberingSystem: "arab",
      };
      return new Intl.DateTimeFormat("fa-IR", options).format(gregorianDate);
    } else {
      return new Date(date).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    }
  };

  const handleTaskCreated = () => {
    setIsCreateTaskModalOpen(false);
    if (onTaskCreated) {
      onTaskCreated();
    }
    if (onTaskUpdated) {
      onTaskUpdated();
    }
  };

  const handleTaskUpdated = () => {
    setIsEditTaskModalOpen(false);
    if (onTaskCreated) {
      onTaskCreated();
    }
    if (onTaskUpdated) {
      onTaskUpdated();
    }
  };

  const handleAddNewTask = () => {
    setIsCreateTaskModalOpen(true);
  };

  const handleEditTask = (task) => {
    setSelectedTask(task);
    setIsEditTaskModalOpen(true);
  };

  const handleViewTask = (task) => {
    setSelectedTask(task);
    setIsViewTaskModalOpen(true);
  };

  const handleCompleteTask = async (task) => {
    try {
      setLoadingTaskId(task.id);
      await tasksAPI.updateStatus(task.id, "completed");

      setLocalTasks((prevTasks) =>
        prevTasks.map((t) =>
          t.id === task.id ? { ...t, status: "completed" } : t
        )
      );

      if (onTaskUpdated) {
        onTaskUpdated();
      }

      if (onTaskCreated) {
        onTaskCreated();
      }

      showSuccess(t("dayTasks.messages.completeSuccess"));
    } catch (error) {
      console.error("Error completing task:", error);
      showError(error.message || t("dayTasks.messages.completeFailed"));
    } finally {
      setLoadingTaskId(null);
    }
  };

  const canEditTask = (task) => {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    return user.role === "manager" || task.employee_id === user.id;
  };

  const canCompleteTask = (task) => {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    const isAssignedUser = task.employee_id === user.id;
    const isCompletableStatus = ["open", "in_progress"].includes(task.status);

    return isAssignedUser && isCompletableStatus;
  };

  return (
    <>
      <div
        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
        dir={isRTL ? "rtl" : "ltr"}
        onClick={handleBackdropClick}
      >
        <div className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] overflow-hidden">
          {/* Header */}
          <div
            className={`flex justify-between items-center p-6 border-b border-gray-200 ${
              isRTL ? "flex-row" : ""
            }`}
          >
            <div className={isRTL ? "text-right" : "text-left"}>
              <h2 className="text-xl font-bold text-gray-900">
                {t("dayTasks.title")}
              </h2>
              <p className="text-gray-600 mt-1">{formatDate(selectedDate)}</p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <FaTimes className="w-6 h-6" />
            </button>
          </div>

          {/* Content */}
          <div className="p-6 overflow-y-auto max-h-[60vh]">
            {localTasks.length === 0 ? (
              <div className="text-center py-8">
                <FaCalendar className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 text-lg">{t("dayTasks.noTasks")}</p>
              </div>
            ) : (
              <div className="space-y-4">
                {localTasks.map((task) => (
                  <div
                    key={task.id}
                    className="border-2 border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                  >
                    {/* Task Header */}
                    <div
                      className={`flex justify-between items-start mb-3 ${
                        isRTL ? "flex-row" : ""
                      }`}
                    >
                      <h3
                        className={`font-semibold text-gray-900 text-lg ${
                          isRTL ? "text-right" : "text-left"
                        }`}
                      >
                        {task.title}
                      </h3>
                      <div
                        className={`flex gap-2 ${
                          isRTL ? "flex-row-reverse" : ""
                        }`}
                      >
                        <span
                          className={`inline-flex items-center gap-1 justify-center px-4 py-2 text-sm md:text-base rounded-lg font-medium ${getStatusColor(
                            task.status
                          )}`}
                        >
                          {t(`tasks.statuses.${task.status}`)}
                        </span>
                      </div>
                    </div>

                    {/* Task Description */}
                    {task.description && (
                      <p
                        className={`text-gray-600 mb-3 text-sm ${
                          isRTL ? "text-right" : "text-left"
                        }`}
                      >
                        {task.description}
                      </p>
                    )}

                    {/* Task Details */}
                    <div
                      className={`grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600 ${
                        isRTL ? "text-right" : "text-left"
                      }`}
                    >
                      <div
                        className={`flex items-center gap-2 ${
                          isRTL ? "flex-row" : ""
                        }`}
                      >
                        <FaUser className="w-4 h-4 text-gray-400 flex-shrink-0" />
                        <span>{task.employee_name}</span>
                      </div>

                      {task.device_model && (
                        <div>
                          <span className="font-medium">
                            {t("tasks.deviceModel")}:
                          </span>{" "}
                          {task.device_model}
                        </div>
                      )}

                      {task.serial_number && (
                        <div>
                          <span className="font-medium">
                            {t("tasks.serialNumber")}:
                          </span>{" "}
                          {task.serial_number}
                        </div>
                      )}

                      {task.reported_issue && (
                        <div className="md:col-span-2">
                          <span className="font-medium">
                            {t("tasks.reportedIssue")}:
                          </span>{" "}
                          {task.reported_issue}
                        </div>
                      )}
                    </div>

                    {/* Action Buttons */}
                    <div
                      className={`mt-4 pt-3 flex gap-2 ${
                        isRTL ? "flex-row-reverse justify-end" : "justify-end"
                      }`}
                    >
                      {/* View Button */}
                      <button
                        onClick={() => handleViewTask(task)}
                        className=" text-sm md:text-muted lg:text-base px-3 md:px-4 py-1 md:py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors flex items-center gap-2 "
                      >
                        <FaEye className="size-3 md:size-5" />
                        {t("common.view")}
                      </button>

                      {/* Edit Button */}
                      {canEditTask(task) && (
                        <button
                          onClick={() => handleEditTask(task)}
                          className=" text-sm md:text-muted lg:text-base px-3 md:px-4 py-1 md:py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 "
                        >
                          <FaEdit className="size-3 md:size-5" />
                          {t("common.edit")}
                        </button>
                      )}

                      {/* Complete Button */}
                      {canCompleteTask(task) && (
                        <button
                          onClick={() => handleCompleteTask(task)}
                          disabled={loadingTaskId === task.id}
                          className=" text-sm md:text-muted lg:text-base px-3 md:px-4 py-1 md:py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2  disabled:opacity-50"
                        >
                          {loadingTaskId === task.id ? (
                            <>
                              <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                              {t("common.loading")}
                            </>
                          ) : (
                            <>
                              <MdOutlineFileDownloadDone className="size-6" />
                              {t("dayTasks.complete")}
                            </>
                          )}
                        </button>
                      )}
                    </div>

                    {/* Task Dates */}
                    <div
                      className={`mt-3 pt-3 border-t border-gray-100  text-gray-500 text-sm md:text-md ${
                        isRTL ? "text-right" : "text-left"
                      }`}
                    >
                      <div
                        className={`flex justify-between ${
                          isRTL ? "flex-row-reverse" : ""
                        }`}
                      >
                        <span>
                          {t("dayTasks.created")}: {formatDate(task.created_at)}
                        </span>
                        <span>
                          {t("tasks.deadline")}: {formatDate(task.deadline)}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          <div
            className={`border-t border-gray-200 px-6 py-4 bg-gray-50 ${
              isRTL ? "text-right" : "text-left"
            }`}
          >
            <div
              className={`flex justify-center items-center ${
                isRTL ? "flex-row-reverse" : ""
              }`}
            >
              <div className="flex gap-3">
                <button
                  onClick={handleAddNewTask}
                  className=" text-sm md:text-muted lg:text-base px-3 md:px-4 py-1 md:py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
                >
                  <FaPlus className="size-3 md:size-5" />
                  {t("dayTasks.addNewTask")}
                </button>
                <button
                  onClick={onClose}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  {t("common.close")}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <TaskModal
        isOpen={isCreateTaskModalOpen}
        onClose={() => setIsCreateTaskModalOpen(false)}
        onSuccess={handleTaskCreated}
        initialTaskDate={selectedDate}
      />

      <TaskModal
        isOpen={isEditTaskModalOpen}
        onClose={() => setIsEditTaskModalOpen(false)}
        onSuccess={handleTaskUpdated}
        editTask={selectedTask}
      />

      <TaskModal
        isOpen={isViewTaskModalOpen}
        onClose={() => setIsViewTaskModalOpen(false)}
        viewOnly={true}
        editTask={selectedTask}
      />
    </>
  );
};

export default DayTasksModal;
