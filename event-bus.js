/**
 * River Core - Event Bus
 * Implementação de um barramento de eventos Pub/Sub genérico e agnóstico de ambiente.
 */
class EventBus {
    constructor() {
        this.events = {};
    }

    /**
     * Inscreve um callback para um evento.
     * @param {string} event - Nome do evento.
     * @param {Function} callback - Função a ser executada.
     */
    on(event, callback) {
        if (!this.events[event]) {
            this.events[event] = [];
        }
        this.events[event].push(callback);
    }

    /**
     * Remove a inscrição de um callback para um evento.
     * @param {string} event - Nome do evento.
     * @param {Function} callback - Função a ser removida.
     */
    off(event, callback) {
        if (!this.events[event]) return;
        this.events[event] = this.events[event].filter(cb => cb !== callback);
    }

    /**
     * Dispara um evento, chamando todos os callbacks inscritos.
     * @param {string} event - Nome do evento.
     * @param {any} [data] - Dados a serem passados para os callbacks.
     */
    emit(event, data) {
        if (!this.events[event]) return;
        this.events[event].forEach(callback => {
            try {
                callback(data);
            } catch (error) {
                console.error(`[EventBus] Erro ao executar callback para o evento "${event}":`, error);
            }
        });
    }

    /**
     * Inscreve um callback para ser executado apenas uma vez.
     * @param {string} event - Nome do evento.
     * @param {Function} callback - Função a ser executada.
     */
    once(event, callback) {
        const wrapper = (data) => {
            callback(data);
            this.off(event, wrapper);
        };
        this.on(event, wrapper);
    }
}
