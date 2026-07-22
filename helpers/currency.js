/**
 * River Core - Currency Helper
 * Funções puras para manipulação e formatação de valores monetários.
 */
const CurrencyHelper = {
    /**
     * Formata um número para string de moeda.
     */
    format(value, locale = 'pt-BR', currency = 'BRL') {
        const num = Number(value);
        if (isNaN(num)) return new Intl.NumberFormat(locale, { style: 'currency', currency }).format(0);
        return new Intl.NumberFormat(locale, { style: 'currency', currency }).format(num);
    },
    
    /**
     * Converte uma string monetária (ex: "R$ 1.500,00") para número puro (1500.00).
     */
    parse(stringValue) {
        if (!stringValue && stringValue !== 0) return 0;
        if (typeof stringValue === 'number') return stringValue;
        
        // Remove tudo que não for dígito, vírgula ou sinal de menos
        const cleaned = stringValue.toString().replace(/[^\d,-]/g, '').replace(',', '.');
        const num = Number(cleaned);
        
        return isNaN(num) ? 0 : num;
    }
};
