/* ═══════════════════════════════════════════════════════════════════════════
   UI Module — renders the DOM, manages modals, toasts, stats, and theme.
   ═══════════════════════════════════════════════════════════════════════════ */

const ui = {
  // ── Element References ─────────────────────────────────────────────────
  _cache: {},

  $: function (id) {
    if (!this._cache[id]) {
      this._cache[id] = document.getElementById(id);
    }
    return this._cache[id];
  },

  // ── Toast ──────────────────────────────────────────────────────────────
  toast(message, type = 'success') {
    const container = this.$('toast-container');
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;

    const icons = { success: 'fa-circle-check', error: 'fa-circle-xmark', info: 'fa-circle-info' };
    toast.innerHTML = `<i class="fa-solid ${icons[type] || icons.info}"></i> ${message}`;

    container.appendChild(toast);
    setTimeout(() => toast.remove(), 3200);
  },

  // ── Stats ──────────────────────────────────────────────────────────────
  async loadStats() {
    try {
      const stats = await api.tasks.stats();
      this.$('stat-total').textContent = stats.total;
      this.$('stat-pending').textContent = stats.pending;
      this.$('stat-completed').textContent = stats.completed;
      this.$('stat-overdue').textContent = stats.overdue;
    } catch (err) {
      console.error('Error loading stats:', err);
    }
  },

  // ── Task List ──────────────────────────────────────────────────────────
  async renderTasks() {
    const query = {
      status: app.state.currentFilter !== 'all' ? app.state.currentFilter : '',
      priority: app.state.filterPriority,
      search: app.state.searchQuery,
      sort: app.state.sortBy,
    };

    try {
      const data = await api.tasks.list(query);
      const listEl = this.$('task-list');
      const emptyEl = this.$('empty-state');

      if (data.tasks.length === 0) {
        listEl.innerHTML = '';
        emptyEl.classList.remove('hidden');
      } else {
        emptyEl.classList.add('hidden');
        listEl.innerHTML = data.tasks.map(this._taskCardHTML).join('');
      }
    } catch (err) {
      this.toast(err.message, 'error');
    }
  },

  /**
   * Generate the HTML string for a single task card.
   */
  _taskCardHTML(task) {
    const isOverdue = task.dueDate && new Date(task.dueDate) < new Date() && task.status !== 'completed';
    const completedClass = task.status === 'completed' ? 'completed' : '';
    const dueDateStr = task.dueDate
      ? new Date(task.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
      : '';

    return /* html */ `
      <div class="task-card ${completedClass}" data-id="${task._id}">
        <button class="task-checkbox" onclick="app.toggleTaskStatus('${task._id}', '${task.status}')"
                title="${task.status === 'completed' ? 'Mark incomplete' : 'Mark complete'}">
          <i class="fa-solid fa-check"></i>
        </button>

        <div class="task-body">
          <h4>
            ${this._escapeHTML(task.title)}
            <span class="task-priority priority-${task.priority}">${task.priority}</span>
            <span class="task-status status-${task.status}">${task.status.replace('-', ' ')}</span>
          </h4>
          ${task.description ? `<p>${this._escapeHTML(task.description)}</p>` : ''}
        </div>

        <div class="task-meta">
          ${dueDateStr ? `<span class="task-due ${isOverdue ? 'overdue' : ''}">
            <i class="fa-solid fa-calendar-days"></i> ${dueDateStr}
          </span>` : ''}
          <div class="task-actions">
            <button class="btn-icon" onclick="app.openEditModal('${task._id}')" title="Edit">
              <i class="fa-solid fa-pen-to-square"></i>
            </button>
            <button class="btn-icon" onclick="app.openDeleteModal('${task._id}', '${this._escapeHTML(task.title).replace(/'/g, "&apos;")}')" title="Delete">
              <i class="fa-solid fa-trash-can"></i>
            </button>
          </div>
        </div>
      </div>`;
  },

  /**
   * Escape HTML special chars to prevent XSS in task rendering.
   */
  _escapeHTML(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  },

  // ── Modals ─────────────────────────────────────────────────────────────
  openModal(modalId) {
    this.$(modalId).classList.remove('hidden');
  },

  closeModal(modalId) {
    this.$(modalId).classList.add('hidden');
  },

  /**
   * Open modal in Add mode (empty form).
   */
  openAddModal() {
    this.$('modal-title').textContent = 'New Task';
    this.$('task-id').value = '';
    this.$('task-title').value = '';
    this.$('task-description').value = '';
    this.$('task-priority').value = 'medium';
    this.$('task-status').value = 'pending';
    this.$('task-due-date').value = '';
    this.openModal('task-modal');
  },

  /**
   * Open modal in Edit mode (pre-filled from task data).
   */
  async openEditModal(taskId) {
    try {
      const data = await api.tasks.list();
      const task = data.tasks.find((t) => t._id === taskId);
      if (!task) return this.toast('Task not found', 'error');

      this.$('modal-title').textContent = 'Edit Task';
      this.$('task-id').value = task._id;
      this.$('task-title').value = task.title;
      this.$('task-description').value = task.description || '';
      this.$('task-priority').value = task.priority;
      this.$('task-status').value = task.status;
      this.$('task-due-date').value = task.dueDate
        ? new Date(task.dueDate).toISOString().split('T')[0]
        : '';
      this.openModal('task-modal');
    } catch (err) {
      this.toast(err.message, 'error');
    }
  },

  /**
   * Open delete confirmation modal.
   */
  openDeleteModal(taskId, title) {
    this.$('delete-task-name').textContent = title;
    this._pendingDeleteId = taskId;
    this.openModal('delete-modal');
  },

  // ── Sidebar ────────────────────────────────────────────────────────────
  setActiveNav(filter) {
    document.querySelectorAll('.nav-item').forEach((item) => {
      item.classList.toggle('active', item.dataset.filter === filter);
    });
    const titles = { all: 'Dashboard', pending: 'Pending Tasks', 'in-progress': 'In Progress', completed: 'Completed' };
    this.$('page-title').textContent = titles[filter] || 'Dashboard';
  },

  // ── Dark Mode ──────────────────────────────────────────────────────────
  initTheme() {
    const saved = localStorage.getItem('theme');
    if (saved === 'dark') {
      document.body.setAttribute('data-theme', 'dark');
    }
    this._updateThemeIcon();
  },

  toggleTheme() {
    const current = document.body.getAttribute('data-theme');
    const next = current === 'dark' ? 'light' : 'dark';
    document.body.setAttribute('data-theme', next);
    localStorage.setItem('theme', next);
    this._updateThemeIcon();
  },

  _updateThemeIcon() {
    const icon = document.querySelector('#dark-mode-toggle i');
    if (document.body.getAttribute('data-theme') === 'dark') {
      icon.className = 'fa-solid fa-sun';
    } else {
      icon.className = 'fa-solid fa-moon';
    }
  },
};
