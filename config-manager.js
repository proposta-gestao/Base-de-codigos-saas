/**
 * River Core - Config Manager
 * Fonte única de verdade para configurações do sistema.
 * Suporta escopos (public, private, runtime).
 * OBS: O parâmetro "readonly" não representa segurança cibernética, apenas imutabilidade em runtime.
 */
class ConfigManager {
    constructor(eventBus) {
        if (!eventBus) throw new Error("ConfigManager requer uma instância de EventBus.");
        this.eventBus = eventBus;
        this._store = new Map();
        this._schemas = new Map();
    }

    /**
     * Define uma configuração na inicialização (Bootstrap).
     * Formato esperado da key: "scope.key" (ex: "public.theme", "private.api_key")
     * @param {string} key 
     * @param {any} value 
     * @param {Object} options - { readonly: boolean }
     */
    set(key, value, options = { readonly: false }) {
        this._validateScope(key);
        
        if (this._store.has(key)) {
            const existing = this._store.get(key);
            if (existing.readonly) {
                throw new Error(`[ConfigManager] Chave '${key}' é readonly e não pode ser sobrescrita pelo set().`);
            }
        }
        
        this._validateSchema(key, value);

        this._store.set(key, { value, readonly: options.readonly });
        this.eventBus.emit('config.created', { key, value });
    }

    /**
     * Atualiza uma configuração já existente em tempo de execução (Runtime).
     * @param {string} key 
     * @param {any} value 
     */
    update(key, value) {
        this._validateScope(key);
        
        if (!this._store.has(key)) {
            throw new Error(`[ConfigManager] Chave '${key}' não existe. Use set() para inicializar.`);
        }

        const existing = this._store.get(key);
        if (existing.readonly) {
            throw new Error(`[ConfigManager] Chave '${key}' é readonly e não pode ser atualizada.`);
        }

        this._validateSchema(key, value);
        this._store.set(key, { value, readonly: existing.readonly });
        this.eventBus.emit('config.changed', { key, value });
    }

    /**
     * Retorna o valor de uma configuração.
     * @param {string} key 
     * @param {any} fallback 
     */
    get(key, fallback = null) {
        if (!this._store.has(key)) return fallback;
        return this._store.get(key).value;
    }

    /**
     * Registra um schema de validação para ser preparado para extensão futura.
     */
    registerSchema(key, schemaDef) {
        this._schemas.set(key, schemaDef);
    }

    /**
     * Retorna uma cópia congelada (deep clone safe) de todas as chaves sob um namespace (ex: 'public').
     */
    getNamespace(prefix) {
        const result = {};
        for (const [key, data] of this._store.entries()) {
            if (key.startsWith(`${prefix}.`)) {
                const subKey = key.substring(prefix.length + 1);
                // Cópia para evitar mutação da referência
                result[subKey] = (typeof data.value === 'object' && data.value !== null)
                    ? JSON.parse(JSON.stringify(data.value)) 
                    : data.value;
            }
        }
        return Object.freeze(result);
    }

    _validateScope(key) {
        const validScopes = ['public', 'private', 'runtime'];
        const scope = key.split('.')[0];
        if (!validScopes.includes(scope)) {
            throw new Error(`[ConfigManager] Escopo inválido na chave '${key}'. Deve iniciar com 'public.', 'private.' ou 'runtime.'.`);
        }
    }

    _validateSchema(key, value) {
        if (this._schemas.has(key)) {
            // Placeholder para engine real de validação
        }
    }
}
