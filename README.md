# Employee Work Management System

## Gamani Solutions

A production-oriented **Employee Work Management System** built using **Django REST Framework, React.js, MySQL, JWT Authentication, and Render**.

The system is designed to help organizations manage employees, tasks, attendance, breaks, salary, work submissions, reviews, notifications, reports, and employee performance from a centralized platform.

---

# 1. Project Overview

The **Employee Work Management System (EWMS)** is a full-stack web application developed for **Gamani Solutions**.

The application provides separate workspaces for:

- Admin
- Employee

The Admin manages the complete organization workflow.

Employees can access their own assigned tasks, attendance, breaks, salary information, notifications, profile, and work submissions.

The system follows a role-based architecture with secure JWT authentication and REST APIs.

---

# 2. Company

## Gamani Solutions

The application is developed for:

**Gamani Solutions**

The platform can be used as an internal employee management and productivity system.

---

# 3. Main Objectives

The main objectives of the system are:

- Centralize employee management
- Manage employee accounts
- Assign and manage tasks
- Track task progress
- Manage attendance
- Track employee breaks
- Calculate working hours
- Manage salary information
- Manage performance bonuses
- Review completed employee work
- Provide feedback
- Send employee notifications
- Generate reports
- Display dashboard analytics
- Provide secure role-based access
- Provide a professional responsive UI

---

# 4. User Roles

The system has two primary roles.

## Admin

Admin has complete management access.

Admin can:

- Login
- View dashboard
- Manage employees
- Create employees
- Edit employees
- Delete employees
- Activate employees
- Deactivate employees
- Reset employee passwords
- Create tasks
- Assign tasks
- Edit tasks
- Delete tasks
- Set task priority
- Set task deadline
- View task progress
- View attendance
- View monthly attendance
- View break history
- Manage salary
- Add salary
- Update salary
- Add performance bonus
- Review employee submissions
- Approve completed work
- Reject completed work
- Send feedback
- Send notifications
- View reports
- View dashboard charts
- View employee performance

---

# 5. Employee

Employees cannot register themselves.

Only Admin can create employee accounts.

Each employee receives:

- Unique Employee ID
- Username
- Temporary Password

The employee uses those credentials to login.

Employees can:

- Login
- View dashboard
- View profile
- Edit profile
- Change password
- Clock in
- Clock out
- Start break
- End break
- View today's working hours
- View attendance history
- View break history
- View assigned tasks
- Update task status
- Upload completed work
- Submit work
- View work review
- View admin feedback
- View salary
- View notifications

---

# 6. Task Workflow

Tasks follow the following lifecycle:

