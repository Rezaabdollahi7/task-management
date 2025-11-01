// controllers/taskController.js
// Task management controller for CRUD operations

const Task = require("../models/Task");

// @route   GET /api/tasks
// @desc    Get all tasks (with filters)
// @access  Private
const getAllTasks = async (req, res) => {
  try {
    const filters = {
      status: req.query.status,
      priority: req.query.priority,
      employeeId: req.query.employeeId,
      creatorId: req.query.creatorId,
      search: req.query.search,
      startDate: req.query.startDate,
      endDate: req.query.endDate,
      overdue: req.query.overdue,
      page: req.query.page,
      limit: req.query.limit,
    };

    // If user is employee, show only their tasks
    if (req.user.role === "employee") {
      filters.employeeId = req.user.id;
    }

    const result = await Task.getAll(filters);

    res.json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error("Get all tasks error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while fetching tasks",
    });
  }
};

// @route   GET /api/tasks/:id
// @desc    Get task by ID
// @access  Private
const getTaskById = async (req, res) => {
  try {
    const { id } = req.params;

    const task = await Task.findById(id);

    if (!task) {
      return res.status(404).json({
        success: false,
        message: "Task not found",
      });
    }

    // Check if employee can only view their own tasks
    if (req.user.role === "employee" && task.employee_id !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "Access denied. You can only view your own tasks.",
      });
    }

    res.json({
      success: true,
      data: task,
    });
  } catch (error) {
    console.error("Get task by ID error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while fetching task",
    });
  }
};

// @route   POST /api/tasks
// @desc    Create new task
// @access  Private (Manager only)
const createTask = async (req, res) => {
  try {
    const {
      title,
      description,
      priority,
      taskDate,
      deadline,
      deviceModel,
      serialNumber,
      reportedIssue,
      employeeId,
    } = req.body;

    // Validation
    if (!title || !employeeId) {
      return res.status(400).json({
        success: false,
        message: "Title and employee are required",
      });
    }

    // Validate priority
    if (priority && !["urgent", "high", "medium", "low"].includes(priority)) {
      return res.status(400).json({
        success: false,
        message: "Invalid priority. Must be urgent, high, medium, or low",
      });
    }

    // Create task
    const newTask = await Task.create({
      title,
      description,
      priority,
      taskDate,
      deadline,
      deviceModel,
      serialNumber,
      reportedIssue,
      employeeId,
      creatorId: req.user.id,
    });

    res.status(201).json({
      success: true,
      message: "Task created successfully",
      data: newTask,
    });
  } catch (error) {
    console.error("Create task error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while creating task",
    });
  }
};

// @route   PUT /api/tasks/:id
// @desc    Update task
// @access  Private (Manager only)
const updateTask = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      title,
      description,
      priority,
      taskDate,
      deadline,
      deviceModel,
      serialNumber,
      reportedIssue,
      employeeId,
    } = req.body;

    // Check if task exists
    const task = await Task.findById(id);
    if (!task) {
      return res.status(404).json({
        success: false,
        message: "Task not found",
      });
    }

    // Validate priority if provided
    if (priority && !["urgent", "high", "medium", "low"].includes(priority)) {
      return res.status(400).json({
        success: false,
        message: "Invalid priority. Must be urgent, high, medium, or low",
      });
    }

    // Update task
    const updatedTask = await Task.update(id, {
      title,
      description,
      priority,
      taskDate,
      deadline,
      deviceModel,
      serialNumber,
      reportedIssue,
      employeeId,
    });

    res.json({
      success: true,
      message: "Task updated successfully",
      data: updatedTask,
    });
  } catch (error) {
    console.error("Update task error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while updating task",
    });
  }
};

