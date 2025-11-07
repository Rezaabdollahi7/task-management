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

// @route   GET /api/dashboard/charts
// @desc    Get chart data for dashboard
// @access  Private (Manager only)
// @route   GET /api/dashboard/charts
// @desc    Get chart data for dashboard
// @access  Private (Manager only)
const getChartData = async (req, res) => {
  try {
    // Tasks by status (for pie chart)
    const statusData = await db.query(`
      SELECT 
        status,
        COUNT(*)::int as count
      FROM tasks
      GROUP BY status
      ORDER BY count DESC
    `);

    // Tasks by priority (for bar chart)
    const priorityData = await db.query(`
      SELECT 
        priority,
        COUNT(*)::int as count
      FROM tasks
      WHERE status NOT IN ('completed', 'cancelled')
      GROUP BY priority
      ORDER BY 
        CASE priority
          WHEN 'urgent' THEN 1
          WHEN 'high' THEN 2
          WHEN 'medium' THEN 3
          WHEN 'low' THEN 4
        END
    `);

    // Tasks created per day (last 7 days) - for line chart
    const dailyTasks = await db.query(`
      SELECT 
        DATE(created_at) as date,
        COUNT(*)::int as count
      FROM tasks
      WHERE created_at >= CURRENT_DATE - INTERVAL '7 days'
      GROUP BY DATE(created_at)
      ORDER BY date ASC
    `);

    // Tasks this week by status
    const weeklyTasks = await db.query(`
      SELECT 
        status,
        COUNT(*)::int as count
      FROM tasks
      WHERE created_at >= date_trunc('week', CURRENT_DATE)
      GROUP BY status
    `);

    // Today's tasks
    const todayTasks = await db.query(`
      SELECT 
        COUNT(*)::int as total,
        COUNT(*) FILTER (WHERE status = 'open')::int as open,
        COUNT(*) FILTER (WHERE status = 'in_progress')::int as in_progress,
        COUNT(*) FILTER (WHERE status = 'completed')::int as completed
      FROM tasks
      WHERE DATE(created_at) = CURRENT_DATE
    `);

    // Employee performance
    const employeePerformance = await db.query(`
  SELECT                                                                                                                                                                                                                                                        
    u.id,
    u.full_name,
    COUNT(t.id)::int as total_tasks,
    COUNT(t.id) FILTER (WHERE t.status = 'completed')::int as completed_tasks,
    COUNT(t.id) FILTER (WHERE t.status = 'in_progress')::int as in_progress_tasks,
    COUNT(t.id) FILTER (WHERE t.status = 'open')::int as open_tasks,
    COUNT(t.id) FILTER (WHERE t.created_at >= date_trunc('week', CURRENT_DATE))::int as this_week_tasks,
    COUNT(t.id) FILTER (WHERE DATE(t.created_at) = CURRENT_DATE)::int as today_tasks,
    CASE 
      WHEN COUNT(t.id) > 0 THEN 
        ROUND((COUNT(t.id) FILTER (WHERE t.status = 'completed')::numeric / COUNT(t.id)::numeric * 100), 1)
      ELSE 0 
    END as completion_rate
  FROM users u
  LEFT JOIN tasks t ON u.id = t.employee_id
  WHERE u.role = 'employee'
  GROUP BY u.id, u.full_name
  ORDER BY completed_tasks DESC
`);

    //User performance (completed vs incomplete)
    const userPerformance = await db.query(`
      SELECT 
        u.full_name as name,
        COUNT(CASE WHEN t.status = 'completed' THEN 1 END)::int as completed,
        COUNT(CASE WHEN t.status NOT IN ('completed', 'cancelled') THEN 1 END)::int as incomplete
      FROM users u
      LEFT JOIN tasks t ON u.id = t.employee_id
      WHERE u.role = 'employee'
      GROUP BY u.id, u.full_name
      HAVING COUNT(t.id) > 0
      ORDER BY completed DESC
      LIMIT 10
    `);

    //  Tasks timeline (last 6 months)
    const timelineResult = await db.query(`
      WITH months AS (
        SELECT 
          generate_series(
            date_trunc('month', CURRENT_DATE - INTERVAL '2 months'),
            date_trunc('month', CURRENT_DATE),
            '1 month'::interval
          ) AS month
      )
      SELECT 
        TO_CHAR(m.month, 'Mon') as month,
        COALESCE(SUM(CASE WHEN t.status = 'open' THEN 1 ELSE 0 END), 0) as open,
        COALESCE(SUM(CASE WHEN t.status = 'in_progress' THEN 1 ELSE 0 END), 0) as in_progress,
        COALESCE(SUM(CASE WHEN t.status = 'completed' THEN 1 ELSE 0 END), 0) as completed,
        COALESCE(SUM(CASE WHEN t.status = 'cancelled' THEN 1 ELSE 0 END), 0) as cancelled
      FROM months m
      LEFT JOIN tasks t ON date_trunc('month', t.created_at) = m.month
      GROUP BY m.month
      ORDER BY m.month ASC
    `);

    res.json({
      success: true,
      data: {
        statusChart: statusData.rows,
        priorityChart: priorityData.rows,
        dailyChart: dailyTasks.rows,
        timelineChart: timelineResult.rows,
        weeklyTasks: weeklyTasks.rows,
        todayTasks: todayTasks.rows[0] || {
          total: 0,
          open: 0,
          in_progress: 0,
          completed: 0,
        },
        employeePerformance: employeePerformance.rows,
        userPerformanceChart: userPerformance.rows,
      },
    });
  } catch (error) {
    console.error("Get chart data error:", error);
    console.error("Error details:", error.message);
    console.error("Error stack:", error.stack);
    res.status(500).json({
      success: false,
      message: "Server error while fetching chart data",
      error: error.message,
    });
  }
};

