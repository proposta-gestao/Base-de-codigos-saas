/**
 * River Core - View Registry
 * Gerencia o registro e ciclo de vida de View Controllers agnósticos.
 */
class ViewRegistry {
    constructor() {
        this.definitions = new Map(); // name -> Constructor/Factory
        this.activeInstances = new Map(); // name -> Instância ativa
    }

    /**
     * Registra o construtor da View.
     */
    register(name, viewClass) {
        if (!name || !viewClass) throw new Error('View name and class required');
        if (this.definitions.has(name)) throw new Error(`View '${name}' already registered`);
        
        this.definitions.set(name, viewClass);
    }

    /**
     * Cria (ou recria) a instância da View e armazena.
     */
    create(name, context) {
        if (!this.definitions.has(name)) throw new Error(`View '${name}' is not registered`);
        
        // Destroi a anterior se houver
        this.destroy(name);

        const ViewClass = this.definitions.get(name);
        const instance = new ViewClass(context);
        this.activeInstances.set(name, instance);
        
        return instance;
    }

    /**
     * Retorna a instância ativa da View.
     */
    get(name) {
        return this.activeInstances.get(name);
    }

    /**
     * Verifica se a definição existe.
     */
    has(name) {
        return this.definitions.has(name);
    }

    /**
     * Destrói a instância ativa da view (limpando listeners).
     */
    destroy(name) {
        const instance = this.activeInstances.get(name);
        if (instance) {
            if (typeof instance.destroy === 'function') {
                try {
                    instance.destroy();
                } catch (err) {
                    console.error(`Error destroying view ${name}:`, err);
                }
            }
            this.activeInstances.delete(name);
        }
    }
}
