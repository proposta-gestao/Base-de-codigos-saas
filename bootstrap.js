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
    const _registry = new ModuleRegistry(_eventBus);
    
    // Configura e Registra Componentes
    const _componentRegistry = new ComponentRegistry();
    if (typeof createToastComponent === 'function') {
        _componentRegistry.register('toast', createToastComponent());
    }
    if (typeof createLoadingComponent === 'function') {
        _componentRegistry.register('loading', createLoadingComponent());
    }
    if (typeof createModalComponent === 'function') {
        _componentRegistry.register('modal', createModalComponent());
    }
    
    // Congela os helpers injetados antes do bootstrap
    const _helpers = Object.freeze({
        currency: typeof CurrencyHelper !== 'undefined' ? Object.freeze(CurrencyHelper) : {},
        date: typeof DateHelper !== 'undefined' ? Object.freeze(DateHelper) : {},
        validation: typeof ValidationHelper !== 'undefined' ? Object.freeze(ValidationHelper) : {},
        string: typeof StringHelper !== 'undefined' ? Object.freeze(StringHelper) : {}
    });

    // 2. Travar a infraestrutura na Window (Fonte Única de Verdade)
    Object.defineProperties(window.RiverCore, {
        getEventBus: {
            value: () => _eventBus,
            writable: false,
            configurable: false
        },
        getModules: {
            value: () => _registry,
            writable: false,
            configurable: false
        },
        getConfig: {
            value: () => _configManager,
            writable: false,
            configurable: false
        },
        Helpers: {
            value: _helpers,
            writable: false,
            configurable: false
        },
        Components: {
            value: _componentRegistry,
            writable: false,
            configurable: false
        }
    });

    // 3. Sinaliza conclusão
    _eventBus.emit('core.bootstrap_complete', { timestamp: Date.now() });
    
    console.log('[River Core] Bootstrap concluído: EventBus, ConfigManager e ModuleRegistry ativos e protegidos.');
})();
