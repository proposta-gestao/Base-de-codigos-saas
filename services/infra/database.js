/**
 * River Core - Infra: Database Adapter
 * Encapsula o acesso ao banco (Supabase) fornecendo API padronizada de CRUD.
 */
class DatabaseAdapter {
    constructor({ config, eventBus }) {
        this.config = config;
        this.eventBus = eventBus;
    }

    _formatResponse(data, error) {
        if (error) {
            this.eventBus.emit('infra.database.error', error);
            return { data: null, error, success: false };
        }
        return { data, error: null, success: true };
    }

    async query(table, selectStr = '*', matchParams = {}) {
        try {
            // Usa supabase global provisoriamente até removermos do window
            const { data, error } = await window.supabase.from(table).select(selectStr).match(matchParams);
            return this._formatResponse(data, error);
        } catch (err) {
            return this._formatResponse(null, err);
        }
    }

    async insert(table, payload) {
        try {
            const { data, error } = await window.supabase.from(table).insert(payload).select();
            return this._formatResponse(data, error);
        } catch (err) {
            return this._formatResponse(null, err);
        }
    }

    async update(table, matchParams, payload) {
        try {
            const { data, error } = await window.supabase.from(table).update(payload).match(matchParams).select();
            return this._formatResponse(data, error);
        } catch (err) {
            return this._formatResponse(null, err);
        }
    }

    async delete(table, matchParams) {
        try {
            const { data, error } = await window.supabase.from(table).delete().match(matchParams).select();
            return this._formatResponse(data, error);
        } catch (err) {
            return this._formatResponse(null, err);
        }
    }
}
