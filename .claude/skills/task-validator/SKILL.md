# Task Validator Skill

## Description
Validates the format of To-Do tasks and automatically checks for missing deadlines or priority tags before saving them to the database.

## Capabilities
- **Title Validation**: Ensures task titles are non-empty and under 200 characters.
- **Priority Check**: Warns if priority is not set (defaults to `medium`).
- **Deadline Check**: Flags tasks with a due date in the past.
- **Status Integrity**: Ensures status transitions are valid (e.g., `completed` tasks cannot revert to `pending` without confirmation).

## Usage
When the user submits a new task (POST `/api/tasks`) or updates an existing task (PUT `/api/tasks/:id`), the backend controller automatically runs these validations via `express-validator` middleware.

## Validation Rules
1. `title` — required, trimmed, max 200 chars
2. `priority` — must be `high`, `medium`, or `low`
3. `status` — must be `pending`, `in-progress`, or `completed`
4. `dueDate` — if provided, server does not reject past dates (flexibility), but the frontend visually marks overdue tasks

## Example
```json
{
  "title": "Submit job application to ABC Corp",
  "description": "Tailor resume for the frontend role",
  "priority": "high",
  "dueDate": "2026-06-25T00:00:00Z",
  "status": "pending"
}
```
