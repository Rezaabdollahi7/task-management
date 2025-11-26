// src/components/DatePicker/BilingualDatePicker.jsx
// Bilingual Date Picker component supporting Persian (Jalali) and Gregorian calendars

import { useState, useEffect, useRef } from "react";
import DatePicker from "react-multi-date-picker";
import DateObject from "react-date-object";
import persian from "react-date-object/calendars/persian";
import gregorian from "react-date-object/calendars/gregorian";
import persian_fa from "react-date-object/locales/persian_fa";
import gregorian_en from "react-date-object/locales/gregorian_en";
import { useTranslation } from "react-i18next";

const BilingualDatePicker = ({
  value,
  onChange,
  placeholder,
  disabled = false,
  minDate = null,
  maxDate = null,
  className = "",
}) => {
  const { i18n } = useTranslation();
  const isPersian = i18n.language === "fa";
  const [dateValue, setDateValue] = useState(null);

  const currentCalendar = isPersian ? persian : gregorian;
  const currentLocale = isPersian ? persian_fa : gregorian_en;

  useEffect(() => {
    if (value) {
      try {
        const dateObj = new DateObject({
          date: value,
          format: "YYYY-MM-DD",
        });

        const convertedDate = dateObj.convert(currentCalendar, currentLocale);

        setDateValue(convertedDate);
      } catch (error) {
        console.error("Invalid date:", value, error);
        setDateValue(null);
      }
    } else {
      setDateValue(null);
    }
  }, [value]);

  // Handle date change
  const handleChange = (date) => {
    if (date && date.isValid) {
      let workingDate = date;

      if (isPersian && date.calendar !== persian) {
        workingDate = new DateObject(date).convert(persian, persian_fa);
      } else if (!isPersian && date.calendar !== gregorian) {
        workingDate = new DateObject(date).convert(gregorian, gregorian_en);
      }

      const gregorianDate = new DateObject(workingDate).convert(gregorian);
      const isoDate = gregorianDate.format("YYYY-MM-DD");

      console.log("📅 Selected date:", {
        display: workingDate.format("YYYY/MM/DD"),
        calendar: isPersian ? "Persian" : "Gregorian",
        iso: isoDate,
      });

      setDateValue(workingDate);
      onChange(isoDate);
    } else {
      setDateValue(null);
      onChange("");
    }
  };

  // Convert min/max dates to DateObject
  const getDateObject = (date) => {
    if (!date) return null;

    try {
      let dateObj;

      if (date instanceof Date) {
        dateObj = new DateObject({ date });
      } else if (typeof date === "string") {
        dateObj = new DateObject({ date, format: "YYYY-MM-DD" });
      } else if (date instanceof DateObject) {
        dateObj = date;
      } else {
        return null;
      }

      return dateObj.convert(currentCalendar, currentLocale);
    } catch (error) {
      console.error("Invalid min/max date:", date, error);
      return null;
    }
  };

  return (
    <DatePicker
      value={dateValue}
      onChange={handleChange}
      calendar={currentCalendar}
      locale={currentLocale}
      format="YYYY/MM/DD"
      placeholder={
        placeholder || (isPersian ? "تاریخ را انتخاب کنید" : "Select date")
      }
      disabled={disabled}
      minDate={getDateObject(minDate)}
      maxDate={getDateObject(maxDate)}
      editable={false}
      className={`blue ${className}`}
      containerClassName="w-full"
      inputClass="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
      style={{
        width: "100%",
      }}
      digits={["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"]}
      inputMode="none"
      arrow={false}
    />
  );
};

export default BilingualDatePicker;
