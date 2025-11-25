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

  // Get user statistics
  static async getUserStats(userId) {
    const query = `
      SELECT 
        COUNT(*) as total_tasks,
        COUNT(*) FILTER (WHERE status = 'completed') as completed_tasks,
        COUNT(*) FILTER (WHERE status = 'in_progress') as in_progress_tasks,
        COUNT(*) FILTER (WHERE status = 'open') as open_tasks,
        COUNT(*) FILTER (WHERE deadline < CURRENT_DATE AND status NOT IN ('completed', 'cancelled')) as overdue_tasks,
        ROUND(
          (COUNT(*) FILTER (WHERE status = 'completed')::DECIMAL / NULLIF(COUNT(*), 0)) * 100, 
          2
        ) as completion_rate
      FROM tasks 
      WHERE employee_id = $1
    `;

    const result = await db.query(query, [userId]);
    return result.rows[0];
  }

  // Get user monthly performance (last 6 months)
  static async getUserMonthlyPerformance(userId) {
    const query = `
      SELECT 
        TO_CHAR(created_at, 'YYYY-MM') as month,
        COUNT(*) as total,
        COUNT(*) FILTER (WHERE status = 'completed') as completed,
        COUNT(*) FILTER (WHERE status = 'in_progress') as in_progress,
        COUNT(*) FILTER (WHERE status = 'open') as open
      FROM tasks
      WHERE employee_id = $1
        AND created_at >= CURRENT_DATE - INTERVAL '6 months'
      GROUP BY TO_CHAR(created_at, 'YYYY-MM')
      ORDER BY month DESC
    `;

    const result = await db.query(query, [userId]);
    return result.rows;
  }

  // Get user tasks with filters
  static async getUserTasks(userId, filters = {}) {
    let query = `
      SELECT t.*, 
             e.full_name as employee_name,
             c.full_name as creator_name
      FROM tasks t
      INNER JOIN users e ON t.employee_id = e.id
      INNER JOIN users c ON t.creator_id = c.id
      WHERE t.employee_id = $1
    `;
    const params = [userId];
    let paramCount = 2;

    // Filter by status
    if (filters.status) {
      params.push(filters.status);
      query += ` AND t.status = $${paramCount++}`;
    }

    // Filter by priority
    if (filters.priority) {
      params.push(filters.priority);
      query += ` AND t.priority = $${paramCount++}`;
    }

    // Check for overdue
    if (filters.overdue === "true") {
      query += ` AND t.deadline < CURRENT_DATE AND t.status NOT IN ('completed', 'cancelled')`;
    }

    query += ` ORDER BY t.created_at DESC`;

    // Pagination
    const page = parseInt(filters.page) || 1;
    const limit = parseInt(filters.limit) || 20;
    const offset = (page - 1) * limit;

    params.push(limit, offset);
    query += ` LIMIT $${paramCount++} OFFSET $${paramCount}`;

    const result = await db.query(query, params);

    // Get total count
    let countQuery = `SELECT COUNT(*) FROM tasks WHERE employee_id = $1`;
    const countParams = [userId];

    const countResult = await db.query(countQuery, countParams);
    const totalItems = parseInt(countResult.rows[0].count);

    return {
      tasks: result.rows,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(totalItems / limit),
        totalItems,
        itemsPerPage: limit,
      },
    };
  }

  // Get user work reports (tasks with reports)
  static async getUserReports(userId, limit = 10) {
    const query = `
      SELECT 
        t.id,
        t.title,
        t.work_report,
        t.status,
        t.priority,
        t.actual_end_time,
        t.updated_at,
        c.full_name as creator_name
      FROM tasks t
      INNER JOIN users c ON t.creator_id = c.id
      WHERE t.employee_id = $1 
        AND t.work_report IS NOT NULL
      ORDER BY t.updated_at DESC
      LIMIT $2
    `;

    const result = await db.query(query, [userId, limit]);
    return result.rows;
  }
}

module.exports = User;
