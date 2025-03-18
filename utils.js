// Update Display
function updateStats() {
  // Ensure money is always a valid number and round it to avoid floating-point issues
  money = Math.max(0, Math.floor(money)); // Prevent negative or NaN values
  moneyDisplay.textContent = `Money: SGD ${money.toLocaleString()}`; // Use toLocaleString for readability
  populationDisplay.textContent = `Population: ${Math.floor(population)}`;
  happinessDisplay.textContent = `Happiness: ${Math.floor(happiness)}%`;
  innovationDisplay.textContent = `Innovation Points: ${Math.floor(innovationPoints)}`;
  pollutionDisplay.textContent = `Pollution Level: ${pollution}`;
}

// Add Event to Log
function logEvent(message) {
  const eventItem = document.createElement('li');
  eventItem.textContent = message;
  log.prepend(eventItem); // Add to top of log

  // Clear the log after 5 seconds
  setTimeout(() => {
    eventItem.remove();
  }, 5000);
}

// Play Sound Effect
function playSound(soundFile) {
  if (!soundEnabled) return; // Do not play sound if sound is disabled
  console.log(`Attempting to play sound: ${soundFile}`);
  const audio = new Audio(soundFile);
  audio.play().catch((error) => {
    console.error(`Error playing sound: ${error}`);
    logEvent("Sound failed to play. Check the console for details.");
  });
}

// Toggle Sound On/Off
function toggleSound() {
  soundEnabled = !soundEnabled; // Toggle the sound state
  const soundToggleButton = document.querySelector('#buildings button[onclick="toggleSound"]');
  if (soundEnabled) {
    soundToggleButton.textContent = "Turn Off Sound";
    logEvent("Sound has been turned ON.");
  } else {
    soundToggleButton.textContent = "Turn On Sound";
    logEvent("Sound has been turned OFF.");
  }
}

// Toggle God Mode On/Off
function toggleGodMode() {
  godModeEnabled = !godModeEnabled; // Toggle the God Mode state
  const godModeButton = document.getElementById('god-mode-button'); // Use unique ID

  if (godModeEnabled) {
    godModeButton.textContent = "God Mode (ON)";
    godModeButton.style.backgroundColor = "green";
    money *= 1000; // Multiply money by 10x
    logEvent("God Mode Activated! Money increased by 1000x.");
  } else {
    godModeButton.textContent = "God Mode (OFF)";
    godModeButton.style.backgroundColor = "red";
    money /= 1000; // Divide money back to normal
    logEvent("God Mode Deactivated!");
  }

  // Ensure money remains valid after toggling God Mode
  money = Math.max(0, Math.floor(money)); // Sanitize money value
  updateStats(); // Update stats after toggling God Mode
}