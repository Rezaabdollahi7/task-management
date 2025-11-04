// models/Notification.js
// Notification model for database operations

const db = require("../config/db");

class Notification {
  // Create a new notification
  static async create({
    userId,
    type,
    title,
    message,
    taskId = null,
    priority = "normal",
  }) {
    const query = `
      INSERT INTO notifications (user_id, type, title, message, task_id, priority)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *
    `;

    const values = [userId, type, title, message, taskId, priority];
    const result = await db.query(query, values);
    return result.rows[0];
  }

  // Get all notifications for a user
  static async findByUserId(
    userId,
    { limit = 20, offset = 0, unreadOnly = false } = {}
  ) {
    let query = `
      SELECT n.*, t.title as task_title
      FROM notifications n
      LEFT JOIN tasks t ON n.task_id = t.id
      WHERE n.user_id = $1
    `;

    const values = [userId];

    if (unreadOnly) {
      query += ` AND n.is_read = false`;
    }

    query += ` ORDER BY n.created_at DESC LIMIT $2 OFFSET $3`;
    values.push(limit, offset);

    const result = await db.query(query, values);
    return result.rows;
  }

  // Get unread count for a user
  static async getUnreadCount(userId) {
    const query = `
      SELECT COUNT(*) as count
      FROM notifications
      WHERE user_id = $1 AND is_read = false
    `;

    const result = await db.query(query, [userId]);
    return parseInt(result.rows[0].count);
  }

  // Mark notification as read
  static async markAsRead(notificationId, userId) {
    const query = `
      UPDATE notifications
      SET is_read = true, read_at = CURRENT_TIMESTAMP
      WHERE id = $1 AND user_id = $2
      RETURNING *
    `;

    const result = await db.query(query, [notificationId, userId]);
    return result.rows[0];
  }

  // Mark all notifications as read for a user
  static async markAllAsRead(userId) {
    const query = `
      UPDATE notifications
      SET is_read = true, read_at = CURRENT_TIMESTAMP
      WHERE user_id = $1 AND is_read = false
      RETURNING *
    `;

    const result = await db.query(query, [userId]);
    return result.rows;
  }

  // Delete a notification
  static async delete(notificationId, userId) {
    const query = `
      DELETE FROM notifications
      WHERE id = $1 AND user_id = $2
      RETURNING *
    `;

    const result = await db.query(query, [notificationId, userId]);
    return result.rows[0];
  }

  // Delete old read notifications (cleanup)
  static async deleteOldRead(daysOld = 30) {
    const query = `
      DELETE FROM notifications
      WHERE is_read = true 
        AND read_at < CURRENT_TIMESTAMP - INTERVAL '${daysOld} days'
      RETURNING *
    `;

    const result = await db.query(query);
    return result.rows;
  }

  // Create notification for task assignment
  static async createTaskAssigned(taskId, employeeId, taskTitle, assignedBy) {
    return await this.create({
      userId: employeeId,
      type: "task_assigned",
      title: "تسک جدید به شما اختصاص یافت",
      message: `تسک "${taskTitle}" توسط ${assignedBy} به شما تخصیص داده شد`,
      taskId: taskId,
      priority: "normal",
    });
  }

  // Create notification for task completion
  static async createTaskCompleted(taskId, managerId, taskTitle, employeeName) {
    return await this.create({
      userId: managerId,
      type: "task_completed",
      title: "تسک تکمیل شد",
      message: `تسک "${taskTitle}" توسط ${employeeName} تکمیل شد`,
      taskId: taskId,
      priority: "normal",
    });
  }

  // Create notification for deadline approaching (24 hours before)
  static async createDeadlineApproaching(taskId, userId, taskTitle) {
    return await this.create({
      userId: userId,
      type: "deadline_approaching",
      title: "⚠️ تسک به deadline نزدیک است",
      message: `تسک "${taskTitle}" فردا به deadline می‌رسد`,
      taskId: taskId,
      priority: "high",
    });
  }

  // Create notification for overdue task
  static async createTaskOverdue(taskId, userId, taskTitle) {
    return await this.create({
      userId: userId,
      type: "task_overdue",
      title: "🔴 تسک از deadline گذشته است",
      message: `تسک "${taskTitle}" از deadline گذشته است و نیاز به توجه فوری دارد`,
      taskId: taskId,
      priority: "urgent",
    });
  }

  // Create notification for status change
  static async createStatusChanged(
    taskId,
    managerId,
    taskTitle,
    oldStatus,
    newStatus,
    changedBy
  ) {
    const statusLabels = {
      open: "باز",
      in_progress: "در حال انجام",
      completed: "تکمیل شده",
      cancelled: "لغو شده",
    };

    return await this.create({
      userId: managerId,
      type: "status_changed",
      title: "تغییر وضعیت تسک",
      message: `وضعیت تسک "${taskTitle}" از ${statusLabels[oldStatus]} به ${statusLabels[newStatus]} توسط ${changedBy} تغییر کرد`,
      taskId: taskId,
      priority: "normal",
    });
  }

  // Create notification for work report
  static async createWorkReportAdded(
    taskId,
    managerId,
    taskTitle,
    employeeName
  ) {
    return await this.create({
      userId: managerId,
      type: "work_report_added",
      title: "گزارش کار جدید",
      message: `${employeeName} گزارش کار برای تسک "${taskTitle}" را ثبت کرد`,
      taskId: taskId,
      priority: "normal",
    });
  }

  // Create notification for task reassignment (to old employee)
  static async createTaskReassignedFrom(
    taskId,
    oldEmployeeId,
    taskTitle,
    newEmployeeName,
    reassignedBy
  ) {
    return await this.create({
      userId: oldEmployeeId,
      type: "task_reassigned",
      title: "تسک از شما منتقل شد",
      message: `تسک "${taskTitle}" از شما به ${newEmployeeName} توسط ${reassignedBy} منتقل شد`,
      taskId: taskId,
      priority: "normal",
    });
  }

  // Create notification for task reassignment (to new employee)
  static async createTaskReassignedTo(
    taskId,
    newEmployeeId,
    taskTitle,
    reassignedBy
  ) {
    return await this.create({
      userId: newEmployeeId,
      type: "task_reassigned",
      title: "تسک جدید به شما منتقل شد",
      message: `تسک "${taskTitle}" توسط ${reassignedBy} به شما منتقل شد`,
      taskId: taskId,
      priority: "normal",
    });
  }
}

module.exports = Notification;
