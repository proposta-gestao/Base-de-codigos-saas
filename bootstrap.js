/**
 * River Core - Bootstrap
 * Responsável por orquestrar a inicialização da infraestrutura central do framework.
 * Nenhuma outra camada deve instanciar EventBus, ModuleRegistry ou ConfigManager.
 */

(function() {
    // Garante o namespace base
    window.RiverCore = window.RiverCore || {};

    // Verifica se já foi bootstrapped
    if (window.RiverCore.getEventBus) return;

    // 1. Instancia infraestrutura interna (não acessível livremente)
    const _eventBus = new EventBus();
    const _configManager = new ConfigManager(_eventBus);
    const _moduleRegistry = new ModuleRegistry(_eventBus);

    // 2. Expõe os getters de forma congelada e protegida para evitar mutações globais (ex: window.RiverCore.EventBus = ...)
    Object.defineProperties(window.RiverCore, {
        getEventBus: {
            value: () => _eventBus,
            writable: false,
            configurable: false
        },
        getConfig: {
            value: () => _configManager,
            writable: false,
            configurable: false
        },
        getModules: {
            value: () => _moduleRegistry,
            writable: false,
            configurable: false
        }
    });

    // 3. Sinaliza conclusão
    _eventBus.emit('core.bootstrap_complete', { timestamp: Date.now() });
    
    console.log('[River Core] Bootstrap concluído: EventBus, ConfigManager e ModuleRegistry ativos e protegidos.');
})();
