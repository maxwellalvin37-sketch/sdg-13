// 1. Core Document Element Node Connections
const actionSelect = document.getElementById('action-select');
const addBtn = document.getElementById('add-btn');
const totalSavedDisplay = document.getElementById('total-saved');
const progressBar = document.getElementById('progress-bar');
const resetBtn = document.getElementById('reset-btn');
const goalTargetDisplay = document.getElementById('goal-target');
const congratsMsg = document.getElementById('congrats-msg');
const ecoBadge = document.getElementById('eco-badge');
const goalInput = document.getElementById('goal-input');
const updateGoalBtn = document.getElementById('update-goal-btn');
const streakCountDisplay = document.getElementById('streak-count');
const historyList = document.getElementById('history-list');
const phoneCountDisplay = document.getElementById('phone-count');
const treeCountDisplay = document.getElementById('tree-count');
const climateTipDisplay = document.getElementById('climate-tip');
const downloadReportBtn = document.getElementById('download-report-btn');

// Custom Input Additions
const customNameInput = document.getElementById('custom-name');
const customValueInput = document.getElementById('custom-value');
const addCustomBtn = document.getElementById('add-custom-btn');

// Analytics Graph Node Map
const fillPreset = document.getElementById('chart-fill-preset');
const fillCustom = document.getElementById('chart-fill-custom');
const fillQuests = document.getElementById('chart-fill-quests');
const valPreset = document.getElementById('chart-val-preset');
const valCustom = document.getElementById('chart-val-custom');
const valQuests = document.getElementById('chart-val-quests');

// Gamified Challenges & Leaderboard Handles
const challengesContainer = document.getElementById('challenges-list-container');
const userLeaderboardScore = document.getElementById('user-leaderboard-score');
const userRankNum = document.getElementById('user-rank-num');

// 2. Mock Databases (Tips & Active Challenge Sets)
const climateTips = [
  "Switching laundry cycles to cold cycles preserves fabric integrity while reducing up to 90% of structural appliance energy draws.",
  "Food manufacturing output processes comprise roughly 26% of tracking planetary warming emissions outputs.",
  "Leaving active transformation bricks plugged in draws secondary phantom vampire loading lines continuously.",
  "Transitioning simple grocery logistics into a canvas bag cuts processing waste counts significantly over time."
];

const currentQuests = [
  { id: "q1", title: "Eco-Informed", desc: "Unplugged unused home electronics for 5 hours", reward: 2.5 },
  { id: "q2", title: "Conservation Master", desc: "Took a short shower under 4 minutes", reward: 1.8 }
];

// 3. Central Application State Variables (with LocalStorage Syncing)
let totalCO2Saved = parseFloat(localStorage.getItem('totalCO2Saved')) || 0.0;
let monthlyGoal = parseFloat(localStorage.getItem('monthlyGoal')) || 50.0;
let loggedActionCount = parseInt(localStorage.getItem('loggedActionCount')) || 0;
let savedHistoryHTML = localStorage.getItem('savedHistoryHTML') || '';

// Analytics tracking sub-allocations
let catPresetVal = parseFloat(localStorage.getItem('catPresetVal')) || 0.0;
let catCustomVal = parseFloat(localStorage.getItem('catCustomVal')) || 0.0;
let catQuestsVal = parseFloat(localStorage.getItem('catQuestsVal')) || 0.0;

// Track status indices of quest challenges
let completedQuestIds = JSON.parse(localStorage.getItem('completedQuestIds')) || [];

// 4. Initial Launch Sequencing
goalInput.value = monthlyGoal;
goalTargetDisplay.textContent = monthlyGoal;
setRandomTip();
loadSavedHistory();
renderChallenges();
updateUI();

// 5. Interface Layout Switching Function (Form Tabs)
window.switchLogTab = function(tabType) {
  document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
  document.querySelectorAll('.tab-view').forEach(view => view.classList.remove('active'));
  
  if (tabType === 'preset') {
    document.querySelector("button[onclick*='preset']").classList.add('active');
    document.getElementById('preset-tab-view').classList.add('active');
  } else {
    document.querySelector("button[onclick*='custom']").classList.add('active');
    document.getElementById('custom-tab-view').classList.add('active');
  }
};

