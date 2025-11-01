// middleware/auth.js
// JWT authentication middleware to protect routes

const jwt = require("jsonwebtoken");
const db = require("../config/db");

// Middleware to verify JWT token and authenticate user
const auth = async (req, res, next) => {
  try {
    // Get token from header
    const token = req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "No authentication token, access denied",
      });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Get user from database
    const result = await db.query(
      "SELECT id, full_name, username, role, created_at FROM users WHERE id = $1",
      [decoded.id]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({
        success: false,
        message: "User not found, token invalid",
      });
    }

    // Attach user to request object
    req.user = result.rows[0];
    next();
  } catch (error) {
    console.error("Auth middleware error:", error);

    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({
        success: false,
        message: "Invalid token",
      });
    }

    if (error.name === "TokenExpiredError") {
      return res.status(401).json({
        success: false,
        message: "Token expired",
      });
    }

    res.status(500).json({
      success: false,
      message: "Server error during authentication",
    });
  }
};

// Middleware to check if user is a manager
const isManager = (req, res, next) => {
  if (req.user.role !== "manager") {
    return res.status(403).json({
      success: false,
      message: "Access denied. Manager role required.",
    });
  }
  next();
};

// Middleware to check if user is an employee
const isEmployee = (req, res, next) => {
  if (req.user.role !== "employee") {
    return res.status(403).json({
      success: false,
      message: "Access denied. Employee role required.",
    });
  }
  next();
};

module.exports = {
  auth,
  isManager,
  isEmployee,
};
