// TASCHENGELD APP PRO - LOGIC ENGINE
let currentUser = 'Jairo';
let currentTheme = 'dark';
let parentPin = '1234';

let state = {
    Jairo: { balance: 0.00, target: 50.00, completedTasks: [] },
    Eva: { balance: 0.00, target: 50.00, completedTasks: [] }
};

let defaultTasks = [
    { id: 1, title: 'Zimmer aufräumen', cat: 'Zimmer', price: 2.00, icon: '🧹' },
    { id: 2, title: 'Geschirrspüler ausräumen', cat: 'Küche', price: 1.50, icon: '🍽️' },
    { id: 3, title: 'Müll rausbringen', cat: 'Wohnung', price: 1.00, icon: '🗑️' },
    { id: 4, title: 'Rasen mähen', cat: 'Garten', price: 5.00, icon: '🌱' },
    { id: 5, title: 'Hausaufgaben machen', cat: 'Schule', price: 2.50, icon: '📚' },
    { id: 6, title: 'Hund ausführen', cat: 'Haustier', price: 2.00, icon: '🐶' }
];

let tasks = [...defaultTasks];
let badges = [
    { id: 'b1', title: 'Erster Schritt', desc: 'Erste Aufgabe erledigt', icon: '🌟', minEarned: 0.01 },
    { id: 'b2', title: '10 Euro Sparer', desc: '10 € Gesamteinnahmen', icon: '💰', minEarned: 10 },
    { id: 'b3', title: '50 Euro Profi', desc: '50 € Gesamteinnahmen', icon: '🥇', minEarned: 50 },
    { id: 'b4', title: '100 Euro Champ', desc: '100 € Gesamteinnahmen', icon: '👑', minEarned: 100 }
];

// INIT APP
document.addEventListener('DOMContentLoaded', () => {
    loadLocalData();
    renderDashboard();
    renderTasks('all');
    renderCalendar();
    renderBadges();
    fetchWeather();
    setupEventListeners();
});

function loadLocalData() {
    const saved = localStorage.getItem('taschengeld_state');
    if (saved) state = JSON.parse(saved);
    const savedTasks = localStorage.getItem('taschengeld_tasks');
    if (savedTasks) tasks = JSON.parse(savedTasks);
}

function saveData() {
    localStorage.setItem('taschengeld_state', JSON.stringify(state));
    localStorage.setItem('taschengeld_tasks', JSON.stringify(tasks));
}

function switchUser(user) {
    currentUser = user;
    document.getElementById('btn-user-jairo').classList.toggle('active', user === 'Jairo');
    document.getElementById('btn-user-eva').classList.toggle('active', user === 'Eva');
    document.getElementById('greeting-text').innerText = `Hallo ${user} 👋`;
    renderDashboard();
    renderTasks('all');
    renderBadges();
    renderCalendar();
}

function renderDashboard() {
    const uData = state[currentUser];
    document.getElementById('balance-value').innerText = uData.balance.toFixed(2).replace('.', ',');
    document.getElementById('target-max-val').innerText = `${uData.target.toFixed(2)} €`;
    
    const percent = Math.min(100, Math.round((uData.balance / uData.target) * 100));
    document.getElementById('target-percent-text').innerText = `${percent}%`;
    document.getElementById('target-progress-fill').style.width = `${percent}%`;
    
    const rest = Math.max(0, uData.target - uData.balance);
    document.getElementById('target-rest-text').innerText = rest === 0 ? 'Ziel erreicht! 🎉' : `Noch ${rest.toFixed(2)} € bis zum Ziel`;
}

function renderTasks(filterCat) {
    const container = document.getElementById('tasks-list-container');
    container.innerHTML = '';

    const filtered = filterCat === 'all' ? tasks : tasks.filter(t => t.cat === filterCat);
    
    filtered.forEach(t => {
        const item = document.createElement('div');
        item.className = 'task-item glass-card';
        item.innerHTML = `
            <div class="task-left">
                <div class="task-icon-box">${t.icon}</div>
                <div class="task-info">
                    <h4>${t.title}</h4>
                    <span class="task-cat">${t.cat}</span>
                </div>
            </div>
            <div class="task-right">
                <span class="task-price">+${t.price.toFixed(2)} €</span>
                <button class="btn-complete" onclick="completeTask(${t.id})">Erledigen</button>
            </div>
        `;
        container.appendChild(item);
    });
}

function completeTask(taskId) {
    const task = tasks.find(t => t.id === taskId);
    if (!task) return;

    state[currentUser].balance += task.price;
    state[currentUser].completedTasks.push({
        id: task.id,
        title: task.title,
        price: task.price,
        date: new Date().toISOString()
    });

    saveData();
    renderDashboard();
    renderBadges();
    
    showSnackbar(`+${task.price.toFixed(2)} € für "${task.title}" gutgeschrieben!`);
    
    if (window.confetti) {
        confetti({ particleCount: 50, spread: 60, origin: { y: 0.8 } });
    }
}

