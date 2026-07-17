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

// 2. Define application state variables
let totalCO2Saved = 0.0;
let monthlyGoal = 50.0; 
let loggedActionCount = 0; // Tracks structural clicks/entries

// Initialize UI
goalTargetDisplay.textContent = monthlyGoal;

// 3. Helper function to update the user interface state completely
function updateUI() {
  // Format numeric strings safely
  totalSavedDisplay.textContent = totalCO2Saved.toFixed(1);
  streakCountDisplay.textContent = loggedActionCount;

  // Milestone check for 30kg trigger
  if (totalCO2Saved >= 30.0) {
    congratsMsg.className = "congrats-visible";
  } else {
    congratsMsg.className = "congrats-hidden";
  }

  // Dynamic Rank Upgrades Check
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

  // Handle dynamic percentage logic safely
  let percentage = (totalCO2Saved / monthlyGoal) * 100;
  if (percentage > 100) percentage = 100;
  progressBar.style.width = percentage + '%';
}

// 4. Feature: Custom Goal Configuration Handle
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

// 5. Logging Actions & Activity History Setup
addBtn.addEventListener('click', function() {
  const selectedValue = parseFloat(actionSelect.value);
  
  // Custom parsing to pull descriptive data out of selection menu options
  const selectedOption = actionSelect.options[actionSelect.selectedIndex];
  const actionText = selectedOption.getAttribute('data-text');

  // Remove the static default empty placeholder text if it exists
  const emptyMsg = historyList.querySelector('.empty-log-msg');
  if (emptyMsg) {
    historyList.innerHTML = ''; 
  }

  // Increment metrics
  totalCO2Saved += selectedValue;
  loggedActionCount++;

  // Build a new dynamic history list item component via document manipulation
  const listItem = document.createElement('li');
  const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  
  listItem.innerHTML = `
    <span><strong>${actionText}</strong> (+${selectedValue} kg)</span>
    <span class="timestamp">${timestamp}</span>
  `;
  
  // Insert newly recorded tracking action directly at top of container view
  historyList.insertBefore(listItem, historyList.firstChild);
  
  updateUI();
});

// 6. Global State Reset Handler
resetBtn.addEventListener('click', function() {
  const confirmReset = confirm("Are you sure you want to clear your entire progress logs and streak counters back to default parameters?");
  
  if (confirmReset) {
    totalCO2Saved = 0.0;
    loggedActionCount = 0;
    monthlyGoal = 50.0;
    goalInput.value = 50;
    goalTargetDisplay.textContent = monthlyGoal;

    // Restore standard zero logs message view
    historyList.innerHTML = '<li class="empty-log-msg">No actions logged yet. Start saving carbon!</li>';
    
    updateUI();
  }
});
