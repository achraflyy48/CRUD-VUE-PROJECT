<template>
  <div class="dashboard-container">
    <header class="dashboard-header">
      <div class="header-title">
        <h1>Sistem Inventaris Barang</h1>
        <p>Manajemen aset dan stok secara real-time</p>
      </div>

      <div class="header-actions">
        <div class="badge-stok">
            Total Jenis Aset: <span>{{ daftarBarang.length }}</span>
        </div>
        <button button @click="bukaModalLogout" class="btn-logout-trigger">
            Logout
        </button>
      </div>
    </header>

    <div class="dashboard-content">
      <section class="form-panel">
        <h2 class="section-title">
          Tambah / Edit Barang
          {{ isEditing ? "Edit Detail Barang" : "Baru" }}
        </h2>

        <form @submit.prevent="simpanBarang" class="inventaris-form">
          <div class="form-group">
            <label for="nama">Nama Barang</label>
            <input
              id="nama"
              v-model="formBarang.nama_barang"
              type="text"
              placeholder="Cth: Asus Laptop ROG"
              required
            />
          </div>

          <div class="form-row">
            <div class="form-group">
              <label for="kategori">Kategori</label>
              <select id="kategori" v-model="formBarang.kategori" required>
                <option value="" disabled>Pilih Kategori</option>
                <option value="Elektronik">Elektronik</option>
                <option value="ATK">Alat Tulis Kantor</option>
                <option value="Furnitur">Furnitur</option>
                <option value="Lainnya">Lainnya</option>
              </select>
            </div>

            <div class="form-group">
              <label for="stok">Jumlah Stok</label>
              <input
                id="stok"
                v-model.number="formBarang.stok"
                type="number"
                min="0"
                required
              />
            </div>
          </div>

          <div class="form-group">
            <label>Kondisi Barang</label>
            <div class="radio-group">
              <label class="radio-label">
                <input type="radio" value="Baik" v-model="formBarang.kondisi" />
                Baik
              </label>
              <label class="radio-label">
                <input type="radio" value="Rusak Ringan" v-model="formBarang.kondisi" />
                Rusak Ringan
              </label>
              <label class="radio-label">
                <input type="radio" value="Rusak Berat" v-model="formBarang.kondisi" />
                Rusak Berat
              </label>
            </div>
          </div>

          <div class="form-actions">
            <button type="submit" class="btn btn-primary">
              {{ isEditing ? 'Simpan Perubahan' : 'Tambah ke Inventaris' }}
            </button>
            <button
            v-if="isEditing"
            type="button"
            @click="batalEdit"
            class="btn btn-secondary"
            >
              Batal
            </button>
          </div>
        </form>
      </section>

      <section class="table-panel">
        <h2 class="section-title">Daftar Aset Terdaftar</h2>

        <div class="table-container">
          <table class="inventaris-table">
            <thead>
              <tr>
                <th>Nama Barang</th>
                <th>Kategori</th>
                <th>Stok</th>
                <th>Kondisi</th>
                <th class="text-center">Aksi</th>
              </tr>
            </thead>
            <tbody>
              <tr v-if="daftarBarang.length === 0">
                <td colspan="5" class="text-center data-kosong">
                  Belum Ada Inventaris Barang.
                </td>
              </tr>
              <tr v-for="barang in daftarBarang" :key="barang.id">
                <td class="font-medium">{{ barang.nama_barang }}</td>
                <td><span class="tag-kategori">{{ barang.kategori }}</span></td>
                <td>{{ barang.stok }} unit</td>
                <td>
                  <span>
                    {{ barang.kondisi }}
                  </span>
                </td>
                <td class="text-center">
                  <div class="action-buttons">
                    <button @click="pilihEdit(barang)" class="btn-icon edit" title="Edit"></button>
                    <button @click="bukaModalHapus(barang.id)" class="btn-icon delete" title="Hapus"></button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
    </div>

    <div v-if="modal.isOpen" class="modal-backdrop">
      <div class="modal-card">
        <div class="modal-icon">
          {{ modal.type === 'logout' ? '⚠️' : '🗑️' }}
        </div>

        <h3>
          {{ modal.type === 'logout' ? 'Konfirmasi Logout' : 'Hapus Aset' }}
        </h3>

        <p>
          {{
            modal.type === 'logout'
            ? 'Apakah Anda yakin ingin mengakhiri sesi dan keluar dari sistem?'
            : 'Aset yang dihapus tidak dapat dikembalikan. Yakin ingin melanjutkan?'
          }}
        </p>

        <div class="modal-actions">
          <button @click="tutupModal" class="btn btn-secondary">
            Batal
          </button>
          <button @click="konfirmasiModal" class="btn btn-danger">
            {{ modal.type === 'logout' ? 'Ya, Keluar' : 'Ya, Hapus Data' }}
          </button>
        </div>
      </div>
    </div>

    <div
      v-if="toast.show"
      :class="['toast-notification', toast.type === 'error' ? 'toast-error' : 'toast-success']"
    >
      {{ toast.message }}
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { supabase } from '../supabase'

