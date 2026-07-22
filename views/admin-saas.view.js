/**
 * Exemplo/POC do novo ViewController para Admin SaaS
 * Apenas implementando a estrutura. Não migrando a lógica antiga ainda.
 */
class AdminSaasViewController {
    constructor(context) {
        // Recebendo dependências via composição (Context)
        this.ctx = context; 
        
        // Exemplo: listeners que precisaremos limpar no destroy()
        this._boundHandleClick = this.handleClick.bind(this);
    }

    /**
     * 1. mount: Atrelar eventos no DOM do rootElement, preparar UI vazia.
     */
    mount() {
        console.log('[AdminSaasView] Mount phase');
        // Usar this.ctx.rootElement ao invés de document
        const btn = this.ctx.rootElement.querySelector('#btn-teste-view');
        if (btn) {
            btn.addEventListener('click', this._boundHandleClick);
        }
    }

    /**
     * 2. load: Buscar dados de serviços (sem acessar Supabase direto).
     */
    async load() {
        console.log('[AdminSaasView] Load phase (Simulando API...)');
        // Exemplo: await this.ctx.services.get('tenant').getTenantByDomain(...)
    }

    /**
     * 3. render: Refletir os dados na UI (manipular DOM).
     */
    render() {
        console.log('[AdminSaasView] Render phase');
    }

    /**
     * 4. destroy: Limpeza de memória, remoção de listeners.
     */
    destroy() {
        console.log('[AdminSaasView] Destroy phase');
        const btn = this.ctx.rootElement.querySelector('#btn-teste-view');
        if (btn) {
            btn.removeEventListener('click', this._boundHandleClick);
        }
    }

    handleClick(e) {
        this.ctx.components.get('toast').show('Teste de clique na nova View Architecture!');
    }
}

// O próprio arquivo registra a classe, mas quem cria a instância é o view-loader.js
if (typeof RiverCore !== 'undefined' && RiverCore.Views) {
    RiverCore.Views.register('admin-saas', AdminSaasViewController);
}
