import { createRouter, createWebHistory } from 'vue-router'
import { supabase } from '../supabase'
import LoginView from '../views/LoginView.vue'
import DashboardView from '../views/DashboardView.vue'

const routes = [
    {
        path: '/',
        redirect: '/login' //MENGALIHKAN AKSES WEB PERTAMA KE HALAMAN LOGIN
    },
    {
        path: '/login',
        name: 'Login',
        component: LoginView
    },
    {
        path: '/dashboard',
        name: 'Dashboard',
        component: DashboardView,
        meta: { requiresAuth: true } //MEMERLUKAN AKSES LOGIN RESMI
    }
]

const router = createRouter ({
    history: createWebHistory(),
    routes
})

//KEAMANAN ROUTER
router.beforeEach(async (to, from, next) => {
    //MENGAMBIL DATA SESI AKTIF DARI SUPABASE
    const { data: { session } } = await supabase.auth.getSession()

    //SKENARIO 1 : MENCOBA MASUK KE DASHBOARD TANPA LOGIN
    if (to.meta.requiresAuth && !session) {
        next('/login')
    }
    //SKENARIO 2 : SUDAH LOGIN TAPI SENGAJA KEMBALI KE HALAMAN LOGIN
    else if (to.path === '/login' && session) {
        next('/dashboard')
    }
    //SKENARIO 3 : KONDISI AMAN DAN IZINKAN NAVIGASI BERJALAN LANJUT
    else {
        next()
    }
})

export default router
