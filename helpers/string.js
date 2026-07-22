/**
 * River Core - String Helper
 * Funções puras para manipulação de strings.
 */
const StringHelper = {
    capitalize(str) {
        if (!str || typeof str !== 'string') return '';
        return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
    },

    generateSlug(str) {
        if (!str || typeof str !== 'string') return '';
        return str
            .normalize('NFD') // Normaliza acentos
            .replace(/[\u0300-\u036f]/g, '') // Remove acentos
            .toLowerCase()
            .trim()
            .replace(/[^a-z0-9\s-]/g, '') // Remove caracteres especiais
            .replace(/[\s_-]+/g, '-') // Substitui espaços por traço
            .replace(/^-+|-+$/g, ''); // Remove traços do início/fim
    }
};
