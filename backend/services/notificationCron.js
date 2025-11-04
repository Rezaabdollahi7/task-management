// services/notificationCron.js
// Cron job for automated deadline notifications

const cron = require("node-cron");
const db = require("../config/db");
const Notification = require("../models/Notification");

// Check for approaching deadlines (24 hours before)
const checkApproachingDeadlines = async () => {
  try {
    console.log("🔍 Checking for approaching deadlines...");

    const query = `
      SELECT t.id, t.title, t.deadline, t.employee_id, t.creator_id,
             u.full_name as employee_name
      FROM tasks t
      JOIN users u ON t.employee_id = u.id
      WHERE t.status IN ('open', 'in_progress')
        AND t.deadline IS NOT NULL
        AND t.deadline BETWEEN NOW() AND NOW() + INTERVAL '24 hours'
        AND NOT EXISTS (
          SELECT 1 FROM notifications n
          WHERE n.task_id = t.id
            AND n.type = 'deadline_approaching'
            AND n.created_at > NOW() - INTERVAL '24 hours'
        )
    `;

    const result = await db.query(query);
    const tasks = result.rows;

    console.log(`📋 Found ${tasks.length} task(s) with approaching deadline`);

    for (const task of tasks) {
      // Notify employee
      await Notification.createDeadlineApproaching(
        task.id,
        task.employee_id,
        task.title
      );

      // Notify manager
      if (task.creator_id) {
        await Notification.createDeadlineApproaching(
          task.id,
          task.creator_id,
          task.title
        );
      }

      console.log(`✅ Deadline notification sent for task: ${task.title}`);
    }
  } catch (error) {
    console.error("❌ Error checking approaching deadlines:", error);
  }
};

// Check for overdue tasks
const checkOverdueTasks = async () => {
  try {
    console.log("🔍 Checking for overdue tasks...");

    const query = `
      SELECT t.id, t.title, t.deadline, t.employee_id, t.creator_id,
             u.full_name as employee_name
      FROM tasks t
      JOIN users u ON t.employee_id = u.id
      WHERE t.status IN ('open', 'in_progress')
        AND t.deadline IS NOT NULL
        AND t.deadline < NOW()
        AND NOT EXISTS (
          SELECT 1 FROM notifications n
          WHERE n.task_id = t.id
            AND n.type = 'task_overdue'
            AND n.created_at > NOW() - INTERVAL '24 hours'
        )
    `;

    const result = await db.query(query);
    const tasks = result.rows;

    console.log(`📋 Found ${tasks.length} overdue task(s)`);

    for (const task of tasks) {
      // Notify employee
      await Notification.createTaskOverdue(
        task.id,
        task.employee_id,
        task.title
      );

      // Notify manager
      if (task.creator_id) {
        await Notification.createTaskOverdue(
          task.id,
          task.creator_id,
          task.title
        );
      }

      console.log(`✅ Overdue notification sent for task: ${task.title}`);
    }
  } catch (error) {
    console.error("❌ Error checking overdue tasks:", error);
  }
};

// Initialize cron jobs
const initCronJobs = () => {
  // Run every hour to check approaching deadlines and overdue tasks
  // Schedule: "0 * * * *" = every hour at minute 0
  cron.schedule("0 * * * *", async () => {
    console.log("\n⏰ Running scheduled notification check...");
    await checkApproachingDeadlines();
    await checkOverdueTasks();
    console.log("✅ Scheduled notification check completed\n");
  });

  console.log("✅ Notification cron jobs initialized");
  console.log("📅 Schedule: Every hour at minute 0");

  // Run once on startup for testing
  setTimeout(async () => {
    console.log("\n🚀 Running initial notification check...");
    await checkApproachingDeadlines();
    await checkOverdueTasks();
    console.log("✅ Initial notification check completed\n");
  }, 5000); // Wait 5 seconds after startup
};

module.exports = { initCronJobs };