// STATE MANAGEMENT
const daftarBarang = ref([])
const isEditing = ref(false)
const formBarang = ref({ id: null, nama_barang: '', kategori: '', stok: 0, kondisi: 'Baik'})

//STATE TOAST NOTIFICATION
const toast = ref({ show: false, message: '', type: 'success' })

const tampilkanToast = (message, type = 'success') => {
  toast.value = { show: true, message, type }
  //MENGATUR WAKTU TOAST OTOMATIS SELAMA 3 DETIK
  setTimeout(() => {
    toast.value.show = false
  }, 5000)
}

//STATE DYNAMIC MODAL
const modal = ref({ isOpen: false, type: '', targetId: null })

const bukaModalLogout = () => {
  modal.value = { isOpen: true, type: 'logout', targetId: null }
}

const bukaModalHapus = (id) => {
  modal.value = { isOpen: true, type: 'delete', targetId: id }
}

const tutupModal = () => {
  modal.value.isOpen = false
}

const konfirmasiModal = () => {
  if (modal.value.type === 'logout') prosesLogout()
  else if (modal.value.type === 'delete') eksekusiHapus(modal.value.targetId)
}

//LOGIKA CRUD UTAMA
const ambilData = async () => {
  const { data, error } = await supabase
    .from('barang')
    .select('*')
    .order('id', { ascending: false })

  if (!error) daftarBarang.value = data
}
const simpanBarang = async () => {
  if(!formBarang.value.nama_barang || !formBarang.value.kategori) {
    tampilkanToast('Harap isi semua kolom utama!', 'error')
    return
  }

  if(isEditing.value) {
    //MENJALANKAN FUNGSI UPDATE JIKA STATUS MENGEDIT
    const { error } = await supabase
    .from('barang')
    .update({
      nama_barang: formBarang.value.nama_barang,
      kategori: formBarang.value.kategori,
      stok: formBarang.value.stok,
      kondisi: formBarang.value.kondisi
    }).eq('id', formBarang.value.id)

    if (error) {
      tampilkanToast('Gagal memperbarui data', 'error')
    } else {
      batalEdit()
      tampilkanToast('Perubahan berhasil disimpan!', 'success')
    }
  } else {
    //MENJALANKAN FUNGSI CREATE JIKA DATA BARU
    const { error } = await supabase
      .from('barang')
      .insert([
        {
          nama_barang: formBarang.value.nama_barang,
          kategori: formBarang.value.kategori,
          stok: formBarang.value.stok,
          kondisi: formBarang.value.kondisi
        }
      ])

    if (error) {
      tampilkanToast('Gagal menambahkan data', 'error')
    } else {
      resetForm()
      tampilkanToast('Aset berhasil ditambahkan!', 'success')
    }
  }
  // Pastikan list ter-refresh setelah create/update
  ambilData() //MEMPERBARUI TAMPILAN ISI LIST
}

// Fungsi eksekusi hapus yang dipanggil oleh Modal
const eksekusiHapus = async (id) => {
  const { error } = await supabase.from('barang').delete().eq('id', id)

  if (error) {
    tampilkanToast('Gagal menghapus data', 'error')
  } else {
    tutupModal()
    ambilData()
    tampilkanToast('Aset berhasil di hapus', 'success')
  }
}

//TRIGGER EDIT MODE
const pilihEdit = (barang) => {
  isEditing.value = true
  // Lempar data baris terpilih ke dalam form reaktif (kloning object)
  formBarang.value = { ...barang }
}

const batalEdit = () => {
  isEditing.value = false
  resetForm()
}

const resetForm = () => {
  formBarang.value = { id: null, nama_barang: '', kategori: '', stok: 0, kondisi: 'Baik' }
}

