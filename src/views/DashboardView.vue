<script setup>
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
        <header class="bg-slate-800 border-b border-slate-700 py-4 px-6 flex justify-between items-center">
            <h1 class="text-xl font-bold text-emerald-400">Starter App Dashboard</h1>
            <div class="flex items-center gap-4">
                <span class="text-sm text-slate-300">{{ authStore.user?.name }}</span>
                
                <router-link 
                    v-if="authStore.userRoles.includes('SUPER_ADMIN')" 
                    to="/admin" 
                    class="px-3 py-2 rounded-lg text-sm font-medium text-purple-400 hover:text-purple-300 hover:bg-purple-950/40 transition-all flex items-center space-x-2"
                >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    </svg>
                    <span>Panel Admin</span>
                </router-link>

                <button
                    @click="handleLogout"
                    class="px-3 py-1.5 bg-red-600/80 hover:bg-red-500 text-sm font-medium rounded-lg transition-colors cursor-pointer"
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