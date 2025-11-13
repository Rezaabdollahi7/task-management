// src/components/UserModal.jsx
// Modal component for creating and editing users

import { useState, useEffect } from "react";
import { usersAPI } from "../services/api";
import { showSuccess, showError } from "../utils/toast";
import { useTranslation } from "react-i18next";
import { useModal } from "../../hooks/useModal";

const UserModal = ({ isOpen, onClose, onSuccess, editUser = null }) => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    fullName: "",
    username: "",
    password: "",
    role: "employee",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { handleBackdropClick } = useModal(isOpen, onClose);

  // Load user data when editing
  useEffect(() => {
    if (editUser) {
      setFormData({
        fullName: editUser.full_name,
        username: editUser.username,
        password: "",
        role: editUser.role,
      });
    } else {
      setFormData({
        fullName: "",
        username: "",
        password: "",
        role: "employee",
      });
    }
    setError("");
  }, [editUser, isOpen]);

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
      if (!formData.fullName || !formData.username) {
        setError(t("users.messages.requiredFields"));
        setLoading(false);
        return;
      }

      if (!editUser && !formData.password) {
        setError(t("users.messages.passwordRequired"));
        setLoading(false);
        return;
      }

      if (formData.password && formData.password.length < 6) {
        setError(t("users.messages.passwordMinLength"));
        setLoading(false);
        return;
      }

      if (editUser) {
        // Update existing user
        const updateData = {
          full_name: formData.fullName,
          username: formData.username,
          role: formData.role,
        };
        await usersAPI.update(editUser.id, updateData);
        showSuccess(t("users.messages.updateSuccess"));

        // Update password if provided
        if (formData.password) {
          await usersAPI.updatePassword(editUser.id, formData.password);
        }
      } else {
        // Create new user
        await usersAPI.create(formData);
        showSuccess(t("users.messages.createSuccess"));
      }

      setLoading(false);
      onSuccess();
      onClose();
    } catch (err) {
      setError(err.message || t("common.error"));
      setLoading(false);
    }
  };

  // Don't render if not open
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      onClick={handleBackdropClick}
    >
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">
            {editUser ? t("users.editUser") : t("users.createUser")}
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

          {/* Full Name */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t("users.fullName")} *
            </label>
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder={t("users.placeholders.fullName")}
              disabled={loading}
            />
          </div>

          {/* Username */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t("users.username")} *
            </label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder={t("users.placeholders.username")}
              disabled={loading}
            />
          </div>

          {/* Password */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t("users.password")}{" "}
              {editUser ? t("users.placeholders.passwordEdit") : " *"}
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder={
                editUser
                  ? t("users.placeholders.newPassword")
                  : t("users.placeholders.enterPassword")
              }
              disabled={loading}
            />
            {!editUser && (
              <p className="mt-1 text-xs text-gray-500">
                {t("users.messages.passwordMinLengthInfo")}
              </p>
            )}
          </div>

          {/* Role */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t("users.role")} *
            </label>
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              disabled={loading}
            >
              <option value="employee">{t("users.roles.employee")}</option>
              <option value="manager">{t("users.roles.manager")}</option>
            </select>
          </div>

          {/* Buttons */}
          <div className="flex gap-3">
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
              ) : editUser ? (
                t("users.editUser")
              ) : (
                t("users.createUser")
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserModal;
