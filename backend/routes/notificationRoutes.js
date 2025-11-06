// routes/notificationRoutes.js
// Notification routes

const express = require("express");
const router = express.Router();
const {
  getNotifications,
  getUnreadCount,
  markAsRead,
  markAllAsRead,
  deleteNotification,
  deleteAllNotifications,
} = require("../controllers/notificationController");
const { auth } = require("../middleware/auth");

// All routes require authentication
router.use(auth);

// @route   GET /api/notifications
// @desc    Get all notifications for current user
// @access  Private
router.get("/", getNotifications);

// @route   GET /api/notifications/unread-count
// @desc    Get unread notification count
// @access  Private
router.get("/unread-count", getUnreadCount);

// @route   PATCH /api/notifications/mark-all-read
// @desc    Mark all notifications as read
// @access  Private
router.patch("/mark-all-read", markAllAsRead);

// @route   PATCH /api/notifications/:id/read
// @desc    Mark notification as read
// @access  Private
router.patch("/:id/read", markAsRead);

// @route   DELETE /api/notifications
// @desc    Delete all notifications
// @access  Private
router.delete("/", deleteAllNotifications);

// @route   DELETE /api/notifications/:id
// @desc    Delete a notification
// @access  Private
router.delete("/:id", deleteNotification);

module.exports = router;
