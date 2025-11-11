// src/pages/Calendar.jsx
import React, { useState, useEffect, useCallback } from "react";
import { Calendar, momentLocalizer, Views } from "react-big-calendar";
import moment from "moment";
import "moment-jalaali";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { tasksAPI } from "../../services/api";
import { useAuth } from "../../context/AuthContext";
import { useTranslation } from "react-i18next";
import {
  FaCalendarAlt,
  FaFilter,
  FaList,
  FaCalendarDay,
  FaCalendarWeek,
  FaCalendar,
  FaArrowLeft,
  FaArrowRight,
} from "react-icons/fa";

const localizer = momentLocalizer(moment);

const configureMomentForPersian = () => {
  moment.locale("fa", {
    months:
      "فروردین_اردیبهشت_خرداد_تیر_مرداد_شهریور_مهر_آبان_آذر_دی_بهمن_اسفند".split(
        "_"
      ),
    monthsShort:
      "فروردین_اردیبهشت_خرداد_تیر_مرداد_شهریور_مهر_آبان_آذر_دی_بهمن_اسفند".split(
        "_"
      ),
    weekdays: "یکشنبه_دوشنبه_سه‌شنبه_چهارشنبه_پنجشنبه_جمعه_شنبه".split("_"),
    weekdaysShort: "یک‌شنبه_دو‌شنبه_سه‌شنبه_چهارشنبه_پنج‌شنبه_جمعه_شنبه".split(
      "_"
    ),
    weekdaysMin: "ی_د_س_چ_پ_ج_ش".split("_"),
    week: {
      dow: 6,
      doy: 12,
    },
  });
};

