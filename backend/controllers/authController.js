// controllers/authController.js
// Authentication controller for login and user management

const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const User = require("../models/User");

// Generate JWT token
const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || "7d",
  });
};

// @route   POST /api/auth/login
// @desc    Login user and return JWT token
// @access  Public
const login = async (req, res) => {
  try {
    const { username, password } = req.body;
    console.log("🔐 Login attempt:", {
      username,
      passwordLength: password?.length,
    });

    // Validate input
    if (!username || !password) {
      console.log("❌ Missing credentials");
      return res.status(400).json({
        success: false,
        message: "Please provide username and password",
      });
    }

    // Find user by username
    const user = await User.findByUsername(username);
    console.log("👤 User found:", user ? "YES" : "NO");

    if (user) {
      console.log("👤 User details:", {
        id: user.id,
        username: user.username,
        role: user.role,
        hasPassword: !!user.password,
        passwordStart: user.password?.substring(0, 10) + "...",
      });
    }

    if (!user) {
      console.log("❌ User not found");
      return res.status(401).json({
        success: false,
        message: "Invalid username or password",
      });
    }

    // Check if active
    if (user.is_active === false) {
      console.log("❌ User inactive");
      return res.status(403).json({
        success: false,
        message: "Your account has been deactivated",
      });
    }

    // Verify password
    console.log("🔑 Verifying password...");
    const isPasswordValid = await bcrypt.compare(password, user.password);
    console.log("🔑 Password valid:", isPasswordValid);

    if (!isPasswordValid) {
      console.log("❌ Invalid password");
      return res.status(401).json({
        success: false,
        message: "Invalid username or password",
      });
    }

    // Generate token
    const token = generateToken(user.id);
    console.log("✅ Login successful, token generated");

    // Return user info and token
    res.json({
      success: true,
      message: "Login successful",
      data: {
        token,
        user: {
          id: user.id,
          fullName: user.full_name,
          username: user.username,
          role: user.role,
        },
      },
    });
  } catch (error) {
    console.error("❌ Login error:", error);
    res.status(500).json({
      success: false,
      message: "Server error during login",
    });
  }
};

// @route   GET /api/auth/me
// @desc    Get current logged-in user information
// @access  Private
const getMe = async (req, res) => {
  try {
    // User is already attached to req by auth middleware
    res.json({
      success: true,
      data: {
        id: req.user.id,
        fullName: req.user.full_name,
        username: req.user.username,
        role: req.user.role,
        createdAt: req.user.created_at,
      },
    });
  } catch (error) {
    console.error("Get user info error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while fetching user information",
    });
  }
};

// @route   POST /api/auth/logout
// @desc    Logout user (client-side token removal)
// @access  Private
const logout = async (req, res) => {
  try {
    // In JWT authentication, logout is handled on client-side by removing the token
    // This endpoint is for logging purposes and can be extended for token blacklisting
    res.json({
      success: true,
      message: "Logout successful",
    });
  } catch (error) {
    console.error("Logout error:", error);
    res.status(500).json({
      success: false,
      message: "Server error during logout",
    });
  }
};

module.exports = {
  login,
  getMe,
  logout,
};
