/**
 * River Core - Module Registry
 * Gerencia o ciclo de vida e metadados de todos os módulos conectáveis.
 * Não conhece lógica de UI, rotas ou negócio.
 */
class ModuleRegistry {
    /**
     * @param {Object} eventBus - Instância do EventBus injetada (Dependency Injection).
     */
    constructor(eventBus) {
        if (!eventBus) throw new Error("ModuleRegistry requer uma instância de EventBus.");
        this.eventBus = eventBus;
        this.modules = new Map(); // Armazena { state, definition }
    }

    /**
     * Registra um novo módulo baseado no contrato arquitetural.
     * @param {Object} definition - Metadados do módulo.
     */
    registerModule(definition) {
        if (!definition || typeof definition !== 'object') {
            throw new Error("[ModuleRegistry] Definição de módulo inválida.");
        }

        const { id, name, version, initialize, destroy } = definition;

        // Validações de campos obrigatórios
        if (!id || typeof id !== 'string') throw new Error("[ModuleRegistry] Falha: 'id' obrigatório e deve ser string.");
        if (this.modules.has(id)) throw new Error(`[ModuleRegistry] Falha: Módulo '${id}' já está registrado.`);
        if (!name) throw new Error(`[ModuleRegistry] Falha: 'name' obrigatório no módulo '${id}'.`);
        if (!version) throw new Error(`[ModuleRegistry] Falha: 'version' obrigatório no módulo '${id}'.`);
        if (typeof initialize !== 'function') throw new Error(`[ModuleRegistry] Falha: 'initialize' obrigatório e deve ser uma função no módulo '${id}'.`);
        
        // Validações de campos opcionais
        if (destroy !== undefined && typeof destroy !== 'function') {
            throw new Error(`[ModuleRegistry] Falha: 'destroy' fornecido no módulo '${id}', mas não é uma função.`);
        }

        this.modules.set(id, {
            state: 'registered',
            definition: definition
        });

        this.eventBus.emit('module.registered', { id, name, version });
    }

    /**
     * Remove o registro de um módulo. Destrói se estiver inicializado.
     * @param {string} id - ID do módulo.
     */
    unregisterModule(id) {
        if (!this.modules.has(id)) return;
        
        const mod = this.modules.get(id);
        if (mod.state === 'initialized') {
            this.destroyModule(id);
        }
        
        this.modules.delete(id);
        this.eventBus.emit('module.unregistered', { id });
    }

    /**
     * Inicializa um módulo registrado. Verifica dependências no momento da inicialização.
     * @param {string} id - ID do módulo.
     */
    initializeModule(id) {
        const mod = this.modules.get(id);
        if (!mod) throw new Error(`[ModuleRegistry] Módulo '${id}' não encontrado.`);
        
        // Impede inicialização duplicada
        if (mod.state === 'initialized') {
            console.warn(`[ModuleRegistry] Módulo '${id}' já está inicializado.`);
            return;
        }

        // Validação de dependências (Run-time na inicialização)
        const deps = mod.definition.dependencies || [];
        for (const depId of deps) {
            if (!this.modules.has(depId)) {
                mod.state = 'failed';
                throw new Error(`[ModuleRegistry] Falha ao inicializar '${id}': Dependência '${depId}' não registrada.`);
            }
            const depMod = this.modules.get(depId);
            if (depMod.state !== 'initialized') {
                mod.state = 'failed';
                throw new Error(`[ModuleRegistry] Falha ao inicializar '${id}': Dependência '${depId}' não está inicializada.`);
            }
        }

        try {
            mod.definition.initialize();
            mod.state = 'initialized';
            this.eventBus.emit('module.initialized', { id });
        } catch (error) {
            mod.state = 'failed';
            console.error(`[ModuleRegistry] Erro ao inicializar módulo '${id}':`, error);
            throw error;
        }
    }

    /**
     * Destrói um módulo inicializado (Opcional).
     * @param {string} id - ID do módulo.
     */
    destroyModule(id) {
        const mod = this.modules.get(id);
        if (!mod) throw new Error(`[ModuleRegistry] Módulo '${id}' não encontrado.`);
        
        if (mod.state !== 'initialized') {
            throw new Error(`[ModuleRegistry] Não é possível destruir módulo '${id}': Estado atual é '${mod.state}'.`);
        }

        try {
            if (typeof mod.definition.destroy === 'function') {
                mod.definition.destroy();
            }
            mod.state = 'destroyed';
            this.eventBus.emit('module.destroyed', { id });
        } catch (error) {
            console.error(`[ModuleRegistry] Erro ao destruir módulo '${id}':`, error);
            throw error;
        }
    }

    /**
     * Retorna o estado e metadados de um módulo.
     * @param {string} id - ID do módulo.
     */
    getModule(id) {
        return this.modules.get(id) || null;
    }

    /**
     * Verifica se um módulo está registrado.
     * @param {string} id - ID do módulo.
     */
    hasModule(id) {
        return this.modules.has(id);
    }

    /**
     * Retorna lista de todos os módulos e seus estados.
     */
    listModules() {
        const list = [];
        this.modules.forEach((mod, id) => {
            list.push({ id, state: mod.state, definition: mod.definition });
        });
        return list;
    }
}
