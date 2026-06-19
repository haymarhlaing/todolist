# TaskFlow — Project Pitch

---

## Slide 1: The Problem
**Keeping track of everything is hard.**

Between job applications, daily to-dos, and project milestones, most people juggle multiple lists across different tools — sticky notes, spreadsheets, random apps. Nothing is integrated.

---

## Slide 2: Our Solution
**TaskFlow — one dashboard for everything.**

A modern, full-stack To-Do List app purpose-built for job seekers and project managers. Track applications, daily tasks, and milestones in one place with automatic deadline alerts.

---

## Slide 3: Key Features
- 📋 **Full Task Management** — CRUD with priorities, due dates, and status tracking
- 📊 **Live Dashboard** — Real-time stats: total, completed, pending, overdue
- 🔍 **Smart Search & Filters** — Find any task instantly
- 🔐 **Secure Auth** — JWT-based authentication
- 🌙 **Dark Mode** — Eye-friendly for late-night productivity
- 📱 **Fully Responsive** — Works on any device

---

## Slide 4: Tech Stack
| Frontend       | Backend            | Database |
|----------------|--------------------|----------|
| HTML5 + CSS3   | Node.js            | MongoDB  |
| Vanilla JS     | Express            | Mongoose |

**Why this stack?**
- No build step — zero-config deployment
- MongoDB's flexible schema fits task data perfectly
- JWT auth keeps things stateless and scalable

---

## Slide 5: Architecture
```
Browser (SPA) → Express API → MongoDB
                 └── JWT Auth Middleware
                 └── Input Validation
```

Clean MVC pattern on the backend, modular JS on the frontend.

---

## Slide 6: Live Demo
→ Open `http://localhost:5000`
→ Register an account
→ Start adding tasks!

---

## Slide 7: Next Steps
- [ ] Email notifications for overdue tasks
- [ ] Drag-and-drop task reordering
- [ ] Export tasks to PDF / Excel
- [ ] Team collaboration features
- [ ] Mobile PWA support
