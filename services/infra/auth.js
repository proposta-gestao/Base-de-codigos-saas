/**
 * River Core - Infra: Auth Adapter
 * Encapsula operações de autenticação. Nenhuma regra de autorização.
 */
class AuthAdapter {
    constructor({ config, eventBus }) {
        this.config = config;
        this.eventBus = eventBus;
    }

    _formatResponse(data, error) {
        if (error) {
            this.eventBus.emit('infra.auth.error', error);
            return { data: null, error, success: false };
        }
        return { data, error: null, success: true };
    }

    async login(email, password) {
        try {
            const { data, error } = await window.supabase.auth.signInWithPassword({ email, password });
            if (!error) this.eventBus.emit('infra.auth.login', data);
            return this._formatResponse(data, error);
        } catch (err) {
            return this._formatResponse(null, err);
        }
    }

    async logout() {
        try {
            const { error } = await window.supabase.auth.signOut();
            if (!error) this.eventBus.emit('infra.auth.logout');
            return this._formatResponse(null, error);
        } catch (err) {
            return this._formatResponse(null, err);
        }
    }

    async getSession() {
        try {
            const { data, error } = await window.supabase.auth.getSession();
            return this._formatResponse(data, error);
        } catch (err) {
            return this._formatResponse(null, err);
        }
    }

    async refreshSession() {
        try {
            const { data, error } = await window.supabase.auth.refreshSession();
            return this._formatResponse(data, error);
        } catch (err) {
            return this._formatResponse(null, err);
        }
    }
}