```text
NOT_STARTED
      |
      v
IN_PROGRESS
      |
      v
COMPLETED
      |
      v
PENDING REVIEW
      |
      +----------------+
      |                |
      v                v
  APPROVED          REJECTED
                       |
                       v
                  RESUBMIT WORK

7. Work Submission Workflow

Admin creates task
        |
        v
Task assigned to employee
        |
        v
Employee starts task
        |
        v
Employee marks task completed
        |
        v
Employee uploads completed work
        |
        v
Admin reviews submission
        |
        +----------------+
        |                |
        v                v
    APPROVED          REJECTED
        |                |
        v                v
 Task completed      Employee receives
 permanently        feedback and resubmits


8. Attendance Workflow

Employees can manage their attendance.


Employee Login
      |
      v
Clock In
      |
      v
Working
      |
      v
Clock Out
      |
      v
Attendance Completed




0. Salary Management

Admin can manage employee salary records.

Salary information may include:

Employee
Basic Salary
Allowances
Deductions
Performance Bonus
Gross Salary
Net Salary
Salary Month
Payment Status
Payment Date


Basic Salary       ₹30,000
Allowances          ₹5,000
Performance Bonus  ₹3,000
Deductions          ₹2,000

Gross Salary       ₹38,000
Net Salary         ₹36,000


Notifications

Admin can send notifications to employees.

Notification types:

ANNOUNCEMENT
TASK
ATTENDANCE
SALARY
WORK_REVIEW
SYSTEM

Example:
Title:
Monthly Attendance Reminder

Message:
Please ensure that your attendance
is updated before the end of the month.

Type:
ATTENDANCE

Employee Dashboard

Employee dashboard should display:

Employee name
Employee ID
Today's attendance
Clock-in time
Clock-out time
Working hours

Assigned tasks
Pending tasks
Completed tasks
Recent notifications
Salary summary

-- Technology Stack
Backend
Python
Django
Django REST Framework
Simple JWT
MySQL
Django Filters
CORS Headers
Frontend
React.js
Vite
React Router
Axios
Context API

-- Architecture

                USER
                  |
                  v
          React.js Frontend
                  |
                  |
              Axios API
                  |
                  v
       Django REST Framework
                  |
          JWT Authentication
                  |
                  v
             Permissions
                  |
                  v
             ViewSets
                  |
                  v
             Serializers
                  |
                  v
              Django ORM
                  |
                  v
                MySQL

-- Project Structure


employee-work-management-system/
│
├── backend/
│   │
│   ├── manage.py
│   │
│   ├── requirements.txt
│   ├── .env
│   ├── .gitignore
│   │
│   ├── config/
│   │   ├── __init__.py
│   │   ├── settings.py
│   │   ├── urls.py
│   │   ├── wsgi.py
│   │   └── asgi.py
│   │
│   ├── accounts/
│   ├── employees/
│   ├── tasks/
│   ├── attendance/
│   ├── breaks/
│   ├── salaries/
│   ├── notifications/
│   ├── reports/
│   └── common/
│
├── frontend/
│   │
│   ├── package.json
│   ├── vite.config.js
│   ├── .env
│   ├── .gitignore
│   │
│   └── src/
│       │
│       ├── api/
│       │   └── axios.js
│       │
│       ├── components/
│       │
│       ├── context/
│       │   └── AuthContext.jsx
│       │
│       ├── layouts/
│       │
│       ├── pages/
│       │   │
│       │   ├── auth/
│       │   ├── admin/
│       │   └── employee/
│       │
│       ├── routes/
│       │
│       ├── styles/
│       │
│       ├── App.jsx
│       └── main.jsx
│
├── README.md
└── .gitignore



-- Database Design

The system should use a normalized relational MySQL database.

Main entities:

User
Employee
Task
TaskSubmission
Attendance
Salary
Notification
28. User Table

Django's User model or a custom user model should be used.

Important fields:

id
username
password
first_name
last_name
email
is_active
is_staff
date_joined

For production projects, using a custom user model from the beginning is recommended.

29. Employee Table

Example structure:

Employee
----------------------------
id
user_id FK
employee_id UNIQUE
phone
department
designation
joining_date
is_active
created_at
updated_at

Relationship:

User 1 ---- 1 Employee
30. Task Table

Example:

Task
----------------------------
id
title
description
assigned_to FK User
created_by FK User
priority
status
deadline
created_at
updated_at

Relationships:

User 1 ---- N Tasks

An Admin creates tasks.

An Employee receives tasks.

31. Task Submission Table

Example:

TaskSubmission
----------------------------
id
task_id FK
submitted_by FK User
description
file
review_status
feedback
reviewed_by FK User
submitted_at
reviewed_at

Relationship:

Task 1 ---- N TaskSubmission
32. Attendance Table

Example:

Attendance
----------------------------
id
employee_id FK
date
clock_in
clock_out
status
total_working_seconds
created_at
updated_at

Recommended constraint:

employee + date UNIQUE

This prevents duplicate attendance records for the same employee and date.

33. Break Table

Example:

Break
----------------------------
id
attendance_id FK
employee_id FK
break_start
break_end
duration_seconds
created_at
updated_at

Relationship:

Attendance 1 ---- N Break
34. Salary Table

Example:

Salary
----------------------------
id
employee_id FK
month
year
basic_salary
allowances
deductions
performance_bonus
net_salary
payment_status
payment_date
created_at
updated_at

Recommended constraint:

employee + month + year UNIQUE
35. Notification Table

Example:

Notification
----------------------------
id
recipient FK User
title
message
notification_type
is_read
created_by FK User
created_at
36. Entity Relationship Overview
                    USER
                     |
          +----------+----------+
          |                     |
          v                     v
      EMPLOYEE                TASK
          |                     |
          |                     |
          v                     v
      ATTENDANCE          TASK SUBMISSION
          |
          |
          v
         BREAK

      EMPLOYEE
          |
          v
       SALARY

      USER
       |
       v
  NOTIFICATION
37. API Architecture

All backend APIs should be RESTful.

Base API:

/api/

Example:

/api/auth/login/
/api/auth/refresh/
/api/employees/
/api/tasks/
/api/attendance/
/api/salaries/
/api/notifications/
/api/task-submissions/
/api/reports/
38. Authentication APIs
Login
POST /api/auth/login/

Request:

{
    "username": "admin",
    "password": "password"
}

Response:

{
    "access": "JWT_ACCESS_TOKEN",
    "refresh": "JWT_REFRESH_TOKEN"
}
39. Refresh Token
POST /api/auth/token/refresh/

Request:

{
    "refresh": "JWT_REFRESH_TOKEN"
}
40. Employee APIs
List Employees
GET /api/employees/
Create Employee
POST /api/employees/
Retrieve Employee
GET /api/employees/{id}/
Update Employee
PUT /api/employees/{id}/
Partial Update
PATCH /api/employees/{id}/
Delete Employee
DELETE /api/employees/{id}/
41. Task APIs
GET     /api/tasks/
POST    /api/tasks/
GET     /api/tasks/{id}/
PUT     /api/tasks/{id}/
PATCH   /api/tasks/{id}/
DELETE  /api/tasks/{id}/
42. Task Submission APIs
GET     /api/task-submissions/
POST    /api/task-submissions/
GET     /api/task-submissions/{id}/
PATCH   /api/task-submissions/{id}/

Admin can review submissions.

Example:

{
    "review_status": "APPROVED",
    "feedback": "Excellent work."
}
43. Attendance APIs

Example:

GET  /api/attendance/
POST /api/attendance/clock-in/
POST /api/attendance/clock-out/
GET  /api/attendance/today/
GET  /api/attendance/history/
GET  /api/attendance/monthly/
44. Break APIs

Example:

GET  /api/breaks/
POST /api/breaks/start/
POST /api/breaks/end/
GET  /api/breaks/history/
45. Salary APIs
GET     /api/salaries/
POST    /api/salaries/
GET     /api/salaries/{id}/
PATCH   /api/salaries/{id}/
DELETE  /api/salaries/{id}/
46. Notification APIs
GET  /api/notifications/
POST /api/notifications/
PATCH /api/notifications/{id}/

Admin creates notifications.

Employees receive notifications.

47. Report APIs

Example:

GET /api/reports/employees/
GET /api/reports/attendance/
GET /api/reports/tasks/
GET /api/reports/salary/
GET /api/reports/performance/

CSV:

GET /api/reports/attendance/export/
48. Authentication

JWT authentication should be implemented using:

djangorestframework-simplejwt

Authentication flow:

Login
  |
  v
Backend validates credentials
  |
  v
Access Token + Refresh Token
  |
  v
Frontend stores tokens
  |
  v
Axios interceptor
  |
  v
Authorization: Bearer <token>
  |
  v
Django validates JWT
49. Axios Configuration

The frontend should use a centralized Axios client.

Example:

import axios from "axios";

const apiClient = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
});

apiClient.interceptors.request.use(
    (config) => {
        const accessToken =
            localStorage.getItem("accessToken");

        if (accessToken) {
            config.headers.Authorization =
                `Bearer ${accessToken}`;
        }

        return config;
    },
    (error) => Promise.reject(error)
);

export default apiClient;
50. JWT 401 Handling

HTTP 401 means:

Unauthorized

Common causes:

Access token missing
Access token expired
Invalid JWT
User logged out
Wrong localStorage key
Backend JWT configuration mismatch

Frontend should handle expired tokens gracefully.

Recommended flow:

Request
   |
   v
401 Unauthorized
   |
   v
Try Refresh Token
   |
   +---- Success ----> Retry Request
   |
   +---- Failure ----> Logout
51. React Authentication Context

Use Context API for authentication.

Recommended:

src/
└── context/
    └── AuthContext.jsx

Responsibilities:

Login
Logout
Store access token
Store refresh token
Store user
Determine role
Protect routes
52. Protected Routes

The application should have protected routes.

Example:

/login

/admin
/admin/dashboard
/admin/employees
/admin/tasks
/admin/attendance
/admin/salaries
/admin/reports
/admin/notifications

/employee
/employee/dashboard
/employee/tasks
/employee/attendance
/employee/salary
/employee/notifications
/employee/profile

Unauthenticated users should not access protected pages.

53. Role-Based Routing

Admin:

ADMIN

can access:

/admin/*

Employee:

EMPLOYEE

can access:

/employee/*

Employees should not access Admin pages.

Admins should not use employee-only routes unless explicitly allowed.

54. Home Page

The public home page should represent:

Gamani Solutions

It should contain:

Company introduction
Employee management overview
Task management
Attendance
Salary
Performance
Secure platform
Login buttons
Footer

Main buttons:

Admin Login
Employee Login
55. Login System

The login page should allow users to authenticate.

Possible design:

----------------------------------
        GAMANI SOLUTIONS

      Employee Management

       Username
       [____________]

       Password
       [____________]

       [ Login ]

----------------------------------

After successful login:

ADMIN     -> Admin Dashboard
EMPLOYEE  -> Employee Dashboard
56. Admin Sidebar

Admin sidebar should include:

Dashboard

Employees
Tasks
Attendance
Salaries
Submissions
Notifications
Reports

Profile
Settings

Logout
57. Employee Sidebar

Employee sidebar:

Dashboard

My Tasks
Attendance
Salary
Notifications
Profile

Settings

Logout
58. UI Design

The UI should have a premium professional enterprise design.

Recommended:

White background
Dark sidebar
Clean cards
Soft shadows
Rounded corners
Professional typography
Consistent spacing
Responsive tables
Modern buttons
Status badges
Loading indicators
Error messages
Empty states
Responsive layouts
59. Responsive Design

The application must support:

Desktop
Laptop
Tablet
Mobile

Sidebar behavior:

Desktop:
Permanent sidebar

Tablet:
Collapsible sidebar

Mobile:
Mobile navigation
60. Search

Search should be available for major tables.

Examples:

Employee search
Task search
Attendance search
Salary search
Notification search

Example:

GET /api/employees/?search=ramu
61. Filtering

Use Django REST Framework filtering.

Examples:

/api/tasks/?status=COMPLETED

/api/tasks/?priority=HIGH

/api/employees/?is_active=true

/api/attendance/?month=8
62. Pagination

APIs should use pagination.

Example:

{
    "count": 100,
    "next": "...",
    "previous": null,
    "results": []
}

Frontend should support paginated results.

63. Permissions

Backend permissions must enforce authorization.

Examples:

AdminOnly
EmployeeOnly
IsOwner
IsAdminOrReadOnly

Admin can:

Create employees
Create tasks
Manage salary
Review submissions
Send notifications
View reports

Employee can:

View own tasks
Update own tasks
Submit own work
View own attendance
View own salary
View own notifications

Employees must not be able to modify another employee's records.

64. Security

The system should implement:

JWT authentication
Password hashing
Role-based authorization
Django permissions
CSRF protection where applicable
CORS configuration
Environment variables
Secure production settings
HTTPS
Secure cookies where applicable
Input validation
File upload validation
Database constraints

Never commit:

SECRET_KEY
DATABASE_PASSWORD
JWT_SECRET
API_KEYS

to Git.

65. Environment Variables

Backend .env:

DEBUG=True

SECRET_KEY=your-secret-key

DB_NAME=employee_management
DB_USER=root
DB_PASSWORD=your-password
DB_HOST=localhost
DB_PORT=3306

CORS_ALLOWED_ORIGINS=http://localhost:5173

Frontend .env:

VITE_API_BASE_URL=http://127.0.0.1:8000/api

Production values should be configured through Render environment variables.

66. Backend Installation

Navigate to backend:

cd backend

Create virtual environment:

python -m venv venv

Windows:

venv\Scripts\activate

Linux/macOS:

source venv/bin/activate

Install dependencies:

pip install django
pip install djangorestframework
pip install djangorestframework-simplejwt
pip install django-cors-headers
pip install django-filter
pip install mysqlclient
pip install python-dotenv

Create requirements:

pip freeze > requirements.txt
67. Create Django Project
django-admin startproject config .

Create applications:

python manage.py startapp accounts
python manage.py startapp employees
python manage.py startapp tasks
python manage.py startapp attendance
python manage.py startapp breaks
python manage.py startapp salaries
python manage.py startapp notifications
python manage.py startapp reports
68. Database Setup

Create MySQL database:

CREATE DATABASE employee_management;

Configure Django:

ENGINE:
django.db.backends.mysql

NAME:
employee_management

USER:
root

PASSWORD:
your_password

HOST:
localhost

PORT:
3306

Run migrations:

python manage.py makemigrations
python manage.py migrate
69. Create Admin
python manage.py createsuperuser

Enter:

Username
Email
Password

Start server:

python manage.py runserver

Backend:

http://127.0.0.1:8000/
70. Frontend Installation

Navigate to frontend:

cd frontend

Create Vite application:

npm create vite@latest . -- --template react

Install dependencies:

npm install

Install Axios:

npm install axios

Install React Router:

npm install react-router-dom

Start development server:

npm run dev

Frontend:

http://localhost:5173
71. Recommended React Structure
src/
│
├── api/
│   └── axios.js
│
├── components/
│   ├── Navbar.jsx
│   ├── Sidebar.jsx
│   ├── ProtectedRoute.jsx
│   └── Loading.jsx
│
├── context/
│   └── AuthContext.jsx
│
├── layouts/
│   ├── AdminLayout.jsx
│   └── EmployeeLayout.jsx
│
├── pages/
│   ├── Home.jsx
│   │
│   ├── auth/
│   │   └── Login.jsx
│   │
│   ├── admin/
│   │   ├── AdminDashboard.jsx
│   │   ├── AdminEmployees.jsx
│   │   ├── AdminTasks.jsx
│   │   ├── AdminAttendance.jsx
│   │   ├── AdminBreaks.jsx
│   │   ├── AdminSalaries.jsx
│   │   ├── AdminTaskSubmissions.jsx
│   │   ├── AdminNotifications.jsx
│   │   └── AdminReports.jsx
│   │
│   └── employee/
│       ├── EmployeeDashboard.jsx
│       ├── EmployeeTasks.jsx
│       ├── EmployeeAttendance.jsx
│       ├── EmployeeBreaks.jsx
│       ├── EmployeeSalary.jsx
│       ├── EmployeeNotifications.jsx
│       ├── EmployeeProfile.jsx
│       └── EmployeeSubmitWork.jsx
│
├── routes/
│   └── AppRoutes.jsx
│
├── styles/
│
├── App.jsx
└── main.jsx
72. Git Structure

Initialize Git:

git init

Add files:

git add .

Commit:

git commit -m "Initial Employee Work Management System"

Create branches:

main
develop
feature/authentication
feature/employees
feature/tasks
feature/attendance
feature/salary
feature/reports
feature/dashboard
73. Git Ignore

Never commit:

venv/
.env
__pycache__/
*.pyc
node_modules/
dist/

Recommended .gitignore:

# Python
__pycache__/
*.py[cod]
*.pyo

# Virtual Environment
venv/
env/
.venv/

# Django
*.log
db.sqlite3
media/
staticfiles/

# Environment
.env
.env.*

# Node
node_modules/
dist/

# IDE
.vscode/
.idea/

# OS
.DS_Store
Thumbs.db
74. Development Phases

The project should be developed in the following exact order.

Phase 1 - Project Setup

Tasks:

Create project folders
Create Django backend
Create React frontend
Configure Git
Configure environment variables
Install dependencies
Configure MySQL
Configure CORS
Phase 2 - Database Design

Tasks:

Design User
Design Employee
Design Task
Design TaskSubmission
Design Attendance
Design Salary
Design Notification
Create foreign keys
Create constraints
Create indexes
Create migrations
Phase 3 - Backend APIs

Tasks:

Models
Serializers
ViewSets
URLs
Permissions
Pagination
Search
Filtering
Error handling
Phase 4 - Authentication

Tasks:

JWT login
Refresh token
Logout
Role detection
Protected APIs
Admin permissions
Employee permissions
Password management
Phase 5 - React Setup

Tasks:

Vite
React Router
Axios
Context API
Protected Routes
Layouts
Navbar
Sidebar
Global styles
Phase 6 - Employee Module

Tasks:

Add employee
Edit employee
Delete employee
Activate employee
Deactivate employee
Reset password
Employee profile
Phase 7 - Task Module

Tasks:

Create task
Assign task
Edit task
Delete task
Priority
Deadline
Task status
Task submission
PDF upload
Admin review
Feedback
Approve
Reject
Phase 8 - Attendance Module

Tasks:

Clock in
Clock out
Daily attendance
Monthly attendance
Working hours
Attendance history
CSV export
75. Break Management


76. Salary Module

Tasks:

Add salary
Update salary
Performance bonus
Deductions
Net salary
Payment status
Salary history
Employee salary view
77. Reports

Tasks:

Employee performance
Attendance report
Task report
Salary report
CSV export
Search
Filtering
78. Dashboard Charts

Recommended charts:

Attendance
Task Completion
Pending Tasks
Employee Performance
Salary Overview

Possible React chart library:

Recharts

Install:

npm install recharts
79. Error Handling

Backend should return meaningful errors.

Example:

{
    "detail": "You do not have permission to perform this action."
}

Validation:

{
    "deadline": [
        "Deadline cannot be in the past."
    ]
}

Frontend should display readable messages.

80. HTTP Status Codes

Use standard HTTP status codes.

200 OK
201 Created
204 No Content
400 Bad Request
401 Unauthorized
403 Forbidden
404 Not Found
409 Conflict
500 Internal Server Error

Meaning:

401 = Authentication problem

403 = User is authenticated but
      does not have permission

404 = Resource does not exist

400 = Invalid request
81. File Upload

Completed work can support PDF uploads.

Recommended validation:

Allowed:
PDF

Maximum size:
Configured according to production requirements

Files should be stored using Django media storage.

For Render production, use persistent/external object storage when required rather than relying on ephemeral local filesystem storage.

82. Production Configuration

Before deployment:

DEBUG=False

Configure:

SECRET_KEY
Database credentials
CORS
Allowed hosts
Static files
Media files
HTTPS
Environment variables
Production database
Logging
83. Render Deployment

The project should be deployable on Render.

Recommended services:

Backend Web Service
Frontend Static Site
Database

Backend build process should install requirements.

Example:

pip install -r requirements.txt

Run migrations:

python manage.py migrate

Collect static files:

python manage.py collectstatic --noinput

Production server:

gunicorn config.wsgi:application
84. Render Backend Environment Variables

Example:

SECRET_KEY
DEBUG=False

DB_NAME
DB_USER
DB_PASSWORD
DB_HOST
DB_PORT

CORS_ALLOWED_ORIGINS

Do not hard-code credentials.

85. Render Frontend

Build:

npm install
npm run build

Output:

dist/

The frontend should use the production API URL.

Example:

VITE_API_BASE_URL=https://your-backend-domain/api
86. CORS

Development:

http://localhost:5173

Production:

https://your-frontend-domain

Only trusted origins should be allowed.

87. Production Database

The production database must not use:

SQLite

The project uses:

MySQL

The production database should be configured using environment variables.

88. API Security

All sensitive APIs must require authentication.

Example:

GET /api/salaries/

must not expose every employee's salary to employees.

The backend must filter the queryset based on the authenticated user's role.

89. Important Authorization Rule

Never depend only on frontend route protection.

This is insecure:

if user.role === "ADMIN"

on the frontend alone.

The backend must enforce permissions.

Correct:

Frontend protection
        +
Backend permissions

Both are required.

90. Employee Data Isolation

An employee must only access their own:

Tasks
Attendance
Breaks
Salary
Notifications
Submissions
Profile

For example:

Employee A
     |
     +---- Tasks belonging to Employee A

Employee B
     |
     +---- Tasks belonging to Employee B

Employee A must never receive Employee B's private records.

91. Admin Data Access

Admin can access organization-level data.

Admin can view:

All Employees
All Tasks
All Attendance
All Breaks
All Salaries
All Submissions
All Notifications
All Reports
92. Database Indexing

Indexes should be added to frequently queried fields.

Recommended indexes:

Employee.employee_id
Employee.user_id
Task.assigned_to
Task.status
Task.priority
Task.deadline
Attendance.employee
Attendance.date
Salary.employee
Salary.year
Salary.month
Notification.recipient
Notification.is_read
93. Database Constraints

Recommended constraints:

Employee.employee_id UNIQUE

Attendance.employee + date UNIQUE

Salary.employee + month + year UNIQUE

Foreign keys should use appropriate deletion behavior.

For example:

Employee -> User
Task -> User
Attendance -> Employee
Break -> Attendance
Salary -> Employee
94. Performance

Production performance should consider:

Database indexing
Query optimization
Pagination
select_related
prefetch_related
Caching where necessary
Efficient serializers
Avoiding N+1 queries
Lazy loading frontend components
95. Backend Query Optimization

Example:

Task.objects.select_related(
    "assigned_to",
    "created_by",
)

For related collections:

Employee.objects.prefetch_related(
    "attendance_set",
)

This reduces unnecessary database queries.

96. API Pagination

Never return thousands of records in one request.

Use:

page
page_size

Example:

/api/employees/?page=2&page_size=20
97. Frontend Loading States

Every API-based page should provide:

Loading
Success
Error
Empty

Example:

Loading employees...

No employees found.

Unable to load employees.

Employees loaded successfully.
98. Frontend Form Validation

Forms should validate:

Required fields
Email format
Password rules
Deadline
Salary values
File type
File size

Validation should exist on:

Frontend
+
Backend

Backend validation is authoritative.

99. Task Deadline Validation

A task deadline should not normally be allowed to be in the past when creating a new task.

Example:

Current:
10 Aug 2026

Deadline:
15 Aug 2026

Valid.

But:

Deadline:
01 Aug 2026

should be rejected for a newly created task.

100. Attendance Rules

Recommended rules:

Cannot clock out without clocking in.

Cannot clock in twice on the same day.

Cannot start a second break while
another break is active.

Cannot clock out while a break is active.
101. Salary Access Rules

Admin:

Create
Read
Update
Delete

Employee:

Read own salary

Employee must never be able to:

Change salary
Change bonus
Change deductions
Change payment status
102. Notification Rules

Admin can send:

Announcement
Task notification
Attendance notification
Salary notification
Work review notification
System notification

Employee can:

Read
Mark as read

Employee cannot create admin notifications.

103. Work Review Rules

Only Admin can review employee submissions.

Admin actions:

APPROVE
REJECT
FEEDBACK

Employee actions:

SUBMIT
RESUBMIT
VIEW FEEDBACK
104. Code Quality

Backend should follow:

PEP 8

Use:

Clear variable names
Small functions
Reusable serializers
Reusable permissions
Reusable utilities
Proper comments
Type hints where appropriate
Meaningful exceptions

Frontend should follow:

Functional components
React Hooks
Reusable components
Avoid duplicated API logic
Centralized Axios configuration
Context API for authentication
Consistent naming
105. Naming Conventions

Python:

snake_case

Example:

employee_id
assigned_to
created_at

React:

PascalCase

Example:

AdminDashboard
EmployeeTasks
EmployeeProfile

Variables:

camelCase

Example:

formData
loadingEmployees
selectedEmployee
106. API Naming

Use RESTful endpoints.

Good:

/api/employees/
/api/tasks/
/api/attendance/
/api/salaries/

Avoid:

/api/getEmployees/
/api/createTask/
/api/deleteEmployee/

HTTP method should describe the operation.

107. Testing

Backend tests should cover:

Authentication
Employee creation
Employee permissions
Task creation
Task assignment
Task status
Submission
Review
Attendance
Salary
Notifications
Reports

Frontend tests should cover:

Login
Protected routes
Employee creation
Task creation
Task update
Attendance
Submission
Notifications
108. Example Testing Workflow
Admin Login
    |
    v
Create Employee
    |
    v
Employee Login
    |
    v
Employee Clock In
    |
    v
View Task
    |
    v
Start Task
    |
    v
Complete Task
    |
    v
Upload Work
    |
    v
Admin Reviews
    |
    +------+
    |      |
    v      v
Approve  Reject
           |
           v
       Resubmit
109. Production Checklist

Before deployment:

[ ] DEBUG=False
[ ] SECRET_KEY configured
[ ] Database configured
[ ] CORS configured
[ ] ALLOWED_HOSTS configured
[ ] Static files configured
[ ] Media files configured
[ ] JWT configured
[ ] Password validation enabled
[ ] API permissions tested
[ ] Employee isolation tested
[ ] Admin permissions tested
[ ] File upload tested
[ ] Attendance tested
[ ] Break management tested
[ ] Salary access tested
[ ] Notifications tested
[ ] Reports tested
[ ] CSV export tested
[ ] React build tested
[ ] Environment variables configured
[ ] Git repository clean
[ ] Production API tested
[ ] HTTPS enabled
110. Common HTTP Errors
401 Unauthorized

Possible reasons:

Missing JWT
Expired JWT
Invalid JWT
Incorrect token storage

Check:

localStorage.getItem("accessToken")

and:

Authorization: Bearer <token>
111. 403 Forbidden

Means:

User is authenticated
but does not have permission.

Example:

Employee tries:

POST /api/employees/

Backend should return:

403 Forbidden
112. 400 Bad Request

Usually means:

Invalid form data
Missing required field
Invalid value
Validation error

Always inspect:

error.response?.data
113. 404 Not Found

Possible reasons:

Wrong API URL
Wrong task ID
Wrong employee ID
Wrong route
114. Debugging Axios

Useful debugging:

console.log(
    "URL:",
    config.baseURL + config.url
);

console.log(
    "ACCESS TOKEN:",
    accessToken
);

console.log(
    "AUTHORIZATION:",
    config.headers?.Authorization
);

Do not leave sensitive token logging enabled in production.

115. Development URLs

Frontend:

http://localhost:5173

Backend:

http://127.0.0.1:8000

API:

http://127.0.0.1:8000/api/
116. Recommended Development Order

Follow this sequence strictly:

1. Project Setup
        |
2. Database
        |
3. Backend Models
        |
4. Serializers
        |
5. ViewSets
        |
6. Permissions
        |
7. JWT Authentication
        |
8. React Setup
        |
9. Employee Module
        |
10. Task Module
        |
11. Attendance
        |
12. Break Management
        |
13. Salary
        |
14. Notifications
        |
15. Reports
        |
16. Dashboard Charts
        |
17. Testing
        |
18. Deployment
117. Final Application Flow

Complete system:

                         GAMANI SOLUTIONS
                                |
                                v
                         HOME PAGE
                         /         \
                        /           \
                       v             v
                 ADMIN LOGIN    EMPLOYEE LOGIN
                       |             |
                       v             v
                ADMIN DASHBOARD  EMPLOYEE DASHBOARD
                       |             |
          +------------+             +-------------+
          |                                          |
          v                                          v
     EMPLOYEES                                  MY TASKS
          |                                          |
          v                                          v
       TASKS                                     ATTENDANCE
          |                                          |
          v                                          v
    ATTENDANCE                                    BREAKS
          |                                          |
          v                                          v
       BREAKS                                      SALARY
          |                                          |
          v                                          v
       SALARY                                  NOTIFICATIONS
          |                                          |
          v                                          v
    SUBMISSIONS                                   PROFILE
          |
          v
      REPORTS
          |
          v
      ANALYTICS
118. Portfolio Features

This project demonstrates practical full-stack development skills.

Backend Skills
Python
Django
Django REST Framework
REST APIs
JWT Authentication
MySQL
Django ORM
Serializers
ViewSets
Permissions
Filtering
Pagination
File uploads
Database relationships
Query optimization
Frontend Skills
React
Vite
React Router
Axios
Context API
Protected Routes
Form handling
API integration
Responsive UI
Dashboard design
Charts
Tables
State management
Deployment Skills
Git
GitHub
Environment variables
Render
Production database
Static files
CORS
Gunicorn
Production configuration
119. Interview Explanation

If asked to explain the project:

Employee Work Management System is a full-stack enterprise-style application developed using Django REST Framework, React.js and MySQL. The system provides separate Admin and Employee roles using JWT authentication and role-based permissions.

Admins can manage employees, assign tasks, manage attendance, view breaks, manage salaries, review employee work, send notifications and generate reports.

Employees can manage their attendance and breaks, view assigned tasks, update task status, submit completed work, view feedback, salary and notifications.

The backend follows a REST API architecture using Django ViewSets, serializers, permissions, pagination and filtering. The React frontend uses Axios for API communication, Context API for authentication and protected routes for role-based navigation.

The application is designed with a normalized MySQL database and can be deployed using Render.

120. Future Enhancements

Possible future features:

Email notifications
SMS notifications
Real-time notifications
WebSocket support
Employee chat
Team management
Department management
Leave management
Holiday calendar
Payroll automation
Performance appraisal
Advanced analytics
Audit logs
Activity tracking
Two-factor authentication
Cloud file storage
Automated report generation
PDF reports
Mobile application
PWA support
121. Final Architecture
                    FRONTEND
                React + Vite
                       |
                React Router
                       |
                  Context API
                       |
                    Axios
                       |
                       v
                REST API LAYER
                       |
                       v
             Django REST Framework
                       |
          +------------+-------------+
          |            |             |
          v            v             v
      ViewSets    Permissions    Serializers
          |            |             |
          +------------+-------------+
                       |
                       v
                  Django ORM
                       |
                       v
                     MySQL
122. Project Status

Current system modules:

[x] Home Page
[x] Admin Login
[x] Employee Login
[x] JWT Authentication
[x] Employee Management
[x] Task Management
[x] Task Submission
[x] Work Review
[x] Feedback
[x] Notifications
[x] Attendance
[x] Break Management
[x] Salary Management
[x] Employee Dashboard
[x] Admin Dashboard
[x] Protected Routes
[x] Axios API Client
[x] Role-Based Access
[x] Responsive UI
[ ] Advanced Reports
[ ] Dashboard Charts
[ ] Production Deployment
123. Final Goal

The final application should be:

Secure
Scalable
Responsive
Maintainable
Production-ready
Portfolio-ready
Interview-ready
Deployable

The architecture should allow additional modules to be added without rewriting the existing system.

124. License

This project is developed for:

Gamani Solutions

Copyright © 2026 Gamani Solutions.

All rights reserved.

125. Author

N GaminiPrasad

Built using:

Python
Django
Django REST Framework
React.js
Vite
MySQL
JWT
Axios
Context API
Render
126. Quick Start

Backend:

cd backend

python -m venv venv

venv\Scripts\activate

pip install -r requirements.txt

python manage.py migrate

python manage.py createsuperuser

python manage.py runserver

Frontend:

cd frontend

npm install

npm run dev

Open:

Frontend:
http://localhost:5173

Backend:
http://127.0.0.1:8000
127. End-to-End Summary
Admin creates employee
        |
        v
Employee receives credentials
        |
        v
Employee logs in
        |
        v
Employee clocks in
        |
        v
Employee starts/ends breaks
        |
        v
Admin assigns task
        |
        v
Employee starts task
        |
        v
Employee completes task
        |
        v
Employee uploads work
        |
        v
Admin reviews work
        |
        +------------------+
        |                  |
        v                  v
    APPROVED            REJECTED
        |                  |
        v                  v
   Task closed       Employee resubmits
        |
        v
Performance recorded
        |
        v
Salary/bonus managed
        |
        v
Reports generated
        |
        v
Dashboard analytics
128. Conclusion

The Gamani Solutions Employee Work Management System is designed as a complete full-stack employee management platform.

