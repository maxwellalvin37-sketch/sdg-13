// ==========================================
// CYBERSECURITY DEFENSE: XSS ELIMINATOR
// This function manually encodes all dangerous HTML characters.
// Even if an attacker injects code into the checkbox values, 
// it will safely render as plain text on the screen instead of executing.
// ==========================================
function sanitizeString(str) {
    if (!str) return '';
    return String(str)
        .replace(/&/g, '&amp;')   // Escapes &
        .replace(/</g, '&lt;')    // Escapes <
        .replace(/>/g, '&gt;')    // Escapes >
        .replace(/"/g, '&quot;')  // Escapes " (prevents attribute breakouts)
        .replace(/'/g, '&#39;');  // Escapes ' (prevents attribute breakouts)
}

// 1. Identify and grab the necessary HTML Elements
const actionSelect = document.getElementById('action-select');
const addBtn = document.getElementById('add-btn');
const totalSavedDisplay = document.getElementById('total-saved');
const progressBar = document.getElementById('progress-bar');
const resetBtn = document.getElementById('reset-btn');
const goalTargetDisplay = document.getElementById('goal-target');

// 2. Define application state variables
let totalCO2Saved = 0.0;
const monthlyGoal = 50.0; // Fixed project target in kg

// Initialize the goal text dynamically from our variable
goalTargetDisplay.textContent = monthlyGoal;

// 3. Helper function to recalculate numbers and animate the progress bar
function updateUI() {
  // Format the running total to always display precisely 1 decimal place
  totalSavedDisplay.textContent = totalCO2Saved.toFixed(1);

  // Calculate progress percentage relative to our 50kg goal
  let percentage = (totalCO2Saved / monthlyGoal) * 100;

  // Ensure the progress bar doesn't break out past 100% visually
  if (percentage > 100) {
    percentage = 100;
  }

  // Apply the percentage width directly to the CSS of the progress bar
  progressBar.style.width = percentage + '%';
}

// 4. Set up Event Listener for adding an action
addBtn.addEventListener('click', function() {
  // Read the numeric value of the currently selected dropdown option
  const selectedValue = parseFloat(actionSelect.value);
  
  // Accumulate the value into our running total
  totalCO2Saved += selectedValue;
  
  // Update our interface with the new data
  updateUI();
});

// 5. Set up Event Listener to wipe state back to zero
resetBtn.addEventListener('click', function() {
  // Double check with a standard browser confirmation dialog box
  const confirmReset = confirm("Are you sure you want to clear your current progress tracking data?");
  
  if (confirmReset) {
    totalCO2Saved = 0.0;
    updateUI();
  }
});
