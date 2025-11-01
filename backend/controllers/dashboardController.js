// controllers/dashboardController.js
// Dashboard controller for statistics and analytics

const db = require("../config/db");

// @route   GET /api/dashboard/stats
// @desc    Get dashboard statistics
// @access  Private (Manager only)
const getStats = async (req, res) => {
  try {
    // Total tasks by status
    const statusStats = await db.query(`
      SELECT 
        COUNT(*) FILTER (WHERE status = 'open') as open_count,
        COUNT(*) FILTER (WHERE status = 'in_progress') as in_progress_count,
        COUNT(*) FILTER (WHERE status = 'completed') as completed_count,
        COUNT(*) FILTER (WHERE status = 'cancelled') as cancelled_count,
        COUNT(*) as total_count
      FROM tasks
    `);

    // Tasks by priority
    const priorityStats = await db.query(`
      SELECT 
        COUNT(*) FILTER (WHERE priority = 'urgent') as urgent_count,
        COUNT(*) FILTER (WHERE priority = 'high') as high_count,
        COUNT(*) FILTER (WHERE priority = 'medium') as medium_count,
        COUNT(*) FILTER (WHERE priority = 'low') as low_count
      FROM tasks
      WHERE status NOT IN ('completed', 'cancelled')
    `);

    // Overdue tasks
    const overdueStats = await db.query(`
      SELECT COUNT(*) as overdue_count
      FROM tasks
      WHERE deadline < CURRENT_DATE 
        AND status NOT IN ('completed', 'cancelled')
    `);

    // Total users
    const userStats = await db.query(`
      SELECT 
        COUNT(*) FILTER (WHERE role = 'manager') as manager_count,
        COUNT(*) FILTER (WHERE role = 'employee') as employee_count,
        COUNT(*) as total_count
      FROM users
    `);

    // Recent completed tasks (last 7 days)
    const recentCompleted = await db.query(`
      SELECT COUNT(*) as recent_completed_count
      FROM tasks
      WHERE status = 'completed' 
        AND updated_at >= CURRENT_DATE - INTERVAL '7 days'
    `);

    res.json({
      success: true,
      data: {
        tasks: {
          total: parseInt(statusStats.rows[0].total_count),
          open: parseInt(statusStats.rows[0].open_count),
          inProgress: parseInt(statusStats.rows[0].in_progress_count),
          completed: parseInt(statusStats.rows[0].completed_count),
          cancelled: parseInt(statusStats.rows[0].cancelled_count),
          overdue: parseInt(overdueStats.rows[0].overdue_count),
          recentCompleted: parseInt(
            recentCompleted.rows[0].recent_completed_count
          ),
        },
        priority: {
          urgent: parseInt(priorityStats.rows[0].urgent_count),
          high: parseInt(priorityStats.rows[0].high_count),
          medium: parseInt(priorityStats.rows[0].medium_count),
          low: parseInt(priorityStats.rows[0].low_count),
        },
        users: {
          total: parseInt(userStats.rows[0].total_count),
          managers: parseInt(userStats.rows[0].manager_count),
          employees: parseInt(userStats.rows[0].employee_count),
        },
      },
    });
  } catch (error) {
    console.error("Get stats error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while fetching statistics",
    });
  }
};

