// Game State Variables
let gdp = 0.5; // Initial GDP in 1945 (in billions SGD)
let population = 0.94; // Initial population in 1945 (in millions)
let ffi = 50; // Initial Foreign Friendliness Index (0-100)

// Sample Scenarios with Image Names
const scenarios = [
  {
    year: 1945,
    text: "Singapore has just emerged from World War II. The economy is devastated, and social unrest is growing. What will you focus on first?",
    image: "1945_post-war-devastation.png",
    choices: {
      A: "Rebuild infrastructure to stimulate economic recovery.",
      B: "Focus on education to prepare for long-term growth.",
      C: "Promote racial harmony to prevent further conflict."
    },
    consequences: {
      A: { gdp: 0.2, population: 0.1, ffi: 5 },
      B: { gdp: 0.1, population: 0.2, ffi: 10 },
      C: { gdp: 0.05, population: 0.15, ffi: 15 }
    }
  },
  {
    year: 1965,
    text: "Singapore has just gained independence. Resources are scarce, and unemployment is high. What is your priority?",
    image: "1965_independence-celebration.png",
    choices: {
      A: "Build public housing to address overcrowding.",
      B: "Attract multinational corporations to boost the economy.",
      C: "Invest in education to create a skilled workforce."
    },
    consequences: {
      A: { gdp: 0.1, population: 0.2, ffi: 10 },
      B: { gdp: 0.3, population: 0.1, ffi: 20 },
      C: { gdp: 0.2, population: 0.15, ffi: 15 }
    }
  },
  {
    year: 1970,
    text: "The oil crisis is causing inflation and economic instability. How will you respond?",
    image: "1970_oil-crisis-inflation.png",
    choices: {
      A: "Subsidize fuel prices to protect citizens.",
      B: "Encourage energy conservation and innovation.",
      C: "Increase taxes to fund alternative energy research."
    },
    consequences: {
      A: { gdp: -0.2, population: 0.05, ffi: -5 },
      B: { gdp: 0.1, population: 0.1, ffi: 10 },
      C: { gdp: 0.05, population: 0.05, ffi: 5 }
    }
  },
  {
    year: 1985,
    text: "Singapore is rapidly industrializing, but environmental concerns are growing. What will you do?",
    image: "1985_environmental-concerns.png",
    choices: {
      A: "Prioritize green spaces and sustainable development.",
      B: "Continue rapid industrialization to maximize GDP.",
      C: "Introduce strict pollution controls to protect the environment."
    },
    consequences: {
      A: { gdp: 0.1, population: 0.1, ffi: 15 },
      B: { gdp: 0.3, population: 0.05, ffi: -10 },
      C: { gdp: 0.2, population: 0.1, ffi: 5 }
    }
  },
  {
    year: 1997,
    text: "The Asian financial crisis is hitting Singapore's economy hard. What measures will you take?",
    image: "1997_asian-financial-crisis.png",
    choices: {
      A: "Stabilize the currency by tightening monetary policy.",
      B: "Protect jobs by subsidizing struggling industries.",
      C: "Diversify the economy to reduce reliance on exports."
    },
    consequences: {
      A: { gdp: -0.1, population: 0.05, ffi: -5 },
      B: { gdp: -0.2, population: 0.1, ffi: 5 },
      C: { gdp: 0.1, population: 0.1, ffi: 10 }
    }
  },
  {
    year: 2010,
    text: "Global competition is intensifying. How will you position Singapore as a global hub?",
    image: "2010_global-competition.png",
    choices: {
      A: "Invest heavily in technology and innovation.",
      B: "Attract foreign talent and businesses.",
      C: "Focus on local entrepreneurship and small businesses."
    },
    consequences: {
      A: { gdp: 0.3, population: 0.1, ffi: 20 },
      B: { gdp: 0.2, population: 0.2, ffi: 15 },
      C: { gdp: 0.1, population: 0.15, ffi: 10 }
    }
  },
  {
    year: 2025,
    text: "Climate change is threatening Singapore's future. What steps will you take?",
    image: "2025_climate-change-threat.png",
    choices: {
      A: "Invest in renewable energy and sustainable infrastructure.",
      B: "Expand urban farming and food security initiatives.",
      C: "Partner with international organizations to combat climate change."
    },
    consequences: {
      A: { gdp: 0.2, population: 0.1, ffi: 15 },
      B: { gdp: 0.1, population: 0.15, ffi: 10 },
      C: { gdp: 0.15, population: 0.1, ffi: 20 }
    }
  }
];

let currentScenarioIndex = 0;

// Function to display the current scenario
function displayScenario() {
  const scenario = scenarios[currentScenarioIndex];
  document.getElementById("scenario-text").textContent = `${scenario.year}: ${scenario.text}`;
  document.getElementById("scenario-image").src = `images/${scenario.image}`; // Update image dynamically
  document.getElementById("choice-a").textContent = scenario.choices.A;
  document.getElementById("choice-b").textContent = scenario.choices.B;
  document.getElementById("choice-c").textContent = scenario.choices.C;

  // Update metrics display
  document.getElementById("gdp").textContent = `GDP: $${gdp.toFixed(2)}B`;
  document.getElementById("population").textContent = `Population: ${population.toFixed(2)}M`;
  document.getElementById("ffi").textContent = `Foreign Friendliness Index: ${ffi}`;
}

// Function to handle player decisions
function makeDecision(choice) {
  const scenario = scenarios[currentScenarioIndex];
  const consequence = scenario.consequences[choice];

  // Update metrics
  gdp += consequence.gdp;
  population += consequence.population;
  ffi += consequence.ffi;

  // Ensure FFI stays within bounds (0-100)
  ffi = Math.max(0, Math.min(100, ffi));

  // Display feedback
  document.getElementById("feedback-text").textContent = `You chose Option ${choice}.`;

  // Move to the next scenario
  currentScenarioIndex++;
  if (currentScenarioIndex < scenarios.length) {
    displayScenario();
  } else {
    endGame();
  }
}

// Function to end the game
function endGame() {
  document.getElementById("scenario-text").textContent = "Congratulations! You've completed the game.";
  document.getElementById("feedback-text").textContent = `Final Stats: GDP: $${gdp.toFixed(2)}B, Population: ${population.toFixed(2)}M, FFI: ${ffi}`;
  document.getElementById("choice-a").style.display = "none";
  document.getElementById("choice-b").style.display = "none";
  document.getElementById("choice-c").style.display = "none";
}

// Initialize the game
displayScenario();