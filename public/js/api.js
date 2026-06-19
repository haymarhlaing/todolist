/* ═══════════════════════════════════════════════════════════════════════════
   API Client — handles all HTTP communication with the backend.
   Automatically attaches JWT from localStorage and parses responses.
   ═══════════════════════════════════════════════════════════════════════════ */

const api = {
  /**
   * Base wrapper around fetch. Adds auth header + JSON handling.
   */
  async request(endpoint, options = {}) {
    const token = localStorage.getItem('token');

    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      ...options,
    };

    const res = await fetch(`/api${endpoint}`, config);
    const data = await res.json();

    if (!res.ok) {
      const error = new Error(data.message || 'Request failed');
      error.status = res.status;
      error.errors = data.errors;
      throw error;
    }

    return data;
  },

  // ── Auth ────────────────────────────────────────────────────────────────
  auth: {
    register(body) {
      return api.request('/auth/register', { method: 'POST', body: JSON.stringify(body) });
    },
    login(body) {
      return api.request('/auth/login', { method: 'POST', body: JSON.stringify(body) });
    },
    getMe() {
      return api.request('/auth/me');
    },
  },

  // ── Tasks ───────────────────────────────────────────────────────────────
  tasks: {
    list(query = {}) {
      const params = new URLSearchParams();
      Object.entries(query).forEach(([k, v]) => {
        if (v) params.set(k, v);
      });
      const qs = params.toString();
      return api.request(`/tasks${qs ? '?' + qs : ''}`);
    },
    stats() {
      return api.request('/tasks/stats');
    },
    create(body) {
      return api.request('/tasks', { method: 'POST', body: JSON.stringify(body) });
    },
    update(id, body) {
      return api.request(`/tasks/${id}`, { method: 'PUT', body: JSON.stringify(body) });
    },
    delete(id) {
      return api.request(`/tasks/${id}`, { method: 'DELETE' });
    },
  },
};
