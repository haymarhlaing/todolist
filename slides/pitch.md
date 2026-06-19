---
marp: true
paginate: true
transition: fade
# PechaKucha: 6 slides, 20s auto-advance. Do not change the count.
auto-advance: 20
---

<!-- slide 1 -->
# Who's my person?

* **Target User:** Busy project managers and team leads.
* **The Reality:** They spend hours parsing chat logs, emails, and task trackers just to figure out what their team actually accomplished each day.
* **Their Goal:** Focus on strategy and blocking issues, not manual information gathering.

---

<!-- slide 2 -->
# Their problem

* **Information Fragmentation:** Critical project updates are scattered across disparate tools (Slack, GitHub, Jira).
* **The "Context Switch" Tax:** Manually checking every platform drains productivity and leads to communication gaps.
* **The Result:** Delayed decisions, missed blockers, and alignment meetings that could have been an asynchronous summary.

---

<!-- slide 3 -->
# What I built

* **The Solution:** An Autonomous Daily Standup Digest Agent.
* **What it does:** Automatically fetches, synthesizes, and cross-references data from your team's workflow tools.
* **The Output:** Delivers a concise, actionable, and context-aware morning summary directly to the manager's dashboard.

---

<!-- slide 4 -->
# How I built it

* **MCP:** Used the GitHub and Jira Model Context Protocol servers to securely fetch real-time commits, pull requests, and ticket statuses.
* **Skill:** Programmed a custom data-synthesis skill to filter out noise, match developers to tasks, and highlight potential blockers.
* **Agent:** Deployed an LLM-powered agent to analyze the aggregated data, infer team progress, and draft the natural language summary.

---

<!-- slide 5 -->
# Why it matters

* **Time Reclaimed:** Saves managers up to 5 hours a week in administrative overhead.
* **Proactive Management:** Identifies stalled pull requests and bottlenecked tickets *before* they delay a sprint.
* **Team Harmony:** Eliminates micro-management by gathering updates passively, letting developers focus on deep work.

---

<!-- slide 6 -->
# Done checklist

- [x] repo public
- [x] MCP + skill + agent used
- [x] report.md in team repo
