// Building Levels
let buildingLevels = {
  residential: 1, // Start at Level 1
  school: 1,
  industrial: 1,
  tourist: 1,
  mrt: 1,
};

// Function to Get Image Based on Level
function getBuildingImage(buildingType, level) {
  const tier = Math.ceil(level / 10); // Determine the tier (1–20 for levels 1–200)
  const maxTier = 20; // Maximum tier (for levels 191–200)
  const clampedTier = Math.min(tier, maxTier);
  return `assets/images/${buildingType}_tier${clampedTier}.png`;
}

// Create a Clickable Zone with Images, Cost Display, and Circular Progress Pie
function createZone(className, imageSrc, onClick, baseCost) {
  const zone = document.createElement('div');
  zone.className = `zone ${className}`;
  zone.title = 'Click to interact';
  zone.style.position = 'relative'; // Enable positioning for child elements

  // Add an image instead of a background color
  const img = document.createElement('img');
  img.src = imageSrc; // Path to your image
  img.alt = className;
  img.style.width = '100px'; // Adjust size
  img.style.height = '100px';
  zone.appendChild(img);

  // Add cost display
  const costDisplay = document.createElement('p');
  costDisplay.className = 'cost-display';
  costDisplay.textContent = `Cost: $${baseCost}`;
  costDisplay.style.textAlign = 'center'; // Center-align the text
  costDisplay.style.marginTop = '5px'; // Add spacing below the image
  zone.appendChild(costDisplay);

  // Add level indicator
  const levelIndicator = document.createElement('div');
  levelIndicator.className = 'level-indicator';
  levelIndicator.textContent = '1'; // Start at Level 1
  levelIndicator.style.position = 'absolute'; // Position relative to the parent
  levelIndicator.style.top = '5px'; // Offset from the top
  levelIndicator.style.left = '5px'; // Offset from the left
  levelIndicator.style.backgroundColor = 'rgba(0, 0, 0, 0.7)'; // Semi-transparent background
  levelIndicator.style.color = 'white'; // Text color
  levelIndicator.style.padding = '2px 5px'; // Padding for better visibility
  levelIndicator.style.borderRadius = '3px'; // Rounded corners
  levelIndicator.style.fontSize = '12px'; // Font size
  levelIndicator.style.fontWeight = 'bold'; // Bold text
  zone.appendChild(levelIndicator);

  // Add circular progress bar
  const pieProgressContainer = document.createElement('div');
  pieProgressContainer.className = 'pie-progress-container';
  pieProgressContainer.style.display = 'none'; // Initially hidden
  pieProgressContainer.style.width = '50px';
  pieProgressContainer.style.height = '50px';
  pieProgressContainer.style.position = 'absolute'; // Position relative to the parent
  pieProgressContainer.style.top = '25px'; // Center vertically
  pieProgressContainer.style.left = '25px'; // Center horizontally
  pieProgressContainer.style.zIndex = '10'; // Ensure it appears above the image

  const pieProgress = document.createElement('div');
  pieProgress.className = 'pie-progress';
  pieProgress.style.width = '100%';
  pieProgress.style.height = '100%';
  pieProgress.style.borderRadius = '50%';
  pieProgress.style.background = 'conic-gradient(#ddd 0%, #ddd 100%)';
  pieProgressContainer.appendChild(pieProgress);

  zone.appendChild(pieProgressContainer);

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

// Update Building Image and Level Indicator
function updateBuildingUI(zoneClass, newLevel, baseCost) {
  const zone = document.querySelector(`.zone.${zoneClass}`);
  if (zone) {
    // Update building image
    const newImageSrc = getBuildingImage(zoneClass, newLevel);
    const img = zone.querySelector('img');
    if (img) {
      img.src = newImageSrc;
    }

    // Update cost display
    const costDisplay = zone.querySelector('.cost-display');
    if (costDisplay) {
      const newCost = Math.floor(baseCost * Math.pow(1.2, newLevel)); // Calculate new cost
      costDisplay.textContent = `Cost: $${newCost}`;
    }

    // Update level indicator
    const levelIndicator = zone.querySelector('.level-indicator');
    if (levelIndicator) {
      levelIndicator.textContent = newLevel; // Update the level number
    }
  }
}

// Upgrade Building Function
function upgradeBuilding(buildingType, baseCost, populationChange, happinessChange, pollutionChange, incomeChange) {
  const currentLevel = buildingLevels[buildingType];

  // Prevent upgrades beyond Level 200
  if (currentLevel >= 200) {
    logEvent(`${buildingType.charAt(0).toUpperCase() + buildingType.slice(1)} is already at maximum level (200)!`);
    playSound('assets/sounds/sad_sound.mp3'); // Play negative sound
    return;
  }

  // Calculate current cost based on level
  const cost = Math.floor(baseCost * Math.pow(1.2, currentLevel));

  // Check if player has enough money
  if (money < cost) {
    logEvent(`Not enough money to upgrade ${buildingType}!`);
    playSound('assets/sounds/sad_sound.mp3'); // Play negative sound
    return;
  }

  // Deduct cost and apply upgrades
  money -= cost;

  // Show circular progress bar
  const pieProgressContainer = document.querySelector(`.zone.${buildingType} .pie-progress-container`);
  if (pieProgressContainer) {
    pieProgressContainer.style.display = 'block';
  }

  // Initialize progress tracking
  const pieProgress = document.querySelector(`.zone.${buildingType} .pie-progress`);
  let elapsed = 0;
  const interval = 100; // Update progress every 100ms

  const upgradeTime = calculateUpgradeTime(currentLevel + 1); // Get upgrade time based on level
  const progressInterval = setInterval(() => {
    elapsed += interval;
    const progressPercentage = Math.min((elapsed / (upgradeTime * 1000)) * 100, 100);

    // Update circular progress bar
    if (pieProgress) {
      pieProgress.style.background = `conic-gradient(#4caf50 ${progressPercentage}%, #ddd 0%)`;
    }

    if (progressPercentage >= 100) {
      clearInterval(progressInterval);
      if (pieProgressContainer) {
        pieProgressContainer.style.display = 'none'; // Hide circular progress bar
      }
    }
  }, interval);

  setTimeout(() => {
    // Apply final changes after upgrade completes
    population += populationChange;
    happiness += happinessChange;
    pollution += pollutionChange; // Increase pollution
    innovationPoints += incomeChange;

    // Increment building level
    buildingLevels[buildingType] += 1;

    // Update building image and cost display
    updateBuildingUI(buildingType, buildingLevels[buildingType], baseCost);

    // Log the upgrade
    logEvent(`Upgraded ${buildingType} to Level ${buildingLevels[buildingType]}!`);
    playSound('assets/sounds/build_sound.mp3'); // Play sound

    // Sanitize game variables
    money = Math.max(0, Math.floor(money));
    population = Math.max(0, Math.floor(population));
    happiness = Math.min(100, Math.max(0, Math.floor(happiness))); // Clamp happiness between 0 and 100
    pollution = Math.max(0, Math.floor(pollution));

    updateStats();
  }, upgradeTime * 1000); // Convert seconds to milliseconds
}

// Calculate Upgrade Time Based on Level
function calculateUpgradeTime(level) {
  if (level <= 10) return 0; // Immediate
  if (level <= 20) return 30; // 30 seconds
  if (level <= 30) return 180; // 3 minutes
  if (level <= 40) return 600; // 10 minutes
  if (level <= 50) return 1800; // 30 minutes
  if (level <= 60) return 3600; // 1 hour
  if (level <= 70) return 7200; // 2 hours
  if (level <= 80) return 14400; // 4 hours
  if (level <= 90) return 28800; // 8 hours
  if (level <= 100) return 57600; // 16 hours
  // Beyond Level 100, increase exponentially
  return 57600 + (level - 100) * 14400; // 16 hours + (Level - 100) * 4 hours
}

// Initialize Interactive Map
function initializeMap() {
  // Create clickable zones on the map with images and costs
  const residentialZone = createZone('residential', getBuildingImage('residential', buildingLevels.residential), buildHDB, 100);
  const industrialZone = createZone('industrial', getBuildingImage('industrial', buildingLevels.industrial), buildIndustrialZone, 500);
  const schoolZone = createZone('school', getBuildingImage('school', buildingLevels.school), buildSchool, 300);
  const touristAttractionZone = createZone('tourist', getBuildingImage('tourist', buildingLevels.tourist), buildTouristAttraction, 700);
  const mrtZone = createZone('mrt', getBuildingImage('mrt', buildingLevels.mrt), buildMRTLine, 1000);

  // Add zones to the map with proper spacing
  map.style.display = 'grid';
  map.style.gridTemplateColumns = 'repeat(3, 1fr)'; // 3 columns
  map.style.gap = '20px'; // Add spacing between zones
  map.style.justifyContent = 'center'; // Center the zones

  map.appendChild(residentialZone);
  map.appendChild(industrialZone);
  map.appendChild(schoolZone);
  map.appendChild(touristAttractionZone);
  map.appendChild(mrtZone);
}

// Building Functions with Upgrades
function buildHDB() {
  upgradeBuilding('residential', 100, 10, 5, 0, 0); // No pollution for residential
}
function buildIndustrialZone() {
  upgradeBuilding('industrial', 500, 50, -5, 30, 30); // Adds 10 pollution
}
function buildSchool() {
  upgradeBuilding('school', 300, 0, 10, 0, 20); // No pollution for schools
}
function buildTouristAttraction() {
  upgradeBuilding('tourist', 700, 0, 20, 5, 20); // No pollution for tourist attractions
}
function buildMRTLine() {
  upgradeBuilding('mrt', 1000, 100, 10, 5, 0); // Adds 5 pollution
}