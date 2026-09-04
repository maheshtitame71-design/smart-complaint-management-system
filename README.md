# Smart Complaint Management System

A full-stack web-based complaint management platform designed for colleges to streamline complaint registration, assignment, tracking, and resolution.

The system provides separate workflows for **Users, Staff, and Administrators**, with role-based access control and notification management.

---

## 📌 Features

### 👨‍🎓 User

* User registration and login
* JWT-based authentication
* Create complaints
* View personal complaints
* View complaint status
* Delete complaints while they are pending
* View personal profile
* Receive complaint status notifications
* Mark notifications as read
* Mark all notifications as read
* Clear read notifications
* Change password
* User settings

### 👨‍💼 Staff

* Staff login
* Staff dashboard
* View assigned complaints
* Start working on assigned complaints
* Mark complaints as resolved
* View personal profile
* Receive/manage notifications
* Change password
* Staff settings

### 👨‍💻 Administrator

* Admin login
* Admin dashboard
* View complaint statistics
* View all complaints
* View complaint details
* Assign complaints to staff
* Manage users
* Delete users
* Receive notifications when staff updates complaint status
* Admin notifications management
* Admin settings
* Change password

---

## 🔄 Complaint Workflow

The complaint follows a controlled status workflow:

```text
Pending
   ↓
Assigned
   ↓
In Progress
   ↓
Resolved
```

### Status Rules

* **Pending** → Complaint submitted by the user
* **Assigned** → Admin assigns the complaint to a staff member
* **In Progress** → Staff starts working on the complaint
* **Resolved** → Staff completes the complaint

This prevents unauthorized or invalid status transitions.

---

## 🔔 Notification System

The system includes a notification mechanism for important complaint updates.

### User Notifications

Users are notified when:

* Their complaint is moved to **In Progress**
* Their complaint is **Resolved**

### Admin Notifications

Administrators are notified when:

* Staff starts working on a complaint
* Staff resolves a complaint

Users and administrators can mark notifications as read and clear notifications that have already been read.

---

## 🛠️ Tech Stack

### Frontend

* React.js
* JavaScript
* Tailwind CSS
* Vite
* Axios
* React Router

### Backend

* Node.js
* Express.js
* JavaScript

### Database

* MongoDB
* MongoDB Atlas
* Mongoose

### Authentication & Security

* JWT (JSON Web Token)
* bcrypt
* Role-Based Access Control

---

## 🏗️ System Architecture

```text
                    ┌──────────────────────┐
                    │      React.js        │
                    │      Frontend        │
                    └──────────┬───────────┘
                               │
                             Axios
                               │
                               ▼
                    ┌──────────────────────┐
                    │     Express.js       │
                    │       REST API       │
                    └──────────┬───────────┘
                               │
                     JWT Authentication
                               │
                               ▼
                    ┌──────────────────────┐
                    │      MongoDB         │
                    │    MongoDB Atlas     │
                    └──────────────────────┘
```

---

## 👥 User Roles

| Role  | Main Responsibilities              |
| ----- | ---------------------------------- |
| User  | Create and track complaints        |
| Staff | Handle assigned complaints         |
| Admin | Manage complaints, staff and users |

---

## 📂 Project Structure

```text
smart-complaint-management-system/
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   │   ├── admin/
│   │   │   ├── staff/
│   │   │   └── user/
│   │   ├── routes/
│   │   ├── services/
│   │   └── ...
│   │
│   └── package.json
│
├── backend/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── middleware/
│   ├── config/
│   ├── server.js
│   └── package.json
│
├── .gitignore
└── README.md
```

---

## 🚀 Installation

### 1. Clone the Repository

```bash
git clone YOUR_GITHUB_REPOSITORY_URL
```

```bash
cd smart-complaint-management-system
```

---

### 2. Setup Backend

Open the backend directory:

```bash
cd backend
```

Install dependencies:

```bash
npm install
```

Create a `.env` file:

```env
PORT=8000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
```

Start the backend:

```bash
npm run dev
```

The backend will run on:

```text
http://localhost:8000
```

---

### 3. Setup Frontend

Open another terminal:

```bash
cd frontend
```

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

The frontend will normally run on:

```text
http://localhost:5173
```

---

## 🔐 Environment Variables

The following environment variables are required for the backend:

| Variable     | Description                            |
| ------------ | -------------------------------------- |
| `PORT`       | Backend server port                    |
| `MONGO_URI`  | MongoDB Atlas connection string        |
| `JWT_SECRET` | Secret key used for JWT authentication |


## 🔑 Authentication

The application uses JWT-based authentication.

After successful login:

```text
User Login
     ↓
Backend validates credentials
     ↓
JWT token generated
     ↓
Token stored on client
     ↓
Token sent with protected API requests
     ↓
Auth middleware verifies token
```

Role-based middleware ensures that users can access only the functionality permitted for their role.

---

## 📋 Complaint Categories

Complaints can be categorized into areas such as:

* Academic
* Classroom
* Laboratory
* Library
* Examination
* Fees
* Hostel
* Canteen
* Cleanliness
* Electricity
* Water
* Internet
* Transport
* Security
* Maintenance
* Sports
* Events
* Other

---

## 📊 Main Modules

### User Module

```text
Dashboard
├── Create Complaint
├── My Complaints
├── Notifications
├── Profile
└── Settings
```

### Staff Module

```text
Dashboard
├── Assigned Complaints
├── Notifications
├── My Profile
└── Settings
```

### Admin Module

```text
Dashboard
├── Complaints
├── Users
├── Notifications
└── Settings
```

---

## 🧪 Testing

The major application modules have been tested, including:

* Authentication
* User registration and login
* Complaint creation
* Complaint listing
* Complaint assignment
* Complaint status updates
* User management
* Notifications
* Profiles
* Password management
* Role-based access

---

## 🔮 Future Improvements

Possible future enhancements include:

* Email notifications
* Real-time notifications using Socket.IO
* Complaint priority-based assignment
* Advanced analytics and reports
* Complaint search and filtering
* File/image attachments
* Automatic complaint categorization using AI
* Deployment with cloud infrastructure
* Mobile application

---

## 🎯 Project Objective

The objective of this project is to provide a centralized digital platform for managing college complaints efficiently.

It reduces manual complaint handling and provides transparency by allowing users to track complaints while enabling staff and administrators to manage the complete complaint lifecycle.

---

