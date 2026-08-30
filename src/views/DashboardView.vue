<script setup>
    import { Cog6ToothIcon } from '@heroicons/vue/24/outline';
    import { useRouter } from 'vue-router';
    import { useAuthStore } from '../stores/auth.store';

    const authStore = useAuthStore();
    const router = useRouter();

    const handleLogout = async () => {
        await authStore.logout();
        router.push({ name: 'login' });
    };
</script>

<template>
    <div class="min-h-screen bg-slate-900 text-slate-100 flex flex-col">
        <!-- Navbar -->
        <header class="bg-slate-800 border-b border-slate-700 py-4 px-4 sm:px-6 flex flex-col sm:flex-row justify-center sm:justify-between items-center gap-4 text-center sm:text-left">
            <!-- Título / Branding -->
            <h1 class="text-lg sm:text-xl font-bold text-emerald-400 whitespace-nowrap">
                Starter App Dashboard
            </h1>

            <!-- Usuario y Acciones -->
            <div class="flex flex-wrap items-center justify-center gap-3 sm:gap-4">
                <span class="text-sm text-slate-300 whitespace-nowrap">
                    {{ authStore.user?.name }}
                </span>
                
                <router-link 
                    v-if="authStore.userRoles.includes('SUPER_ADMIN')" 
                    to="/admin" 
                    class="px-3 py-1.5 rounded-lg text-sm font-medium text-purple-400 hover:text-purple-300 hover:bg-purple-950/40 transition-all flex items-center space-x-2 whitespace-nowrap shrink-0"
                >
                    <Cog6ToothIcon class="w-4 h-4" />
                    <span>Panel Admin</span>
                </router-link>

                <button
                    @click="handleLogout"
                    class="px-3 py-1.5 bg-red-600/80 hover:bg-red-500 text-sm font-medium rounded-lg transition-colors cursor-pointer whitespace-nowrap shrink-0"
                >
                    Cerrar Sesión
                </button>
            </div>
        </header>        

        <!-- Main Content -->
        <main class="flex-1 p-6 max-w-4xl mx-auto w-full">
            <div class="bg-slate-800 border border-slate-700 rounded-2xl p-6 shadow-lg">
                <h2 class="text-lg font-semibold text-emerald-400 mb-4">Perfil de Usuario Autenticado</h2>
                
                <div class="space-y-3 text-slate-300">
                    <p><strong class="text-slate-100">ID:</strong> {{ authStore.user?.id }}</p>
                    <p><strong class="text-slate-100">Nombre:</strong> {{ authStore.user?.name }}</p>
                    <p><strong class="text-slate-100">Correo:</strong> {{ authStore.user?.email }}</p>
                    <p>
                        <strong class="text-slate-100">Roles:</strong>
                            <span
                                v-for="role in authStore.userRoles"
                                :key="role"
                                class="ml-2 inline-block px-2 py-0.5 bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-semibold rounded"
                            >
                                {{ role }}
                        </span>
                    </p>
                </div>
            </div>
        </main>
    </div>
</template>