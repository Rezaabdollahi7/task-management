// models/Task.js
// Task model for database operations

const db = require("../config/db");

class Task {
  // Find task by ID
  static async findById(id) {
    const result = await db.query(
      `SELECT t.*, 
              e.full_name as employee_name, e.username as employee_username,
              c.full_name as creator_name, c.username as creator_username
       FROM tasks t
       INNER JOIN users e ON t.employee_id = e.id
       INNER JOIN users c ON t.creator_id = c.id
       WHERE t.id = $1`,
      [id]
    );
    return result.rows[0];
  }

  // Get all tasks with filters
  static async getAll(filters = {}) {
    let query = `
      SELECT t.*, 
             e.full_name as employee_name, e.username as employee_username,
             c.full_name as creator_name, c.username as creator_username
      FROM tasks t
      INNER JOIN users e ON t.employee_id = e.id
      INNER JOIN users c ON t.creator_id = c.id
      WHERE 1=1
    `;
    const params = [];
    let paramCount = 1;

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

    // Filter by employee
    if (filters.employeeId) {
      params.push(filters.employeeId);
      query += ` AND t.employee_id = $${paramCount++}`;
    }

    // Filter by creator
    if (filters.creatorId) {
      params.push(filters.creatorId);
      query += ` AND t.creator_id = $${paramCount++}`;
    }

    // Search by title, description, device model, or serial number
    if (filters.search) {
      params.push(`%${filters.search}%`);
      query += ` AND (t.title ILIKE $${paramCount} OR t.description ILIKE $${paramCount} OR t.device_model ILIKE $${paramCount} OR t.serial_number ILIKE $${paramCount})`;
      paramCount++;
    }

    // Filter by date range
    if (filters.startDate) {
      params.push(filters.startDate);
      query += ` AND t.task_date >= $${paramCount++}`;
    }

    if (filters.endDate) {
      params.push(filters.endDate);
      query += ` AND t.task_date <= $${paramCount++}`;
    }

    // Check for overdue tasks
    if (filters.overdue === "true") {
      query += ` AND t.deadline < CURRENT_DATE AND t.status NOT IN ('completed', 'cancelled')`;
    }

    // Order by
    query += ` ORDER BY t.created_at DESC`;

    // Pagination
    const page = parseInt(filters.page) || 1;
    const limit = parseInt(filters.limit) || 10;
    const offset = (page - 1) * limit;

    params.push(limit, offset);
    query += ` LIMIT $${paramCount++} OFFSET $${paramCount}`;

    const result = await db.query(query, params);

    // Get total count
    let countQuery = `SELECT COUNT(*) FROM tasks t WHERE 1=1`;
    const countParams = [];
    let countParamCount = 1;

    if (filters.status) {
      countParams.push(filters.status);
      countQuery += ` AND t.status = $${countParamCount++}`;
    }

    if (filters.priority) {
      countParams.push(filters.priority);
      countQuery += ` AND t.priority = $${countParamCount++}`;
    }

    if (filters.employeeId) {
      countParams.push(filters.employeeId);
      countQuery += ` AND t.employee_id = $${countParamCount++}`;
    }

    if (filters.creatorId) {
      countParams.push(filters.creatorId);
      countQuery += ` AND t.creator_id = $${countParamCount++}`;
    }

    if (filters.search) {
      countParams.push(`%${filters.search}%`);
      countQuery += ` AND (t.title ILIKE $${countParamCount} OR t.description ILIKE $${countParamCount} OR t.device_model ILIKE $${countParamCount} OR t.serial_number ILIKE $${countParamCount})`;
      countParamCount++;
    }

    if (filters.startDate) {
      countParams.push(filters.startDate);
      countQuery += ` AND t.task_date >= $${countParamCount++}`;
    }

    if (filters.endDate) {
      countParams.push(filters.endDate);
      countQuery += ` AND t.task_date <= $${countParamCount++}`;
    }

    if (filters.overdue === "true") {
      countQuery += ` AND t.deadline < CURRENT_DATE AND t.status NOT IN ('completed', 'cancelled')`;
    }

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

  // Create new task
  static async create(taskData) {
    const {
      title,
      description,
      status = "open",
      priority = "medium",
      taskDate,
      deadline,
      deviceModel,
      serialNumber,
      reportedIssue,
      employeeId,
      creatorId,
    } = taskData;

    const result = await db.query(
      `INSERT INTO tasks (
        title, description, status, priority, task_date, deadline,
        device_model, serial_number, reported_issue, employee_id, creator_id
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
      RETURNING *`,
      [
        title,
        description,
        status,
        priority,
        taskDate,
        deadline,
        deviceModel,
        serialNumber,
        reportedIssue,
        employeeId,
        creatorId,
      ]
    );

    return result.rows[0];
  }

  // Update task
  static async update(id, taskData) {
    const updates = [];
    const params = [];
    let paramCount = 1;

    if (taskData.title !== undefined) {
      params.push(taskData.title);
      updates.push(`title = $${paramCount++}`);
    }

    if (taskData.description !== undefined) {
      params.push(taskData.description);
      updates.push(`description = $${paramCount++}`);
    }

    if (taskData.priority !== undefined) {
      params.push(taskData.priority);
      updates.push(`priority = $${paramCount++}`);
    }

    if (taskData.taskDate !== undefined) {
      params.push(taskData.taskDate);
      updates.push(`task_date = $${paramCount++}`);
    }

    if (taskData.deadline !== undefined) {
      params.push(taskData.deadline);
      updates.push(`deadline = $${paramCount++}`);
    }

    if (taskData.deviceModel !== undefined) {
      params.push(taskData.deviceModel);
      updates.push(`device_model = $${paramCount++}`);
    }

    if (taskData.serialNumber !== undefined) {
      params.push(taskData.serialNumber);
      updates.push(`serial_number = $${paramCount++}`);
    }

    if (taskData.reportedIssue !== undefined) {
      params.push(taskData.reportedIssue);
      updates.push(`reported_issue = $${paramCount++}`);
    }

    if (taskData.employeeId !== undefined) {
      params.push(taskData.employeeId);
      updates.push(`employee_id = $${paramCount++}`);
    }

    if (updates.length === 0) {
      throw new Error("No fields to update");
    }

    params.push(id);
    const query = `
      UPDATE tasks 
      SET ${updates.join(", ")}, updated_at = CURRENT_TIMESTAMP 
      WHERE id = $${paramCount} 
      RETURNING *
    `;

    const result = await db.query(query, params);
    return result.rows[0];
  }

  // Update task status
  static async updateStatus(id, status, userId) {
    // If status is changing to 'in_progress' and actual_start_time is null, set it
    // If status is changing to 'completed', set actual_end_time
    let query = "UPDATE tasks SET status = $1, updated_at = CURRENT_TIMESTAMP";
    const params = [status];
    let paramCount = 2;

    if (status === "in_progress") {
      query += `, actual_start_time = COALESCE(actual_start_time, CURRENT_TIMESTAMP)`;
    }

    if (status === "completed") {
      query += `, actual_end_time = CURRENT_TIMESTAMP`;
    }

    params.push(id);
    query += ` WHERE id = $${paramCount} RETURNING *`;

    const result = await db.query(query, params);
    return result.rows[0];
  }

  // Cancel task
  static async cancel(id, cancellationReason) {
    const result = await db.query(
      `UPDATE tasks 
       SET status = 'cancelled', cancellation_reason = $1, updated_at = CURRENT_TIMESTAMP 
       WHERE id = $2 
       RETURNING *`,
      [cancellationReason, id]
    );
    return result.rows[0];
  }

  // Add work report
  static async addWorkReport(id, workReport) {
    const result = await db.query(
      `UPDATE tasks 
       SET work_report = $1, updated_at = CURRENT_TIMESTAMP 
       WHERE id = $2 
       RETURNING *`,
      [workReport, id]
    );
    return result.rows[0];
  }

  // Reassign task
  static async reassign(id, newEmployeeId) {
    const result = await db.query(
      `UPDATE tasks 
       SET employee_id = $1, updated_at = CURRENT_TIMESTAMP 
       WHERE id = $2 
       RETURNING *`,
      [newEmployeeId, id]
    );
    return result.rows[0];
  }

  // Delete task
  static async delete(id) {
    const result = await db.query(
      "DELETE FROM tasks WHERE id = $1 RETURNING id",
      [id]
    );
    return result.rows[0];
  }
}

module.exports = Task;
