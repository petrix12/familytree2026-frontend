import api from '@/api/axios';

export const rolesService = {
    async getRoles() {
        const response = await api.get('/admin/roles');
        return response.data;
    },

    async getPermissions() {
        const response = await api.get('/admin/permissions');
        return response.data;
    },

    async createRole(roleData) {
        const response = await api.post('/admin/roles', roleData);
        return response.data;
    },

    async updateRole(roleId, roleData) {
        const response = await api.put(`/admin/roles/${roleId}`, roleData);
        return response.data;
    },

    async deleteRole(roleId) {
        const response = await api.delete(`/admin/roles/${roleId}`);
        return response.data;
    }
};