// 6. Dynamic Evaluation Engine (Renders metrics, graphs, trophies & leaderboard)
function updateUI() {
  totalSavedDisplay.textContent = totalCO2Saved.toFixed(1);
  streakCountDisplay.textContent = loggedActionCount;
  userLeaderboardScore.textContent = totalCO2Saved.toFixed(1) + " kg";

  // Equivalencies mapping
  phoneCountDisplay.textContent = Math.floor(totalCO2Saved * 121).toLocaleString();
  treeCountDisplay.textContent = ((totalCO2Saved / 22) * 365).toFixed(2);

  // 30kg milestone alert
  if (totalCO2Saved >= 30.0) {
    congratsMsg.className = "congrats-visible";
  } else {
    congratsMsg.className = "congrats-hidden";
  }

  // Dynamic ranking logic
  if (totalCO2Saved >= 40.0) {
    ecoBadge.textContent = "Rank: Climate Hero 🏆"; ecoBadge.className = "badge-hero";
  } else if (totalCO2Saved >= 15.0) {
    ecoBadge.textContent = "Rank: Eco-Helper 🌿"; ecoBadge.className = "badge-helper";
  } else {
    ecoBadge.textContent = "Rank: Eco-Novice 🌱"; ecoBadge.className = "badge-novice";
  }

  // Progress Bar rendering
  let mainPercentage = (totalCO2Saved / monthlyGoal) * 100;
  if (mainPercentage > 100) mainPercentage = 100;
  progressBar.style.width = mainPercentage + '%';

  // Render pure CSS Graph segments
  valPreset.textContent = catPresetVal.toFixed(1) + "kg";
  valCustom.textContent = catCustomVal.toFixed(1) + "kg";
  valQuests.textContent = catQuestsVal.toFixed(1) + "kg";

  let maxDistribution = Math.max(catPresetVal, catCustomVal, catQuestsVal, 1.0);
  fillPreset.style.width = ((catPresetVal / maxDistribution) * 100) + '%';
  fillCustom.style.width = ((catCustomVal / maxDistribution) * 100) + '%';
  fillQuests.style.width = ((catQuestsVal / maxDistribution) * 100) + '%';

  // Gamified Leaderboard re-ranking calculations
  if (totalCO2Saved > 64.5) {
    userRankNum.textContent = "1";
  } else if (totalCO2Saved > 12.2) {
    userRankNum.textContent = "2";
  } else {
    userRankNum.textContent = "3";
  }

  // Dynamic Trophy Unlocks Tracker
  if (loggedActionCount >= 1) document.getElementById('trophy-first').classList.add('unlocked');
  if (totalCO2Saved >= 25.0) document.getElementById('trophy-half').classList.add('unlocked');
  if (totalCO2Saved >= monthlyGoal) document.getElementById('trophy-goal').classList.add('unlocked');

  // Sync state data safely to LocalStorage
  localStorage.setItem('totalCO2Saved', totalCO2Saved);
  localStorage.setItem('monthlyGoal', monthlyGoal);
  localStorage.setItem('loggedActionCount', loggedActionCount);
  localStorage.setItem('catPresetVal', catPresetVal);
  localStorage.setItem('catCustomVal', catCustomVal);
  localStorage.setItem('catQuestsVal', catQuestsVal);
}

// 7. Core Inputs Management
addBtn.addEventListener('click', function() {
  const value = parseFloat(actionSelect.value);
  const text = actionSelect.options[actionSelect.selectedIndex].getAttribute('data-text');
  
  catPresetVal += value;
  logActionToHistory(text, value);
});

addCustomBtn.addEventListener('click', function() {
  const titleText = customNameInput.value.trim();
  const rawNumVal = parseFloat(customValueInput.value);

  if (titleText === "" || isNaN(rawNumVal) || rawNumVal <= 0) {
    alert("Please fill out both custom fields correctly (value must be greater than zero).");
    return;
  }

  catCustomVal += rawNumVal;
  logActionToHistory(titleText, rawNumVal);

  // Clear tracking inputs
  customNameInput.value = '';
  customValueInput.value = '';
});

// 8. History Log Integration Core Logic
function logActionToHistory(description, outputValue) {
  const placeholder = historyList.querySelector('.empty-log-msg');
  if (placeholder) historyList.innerHTML = '';

  totalCO2Saved += outputValue;
  loggedActionCount++;

  const item = document.createElement('li');
  const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  item.innerHTML = `<span><strong>${description}</strong> (+${outputValue.toFixed(1)} kg)</span><span class="timestamp">${time}</span>`;
  
  historyList.insertBefore(item, historyList.firstChild);
  localStorage.setItem('savedHistoryHTML', historyList.innerHTML);
  
  setRandomTip();
  updateUI();
}

