// --- SWITCH TAB LOGIN / SIGN UP ---
function switchTab(type) {
    const tabLogin = document.getElementById('tabLogin');
    const tabSignup = document.getElementById('tabSignup');
    const formLogin = document.getElementById('formLogin');
    const formSignup = document.getElementById('formSignup');

    if (type === 'login') {
        tabLogin.classList.add('active');
        tabSignup.classList.remove('active');
        formLogin.classList.remove('hidden');
        formSignup.classList.add('hidden');
    } else {
        tabSignup.classList.add('active');
        tabLogin.classList.remove('active');
        formSignup.classList.remove('hidden');
        formLogin.classList.add('hidden');
    }
}

// --- TOAST NOTIFIKASI ---
function showToast(msg, type = 'info') {
    const toast = document.getElementById('toast');
    toast.textContent = msg;
    toast.className = 'toast show ' + type;
    setTimeout(() => {
        toast.className = 'toast';
    }, 2500);
}

// --- SIMULASI DATABASE USER (localStorage) ---
function getUsers() {
    return JSON.parse(localStorage.getItem('boomerUsers') || '[]');
}

function saveUsers(users) {
    localStorage.setItem('boomerUsers', JSON.stringify(users));
}

// --- LOGIN ---
function doLogin() {
    const user = document.getElementById('loginUser').value.trim();
    const pass = document.getElementById('loginPass').value.trim();

    if (!user || !pass) {
        showToast('Isi Username & Password!', 'error');
        return;
    }

    const users = getUsers();
    const found = users.find(u => u.username === user && u.password === pass);

    if (!found) {
        showToast('Username / Password salah!', 'error');
        return;
    }

    showToast('Login berhasil! Mengarahkan...', 'success');

    // Simpan sesi login
    localStorage.setItem('boomerLoggedIn', user);
    if (document.getElementById('rememberMe').checked) {
        localStorage.setItem('boomerRemember', user);
    }

    // Redirect ke halaman utama setelah 1.5 detik
    setTimeout(() => {
        window.location.href = 'index.html';
    }, 1500);
}

// --- SIGN UP ---
function doSignup() {
    const user = document.getElementById('regUser').value.trim();
    const email = document.getElementById('regEmail').value.trim();
    const pass = document.getElementById('regPass').value.trim();
    const pass2 = document.getElementById('regPass2').value.trim();

    if (!user || !email || !pass || !pass2) {
        showToast('Semua kolom harus diisi!', 'error');
        return;
    }

    if (pass.length < 4) {
        showToast('Password minimal 4 karakter!', 'error');
        return;
    }

    if (pass !== pass2) {
        showToast('Konfirmasi password tidak sama!', 'error');
        return;
    }

    const users = getUsers();
    if (users.find(u => u.username === user)) {
        showToast('Username sudah terdaftar!', 'error');
        return;
    }

    users.push({ username: user, email: email, password: pass });
    saveUsers(users);

    showToast('Akun berhasil dibuat! Silakan login.', 'success');

    // Reset form & pindah ke tab login
    document.getElementById('regUser').value = '';
    document.getElementById('regEmail').value = '';
    document.getElementById('regPass').value = '';
    document.getElementById('regPass2').value = '';

    setTimeout(() => {
        switchTab('login');
        document.getElementById('loginUser').value = user;
    }, 1200);
}

// --- AUTO LOAD USERNAME JIKA "INGAT SAYA" ---
window.addEventListener('load', () => {
    const remembered = localStorage.getItem('boomerRemember');
    if (remembered) {
        document.getElementById('loginUser').value = remembered;
        document.getElementById('rememberMe').checked = true;
    }
});