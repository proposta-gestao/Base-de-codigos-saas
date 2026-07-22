/**
 * River Core - View Loader
 * Entry point universal. Instancia a view declarada no HTML e executa seu lifecycle.
 * O HTML deve ter <body data-view="nome-da-view">
 */
document.addEventListener('DOMContentLoaded', async () => {
    // 1. Aguarda bootstrap principal
    if (typeof RiverCore === 'undefined' || !RiverCore.Views) {
        console.warn('RiverCore não está carregado corretamente.');
        return;
    }

    // 2. Identifica a View da página atual
    const rootElement = document.body;
    const viewName = rootElement.getAttribute('data-view');

    if (!viewName) {
        console.warn('Nenhuma view declarada no atributo [data-view] do body.');
        return;
    }

    if (!RiverCore.Views.has(viewName)) {
        console.warn(`View '${viewName}' declarada no HTML, mas não registrada no ViewRegistry.`);
        return;
    }

    // 3. Monta o Contexto Isolado
    const context = {
        services: RiverCore.Services,
        components: RiverCore.Components,
        eventBus: RiverCore.EventBus,
        config: RiverCore.Config,
        rootElement: rootElement
    };

    // 4. Inicia Lifecycle
    try {
        const viewInstance = RiverCore.Views.create(viewName, context);
        
        if (typeof viewInstance.mount === 'function') {
            viewInstance.mount();
        }
        
        if (typeof viewInstance.load === 'function') {
            await viewInstance.load();
        }
        
        if (typeof viewInstance.render === 'function') {
            viewInstance.render();
        }
        
        RiverCore.EventBus.emit('core.view_loaded', { view: viewName });
    } catch (error) {
        console.error(`Falha no Lifecycle da view '${viewName}':`, error);
    }
});
