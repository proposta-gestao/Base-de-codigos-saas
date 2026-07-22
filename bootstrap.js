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

    // Configura e Registra Serviços
    const _serviceRegistry = new ServiceRegistry();
    
    // 1. Infraestrutura
    const dbAdapter = typeof DatabaseAdapter !== 'undefined' ? new DatabaseAdapter({ config: _configManager, eventBus: _eventBus }) : null;
    const authAdapter = typeof AuthAdapter !== 'undefined' ? new AuthAdapter({ config: _configManager, eventBus: _eventBus }) : null;
    const storageAdapter = typeof StorageAdapter !== 'undefined' ? new StorageAdapter({ config: _configManager, eventBus: _eventBus }) : null;
    
    if (dbAdapter) _serviceRegistry.register('database', dbAdapter);
    if (authAdapter) _serviceRegistry.register('auth', authAdapter);
    if (storageAdapter) _serviceRegistry.register('storage', storageAdapter);

    // 2. Domínios (Injetando a infraestrutura que precisam)
    if (typeof TenantService !== 'undefined' && dbAdapter) {
        _serviceRegistry.register('tenant', new TenantService({ database: dbAdapter, eventBus: _eventBus }));
    }
    if (typeof UsersService !== 'undefined' && dbAdapter) {
        _serviceRegistry.register('users', new UsersService({ database: dbAdapter, eventBus: _eventBus }));
    }
    if (typeof PermissionsService !== 'undefined' && dbAdapter) {
        _serviceRegistry.register('permissions', new PermissionsService({ database: dbAdapter, eventBus: _eventBus }));
    }
    
    // Configura Dashboard Renderer
    const _dashboardRenderer = typeof DashboardRenderer !== 'undefined' ? new DashboardRenderer(_eventBus) : null;
    
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
        },
        Services: {
            value: _serviceRegistry,
            writable: false,
            configurable: false
        },
        Dashboard: {
            value: _dashboardRenderer,
            writable: false,
            configurable: false
        }
    });

    // 3. Inicializar configurações (Legado -> Core)
    _eventBus.emit('core.bootstrap_complete', { timestamp: Date.now() });
    
    console.log('[River Core] Bootstrap concluído: EventBus, ConfigManager e ModuleRegistry ativos e protegidos.');
})();
