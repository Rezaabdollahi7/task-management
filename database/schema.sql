-- =====================================================
-- Task Management System - Database Schema
-- =====================================================
-- PostgreSQL Database Schema
-- Created: 2025-01-27
-- =====================================================

-- Drop existing tables if they exist (for development only)
DROP TABLE IF EXISTS notifications CASCADE;
DROP TABLE IF EXISTS tasks CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- =====================================================
-- TABLE: users
-- =====================================================
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    full_name VARCHAR(100) NOT NULL,
    username VARCHAR(50) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(20) NOT NULL CHECK (role IN ('manager', 'employee')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for users table
CREATE INDEX idx_users_username ON users(username);
CREATE INDEX idx_users_role ON users(role);

-- Comments for users table
COMMENT ON TABLE users IS 'System users table (managers and employees)';
COMMENT ON COLUMN users.id IS 'Unique user identifier';
COMMENT ON COLUMN users.full_name IS 'User full name';
COMMENT ON COLUMN users.username IS 'Username (unique)';
COMMENT ON COLUMN users.password IS 'Password (bcrypt hashed)';
COMMENT ON COLUMN users.role IS 'User role: manager or employee';

-- =====================================================
-- TABLE: tasks
-- =====================================================
CREATE TABLE tasks (
    id SERIAL PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    description TEXT,
    status VARCHAR(20) NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'in_progress', 'completed', 'cancelled')),
    priority VARCHAR(20) NOT NULL DEFAULT 'medium' CHECK (priority IN ('urgent', 'high', 'medium', 'low')),
    
    -- Dates and Time Tracking
    task_date DATE,
    deadline DATE,
    actual_start_time TIMESTAMP,
    actual_end_time TIMESTAMP,
    
    -- Device Information (Optional)
    device_model VARCHAR(100),
    serial_number VARCHAR(100),
    reported_issue TEXT,
    
    -- Work Reports
    work_report TEXT,
    cancellation_reason TEXT,
    
    -- Foreign Keys
    employee_id INTEGER NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
    creator_id INTEGER NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
    
    -- Timestamps
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    -- Constraints
    CHECK (deadline >= task_date OR task_date IS NULL OR deadline IS NULL),
    CHECK (actual_end_time >= actual_start_time OR actual_end_time IS NULL OR actual_start_time IS NULL)
);

-- Indexes for tasks table
CREATE INDEX idx_tasks_employee_id ON tasks(employee_id);
CREATE INDEX idx_tasks_creator_id ON tasks(creator_id);
CREATE INDEX idx_tasks_status ON tasks(status);
CREATE INDEX idx_tasks_priority ON tasks(priority);
CREATE INDEX idx_tasks_deadline ON tasks(deadline);
CREATE INDEX idx_tasks_serial_number ON tasks(serial_number);
CREATE INDEX idx_tasks_created_at ON tasks(created_at DESC);
CREATE INDEX idx_tasks_status_employee ON tasks(status, employee_id);

-- Comments for tasks table
COMMENT ON TABLE tasks IS 'Tasks and work orders table';
COMMENT ON COLUMN tasks.id IS 'Unique task identifier';
COMMENT ON COLUMN tasks.title IS 'Task title';
COMMENT ON COLUMN tasks.status IS 'Status: open, in_progress, completed, cancelled';
COMMENT ON COLUMN tasks.priority IS 'Priority: urgent, high, medium, low';
COMMENT ON COLUMN tasks.task_date IS 'Scheduled date for task';
COMMENT ON COLUMN tasks.deadline IS 'Task deadline';
COMMENT ON COLUMN tasks.actual_start_time IS 'Actual start time (automatic)';
COMMENT ON COLUMN tasks.actual_end_time IS 'Actual end time (automatic)';
COMMENT ON COLUMN tasks.employee_id IS 'Assigned employee ID';
COMMENT ON COLUMN tasks.creator_id IS 'Creator (manager) ID';

-- =====================================================
-- TABLE: notifications
-- =====================================================
CREATE TABLE notifications (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    task_id INTEGER REFERENCES tasks(id) ON DELETE CASCADE,
    type VARCHAR(50) NOT NULL CHECK (type IN ('task_assigned', 'task_updated', 'status_changed', 'deadline_reminder')),
    title VARCHAR(200) NOT NULL,
    message TEXT NOT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for notifications table
CREATE INDEX idx_notifications_user_id ON notifications(user_id);
CREATE INDEX idx_notifications_task_id ON notifications(task_id);
CREATE INDEX idx_notifications_is_read ON notifications(is_read);
CREATE INDEX idx_notifications_created_at ON notifications(created_at DESC);
CREATE INDEX idx_notifications_user_unread ON notifications(user_id, is_read) WHERE is_read = FALSE;

-- Comments for notifications table
COMMENT ON TABLE notifications IS 'Notifications table';
COMMENT ON COLUMN notifications.type IS 'Notification type: task_assigned, task_updated, status_changed, deadline_reminder';
COMMENT ON COLUMN notifications.is_read IS 'Read status';

-- =====================================================
-- FUNCTION: Update updated_at timestamp
-- =====================================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for auto-updating updated_at
CREATE TRIGGER update_users_updated_at
    BEFORE UPDATE ON users
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_tasks_updated_at
    BEFORE UPDATE ON tasks
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- SEED DATA: Default Admin User
-- =====================================================
-- Password: admin123 (bcrypt hash with cost 10)
-- IMPORTANT: Change this password after first login in production!
INSERT INTO users (full_name, username, password, role) VALUES
('System Administrator', 'admin', '$2a$10$rqYqZ9h7LJhZF8GnP/QAHO.3.qX5RcJxLXZFQOJp7H.qBOJqE7TxK', 'manager');

-- =====================================================
-- VIEWS (Optional - for easier queries)
-- =====================================================

-- View: Tasks with employee and creator details
CREATE OR REPLACE VIEW v_tasks_detailed AS
SELECT 
    t.id,
    t.title,
    t.description,
    t.status,
    t.priority,
    t.task_date,
    t.deadline,
    t.actual_start_time,
    t.actual_end_time,
    CASE 
        WHEN t.actual_end_time IS NOT NULL AND t.actual_start_time IS NOT NULL 
        THEN t.actual_end_time - t.actual_start_time
        ELSE NULL
    END as duration,
    t.device_model,
    t.serial_number,
    t.reported_issue,
    t.work_report,
    t.cancellation_reason,
    t.created_at,
    t.updated_at,
    CASE WHEN t.deadline IS NOT NULL AND t.deadline < CURRENT_DATE AND t.status NOT IN ('completed', 'cancelled') 
        THEN TRUE 
        ELSE FALSE 
    END as is_overdue,
    e.id as employee_id,
    e.full_name as employee_name,
    e.username as employee_username,
    c.id as creator_id,
    c.full_name as creator_name,
    c.username as creator_username
FROM tasks t
INNER JOIN users e ON t.employee_id = e.id
INNER JOIN users c ON t.creator_id = c.id;

COMMENT ON VIEW v_tasks_detailed IS 'Detailed tasks view with employee and creator information';

-- View: Unread notifications count per user
CREATE OR REPLACE VIEW v_unread_notifications_count AS
SELECT 
    user_id,
    COUNT(*) as unread_count
FROM notifications
WHERE is_read = FALSE
GROUP BY user_id;

COMMENT ON VIEW v_unread_notifications_count IS 'Unread notifications count per user';

-- =====================================================
-- COMPLETE!
-- =====================================================
-- Database schema created successfully!
-- Default admin user: username = 'admin', password = 'admin123'
-- IMPORTANT: Change the admin password after first login!
-- =====================================================