# TaskFlow — Modern To-Do List Application

A full-stack task management web application for tracking job applications, daily tasks, and project milestones with automated deadline tracking.

![Stack](https://img.shields.io/badge/stack-Node.js%20%2B%20Express%20%2B%20MongoDB-brightgreen)
![License](https://img.shields.io/badge/license-MIT-blue)

## Features

- ✅ **Task CRUD** — Create, read, update, and delete tasks
- 📋 **Task Details** — Title, description, priority (high/medium/low), due date, status (pending/in-progress/completed)
- 📊 **Dashboard Stats** — Total, completed, pending, and overdue task counts
- 🔍 **Search & Filter** — Full-text search, filter by status and priority, sort by date
- 🔐 **Authentication** — Register and login with JWT-based auth
- 🌙 **Dark Mode** — Toggle between light and dark themes
- 📱 **Responsive** — Works on desktop, tablet, and mobile
- ⌨️ **Keyboard Shortcuts** — `Ctrl+K` to focus search, `Esc` to close modals

## Tech Stack

| Layer    | Technology              |
|----------|-------------------------|
| Frontend | HTML5, CSS3, Vanilla JS |
| Backend  | Node.js + Express       |
| Database | MongoDB + Mongoose      |
| Auth     | JWT + bcryptjs          |

## Project Structure

```
todolist/
├── server/
│   ├── config/
│   │   └── db.js              # MongoDB connection
│   ├── controllers/
│   │   ├── authController.js  # Register / Login / Me
│   │   └── taskController.js  # CRUD + Stats
│   ├── middleware/
│   │   └── auth.js            # JWT protection
│   ├── models/
│   │   ├── User.js            # User schema
│   │   └── Task.js            # Task schema
│   ├── routes/
│   │   ├── auth.js            # Auth routes
│   │   └── tasks.js           # Task routes
│   └── server.js              # Entry point
├── public/
│   ├── index.html             # SPA shell
│   ├── css/
│   │   └── style.css          # Full stylesheet
│   └── js/
│       ├── api.js             # API client
│       ├── auth.js            # Auth module
│       ├── ui.js              # UI rendering + toasts
│       └── app.js             # Main controller
├── .env.example               # Environment template
├── .gitignore
├── .mcp.json                  # MCP server config
├── package.json
└── README.md
```

## Installation

### Prerequisites

- [Node.js](https://nodejs.org/) v18+
- [MongoDB](https://www.mongodb.com/) running locally or a cloud instance

### Setup

```bash
# 1. Clone the repo
git clone https://github.com/haymarhlaing/todolist.git
cd todolist

# 2. Install dependencies
npm install

# 3. Configure environment
cp .env.example .env
# Edit .env — set your MONGODB_URI and JWT_SECRET

# 4. Start the server
npm start       # production
# or
npm run dev     # development (with nodemon)
```

### Usage

1. Open `http://localhost:5000` in your browser.
2. Register a new account or log in.
3. Start adding tasks!

## API Endpoints

### Auth

| Method | Endpoint           | Description      | Auth |
|--------|--------------------|------------------|------|
| POST   | `/api/auth/register` | Register         | No   |
| POST   | `/api/auth/login`    | Login            | No   |
| GET    | `/api/auth/me`       | Get current user | Yes  |

### Tasks

| Method | Endpoint           | Description                | Auth |
|--------|--------------------|----------------------------|------|
| GET    | `/api/tasks`        | List tasks (filter/search) | Yes  |
| GET    | `/api/tasks/stats`  | Get statistics             | Yes  |
| POST   | `/api/tasks`        | Create task                | Yes  |
| GET    | `/api/tasks/:id`    | Get single task            | Yes  |
| PUT    | `/api/tasks/:id`    | Update task                | Yes  |
| DELETE | `/api/tasks/:id`    | Delete task                | Yes  |

Query parameters for `GET /api/tasks`: `status`, `priority`, `search`, `sort`

## License

MIT © haymarhlaing
