// 1. Grab HTML Elements
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

// Quiz Elements
const quizQuestion = document.getElementById('quiz-question');
const quizOptionsContainer = document.getElementById('quiz-options-container');
const quizFeedback = document.getElementById('quiz-feedback');

// 2. Resource Arrays (Tips & Quiz Questions Data)
const climateTips = [
  "Switching to cold water laundry washes protects garments while saving 90% of your machine's electric energy use.",
  "Food production is responsible for one-quarter of global greenhouse gas emissions.",
  "Leaving chargers plugged in when not connected still draws small trickling currents of phantom electricity.",
  "Biking or walking short distances trims emissions while lowering regional vehicle particulate air pollution levels.",
  "Hanging one load of laundry to dry outside keeps roughly 2 kilograms of CO₂ out of our atmosphere."
];

const quizBank = [
  { q: "Which gas is primary responsible for the greenhouse effect?", options: ["Oxygen", "Carbon Dioxide", "Nitrogen"], correct: 1 },
  { q: "What is the primary target objective of SDG 13?", options: ["Life on Land", "Clean Water", "Climate Action"], correct: 2 },
  { q: "Which food option generally demands the highest carbon output?", options: ["Beef", "Lentils", "Apples"], correct: 0 }
];

// 3. Application State Variables
let totalCO2Saved = parseFloat(localStorage.getItem('totalCO2Saved')) || 0.0;
let monthlyGoal = parseFloat(localStorage.getItem('monthlyGoal')) || 50.0; 
let loggedActionCount = parseInt(localStorage.getItem('loggedActionCount')) || 0;
let savedHistoryHTML = localStorage.getItem('savedHistoryHTML') || '';

// Initialize state
goalInput.value = monthlyGoal;
goalTargetDisplay.textContent = monthlyGoal;
setRandomTip();
loadSavedHistory();
loadNewQuiz();
updateUI();

// 4. Update UI Metrics & Storage Saves
function updateUI() {
  totalSavedDisplay.textContent = totalCO2Saved.toFixed(1);
  streakCountDisplay.textContent = loggedActionCount;

  // Real-world smart device math formulas
  phoneCountDisplay.textContent = Math.floor(totalCO2Saved * 121).toLocaleString();
  
  // Feature 1 Math: 1 mature tree absorbs ~22kg of CO2 per year (365 days)
  // Formula: (Total saved / 22) * 365 days = Days of tree processing energy equivalent
  const treeDaysEquivalent = (totalCO2Saved / 22) * 365;
  treeCountDisplay.textContent = treeDaysEquivalent.toFixed(2);

  if (totalCO2Saved >= 30.0) {
    congratsMsg.className = "congrats-visible";
  } else {
    congratsMsg.className = "congrats-hidden";
  }

  // Dynamic Badges Rank loops
  if (totalCO2Saved >= 40.0) {
    ecoBadge.textContent = "Rank: Climate Hero 🏆"; ecoBadge.className = "badge-hero";
  } else if (totalCO2Saved >= 15.0) {
    ecoBadge.textContent = "Rank: Eco-Helper 🌿"; ecoBadge.className = "badge-helper";
  } else {
    ecoBadge.textContent = "Rank: Eco-Novice 🌱"; ecoBadge.className = "badge-novice";
  }

  let percentage = (totalCO2Saved / monthlyGoal) * 100;
  if (percentage > 100) percentage = 100;
  progressBar.style.width = percentage + '%';

  // Local storage saves
  localStorage.setItem('totalCO2Saved', totalCO2Saved);
  localStorage.setItem('monthlyGoal', monthlyGoal);
  localStorage.setItem('loggedActionCount', loggedActionCount);
}

// 5. Configurator target value changes
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

