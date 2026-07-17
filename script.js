// 1. Identify and grab HTML Elements
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
const climateTipDisplay = document.getElementById('climate-tip');

// 2. Preset Resources: Climate Data Array
const climateTips = [
  "Switching to cold water laundry washes protects garments while saving 90% of your machine's electric energy use.",
  "Food production is responsible for one-quarter of global greenhouse gas emissions.",
  "Leaving chargers plugged in when not connected still draws a small trickling currents of phantom power electricity.",
  "Biking or walking short distances trims emissions while lowering regional vehicle particulate air pollution levels.",
  "Hanging one load of laundry to dry outside keeps roughly 2 kilograms of CO₂ out of our atmosphere."
];

// 3. Define State Variables (with Local Storage fallback configuration)
let totalCO2Saved = parseFloat(localStorage.getItem('totalCO2Saved')) || 0.0;
let monthlyGoal = parseFloat(localStorage.getItem('monthlyGoal')) || 50.0; 
let loggedActionCount = parseInt(localStorage.getItem('loggedActionCount')) || 0;
// Load previous history strings array or fall back to an empty container setup
let savedHistoryHTML = localStorage.getItem('savedHistoryHTML') || '';

// Initialize setup state on application boot
goalInput.value = monthlyGoal;
goalTargetDisplay.textContent = monthlyGoal;
setRandomTip();
loadSavedHistory();
updateUI();

// 4. Update UI Function
function updateUI() {
  totalSavedDisplay.textContent = totalCO2Saved.toFixed(1);
  streakCountDisplay.textContent = loggedActionCount;

  // Real-world equivalence math formula: 1 kg of CO₂ saved avoids roughly 121 cell phone charges
  const cellPhonesCharged = Math.floor(totalCO2Saved * 121);
  phoneCountDisplay.textContent = cellPhonesCharged.toLocaleString();

  // Milestone validation check
  if (totalCO2Saved >= 30.0) {
    congratsMsg.className = "congrats-visible";
  } else {
    congratsMsg.className = "congrats-hidden";
  }

  // Dynamic Badges Evaluation Loop
  if (totalCO2Saved >= 40.0) {
    ecoBadge.textContent = "Rank: Climate Hero 🏆";
    ecoBadge.className = "badge-hero";
  } else if (totalCO2Saved >= 15.0) {
    ecoBadge.textContent = "Rank: Eco-Helper 🌿";
    ecoBadge.className = "badge-helper";
  } else {
    ecoBadge.textContent = "Rank: Eco-Novice 🌱";
    ecoBadge.className = "badge-novice";
  }

  // Progress calculations setup
  let percentage = (totalCO2Saved / monthlyGoal) * 100;
  if (percentage > 100) percentage = 100;
  progressBar.style.width = percentage + '%';

  // Save current dynamic state fields into the browser's storage cache
  localStorage.setItem('totalCO2Saved', totalCO2Saved);
  localStorage.setItem('monthlyGoal', monthlyGoal);
  localStorage.setItem('loggedActionCount', loggedActionCount);
}

// 5. Custom Goal Configuration
updateGoalBtn.addEventListener('click', function() {
  const parsedValue = parseFloat(goalInput.value);
  
  if (!isNaN(parsedValue) && parsedValue >= 5) {
    monthlyGoal = parsedValue;
    goalTargetDisplay.textContent = monthlyGoal;
    updateUI();
  } else {
    alert("Please enter a valid goal target parameter (minimum 5 kg).");
  }
});

// 6. Logging Actions & Tracking Operations
addBtn.addEventListener('click', function() {
  const selectedValue = parseFloat(actionSelect.value);
  const selectedOption = actionSelect.options[actionSelect.selectedIndex];
  const actionText = selectedOption.getAttribute('data-text');

  // Strip empty log placeholder view item if active
  const emptyMsg = historyList.querySelector('.empty-log-msg');
  if (emptyMsg) {
    historyList.innerHTML = ''; 
  }

  totalCO2Saved += selectedValue;
  loggedActionCount++;

  // Build list item DOM layout tracking strings
  const listItem = document.createElement('li');
  const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  
  listItem.innerHTML = `
    <span><strong>${actionText}</strong> (+${selectedValue} kg)</span>
    <span class="timestamp">${timestamp}</span>
  `;
  
  historyList.insertBefore(listItem, historyList.firstChild);
  
  // Cache the updated list HTML body directly into local storage strings
  localStorage.setItem('savedHistoryHTML', historyList.innerHTML);
  
  setRandomTip(); // Rotate tips on interactions
  updateUI();
});

// 7. Load Saved History Helper Logic
function loadSavedHistory() {
  if (savedHistoryHTML.trim() !== "") {
    historyList.innerHTML = savedHistoryHTML;
  }
}

// 8. Rotating Daily Climate Tip Handle Selection
function setRandomTip() {
  const randomIndex = Math.floor(Math.random() * climateTips.length);
  climateTipDisplay.textContent = climateTips[randomIndex];
}

// 9. Global Memory Reset Action Link Handler
resetBtn.addEventListener('click', function() {
  const confirmReset = confirm("Are you sure you want to clear your entire progress logs, cache records, and metric records?");
  
  if (confirmReset) {
    // Clear device storage memory blocks cleanly
    localStorage.clear();

    totalCO2Saved = 0.0;
    loggedActionCount = 0;
    monthlyGoal = 50.0;
    goalInput.value = 50;
    goalTargetDisplay.textContent = monthlyGoal;
    savedHistoryHTML = '';

    historyList.innerHTML = '<li class="empty-log-msg">No actions logged yet. Start saving carbon!</li>';
    
    setRandomTip();
    updateUI();
  }
});
