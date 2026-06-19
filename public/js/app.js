/* ═══════════════════════════════════════════════════════════════════════════
   App Controller — initializes the application, wires up event handlers,
   manages global state, and orchestrates auth ↔ UI ↔ API flows.
   ═══════════════════════════════════════════════════════════════════════════ */

const app = {
  /**
   * Application-wide state.
   */
  state: {
    currentFilter: 'all',     // sidebar filter: all | pending | in-progress | completed
    filterPriority: '',       // priority dropdown value
    searchQuery: '',           // search input text
    sortBy: 'createdAt',      // sort dropdown value
  },

  // ═══════════════════════════════════════════════════════════════════════
  //  INIT
  // ═══════════════════════════════════════════════════════════════════════
  async init() {
    ui.initTheme();

    // Try to restore session
    const user = await auth.checkSession();
    if (user) {
      this.showAppPage(user);
    } else {
      this.showAuthPage();
    }

    this._bindEvents();
  },

  // ═══════════════════════════════════════════════════════════════════════
  //  PAGE SWITCHING
  // ═══════════════════════════════════════════════════════════════════════
  showAuthPage() {
    ui.$('auth-page').classList.remove('hidden');
    ui.$('app-page').classList.add('hidden');
  },

  async showAppPage(user) {
    ui.$('auth-page').classList.add('hidden');
    ui.$('app-page').classList.remove('hidden');

    // Display username
    ui.$('sidebar-username').textContent = user.username;

    // Load data
    await Promise.all([ui.loadStats(), ui.renderTasks()]);
  },

  // ═══════════════════════════════════════════════════════════════════════
  //  TASK ACTIONS
  // ═══════════════════════════════════════════════════════════════════════

  /**
   * Toggle the status of a task between completed and pending.
   */
  async toggleTaskStatus(taskId, currentStatus) {
    const newStatus = currentStatus === 'completed' ? 'pending' : 'completed';
    try {
      await api.tasks.update(taskId, { status: newStatus });
      ui.toast(newStatus === 'completed' ? 'Task completed! 🎉' : 'Task re-opened');
      this.refresh();
    } catch (err) {
      ui.toast(err.message, 'error');
    }
  },

  /**
   * Open the Add-Task modal.
   */
  openAddModal() {
    ui.openAddModal();
  },

  /**
   * Open the Edit-Task modal by task id.
   */
  async openEditModal(taskId) {
    await ui.openEditModal(taskId);
  },

  /**
   * Open the Delete confirmation modal.
   */
  openDeleteModal(taskId, title) {
    ui.openDeleteModal(taskId, title);
  },

  /**
   * Handle the task form submission (create or update).
   */
  async handleTaskSubmit(e) {
    e.preventDefault();

    const id = ui.$('task-id').value;
    const body = {
      title: ui.$('task-title').value.trim(),
      description: ui.$('task-description').value.trim(),
      priority: ui.$('task-priority').value,
      status: ui.$('task-status').value,
      dueDate: ui.$('task-due-date').value ? new Date(ui.$('task-due-date').value).toISOString() : null,
    };

    try {
      if (id) {
        await api.tasks.update(id, body);
        ui.toast('Task updated!');
      } else {
        await api.tasks.create(body);
        ui.toast('Task created! 🚀');
      }
      ui.closeModal('task-modal');
      this.refresh();
    } catch (err) {
      ui.toast(err.errors?.[0]?.msg || err.message, 'error');
    }
  },

  /**
   * Confirm and delete the pending-delete task.
   */
  async handleDeleteConfirm() {
    const id = ui._pendingDeleteId;
    if (!id) return;

    try {
      await api.tasks.delete(id);
      ui.toast('Task deleted');
      ui.closeModal('delete-modal');
      ui._pendingDeleteId = null;
      this.refresh();
    } catch (err) {
      ui.toast(err.message, 'error');
    }
  },

  /**
   * Reload stats + task list.
   */
  async refresh() {
    await Promise.all([ui.loadStats(), ui.renderTasks()]);
  },

  // ═══════════════════════════════════════════════════════════════════════
  //  EVENT BINDING
  // ═══════════════════════════════════════════════════════════════════════
  _bindEvents() {
    // ── Auth Tabs ────────────────────────────────────────────────────
    document.querySelectorAll('.auth-tab').forEach((tab) => {
      tab.addEventListener('click', () => {
        document.querySelectorAll('.auth-tab').forEach((t) => t.classList.remove('active'));
        tab.classList.add('active');

        const isLogin = tab.dataset.tab === 'login';
        ui.$('login-form').classList.toggle('hidden', !isLogin);
        ui.$('register-form').classList.toggle('hidden', isLogin);
      });
    });

    // ── Login Form ────────────────────────────────────────────────────
    ui.$('login-form').addEventListener('submit', async (e) => {
      e.preventDefault();
      const errorEl = ui.$('login-error');
      errorEl.textContent = '';

      try {
        const user = await auth.login(
          ui.$('login-email').value.trim(),
          ui.$('login-password').value
        );
        ui.toast(`Welcome back, ${user.username}!`, 'success');
        this.showAppPage(user);
      } catch (err) {
        errorEl.textContent = err.message;
      }
    });

    // ── Register Form ─────────────────────────────────────────────────
    ui.$('register-form').addEventListener('submit', async (e) => {
      e.preventDefault();
      const errorEl = ui.$('register-error');
      errorEl.textContent = '';

      try {
        const user = await auth.register(
          ui.$('reg-username').value.trim(),
          ui.$('reg-email').value.trim(),
          ui.$('reg-password').value
        );
        ui.toast(`Welcome, ${user.username}!`, 'success');
        this.showAppPage(user);
      } catch (err) {
        errorEl.textContent = err.message;
      }
    });

    // ── Logout ────────────────────────────────────────────────────────
    ui.$('logout-btn-sidebar').addEventListener('click', () => auth.logout());

    // ── Dark Mode Toggle ──────────────────────────────────────────────
    ui.$('dark-mode-toggle').addEventListener('click', () => ui.toggleTheme());

    // ── Add Task button ───────────────────────────────────────────────
    ui.$('add-task-btn').addEventListener('click', () => this.openAddModal());

    // ── Task Form Submit ──────────────────────────────────────────────
    ui.$('task-form').addEventListener('submit', (e) => this.handleTaskSubmit(e));

    // ── Modal Close buttons ───────────────────────────────────────────
    ui.$('modal-close').addEventListener('click', () => ui.closeModal('task-modal'));
    ui.$('modal-cancel').addEventListener('click', () => ui.closeModal('task-modal'));
    ui.$('delete-modal-close').addEventListener('click', () => ui.closeModal('delete-modal'));
    ui.$('delete-cancel').addEventListener('click', () => ui.closeModal('delete-modal'));

    // Overlay clicks to close modals
    document.querySelectorAll('.modal-overlay').forEach((overlay) => {
      overlay.addEventListener('click', () => {
        ui.closeModal('task-modal');
        ui.closeModal('delete-modal');
      });
    });

    // ── Delete Confirm ────────────────────────────────────────────────
    ui.$('delete-confirm').addEventListener('click', () => this.handleDeleteConfirm());

    // ── Sidebar Nav ───────────────────────────────────────────────────
    document.querySelectorAll('.nav-item').forEach((item) => {
      item.addEventListener('click', (e) => {
        e.preventDefault();
        this.state.currentFilter = item.dataset.filter;
        ui.setActiveNav(this.state.currentFilter);
        ui.renderTasks();
      });
    });

    // ── Filters ───────────────────────────────────────────────────────
    ui.$('filter-priority').addEventListener('change', () => {
      this.state.filterPriority = ui.$('filter-priority').value;
      ui.renderTasks();
    });

    ui.$('filter-status').addEventListener('change', () => {
      this.state.currentFilter = ui.$('filter-status').value;
      ui.setActiveNav(this.state.currentFilter);
      ui.renderTasks();
    });

    ui.$('sort-by').addEventListener('change', () => {
      this.state.sortBy = ui.$('sort-by').value;
      ui.renderTasks();
    });

    // ── Search (debounced) ────────────────────────────────────────────
    let searchTimer;
    ui.$('search-input').addEventListener('input', (e) => {
      clearTimeout(searchTimer);
      searchTimer = setTimeout(() => {
        this.state.searchQuery = e.target.value.trim();
        ui.renderTasks();
      }, 300);
    });

    // ── Mobile Menu Toggle ────────────────────────────────────────────
    ui.$('menu-toggle').addEventListener('click', () => {
      document.querySelector('.sidebar').classList.toggle('open');
    });

    // Close sidebar when clicking outside on mobile
    document.addEventListener('click', (e) => {
      const sidebar = document.querySelector('.sidebar');
      if (sidebar.classList.contains('open') &&
          !sidebar.contains(e.target) &&
          e.target !== ui.$('menu-toggle') &&
          !ui.$('menu-toggle').contains(e.target)) {
        sidebar.classList.remove('open');
      }
    });

    // ── Keyboard Shortcuts ────────────────────────────────────────────
    document.addEventListener('keydown', (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        ui.$('search-input').focus();
      }
      if (e.key === 'Escape') {
        ui.closeModal('task-modal');
        ui.closeModal('delete-modal');
      }
    });
  },
};

// ── Kick it off ─────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => app.init());
