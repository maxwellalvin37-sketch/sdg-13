// ==========================================================================
// App State Properties & Initialization Data
// ==========================================================================
let state = {
  totalSaved: 0.0,
  monthlyGoal: 50,
  actionCount: 0,
  breakdown: { preset: 0.0, custom: 0.0, quests: 0.0 },
  history: [],
  completedQuests: []
};

const RANDOM_TIPS = [
  "Small actions added up by thousands of people make a massive worldwide difference.",
  "Replacing a short driving commute with walking saves roughly 0.24kg of CO2 per kilometer.",
  "LED light bulbs consume up to 85% less power than standard traditional variants.",
  "Fixing a leaky hot water tap can save substantial energy used for heating utility reservoirs."
];

const WEEKLY_QUESTS = [
  { id: "q1", title: "Energy Auditor", reward: 2.5, desc: "Turn off all standby electronics overnight (+2.5 kg)" },
  { id: "q2", title: "Local Food Warrior", reward: 4.0, desc: "Source your ingredients entirely locally (+4.0 kg)" }
];

// ==========================================================================
// DOM Elements Map Selector
// ==========================================================================
const DOM = {
  tabPreset: document.getElementById('tab-preset-btn'),
  tabCustom: document.getElementById('tab-custom-btn'),
  viewPreset: document.getElementById('preset-tab-view'),
  viewCustom: document.getElementById('custom-tab-view'),
  
  goalInput: document.getElementById('goal-input'),
  updateGoalBtn: document.getElementById('update-goal-btn'),
  goalTargetDisplay: document.getElementById('goal-target'),
  
  actionSelect: document.getElementById('action-select'),
  addPresetBtn: document.getElementById('add-btn'),
  
  customName: document.getElementById('custom-name'),
  customValue: document.getElementById('custom-value'),
  addCustomBtn: document.getElementById('add-custom-btn'),
  
  challengesContainer: document.getElementById('challenges-list-container'),
  
  streakCount: document.getElementById('streak-count'),
  totalSaved: document.getElementById('total-saved'),
  progressBar: document.getElementById('progress-bar'),
  congratsMsg: document.getElementById('congrats-msg'),
  ecoBadge: document.getElementById('eco-badge'),
  
  phoneCount: document.getElementById('phone-count'),
  treeCount: document.getElementById('tree-count'),
  
  fillPreset: document.getElementById('chart-fill-preset'),
  fillCustom: document.getElementById('chart-fill-custom'),
  fillQuests: document.getElementById('chart-fill-quests'),
  valPreset: document.getElementById('chart-val-preset'),
  valCustom: document.getElementById('chart-val-custom'),
  valQuests: document.getElementById('chart-val-quests'),
  
  trophyFirst: document.getElementById('trophy-first'),
  trophyHalf: document.getElementById('trophy-half'),
  trophyGoal: document.getElementById('trophy-goal'),
  
  userScore: document.getElementById('user-leaderboard-score'),
  historyList: document.getElementById('history-list'),
  climateTip: document.getElementById('climate-tip'),
  
  downloadBtn: document.getElementById('download-report-btn'),
  resetBtn: document.getElementById('reset-btn')
};

// ==========================================================================
// Core State & Sync Handlers
// ==========================================================================
function init() {
  const savedData = localStorage.getItem('sdg13_tracker_data');
  if (savedData) {
    try {
      state = JSON.parse(savedData);
    } catch (e) {
      console.error("Error reading saved tracker data profile state.", e);
    }
  }
  
  setupListeners();
  renderQuests();
  updateUI();
  rotateTip();
}

function saveToStorage() {
  localStorage.setItem('sdg13_tracker_data', JSON.stringify(state));
}

