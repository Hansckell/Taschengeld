let currentUser = 'Jairo';

let state = {
    'Jairo': { balance: 12.50, target: 50.00 },
    'Eva': { balance: 18.00, target: 50.00 }
};

// Diese Funktion wird beim Klick auf Jairo oder Eva aufgerufen
function switchUser(name) {
    currentUser = name;
    
    // Visuelles Feedback für die Buttons
    const btnJairo = document.getElementById('btn-jairo');
    const btnEva = document.getElementById('btn-eva');
    
    if (btnJairo) btnJairo.classList.toggle('active', name === 'Jairo');
    if (btnEva) btnEva.classList.toggle('active', name === 'Eva');
    
    const label = document.getElementById('profile-label');
    if (label) label.innerText = `Guthaben von ${name}`;
    
    updateUI();
}

function updateUI() {
    const data = state[currentUser];
    const balanceDisplay = document.getElementById('balance-display');
    if (balanceDisplay) {
        balanceDisplay.innerText = data.balance.toFixed(2).replace('.', ',') + ' €';
    }
    
    const pct = Math.min(100, Math.round((data.balance / data.target) * 100));
    const progressBar = document.getElementById('goal-progress');
    if (progressBar) progressBar.style.width = pct + '%';
    
    const goalText = document.getElementById('goal-text');
    if (goalText) {
        goalText.innerText = `Sparziel: ${data.target.toFixed(2).replace('.', ',')} € (${pct}%)`;
    }
}

function addMoney(amount, btn = null) {
    state[currentUser].balance += amount;
    updateUI();

    if (btn) {
        btn.parentElement.style.opacity = '0.4';
        btn.parentElement.style.textDecoration = 'line-through';
        btn.disabled = true;
    }
}

function addMoneyPrompt() {
    let input = prompt("Wie viel Euro möchtest du einzahlen?", "5.00");
    if (input) {
        let val = parseFloat(input.replace(',', '.'));
        if (!isNaN(val)) addMoney(val);
    }
}

function openParentModal() {
    const modal = document.getElementById('parentModal');
    if (modal) modal.style.display = 'flex';
}

function closeModal(id) {
    const modal = document.getElementById(id);
    if (modal) modal.style.display = 'none';
}

function closeModalOnOuterClick(event, modalId) {
    if (event.target.id === modalId) {
        closeModal(modalId);
    }
}

function unlockParentArea() {
    const pinInput = document.getElementById('parentPin');
    if (pinInput && pinInput.value === '1234') {
        alert('Elternbereich freigeschaltet!');
        pinInput.value = '';
        closeModal('parentModal');
    } else {
        alert('Falscher PIN! Standard ist 1234.');
    }
}

// Service Worker Registrierung
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('sw.js').catch(() => {});
}

document.addEventListener('DOMContentLoaded', updateUI);
