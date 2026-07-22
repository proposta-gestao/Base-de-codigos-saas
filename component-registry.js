/**
 * River Core - Component Registry
 * Gerencia o ciclo de vida e o armazenamento de componentes de UI.
 */
class ComponentRegistry {
    constructor() {
        this.components = new Map();
    }

    register(name, component) {
        if (!name || typeof name !== 'string') throw new Error('Invalid component name');
        if (this.components.has(name)) throw new Error(`Component '${name}' already registered`);
        
        // Congela o componente para garantir imutabilidade da sua API
        this.components.set(name, Object.freeze(component));
    }

    get(name) {
        if (!this.components.has(name)) {
            console.warn(`Component '${name}' not found.`);
            return null;
        }
        return this.components.get(name);
    }

    has(name) {
        return this.components.has(name);
    }

    list() {
        return Array.from(this.components.keys());
    }
}
