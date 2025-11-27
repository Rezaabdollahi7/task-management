// controllers/dailyReportController.js
// Daily report controller for CRUD operations

const DailyReport = require("../models/DailyReport");

// @route   GET /api/daily-reports
// @desc    Get all reports (Manager only - can filter by user)
// @access  Private (Manager only)
const getAllReports = async (req, res) => {
  try {
    const filters = {
      userId: req.query.userId,
      startDate: req.query.startDate,
      endDate: req.query.endDate,
      search: req.query.search,
      page: req.query.page,
      limit: req.query.limit,
    };

    const result = await DailyReport.getAll(filters);

    res.json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error("Get all reports error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while fetching reports",
    });
  }
};

// @route   GET /api/daily-reports/my
// @desc    Get my reports (Employee - only their own)
// @access  Private
const getMyReports = async (req, res) => {
  try {
    const filters = {
      startDate: req.query.startDate,
      endDate: req.query.endDate,
      page: req.query.page,
      limit: req.query.limit,
    };

    const result = await DailyReport.getByUser(req.user.id, filters);

    res.json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error("Get my reports error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while fetching reports",
    });
  }
};

// @route   GET /api/daily-reports/:id
// @desc    Get report by ID
// @access  Private
const getReportById = async (req, res) => {
  try {
    const { id } = req.params;

    const report = await DailyReport.findById(id);

    if (!report) {
      return res.status(404).json({
        success: false,
        message: "Report not found",
      });
    }

    // Check permission: user can only view their own report (unless manager)
    if (req.user.role !== "manager" && report.user_id !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "You don't have permission to view this report",
      });
    }

    res.json({
      success: true,
      data: report,
    });
  } catch (error) {
    console.error("Get report by ID error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while fetching report",
    });
  }
};

// @route   POST /api/daily-reports
// @desc    Create new report
// @access  Private
const createReport = async (req, res) => {
  try {
    const { reportDate, description } = req.body;

    // Validation
    if (!reportDate || !description) {
      return res.status(400).json({
        success: false,
        message: "Report date and description are required",
      });
    }

    if (description.trim().length < 10) {
      return res.status(400).json({
        success: false,
        message: "Description must be at least 10 characters",
      });
    }

    // Check date validity (today or up to 2 days ago)
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const reportDateObj = new Date(reportDate);
    reportDateObj.setHours(0, 0, 0, 0);

    const diffTime = today - reportDateObj;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) {
      return res.status(400).json({
        success: false,
        message: "Cannot create report for future dates",
      });
    }

    if (diffDays > 30) {
      return res.status(400).json({
        success: false,
        message: "Cannot create report for more than 30 days ago",
      });
    }

    // Check if report already exists for this date
    const exists = await DailyReport.existsForUserAndDate(
      req.user.id,
      reportDate
    );

    if (exists) {
      return res.status(400).json({
        success: false,
        message: "You already have a report for this date",
      });
    }

    // Create report
    const newReport = await DailyReport.create({
      userId: req.user.id,
      reportDate,
      description: description.trim(),
    });

    res.status(201).json({
      success: true,
      message: "Report created successfully",
      data: newReport,
    });
  } catch (error) {
    console.error("Create report error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while creating report",
    });
  }
};

// @route   PUT /api/daily-reports/:id
// @desc    Update report
// @access  Private
const updateReport = async (req, res) => {
  try {
    const { id } = req.params;
    const { description } = req.body;

    // Validation
    if (!description || description.trim().length < 10) {
      return res.status(400).json({
        success: false,
        message: "Description must be at least 10 characters",
      });
    }

    // Check if report exists
    const report = await DailyReport.findById(id);
    if (!report) {
      return res.status(404).json({
        success: false,
        message: "Report not found",
      });
    }

    // Check permission: user can only update their own report
    if (report.user_id !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "You don't have permission to update this report",
      });
    }

    // Update report
    const updatedReport = await DailyReport.update(id, description.trim());

    res.json({
      success: true,
      message: "Report updated successfully",
      data: updatedReport,
    });
  } catch (error) {
    console.error("Update report error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while updating report",
    });
  }
};

// @route   DELETE /api/daily-reports/:id
// @desc    Delete report
// @access  Private
const deleteReport = async (req, res) => {
  try {
    const { id } = req.params;

    // Check if report exists
    const report = await DailyReport.findById(id);
    if (!report) {
      return res.status(404).json({
        success: false,
        message: "Report not found",
      });
    }

    // Check permission: user can only delete their own report
    if (report.user_id !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "You don't have permission to delete this report",
      });
    }

    // Delete report
    await DailyReport.delete(id);

    res.json({
      success: true,
      message: "Report deleted successfully",
    });
  } catch (error) {
    console.error("Delete report error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while deleting report",
    });
  }
};

module.exports = {
  getAllReports,
  getMyReports,
  getReportById,
  createReport,
  updateReport,
  deleteReport,
};
