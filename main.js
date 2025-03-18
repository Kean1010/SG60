// Game Variables
let money = 500; // Starting money in SGD
let population = 50; // Starting population
let happiness = 100; // Percentage
let innovationPoints = 0;
let pollution = 0; // Pollution level
let soundEnabled = true; // Default: Sound is enabled
let godModeEnabled = false; // Default: God Mode is disabled
let pollutionLogged = false; // Flag to track pollution logging
let gameOver = false; // Track if the game is over

// DOM Elements
let map, moneyDisplay, populationDisplay, happinessDisplay, innovationDisplay, pollutionDisplay, log;

document.addEventListener('DOMContentLoaded', () => {
  // Initialize DOM Elements
  map = document.getElementById('map');
  moneyDisplay = document.getElementById('money');
  populationDisplay = document.getElementById('population');
  happinessDisplay = document.getElementById('happiness');
  innovationDisplay = document.getElementById('innovation');
  pollutionDisplay = document.getElementById('pollution'); // Add this line
  log = document.getElementById('log');

  // Add God Mode Button
  const godModeButton = document.createElement('button');
  godModeButton.textContent = "God Mode (Multiply Money x10)";
  godModeButton.style.backgroundColor = "gold";
  godModeButton.style.color = "black";
  godModeButton.onclick = activateGodMode;
  godModeButton.style.display = 'none'; // Hidden by default
  document.getElementById('buildings').appendChild(godModeButton);

  // Add Toggle Sound Button
  const soundToggleButton = document.createElement('button');
  soundToggleButton.textContent = "Turn Off Sound"; // Initial text
  soundToggleButton.style.backgroundColor = "lightblue";
  soundToggleButton.style.color = "black";
  soundToggleButton.onclick = toggleSound;
  document.getElementById('buildings').appendChild(soundToggleButton);

  // Add Reduce Pollution Button
  const reducePollutionButton = document.createElement('button');
  reducePollutionButton.textContent = "Reduce Pollution (10 Innovation Points)";
  reducePollutionButton.onclick = reducePollution;
  reducePollutionButton.style.marginTop = '20px'; // Add spacing
  document.getElementById('buildings').appendChild(reducePollutionButton);

  // Initialize Interactive Map
  initializeMap();

  // Initialize Game
  updateStats();

  // Start Idle Income Generation
  startIdleIncome();
});


// Function to toggle God Mode visibility
function toggleGodModeVisibility() {
  const godModeButton = document.querySelector('#buildings button[onclick="activateGodMode"]');
  if (godModeButton) {
    if (godModeButton.style.display === 'none') {
      godModeButton.style.display = 'inline-block'; // Show the button
    } else {
      godModeButton.style.display = 'none'; // Hide the button
    }
  }
}




// Start Idle Income Generation
function startIdleIncome() {
  setInterval(() => {
    if (gameOver) return; // Stop game logic if game over

    // Sanitize inputs to ensure they are valid numbers
    const sanitizedPopulation = Math.max(0, Math.floor(population));
    const sanitizedMoney = Math.max(0, Math.floor(money));
    const sanitizedHappiness = Math.min(100, Math.max(0, Math.floor(happiness)));
    const sanitizedPollution = Math.max(0, Math.floor(pollution));

    // Calculate income based on sanitized values
    const baseIncome = sanitizedPopulation * 0.1; // Base income per person

    // Apply penalties if pollution is at or above 100
    if (sanitizedPollution >= 100) {
      population = Math.max(0, sanitizedPopulation - 5); // Decrease population by 5
      money = Math.max(0, sanitizedMoney - 50); // Decrease money by $50
      happiness = Math.max(0, sanitizedHappiness - 5); // Decrease happiness by 5
      logEvent("Pollution penalties applied: Population, money, and happiness decreased.");
    }

    // Apply penalties if happiness reaches 0
    if (sanitizedHappiness === 0) {
      money = Math.max(0, sanitizedMoney - sanitizedMoney * 0.1); // Reduce money by 10%
      population = Math.max(0, sanitizedPopulation - sanitizedPopulation * 0.1); // Reduce population by 10%
      logEvent("Happiness penalties applied: Money and population reduced by 10%.");
    }

    // Check for game over condition
    if (population <= 0) {
      gameOver = true; // Set game over flag
      endGame(); // Trigger game over logic
    }

    // Add income to money
    money = Math.max(0, sanitizedMoney + baseIncome);

    // Update stats
    updateStats();
  }, 1000); // Update every second
}

// End Game Logic
function endGame() {
  logEvent("Game Over: Population has reached 0!");
  alert("Game Over: Your population has reached 0. Restarting the game...");

  // Reset game variables
  money = 500;
  population = 50;
  happiness = 100;
  innovationPoints = 0;
  pollution = 0;
  pollutionLogged = false;
  gameOver = false;

  // Reinitialize the game
  updateStats();
}

// Update Display
function updateStats() {
  moneyDisplay.textContent = `Money: SGD ${Math.floor(money)}`;
  populationDisplay.textContent = `Population: ${Math.floor(population)}`;
  happinessDisplay.textContent = `Happiness: ${Math.floor(happiness)}%`;
  innovationDisplay.textContent = `Innovation Points: ${Math.floor(innovationPoints)}`;
  pollutionDisplay.textContent = `Pollution: ${pollution}`; // Update pollution display

  // Log pollution only once
  if (pollution > 0 && !pollutionLogged) {
    logEvent(`Pollution Level: ${pollution}`);
    pollutionLogged = true; // Set flag to true after logging
  } else if (pollution === 0) {
    pollutionLogged = false; // Reset flag when pollution drops to 0
  }
}

// Add Event to Log
function logEvent(message) {
  const eventItem = document.createElement('li');
  eventItem.textContent = message;
  log.prepend(eventItem); // Add to top of log

  // Automatically remove the log entry after 3 seconds
  setTimeout(() => {
    eventItem.remove();
  }, 3000); // 3 seconds
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

// Activate God Mode
function activateGodMode() {
  money *= 10; // Multiply money by 10
  logEvent("God Mode Activated! Money increased by 10x.");
  updateStats();
}



// Reduce Pollution Using Innovation Points and Money
function reducePollution() {
  const innovationCost = 10; // Cost in Innovation Points
  const moneyCost = 500; // Cost in money (SGD)
  const reduction = 10; // Reduction in Pollution Points

  // Check if the player has enough Innovation Points and money
  if (innovationPoints >= innovationCost && money >= moneyCost) {
    // Deduct costs
    innovationPoints -= innovationCost;
    money -= moneyCost;

    // Reduce pollution
    pollution = Math.max(0, pollution - reduction); // Ensure pollution doesn't go below 0

    // Log the event
    logEvent(`Reduced pollution by ${reduction} points using ${innovationCost} Innovation Points and $${moneyCost}.`);

    // Update stats
    updateStats();
  } else {
    // Log an error message if the player lacks resources
    logEvent("Not enough Innovation Points and/or money to reduce pollution!");
    playSound('assets/sounds/sad_sound.mp3'); // Play negative sound
  }
}
