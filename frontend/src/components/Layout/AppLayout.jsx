// src/components/Layout/AppLayout.jsx
import React from "react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { FaBars, FaTimes } from "react-icons/fa";
import { LuCalendar1 } from "react-icons/lu";
import { MdOutlineTaskAlt } from "react-icons/md";
import { RiNotification3Line } from "react-icons/ri";
import { RxDashboard } from "react-icons/rx";
import { TbLogout } from "react-icons/tb";
import { HiOutlineUsers } from "react-icons/hi2";
import LanguageSwitcher from "../LanguageSwitcher";
import NotificationBell from "../NotificationBell";

const AppLayout = ({
  children,
  title,
  subtitle,
  sidebarOpen,
  setSidebarOpen,
}) => {
  const { user, logout, isManager } = useAuth();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === "fa";

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  const handleNavigation = (path) => {
    navigate(path);
    setSidebarOpen(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex overflow-x-hidden">
      {/* Overlay - Shows when sidebar is open */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar - Slide-in from side */}
      <aside
        className={`fixed top-0 ${
          isRTL ? "right-0" : "left-0"
        } h-full bg-white shadow-lg z-50 transition-transform duration-300 ease-in-out w-64 flex flex-col ${
          sidebarOpen
            ? "translate-x-0"
            : isRTL
            ? "translate-x-full"
            : "-translate-x-full"
        }`}
      >
        {/* Close button */}
        <div className="flex justify-end items-center p-6 relative">
          <div
            className={`flex container absolute ${
              isRTL
                ? "left-[50%] -translate-x-1/2"
                : "right-[50%] translate-x-1/2"
            } items-center justify-center py-1 -z-10`}
          >
            <img
              src="/icons/full_rounded.png"
              alt="Zero Task"
              className="size-16 mr-[30%]"
            />
            <span className="text-xl absolute italic">ero Task</span>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="text-gray-500 hover:text-gray-700 z-10"
          >
            <FaTimes className="w-6 h-6" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto px-3">
          <div className="space-y-2">
            {/* Dashboard */}
            <button
              onClick={() => handleNavigation("/dashboard")}
              className="w-full flex items-center gap-3 px-4 py-3 text-gray-600 text-lg hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-colors"
            >
              <RxDashboard className="size-6 flex-shrink-0" />
              <span className="font-medium">{t("navigation.dashboard")}</span>
            </button>

            {/* Tasks */}
            <button
              onClick={() => handleNavigation("/tasks")}
              className="w-full flex items-center gap-3 px-4 py-3 text-gray-600 text-lg hover:bg-yellow-50 hover:text-yellow-600 rounded-lg transition-colors"
            >
              <MdOutlineTaskAlt className="size-6 flex-shrink-0" />
              <span className="font-medium">{t("navigation.tasks")}</span>
            </button>

            {/* Calendar */}
            <button
              onClick={() => handleNavigation("/calendar")}
              className="w-full flex items-center gap-3 px-4 py-3 text-gray-600 text-lg hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
            >
              <LuCalendar1 className="size-6 flex-shrink-0" />
              <span className="font-medium">{t("navigation.calendar")}</span>
            </button>

            {/* Users - Manager Only */}
            {isManager() && (
              <button
                onClick={() => handleNavigation("/users")}
                className="w-full flex items-center gap-3 px-4 py-3 text-gray-700 text-lg hover:bg-purple-50 hover:text-purple-600 rounded-lg transition-colors"
              >
                <HiOutlineUsers className="size-6 flex-shrink-0" />
                <span className="font-medium">{t("navigation.users")}</span>
              </button>
            )}

            {/* Notifications */}
            <button
              onClick={() => handleNavigation("/notifications")}
              className="w-full flex items-center gap-3 px-4 py-3 text-gray-700 text-lg hover:bg-green-50 hover:text-green-600 rounded-lg transition-colors"
            >
              <RiNotification3Line className="size-6 flex-shrink-0" />
              <span className="font-medium">
                {t("navigation.notifications")}
              </span>
            </button>
          </div>
        </nav>

        {/* User Info & Logout */}
        <div className="user-info flex flex-row-reverse items-center justify-between px-4 border-t border-gray-200">
          {/* Logout button */}
          <div>
            <button
              onClick={handleLogout}
              className="text-gray-700 hover:bg-red-50 hover:text-red-600 p-4 rounded-lg transition-colors"
            >
              <TbLogout className="size-6 flex-shrink-0" />
            </button>
          </div>

          {/* User info */}
          <div className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
                {user?.fullName?.charAt(0).toUpperCase()}
              </div>
              <div className="min-w-0">
                <p className="font-semibold text-gray-900 truncate">
                  {user?.fullName}
                </p>
                <p className="text-xs text-gray-500 capitalize">
                  {t(`users.roles.${user?.role}`)}
                </p>
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* Main content - Full width */}
      <div className="flex-1 w-full">
        {/* Header - Sticky */}
        <header className="bg-white shadow-sm sticky top-0 z-30">
          <div className="px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-3">
                {/* Hamburger menu button */}
                <button
                  onClick={() => setSidebarOpen(true)}
                  className="text-gray-600 hover:text-gray-900 p-2"
                >
                  <FaBars className="w-6 h-6" />
                </button>
                <div>
                  <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
                    {title}
                  </h1>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <LanguageSwitcher />
                <NotificationBell />
              </div>
            </div>
          </div>
        </header>

        {/* Main Content - Scrollable */}
        <main className="px-4 sm:px-6 lg:px-8 py-6 sm:py-8 bg-[#FAFAFB] min-h-[calc(100vh-73px)]">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AppLayout;
