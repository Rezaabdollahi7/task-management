// routes/authRoutes.js
// Authentication routes

const express = require("express");
const router = express.Router();
const { login, getMe, logout } = require("../controllers/authController");
const { auth } = require("../middleware/auth");

// @route   POST /api/auth/login
// @desc    Login user
// @access  Public
router.post("/login", login);

// @route   GET /api/auth/me
// @desc    Get current user information
// @access  Private
router.get("/me", auth, getMe);

// @route   POST /api/auth/logout
// @desc    Logout user
// @access  Private
router.post("/logout", auth, logout);

module.exports = router;
