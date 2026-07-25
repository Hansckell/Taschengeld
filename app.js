let currentProfile = 'Jairo';

let data = {
    'Jairo': { balance: 12.50, goal: 20.00 },
    'Eva': { balance: 18.00, goal: 25.00 }
};

function switchProfile(profile) {
    currentProfile = profile;
    
    // Buttons visueller Status
    document.getElementById('btn-jairo').classList.toggle('active', profile === 'Jairo');
    document.getElementById('btn-eva').classList.toggle('active', profile === 'Eva');
    
    // Text-Anpassung
    document.getElementById('profile-label').innerText = `Guthaben von ${profile}`;
    updateUI();
}

function updateUI() {
    const currentData = data[currentProfile];
    document.getElementById('balance-display').innerText = currentData.balance.toFixed(2).replace('.', ',') + ' €';
    
    // Fortschrittsbalken berechnen
    const pct = Math.min(100, Math.round((currentData.balance / currentData.goal) * 100));
    document.getElementById('goal-progress').style.width = pct + '%';
    document.getElementById('goal-text').innerText = `Sparziel (${pct}%)`;
}

function completeTask(button, amount) {
    data[currentProfile].balance += amount;
    button.parentElement.style.opacity = '0.4';
    button.parentElement.style.textDecoration = 'line-through';
    button.disabled = true;
    updateUI();
}

function openParentModal() {
    document.getElementById('parentModal').style.display = 'flex';
}

function closeModal(id) {
    document.getElementById(id).style.display = 'none';
}

function closeModalOnOuterClick(event, modalId) {
    if (event.target.id === modalId) {
        closeModal(modalId);
    }
}

function unlockParentArea() {
    const pin = document.getElementById('parentPin').value;
    if (pin === '1234') {
        alert('Elternbereich freigeschaltet!');
        document.getElementById('parentPin').value = '';
        closeModal('parentModal');
    } else {
        alert('Falscher PIN! Versuche es mit 1234.');
    }
}

function switchTab(tabName) {
    if (tabName === 'calendar') {
        alert('Kalenderansicht wird geladen...');
    }
}

function showNotification(msg) {
    alert(msg);
}

// Service Worker Registrierung für PWA
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('service-worker.js').catch(err => {
        console.log('Service Worker Registrierungs-Hinweis:', err);
    });
}

// Erster Aufruf beim Laden
document.addEventListener('DOMContentLoaded', () => {
    updateUI();
});