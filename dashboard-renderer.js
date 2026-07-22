/**
 * River Core - Dashboard Renderer
 * Gerencia regiões do layout e orquestra a renderização de widgets.
 * Agnóstico: Não conhece regras de negócio, Supabase ou módulos.
 */
class DashboardRenderer {
    constructor(eventBus) {
        this.eventBus = eventBus;
        this.regions = new Map(); // id -> HTMLElement container
        this.widgets = new Map(); // id -> configuração do widget
    }

    /**
     * Registra uma região no DOM onde widgets podem ser renderizados.
     */
    registerRegion(id, containerElement) {
        if (!id || !(containerElement instanceof HTMLElement)) {
            throw new Error('registerRegion requires a valid id and a DOM HTMLElement');
        }
        this.regions.set(id, containerElement);
    }

    /**
     * Contrato do Widget:
     * Obrigatório: id (string), region (string), render (function)
     * Opcional: destroy (function), priority (number - default 50), permissions (array), dependencies (array)
     */
    registerWidget(widgetConfig) {
        if (!widgetConfig.id || !widgetConfig.region || typeof widgetConfig.render !== 'function') {
            throw new Error('Invalid widget contract. Required: id, region, render(container)');
        }
        
        const widget = {
            priority: 50, // Padrão
            ...widgetConfig
        };
        
        this.widgets.set(widget.id, widget);
        
        if (this.eventBus) {
            this.eventBus.emit('dashboard.widget.registered', { id: widget.id, region: widget.region });
        }
    }

    unregisterWidget(id) {
        const widget = this.widgets.get(id);
        if (widget && typeof widget.destroy === 'function') {
            try {
                widget.destroy();
            } catch (err) {
                console.error(`Error destroying widget ${id}:`, err);
            }
        }
        this.widgets.delete(id);
    }

    getWidget(id) {
        return this.widgets.get(id);
    }

    /**
     * Lista widgets, opcionalmente filtrando por região. 
     * Ordena sempre pela prioridade (maior renderiza primeiro).
     */
    listWidgets(regionId = null) {
        let allWidgets = Array.from(this.widgets.values());
        
        if (regionId) {
            allWidgets = allWidgets.filter(w => w.region === regionId);
        }
        
        // Prioridade DESC (maior primeiro)
        return allWidgets.sort((a, b) => b.priority - a.priority);
    }

    /**
     * Renderiza todos os widgets registrados para uma região específica.
     */
    async renderRegion(regionId) {
        const container = this.regions.get(regionId);
        if (!container) {
            console.warn(`Region '${regionId}' not registered. Cannot render widgets.`);
            return;
        }

        // Limpa o container (ciclo de vida de montagem simples por enquanto)
        container.innerHTML = '';
        
        const regionWidgets = this.listWidgets(regionId);
        for (const widget of regionWidgets) {
            try {
                // Cria um wrapper para isolar o DOM do widget
                const widgetWrapper = document.createElement('div');
                widgetWrapper.id = `river-widget-${widget.id}`;
                widgetWrapper.className = 'river-widget';
                container.appendChild(widgetWrapper);
                
                await widget.render(widgetWrapper);
            } catch (error) {
                console.error(`Error rendering widget '${widget.id}':`, error);
                if (this.eventBus) {
                    this.eventBus.emit('dashboard.widget.error', { id: widget.id, error });
                }
            }
        }
    }

    /**
     * Renderiza todas as regiões registradas.
     */
    async renderAll() {
        const regionsKeys = Array.from(this.regions.keys());
        for (const regionId of regionsKeys) {
            await this.renderRegion(regionId);
        }
        
        if (this.eventBus) {
            this.eventBus.emit('dashboard.render.completed', { regions: regionsKeys });
        }
    }
}
