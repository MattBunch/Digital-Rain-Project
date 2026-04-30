// src/main.js
import './style.css';
import { COLORS, DEFAULT_CONFIG } from './constants/matrix.js';
// We will eventually move everything out of app.js, but for now we import the legacy logic
// To make it work as a module, we might need to export functions from app.js or refactor them here.

// For now, let's implement the event listeners as requested in the plan.
document.addEventListener('DOMContentLoaded', () => {
  console.log('Digital Rain Initialized');

  // Targeting buttons
  const startBtn = document.getElementById('button');
  const squareBtn = document.getElementById('button2');
  const directionsBtn = document.getElementById('button3');
  const helpBtn = document.getElementById('button4');

  // Targeting selects and inputs
  const colorSelect = document.getElementById('colors');
  const directionSelect = document.getElementById('directions');
  const discoCheckbox = document.getElementById('disco');
  const frameCountInput = document.getElementById('frameCount');

  // Event Listeners (mapping to legacy functions for now)
  if (startBtn) startBtn.addEventListener('click', () => window.run(true));
  if (squareBtn) squareBtn.addEventListener('click', () => window.run(false));
  if (directionsBtn) directionsBtn.addEventListener('click', () => window.all4DirectionsControl());
  if (helpBtn) helpBtn.addEventListener('click', () => alert(window.helpText));

  if (colorSelect) colorSelect.addEventListener('change', () => window.selectFunction());
  if (directionSelect) directionSelect.addEventListener('change', () => window.directionFunction());
  if (discoCheckbox) {
    discoCheckbox.addEventListener('change', () => window.checkboxFunction());
    // Also trigger on load for initial state
    window.checkboxFunction();
  }
  if (frameCountInput) {
    frameCountInput.addEventListener('change', () => window.frameCountFunctionOnChange());
    window.frameCountFunctionOnLoad();
  }

  // Initial UI Setup
  window.menuOnLoad();
});

// Since app.js functions are now in a module, they aren't global.
// We need to either export them from app.js and import them here,
// or temporarily attach them to window if we want to keep the legacy structure working during transition.
import './app.js';
