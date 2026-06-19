/* ═══════════════════════════════════════════════════════════════════════════
   Auth Module — handles login, register, logout, and session persistence.
   ═══════════════════════════════════════════════════════════════════════════ */

const auth = {
  /**
   * Check if we have a stored token and validate it with the server.
   * Returns the user object if authenticated, otherwise null.
   */
  async checkSession() {
    const token = localStorage.getItem('token');
    if (!token) return null;

    try {
      const data = await api.auth.getMe();
      this._saveUser(data.user);
      return data.user;
    } catch {
      this.clearSession();
      return null;
    }
  },

  /**
   * Attempt to log in with email + password.
   */
  async login(email, password) {
    const data = await api.auth.login({ email, password });
    this._saveSession(data.token, data.user);
    return data.user;
  },

  /**
   * Register a new account.
   */
  async register(username, email, password) {
    const data = await api.auth.register({ username, email, password });
    this._saveSession(data.token, data.user);
    return data.user;
  },

  /**
   * Clear session and redirect to auth page.
   */
  logout() {
    this.clearSession();
    app.showAuthPage();
  },

  // ── Internal ────────────────────────────────────────────────────────────
  _saveSession(token, user) {
    localStorage.setItem('token', token);
    this._saveUser(user);
  },

  _saveUser(user) {
    localStorage.setItem('user', JSON.stringify(user));
  },

  clearSession() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },
};
