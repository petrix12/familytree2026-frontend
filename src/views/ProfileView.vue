<script setup>
    import { ref } from 'vue';
    import { useAuthStore } from '../stores/auth.store';
    import { UserIcon, KeyIcon, ChevronLeftIcon, CameraIcon } from '@heroicons/vue/24/outline';

    const authStore = useAuthStore();
    const fileInputRef = ref(null);
    const saving = ref(false);

    const profileForm = ref({
        name: authStore.user?.name || '',
        email: authStore.user?.email || '',
        currentPassword: '',
        newPassword: '',
        avatarUrl: authStore.user?.avatarUrl || null,
        avatarFile: null
    });

    const handleAvatarChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            profileForm.value.avatarFile = file;
            profileForm.value.avatarUrl = URL.createObjectURL(file);
        }
    };

    const removeAvatar = () => {
        profileForm.value.avatarFile = null;
        profileForm.value.avatarUrl = null;
        if (fileInputRef.value) fileInputRef.value.value = '';
    };

    const updateProfile = async () => {
        saving.value = true;
        try {
            // Aquí llamaremos al endpoint PUT /api/v1/auth/profile
            // usando FormData para enviar avatarFile, name, passwords, etc.
        } finally {
            saving.value = false;
        }
    };
</script>

<template>
    <div class="max-w-4xl mx-auto px-4 py-8">            
        <!-- Botón de retorno al Dashboard -->
        <div class="mb-6">
            <router-link 
                to="/dashboard" 
                class="inline-flex items-center space-x-2 text-sm text-slate-400 hover:text-white transition-colors group"
            >
                <ChevronLeftIcon class="w-4 h-4 transform group-hover:-translate-x-1 transition-transform" />
                <span>Volver al Dashboard</span>
            </router-link>
        </div>

        <div class="mb-6">
            <h2 class="text-2xl font-bold text-slate-100">Mi Perfil</h2>
            <p class="text-sm text-slate-400">Administra tu información personal y seguridad de la cuenta.</p>
        </div>

        <form @submit.prevent="updateProfile" class="space-y-6">
            <!-- Sección Avatar & Datos Básicos -->
            <div class="bg-slate-800 border border-slate-700 rounded-2xl p-6 shadow-xl">
                <h3 class="text-lg font-semibold text-slate-200 mb-4 flex items-center gap-2">
                    <UserIcon class="w-5 h-5 text-emerald-400" />
                    Información Personal
                </h3>

                <div class="flex flex-col sm:flex-row items-center gap-6 mb-6">
                    <div class="relative w-24 h-24 rounded-full overflow-hidden bg-slate-700 border-2 border-slate-600 flex items-center justify-center group">
                        <img v-if="profileForm.avatarUrl" :src="profileForm.avatarUrl" class="w-full h-full object-cover" />
                        <span v-else class="text-3xl font-bold text-emerald-400">
                            {{ profileForm.name ? profileForm.name.charAt(0).toUpperCase() : 'U' }}
                        </span>
                    </div>

                    <div class="flex flex-col space-y-2 text-center sm:text-left">
                        <div class="flex gap-3">
                            <label class="cursor-pointer px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-xs font-semibold text-white rounded-xl transition-colors">
                                <span>Cambiar Foto</span>
                                <input ref="fileInputRef" type="file" accept="image/*" class="hidden" @change="handleAvatarChange" />
                            </label>

                            <button v-if="profileForm.avatarUrl" type="button" @click="removeAvatar" class="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-xs font-semibold text-red-400 rounded-xl transition-colors">
                                Quitar
                            </button>
                        </div>
                        <p class="text-xs text-slate-500">JPG, PNG o WEBP. Máximo 2MB.</p>
                    </div>
                </div>

                <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                        <label class="block text-xs font-semibold uppercase text-slate-400 mb-1">Nombre Completo</label>
                        <input v-model="profileForm.name" type="text" required class="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-emerald-500" />
                    </div>

                    <div>
                        <label class="block text-xs font-semibold uppercase text-slate-400 mb-1">Correo Electrónico</label>
                        <input v-model="profileForm.email" type="email" disabled class="w-full bg-slate-900/50 border border-slate-700/50 rounded-xl px-3.5 py-2.5 text-sm text-slate-500 cursor-not-allowed" />
                    </div>
                </div>
            </div>

            <!-- Sección Seguridad -->
            <div class="bg-slate-800 border border-slate-700 rounded-2xl p-6 shadow-xl">
                <h3 class="text-lg font-semibold text-slate-200 mb-4 flex items-center gap-2">
                    <KeyIcon class="w-5 h-5 text-emerald-400" />
                    Cambiar Contraseña
                </h3>

                <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                        <label class="block text-xs font-semibold uppercase text-slate-400 mb-1">Contraseña Actual</label>
                        <input v-model="profileForm.currentPassword" type="password" placeholder="••••••••" class="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-emerald-500" />
                    </div>

                    <div>
                        <label class="block text-xs font-semibold uppercase text-slate-400 mb-1">Nueva Contraseña</label>
                        <input v-model="profileForm.newPassword" type="password" placeholder="••••••••" class="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-emerald-500" />
                    </div>
                </div>
            </div>

            <div class="flex justify-end">
                <button type="submit" :disabled="saving" class="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-medium rounded-xl disabled:opacity-50 transition-colors shadow-lg">
                    {{ saving ? 'Guardando...' : 'Guardar Cambios' }}
                </button>
            </div>
        </form>
    </div>
</template>