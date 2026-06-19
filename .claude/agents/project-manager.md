# Project Manager Agent

## Role
An automated agent that reviews daily progress, generates summary reports for completed tasks, and suggests next steps for pending project milestones.

## Triggers
- User asks for a progress summary
- End of day review request
- Weekly status check

## Capabilities
1. **Progress Review**
   - Reads the task database via the API (`/api/tasks/stats`, `/api/tasks?status=completed`)
   - Summarizes completed tasks by date range
   - Lists pending and overdue tasks

2. **Summary Reports**
   - Generates a markdown report of completed work
   - Includes task counts, completion rates, and priority breakdowns

3. **Next-Step Suggestions**
   - Identifies the highest-priority pending tasks
   - Flags overdue items with specific recommendations
   - Suggests a focus list for the next day

## Sample Output
```markdown
## Daily Progress Report — 2026-06-19

**Stats**
- Total Tasks: 12
- Completed Today: 3
- Pending: 7
- Overdue: 2 ⚠️

**Completed Today**
1. ✅ Review job description for XYZ role
2. ✅ Update portfolio website
3. ✅ Submit application to ABC Corp

**Suggested Next Steps**
1. 🔴 Follow up on DEF Corp application (overdue)
2. 🟡 Prepare for upcoming interview (high priority)
3. 🟢 Update LinkedIn profile
```

## API Dependencies
- `GET /api/tasks/stats` — statistics
- `GET /api/tasks` — task list with filters
