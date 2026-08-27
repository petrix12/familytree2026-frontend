import { createRouter, createWebHistory } from 'vue-router';
import { useAuthStore } from '../stores/auth.store';

// Vistas públicas y estáticas
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
    
    // Rutas de Administración (Todas estandarizadas con requiresRole)
    { 
      path: '/admin', 
      name: 'admin-dashboard', 
      component: () => import('../views/admin/AdminDashboardView.vue'), 
      meta: { requiresAuth: true, requiresRole: 'SUPER_ADMIN' } 
    },
    { 
      path: '/admin/users', 
      name: 'admin-users', 
      component: () => import('../views/admin/UsersAdminView.vue'), 
      meta: { requiresAuth: true, requiresRole: 'SUPER_ADMIN' } 
    },
    { 
      path: '/admin/roles', 
      name: 'admin-roles', 
      component: () => import('@/views/admin/RolesAdminView.vue'), 
      meta: { requiresAuth: true, requiresRole: 'SUPER_ADMIN' } 
    },
    { 
      path: '/admin/audit-logs', 
      name: 'admin-audit-logs', 
      component: () => import('@/views/admin/AuditLogsView.vue'), 
      meta: { requiresAuth: true, requiresRole: 'SUPER_ADMIN' } 
    },    

    { path: '/:pathMatch(.*)*', name: 'not-found', component: NotFoundView },  
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
      return { name: 'dashboard' }; // Redirige al dashboard si no posee el rol
    }
  }

  return true;
});

export default router;