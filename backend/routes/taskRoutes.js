// routes/taskRoutes.js
// Task management routes

const express = require("express");
const router = express.Router();
const {
  getAllTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
  updateTaskStatus,
  cancelTask,
  addWorkReport,
  reassignTask,
} = require("../controllers/taskController");
const { auth, isManager } = require("../middleware/auth");

// All routes require authentication
router.use(auth);

// @route   GET /api/tasks
// @desc    Get all tasks (filtered by role)
// @access  Private
router.get("/", getAllTasks);

// @route   GET /api/tasks/:id
// @desc    Get task by ID
// @access  Private
router.get("/:id", getTaskById);

// @route   POST /api/tasks
// @desc    Create new task
// @access  Private (Manager only)
router.post("/", isManager, createTask);

// @route   PUT /api/tasks/:id
// @desc    Update task
// @access  Private (Manager only)
router.put("/:id", isManager, updateTask);

// @route   DELETE /api/tasks/:id
// @desc    Delete task
// @access  Private (Manager only)
router.delete("/:id", isManager, deleteTask);

// @route   PATCH /api/tasks/:id/status
// @desc    Update task status
// @access  Private (Employee can update their own, Manager can update all)
router.patch("/:id/status", updateTaskStatus);

// @route   PATCH /api/tasks/:id/cancel
// @desc    Cancel task with reason
// @access  Private (Manager only)
router.patch("/:id/cancel", isManager, cancelTask);

// @route   PATCH /api/tasks/:id/report
// @desc    Add work report to task
// @access  Private (Employee can add to their own, Manager can add to all)
router.patch("/:id/report", addWorkReport);

// @route   PATCH /api/tasks/:id/reassign
// @desc    Reassign task to another employee
// @access  Private (Manager only)
router.patch("/:id/reassign", isManager, reassignTask);

module.exports = router;