// @route   GET /api/dashboard/my-charts
// @desc    Get chart data for employee
// @access  Private (Employee only)
// @route   GET /api/dashboard/my-charts
// @desc    Get chart data for employee
// @access  Private (Employee only)
const getMyChartData = async (req, res) => {
  try {
    const employeeId = req.user.id;

    // My tasks by status (for pie chart)
    const statusData = await db.query(
      `
      SELECT 
        status,
        COUNT(*)::int as count
      FROM tasks
      WHERE employee_id = $1
      GROUP BY status
      ORDER BY count DESC
    `,
      [employeeId]
    );

    // My tasks by priority
    const priorityData = await db.query(
      `
      SELECT 
        priority,
        COUNT(*)::int as count
      FROM tasks
      WHERE employee_id = $1 AND status NOT IN ('completed', 'cancelled')
      GROUP BY priority
      ORDER BY 
        CASE priority
          WHEN 'urgent' THEN 1
          WHEN 'high' THEN 2
          WHEN 'medium' THEN 3
          WHEN 'low' THEN 4
        END
    `,
      [employeeId]
    );

    // My tasks created per day (last 7 days)
    const dailyTasks = await db.query(
      `
      SELECT 
        DATE(created_at) as date,
        COUNT(*)::int as count
      FROM tasks
      WHERE employee_id = $1 AND created_at >= CURRENT_DATE - INTERVAL '7 days'
      GROUP BY DATE(created_at)
      ORDER BY date ASC
    `,
      [employeeId]
    );

    // This week tasks
    const weeklyTasks = await db.query(
      `
      SELECT 
        status,
        COUNT(*)::int as count
      FROM tasks
      WHERE employee_id = $1 AND created_at >= date_trunc('week', CURRENT_DATE)
      GROUP BY status
    `,
      [employeeId]
    );

    // Today's tasks
    const todayTasks = await db.query(
      `
      SELECT 
        COUNT(*)::int as total,
        COUNT(*) FILTER (WHERE status = 'open')::int as open,
        COUNT(*) FILTER (WHERE status = 'in_progress')::int as in_progress,
        COUNT(*) FILTER (WHERE status = 'completed')::int as completed
      FROM tasks
      WHERE employee_id = $1 AND DATE(created_at) = CURRENT_DATE
    `,
      [employeeId]
    );

    res.json({
      success: true,
      data: {
        statusChart: statusData.rows,
        priorityChart: priorityData.rows,
        dailyChart: dailyTasks.rows,
        weeklyTasks: weeklyTasks.rows,
        todayTasks: todayTasks.rows[0] || {
          total: 0,
          open: 0,
          in_progress: 0,
          completed: 0,
        },
      },
    });
  } catch (error) {
    console.error("Get my chart data error:", error);
    console.error("Error details:", error.message);
    res.status(500).json({
      success: false,
      message: "Server error while fetching chart data",
      error: error.message,
    });
  }
};

module.exports = {
  getStats,
  getMyStats,
  getEmployeeStats,
  getRecentTasks,
  getChartData,
  getMyChartData,
};