function renderBadges() {
    const container = document.getElementById('badges-container');
    container.innerHTML = '';
    const earned = state[currentUser].balance;

    badges.forEach(b => {
        const isUnlocked = earned >= b.minEarned;
        const card = document.createElement('div');
        card.className = `badge-card glass-card ${isUnlocked ? 'unlocked' : ''}`;
        card.innerHTML = `
            <div class="badge-icon">${b.icon}</div>
            <div class="badge-title">${b.title}</div>
            <div class="badge-desc">${b.desc}</div>
        `;
        container.appendChild(card);
    });
}

function renderCalendar() {
    const grid = document.getElementById('calendar-days-grid');
    grid.innerHTML = '';
    
    for (let i = 1; i <= 31; i++) {
        const dayEl = document.createElement('div');
        dayEl.className = 'cal-day';
        dayEl.innerText = i;
        if (i === 15 || i === 20) dayEl.classList.add('completed');
        grid.appendChild(dayEl);
    }
}

function switchTab(tabName) {
    document.querySelectorAll('.view-section').forEach(s => s.classList.remove('active'));
    document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
    
    document.getElementById(`view-${tabName}`).classList.add('active');
    document.getElementById(`nav-${tabName}`).classList.add('active');
}

function showSnackbar(msg) {
    const sb = document.getElementById('snackbar');
    document.getElementById('snackbar-msg').innerText = msg;
    sb.classList.add('active');
    setTimeout(() => sb.classList.remove('active'), 3000);
}

function fetchWeather() {
    document.getElementById('weather-temp').innerText = '24 °C';
    document.getElementById('weather-city').innerText = 'Sonnig in deiner Stadt';
    document.getElementById('weather-sunrise').innerText = '05:45';
    document.getElementById('weather-sunset').innerText = '21:15';
}

function setupEventListeners() {
    document.querySelectorAll('.chip').forEach(c => {
        c.addEventListener('click', (e) => {
            document.querySelectorAll('.chip').forEach(ch => ch.classList.remove('active'));
            e.target.classList.add('active');
            renderTasks(e.target.getAttribute('data-cat'));
        });
    });

    document.getElementById('open-parent-modal').onclick = () => {
        document.getElementById('parent-pin-modal').classList.add('active');
    };

    document.getElementById('close-pin-modal').onclick = () => {
        document.getElementById('parent-pin-modal').classList.remove('active');
    };

    document.getElementById('submit-pin-btn').onclick = () => {
        const pin = document.getElementById('parent-pin-input').value;
        if (pin === parentPin) {
            document.getElementById('parent-pin-modal').classList.remove('active');
            document.getElementById('parent-panel-modal').classList.add('active');
            document.getElementById('parent-pin-input').value = '';
            renderParentTasksList();
        } else {
            alert('Falscher PIN!');
        }
    };

    document.getElementById('close-parent-panel').onclick = () => {
        document.getElementById('parent-panel-modal').classList.remove('active');
    };

    document.getElementById('create-task-form').onsubmit = (e) => {
        e.preventDefault();
        const title = document.getElementById('task-title-in').value;
        const cat = document.getElementById('task-cat-in').value;
        const price = parseFloat(document.getElementById('task-price-in').value);
        const icon = document.getElementById('task-icon-in').value || '📝';

        tasks.push({ id: Date.now(), title, cat, price, icon });
        saveData();
        renderTasks('all');
        renderParentTasksList();
        e.target.reset();
    };
}

function renderParentTasksList() {
    const list = document.getElementById('parent-tasks-list');
    list.innerHTML = '';
    tasks.forEach(t => {
        const item = document.createElement('div');
        item.style.display = 'flex';
        item.style.justifySpaceBetween = 'space-between';
        item.style.margin = '8px 0';
        item.innerHTML = `
            <span>${t.icon} ${t.title} (${t.price.toFixed(2)} €)</span>
            <button onclick="deleteTask(${t.id})" class="btn btn-danger">Löschen</button>
        `;
        list.appendChild(item);
    });
}

function deleteTask(id) {
    tasks = tasks.filter(t => t.id !== id);
    saveData();
    renderTasks('all');
    renderParentTasksList();
}

function changeTheme(theme) {
    document.body.setAttribute('data-theme', theme);
}

function switchParentTab(ptab) {
    document.querySelectorAll('.ptab-btn').forEach(b => b.classList.remove('active'));
    document.querySelectorAll('.ptab-content').forEach(c => c.classList.remove('active'));
    
    document.getElementById(`ptab-${ptab}`).classList.add('active');
}
