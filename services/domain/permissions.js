/**
 * River Core - Domain: Permissions Service
 * Centraliza verificação de regras de acesso e permissões (RBAC).
 */
class PermissionsService {
    constructor({ database, eventBus }) {
        this.db = database;
        this.eventBus = eventBus;
    }

    hasRole(userProfile, expectedRole) {
        if (!userProfile) return false;
        return userProfile.cargo === expectedRole;
    }

    canAccessModule(tenantModules, moduleName) {
        if (!tenantModules || !Array.isArray(tenantModules)) return false;
        return tenantModules.includes(moduleName);
    }
}
