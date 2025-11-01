// routes/dashboardRoutes.js
// Dashboard routes

const express = require("express");
const router = express.Router();
const {
  getStats,
  getMyStats,
  getEmployeeStats,
  getRecentTasks,
} = require("../controllers/dashboardController");
const { auth, isManager, isEmployee } = require("../middleware/auth");

// All routes require authentication
router.use(auth);

// @route   GET /api/dashboard/stats
// @desc    Get dashboard statistics (overview)
// @access  Private (Manager only)
router.get("/stats", isManager, getStats);

// @route   GET /api/dashboard/my-stats
// @desc    Get employee's personal statistics
// @access  Private (Employee only)
router.get("/my-stats", isEmployee, getMyStats);

// @route   GET /api/dashboard/employee-stats
// @desc    Get statistics by employee
// @access  Private (Manager only)
router.get("/employee-stats", isManager, getEmployeeStats);

// @route   GET /api/dashboard/recent-tasks
// @desc    Get recent tasks
// @access  Private
router.get("/recent-tasks", getRecentTasks);

module.exports = router;
