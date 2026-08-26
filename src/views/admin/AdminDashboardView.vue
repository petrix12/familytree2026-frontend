<template>
    <div class="p-6 max-w-7xl mx-auto">
        <!-- Botón de retorno al Dashboard Principal -->
        <div class="mb-6">
            <router-link 
                to="/dashboard" 
                class="inline-flex items-center space-x-2 text-sm text-slate-400 hover:text-white transition-colors group"
            >
                <svg class="w-4 h-4 transform group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
                </svg>
                <span>Volver al Inicio</span>
            </router-link>
        </div>        
        <div class="mb-8">
            <h1 class="text-2xl font-bold text-white">Panel de Administración</h1>
            <p class="text-slate-400 text-sm">Gestiona la configuración global de la plataforma, accesos y permisos.</p>
        </div>

        <!-- Grid de Accesos Directos a Módulos Admin -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            
            <!-- Módulo: Usuarios -->
            <router-link 
                to="/admin/users" 
                class="group p-6 bg-slate-800/60 border border-slate-700/60 hover:border-emerald-500/50 rounded-2xl transition-all duration-300 hover:shadow-lg hover:shadow-emerald-500/5"
            >
                <div class="flex items-center justify-between mb-4">
                    <div class="p-3 bg-emerald-500/10 text-emerald-400 rounded-xl group-hover:scale-110 transition-transform">
                        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                        </svg>
                    </div>
                    <span class="text-xs font-semibold px-2.5 py-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-full">Activo</span>
                </div>
                <h2 class="text-lg font-semibold text-white group-hover:text-emerald-400 transition-colors">Gestión de Usuarios</h2>
                <p class="text-slate-400 text-xs mt-1">Creación, edición de datos personales, asignación de roles y eliminación.</p>
            </router-link>

            <!-- Módulo: Roles y Permisos -->
            <router-link 
                to="/admin/roles" 
                class="group p-6 bg-slate-800/60 border border-slate-700/60 hover:border-purple-500/50 rounded-2xl transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/5"
            >
                <div class="flex items-center justify-between mb-4">
                    <div class="p-3 bg-purple-500/10 text-purple-400 rounded-xl group-hover:scale-110 transition-transform">
                        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                        </svg>
                    </div>
                    <span class="text-xs font-semibold px-2.5 py-1 bg-purple-500/10 text-purple-400 border border-purple-500/20 rounded-full">Dev / Config</span>
                </div>
                <h2 class="text-lg font-semibold text-white group-hover:text-purple-400 transition-colors">Roles y Permisos</h2>
                <p class="text-slate-400 text-xs mt-1">Administración de la tabla de roles globales del sistema (CRUD de Roles).</p>
            </router-link>

            <!-- Módulo: Logs de Auditoría / Sistema (Sugerencia) -->
            <div class="p-6 bg-slate-800/20 border border-slate-700/30 rounded-2xl opacity-60 cursor-not-allowed">
                <div class="flex items-center justify-between mb-4">
                    <div class="p-3 bg-slate-700/30 text-slate-500 rounded-xl">
                        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                    </div>
                    <span class="text-xs font-semibold px-2.5 py-1 bg-slate-700/30 text-slate-500 border border-slate-600/30 rounded-full">Próximamente</span>
                </div>
                <h2 class="text-lg font-semibold text-slate-400">Auditoría / Logs</h2>
                <p class="text-slate-500 text-xs mt-1">Historial de cambios críticos y acciones de los administradores.</p>
            </div>

        </div>
    </div>
</template>