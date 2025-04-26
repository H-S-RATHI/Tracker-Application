# Task Tracker Application

A modern, full-stack Task & Project Management application for teams and individuals. Built with React (frontend) and Node.js/Express/MongoDB (backend), featuring JWT authentication, beautiful UI, and robust CRUD operations for projects and tasks.

---

## Features

- **User Authentication:** Secure JWT-based signup/login.
- **Project Management:** Create, view, and delete projects (with per-user limits).
- **Task Management:** Add, edit, complete, and delete tasks within projects.
- **Modern Dashboard:** Visually appealing, responsive dashboard with project cards and task tables.
- **Status Tracking:** Color-coded status badges for tasks (Pending, In Progress, Completed).
- **UX Enhancements:** Smooth transitions, confirmation dialogs, and accessible design.
- **API Security:** Auth-protected endpoints and environment-based secrets.

---

## Tech Stack

- **Frontend:** React, CSS (custom, responsive, modern look)
- **Backend:** Node.js, Express.js, MongoDB (Mongoose)
- **Authentication:** JWT (JSON Web Tokens)

---

## Getting Started

### Prerequisites
- Node.js (v14+ recommended)
- npm or yarn
- MongoDB (local or Atlas)

### Setup

#### 1. Clone the repository
```bash
git clone <your-repo-url>
cd Tracker Application
```

#### 2. Backend Setup
```bash
cd backend
npm install
# Create a .env file with the following:
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
npm start
```

#### 3. Frontend Setup
```bash
cd ../frontend
npm install
npm start
```

#### 4. Environment Variables
- Frontend: Optionally set `REACT_APP_API_BASE` in a `.env` file (defaults to local backend)
- Backend: Set `PORT`, `MONGODB_URI`, and `JWT_SECRET` in `backend/.env`

---

## Folder Structure

```
Tracker Application/
├── backend/
│   ├── index.js
│   ├── routes/
│   ├── models/
│   └── ...
├── frontend/
│   ├── src/
│   ├── public/
│   ├── package.json
│   └── ...
└── README.md
```

---

## API Overview

- **Auth:** `/api/auth/signup`, `/api/auth/login`
- **Projects:** `/api/projects` (GET, POST), `/api/projects/:id` (DELETE)
- **Tasks:** `/api/tasks/:projectId` (GET), `/api/tasks` (POST), `/api/tasks/:taskId` (PUT, DELETE)

All routes (except signup/login) require a valid JWT in the `Authorization` header.

---

## Customization & Deployment
- Update environment variables for production.
- Deploy backend (e.g., Render, Heroku, etc.) and frontend (e.g., Netlify, Vercel).
- Set frontend API base to point to your deployed backend.

---

## License
MIT

---

## Credits
- Developed by [Your Name/Team].
- UI inspired by modern SaaS dashboard patterns.
