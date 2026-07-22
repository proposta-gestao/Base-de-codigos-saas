/**
 * River Core - Loading Component
 * Gerencia o bloqueio da tela e spinner de carregamento global.
 */
function createLoadingComponent() {
    let isLoading = false;

    return {
        show(message = 'Carregando...') {
            if (isLoading) return; // Evita múltiplos loadings
            isLoading = true;

            let overlay = document.getElementById('river-loading-overlay');
            if (!overlay) {
                overlay = document.createElement('div');
                overlay.id = 'river-loading-overlay';
                overlay.className = 'river-loading-overlay';
                
                const spinner = document.createElement('div');
                spinner.className = 'river-loading-spinner';
                
                const text = document.createElement('span');
                text.id = 'river-loading-text';
                text.className = 'river-loading-text';
                
                overlay.appendChild(spinner);
                overlay.appendChild(text);
                document.body.appendChild(overlay);
            }

            document.getElementById('river-loading-text').textContent = message;
            overlay.classList.add('river-loading-show');
        },
        
        hide() {
            if (!isLoading) return;
            isLoading = false;
            
            const overlay = document.getElementById('river-loading-overlay');
            if (overlay) {
                overlay.classList.remove('river-loading-show');
            }
        },

        isVisible() {
            return isLoading;
        }
    };
}
