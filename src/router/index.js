import { createRouter, createWebHistory } from 'vue-router';
import { useAuthStore } from '../stores/auth.store';

// Vistas
import HomeView from '../views/HomeView.vue';
import LoginView from '../views/LoginView.vue';
import RegisterView from '../views/RegisterView.vue';
import DashboardView from '../views/DashboardView.vue';
import NotFoundView from '../views/NotFoundView.vue';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', name: 'home', component: HomeView },
    { path: '/login', name: 'login', component: LoginView, meta: { requiresGuest: true } },
    { path: '/register', name: 'register', component: RegisterView, meta: { requiresGuest: true } },
    { path: '/dashboard', name: 'dashboard', component: DashboardView, meta: { requiresAuth: true } },
    { path: '/:pathMatch(.*)*', name: 'not-found', component: NotFoundView },
    { path: '/admin/users', name: 'admin-users', component: () => import('../views/admin/UsersAdminView.vue'), meta: { requiresAuth: true, requiresRole: 'SUPER_ADMIN' }, }
  ],
});

// Navigation Guard Global
router.beforeEach(async (to) => {
  const authStore = useAuthStore();

  if (authStore.token && !authStore.user) {
    await authStore.fetchUser();
  }

  const isAuthenticated = authStore.isAuthenticated;

  if (to.meta.requiresAuth && !isAuthenticated) {
    return { name: 'login' };
  }

  if (to.meta.requiresGuest && isAuthenticated) {
    return { name: 'dashboard' };
  }

  // Validación de Rol para rutas de administración
  if (to.meta.requiresRole) {
    const userRoles = authStore.user?.roles || [];
    if (!userRoles.includes(to.meta.requiresRole)) {
      return { name: 'dashboard' }; // Redirige al dashboard si no es SuperAdmin
    }
  }

  return true;
});

export default router;
