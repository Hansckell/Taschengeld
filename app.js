let currentUser = 'Jairo';

let state = {
    'Jairo': { balance: 12.50, target: 50.00 },
    'Eva': { balance: 18.00, target: 50.00 }
};

function switchUser(name) {
    currentUser = name;
    
    document.getElementById('btn-jairo').classList.toggle('active', name === 'Jairo');
    document.getElementById('btn-eva').classList.toggle('active', name === 'Eva');
    document.getElementById('profile-label').innerText = `Guthaben von ${name}`;
    
    updateUI();
}

function updateUI() {
    const data = state[currentUser];
    document.getElementById('balance-display').innerText = data.balance.toFixed(2).replace('.', ',') + ' €';
    
    const pct = Math.min(100, Math.round((data.balance / data.target) * 100));
    document.getElementById('goal-progress').style.width = pct + '%';
    document.getElementById('goal-text').innerText = `Sparziel: ${data.target.toFixed(2).replace('.', ',')} € (${pct}%)`;
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
        alert('Falscher PIN! Standard ist 1234.');
    }
}

// Service Worker Registrierung
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('sw.js').catch(() => {});
}

document.addEventListener('DOMContentLoaded', updateUI);