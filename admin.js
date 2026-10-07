// ============================================
// CONTROLLER BUG - Admin Panel Logic
// ============================================

// Daftar fitur bug yang bisa dikontrol
const BUG_FEATURES = [
    { id: 'crash',       name: 'Crash',       desc: 'Force close target',    icon: '⚡', active: true  },
    { id: 'multi',       name: 'Multi Target', desc: 'Serang banyak target',  icon: '👥', active: true  },
    { id: 'fast',        name: 'Fast Execution', desc: 'Eksekusi cepat',      icon: '⏱️', active: true  },
    { id: 'anti',        name: 'Anti Lag',    desc: 'Kurangi lag',           icon: '🔋', active: true  },
    { id: 'aimbot',      name: 'Aimbot',      desc: 'Auto lock target',      icon: '🎯', active: false },
    { id: 'wallhack',    name: 'Wallhack',    desc: 'Lihat tembus dinding',  icon: '👁️', active: false },
    { id: 'speedhack',   name: 'Speedhack',   desc: 'Percepat pergerakan',   icon: '💨', active: false },
    { id: 'godmode',     name: 'God Mode',    desc: 'Kebal serangan',        icon: '🛡️', active: false }
];

let currentConfig = {};

// ============================================
// INIT
// ============================================
window.addEventListener('load', () => {
    // Cek apakah user sudah login sebagai admin
    const loggedIn = localStorage.getItem('boomerLoggedIn');
    if (!loggedIn) {
        log('Akses ditolak! Silakan login dulu.', 'err');
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 2000);
        return;
    }
    document.getElementById('adminName').textContent = loggedIn;
    document.getElementById('vpsEndpoint').textContent = VPS_CONFIG.baseURL;
    
    log('Panel admin dimuat oleh: ' + loggedIn, 'ok');
    
    // Render control list
    renderControls();
    
    // Cek koneksi VPS
    checkVPS();
    
    // Load config dari VPS (atau localStorage fallback)
    loadConfig();
});

// ============================================
// CEK STATUS VPS
// ============================================
async function checkVPS() {
    const dot = document.getElementById('statusDot');
    const title = document.getElementById('vpsTitle');
    const desc = document.getElementById('vpsDesc');
    
    dot.className = 'status-dot';
    title.textContent = 'Menghubungkan ke VPS...';
    title.className = '';
    desc.textContent = 'Mengecek status server';
    
    log('Mengecek koneksi VPS...', 'info');
    
    const result = await apiCheckStatus();
    
    if (result.ok) {
        dot.className = 'status-dot online';
        title.textContent = 'VPS Terhubung ✓';
        title.className = 'ok';
        desc.textContent = result.data.message || 'Server aktif dan siap';
        document.getElementById('vpsUptime').textContent = result.data.uptime || 'Aktif';
        log('VPS terhubung: ' + VPS_CONFIG.baseURL, 'ok');
    } else {
        dot.className = 'status-dot offline';
        title.textContent = 'VPS Tidak Terhubung ✗';
        title.className = 'fail';
        desc.textContent = 'Mode offline - pakai localStorage';
        document.getElementById('vpsUptime').textContent = '-';
        log('Gagal konek VPS: ' + result.error, 'err');
        log('Menggunakan mode offline (localStorage)', 'info');
    }
}

// ============================================
// RENDER CONTROL LIST
// ============================================
function renderControls() {
    const list = document.getElementById('controlList');
    list.innerHTML = '';
    
    BUG_FEATURES.forEach(feat => {
        const isActive = currentConfig[feat.id] !== undefined 
            ? currentConfig[feat.id] 
            : feat.active;
        
        const item = document.createElement('div');
        item.className = 'control-item ' + (isActive ? 'active' : 'inactive');
        item.innerHTML = `
            <div class="control-left">
                <div class="control-icon">${feat.icon}</div>
                <div class="control-text">
                    <h4>${feat.name}</h4>
                    <p>${feat.desc}</p>
                </div>
            </div>
            <div class="toggle ${isActive ? 'on' : ''}" 
                 onclick="toggleFeature('${feat.id}', this)"></div>
        `;
        list.appendChild(item);
    });
}

// ============================================
// TOGGLE FITUR
// ============================================
function toggleFeature(id, el) {
    const isOn = el.classList.contains('on');
    const newState = !isOn;
    
    el.classList.toggle('on', newState);
    el.parentElement.classList.toggle('active', newState);
    el.parentElement.classList.toggle('inactive', !newState);
    
    currentConfig[id] = newState;
    
    const feat = BUG_FEATURES.find(f => f.id === id);
    log(`${feat.name} → ${newState ? 'AKTIF ✓' : 'MATI ✗'}`, newState ? 'ok' : 'err');
}

// ============================================
// SIMPAN CONFIG KE VPS
// ============================================
async function saveConfig() {
    log('Menyimpan config ke VPS...', 'info');
    showToast('Menyimpan...', 'info');
    
    // Gabung semua fitur dengan status
    const configToSave = {};
    BUG_FEATURES.forEach(feat => {
        configToSave[feat.id] = currentConfig[feat.id] !== undefined 
            ? currentConfig[feat.id] 
            : feat.active;
    });
    
    // Simpan ke localStorage (fallback)
    localStorage.setItem('boomerBugConfig', JSON.stringify(configToSave));
    
    // Coba kirim ke VPS
    const result = await apiSaveBugConfig(configToSave);
    
    if (result.ok) {
        log('Config berhasil dikirim ke VPS ✓', 'ok');
        showToast('Berhasil disimpan ke VPS!', 'success');
    } else {
        log('Gagal kirim ke VPS: ' + result.error, 'err');
        log('Config disimpan lokal saja', 'info');
        showToast('Disimpan lokal (VPS offline)', 'info');
    }
}

// ============================================
// LOAD CONFIG DARI VPS
// ============================================
async function loadConfig() {
    log('Memuat config dari VPS...', 'info');
    
    const result = await apiGetBugConfig();
    
    if (result.ok && result.data) {
        currentConfig = result.data;
        log('Config dimuat dari VPS ✓', 'ok');
    } else {
        // Fallback ke localStorage
        const local = localStorage.getItem('boomerBugConfig');
        if (local) {
            currentConfig = JSON.parse(local);
            log('Config dimuat dari localStorage', 'info');
        } else {
            log('Tidak ada config tersimpan, pakai default', 'info');
        }
    }
    
    renderControls();
}

// ============================================
// RESET CONFIG
// ============================================
function resetConfig() {
    if (!confirm('Reset semua fitur ke default?')) return;
    
    currentConfig = {};
    BUG_FEATURES.forEach(f => { currentConfig[f.id] = f.active; });
    localStorage.removeItem('boomerBugConfig');
    
    renderControls();
    log('Config direset ke default', 'info');
    showToast('Config direset!', 'success');
}

// ============================================
// LOG
// ============================================
function log(msg, type) {
    type = type || '';
    const box = document.getElementById('logBox');
    const time = new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    const div = document.createElement('div');
    div.className = 'log-item ' + type;
    div.textContent = '[' + time + '] ' + msg;
    box.appendChild(div);
    box.scrollTop = box.scrollHeight;
}

// ============================================
// TOAST
// ============================================
function showToast(msg, type) {
    type = type || 'info';
    const t = document.getElementById('toast');
    t.textContent = msg;
    t.className = 'toast show ' + type;
    setTimeout(() => { t.className = 'toast'; }, 2500);
}