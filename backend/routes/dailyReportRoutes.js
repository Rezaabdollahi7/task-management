// routes/dailyReportRoutes.js
// Daily report routes

const express = require("express");
const router = express.Router();
const {
  getAllReports,
  getMyReports,
  getReportById,
  createReport,
  updateReport,
  deleteReport,
} = require("../controllers/dailyReportController");
const { auth, isManager } = require("../middleware/auth");

// All routes require authentication
router.use(auth);

// @route   GET /api/daily-reports/my
// @desc    Get my reports (Employee - only their own)
// @access  Private
router.get("/my", getMyReports);

// @route   GET /api/daily-reports
// @desc    Get all reports (Manager can filter by user)
// @access  Private (Manager only)
router.get("/", isManager, getAllReports);

// @route   GET /api/daily-reports/:id
// @desc    Get report by ID
// @access  Private
router.get("/:id", getReportById);

// @route   POST /api/daily-reports
// @desc    Create new report
// @access  Private
router.post("/", createReport);

// @route   PUT /api/daily-reports/:id
// @desc    Update report
// @access  Private
router.put("/:id", updateReport);

// @route   DELETE /api/daily-reports/:id
// @desc    Delete report
// @access  Private
router.delete("/:id", deleteReport);

module.exports = router;
