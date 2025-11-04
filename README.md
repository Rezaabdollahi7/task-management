# 🚀 Zero Task (Task Management) System

A comprehensive task management system for electronic equipment repair and maintenance workshop.

## 📋 About

This system helps managers and employees in repair workshops to manage, assign, and track repair tasks efficiently. Built specifically for managing Siemens board repairs and other electronic equipment maintenance.

## ⚙️ Tech Stack

### Backend
- **Node.js** - JavaScript Runtime
- **Express.js** - Web Framework
- **PostgreSQL** - Relational Database
- **JWT** - Authentication & Authorization
- **bcrypt** - Password Hashing

### Frontend
- **React** - UI Library
- **Vite** - Build Tool & Dev Server
- **TailwindCSS / Material-UI** - UI Framework
- **Axios** - HTTP Client
- **React Router** - Client-side Routing

### DevOps
- **Docker** - Containerization
- **Docker Compose** - Multi-container Orchestration

## 🏗️ Project Structure

```
task-management/
├── backend/              # Node.js API Server
│   ├── config/          # Database & app configuration
│   ├── controllers/     # Route controllers
│   ├── middleware/      # Custom middleware (auth, etc.)
│   ├── models/          # Database models
│   ├── routes/          # API routes
│   ├── utils/           # Helper functions
│   ├── Dockerfile
│   └── package.json
│
├── frontend/            # React Application
│   ├── src/
│   │   ├── components/ # Reusable components
│   │   ├── pages/      # Page components
│   │   ├── context/    # React Context (Auth, etc.)
│   │   ├── services/   # API services
│   │   └── utils/      # Helper functions
│   ├── public/
│   ├── Dockerfile
│   └── package.json
│
├── database/
│   ├── schema.sql      # Database schema
│   └── README.md       # Database documentation
│
├── docker-compose.yml       # Development environment
├── docker-compose.prod.yml  # Production environment
├── .gitignore
├── .env.example
└── README.md
```

## 🚀 Quick Start with Docker (Recommended)

### Prerequisites
- [Docker](https://docs.docker.com/get-docker/) (v20.10+)
- [Docker Compose](https://docs.docker.com/compose/install/) (v2.0+)
- Git

### Installation Steps

```bash
# 1. Clone the repository
git clone https://github.com/yourusername/task-management.git
cd task-management

# 2. Start the application
docker-compose up

# 3. Access the application
# Frontend: http://localhost:3000
# Backend API: http://localhost:5000
# PostgreSQL: localhost:5432
```

### Useful Docker Commands

```bash
# Run in detached mode (background)
docker-compose up -d

# View logs
docker-compose logs -f

# Stop all containers
docker-compose down

# Rebuild after changes
docker-compose up --build

# Complete cleanup (WARNING: Deletes database data!)
docker-compose down -v

# Access PostgreSQL shell
docker-compose exec database psql -U admin -d task_management
```

## 💻 Local Development (Without Docker)

### Backend Setup

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Create .env file from example
cp .env.example .env

# Update .env with your local PostgreSQL credentials

# Start development server
npm run dev

# Server runs on http://localhost:5000
```

### Frontend Setup

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Start development server
npm run dev

# App runs on http://localhost:3000
```

### Database Setup

```bash
# Install PostgreSQL (if not already installed)
# Ubuntu/Debian
sudo apt install postgresql postgresql-contrib

# macOS
brew install postgresql

# Create database
createdb task_management

# Run schema
psql -d task_management -f database/schema.sql
```

## 🔐 Environment Variables

### Backend (.env)

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database
DATABASE_URL=postgresql://admin:admin123@localhost:5432/task_management

# JWT
JWT_SECRET=your_super_secret_jwt_key_here
JWT_EXPIRE=7d

# CORS
FRONTEND_URL=http://localhost:3000
```

### Frontend (.env)

```env
# API Configuration
VITE_API_URL=http://localhost:5000/api
```

## 👤 Default User

After running the database schema, a default admin user is created:

- **Username:** `admin`
- **Password:** `admin123`

⚠️ **IMPORTANT:** Change this password immediately after first login!

## 📚 API Documentation

Complete API documentation is available in [API_DOCS.md](./API_DOCS.md)

### Key Endpoints

```
POST   /api/auth/login           # User login
GET    /api/auth/me              # Get current user
GET    /api/users                # List all users (Manager only)
POST   /api/users                # Create user (Manager only)
GET    /api/tasks                # List tasks
POST   /api/tasks                # Create task (Manager only)
PATCH  /api/tasks/:id/status     # Update task status
GET    /api/dashboard/stats      # Dashboard statistics
```

## 🗄️ Database Schema

Database documentation is available in [database/DATABASE_README.md](./database/DATABASE_README.md)

### Main Tables
- **users** - User accounts (managers & employees)
- **tasks** - Task information
- **notifications** - Real-time notifications

## 🧪 Testing

```bash
# Backend tests
cd backend
npm test

# Frontend tests
cd frontend
npm test

# Run with coverage
npm run test:coverage
```

## 📦 Deployment

### Production with Docker

```bash
# Build production images
docker-compose -f docker-compose.prod.yml build

# Start production containers
docker-compose -f docker-compose.prod.yml up -d

# View production logs
docker-compose -f docker-compose.prod.yml logs -f
```

### Manual Production Deployment

1. Set up PostgreSQL database
2. Configure environment variables
3. Build frontend: `npm run build`
4. Deploy backend with PM2 or similar
5. Configure reverse proxy (Nginx/Apache)
6. Set up SSL certificate (Let's Encrypt)

## 🔒 Security Notes

- All passwords are hashed using bcrypt (cost factor: 10)
- JWT tokens for authentication
- CORS configured for allowed origins
- SQL injection prevention with parameterized queries
- Input validation on all endpoints
- Rate limiting on authentication endpoints

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### Coding Standards

- Use ESLint configuration provided
- Follow conventional commit messages
- Write tests for new features
- Update documentation as needed

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🐛 Known Issues

- None at the moment

## 📞 Support

For questions and support:
- Create an issue in the repository
- Contact the development team

## 🗺️ Roadmap

### Phase 1 (Current)
- [x] User authentication
- [x] Task CRUD operations
- [x] Dashboard for managers
- [ ] Real-time notifications
- [ ] Docker setup

### Phase 2 (Planned)
- [ ] Image upload for devices
- [ ] Task history and analytics
- [ ] Advanced reporting
- [ ] Mobile responsive improvements

### Phase 3 (Future)
- [ ] Mobile application
- [ ] Customer management
- [ ] Inventory tracking
- [ ] SMS notifications

## 👥 Team

- **Project Lead** - Initial work

## 🙏 Acknowledgments

- Inspired by modern task management systems
- Built for electronic repair workshops
- Special focus on Siemens equipment maintenance

---

**Version:** 1.0.0  
**Last Updated:** January 27, 2025  
**Status:** Active Development

---

Made with ❤️ for repair workshop management