/**
 * River Core - Infra: Storage Adapter
 * Responsável por upload, download, deleção de arquivos físicos.
 */
class StorageAdapter {
    constructor({ config, eventBus }) {
        this.config = config;
        this.eventBus = eventBus;
    }

    _formatResponse(data, error) {
        if (error) {
            this.eventBus.emit('infra.storage.error', error);
            return { data: null, error, success: false };
        }
        return { data, error: null, success: true };
    }

    async upload(bucket, path, file, options = {}) {
        try {
            const { data, error } = await window.supabase.storage.from(bucket).upload(path, file, options);
            return this._formatResponse(data, error);
        } catch (err) {
            return this._formatResponse(null, err);
        }
    }

    async delete(bucket, pathsArray) {
        try {
            const { data, error } = await window.supabase.storage.from(bucket).remove(pathsArray);
            return this._formatResponse(data, error);
        } catch (err) {
            return this._formatResponse(null, err);
        }
    }

    getPublicUrl(bucket, path) {
        try {
            const { data } = window.supabase.storage.from(bucket).getPublicUrl(path);
            return this._formatResponse(data, null);
        } catch (err) {
            return this._formatResponse(null, err);
        }
    }
}
