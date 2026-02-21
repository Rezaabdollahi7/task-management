<div align="center" dir="rtl">

# 🚀 سی‌منج (SieManage)

### سیستم حرفه‌ای مدیریت وظایف و همکاری تیمی

[![React](https://img.shields.io/badge/React-18.2-blue)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-20-green)](https://nodejs.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-14-blue)](https://www.postgresql.org/)
[![License](https://img.shields.io/badge/License-MIT-yellow)](./LICENSE)

[🌐 دموی زنده](https://siemanage.com) | [📚 مستندات API](./docs/API.md) | [🗄️ ساختار دیتابیس](./docs/DATABASE.md) | [📋 تاریخچه تغییرات](./CHANGELOG.md)

[English](./README.md) | [فارسی](./README.fa.md)

</div>

---

## 📋 درباره پروژه

**سی‌منج (SieManage)** یک سیستم جامع مدیریت وظایف است که برای بهبود همکاری تیمی و افزایش بهره‌وری طراحی شده است. این سیستم به مدیران کمک می‌کند تا وظایف را به صورت کارآمد تخصیص دهند، پیشرفت کار را پیگیری کنند و بار کاری تیم را مدیریت کنند، در حالی که کارمندان نمای واضحی از مسئولیت‌های روزانه خود دارند.

**ویژگی‌های کلیدی:**
- مدیریت وظایف و تخصیص به اعضای تیم
- همکاری تیمی و هماهنگی بهتر
- پیگیری پیشرفت در زمان واقعی
- پشتیبانی کامل دوزبانه (فارسی/انگلیسی)

**آدرس برنامه:** [https://siemanage.com](https://siemanage.com)

---

## ✨ امکانات

### 🔐 احراز هویت و مجوزدهی
- احراز هویت امن مبتنی بر JWT
- کنترل دسترسی بر اساس نقش (مدیر/کارمند)
- مدیریت نشست کاربری
- رمزنگاری رمز عبور با bcrypt

### 📊 داشبورد و تحلیل‌ها
- آمار و شاخص‌های کلیدی در زمان واقعی
- نرخ تکمیل وظایف
- توزیع وظایف بر اساس اولویت
- نمودارهای عملکرد هفتگی
- نمای کلی بار کاری کارمندان

### ✅ مدیریت وظایف
- عملیات کامل CRUD
- تخصیص وظایف به کارمندان
- سطوح اولویت (فوری، بالا، متوسط، پایین)
- پیگیری وضعیت (باز، در حال انجام، تکمیل شده، لغو شده)
- مدیریت مهلت انجام
- اطلاعات دستگاه (مدل، شماره سریال)
- ثبت گزارش کار

### 📅 نمای تقویمی
- تقویم تعاملی وظایف
- پشتیبانی از تقویم شمسی و میلادی
- نشانگرهای بصری بر اساس اولویت
- فیلتر و ناوبری تاریخ
- ایجاد سریع وظیفه از تقویم

### 👥 مدیریت کاربران (ویژه مدیران)
- افزودن/ویرایش/حذف کاربران
- تعیین نقش کاربری
- مدیریت وضعیت کاربران
- نمای کلی تیم

### 🔔 اعلان‌های لحظه‌ای
- اعلان‌های مبتنی بر WebSocket
- هشدار نزدیک شدن به مهلت
- اخطار وظایف عقب‌افتاده
- اطلاع‌رسانی تخصیص وظیفه جدید
- به‌روزرسانی تغییر وضعیت

### 📝 گزارش‌های کار روزانه
- ثبت گزارش کار تفصیلی
- مستندسازی تکمیل وظایف
- مشاهده گزارش‌ها توسط مدیران
- سوابق کاری تاریخی

### 🌐 رابط کاربری دوزبانه
- پشتیبانی کامل از زبان فارسی (RTL)
- پشتیبانی از زبان انگلیسی (LTR)
- تغییر یکپارچه زبان
- فرمت‌های تاریخ محلی‌سازی شده

### 📱 طراحی واکنش‌گرا
- رابط بهینه‌سازی شده برای موبایل
- چیدمان مناسب تبلت
- تجربه کامل دسکتاپ
- کنترل‌های لمسی دوستانه

---

## ⚙️ فناوری‌های استفاده شده

### بک‌اند
- **Node.js (v20.x)** - محیط اجرای جاوااسکریپت
- **Express.js (v4.18)** - فریم‌ورک وب
- **PostgreSQL (v14)** - پایگاه داده رابطه‌ای
- **Socket.io (v4.6)** - ارتباط WebSocket در زمان واقعی
- **JWT (jsonwebtoken)** - احراز هویت و مجوزدهی
- **bcrypt** - رمزنگاری رمز عبور
- **node-cron** - وظایف زمان‌بندی شده برای اعلان‌ها
- **pg (node-postgres)** - کلاینت PostgreSQL

### فرانت‌اند
- **React (v18.2)** - کتابخانه رابط کاربری
- **Vite (v5.4)** - ابزار ساخت و سرور توسعه
- **React Router (v6)** - مسیریابی سمت کلاینت
- **TailwindCSS (v3.4)** - فریم‌ورک CSS
- **Axios** - کلاینت HTTP
- **Socket.io Client** - ارتباط در زمان واقعی
- **i18next** - بین‌المللی‌سازی (i18n)
- **react-i18next** - یکپارچگی React برای i18n
- **moment-jalaali** - پشتیبانی از تقویم شمسی
- **react-big-calendar** - کامپوننت تقویم
- **react-modern-calendar-datepicker** - انتخابگر تاریخ دوزبانه
- **react-hot-toast** - اعلان‌های Toast
- **Recharts** - نمودارهای بصری‌سازی داده
- **React Icons** - کتابخانه آیکون

### DevOps و زیرساخت
- **Docker (v20.10+)** - کانتینرسازی
- **Docker Compose (v2.0+)** - هماهنگی چند کانتینر
- **Nginx (v1.24)** - پروکسی معکوس و متعادل‌کننده بار
- **Let's Encrypt** - گواهینامه‌های SSL/TLS
- **Arvan Cloud** - ارائه‌دهنده DNS و CDN

---

## 🏗️ ساختار پروژه
```
siemanage/
├── backend/                    # سرور API با Node.js
│   ├── config/                # پیکربندی دیتابیس و برنامه
│   │   └── db.js             # اتصال PostgreSQL
│   ├── controllers/           # کنترلرهای مسیر
│   │   ├── authController.js
│   │   ├── taskController.js
│   │   ├── userController.js
│   │   ├── dashboardController.js
│   │   └── notificationController.js
│   ├── middleware/            # میدل‌ویرهای سفارشی
│   │   ├── auth.js           # تأیید JWT
│   │   └── errorHandler.js   # مدیریت خطا
│   ├── routes/                # مسیرهای API
│   │   ├── auth.js
│   │   ├── tasks.js
│   │   ├── users.js
│   │   ├── dashboard.js
│   │   └── notifications.js
│   ├── scripts/               # اسکریپت‌های ابزاری
│   │   └── seed.js           # Seed کردن دیتابیس
│   ├── utils/                 # توابع کمکی
│   │   └── notifications.js  # منطق اعلان‌ها
│   ├── server.js              # راه‌اندازی سرور Express
│   ├── Dockerfile
│   └── package.json
│
├── frontend/                   # برنامه React
│   ├── src/
│   │   ├── components/        # کامپوننت‌های قابل استفاده مجدد
│   │   │   ├── Calendar/     # کامپوننت‌های تقویم
│   │   │   ├── DatePicker/   # انتخابگر تاریخ دوزبانه
│   │   │   ├── Layout/       # کامپوننت‌های چیدمان
│   │   │   ├── skeletons/    # اسکلتون‌های بارگذاری
│   │   │   ├── TaskModal.jsx
│   │   │   └── WorkReportModal.jsx
│   │   ├── pages/             # کامپوننت‌های صفحه
│   │   │   ├── Dashboard.jsx
│   │   │   ├── Tasks/
│   │   │   ├── Calendar.jsx
│   │   │   ├── Users.jsx
│   │   │   ├── Login.jsx
│   │   │   └── Notifications.jsx
│   │   ├── context/           # React Context
│   │   │   ├── AuthContext.jsx
│   │   │   └── SocketContext.jsx
│   │   ├── services/          # سرویس‌های API
│   │   │   └── api.js
│   │   ├── hooks/             # هوک‌های سفارشی
│   │   │   ├── useModal.js
│   │   │   └── useDebounce.js
│   │   ├── locales/           # ترجمه‌های i18n
│   │   │   ├── en.json
│   │   │   └── fa.json
│   │   ├── utils/             # توابع کمکی
│   │   │   ├── dateHelper.js
│   │   │   └── toast.js
│   │   ├── i18n.js           # پیکربندی i18n
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── public/
│   │   └── icons/            # Favicon و آیکون‌های PWA
│   ├── Dockerfile
│   ├── vite.config.js
│   └── package.json
│
├── database/
│   ├── schema.sql            # اسکیمای کامل دیتابیس
│   └── README.md             # مستندات دیتابیس
│
├── docs/                      # مستندات
│   ├── API.md               # مستندات API
│   └── DATABASE.md          # مستندات دیتابیس
│
├── .env.example              # الگوی متغیرهای محیطی
├── docker-compose.yml        # پیکربندی Docker Compose
└── README.md                 # این فایل
```

---

## 🚀 شروع سریع

### پیش‌نیازها
- [Docker](https://docs.docker.com/get-docker/) (نسخه 20.10 به بالا)
- [Docker Compose](https://docs.docker.com/compose/install/) (نسخه 2.0 به بالا)
- Git

### نصب
```bash
# 1. کلون کردن مخزن
git clone https://github.com/Rezaabdollahi7/task-management.git
cd task-management

# 2. ایجاد فایل محیطی
cp .env.example .env

# 3. راه‌اندازی برنامه
docker-compose up -d

# 4. صبر کنید تا کانتینرها آماده شوند (30-60 ثانیه)

# 5. Seed کردن دیتابیس با کاربر مدیر پیش‌فرض
docker exec -it task-management-backend node scripts/seed.js

# 6. دسترسی به برنامه
# فرانت‌اند: http://localhost:3000
# بک‌اند API: http://localhost:5000
# PostgreSQL: localhost:5432
```

### اطلاعات ورود پیش‌فرض
```
نام کاربری: admin
رمز عبور: admin123
```

⚠️ **مهم:** بلافاصله پس از اولین ورود، رمز عبور پیش‌فرض را تغییر دهید!

---

## 🔐 متغیرهای محیطی

### پیکربندی بک‌اند

فایل `.env` را در دایرکتوری اصلی ایجاد کنید:
```env
# دیتابیس
POSTGRES_USER=admin
POSTGRES_PASSWORD=your_secure_password
POSTGRES_DB=task_management
DATABASE_URL=postgresql://admin:your_secure_password@database:5432/task_management

# سرور
NODE_ENV=production
PORT=5000

# JWT
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
JWT_EXPIRE=7d

# فرانت‌اند
FRONTEND_URL=https://siemanage.com
CORS_ORIGINS=https://siemanage.com,https://www.siemanage.com

# لاگ‌گیری
LOG_LEVEL=info

# ساخت فرانت‌اند
VITE_API_URL=https://siemanage.com/api
```

### توسعه در مقابل تولید

**محیط توسعه (.env):**
```env
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
CORS_ORIGINS=http://localhost:3000,http://localhost:5173
VITE_API_URL=http://localhost:5000/api
LOG_LEVEL=debug
```

**محیط تولید (.env):**
```env
NODE_ENV=production
FRONTEND_URL=https://siemanage.com
CORS_ORIGINS=https://siemanage.com
VITE_API_URL=https://siemanage.com/api
LOG_LEVEL=info
```

---

## 🌐 استقرار تولید

### با Docker (توصیه می‌شود)
```bash
# 1. SSH به سرور خود
ssh user@your-server.com

# 2. کلون کردن مخزن
git clone https://github.com/Rezaabdollahi7/task-management.git
cd task-management

# 3. پیکربندی محیط
cp .env.example .env
nano .env  # ویرایش با مقادیر تولید

# 4. راه‌اندازی کانتینرها
docker-compose up -d --build

# 5. Seed کردن دیتابیس
docker exec -it task-management-backend node scripts/seed.js
```

### پیکربندی Nginx
```bash
# نصب Nginx
sudo apt update
sudo apt install nginx

# ایجاد پیکربندی Nginx
sudo nano /etc/nginx/sites-available/siemanage.com
```

**فایل پیکربندی Nginx:**
```nginx
# هدایت HTTP به HTTPS
server {
    listen 80;
    listen [::]:80;
    server_name siemanage.com www.siemanage.com;
    return 301 https://$host$request_uri;
}

# سرور HTTPS
server {
    listen 443 ssl http2;
    listen [::]:443 ssl http2;
    server_name siemanage.com www.siemanage.com;

    # پیکربندی SSL
    ssl_certificate /etc/letsencrypt/live/siemanage.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/siemanage.com/privkey.pem;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_prefer_server_ciphers on;

    # فرانت‌اند
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

    # بک‌اند API
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

**فعال‌سازی و تست:**
```bash
# فعال کردن سایت
sudo ln -s /etc/nginx/sites-available/siemanage.com /etc/nginx/sites-enabled/

# تست پیکربندی
sudo nginx -t

# بارگذاری مجدد Nginx
sudo systemctl reload nginx
```

### گواهینامه SSL (Let's Encrypt)
```bash
# نصب Certbot
sudo apt install certbot python3-certbot-nginx

# دریافت گواهینامه
sudo certbot --nginx -d siemanage.com -d www.siemanage.com

# تمدید خودکار به صورت خودکار پیکربندی شده است
# تست تمدید
sudo certbot renew --dry-run
```

---

## 📡 نقاط پایانی API

### احراز هویت
```
POST   /api/auth/login              # ورود کاربر
POST   /api/auth/logout             # خروج کاربر
GET    /api/auth/me                 # دریافت اطلاعات کاربر فعلی
PUT    /api/auth/change-password    # تغییر رمز عبور
```

### کاربران (فقط مدیران)
```
GET    /api/users                   # لیست تمام کاربران
POST   /api/users                   # ایجاد کاربر جدید
GET    /api/users/assignable        # دریافت کاربران قابل تخصیص
PUT    /api/users/:id               # به‌روزرسانی کاربر
DELETE /api/users/:id               # حذف کاربر
PATCH  /api/users/:id/status        # تغییر وضعیت کاربر
```

### وظایف
```
GET    /api/tasks                   # لیست وظایف (با فیلترها)
POST   /api/tasks                   # ایجاد وظیفه (فقط مدیر)
GET    /api/tasks/:id               # دریافت جزئیات وظیفه
PUT    /api/tasks/:id               # به‌روزرسانی وظیفه (فقط مدیر)
DELETE /api/tasks/:id               # حذف وظیفه (فقط مدیر)
PATCH  /api/tasks/:id/status        # به‌روزرسانی وضعیت وظیفه
POST   /api/tasks/:id/report        # ثبت گزارش کار
PUT    /api/tasks/:id/report        # به‌روزرسانی گزارش کار
```

### داشبورد
```
GET    /api/dashboard/stats         # دریافت آمار داشبورد
POST   /api/dashboard/daily-report  # تولید گزارش کار روزانه
```

### اعلان‌ها
```
GET    /api/notifications           # لیست اعلان‌های کاربر
PATCH  /api/notifications/:id/read  # علامت‌گذاری به عنوان خوانده شده
DELETE /api/notifications/:id       # حذف اعلان
POST   /api/notifications/read-all  # علامت‌گذاری همه به عنوان خوانده شده
```

### رویدادهای WebSocket
```
connection                          # اتصال کلاینت
notification:new                    # اعلان جدید
notification:approaching_deadline   # نزدیک شدن به مهلت
notification:overdue                # وظیفه عقب‌افتاده
task:updated                        # تغییر وضعیت وظیفه
```

---

## 🔒 امنیت

### اقدامات امنیتی پیاده‌سازی شده

- ✅ **امنیت رمز عبور**
  - هش‌کردن با bcrypt با ضریب هزینه 10
  - الزامات حداقل رمز عبور
  - فرآیند امن بازیابی رمز عبور

- ✅ **احراز هویت**
  - احراز هویت مبتنی بر توکن JWT
  - کوکی‌های HTTP-only (اختیاری)
  - انقضای توکن (پیش‌فرض 7 روز)
  - مکانیزم توکن تازه‌سازی

- ✅ **مجوزدهی**
  - کنترل دسترسی مبتنی بر نقش (RBAC)
  - حفاظت سطح مسیر
  - اعتبارسنجی نقاط پایانی ویژه مدیر

- ✅ **حفاظت CORS**
  - منابع مجاز پیکربندی شده
  - پشتیبانی از اعتبارنامه‌ها
  - مدیریت درخواست‌های Preflight

- ✅ **جلوگیری از SQL Injection**
  - کوئری‌های پارامتری شده
  - پاک‌سازی ورودی
  - سازنده کوئری شبه ORM

- ✅ **حفاظت XSS**
  - هدرهای سیاست امنیت محتوا
  - اعتبارسنجی ورودی
  - کدگذاری خروجی

- ✅ **HTTPS/SSL**
  - گواهینامه‌های Let's Encrypt
  - پشتیبانی از TLS 1.2/1.3
  - هدرهای HSTS

- ✅ **محدودیت نرخ درخواست**
  - حفاظت نقاط پایانی احراز هویت
  - محدودسازی درخواست‌های API
  - کاهش DDoS

- ✅ **مدیریت خطا**
  - عدم افشای داده‌های حساس در پیام‌های خطا
  - کدهای وضعیت HTTP مناسب
  - لاگ‌گیری بدون افشای رمزها

### بهترین شیوه‌های امنیتی
```bash
# 1. فوراً اعتبارنامه‌های پیش‌فرض را تغییر دهید
# 2. از کلید JWT قوی استفاده کنید (64+ کاراکتر)
# 3. فایروال را روی سرور فعال کنید
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw allow 22/tcp
sudo ufw enable

# 4. به‌روزرسانی‌های منظم
sudo apt update && sudo apt upgrade

# 5. نظارت بر لاگ‌ها
docker-compose logs -f backend
tail -f /var/log/nginx/access.log
```

---

## 🖼️ تصاویر


### Dashboard
![Dashboard](./docs/screenshots/dashboard.webp)
*نمای کلی آمار، شاخص‌های کلیدی عملکرد (KPI) و تحلیل‌ها در زمان واقعی*

### Task List
![Task List](./docs/screenshots/tasks.webp)
*رابط کامل مدیریت وظایف با فیلترها و پیگیری وضعیت*

### Calendar View
![Calendar](./docs/screenshots/calendar.webp)
*تقویم تعاملی با پشتیبانی از تقویم شمسی (جلالی) و میلادی*

### Calendar Tasks
![Calendar](./docs/screenshots/calendar_task.webp)
*مشاهده و مدیریت جزئیات وظایف مستقیماً از نمای تقویم*

### Users
![Calendar](./docs/screenshots/users.webp)
*مدیریت اعضای تیم و تخصیص نقش‌ها (مخصوص مدیر)*

### Create User
![Calendar](./docs/screenshots/create_user.webp)
*افزودن اعضای جدید به تیم با کنترل دسترسی مبتنی بر نقش*

### Login
![Mobile](./docs/screenshots/login.png)
*احراز هویت امن مبتنی بر JWT با پشتیبانی دوزبانه*

### Notifications
![Mobile](./docs/screenshots/notifications.png)
*اعلان‌های بلادرنگ WebSocket برای سررسیدها و به‌روزرسانی وظایف*
## 🐳 دستورات Docker
```bash
# راه‌اندازی سرویس‌ها
docker-compose up -d

# مشاهده لاگ‌ها
docker-compose logs -f
docker-compose logs -f backend
docker-compose logs -f frontend

# راه‌اندازی مجدد سرویس‌ها
docker-compose restart
docker-compose restart backend

# متوقف کردن سرویس‌ها
docker-compose stop

# حذف کانتینرها
docker-compose down

# حذف کانتینرها و volumeها (⚠️ داده‌ها را حذف می‌کند)
docker-compose down -v

# بازساخت پس از تغییرات کد
docker-compose up -d --build

# اجرای دستورات در کانتینر
docker exec -it task-management-backend sh
docker exec -it task-management-db psql -U admin -d task_management

# مشاهده وضعیت کانتینرها
docker-compose ps

# بررسی استفاده از منابع
docker stats
```

---

## 👨‍💻 اعتبارات

**توسعه‌دهنده:** رضا عبداللهی  
**دامنه:** [siemanage.com](https://siemanage.com)  
**ایمیل:** srezaabdollahi7@gmail.com  
**گیت‌هاب:** [@Rezaabdollahi7](https://github.com/Rezaabdollahi7)  

---

## 📄 مجوز

این پروژه تحت مجوز MIT منتشر شده است - برای جزئیات به فایل [LICENSE](LICENSE) مراجعه کنید.

---

## 🔗 لینک‌های سریع

- 🌐 [دموی زنده](https://siemanage.com)
- 📚 [مستندات API](./docs/API.md)
- 🗄️ [ساختار دیتابیس](./docs/DATABASE.md)
- 📋 [تاریخچه تغییرات](./CHANGELOG.md)
- 🐛 [گزارش مشکلات](https://github.com/Rezaabdollahi7/task-management/issues)

---

<div align="center">

**نسخه:** 1.0.0  
**آخرین به‌روزرسانی:** 22 نوامبر 2025  
**وضعیت:** ✅ آماده برای تولید

ساخته شده با ❤️ برای مدیریت وظایف و همکاری تیمی

</div>
