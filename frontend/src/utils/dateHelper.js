// src/utils/dateHelper.js
// Date utility functions for Gregorian and Persian (Jalali) dates

import moment from 'moment-jalaali';

// Configure moment-jalaali
moment.loadPersian({ usePersianDigits: false }); // Use English digits

/**
 * Format date based on current language
 * @param {string|Date} date - Date to format
 * @param {string} lang - Language code ('en' or 'fa')
 * @param {string} format - Format string (optional)
 * @returns {string} Formatted date string
 */
export const formatDate = (date, lang = 'en', format = null) => {
  if (!date) return 'N/A';
  
  const m = moment(date);
  
  if (lang === 'fa') {
    // Persian date
    return format ? m.format(format) : m.format('jYYYY/jMM/jDD');
  } else {
    // Gregorian date
    return format ? m.format(format) : m.format('YYYY/MM/DD');
  }
};

/**
 * Format date with month name
 * @param {string|Date} date - Date to format
 * @param {string} lang - Language code ('en' or 'fa')
 * @returns {string} Formatted date with month name
 */
export const formatDateWithMonth = (date, lang = 'en') => {
  if (!date) return 'N/A';
  
  const m = moment(date);
  
  if (lang === 'fa') {
    return m.format('jD jMMMM jYYYY'); // 19 آبان 1403
  } else {
    return m.format('DD MMMM YYYY'); // 09 November 2024
  }
};

/**
 * Get today's date in ISO format
 * @returns {string} Today's date in ISO format
 */
export const getTodayISO = () => {
  return moment().format('YYYY-MM-DD');
};

/**
 * Get date range for quick filters
 * @param {string} range - Range type ('today', 'week', 'month')
 * @returns {object} Start and end dates in ISO format
 */
export const getDateRange = (range) => {
  const today = moment();
  
  switch (range) {
    case 'today':
      return {
        startDate: today.format('YYYY-MM-DD'),
        endDate: today.format('YYYY-MM-DD'),
      };
    
    case 'week':
      return {
        startDate: today.startOf('week').format('YYYY-MM-DD'),
        endDate: today.endOf('week').format('YYYY-MM-DD'),
      };
    
    case 'month':
      return {
        startDate: today.startOf('month').format('YYYY-MM-DD'),
        endDate: today.endOf('month').format('YYYY-MM-DD'),
      };
    
    default:
      return { startDate: '', endDate: '' };
  }
};

/**
 * Convert Jalali date to Gregorian (ISO)
 * @param {string} jalaliDate - Jalali date string (YYYY/MM/DD)
 * @returns {string} Gregorian date in ISO format
 */
export const jalaliToGregorian = (jalaliDate) => {
  if (!jalaliDate) return '';
  
  try {
    const m = moment(jalaliDate, 'jYYYY/jMM/jDD');
    return m.format('YYYY-MM-DD');
  } catch (error) {
    console.error('Invalid Jalali date:', error);
    return '';
  }
};

/**
 * Convert Gregorian date to Jalali
 * @param {string} gregorianDate - Gregorian date (YYYY-MM-DD)
 * @returns {string} Jalali date string (YYYY/MM/DD)
 */
export const gregorianToJalali = (gregorianDate) => {
  if (!gregorianDate) return '';
  
  try {
    const m = moment(gregorianDate);
    return m.format('jYYYY/jMM/jDD');
  } catch (error) {
    console.error('Invalid Gregorian date:', error);
    return '';
  }
};

/**
 * Get current date in Jalali format
 * @returns {string} Current Jalali date (YYYY/MM/DD)
 */
export const getCurrentJalaliDate = () => {
  return moment().format('jYYYY/jMM/jDD');
};

/**
 * Check if date is overdue
 * @param {string|Date} date - Date to check
 * @returns {boolean} True if date is in the past
 */
export const isOverdue = (date) => {
  if (!date) return false;
  return moment(date).isBefore(moment(), 'day');
};

/**
 * Get relative time (e.g., "2 days ago", "in 3 hours")
 * @param {string|Date} date - Date to compare
 * @param {string} lang - Language code ('en' or 'fa')
 * @returns {string} Relative time string
 */
export const getRelativeTime = (date, lang = 'en') => {
  if (!date) return 'N/A';
  
  moment.locale(lang === 'fa' ? 'fa' : 'en');
  return moment(date).fromNow();
};