// @route   GET /api/dashboard/my-stats
// @desc    Get employee's personal statistics
// @access  Private (Employee only)
const getMyStats = async (req, res) => {
  try {
    const employeeId = req.user.id;

    // My tasks by status
    const statusStats = await db.query(
      `
      SELECT 
        COUNT(*) FILTER (WHERE status = 'open') as open_count,
        COUNT(*) FILTER (WHERE status = 'in_progress') as in_progress_count,
        COUNT(*) FILTER (WHERE status = 'completed') as completed_count,
        COUNT(*) FILTER (WHERE status = 'cancelled') as cancelled_count,
        COUNT(*) as total_count
      FROM tasks
      WHERE employee_id = $1
    `,
      [employeeId]
    );

    // My tasks by priority
    const priorityStats = await db.query(
      `
      SELECT 
        COUNT(*) FILTER (WHERE priority = 'urgent') as urgent_count,
        COUNT(*) FILTER (WHERE priority = 'high') as high_count,
        COUNT(*) FILTER (WHERE priority = 'medium') as medium_count,
        COUNT(*) FILTER (WHERE priority = 'low') as low_count
      FROM tasks
      WHERE employee_id = $1 
        AND status NOT IN ('completed', 'cancelled')
    `,
      [employeeId]
    );

    // My overdue tasks
    const overdueStats = await db.query(
      `
      SELECT COUNT(*) as overdue_count
      FROM tasks
      WHERE employee_id = $1 
        AND deadline < CURRENT_DATE 
        AND status NOT IN ('completed', 'cancelled')
    `,
      [employeeId]
    );

    // Recently completed (last 7 days)
    const recentCompleted = await db.query(
      `
      SELECT COUNT(*) as recent_completed_count
      FROM tasks
      WHERE employee_id = $1 
        AND status = 'completed' 
        AND updated_at >= CURRENT_DATE - INTERVAL '7 days'
    `,
      [employeeId]
    );

    res.json({
      success: true,
      data: {
        tasks: {
          total: parseInt(statusStats.rows[0].total_count),
          open: parseInt(statusStats.rows[0].open_count),
          inProgress: parseInt(statusStats.rows[0].in_progress_count),
          completed: parseInt(statusStats.rows[0].completed_count),
          cancelled: parseInt(statusStats.rows[0].cancelled_count),
          overdue: parseInt(overdueStats.rows[0].overdue_count),
          recentCompleted: parseInt(
            recentCompleted.rows[0].recent_completed_count
          ),
        },
        priority: {
          urgent: parseInt(priorityStats.rows[0].urgent_count),
          high: parseInt(priorityStats.rows[0].high_count),
          medium: parseInt(priorityStats.rows[0].medium_count),
          low: parseInt(priorityStats.rows[0].low_count),
        },
      },
    });
  } catch (error) {
    console.error("Get my stats error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while fetching statistics",
    });
  }
};

// @route   GET /api/dashboard/employee-stats
// @desc    Get statistics by employee
// @access  Private (Manager only)
const getEmployeeStats = async (req, res) => {
  try {
    const employeeStats = await db.query(`
      SELECT 
        u.id,
        u.full_name,
        u.username,
        COUNT(t.id) as total_tasks,
        COUNT(t.id) FILTER (WHERE t.status = 'open') as open_tasks,
        COUNT(t.id) FILTER (WHERE t.status = 'in_progress') as in_progress_tasks,
        COUNT(t.id) FILTER (WHERE t.status = 'completed') as completed_tasks,
        COUNT(t.id) FILTER (WHERE t.deadline < CURRENT_DATE AND t.status NOT IN ('completed', 'cancelled')) as overdue_tasks
      FROM users u
      LEFT JOIN tasks t ON u.id = t.employee_id
      WHERE u.role = 'employee'
      GROUP BY u.id, u.full_name, u.username
      ORDER BY total_tasks DESC
    `);

    res.json({
      success: true,
      data: employeeStats.rows,
    });
  } catch (error) {
    console.error("Get employee stats error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while fetching employee statistics",
    });
  }
};

// @route   GET /api/dashboard/recent-tasks
// @desc    Get recent tasks
// @access  Private
const getRecentTasks = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 5;
    let query = `
      SELECT t.*, 
             e.full_name as employee_name,
             c.full_name as creator_name
      FROM tasks t
      INNER JOIN users e ON t.employee_id = e.id
      INNER JOIN users c ON t.creator_id = c.id
    `;

    const params = [];

    // If employee, show only their tasks
    if (req.user.role === "employee") {
      query += ` WHERE t.employee_id = $1`;
      params.push(req.user.id);
    }

    query += ` ORDER BY t.created_at DESC LIMIT $${params.length + 1}`;
    params.push(limit);

    const result = await db.query(query, params);

    res.json({
      success: true,
      data: result.rows,
    });
  } catch (error) {
    console.error("Get recent tasks error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while fetching recent tasks",
    });
  }
};

module.exports = {
  getStats,
  getMyStats,
  getEmployeeStats,
  getRecentTasks,
};
