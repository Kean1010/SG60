// Game Variables
let money = 500; // Starting money in SGD
let population = 50; // Starting population
let happiness = 100; // Percentage
let innovationPoints = 0;
let pollution = 0; // Pollution level (unlocked at $750,000)
let taxRate = 0; // Tax rate (unlocked at $50,000)
let soundEnabled = true; // Default: Sound is enabled

// Unlock Flags
let globalTradeUnlocked = false; // Global Trade Agreements
let taxRatesUnlocked = false; // Tax Rate Adjustment
let environmentalTwistsUnlocked = false; // Environmental Twists

// Building Levels
let buildingLevels = {
  residential: 1, // Start at Level 1
  school: 1,
  industrial: 1,
  tourist: 1,
  mrt: 1,
};

// DOM Elements
let map, moneyDisplay, populationDisplay, happinessDisplay, innovationDisplay, log;

document.addEventListener('DOMContentLoaded', () => {
  // Initialize DOM Elements
  map = document.getElementById('map');
  moneyDisplay = document.getElementById('money');
  populationDisplay = document.getElementById('population');
  happinessDisplay = document.getElementById('happiness');
  innovationDisplay = document.getElementById('innovation');
  log = document.getElementById('log');

  // Add God Mode Button
  const godModeButton = document.createElement('button');
  godModeButton.textContent = "God Mode (Multiply Money x10)";
  godModeButton.style.backgroundColor = "gold";
  godModeButton.style.color = "black";
  godModeButton.onclick = activateGodMode;
  document.getElementById('buildings').appendChild(godModeButton);

  // Add Toggle Sound Button
  const soundToggleButton = document.createElement('button');
  soundToggleButton.textContent = "Turn Off Sound"; // Initial text
  soundToggleButton.style.backgroundColor = "lightblue";
  soundToggleButton.style.color = "black";
  soundToggleButton.onclick = toggleSound;
  document.getElementById('buildings').appendChild(soundToggleButton);

  // Initialize Interactive Map
  initializeMap();

  // Initialize Game
  updateStats();

  // Start Idle Income Generation
  startIdleIncome();
});

// Start Idle Income Generation
function startIdleIncome() {
  setInterval(() => {
    // Calculate income based on population and tax rate
    const baseIncome = population * 0.1; // Base income per person
    const taxIncome = (money * (taxRate / 100)); // Income from taxes
    money += baseIncome + taxIncome;

    updateStats();
  }, 1000); // Update every second
}

// Initialize Interactive Map
function initializeMap() {
  // Create clickable zones on the map with images
  const residentialZone = createZone('residential', getBuildingImage('residential', buildingLevels.residential), buildHDB);
  const industrialZone = createZone('industrial', getBuildingImage('industrial', buildingLevels.industrial), buildIndustrialZone);
  const schoolZone = createZone('school', getBuildingImage('school', buildingLevels.school), buildSchool);
  const touristAttractionZone = createZone('tourist', getBuildingImage('tourist', buildingLevels.tourist), buildTouristAttraction);
  const mrtZone = createZone('mrt', getBuildingImage('mrt', buildingLevels.mrt), buildMRTLine);

  map.appendChild(residentialZone);
  map.appendChild(industrialZone);
  map.appendChild(schoolZone);
  map.appendChild(touristAttractionZone);
  map.appendChild(mrtZone);
}

// Function to Get Image Based on Level
function getBuildingImage(buildingType, level) {
  const tier = Math.ceil(level / 10); // Determine the tier (1–20 for levels 1–200)
  const maxTier = 20; // Maximum tier (for levels 191–200)

  // Ensure tier does not exceed the maximum tier
  const clampedTier = Math.min(tier, maxTier);

  // Construct the image path based on building type and tier
  return `assets/images/${buildingType}_tier${clampedTier}.png`;
}

// Create a Clickable Zone with Images
function createZone(className, imageSrc, onClick) {
  const zone = document.createElement('div');
  zone.className = `zone ${className}`;
  zone.title = 'Click to interact';

  // Add an image instead of a background color
  const img = document.createElement('img');
  img.src = imageSrc; // Path to your image
  img.alt = className;
  img.style.width = '100px'; // Adjust size
  img.style.height = '100px';
  zone.appendChild(img);

  // Add click event listener
  zone.addEventListener('click', onClick);

  // Hover Effect
  zone.addEventListener('mouseenter', () => {
    zone.style.border = '2px solid yellow';
  });
  zone.addEventListener('mouseleave', () => {
    zone.style.border = '';
  });

  return zone;
}

