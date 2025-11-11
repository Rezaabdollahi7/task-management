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
  FaFilter,
  FaCalendarDay,
  FaCalendarWeek,
  FaCalendar,
  FaArrowLeft,
  FaArrowRight,
} from "react-icons/fa";
import AppLayout from "../../components/Layout/AppLayout";
import DayTasksModal from "../../components/Calendar/DayTasksModal";

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
  const [allTasks, setAllTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState(Views.MONTH);
  const [date, setDate] = useState(new Date());
  const [filters, setFilters] = useState({
    status: "",
    priority: "",
    employeeId: "",
  });
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // State for modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedDateTasks, setSelectedDateTasks] = useState([]);

  // Fetch all tasks for the current view range
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

      setAllTasks(tasks);

      // Create events with dots instead of full task details
      const eventsByDate = {};
      tasks.forEach((task) => {
        const taskDate = moment(task.task_date).format("YYYY-MM-DD");
        if (!eventsByDate[taskDate]) {
          eventsByDate[taskDate] = {
            urgent: 0,
            high: 0,
            medium: 0,
            low: 0,
          };
        }
        eventsByDate[taskDate][task.priority]++;
      });

      const calendarEvents = Object.keys(eventsByDate).map((date) => ({
        id: date,
        title: "", // Empty title to hide text
        start: new Date(date),
        end: new Date(date),
        allDay: true,
        resource: {
          date: date,
          priorities: eventsByDate[date],
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

  // Handle day click
  const handleSelectSlot = (slotInfo) => {
    const selectedDate = moment(slotInfo.start).format("YYYY-MM-DD");
    const tasksForDate = allTasks.filter(
      (task) => moment(task.task_date).format("YYYY-MM-DD") === selectedDate
    );

    setSelectedDate(selectedDate);
    setSelectedDateTasks(tasksForDate);
    setIsModalOpen(true);
  };

  // Custom event component showing priority dots
  const CustomEvent = ({ event }) => {
    const { priorities } = event.resource;

    return (
      <div className="w-full h-full flex justify-center items-center gap-1 p-1">
        {priorities.urgent > 0 && (
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 bg-red-600 rounded-full"></div>
            {priorities.urgent > 1 && (
              <span className="text-xs text-red-600">{priorities.urgent}</span>
            )}
          </div>
        )}
        {priorities.high > 0 && (
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 bg-orange-600 rounded-full"></div>
            {priorities.high > 1 && (
              <span className="text-xs text-orange-600">{priorities.high}</span>
            )}
          </div>
        )}
        {priorities.medium > 0 && (
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 bg-yellow-600 rounded-full"></div>
            {priorities.medium > 1 && (
              <span className="text-xs text-yellow-600">
                {priorities.medium}
              </span>
            )}
          </div>
        )}
        {priorities.low > 0 && (
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 bg-green-600 rounded-full"></div>
            {priorities.low > 1 && (
              <span className="text-xs text-green-600">{priorities.low}</span>
            )}
          </div>
        )}
      </div>
    );
  };

  // No event styling needed since we're just showing dots
  const eventStyleGetter = () => {
    return {
      style: {
        backgroundColor: "transparent",
        border: "none",
        padding: 0,
        margin: 0,
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

  if (loading) {
    return (
      <AppLayout
        title={t("navigation.calendar")}
        subtitle={t("calendar.subtitle")}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
      >
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-64 mb-6"></div>
          <div className="bg-white rounded-lg h-96"></div>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout
      title={t("navigation.calendar")}
      subtitle={t("calendar.subtitle") + " - " + t("calendar.clickToView")}
      sidebarOpen={sidebarOpen}
      setSidebarOpen={setSidebarOpen}
    >
      {/* Calendar Content */}
      <div className="max-w-[90rem] mx-auto" id="calendar">
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
            selectable
            onSelectSlot={handleSelectSlot}
          />
        </div>

        {/* Legend */}
        <div className="mt-6 bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            {t("calendar.legend")}
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-red-600 rounded-full"></div>
              <span className="text-sm text-gray-700">
                {t("tasks.priorities.urgent")}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-orange-600 rounded-full"></div>
              <span className="text-sm text-gray-700">
                {t("tasks.priorities.high")}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-yellow-600 rounded-full"></div>
              <span className="text-sm text-gray-700">
                {t("tasks.priorities.medium")}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-600 rounded-full"></div>
              <span className="text-sm text-gray-700">
                {t("tasks.priorities.low")}
              </span>
            </div>
          </div>
          <p className="text-sm text-gray-600 mt-4">
            {t("calendar.clickToView")}
          </p>
        </div>
      </div>

      {/* Day Tasks Modal */}
      <DayTasksModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        selectedDate={selectedDate}
        tasks={selectedDateTasks}
      />
    </AppLayout>
  );
};

export default CalendarPage;
