// models/User.js
// User model for database operations

const db = require("../config/db");
const bcrypt = require("bcryptjs");

class User {
  // Find user by username
  static async findByUsername(username) {
    const result = await db.query("SELECT * FROM users WHERE username = $1", [
      username,
    ]);
    return result.rows[0];
  }

  // Find user by ID
  static async findById(id) {
    const result = await db.query(
      "SELECT id, full_name, username, role, created_at, updated_at FROM users WHERE id = $1",
      [id]
    );
    return result.rows[0];
  }

  // Get all users
  static async getAll(filters = {}) {
    let query =
      "SELECT id, full_name, username, role, created_at, updated_at FROM users";
    const params = [];
    const conditions = [];

    // Apply filters
    if (filters.search) {
      params.push(`%${filters.search}%`);
      conditions.push(
        `(full_name ILIKE $${params.length} OR username ILIKE $${params.length})`
      );
    }

    if (filters.role) {
      params.push(filters.role);
      conditions.push(`role = $${params.length}`);
    }

    if (conditions.length > 0) {
      query += " WHERE " + conditions.join(" AND ");
    }

    query += " ORDER BY created_at DESC";

    // Pagination
    const page = parseInt(filters.page) || 1;
    const limit = parseInt(filters.limit) || 10;
    const offset = (page - 1) * limit;

    params.push(limit, offset);
    query += ` LIMIT $${params.length - 1} OFFSET $${params.length}`;

    const result = await db.query(query, params);

    // Get total count
    let countQuery = "SELECT COUNT(*) FROM users";
    const countParams = [];

    if (conditions.length > 0) {
      countQuery += " WHERE " + conditions.join(" AND ");
      // Add search/role params for count
      if (filters.search) countParams.push(`%${filters.search}%`);
      if (filters.role) countParams.push(filters.role);
    }

    const countResult = await db.query(countQuery, countParams);
    const totalItems = parseInt(countResult.rows[0].count);

    return {
      users: result.rows,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(totalItems / limit),
        totalItems,
        itemsPerPage: limit,
      },
    };
  }

  // Create new user
  static async create(userData) {
    const { fullName, username, password, role } = userData;

    // Hash password
    const salt = await bcrypt.genSalt(
      parseInt(process.env.BCRYPT_SALT_ROUNDS) || 10
    );
    const hashedPassword = await bcrypt.hash(password, salt);

    const result = await db.query(
      `INSERT INTO users (full_name, username, password, role) 
       VALUES ($1, $2, $3, $4) 
       RETURNING id, full_name, username, role, created_at`,
      [fullName, username, hashedPassword, role]
    );

    return result.rows[0];
  }

  // Update user
  static async update(id, userData) {
    const updates = [];
    const params = [];
    let paramCount = 1;

    if (userData.fullName) {
      params.push(userData.fullName);
      updates.push(`full_name = $${paramCount++}`);
    }

    if (userData.username) {
      params.push(userData.username);
      updates.push(`username = $${paramCount++}`);
    }

    if (userData.role) {
      params.push(userData.role);
      updates.push(`role = $${paramCount++}`);
    }

    if (updates.length === 0) {
      throw new Error("No fields to update");
    }

    params.push(id);
    const query = `
      UPDATE users 
      SET ${updates.join(", ")}, updated_at = CURRENT_TIMESTAMP 
      WHERE id = $${paramCount} 
      RETURNING id, full_name, username, role, updated_at
    `;

    const result = await db.query(query, params);
    return result.rows[0];
  }

  // Update password
  static async updatePassword(id, newPassword) {
    const salt = await bcrypt.genSalt(
      parseInt(process.env.BCRYPT_SALT_ROUNDS) || 10
    );
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    await db.query(
      "UPDATE users SET password = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2",
      [hashedPassword, id]
    );
  }

  // Delete user
  static async delete(id) {
    const result = await db.query(
      "DELETE FROM users WHERE id = $1 RETURNING id",
      [id]
    );
    return result.rows[0];
  }

  // Verify password
  static async verifyPassword(plainPassword, hashedPassword) {
    return await bcrypt.compare(plainPassword, hashedPassword);
  }

  // Check if username exists
  static async usernameExists(username, excludeId = null) {
    let query = "SELECT id FROM users WHERE username = $1";
    const params = [username];

    if (excludeId) {
      query += " AND id != $2";
      params.push(excludeId);
    }

    const result = await db.query(query, params);
    return result.rows.length > 0;
  }
}

module.exports = User;