//FUNGSI LOGOUT SUPABASE
const prosesLogout = async () => {
    //MEMANGGIL FUNGSI KELUAR DARI SUPABASE
    const { error } = await supabase.auth.signOut()

    if(error) tampilkanToast('Gagal melakukan logout', 'error')
    else tutupModal()
}

onMounted(() => {
  ambilData()
})  
</script>

<style>
/* CSS Reset & Variabel Tema Minimalist Dark */
:root {
  --bg-main: #0f172a;
  --bg-card: #1e293b;
  --text-main: #f8fafc;
  --text-muted: #94a3b8;
  --accent-cyan: #06b6d4;
  --accent-danger: #ef4444;
  --accent-warning: #f59e0b;
  --accent-success: #10b981;
  --border-color: #334155;
}

body {
  margin: 0;
  min-height: 100vh;
  background-color: var(--bg-main);
  color: var(--text-main);
  font-family: 'Inter', system-ui, sans-serif;
  -webkit-font-smoothing: antialiased;
}


/* Layout Dashboard */
.dashboard-container {
  width: 100%;
  height: auto;
  min-height: 100dvh;
  max-width: none;
  margin: 0;
  padding: 2rem;
  box-sizing: border-box;
  overflow: visible;
}


.dashboard-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid var(--border-color);
  padding-bottom: 1.5rem;
  margin-bottom: 2rem;
}

.header-title h1 {
  margin: 0;
  font-size: 1.8rem;
  font-weight: 700;
  letter-spacing: -0.025em;
}

.header-title p {
  margin: 0.25rem 0 0 0;
  color: var(--text-muted);
  font-size: 0.95rem;
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.badge-stok {
  background-color: var(--bg-card);
  padding: 0.6rem 1.2rem;
  border-radius: 8px;
  border: 1px solid var(--border-color);
  font-size: 0.9rem;  
}

.badge-stok span {
  color: var(--accent-cyan);
  font-weight: bold;
}

.btn-logout-trigger {
  background-color: transparent;
  border: 1px solid var(--accent-danger);
  color: var(--accent-danger);
  padding: 0.55rem 1.2rem;
  border-radius: 8px;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-logout-trigger:hover {
  background-color: rgba(239, 68, 68, 0.1);
}

.dashboard-content {
  display: grid;
  grid-template-columns: 1fr 2fr;
  gap: 2rem;
  width: 100%;
  min-height: 0;
  height: auto;
}

@media (max-width: 968px) {
  .dashboard-content {
    grid-template-columns: 1fr;
  }
}


/* Gaya Panel & Form */
.form-panel, .table-panel {
  background-color: var(--bg-card);
  padding: 1.5rem;
  border-radius: 12px;
  border: 1px solid var(--border-color);
  width: 100%;
  height: fit-content;
}

/* Pada mobile, beri ruang agar konten tidak kepotong */
@media (max-width: 600px) {
  .dashboard-container {
    padding: 1rem;
  }

  .dashboard-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.75rem;
    margin-bottom: 1.25rem;
  }

  .header-actions {
    width: 100%;
    justify-content: space-between;
  }

  .form-row {
    grid-template-columns: 1fr;
  }

  /* Supaya tabel tidak “memaksa” tinggi layout */
  .table-container {
    max-height: calc(100dvh - 20rem);
    overflow: auto;
  }

  .toast-notification {
    bottom: 1rem;
    right: 1rem;
    left: 1rem;
  }
}



.section-title {
  margin-top: 0;
  margin-bottom: 1.5rem;
  font-size: 1.2rem;
  font-weight: 600;
  color: var(--text-main);
}

.inventaris-form {
  display: flex;
  flex-direction: column;
  gap: 1.2rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

label {
  font-size: 0.85rem;
  font-weight: 500;
  color: var(--text-muted);
}

input[type="text"], input[type="number"], select {
  background-color: var(--bg-main);
  border: 1px solid var(--border-color);
  color: var(--text-main);
  padding: 0.65rem;
  border-radius: 6px;
  font-size: 0.9rem;
  outline: none;
  transition: border-color 0.2s;
}

input:focus, select:focus {
  border-color: var(--accent-cyan);
}

.radio-group {
  display: flex;
  gap: 1rem;
  margin-top: 0.2rem;
}

.radio-label {
  font-size: 0.9rem;
  color: var(--text-main);
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.3rem;
}

/* Desain Tabel */
.table-container {
  overflow-x: auto;
}

.inventaris-table {
  width: 100%;
  border-collapse: collapse;
  text-align: left;
  font-size: 0.9rem;
}

.inventaris-table th {
  background-color: var(--bg-main);
  color: var(--text-muted);
  padding: 0.85rem;
  font-weight: 600;
  border-bottom: 2px solid var(--border-color);
}

.inventaris-table td {
  padding: 0.85rem;
  border-bottom: 1px solid var(--border-color);
  color: #cbd5e1;
}

.font-medium {
  font-weight: 500;
  color: var(--text-main);
}

.data-kosong {
  color: var(--text-muted);
  padding: 2rem !important;
}

/* Tombol & Utilities */
.btn {
  padding: 0.65rem 1.2rem;
  border-radius: 6px;
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  border: none;
  transition: opacity 0.2s;
}

.btn:hover {
  opacity: 0.9;
}

.btn-primary {
  background-color: var(--accent-cyan);
  color: #000;
  font-weight: 600;
}

.btn-secondary {
  background-color: #475569;
  color: var(--text-main);
}

.form-actions {
  display: flex;
  gap: 0.5rem;
  margin-top: 0.5rem;
}

.action-buttons {
  display: flex;
  justify-content: center;
  gap: 0.5rem;
}

/* Kustomisasi Icon Button (Menggunakan karakter unicode murni / CSS) */
.btn-icon {
  width: 32px;
  height: 32px;
  border-radius: 6px;
  border: 1px solid var(--border-color);
  background-color: var(--bg-main);
  cursor: pointer;
  position: relative;
}

.btn-icon.edit::before { content: '✎'; color: var(--accent-warning); font-size: 0.85rem;}
.btn-icon.delete::before { content: '🗑'; color: var(--accent-danger); font-size: 0.85rem;}
.btn-icon:hover { background-color: var(--border-color); }

.tag-kategori {
  background-color: #334155;
  padding: 0.2rem 0.5rem;
  border-radius: 4px;
  font-size: 0.8rem;
}

/* Badges Status Kondisi */
.status-badge {
  padding: 0.2rem 0.6rem;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 600;
}
.status-badge.baik { background-color: rgba(16, 185, 129, 0.15); color: var(--accent-success); }
.status-badge.rusak-ringan { background-color: rgba(245, 158, 11, 0.15); color: var(--accent-warning); }
.status-badge.rusak-berat { background-color: rgba(239, 68, 68, 0.15); color: var(--accent-danger); }

.text-center { text-align: center; }

.modal-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(15, 23, 42, 0.75); /* Overlay gelap */
  backdrop-filter: blur(4px); /* Efek kaca / blur */
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000; /* Memastikan modal selalu di lapisan paling atas */
}

.modal-card {
  background-color: var(--bg-card);
  padding: 2.5rem 2rem;
  border-radius: 16px;
  border: 1px solid var(--border-color);
  width: 90%;
  max-width: 400px;
  text-align: center;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.5), 0 8px 10px -6px rgba(0, 0, 0, 0.1);
  animation: modalMuncul 0.3s ease-out forwards;
}

