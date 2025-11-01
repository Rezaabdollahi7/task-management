// routes/userRoutes.js
// User management routes

const express = require("express");
const router = express.Router();
const {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  changeUserRole,
  changeUserPassword,
} = require("../controllers/userController");
const { auth, isManager } = require("../middleware/auth");

// All routes require authentication and manager role
router.use(auth);
router.use(isManager);

// @route   GET /api/users
// @desc    Get all users
// @access  Private (Manager only)
router.get("/", getAllUsers);

// @route   GET /api/users/:id
// @desc    Get user by ID
// @access  Private (Manager only)
router.get("/:id", getUserById);

// @route   POST /api/users
// @desc    Create new user
// @access  Private (Manager only)
router.post("/", createUser);

// @route   PUT /api/users/:id
// @desc    Update user
// @access  Private (Manager only)
router.put("/:id", updateUser);

// @route   DELETE /api/users/:id
// @desc    Delete user
// @access  Private (Manager only)
router.delete("/:id", deleteUser);

// @route   PATCH /api/users/:id/role
// @desc    Change user role
// @access  Private (Manager only)
router.patch("/:id/role", changeUserRole);

// @route   PATCH /api/users/:id/password
// @desc    Change user password
// @access  Private (Manager only)
router.patch("/:id/password", changeUserPassword);

module.exports = router;
