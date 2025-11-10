// controllers/userController.js
// User management controller for CRUD operations

const User = require("../models/User");

// @route   GET /api/users
// @desc    Get all users (with search and filters)
// @access  Private (Manager only)
const getAllUsers = async (req, res) => {
  try {
    const filters = {
      search: req.query.search,
      role: req.query.role,
      page: req.query.page,
      limit: req.query.limit,
    };

    const result = await User.getAll(filters);

    res.json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error("Get all users error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while fetching users",
    });
  }
};

// @route   GET /api/users/assignable
// @desc    Get all users that can be assigned tasks (all users)
// @access  Private (Manager only)
const getAssignableUsers = async (req, res) => {
  try {
    // Return all active users (managers + employees)
    const result = await User.getAll({}); // ← Pass empty object for filters

    // result is an object like: { users: [...], total: X, ... }
    // Get the users array
    const users = result.users || result.data || result;

    // Filter only active users
    const activeUsers = Array.isArray(users)
      ? users.filter((user) => user.is_active !== false)
      : [];

    res.json({
      success: true,
      data: activeUsers,
    });
  } catch (error) {
    console.error("Get assignable users error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while fetching assignable users",
    });
  }
};

// @route   GET /api/users/:id
// @desc    Get user by ID
// @access  Private (Manager only)
const getUserById = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.json({
      success: true,
      data: user,
    });
  } catch (error) {
    console.error("Get user by ID error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while fetching user",
    });
  }
};

// @route   POST /api/users
// @desc    Create new user
// @access  Private (Manager only)
const createUser = async (req, res) => {
  try {
    const { fullName, username, password, role } = req.body;

    // Validation
    if (!fullName || !username || !password || !role) {
      return res.status(400).json({
        success: false,
        message: "Please provide all required fields",
      });
    }

    // Check if role is valid
    if (!["manager", "employee"].includes(role)) {
      return res.status(400).json({
        success: false,
        message: "Invalid role. Must be manager or employee",
      });
    }

    // Check if username already exists
    const existingUser = await User.findByUsername(username);
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "Username already exists",
      });
    }

    // Create user
    const newUser = await User.create({
      fullName,
      username,
      password,
      role,
    });

    res.status(201).json({
      success: true,
      message: "User created successfully",
      data: newUser,
    });
  } catch (error) {
    console.error("Create user error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while creating user",
    });
  }
};

// @route   PUT /api/users/:id
// @desc    Update user
// @access  Private (Manager only)
const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { fullName, username, role } = req.body;

    // Check if user exists
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Check if new username already exists (if username is being changed)
    if (username && username !== user.username) {
      const usernameExists = await User.usernameExists(username, id);
      if (usernameExists) {
        return res.status(400).json({
          success: false,
          message: "Username already exists",
        });
      }
    }

    // Update user
    const updatedUser = await User.update(id, {
      fullName,
      username,
      role,
    });

    res.json({
      success: true,
      message: "User updated successfully",
      data: updatedUser,
    });
  } catch (error) {
    console.error("Update user error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while updating user",
    });
  }
};

// @route   DELETE /api/users/:id
// @desc    Delete user
// @access  Private (Manager only)
const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    // Check if user exists
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Prevent deleting yourself
    if (parseInt(id) === req.user.id) {
      return res.status(400).json({
        success: false,
        message: "You cannot delete yourself",
      });
    }

    // Delete user
    await User.delete(id);

    res.json({
      success: true,
      message: "User deleted successfully",
    });
  } catch (error) {
    console.error("Delete user error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while deleting user",
    });
  }
};

// @route   PATCH /api/users/:id/role
// @desc    Change user role
// @access  Private (Manager only)
const changeUserRole = async (req, res) => {
  try {
    const { id } = req.params;
    const { role } = req.body;

    // Validation
    if (!role || !["manager", "employee"].includes(role)) {
      return res.status(400).json({
        success: false,
        message: "Invalid role. Must be manager or employee",
      });
    }

    // Check if user exists
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Update role
    const updatedUser = await User.update(id, { role });

    res.json({
      success: true,
      message: "User role updated successfully",
      data: updatedUser,
    });
  } catch (error) {
    console.error("Change user role error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while changing user role",
    });
  }
};

// @route   PATCH /api/users/:id/password
// @desc    Change user password
// @access  Private (Manager only)
const changeUserPassword = async (req, res) => {
  try {
    const { id } = req.params;
    const { newPassword } = req.body;

    // Validation
    if (!newPassword || newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 6 characters",
      });
    }

    // Check if user exists
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Update password
    await User.updatePassword(id, newPassword);

    res.json({
      success: true,
      message: "Password updated successfully",
    });
  } catch (error) {
    console.error("Change user password error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while changing password",
    });
  }
};

module.exports = {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  changeUserRole,
  changeUserPassword,
  getAssignableUsers,
};
