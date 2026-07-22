/**
 * River Core - Domain: Tenant Service
 * Gerencia lógica de negócio relacionada a Inquilinos (Empresas).
 */
class TenantService {
    constructor({ database, eventBus }) {
        this.db = database;
        this.eventBus = eventBus;
    }

    async getTenantByDomain(domainUrl) {
        const result = await this.db.query('empresas', '*', { url_dominio: domainUrl });
        
        if (result.success && result.data && result.data.length > 0) {
            return { data: result.data[0], error: null, success: true };
        }
        
        // Logica de dominio especifica: se nao achou, dispara evento avisando
        this.eventBus.emit('domain.tenant.not_found', { domainUrl });
        return { data: null, error: 'Tenant not found', success: false };
    }

    async updateTenantConfig(tenantId, payload) {
        return await this.db.update('empresas', { id: tenantId }, payload);
    }
}
