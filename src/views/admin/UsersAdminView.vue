<template>
    <!-- 
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8"> -->
    <div class="min-h-screen bg-slate-900 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <!-- Encabezado -->
        <div class="md:flex md:items-center md:justify-between mb-8">
            <div class="flex-1 min-w-0">
                <h1 class="text-2xl font-bold text-slate-900 dark:text-white">Gestión de Usuarios</h1>
                <p class="mt-1 text-sm text-slate-500 dark:text-slate-400">Administra los permisos y accesos de la plataforma en tiempo real.</p>                
            </div>
        </div>

        <!-- Barra de Búsqueda y Filtros -->
        <div class="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm rounded-2xl p-4 mb-6">
            <div class="relative">
                <input
                    v-model="searchQuery"
                    @input="handleSearch"
                    type="text"
                    placeholder="Buscar por nombre o correo electrónico..."
                    class="w-full bg-slate-50 dark:bg-slate-900/50 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-600 rounded-lg px-10 py-2.5 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-shadow"
                />
                <svg
                    class="w-5 h-5 text-slate-400 absolute left-3 top-3"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
            </div>
        </div>

        <!-- Tabla de Usuarios -->
        <div class="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl shadow-sm overflow-hidden">
            <div v-if="loading" class="p-12 text-center text-slate-500 dark:text-slate-400">
                <span class="animate-spin inline-block w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full mb-2"></span>
                <p>Cargando usuarios...</p>
            </div>

            <div v-else-if="users.length === 0" class="p-12 text-center text-slate-500 dark:text-slate-400">
                No se encontraron usuarios que coincidan con la búsqueda.
            </div>

            <table v-else class="min-w-full divide-y divide-slate-200 dark:divide-slate-700">
                <thead class="bg-slate-50 dark:bg-slate-900/50">
                    <tr>
                        <th class="px-6 py-4 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Usuario</th>
                        <th class="px-6 py-4 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Roles Asignados</th>
                        <th class="px-6 py-4 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Fecha Registro</th>
                        <th class="px-6 py-4 text-right text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Acciones</th>
                    </tr>
                </thead>
                <tbody class="divide-y divide-slate-200 dark:divide-slate-700">
                    <tr v-for="user in users" :key="user.id" class="hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors">
                        <!-- Info Usuario -->
                        <td class="px-6 py-4 whitespace-nowrap">
                            <div class="flex items-center">
                                <div class="w-10 h-10 rounded-full bg-emerald-100 dark:bg-slate-700 flex items-center justify-center font-bold text-emerald-600 dark:text-emerald-400 uppercase border border-emerald-200 dark:border-slate-600">
                                    {{ user.name ? user.name.charAt(0) : 'U' }}
                                </div>
                                <div class="ml-4">
                                    <div class="text-sm font-medium text-slate-900 dark:text-slate-200">{{ user.name }}</div>
                                    <div class="text-sm text-slate-500 dark:text-slate-400">{{ user.email }}</div>
                                </div>
                            </div>
                        </td>

                        <!-- Badges de Roles -->
                        <td class="px-6 py-4 whitespace-nowrap">
                            <div class="flex flex-wrap gap-1.5">
                                <span
                                    v-for="role in user.roles"
                                    :key="role"
                                    :class="getRoleBadgeClass(role)"
                                    class="px-2.5 py-0.5 rounded-full text-xs font-semibold border"
                                >
                                    {{ role }}
                                </span>
                                <span v-if="user.roles.length === 0" class="px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-slate-600">
                                    Sin permisos (Guest)
                                </span>
                            </div>
                        </td>

                        <!-- Fecha -->
                        <td class="px-6 py-4 whitespace-nowrap text-sm text-slate-500 dark:text-slate-400">
                            {{ formatDate(user.createdAt) }}
                        </td>

                        <!-- Acciones -->
                        <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <button
                                @click="openRoleModal(user)"
                                class="px-3 py-1.5 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/30 hover:bg-emerald-600 hover:text-white dark:hover:bg-emerald-500 dark:hover:text-white rounded-lg transition-all"
                            >
                                Editar Roles
                            </button>
                        </td>
                    </tr>
                </tbody>
            </table>

            <!-- Paginación -->
            <div v-if="pagination.totalPages > 1" class="px-6 py-4 bg-slate-50 dark:bg-slate-900/40 border-t border-slate-200 dark:border-slate-700 flex items-center justify-between">
                <span class="text-sm text-slate-500 dark:text-slate-400">
                    Página {{ pagination.page }} de {{ pagination.totalPages }}
                </span>
                <div class="flex gap-2">
                    <button
                        :disabled="pagination.page === 1"
                        @click="changePage(pagination.page - 1)"
                        class="px-3 py-1 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                        Anterior
                    </button>
                    <button
                        :disabled="pagination.page === pagination.totalPages"
                        @click="changePage(pagination.page + 1)"
                        class="px-3 py-1 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                        Siguiente
                    </button>
                </div>
            </div>
        </div>

        <!-- Modal de Asignación de Roles -->
        <div v-if="selectedUser" class="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 dark:bg-black/70 backdrop-blur-sm">
            <div class="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl w-full max-w-md p-6 shadow-2xl">
                <h3 class="text-xl font-bold text-slate-900 dark:text-slate-100 mb-1">Gestionar Roles</h3>
                <p class="text-sm text-slate-500 dark:text-slate-400 mb-4">
                    Modificando permisos para <span class="text-emerald-600 dark:text-emerald-400 font-semibold">{{ selectedUser.name }}</span>
                </p>

                <div class="space-y-3 mb-6">
                    <label v-for="role in availableRoles" :key="role" class="flex items-center space-x-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 cursor-pointer hover:border-emerald-300 dark:hover:border-slate-500 transition-colors">
                        <input
                            type="checkbox"
                            :value="role"
                            v-model="modalRoles"
                            class="w-4 h-4 text-emerald-600 bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-600 rounded focus:ring-emerald-500"
                        />
                        <span class="text-sm font-medium text-slate-700 dark:text-slate-200">{{ role }}</span>
                    </label>
                </div>

                <div class="flex justify-end gap-3">
                    <button
                        @click="selectedUser = null"
                        class="px-4 py-2 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 font-medium rounded-xl transition-colors"
                    >
                        Cancelar
                    </button>
                    <button
                        @click="saveUserRoles"
                        :disabled="saving"
                        class="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-medium rounded-xl disabled:opacity-50 transition-colors"
                    >
                        {{ saving ? 'Guardando...' : 'Guardar Cambios' }}
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
    import { ref, onMounted } from 'vue';
    import { adminService } from '../../services/admin.service';

    // --- ESTADOS GENERALES Y TABLA ---
    const users = ref([]);
    const loading = ref(true);
    const saving = ref(false);
    const searchQuery = ref('');
    const pagination = ref({ page: 1, totalPages: 1, total: 0 });
    let searchTimeout = null;

    // --- ESTADOS PARA EDICIÓN DE ROLES ---
    const selectedUser = ref(null);
    const modalRoles = ref([]);
    const availableRoles = ['SUPER_ADMIN', 'ADMIN', 'USER'];

    // --- ESTADOS PARA EDICIÓN DE DATOS PERSONALES (NUEVO) ---
    const editingUser = ref(null);
    const userForm = ref({ name: '', email: '' });

    // --- LÓGICA DE CARGA Y BÚSQUEDA ---
    const fetchUsers = async (page = 1) => {
        loading.value = true;
        try {
            const res = await adminService.getUsers({
                search: searchQuery.value,
                page,
                limit: 10,
            });
            users.value = res.data.users;
            pagination.value = res.data.pagination;
        } catch (err) {
            console.error('Error al cargar usuarios:', err);
        } finally {
            loading.value = false;
        }
    };

    const handleSearch = () => {
        clearTimeout(searchTimeout);
        searchTimeout = setTimeout(() => {
            fetchUsers(1);
        }, 300);
    };

    const changePage = (newPage) => {
        fetchUsers(newPage);
    };

    // --- LÓGICA DE ROLES ---
    const openRoleModal = (user) => {
        selectedUser.value = user;
        modalRoles.value = [...user.roles];
    };

    const saveUserRoles = async () => {
        if (!selectedUser.value) return;
        saving.value = true;
        try {
            await adminService.updateUserRoles(selectedUser.value.id, modalRoles.value);
            selectedUser.value.roles = [...modalRoles.value];
            selectedUser.value = null;
        } catch (err) {
            alert('Error al guardar los roles');
        } finally {
            saving.value = false;
        }
    };

    // --- LÓGICA DE DATOS PERSONALES (NUEVO) ---
    const openEditModal = (user) => {
        editingUser.value = user;
        userForm.value = { name: user.name, email: user.email };
    };

    const saveUserData = async () => {
        if (!editingUser.value) return;
        saving.value = true;
        try {
            const res = await adminService.updateUser(editingUser.value.id, userForm.value);
            
            // Actualiza de inmediato la fila en la reactividad local de Vue
            editingUser.value.name = res.data.user.name;
            editingUser.value.email = res.data.user.email;
            
            editingUser.value = null;
        } catch (err) {
            alert(err.response?.data?.message || 'Error al actualizar el usuario');
        } finally {
            saving.value = false;
        }
    };

    // --- UTILITIES DE FORMATO Y ESTILOS ---
    const getRoleBadgeClass = (role) => {
        switch (role) {
            case 'SUPER_ADMIN':
                return 'bg-purple-900/40 text-purple-300 border-purple-500/30';
            case 'ADMIN':
                return 'bg-blue-900/40 text-blue-300 border-blue-500/30';
            default:
                return 'bg-emerald-900/40 text-emerald-300 border-emerald-500/30';
        }
    };

    const formatDate = (dateStr) => {
        return new Date(dateStr).toLocaleDateString('es-ES', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
        });
    };

    onMounted(() => {
        fetchUsers();
    });   
</script>