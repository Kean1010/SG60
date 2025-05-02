// script.js

function addCoin() {
  const current = parseInt(localStorage.getItem('merlionCoins') || '0');
  localStorage.setItem('merlionCoins', current + 1);
  updateInventoryDisplay();
}

function updateInventoryDisplay() {
  const count = localStorage.getItem('merlionCoins') || '0';
  const display = document.getElementById('inventory');
  if (display) display.innerText = `🪙 Merlion Coins: ${count}`;
}

window.onload = updateInventoryDisplay;
