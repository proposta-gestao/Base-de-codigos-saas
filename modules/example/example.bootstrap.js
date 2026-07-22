/**
 * Bootstrap de testes do Example Module
 * Registra e inicializa o módulo e configura a região de teste no dashboard.
 */
document.addEventListener('DOMContentLoaded', () => {
    // 1. Aguardar inicialização do RiverCore e do View (view-loader.js roda no DOMContentLoaded)
    setTimeout(() => {
        if (typeof RiverCore === 'undefined') {
            console.error('[Example Bootstrap] RiverCore não encontrado.');
            return;
        }

        const registry = RiverCore.getModules ? RiverCore.getModules() : RiverCore.Modules;
        if (!registry) {
             console.error('[Example Bootstrap] ModuleRegistry não encontrado.');
             return;
        }

        console.log('[Example Bootstrap] Registrando módulo example.module...');
        
        try {
            // Acessa a variável exportada pelo example.module.js
            registry.registerModule(ExampleModule);
            
            // Registra região dummy no dashboard (em um cenário real seria na view)
            // Vamos testar se existe uma div id="dashboard-main"
            let mainContainer = document.getElementById('dashboard-main');
            
            // Se não existir (estamos testando no admin-saas.html atual), criamos uma div fixa por cima de tudo para testar
            if (!mainContainer) {
                mainContainer = document.createElement('div');
                mainContainer.id = 'dashboard-main';
                mainContainer.style.position = 'fixed';
                mainContainer.style.top = '100px';
                mainContainer.style.right = '20px';
                mainContainer.style.width = '300px';
                mainContainer.style.zIndex = '9999';
                document.body.appendChild(mainContainer);
            }

            RiverCore.Dashboard.registerRegion('main', mainContainer);

            // Inicializa módulo
            registry.initializeModule('example.module');

            // Manda renderizar a região
            RiverCore.Dashboard.renderRegion('main');
            
            console.log('[Example Bootstrap] Validação completa.');
        } catch (error) {
            console.error('[Example Bootstrap] Falha no ciclo de vida:', error);
        }
    }, 100); // pequeno timeout para rodar após loaders
});
