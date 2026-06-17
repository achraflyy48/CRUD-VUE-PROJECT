<template>
    <router-view />
</template>

<script setup>
import { onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { supabase } from './supabase';

const router = useRouter()

onMounted(() => {
    //RADAR PEMANTAU STATUS AUTENTIKASI SUPABASE
    supabase.auth.onAuthStateChange((event, session) => {
        if (event === 'SIGNED_IN') {
            //PINDAH KE DASHBORAD SAAT TOKEN SUDAH BENAR-BENAR MASUK
            router.push('/dashboard')
        } else if (event === 'SIGNED_OUT') {
            //JIKA TERDETEKSI LOGOUT, OTOMATIS KEMBALI KE HALAMAN LOGIN
            router.push('/login')
        }
    })
})
</script>

<style>

</style>