// 6. Action Entry Records Setup
addBtn.addEventListener('click', function() {
  const selectedValue = parseFloat(actionSelect.value);
  const selectedOption = actionSelect.options[actionSelect.selectedIndex];
  const actionText = selectedOption.getAttribute('data-text');

  const emptyMsg = historyList.querySelector('.empty-log-msg');
  if (emptyMsg) { historyList.innerHTML = ''; }

  totalCO2Saved += selectedValue;
  loggedActionCount++;

  const listItem = document.createElement('li');
  const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  
  listItem.innerHTML = `
    <span><strong>${actionText}</strong> (+${selectedValue} kg)</span>
    <span class="timestamp">${timestamp}</span>
  `;
  
  historyList.insertBefore(listItem, historyList.firstChild);
  localStorage.setItem('savedHistoryHTML', historyList.innerHTML);
  
  setRandomTip();
  updateUI();
});

// 7. Feature 2: Load Active Quiz Selection Logic
function loadNewQuiz() {
  quizFeedback.className = "quiz-feedback-hidden";
  quizOptionsContainer.innerHTML = '';
  
  const randomQuiz = quizBank[Math.floor(Math.random() * quizBank.length)];
  quizQuestion.textContent = randomQuiz.q;

  randomQuiz.options.forEach((opt, index) => {
    const btn = document.createElement('button');
    btn.className = "quiz-btn";
    btn.textContent = opt;
    btn.addEventListener('click', () => handleQuizAnswer(index, randomQuiz.correct));
    quizOptionsContainer.appendChild(btn);
  });
}

function handleQuizAnswer(selectedIndex, correctIndex) {
  if (selectedIndex === correctIndex) {
    quizFeedback.textContent = "✨ Correct! Fantastic job! (+0.5 kg CO₂ Bonus)";
    quizFeedback.className = "correct-feed";
    totalCO2Saved += 0.5; // Award bonus carbon reduction credit for learning
    updateUI();
  } else {
    quizFeedback.textContent = "❌ Not quite right. Review the data and try another question!";
    quizFeedback.className = "wrong-feed";
  }
  // Load a new quiz question after a short delay
  setTimeout(loadNewQuiz, 3500);
}

// 8. Feature 3: Project Summary Document Generator
downloadReportBtn.addEventListener('click', function() {
  if (loggedActionCount === 0) {
    alert("Log at least one action first to generate a summary report!");
    return;
  }

  // Gather basic data logs into structured plain text strings
  let reportText = `=== SDG 13: CARBON OFFSET TRACKER REPORT ===\n`;
  reportText += `Generated on: ${new Date().toLocaleDateString()}\n\n`;
  reportText += `Total Actions Logged: ${loggedActionCount}\n`;
  reportText += `Cumulative CO2 Saved: ${totalCO2Saved.toFixed(1)} kg\n`;
  reportText += `Target Monthly Goal Progress: ${((totalCO2Saved/monthlyGoal)*100).toFixed(0)}%\n`;
  reportText += `Equivalent Tree Offset Power: ${((totalCO2Saved / 22) * 365).toFixed(2)} days\n`;
  reportText += `============================================\n`;
  reportText += `Keep working to preserve our global ecosystems!`;

  // Standard web blob down-loader construct
  const blob = new Blob([reportText], { type: "text/plain" });
  const url = URL.createObjectURL(blob);
  const tempLink = document.createElement("a");
  
  tempLink.href = url;
  tempLink.download = "Carbon_Offset_Report.txt";
  document.body.appendChild(tempLink);
  tempLink.click();
  
  // Cleanup
  document.body.removeChild(tempLink);
  URL.revokeObjectURL(url);
});

// Helper Loader Logic
function loadSavedHistory() {
  if (savedHistoryHTML.trim() !== "") historyList.innerHTML = savedHistoryHTML;
}
function setRandomTip() {
  climateTipDisplay.textContent = climateTips[Math.floor(Math.random() * climateTips.length)];
}

// 9. Reset System Memory Blocks
resetBtn.addEventListener('click', function() {
  if (confirm("Are you sure you want to completely clear your progress parameters and logs back to defaults?")) {
    localStorage.clear();
    totalCO2Saved = 0.0; loggedActionCount = 0; monthlyGoal = 50.0;
    goalInput.value = 50; goalTargetDisplay.textContent = monthlyGoal;
    savedHistoryHTML = '';
    historyList.innerHTML = '<li class="empty-log-msg">No actions logged yet. Start saving carbon!</li>';
    setRandomTip();
    loadNewQuiz();
    updateUI();
  }
});
