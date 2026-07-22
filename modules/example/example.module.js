/**
 * Example Module - Plugin System Validation
 * Este módulo não contém regra de negócio real. Serve para validar a arquitetura.
 */
const ExampleModule = {
    id: "example.module",
    name: "Example Module",
    version: "1.0.0",

    initialize(context) {
        console.log('[Example Module] Initializing with context:', context);
        
        // Emissão de evento validando isolamento e acesso ao eventBus
        context.eventBus.emit('example.module.ready', { timestamp: Date.now() });

        // Validação da integração com Dashboard
        if (context.dashboard) {
            context.dashboard.registerWidget({
                id: "example-widget",
                region: "main",
                priority: 10,
                render(container) {
                    console.log('[Example Module] Rendering widget on container:', container);
                    container.innerHTML = `
                        <div style="padding: 20px; background-color: rgba(229, 178, 93, 0.1); border: 1px solid var(--accent-gold); border-radius: 8px; text-align: center;">
                            <h3 style="color: var(--accent-gold); margin: 0 0 10px 0;">Example Module Loaded!</h3>
                            <p style="margin: 0; color: var(--text-secondary);">Isolamento e Injeção de Dependência funcionando.</p>
                        </div>
                    `;
                },
                destroy() {
                    console.log('[Example Module] Widget destroyed');
                }
            });
        } else {
            console.warn('[Example Module] Dashboard não disponível no contexto.');
        }
    },

    destroy() {
        console.log('[Example Module] Destroyed');
        // Limpezas de timers, events seriam feitas aqui
    }
};
