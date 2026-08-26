import api from '@/api/axios';

export const adminService = {
    // Listar usuarios con búsqueda y paginación
    async getUsers(params = {}) {
        const response = await api.get('/admin/users', { params });
        return response.data;
    },

    // Crear un nuevo usuario
    async createUser(userData) {
        const response = await api.post('/admin/users', userData);
        return response.data;
    },

    // Actualizar datos del perfil (nombre y correo)
    async updateUser(userId, userData) {
        const response = await api.put(`/admin/users/${userId}`, userData);
        return response.data;
    },

    // Actualizar roles asignados
    async updateUserRoles(userId, roles) {
        const response = await api.put(`/admin/users/${userId}/roles`, { roles });
        return response.data;
    },

    // Eliminar usuario de la plataforma
    async deleteUser(userId) {
        const response = await api.delete(`/admin/users/${userId}`);
        return response.data;
    }
};