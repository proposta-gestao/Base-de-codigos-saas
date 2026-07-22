/**
 * River Core - Validation Helper
 * Funções puras e genéricas de validação (independente de regra de negócio).
 */
const ValidationHelper = {
    isEmail(email) {
        if (!email || typeof email !== 'string') return false;
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email.trim());
    },

    isEmpty(value) {
        if (value === null || value === undefined) return true;
        if (typeof value === 'string') return value.trim().length === 0;
        if (Array.isArray(value)) return value.length === 0;
        if (typeof value === 'object') return Object.keys(value).length === 0;
        return false;
    },

    isString(value) {
        return typeof value === 'string';
    },

    isNumber(value) {
        if (typeof value === 'number') return !isNaN(value);
        if (typeof value === 'string' && value.trim() !== '') {
            return !isNaN(Number(value));
        }
        return false;
    }
};
