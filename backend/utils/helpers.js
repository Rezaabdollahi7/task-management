// utils/helpers.js
// Utility helper functions

// Format date to Persian/Jalali (placeholder - can be extended)
const formatDate = (date) => {
  if (!date) return null;
  return new Date(date).toISOString();
};

// Calculate duration between two timestamps
const calculateDuration = (startTime, endTime) => {
  if (!startTime || !endTime) return null;

  const start = new Date(startTime);
  const end = new Date(endTime);
  const diffMs = end - start;

  const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));

  if (days > 0) {
    return `${days} days ${hours} hours`;
  } else if (hours > 0) {
    return `${hours} hours ${minutes} minutes`;
  } else {
    return `${minutes} minutes`;
  }
};

// Check if task is overdue
const isTaskOverdue = (deadline, status) => {
  if (!deadline || status === "completed" || status === "cancelled") {
    return false;
  }
  return new Date(deadline) < new Date();
};

// Sanitize user input
const sanitizeInput = (input) => {
  if (typeof input !== "string") return input;
  return input.trim();
};

// Validate email format (for future use)
const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Generate random string (for tokens, etc.)
const generateRandomString = (length = 32) => {
  return require("crypto").randomBytes(length).toString("hex");
};

module.exports = {
  formatDate,
  calculateDuration,
  isTaskOverdue,
  sanitizeInput,
  isValidEmail,
  generateRandomString,
};
