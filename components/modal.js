/**
 * River Core - Modal Component
 * Gerencia instâncias de janelas modais.
 */
function createModalComponent() {
    // Mantém o estado interno de modais ativas
    const activeModals = new Set();

    return {
        open(id) {
            if (!id) throw new Error('Modal ID is required');
            if (activeModals.has(id)) return; // Já está aberta

            const modalEl = document.getElementById(id);
            if (!modalEl) {
                console.warn(`Modal with ID '${id}' not found in DOM`);
                return;
            }

            modalEl.classList.add('river-modal-open');
            activeModals.add(id);
        },

        close(id) {
            if (!id) throw new Error('Modal ID is required');
            
            const modalEl = document.getElementById(id);
            if (modalEl) {
                modalEl.classList.remove('river-modal-open');
            }
            activeModals.delete(id);
        },
        
        closeAll() {
            activeModals.forEach(id => this.close(id));
        },

        destroy(id) {
            this.close(id);
            const modalEl = document.getElementById(id);
            if (modalEl && modalEl.parentNode) {
                modalEl.parentNode.removeChild(modalEl);
            }
        },

        isOpen(id) {
            return activeModals.has(id);
        }
    };
}