const CalendarPage = () => {
  const { user, isManager } = useAuth();
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === "fa";

  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState(Views.MONTH);
  const [date, setDate] = useState(new Date());
  const [filters, setFilters] = useState({
    status: "",
    priority: "",
    employeeId: "",
  });

  // Fetch tasks for calendar
  const fetchTasks = useCallback(async () => {
    try {
      setLoading(true);

      // Calculate date range based on current view
      let startDate, endDate;
      const currentDate = moment(date);

      switch (view) {
        case Views.MONTH:
          startDate = currentDate.startOf("month").format("YYYY-MM-DD");
          endDate = currentDate.endOf("month").format("YYYY-MM-DD");
          break;
        case Views.WEEK:
          startDate = currentDate.startOf("week").format("YYYY-MM-DD");
          endDate = currentDate.endOf("week").format("YYYY-MM-DD");
          break;
        case Views.DAY:
          startDate = currentDate.format("YYYY-MM-DD");
          endDate = currentDate.format("YYYY-MM-DD");
          break;
        default:
          startDate = currentDate.startOf("month").format("YYYY-MM-DD");
          endDate = currentDate.endOf("month").format("YYYY-MM-DD");
      }

      const params = {
        startDate,
        endDate,
        ...filters,
      };

      // If employee, only show their tasks
      if (!isManager()) {
        params.employeeId = user.id;
      }

      const response = await tasksAPI.getAll(params);
      const tasks = response.data.tasks;

      // Convert tasks to calendar events
      const calendarEvents = tasks.map((task) => ({
        id: task.id,
        title: task.title,
        start: new Date(task.task_date),
        end: new Date(task.deadline),
        allDay: true,
        resource: {
          task: task,
          status: task.status,
          priority: task.priority,
          employee: task.employee_name,
        },
      }));

      setEvents(calendarEvents);
    } catch (error) {
      console.error("Failed to fetch tasks for calendar:", error);
    } finally {
      setLoading(false);
    }
  }, [date, view, filters, user.id, isManager]);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  useEffect(() => {
    if (isRTL) {
      configureMomentForPersian();
      moment.locale("fa");
    } else {
      moment.locale("en");
    }
  }, [isRTL]);

  // Event style based on priority and status
  const eventStyleGetter = (event) => {
    let backgroundColor = "#3174ad"; // default blue
    let borderColor = "#3174ad";
    let color = "white";

    // Priority-based colors
    switch (event.resource.priority) {
      case "urgent":
        backgroundColor = "#dc2626"; // red-600
        borderColor = "#dc2626";
        break;
      case "high":
        backgroundColor = "#ea580c"; // orange-600
        borderColor = "#ea580c";
        break;
      case "medium":
        backgroundColor = "#ca8a04"; // yellow-600
        borderColor = "#ca8a04";
        break;
      case "low":
        backgroundColor = "#16a34a"; // green-600
        borderColor = "#16a34a";
        break;
      default:
        backgroundColor = "#3174ad";
        borderColor = "#3174ad";
    }

    // Status-based styling
    if (event.resource.status === "completed") {
      backgroundColor = "#16a34a"; // green-600
      borderColor = "#16a34a";
    } else if (event.resource.status === "cancelled") {
      backgroundColor = "#6b7280"; // gray-500
      borderColor = "#6b7280";
      color = "#f3f4f6";
    }

    return {
      style: {
        backgroundColor,
        borderColor,
        color,
        borderRadius: "4px",
        border: "none",
        fontSize: "12px",
        padding: "2px 4px",
        cursor: "pointer",
      },
    };
  };

  // Custom toolbar component
  const CustomToolbar = ({ onNavigate, label, date }) => {
    const formatDateForDisplay = (date) => {
      if (isRTL) {
        const jDate = moment(date);

        switch (view) {
          case Views.MONTH:
            return jDate.format("jMMMM jYYYY");
          case Views.WEEK:
            const startOfWeek = moment(date).startOf("week");
            const endOfWeek = moment(date).endOf("week");
            return `هفته ${startOfWeek.format(
              "jD jMMMM"
            )} تا ${endOfWeek.format("jD jMMMM jYYYY")}`;
          case Views.DAY:
            return jDate.format("dddd، jD jMMMM jYYYY");
          default:
            return jDate.format("jD jMMMM jYYYY");
        }
      }
      return label;
    };

    return (
      <div className="flex flex-col sm:flex-row justify-between items-center mb-4 gap-4">
        <div className="flex items-center gap-2">
          <button
            onClick={() => onNavigate("PREV")}
            className="p-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            {isRTL ? (
              <FaArrowRight className="w-4 h-4" />
            ) : (
              <FaArrowLeft className="w-4 h-4" />
            )}
          </button>

          <button
            onClick={() => onNavigate("TODAY")}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
          >
            {t("calendar.today")}
          </button>

          <button
            onClick={() => onNavigate("NEXT")}
            className="p-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            {isRTL ? (
              <FaArrowLeft className="w-4 h-4" />
            ) : (
              <FaArrowRight className="w-4 h-4" />
            )}
          </button>
        </div>

        <h2 className="text-lg font-semibold text-gray-900">
          {formatDateForDisplay(date)}
        </h2>

        <div className="flex items-center gap-2">
          <select
            value={view}
            onChange={(e) => setView(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value={Views.MONTH}>
              <FaCalendar className="inline mr-2" />
              {t("calendar.month")}
            </option>
            <option value={Views.WEEK}>
              <FaCalendarWeek className="inline mr-2" />
              {t("calendar.week")}
            </option>
            <option value={Views.DAY}>
              <FaCalendarDay className="inline mr-2" />
              {t("calendar.day")}
            </option>
          </select>
        </div>
      </div>
    );
  };

  const getCalendarMessages = () => {
    if (isRTL) {
      return {
        today: "امروز",
        previous: "قبلی",
        next: "بعدی",
        month: "ماه",
        week: "هفته",
        day: "روز",
        agenda: "برنامه",
        date: "تاریخ",
        time: "زمان",
        event: "رویداد",
        noEventsInRange: "رویدادی در این بازه وجود ندارد",
        showMore: (total) => `+${total} بیشتر`,
      };
    }
    return {
      today: t("calendar.today"),
      previous: t("calendar.previous"),
      next: t("calendar.next"),
      month: t("calendar.month"),
      week: t("calendar.week"),
      day: t("calendar.day"),
      agenda: t("calendar.agenda"),
      date: t("calendar.date"),
      time: t("calendar.time"),
      event: t("calendar.event"),
      noEventsInRange: t("calendar.noEventsInRange"),
      showMore: (total) => `+${total} ${t("calendar.more")}`,
    };
  };
  // Custom event component
  const CustomEvent = ({ event }) => {
    return (
      <div className="w-full h-full p-1">
        <div className="text-xs font-medium truncate">{event.title}</div>
        <div className="text-xs opacity-75 truncate">
          {event.resource.employee}
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-64 mb-6"></div>
            <div className="bg-white rounded-lg h-96"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-[90rem] mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <FaCalendarAlt className="w-8 h-8 text-blue-600" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  {t("navigation.calendar")}
                </h1>
                <p className="text-sm text-gray-600">
                  {t("calendar.subtitle")}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              {/* Filter Button - Only for managers */}
              {isManager() && (
                <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                  <FaFilter className="w-4 h-4" />
                  <span>{t("calendar.filters")}</span>
                </button>
              )}

              <button
                onClick={fetchTasks}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                {t("calendar.refresh")}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Calendar */}
      <div className="max-w-[90rem] mx-auto p-4 sm:p-6 lg:p-8" id="calendar">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6">
          <Calendar
            localizer={localizer}
            events={events}
            startAccessor="start"
            endAccessor="end"
            style={{ height: 800 }}
            view={view}
            date={date}
            onView={setView}
            onNavigate={setDate}
            eventPropGetter={eventStyleGetter}
            components={{
              toolbar: (props) => <CustomToolbar {...props} date={date} />,
              event: CustomEvent,
            }}
            messages={getCalendarMessages()}
            rtl={isRTL}
          />
        </div>

        {/* Legend */}
        <div className="mt-6 bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            {t("calendar.legend")}
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-red-600 rounded"></div>
              <span className="text-sm text-gray-700">
                {t("tasks.priorities.urgent")}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-orange-600 rounded"></div>
              <span className="text-sm text-gray-700">
                {t("tasks.priorities.high")}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-yellow-600 rounded"></div>
              <span className="text-sm text-gray-700">
                {t("tasks.priorities.medium")}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-green-600 rounded"></div>
              <span className="text-sm text-gray-700">
                {t("tasks.priorities.low")}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-gray-500 rounded"></div>
              <span className="text-sm text-gray-700">
                {t("tasks.statuses.cancelled")}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-blue-600 rounded"></div>
              <span className="text-sm text-gray-700">
                {t("tasks.statuses.completed")}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CalendarPage;
