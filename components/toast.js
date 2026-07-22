/**
 * River Core - Toast Component
 * Gerencia notificações temporárias na tela.
 */
function createToastComponent() {
    return {
        show(message, type = 'info', duration = 3000) {
            if (!message) throw new Error('Toast message is required');

            const validTypes = ['info', 'success', 'warning', 'error'];
            if (!validTypes.includes(type)) type = 'info';

            const numDuration = Number(duration);
            if (isNaN(numDuration) || numDuration <= 0) {
                duration = 3000;
            }

            // Garante o container
            let container = document.getElementById('river-toast-container');
            if (!container) {
                container = document.createElement('div');
                container.id = 'river-toast-container';
                container.className = 'river-toast-container';
                document.body.appendChild(container);
            }

            // Cria o Toast
            const toast = document.createElement('div');
            toast.className = `river-toast river-toast-${type}`;
            toast.textContent = message;

            container.appendChild(toast);

            // Animação de entrada
            requestAnimationFrame(() => {
                toast.classList.add('river-toast-show');
            });

            // Remove após a duração
            setTimeout(() => {
                toast.classList.remove('river-toast-show');
                setTimeout(() => {
                    if (toast.parentNode) {
                        toast.parentNode.removeChild(toast);
                    }
                }, 300); // Tempo da transição CSS
            }, duration);
        }
    };
}