// 9. Challenge Quest Generator Core System
function renderChallenges() {
  challengesContainer.innerHTML = '';
  currentQuests.forEach(quest => {
    const row = document.createElement('div');
    row.className = "quest-row";
    
    const isDone = completedQuestIds.includes(quest.id);
    
    row.innerHTML = `
      <div class="quest-info">
        <strong>${quest.title}</strong>
        <span>${quest.desc} (+${quest.reward} kg)</span>
      </div>
      <div id="status-box-${quest.id}">
        ${isDone ? '<span class="quest-done">✅ Claimeded</span>' : `<button class="btn-quest" onclick="claimQuest('${quest.id}', ${quest.reward})">Claim</button>`}
      </div>
    `;
    challengesContainer.appendChild(row);
  });
}

window.claimQuest = function(id, value) {
  completedQuestIds.push(id);
  localStorage.setItem('completedQuestIds', JSON.stringify(completedQuestIds));
  
  catQuestsVal += value;
  
  // Transform structural buttons instantly inside targeting container
  document.getElementById(`status-box-${id}`).innerHTML = '<span class="quest-done">✅ Claimed</span>';
  logActionToHistory(`Quest: ${currentQuests.find(q=>q.id===id).title}`, value);
};

// 10. Update Goal Threshold Target Parameters
updateGoalBtn.addEventListener('click', function() {
  const val = parseFloat(goalInput.value);
  if (!isNaN(val) && val >= 5) {
    monthlyGoal = val;
    goalTargetDisplay.textContent = monthlyGoal;
    
    // Reset achievement status dynamically if goals move outwards
    if (totalCO2Saved < monthlyGoal) document.getElementById('trophy-goal').classList.remove('unlocked');
    updateUI();
  } else {
    alert("Please enter a valid configuration goal parameters above 5 kg.");
  }
});

// 11. Plain Text Project Summary Report Exporter
downloadReportBtn.addEventListener('click', function() {
  if (loggedActionCount === 0) {
    alert("Log an action first to generate a summary report!");
    return;
  }
  let report = `=== SDG 13 PROJECT TRACKING SUMMARY REPORT ===\n`;
  report += `Generated: ${new Date().toLocaleDateString()}\n\n`;
  report += `Logged Actions Count: ${loggedActionCount}\n`;
  report += `Total CO2 Reduction Metric: ${totalCO2Saved.toFixed(1)} kg\n`;
  report += `Current Target Threshold Alignment Progress: ${((totalCO2Saved/monthlyGoal)*100).toFixed(0)}%\n\n`;
  report += `--- LOG SOURCE DETAILS ---\n`;
  report += `- Preset Drops: ${catPresetVal.toFixed(1)} kg\n`;
  report += `- Custom Action Entries: ${catCustomVal.toFixed(1)} kg\n`;
  report += `- Accomplished Quests Bonuses: ${catQuestsVal.toFixed(1)} kg\n`;
  report += `==============================================\n`;
  report += `Keep supporting environmental change targets!`;

  const blob = new Blob([report], { type: "text/plain" });
  const downloadLink = document.createElement("a");
  downloadLink.href = URL.createObjectURL(blob);
  downloadLink.download = "Carbon_Tracker_Report.txt";
  document.body.appendChild(downloadLink);
  downloadLink.click();
  document.body.removeChild(downloadLink);
});

// Loader & Housekeeping Helpers
function loadSavedHistory() { if (savedHistoryHTML.trim() !== "") historyList.innerHTML = savedHistoryHTML; }
function setRandomTip() { climateTipDisplay.textContent = climateTips[Math.floor(Math.random() * climateTips.length)]; }

// 12. Full Purge Operations Link Handle
resetBtn.addEventListener('click', function() {
  if (confirm("Are you sure you want to completely clear your progress parameters and local device history caches?")) {
    localStorage.clear();
    totalCO2Saved = 0.0; loggedActionCount = 0; monthlyGoal = 50.0;
    catPresetVal = 0.0; catCustomVal = 0.0; catQuestsVal = 0.0;
    completedQuestIds = [];
    goalInput.value = 50; goalTargetDisplay.textContent = monthlyGoal;
    historyList.innerHTML = '<li class="empty-log-msg">No actions logged yet. Start saving carbon!</li>';
    
    // Clear unlock classes visually from trophy boards
    document.querySelectorAll('.trophy-item').forEach(el => el.classList.remove('unlocked'));
    
    setRandomTip();
    renderChallenges();
    updateUI();
  }
});
