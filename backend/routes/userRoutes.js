// routes/userRoutes.js
// User management routes

const express = require("express");
// const {
//   saveFCMToken,
//   deleteFCMToken,
// } = require("../controllers/fcmController");
const router = express.Router();
const {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  changeUserRole,
  changeUserPassword,
  getAssignableUsers, // ✅
} = require("../controllers/userController");
const { auth, isManager } = require("../middleware/auth");

// All routes require authentication
router.use(auth);

// @route   GET /api/users
// @desc    Get all users
// @access  Private (Manager only)
router.get("/", isManager, getAllUsers);

// @route   GET /api/users/assignable
// @desc    Get all assignable users
// @access  Private (Manager only)
router.get("/assignable", isManager, getAssignableUsers); 

// @route   GET /api/users/:id
// @desc    Get user by ID
// @access  Private (Manager only)
router.get("/:id", isManager, getUserById);

// @route   POST /api/users
// @desc    Create new user
// @access  Private (Manager only)
router.post("/", isManager, createUser);

// FCM token routes
// router.post("/fcm-token", saveFCMToken);
// router.delete("/fcm-token", deleteFCMToken);

// @route   PUT /api/users/:id
// @desc    Update user
// @access  Private (Manager only)
router.put("/:id", isManager, updateUser);

// @route   DELETE /api/users/:id
// @desc    Delete user
// @access  Private (Manager only)
router.delete("/:id", isManager, deleteUser);

// @route   PATCH /api/users/:id/role
// @desc    Change user role
// @access  Private (Manager only)
router.patch("/:id/role", isManager, changeUserRole);

// @route   PATCH /api/users/:id/password
// @desc    Change user password
// @access  Private (Manager only)
router.patch("/:id/password", isManager, changeUserPassword);

module.exports = router;
