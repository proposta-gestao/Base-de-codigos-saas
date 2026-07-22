/**
 * River Core - Service Registry
 * Container simples para injeção de dependências de serviços.
 * Responsabilidade Única: Registrar, recuperar e remover instâncias.
 */
class ServiceRegistry {
    constructor() {
        this.services = new Map();
    }

    register(name, serviceInstance) {
        if (!name || typeof name !== 'string') throw new Error('Service name required');
        if (this.services.has(name)) throw new Error(`Service '${name}' already registered`);
        
        // Registra a instância exatamente como recebida (a proteção ocorre na camada de domínio)
        this.services.set(name, serviceInstance);
    }

    get(name) {
        if (!this.services.has(name)) {
            console.warn(`Service '${name}' not found.`);
            return null;
        }
        return this.services.get(name);
    }

    has(name) {
        return this.services.has(name);
    }

    list() {
        return Array.from(this.services.keys());
    }

    remove(name) {
        this.services.delete(name);
    }
}