// Update Display
function updateStats() {
  moneyDisplay.textContent = `Money: SGD ${Math.floor(money)}`;
  populationDisplay.textContent = `Population: ${Math.floor(population)}`;
  happinessDisplay.textContent = `Happiness: ${Math.floor(happiness)}%`;
  innovationDisplay.textContent = `Innovation Points: ${Math.floor(innovationPoints)}`;

  if (pollution > 0) {
    logEvent(`Pollution Level: ${pollution}`);
  }
}

// Add Event to Log
function logEvent(message) {
  const eventItem = document.createElement('li');
  eventItem.textContent = message;
  log.prepend(eventItem); // Add to top of log
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

// Update Building Image
function updateBuildingImage(zoneClass, newLevel) {
  const zone = document.querySelector(`.zone.${zoneClass} img`);
  if (zone) {
    const newImageSrc = getBuildingImage(zoneClass, newLevel);
    zone.src = newImageSrc;
  }
}

// Upgrade Building Function
function upgradeBuilding(buildingType, cost, populationChange, happinessChange, pollutionChange, incomeChange) {
  const currentLevel = buildingLevels[buildingType];

  // Prevent upgrades beyond Level 200
  if (currentLevel >= 200) {
    logEvent(`${buildingType.charAt(0).toUpperCase() + buildingType.slice(1)} is already at maximum level (200)!`);
    playSound('assets/sounds/sad_sound.mp3'); // Play negative sound
    return;
  }

  // Check if player has enough money
  if (money < cost) {
    logEvent(`Not enough money to upgrade ${buildingType}!`);
    playSound('assets/sounds/sad_sound.mp3'); // Play negative sound
    return;
  }

  // Deduct cost and apply upgrades
  money -= cost;
  population += populationChange;
  happiness += happinessChange;
  pollution += pollutionChange;

  // Increment building level
  buildingLevels[buildingType] += 1;

  // Update building image
  updateBuildingImage(buildingType, buildingLevels[buildingType]);

  // Log the upgrade
  logEvent(`Upgraded ${buildingType} to Level ${buildingLevels[buildingType]}!`);
  playSound('assets/sounds/build_sound.mp3'); // Play sound

  updateStats();
}

// Building Functions with Upgrades
function buildHDB() {
  upgradeBuilding('residential', 100, 10, 5, 0, 0);
}

function buildIndustrialZone() {
  upgradeBuilding('industrial', 500, 50, -5, 10, 0);
}

function buildSchool() {
  upgradeBuilding('school', 300, 0, 10, 0, 0);
}

function buildTouristAttraction() {
  upgradeBuilding('tourist', 700, 0, 20, 0, 200);
}

function buildMRTLine() {
  upgradeBuilding('mrt', 1000, 100, 10, 5, 0);
}

// Unlock Functions
function unlockGlobalTradeAgreements() {
  if (money >= 10000 && !globalTradeUnlocked) {
    globalTradeUnlocked = true; // Prevent duplicate buttons
    logEvent("Global Trade Agreements Unlocked!");

    const tradeButton = document.createElement('button');
    tradeButton.textContent = "Negotiate Trade Deal";
    tradeButton.onclick = negotiateTradeDeal;

    // Add to Unlocks Section
    document.getElementById('unlock-buttons').appendChild(tradeButton);
  }
}

function unlockTaxRates() {
  if (money >= 50000 && !taxRatesUnlocked) {
    taxRatesUnlocked = true; // Prevent duplicate buttons
    logEvent("Tax Rate Adjustment Unlocked!");

    const taxOptions = document.createElement('div');
    taxOptions.innerHTML = `
      <button id="low-tax" onclick="setTaxRate(10)">Low Tax (10%)</button>
      <button id="medium-tax" onclick="setTaxRate(30)">Medium Tax (30%)</button>
      <button id="high-tax" onclick="setTaxRate(50)">High Tax (50%)</button>
    `;

    // Add to Unlocks Section
    document.getElementById('unlock-buttons').appendChild(taxOptions);
  }
}

function unlockEnvironmentalTwists() {
  if (money >= 750000 && !environmentalTwistsUnlocked) {
    environmentalTwistsUnlocked = true; // Prevent duplicate buttons
    logEvent("Environmental Twists Unlocked!");

    const environmentalButtons = document.createElement('div');
    environmentalButtons.innerHTML = `
      <button onclick="reducePollution()">Build Green Technology ($10,000)</button>
      <button onclick="investRenewableEnergy()">Invest in Renewable Energy ($50,000)</button>
    `;

    // Add to Unlocks Section
    document.getElementById('unlock-buttons').appendChild(environmentalButtons);
  }
}

// Check for Unlocks
setInterval(() => {
  unlockGlobalTradeAgreements();
  unlockTaxRates();
  unlockEnvironmentalTwists();
}, 5000); // Check every 5 seconds
