// src/components/Calendar/DayTasksModal.jsx
import React, { useState } from "react";
import {
  FaTimes,
  FaUser,
  FaCalendar,
  FaFlag,
  FaCircle,
  FaPlus,
} from "react-icons/fa";
import { useTranslation } from "react-i18next";
import TaskModal from "../TaskModal";

const DayTasksModal = ({
  isOpen,
  onClose,
  selectedDate,
  tasks,
  onTaskCreated,
}) => {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === "fa";

  const [isCreateTaskModalOpen, setIsCreateTaskModalOpen] = useState(false);

  if (!isOpen) return null;

  const getPriorityColor = (priority) => {
    const colors = {
      urgent: "text-red-600 bg-red-50",
      high: "text-orange-600 bg-orange-50",
      medium: "text-yellow-600 bg-yellow-50",
      low: "text-green-600 bg-green-50",
    };
    return colors[priority] || "text-gray-600 bg-gray-50";
  };

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

  const getTaskStatusText = (status) => {
    const statusMap = {
      open: isRTL ? "باز" : "Open",
      in_progress: isRTL ? "در حال انجام" : "In Progress",
      completed: isRTL ? "تکمیل شده" : "Completed",
      cancelled: isRTL ? "لغو شده" : "Cancelled",
    };
    return statusMap[status] || status;
  };

  const getTaskPriorityText = (priority) => {
    const priorityMap = {
      urgent: isRTL ? "فوری" : "Urgent",
      high: isRTL ? "بالا" : "High",
      medium: isRTL ? "متوسط" : "Medium",
      low: isRTL ? "پایین" : "Low",
    };
    return priorityMap[priority] || priority;
  };

  const handleTaskCreated = () => {
    setIsCreateTaskModalOpen(false);
    if (onTaskCreated) {
      onTaskCreated();
    }
  };

  const handleAddNewTask = () => {
    setIsCreateTaskModalOpen(true);
  };

  return (
    <>
      <div
        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
        dir={isRTL ? "rtl" : "ltr"}
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
                {isRTL ? "تسک‌های روز" : "Day Tasks"}
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
            {tasks.length === 0 ? (
              <div className="text-center py-8">
                <FaCalendar className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 text-lg">
                  {isRTL
                    ? "هیچ تسکی برای این روز وجود ندارد"
                    : "No tasks for this day"}
                </p>

                <button
                  onClick={handleAddNewTask}
                  className="mt-4 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 mx-auto"
                >
                  <FaPlus className="w-4 h-4" />
                  {isRTL ? "افزودن تسک جدید" : "Add New Task"}
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex justify-end mb-4">
                  <button
                    onClick={handleAddNewTask}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
                  >
                    <FaPlus className="w-4 h-4" />
                    {isRTL ? "افزودن تسک جدید" : "Add New Task"}
                  </button>
                </div>

                {tasks.map((task) => (
                  <div
                    key={task.id}
                    className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
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
                          className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${getPriorityColor(
                            task.priority
                          )}`}
                        >
                          <FaFlag className="w-3 h-3" />
                          {getTaskPriorityText(task.priority)}
                        </span>
                        <span
                          className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                            task.status
                          )}`}
                        >
                          <FaCircle className="w-2 h-2" />
                          {getTaskStatusText(task.status)}
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
                            {isRTL ? "دستگاه:" : "Device:"}
                          </span>{" "}
                          {task.device_model}
                        </div>
                      )}

                      {task.serial_number && (
                        <div>
                          <span className="font-medium">
                            {isRTL ? "سریال:" : "Serial:"}
                          </span>{" "}
                          {task.serial_number}
                        </div>
                      )}

                      {task.reported_issue && (
                        <div className="md:col-span-2">
                          <span className="font-medium">
                            {isRTL ? "مشکل گزارش شده:" : "Reported Issue:"}
                          </span>{" "}
                          {task.reported_issue}
                        </div>
                      )}
                    </div>

                    {/* Task Dates */}
                    <div
                      className={`mt-3 pt-3 border-t border-gray-100 text-xs text-gray-500 ${
                        isRTL ? "text-right" : "text-left"
                      }`}
                    >
                      <div
                        className={`flex justify-between ${
                          isRTL ? "flex-row-reverse" : ""
                        }`}
                      >
                        <span>
                          {isRTL ? "تاریخ ایجاد:" : "Created:"}{" "}
                          {formatDate(task.created_at)}
                        </span>
                        <span>
                          {isRTL ? "ددلاین:" : "Deadline:"}{" "}
                          {formatDate(task.deadline)}
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
              className={`flex justify-between items-center ${
                isRTL ? "flex-row-reverse" : ""
              }`}
            >
              <div className="text-sm text-gray-600">
                {tasks.length}{" "}
                {isRTL ? "تسک" : tasks.length === 1 ? "task" : "tasks"}
              </div>
              <div className="flex gap-3">
                <button
                  onClick={handleAddNewTask}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
                >
                  <FaPlus className="w-4 h-4" />
                  {isRTL ? "افزودن تسک جدید" : "Add New Task"}
                </button>
                <button
                  onClick={onClose}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  {isRTL ? "بستن" : "Close"}
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
    </>
  );
};

export default DayTasksModal;