// ==========================================================================
// UI Rendering Pipeline
// ==========================================================================
function updateUI() {
  // Numeric Stats
  DOM.totalSaved.textContent = state.totalSaved.toFixed(1);
  DOM.goalTargetDisplay.textContent = state.monthlyGoal;
  DOM.goalInput.value = state.monthlyGoal;
  DOM.streakCount.textContent = state.actionCount;
  DOM.userScore.textContent = `${state.totalSaved.toFixed(1)} kg`;

  // Progress Bar Calculations
  const progressPercent = Math.min((state.totalSaved / state.monthlyGoal) * 100, 100);
  DOM.progressBar.style.width = `${progressPercent}%`;

  // Milestone Alert Logic (Triggered at 30kg)
  if (state.totalSaved >= 30) {
    DOM.congratsMsg.className = "congrats-visible";
  } else {
    DOM.congratsMsg.className = "congrats-hidden";
  }

  // Eco Ranks Engine
  if (state.totalSaved >= 50) {
    DOM.ecoBadge.className = "badge-champion";
    DOM.ecoBadge.textContent = "Rank: Eco-Champion 👑";
  } else if (state.totalSaved >= 20) {
    DOM.ecoBadge.className = "badge-warrior";
    DOM.ecoBadge.textContent = "Rank: Eco-Warrior ⛰️";
  } else {
    DOM.ecoBadge.className = "badge-novice";
    DOM.ecoBadge.textContent = "Rank: Eco-Novice 🌱";
  }

  // Equivalencies Math Rules
  // 1kg CO2 = ~122 smartphone charges
  // 1kg CO2 = ~0.06 tree absorption days (approx 16.5kg standard tree capacity year)
  DOM.phoneCount.textContent = Math.floor(state.totalSaved * 122);
  DOM.treeCount.textContent = (state.totalSaved * 0.06).toFixed(2);

  // Pure CSS Charts Calculations
  updateMicroChart(DOM.fillPreset, DOM.valPreset, state.breakdown.preset);
  updateMicroChart(DOM.fillCustom, DOM.valCustom, state.breakdown.custom);
  updateMicroChart(DOM.fillQuests, DOM.valQuests, state.breakdown.quests);

  // Lock & Key Achievements State Switcher
  if (state.actionCount >= 1) DOM.trophyFirst.classList.remove('locked');
  if (state.totalSaved >= 25) DOM.trophyHalf.classList.remove('locked');
  if (state.totalSaved >= state.monthlyGoal) DOM.trophyGoal.classList.remove('locked');

  // Activity Log Renderer
  renderHistory();
}

function updateMicroChart(barFill, labelElement, categoryValue) {
  const maximumTrack = Math.max(state.breakdown.preset, state.breakdown.custom, state.breakdown.quests, 1);
  const scalePercent = (categoryValue / maximumTrack) * 100;
  barFill.style.width = `${scalePercent}%`;
  labelElement.textContent = `${categoryValue.toFixed(1)}kg`;
}

function renderHistory() {
  DOM.historyList.innerHTML = "";
  if (state.history.length === 0) {
    DOM.historyList.innerHTML = `<li class="empty-log-msg">No actions logged yet. Start saving carbon!</li>`;
    return;
  }

  // Render recent logs top-first
  [...state.history].reverse().forEach(item => {
    const li = document.createElement('li');
    li.innerHTML = `<span>${item.text}</span><strong>+${item.value.toFixed(1)} kg</strong>`;
    DOM.historyList.appendChild(li);
  });
}

function renderQuests() {
  DOM.challengesContainer.innerHTML = "";
  WEEKLY_QUESTS.forEach(quest => {
    const isClaimed = state.completedQuests.includes(quest.id);
    const box = document.createElement('div');
    box.className = "quest-item-box";
    
    box.innerHTML = `
      <div class="quest-details">
        <h4>${quest.title}</h4>
        <p>${quest.desc}</p>
      </div>
      <button class="btn-quest-claim ${isClaimed ? 'claimed' : ''}" data-id="${quest.id}" ${isClaimed ? 'disabled' : ''}>
        ${isClaimed ? 'Claimed' : 'Claim'}
      </button>
    `;
    DOM.challengesContainer.appendChild(box);
  });
}

function rotateTip() {
  const idx = Math.floor(Math.random() * RANDOM_TIPS.length);
  DOM.climateTip.textContent = RANDOM_TIPS[idx];
}

// ==========================================================================
// Action Loggers & Logic Flow Actions
// ==========================================================================
function addCarbonReduction(value, actionText, type) {
  const numericVal = parseFloat(value);
  if (isNaN(numericVal) || numericVal <= 0) return;

  state.totalSaved += numericVal;
  state.actionCount += 1;
  state.breakdown[type] += numericVal;
  
  state.history.push({
    text: actionText,
    value: numericVal,
    timestamp: new Date().toISOString()
  });

  saveToStorage();
  updateUI();
}