// @route   DELETE /api/tasks/:id
// @desc    Delete task
// @access  Private (Manager only)
const deleteTask = async (req, res) => {
  try {
    const { id } = req.params;

    // Check if task exists
    const task = await Task.findById(id);
    if (!task) {
      return res.status(404).json({
        success: false,
        message: "Task not found",
      });
    }

    // Delete task
    await Task.delete(id);

    res.json({
      success: true,
      message: "Task deleted successfully",
    });
  } catch (error) {
    console.error("Delete task error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while deleting task",
    });
  }
};

// @route   PATCH /api/tasks/:id/status
// @desc    Update task status
// @access  Private
const updateTaskStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    // Validation
    if (
      !status ||
      !["open", "in_progress", "completed", "cancelled"].includes(status)
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Invalid status. Must be open, in_progress, completed, or cancelled",
      });
    }

    // Check if task exists
    const task = await Task.findById(id);
    if (!task) {
      return res.status(404).json({
        success: false,
        message: "Task not found",
      });
    }

    // Check permissions
    if (req.user.role === "employee" && task.employee_id !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "Access denied. You can only update your own tasks.",
      });
    }

    // Update status
    const updatedTask = await Task.updateStatus(id, status, req.user.id);

    res.json({
      success: true,
      message: "Task status updated successfully",
      data: updatedTask,
    });
  } catch (error) {
    console.error("Update task status error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while updating task status",
    });
  }
};

// @route   PATCH /api/tasks/:id/cancel
// @desc    Cancel task with reason
// @access  Private (Manager only)
const cancelTask = async (req, res) => {
  try {
    const { id } = req.params;
    const { cancellationReason } = req.body;

    // Validation
    if (!cancellationReason) {
      return res.status(400).json({
        success: false,
        message: "Cancellation reason is required",
      });
    }

    // Check if task exists
    const task = await Task.findById(id);
    if (!task) {
      return res.status(404).json({
        success: false,
        message: "Task not found",
      });
    }

    // Cancel task
    const cancelledTask = await Task.cancel(id, cancellationReason);

    res.json({
      success: true,
      message: "Task cancelled successfully",
      data: cancelledTask,
    });
  } catch (error) {
    console.error("Cancel task error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while cancelling task",
    });
  }
};

// @route   PATCH /api/tasks/:id/report
// @desc    Add work report to task
// @access  Private
const addWorkReport = async (req, res) => {
  try {
    const { id } = req.params;
    const { workReport } = req.body;

    // Validation
    if (!workReport) {
      return res.status(400).json({
        success: false,
        message: "Work report is required",
      });
    }

    // Check if task exists
    const task = await Task.findById(id);
    if (!task) {
      return res.status(404).json({
        success: false,
        message: "Task not found",
      });
    }

    // Check permissions
    if (req.user.role === "employee" && task.employee_id !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "Access denied. You can only add reports to your own tasks.",
      });
    }

    // Add work report
    const updatedTask = await Task.addWorkReport(id, workReport);

    res.json({
      success: true,
      message: "Work report added successfully",
      data: updatedTask,
    });
  } catch (error) {
    console.error("Add work report error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while adding work report",
    });
  }
};

// @route   PATCH /api/tasks/:id/reassign
// @desc    Reassign task to another employee
// @access  Private (Manager only)
const reassignTask = async (req, res) => {
  try {
    const { id } = req.params;
    const { employeeId } = req.body;

    // Validation
    if (!employeeId) {
      return res.status(400).json({
        success: false,
        message: "Employee ID is required",
      });
    }

    // Check if task exists
    const task = await Task.findById(id);
    if (!task) {
      return res.status(404).json({
        success: false,
        message: "Task not found",
      });
    }

    // Reassign task
    const reassignedTask = await Task.reassign(id, employeeId);

    res.json({
      success: true,
      message: "Task reassigned successfully",
      data: reassignedTask,
    });
  } catch (error) {
    console.error("Reassign task error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while reassigning task",
    });
  }
};

module.exports = {
  getAllTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
  updateTaskStatus,
  cancelTask,
  addWorkReport,
  reassignTask,
};
