/**
 * River Core - Date Helper
 * Funções puras para manipulação e formatação de datas.
 */
const DateHelper = {
    /**
     * Retorna a data formato DD/MM/YYYY
     */
    formatDateBR(dateString) {
        if (!dateString) return '';
        const d = new Date(dateString);
        if (isNaN(d.getTime())) return '';
        return new Intl.DateTimeFormat('pt-BR', { timeZone: 'America/Sao_Paulo' }).format(d);
    },

    /**
     * Retorna a data no formato YYYY-MM-DD
     */
    formatDateISO(dateString) {
        if (!dateString) return '';
        const d = new Date(dateString);
        if (isNaN(d.getTime())) return '';
        return d.toISOString().split('T')[0];
    },

    /**
     * Retorna o formato YYYY-MM-DD HH:MM:SS
     */
    formatDateTimeISO(dateString) {
        if (!dateString) return '';
        const d = new Date(dateString);
        if (isNaN(d.getTime())) return '';
        return d.toISOString().replace('T', ' ').substring(0, 19);
    }
};