.modal-icon {
  font-size: 3rem;
  margin-bottom: 1rem;
}

.modal-card h3 {
  margin: 0 0 0.5rem 0;
  color: var(--text-main);
  font-size: 1.4rem;
}

.modal-card p {
  color: var(--text-muted);
  font-size: 0.95rem;
  margin-bottom: 2rem;
  line-height: 1.5;
}

.modal-actions {
  display: flex;
  justify-content: center;
  gap: 1rem;
}

.btn-danger {
  background-color: var(--accent-danger);
  color: white;
  font-weight: 600;
}

/* Animasi sederhana agar modal terasa elegan saat muncul */
@keyframes modalMuncul {
  0% {
    opacity: 0;
    transform: translateY(20px) scale(0.95);
  }
  100% {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

/* --- Toast Notification --- */
.toast-notification {
  position: fixed;
  bottom: 2rem;
  right: 2rem;
  padding: 1rem 1.5rem;
  border-radius: 8px;
  font-weight: 500;
  color: #fff;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.3);
  z-index: 9999;
  animation: slideInRight 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
}

.toast-success {
  background-color: var(--accent-success);
  border: 1px solid #059669;
}

.toast-error {
  background-color: var(--accent-danger);
  border: 1px solid #dc2626;
}

/* Animasi untuk Toast */
@keyframes slideInRight {
  0% {
    transform: translateX(100%);
    opacity: 0;
  }
  100% {
    transform: translateX(0);
    opacity: 1;
  }
}
</style>
