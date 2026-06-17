<template>
    <div class="login-container">
        <div class="login-card">
            <div class="login-header">
                <h2>Sistem Inventaris</h2>
                <p>Silahkan masuk untuk mengelola aset</p>
            </div>

            <form @submit.prevent="handleLogin" class="login-form">
                <div class="form-group">
                    <label for="email">Email Admin</label>
                    <input
                    id="email"
                    v-model="email"
                    type="email"
                    placeholder="Masukkan email admin anda"
                    required
                    />
                </div>

                <div class="form-group">
                    <label for="password">Password</label>
                    <input
                    id="password"
                    v-model="password"
                    type="password"
                    placeholder="••••••••"
                    required
                    />
                </div>

                <div v-if="errorMessage" class="error-alert">
                    {{ errorMessage }}
                </div>

                <button type="submit" :disabled="isLoading" class="btn-login">
                    {{ isLoading ? 'Memproses...' : 'Masuk ke Sistem' }}
                </button>
            </form>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue'
import { supabase } from '../supabase'
import { useRouter } from 'vue-router'

const router = useRouter
const email = ref('')
const password = ref('')
const isLoading = ref(false)
const errorMessage = ref('')

const handleLogin = async () => {
    isLoading.value = true
    errorMessage.value = ''

    //MEMANGGIL FUNGSI AUTHENTIKASI BAWAAN DARI SUPABASE CLIENT
    const { data, error } = await supabase.auth.signInWithPassword({
        email: email.value,
        password: password.value,
    })

    isLoading.value = false

    if(error) {
        //MENANGKAP PESAN EROR JIKA GAGAL LOGIN
        errorMessage.value = 'Login Gagal: ' + error.message
    }
}
</script>

<style scoped>
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: #0f172a;
}

.login-card {
  background-color: #1e293b;
  padding: 2.5rem;
  border-radius: 12px;
  border: 1px solid #334155;
  width: 100%;
  max-width: 400px;
}

.login-header h2 {
  margin: 0;
  font-size: 1.6rem;
  text-align: center;
}

.login-header p {
  color: #94a3b8;
  font-size: 0.9rem;
  text-align: center;
  margin-top: 0.4rem;
  margin-bottom: 2rem;
}

.login-form {
  display: flex;
  flex-direction: column;
  gap: 1.2rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
}

label {
  font-size: 0.85rem;
  color: #94a3b8;
}

input {
  background-color: #0f172a;
  border: 1px solid #334155;
  color: #f8fafc;
  padding: 0.75rem;
  border-radius: 6px;
  font-size: 0.9rem;
  outline: none;
}

input:focus {
  border-color: #06b6d4;
}

.error-alert {
  background-color: rgba(239, 68, 68, 0.15);
  color: #ef4444;
  padding: 0.65rem;
  border-radius: 6px;
  font-size: 0.85rem;
  text-align: center;
}

.btn-login {
  background-color: #06b6d4;
  color: #000;
  font-weight: 600;
  padding: 0.75rem;
  border-radius: 6px;
  border: none;
  cursor: pointer;
  margin-top: 0.5rem;
}

.btn-login:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
</style>
