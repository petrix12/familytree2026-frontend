import api from '@/api/axios';

export const adminService = {
    async getUsers(params = {}) {
        const response = await api.get('/admin/users', { params });
        return response.data;
    },

    // Actualizar datos del perfil (nombre y correo)
    async updateUser(userId, userData) {
        const response = await api.put(`/admin/users/${userId}`, userData);
        return response.data;
    },

    async updateUserRoles(userId, roles) {
        const response = await api.put(`/admin/users/${userId}/roles`, { roles });
        return response.data;
    },
};