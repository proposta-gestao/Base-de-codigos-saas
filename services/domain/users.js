/**
 * River Core - Domain: Users Service
 * Gerencia a lógica de negócio dos usuários (clientes e funcionários).
 */
class UsersService {
    constructor({ database, eventBus }) {
        this.db = database;
        this.eventBus = eventBus;
    }

    async getUserByAuthId(authId) {
        const result = await this.db.query('atendentes', '*', { auth_id: authId });
        
        if (result.success && result.data && result.data.length > 0) {
            return { data: result.data[0], error: null, success: true };
        }
        
        return { data: null, error: 'User not found in system', success: false };
    }

    async createUserProfile(payload) {
        return await this.db.insert('atendentes', payload);
    }
}
