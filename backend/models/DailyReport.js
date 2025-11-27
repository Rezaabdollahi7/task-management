// models/DailyReport.js
// Daily report model for database operations

const db = require("../config/db");

class DailyReport {
  // Find report by ID
  static async findById(id) {
    const result = await db.query(
      `SELECT dr.*, u.full_name, u.username 
       FROM daily_reports dr
       INNER JOIN users u ON dr.user_id = u.id
       WHERE dr.id = $1`,
      [id]
    );
    return result.rows[0];
  }

  // Find report by user and date
  static async findByUserAndDate(userId, reportDate) {
    const result = await db.query(
      `SELECT * FROM daily_reports 
       WHERE user_id = $1 AND report_date = $2`,
      [userId, reportDate]
    );
    return result.rows[0];
  }

  // Get all reports with filters (for manager)
  static async getAll(filters = {}) {
    let query = `
      SELECT dr.*, u.full_name, u.username 
      FROM daily_reports dr
      INNER JOIN users u ON dr.user_id = u.id
      WHERE 1=1
    `;
    const params = [];
    let paramCount = 1;

    // Filter by user
    if (filters.userId) {
      params.push(filters.userId);
      query += ` AND dr.user_id = $${paramCount++}`;
    }

    // Filter by date range
    if (filters.startDate) {
      params.push(filters.startDate);
      query += ` AND dr.report_date >= $${paramCount++}`;
    }

    if (filters.endDate) {
      params.push(filters.endDate);
      query += ` AND dr.report_date <= $${paramCount++}`;
    }

    // Search in description
    if (filters.search) {
      params.push(`%${filters.search}%`);
      query += ` AND dr.description ILIKE $${paramCount++}`;
    }

    query += ` ORDER BY dr.report_date DESC, dr.created_at DESC`;

    // Pagination
    const page = parseInt(filters.page) || 1;
    const limit = parseInt(filters.limit) || 20;
    const offset = (page - 1) * limit;

    params.push(limit, offset);
    query += ` LIMIT $${paramCount++} OFFSET $${paramCount}`;

    const result = await db.query(query, params);

    // Get total count
    let countQuery = `SELECT COUNT(*) FROM daily_reports dr WHERE 1=1`;
    const countParams = [];
    let countParamCount = 1;

    if (filters.userId) {
      countParams.push(filters.userId);
      countQuery += ` AND dr.user_id = $${countParamCount++}`;
    }

    if (filters.startDate) {
      countParams.push(filters.startDate);
      countQuery += ` AND dr.report_date >= $${countParamCount++}`;
    }

    if (filters.endDate) {
      countParams.push(filters.endDate);
      countQuery += ` AND dr.report_date <= $${countParamCount++}`;
    }

    if (filters.search) {
      countParams.push(`%${filters.search}%`);
      countQuery += ` AND dr.description ILIKE $${countParamCount++}`;
    }

    const countResult = await db.query(countQuery, countParams);
    const totalItems = parseInt(countResult.rows[0].count);

    return {
      reports: result.rows,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(totalItems / limit),
        totalItems,
        itemsPerPage: limit,
      },
    };
  }

  // Get reports by user (for employee - only their own)
  static async getByUser(userId, filters = {}) {
    let query = `
      SELECT * FROM daily_reports 
      WHERE user_id = $1
    `;
    const params = [userId];
    let paramCount = 2;

    // Filter by date range
    if (filters.startDate) {
      params.push(filters.startDate);
      query += ` AND report_date >= $${paramCount++}`;
    }

    if (filters.endDate) {
      params.push(filters.endDate);
      query += ` AND report_date <= $${paramCount++}`;
    }

    query += ` ORDER BY report_date DESC`;

    // Pagination
    const page = parseInt(filters.page) || 1;
    const limit = parseInt(filters.limit) || 20;
    const offset = (page - 1) * limit;

    params.push(limit, offset);
    query += ` LIMIT $${paramCount++} OFFSET $${paramCount}`;

    const result = await db.query(query, params);

    // Get total count
    const countResult = await db.query(
      `SELECT COUNT(*) FROM daily_reports WHERE user_id = $1`,
      [userId]
    );
    const totalItems = parseInt(countResult.rows[0].count);

    return {
      reports: result.rows,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(totalItems / limit),
        totalItems,
        itemsPerPage: limit,
      },
    };
  }

  // Create new report
  static async create(reportData) {
    const { userId, reportDate, description } = reportData;

    const result = await db.query(
      `INSERT INTO daily_reports (user_id, report_date, description) 
       VALUES ($1, $2, $3) 
       RETURNING *`,
      [userId, reportDate, description]
    );

    return result.rows[0];
  }

  // Update report
  static async update(id, description) {
    const result = await db.query(
      `UPDATE daily_reports 
       SET description = $1, updated_at = CURRENT_TIMESTAMP 
       WHERE id = $2 
       RETURNING *`,
      [description, id]
    );

    return result.rows[0];
  }

  // Delete report
  static async delete(id) {
    const result = await db.query(
      "DELETE FROM daily_reports WHERE id = $1 RETURNING id",
      [id]
    );
    return result.rows[0];
  }

  // Check if report exists for user and date
  static async existsForUserAndDate(userId, reportDate, excludeId = null) {
    let query =
      "SELECT id FROM daily_reports WHERE user_id = $1 AND report_date = $2";
    const params = [userId, reportDate];

    if (excludeId) {
      query += " AND id != $3";
      params.push(excludeId);
    }

    const result = await db.query(query, params);
    return result.rows.length > 0;
  }
}

module.exports = DailyReport;