// ==========================================================================
// Event Listeners Routing Wireframe
// ==========================================================================
function setupListeners() {
  // View Form Tab Alternators
  DOM.tabPreset.addEventListener('click', () => {
    DOM.tabPreset.classList.add('active');
    DOM.tabCustom.classList.remove('active');
    DOM.viewPreset.classList.add('active');
    DOM.viewCustom.classList.remove('active');
  });

  DOM.tabCustom.addEventListener('click', () => {
    DOM.tabCustom.classList.add('active');
    DOM.tabPreset.classList.remove('active');
    DOM.viewCustom.classList.add('active');
    DOM.viewPreset.classList.remove('active');
  });

  // Target Goal Configurations
  DOM.updateGoalBtn.addEventListener('click', () => {
    const val = parseInt(DOM.goalInput.value);
    if (!isNaN(val) && val >= 5 && val <= 500) {
      state.monthlyGoal = val;
      saveToStorage();
      updateUI();
    }
  });

  // Action Submission Handlers
  DOM.addPresetBtn.addEventListener('click', () => {
    const option = DOM.actionSelect.options[DOM.actionSelect.selectedIndex];
    const val = option.value;
    const txt = option.getAttribute('data-text') || option.textContent;
    addCarbonReduction(val, txt, 'preset');
  });

  DOM.addCustomBtn.addEventListener('click', () => {
    const name = DOM.customName.value.trim();
    const val = DOM.customValue.value;
    
    if (!name) {
      alert("Please provide an action title for your custom log entry.");
      return;
    }
    if (!val || parseFloat(val) <= 0) {
      alert("Please specify a baseline positive metric number of carbon saved.");
      return;
    }
    
    addCarbonReduction(val, name, 'custom');
    DOM.customName.value = "";
    DOM.customValue.value = "";
  });

  // Challenge Container Delegation Click Maps
  DOM.challengesContainer.addEventListener('click', (e) => {
    if (e.target.classList.contains('btn-quest-claim') && !e.target.classList.contains('claimed')) {
      const qId = e.target.getAttribute('data-id');
      const quest = WEEKLY_QUESTS.find(q => q.id === qId);
      if (quest) {
        state.completedQuests.push(qId);
        addCarbonReduction(quest.reward, `Completed Quest: ${quest.title}`, 'quests');
        renderQuests();
      }
    }
  });

  // Export Data Summary Plain-Text Report
  DOM.downloadBtn.addEventListener('click', () => {
    let output = `SDG 13 CARBON METRICS DATA REPORT\n`;
    output += `==================================\n`;
    output += `Total Carbon Offset Saved: ${state.totalSaved.toFixed(2)} kg\n`;
    output += `Current Set Target Goal: ${state.monthlyGoal} kg\n`;
    output += `Total Logs Written: ${state.actionCount}\n\n`;
    output += `Distribution Analysis Logs:\n`;
    output += `- Presets: ${state.breakdown.preset.toFixed(1)} kg\n`;
    output += `- Customs: ${state.breakdown.custom.toFixed(1)} kg\n`;
    output += `- Quests: ${state.breakdown.quests.toFixed(1)} kg\n\n`;
    output += `Logged Timeline History Entries:\n`;
    
    if (state.history.length === 0) {
      output += `No data items logged.`;
    } else {
      state.history.forEach((h, i) => {
        output += `[${i+1}] ${h.text} -> saved +${h.value.toFixed(1)}kg\n`;
      });
    }

    const blob = new Blob([output], { type: 'text/plain' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'Carbon_Offset_Report.txt';
    link.click();
  });

  // Flash Cleaner Reset Tracker Data
  DOM.resetBtn.addEventListener('click', () => {
    if (confirm("Are you sure you want to completely flush your metrics history tracker data?")) {
      state = {
        totalSaved: 0.0,
        monthlyGoal: 50,
        actionCount: 0,
        breakdown: { preset: 0.0, custom: 0.0, quests: 0.0 },
        history: [],
        completedQuests: []
      };
      
      // Force visual class updates back to locked paradigm state safely
      DOM.trophyFirst.classList.add('locked');
      DOM.trophyHalf.classList.add('locked');
      DOM.trophyGoal.classList.add('locked');
      
      saveToStorage();
      renderQuests();
      updateUI();
    }
  });
}

// Kick off initialization loop lifecycle
document.addEventListener('DOMContentLoaded', init);
