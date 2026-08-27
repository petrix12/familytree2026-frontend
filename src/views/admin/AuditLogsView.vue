<template>
    <div class="p-6 max-w-7xl mx-auto space-y-6">
        <!-- Botón de retorno al Panel Admin -->
        <div class="mb-6">
            <router-link 
                to="/admin" 
                class="inline-flex items-center space-x-2 text-sm text-yellow-400 hover:text-yellow-300 transition-colors group"
            >
                <ChevronLeftIcon class="w-4 h-4 transform group-hover:-translate-x-1 transition-transform" />
                <span>Volver al Panel Admin</span>
            </router-link>
        </div>
        <!-- Header -->
        <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
                <h1 class="text-2xl font-bold text-slate-800 dark:text-slate-100">Auditoría y Registros del Sistema</h1>
                <p class="text-sm text-slate-500 dark:text-slate-400">Historial detallado de actividad y acciones ejecutadas.</p>
            </div>
            <button 
                @click="fetchLogs" 
                class="inline-flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-sm font-medium transition-colors w-fit"
            >
                <span>Refrescar</span>
            </button>
        </div>

        <!-- Filtros -->
        <div class="bg-white dark:bg-slate-800/60 p-4 rounded-2xl border border-slate-200 dark:border-slate-700/60 shadow-sm grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
                <label class="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1">Buscar</label>
                <input 
                    v-model="filters.search" 
                    @input="debounceSearch"
                    type="text" 
                    placeholder="Acción, usuario, email..." 
                    class="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
            </div>

            <div>
                <label class="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1">Entidad</label>
                <select 
                    v-model="filters.entity" 
                    @change="fetchLogs"
                    class="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                <option value="">Todas</option>
                <option value="User">Usuario</option>
                <option value="Person">Persona / Árbol</option>
                <option value="Auth">Autenticación</option>
                <option value="System">Sistema</option>
                </select>
            </div>

            <div>
                <label class="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1">Desde</label>
                <input 
                v-model="filters.startDate" 
                @change="fetchLogs"
                type="date" 
                class="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
            </div>

            <div>
                <label class="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1">Hasta</label>
                <input 
                    v-model="filters.endDate" 
                    @change="fetchLogs"
                    type="date" 
                    class="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
            </div>
        </div>

        <!-- Tabla -->
        <div class="bg-white dark:bg-slate-800/60 rounded-2xl border border-slate-200 dark:border-slate-700/60 shadow-sm overflow-hidden">
            <div class="overflow-x-auto">
                <table class="w-full text-left text-sm">
                    <thead class="bg-slate-50 dark:bg-slate-900/50 text-slate-500 dark:text-slate-400 uppercase text-[11px] font-semibold tracking-wider border-b border-slate-200 dark:border-slate-700">
                        <tr>
                        <th class="py-3 px-4">Fecha / Hora</th>
                        <th class="py-3 px-4">Usuario</th>
                        <th class="py-3 px-4">Acción</th>
                        <th class="py-3 px-4">Entidad</th>
                        <th class="py-3 px-4">IP</th>
                        <th class="py-3 px-4 text-right">Detalles</th>
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-slate-100 dark:divide-slate-700/50 text-slate-700 dark:text-slate-300">
                        <tr v-if="loading">
                        <td colspan="6" class="text-center py-8 text-slate-400">Cargando registros...</td>
                        </tr>
                        <tr v-else-if="logs.length === 0">
                        <td colspan="6" class="text-center py-8 text-slate-400">No se encontraron eventos.</td>
                        </tr>
                        <tr v-for="log in logs" :key="log.id" class="hover:bg-slate-50/50 dark:hover:bg-slate-700/30 transition-colors">
                        <td class="py-3 px-4 font-mono text-xs whitespace-nowrap">{{ formatDate(log.createdAt) }}</td>
                        <td class="py-3 px-4">
                            <div v-if="log.user" class="flex flex-col">
                                <span class="font-medium text-slate-900 dark:text-white">{{ log.user.name }}</span>
                                <span class="text-xs text-slate-400">{{ log.user.email }}</span>
                            </div>
                            <span v-else class="text-xs text-slate-400 italic">Sistema / Anónimo</span>
                        </td>
                        <td class="py-3 px-4 font-semibold text-slate-800 dark:text-slate-200">{{ log.action }}</td>
                        <td class="py-3 px-4">
                            <span :class="getEntityBadgeClass(log.entity)" class="px-2.5 py-1 text-[11px] font-semibold rounded-lg border">
                                {{ log.entity }}
                            </span>
                        </td>
                        <td class="py-3 px-4 font-mono text-xs text-slate-400">{{ log.ipAddress || 'N/A' }}</td>
                        <td class="py-3 px-4 text-right">
                            <button 
                                v-if="log.details" 
                                @click="openDetailsModal(log)" 
                                class="text-xs text-emerald-600 dark:text-emerald-400 hover:underline font-medium"
                            >
                                Ver JSON
                            </button>
                            <span v-else class="text-xs text-slate-400">-</span>
                        </td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <!-- Paginación -->
            <div class="flex items-center justify-between px-4 py-3 bg-slate-50 dark:bg-slate-900/40 border-t border-slate-200 dark:border-slate-700">
                <span class="text-xs text-slate-500 dark:text-slate-400">
                    Mostrando página {{ pagination.page }} de {{ pagination.totalPages }} ({{ pagination.total }} registros)
                </span>
                <div class="flex gap-2">
                    <button 
                        :disabled="pagination.page <= 1" 
                        @click="changePage(pagination.page - 1)" 
                        class="px-3 py-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-medium disabled:opacity-40"
                    >
                        Anterior
                    </button>
                    <button 
                        :disabled="pagination.page >= pagination.totalPages" 
                        @click="changePage(pagination.page + 1)" 
                        class="px-3 py-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-medium disabled:opacity-40"
                    >
                        Siguiente
                    </button>
                </div>
            </div>
        </div>

        <!-- Modal de Detalles JSON -->
        <div v-if="selectedLogModal" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
            <div class="bg-white dark:bg-slate-800 rounded-2xl p-6 max-w-lg w-full shadow-2xl border border-slate-200 dark:border-slate-700 space-y-4">
                <h3 class="text-lg font-bold text-slate-900 dark:text-white">Detalles del Evento</h3>
                <p class="text-xs text-slate-400 font-mono">{{ selectedLogModal.action }} - {{ formatDate(selectedLogModal.createdAt) }}</p>
                
                <div class="bg-slate-950 p-4 rounded-xl text-emerald-400 font-mono text-xs overflow-x-auto max-h-80">
                    <pre>{{ JSON.stringify(selectedLogModal.details, null, 2) }}</pre>
                </div>

                <div class="flex justify-end">
                    <button 
                        @click="selectedLogModal = null" 
                        class="px-4 py-2 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold rounded-xl hover:bg-slate-200 transition-colors"
                    >
                        Cerrar
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
    import { ChevronLeftIcon } from '@heroicons/vue/24/outline';
    import { ref, onMounted } from 'vue';
    import { adminService } from '@/services/admin.service';

    const logs = ref([]);
    const loading = ref(false);
    const selectedLogModal = ref(null);

    const filters = ref({
        search: '',
        entity: '',
        startDate: '',
        endDate: '',
    });

    const pagination = ref({
        page: 1,
        total: 0,
        totalPages: 1,
    });

    const fetchLogs = async () => {
        loading.value = true;
        try {
            const response = await adminService.getAuditLogs({
                page: pagination.value.page,
                limit: 15,
                ...filters.value,
            });

            // Desempaquetado seguro compatible con la estructura de Axios y tu Backend
            const resData = response.data?.data || response.data || {};
            logs.value = resData.logs || [];
            pagination.value = resData.pagination || { page: 1, total: 0, totalPages: 1 };
        } catch (error) {
            console.error('Error cargando logs:', error);
            logs.value = [];
        } finally {
            loading.value = false;
        }
    };

    let searchTimeout = null;
    const debounceSearch = () => {
        clearTimeout(searchTimeout);
        searchTimeout = setTimeout(() => {
            pagination.value.page = 1;
            fetchLogs();
        }, 400);
    };

    const changePage = (newPage) => {
        pagination.value.page = newPage;
        fetchLogs();
    };

    const openDetailsModal = (log) => {
        selectedLogModal.value = log;
    };

    const getEntityBadgeClass = (entity) => {
        switch (entity) {
            case 'User': return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
            case 'Person': return 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20';
            case 'Auth': return 'bg-amber-500/10 text-amber-500 border-amber-500/20';
            default: return 'bg-slate-500/10 text-slate-400 border-slate-500/20';
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        return new Date(dateString).toLocaleString('es-ES', {
            dateStyle: 'short',
            timeStyle: 'medium',
        });
    };

    onMounted(() => {
        fetchLogs();
    });
</script>