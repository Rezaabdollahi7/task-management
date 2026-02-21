<div align="center">

# 🚀 SieManage

### Professional Task Management System

[![React](https://img.shields.io/badge/React-18.2-blue)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-20-green)](https://nodejs.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-14-blue)](https://www.postgresql.org/)
[![License](https://img.shields.io/badge/License-MIT-yellow)](./LICENSE)

[🌐 Live Demo](https://siemanage.com) | [📚 API Docs](./docs/API.md) | [🗄️ Database Schema](./docs/DATABASE.md) | [📋 Changelog](./CHANGELOG.md)

[English](./README.md) | [فارسی](./README.fa.md)

</div>

---

## 📋 About

**SieManage** is a comprehensive task management system designed to improve team collaboration and productivity. It helps managers efficiently assign tasks, track progress, and manage team workload while providing employees with a clear view of their daily responsibilities.

**Key Focus:**
- Team task management and collaboration
- Efficient task delegation and tracking
- Real-time progress monitoring
- Bilingual support (Persian/English)

**Live Application:** [https://siemanage.com](https://siemanage.com)

---

## ✨ Features

### 🔐 Authentication & Authorization
- JWT-based secure authentication
- Role-based access control (Manager/Employee)
- Session management
- Password encryption with bcrypt

### 📊 Dashboard & Analytics
- Real-time statistics and KPIs
- Task completion rates
- Priority-based task distribution
- Weekly performance charts
- Employee workload overview

### ✅ Task Management
- Complete CRUD operations
- Task assignment to employees
- Priority levels (Urgent, High, Medium, Low)
- Status tracking (Open, In Progress, Completed, Cancelled)
- Deadline management
- Detailed task information
- Work report submission

### 📅 Calendar View
- Interactive task calendar
- Persian (Jalali) and Gregorian calendar support
- Priority-based visual indicators
- Date filtering and navigation
- Quick task creation from calendar

### 👥 User Management (Manager Only)
- Add/Edit/Delete users
- Role assignment
- User status management
- Team overview

### 🔔 Real-time Notifications
- WebSocket-based notifications
- Approaching deadline alerts
- Overdue task warnings
- New task assignments
- Status change updates

### 📝 Daily Work Reports
- Detailed work report submission
- Task completion documentation
- Report viewing for managers
- Historical work records

### 🌐 Bilingual Interface
- Full Persian (RTL) support
- English (LTR) support
- Seamless language switching
- Localized date formats

### 📱 Responsive Design
- Mobile-optimized interface
- Tablet-friendly layout
- Desktop full-feature experience
- Touch-friendly controls

---

## ⚙️ Tech Stack

### Backend
- **Node.js (v20.x)** - JavaScript Runtime
- **Express.js (v4.18)** - Web Framework
- **PostgreSQL (v14)** - Relational Database
- **Socket.io (v4.6)** - Real-time WebSocket Communication
- **JWT (jsonwebtoken)** - Authentication & Authorization
- **bcrypt** - Password Hashing
- **node-cron** - Scheduled Tasks for Notifications
- **pg (node-postgres)** - PostgreSQL Client

### Frontend
- **React (v18.2)** - UI Library
- **Vite (v5.4)** - Build Tool & Dev Server
- **React Router (v6)** - Client-side Routing
- **TailwindCSS (v3.4)** - Utility-first CSS Framework
- **Axios** - HTTP Client
- **Socket.io Client** - Real-time Communication
- **i18next** - Internationalization (i18n)
- **react-i18next** - React Integration for i18n
- **moment-jalaali** - Persian Calendar Support
- **react-big-calendar** - Calendar Component
- **react-modern-calendar-datepicker** - Bilingual Date Picker
- **react-hot-toast** - Toast Notifications
- **Recharts** - Data Visualization Charts
- **React Icons** - Icon Library

### DevOps & Infrastructure
- **Docker (v20.10+)** - Containerization
- **Docker Compose (v2.0+)** - Multi-container Orchestration
- **Nginx (v1.24)** - Reverse Proxy & Load Balancer
- **Let's Encrypt** - SSL/TLS Certificates
- **Arvan Cloud** - DNS & CDN Provider

---

## 🏗️ Project Structure
```
siemanage/
├── backend/                    # Node.js API Server
│   ├── config/                # Database & app configuration
│   │   └── db.js             # PostgreSQL connection
│   ├── controllers/           # Route controllers
│   │   ├── authController.js
│   │   ├── taskController.js
│   │   ├── userController.js
│   │   ├── dashboardController.js
│   │   └── notificationController.js
│   ├── middleware/            # Custom middleware
│   │   ├── auth.js           # JWT verification
│   │   └── errorHandler.js   # Error handling
│   ├── routes/                # API routes
│   │   ├── auth.js
│   │   ├── tasks.js
│   │   ├── users.js
│   │   ├── dashboard.js
│   │   └── notifications.js
│   ├── scripts/               # Utility scripts
│   │   └── seed.js           # Database seeding
│   ├── utils/                 # Helper functions
│   │   └── notifications.js  # Notification logic
│   ├── server.js              # Express server setup
│   ├── Dockerfile
│   └── package.json
│
├── frontend/                   # React Application
│   ├── src/
│   │   ├── components/        # Reusable components
│   │   │   ├── Calendar/     # Calendar components
│   │   │   ├── DatePicker/   # Bilingual date picker
│   │   │   ├── Layout/       # Layout components
│   │   │   ├── skeletons/    # Loading skeletons
│   │   │   ├── TaskModal.jsx
│   │   │   └── WorkReportModal.jsx
│   │   ├── pages/             # Page components
│   │   │   ├── Dashboard.jsx
│   │   │   ├── Tasks/
│   │   │   ├── Calendar.jsx
│   │   │   ├── Users.jsx
│   │   │   ├── Login.jsx
│   │   │   └── Notifications.jsx
│   │   ├── context/           # React Context
│   │   │   ├── AuthContext.jsx
│   │   │   └── SocketContext.jsx
│   │   ├── services/          # API services
│   │   │   └── api.js
│   │   ├── hooks/             # Custom hooks
│   │   │   ├── useModal.js
│   │   │   └── useDebounce.js
│   │   ├── locales/           # i18n translations
│   │   │   ├── en.json
│   │   │   └── fa.json
│   │   ├── utils/             # Helper functions
│   │   │   ├── dateHelper.js
│   │   │   └── toast.js
│   │   ├── i18n.js           # i18n configuration
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── public/
│   │   └── icons/            # Favicon & PWA icons
│   ├── Dockerfile
│   ├── vite.config.js
│   └── package.json
│
├── database/
│   ├── schema.sql            # Complete database schema
│   └── README.md             # Database documentation
│
├── docs/                      # Documentation
│   ├── API.md               # API documentation
│   └── DATABASE.md          # Database documentation
│
├── .env.example              # Environment variables template
├── docker-compose.yml        # Docker Compose configuration
└── README.md                 # This file
```

---

## 🚀 Quick Start

### Prerequisites
- [Docker](https://docs.docker.com/get-docker/) (v20.10+)
- [Docker Compose](https://docs.docker.com/compose/install/) (v2.0+)
- Git

### Installation
```bash
# 1. Clone the repository
git clone https://github.com/Rezaabdollahi7/task-management.git
cd task-management

# 2. Create environment file
cp .env.example .env

# 3. Start the application
docker-compose up -d

# 4. Wait for containers to be ready (30-60 seconds)

# 5. Seed the database with default admin user
docker exec -it task-management-backend node scripts/seed.js

# 6. Access the application
# Frontend: http://localhost:3000
# Backend API: http://localhost:5000
# PostgreSQL: localhost:5432
```

### Default Login Credentials
```
Username: admin
Password: admin123
```

⚠️ **IMPORTANT:** Change the default password immediately after first login!

---

## 🔐 Environment Variables

### Backend Configuration

Create `.env` file in the root directory:
```env
# Database
POSTGRES_USER=admin
POSTGRES_PASSWORD=your_secure_password
POSTGRES_DB=task_management
DATABASE_URL=postgresql://admin:your_secure_password@database:5432/task_management

# Server
NODE_ENV=production
PORT=5000

# JWT
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
JWT_EXPIRE=7d

# Frontend
FRONTEND_URL=https://siemanage.com
CORS_ORIGINS=https://siemanage.com,https://www.siemanage.com

# Logging
LOG_LEVEL=info

# Frontend Build
VITE_API_URL=https://siemanage.com/api
```

### Development vs Production

**Development (.env):**
```env
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
CORS_ORIGINS=http://localhost:3000,http://localhost:5173
VITE_API_URL=http://localhost:5000/api
LOG_LEVEL=debug
```

**Production (.env):**
```env
NODE_ENV=production
FRONTEND_URL=https://siemanage.com
CORS_ORIGINS=https://siemanage.com
VITE_API_URL=https://siemanage.com/api
LOG_LEVEL=info
```

---

## 🌐 Production Deployment

### With Docker (Recommended)
```bash
# 1. SSH to your server
ssh user@your-server.com

# 2. Clone repository
git clone https://github.com/Rezaabdollahi7/task-management.git
cd task-management

# 3. Configure environment
cp .env.example .env
nano .env  # Edit with production values

# 4. Start containers
docker-compose up -d --build

# 5. Seed database
docker exec -it task-management-backend node scripts/seed.js
```

### Nginx Configuration
```bash
# Install Nginx
sudo apt update
sudo apt install nginx

# Create Nginx config
sudo nano /etc/nginx/sites-available/siemanage.com
```

**Nginx Configuration File:**
```nginx
# HTTP → HTTPS Redirect
server {
    listen 80;
    listen [::]:80;
    server_name siemanage.com www.siemanage.com;
    return 301 https://$host$request_uri;
}

# HTTPS Server
server {
    listen 443 ssl http2;
    listen [::]:443 ssl http2;
    server_name siemanage.com www.siemanage.com;

    # SSL Configuration
    ssl_certificate /etc/letsencrypt/live/siemanage.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/siemanage.com/privkey.pem;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_prefer_server_ciphers on;

    # Frontend
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # Backend API
    location /api {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # WebSocket
    location /socket.io {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
    }
}
```

**Enable and test:**
```bash
# Enable site
sudo ln -s /etc/nginx/sites-available/siemanage.com /etc/nginx/sites-enabled/

# Test configuration
sudo nginx -t

# Reload Nginx
sudo systemctl reload nginx
```

### SSL Certificate (Let's Encrypt)
```bash
# Install Certbot
sudo apt install certbot python3-certbot-nginx

# Obtain certificate
sudo certbot --nginx -d siemanage.com -d www.siemanage.com

# Auto-renewal is configured automatically
# Test renewal
sudo certbot renew --dry-run
```

---

## 📡 API Endpoints

### Authentication
```
POST   /api/auth/login              # User login
POST   /api/auth/logout             # User logout
GET    /api/auth/me                 # Get current user info
PUT    /api/auth/change-password    # Change password
```

### Users (Manager Only)
```
GET    /api/users                   # List all users
POST   /api/users                   # Create new user
GET    /api/users/assignable        # Get assignable users
PUT    /api/users/:id               # Update user
DELETE /api/users/:id               # Delete user
PATCH  /api/users/:id/status        # Toggle user status
```

### Tasks
```
GET    /api/tasks                   # List tasks (with filters)
POST   /api/tasks                   # Create task (Manager only)
GET    /api/tasks/:id               # Get task details
PUT    /api/tasks/:id               # Update task (Manager only)
DELETE /api/tasks/:id               # Delete task (Manager only)
PATCH  /api/tasks/:id/status        # Update task status
POST   /api/tasks/:id/report        # Submit work report
PUT    /api/tasks/:id/report        # Update work report
```

### Dashboard
```
GET    /api/dashboard/stats         # Get dashboard statistics
POST   /api/dashboard/daily-report  # Generate daily work report
```

### Notifications
```
GET    /api/notifications           # List user notifications
PATCH  /api/notifications/:id/read  # Mark notification as read
DELETE /api/notifications/:id       # Delete notification
POST   /api/notifications/read-all  # Mark all as read
```

### WebSocket Events
```
connection                          # Client connects
notification:new                    # New notification
notification:approaching_deadline   # Approaching deadline
notification:overdue                # Task overdue
task:updated                        # Task status changed
```

---

## 🔒 Security

### Implemented Security Measures

- ✅ **Password Security**
  - bcrypt hashing with cost factor 10
  - Minimum password requirements enforced
  - Secure password reset flow

- ✅ **Authentication**
  - JWT token-based authentication
  - HTTP-only cookies (optional)
  - Token expiration (7 days default)
  - Refresh token mechanism

- ✅ **Authorization**
  - Role-based access control (RBAC)
  - Route-level protection
  - Manager-only endpoints validation

- ✅ **CORS Protection**
  - Configured allowed origins
  - Credentials support
  - Pre-flight request handling

- ✅ **SQL Injection Prevention**
  - Parameterized queries
  - Input sanitization
  - ORM-like query builder

- ✅ **XSS Protection**
  - Content Security Policy headers
  - Input validation
  - Output encoding

- ✅ **HTTPS/SSL**
  - Let's Encrypt certificates
  - TLS 1.2/1.3 support
  - HSTS headers

- ✅ **Rate Limiting**
  - Authentication endpoints protected
  - API request throttling
  - DDoS mitigation

- ✅ **Error Handling**
  - No sensitive data in error messages
  - Proper HTTP status codes
  - Logging without exposing secrets

### Security Best Practices
```bash
# 1. Change default credentials immediately
# 2. Use strong JWT secret (64+ characters)
# 3. Enable firewall on server
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw allow 22/tcp
sudo ufw enable

# 4. Regular updates
sudo apt update && sudo apt upgrade

# 5. Monitor logs
docker-compose logs -f backend
tail -f /var/log/nginx/access.log
```

---

## 🖼️ Screenshots

### Dashboard
![Dashboard](./docs/screenshots/dashboard.webp)
*Real-time statistics and analytics overview*

### Task List
![Task List](./docs/screenshots/tasks.webp)
*Complete task management interface*

### Calendar View
![Calendar](./docs/screenshots/calendar.webp)
*Interactive calendar with Persian/Gregorian support*

### Calendar Tasks
![Calendar](./docs/screenshots/calendar_task.webp)
*Task details and management directly from calendar view*

### Users
![Calendar](./docs/screenshots/users.webp)
*Team member management and role assignment (Manager only)*

### Create User
![Calendar](./docs/screenshots/create_user.webp)
*Add new team members with role-based access control*

### Login
![Mobile](./docs/screenshots/login.png)
*Secure JWT-based authentication with bilingual support*

### Notifications
![Mobile](./docs/screenshots/notifications.png)
*Real-time WebSocket notifications for deadlines and task updates*

---

## 🐳 Docker Commands
```bash
# Start services
docker-compose up -d

# View logs
docker-compose logs -f
docker-compose logs -f backend
docker-compose logs -f frontend

# Restart services
docker-compose restart
docker-compose restart backend

# Stop services
docker-compose stop

# Remove containers
docker-compose down

# Remove containers and volumes (⚠️ deletes data)
docker-compose down -v

# Rebuild after code changes
docker-compose up -d --build

# Execute commands in container
docker exec -it task-management-backend sh
docker exec -it task-management-db psql -U admin -d task_management

# View container status
docker-compose ps

# Check resource usage
docker stats
```

---

## 👨‍💻 Credits

**Developer:** Reza Abdollahi  
**Domain:** [siemanage.com](https://siemanage.com)  
**Email:** srezaabdollahi7@gmail.com  
**GitHub:** [@Rezaabdollahi7](https://github.com/Rezaabdollahi7)  

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🔗 Quick Links

- 🌐 [Live Demo](https://siemanage.com)
- 📚 [API Documentation](./docs/API.md)
- 🗄️ [Database Schema](./docs/DATABASE.md)
- 📋 [Changelog](./CHANGELOG.md)
- 🐛 [Report Issues](https://github.com/Rezaabdollahi7/task-management/issues)

---

<div align="center">

**Version:** 1.0.0  
**Last Updated:** November 22, 2025  
**Status:** ✅ Production Ready

Made with ❤️ for task management and team collaboration

</div>
