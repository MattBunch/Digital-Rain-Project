// src/main.js
import './style.css';
import { CoreEngine } from './engine/CoreEngine.js';
import { UIManager } from './ui/UIManager.js';
import { InputHandler } from './controllers/InputHandler.js';
import { canvasSetup } from './utils/CoordinateUtils.js';

document.addEventListener('DOMContentLoaded', () => {
  const engine = new CoreEngine();
  const ui = new UIManager(engine);
  const input = new InputHandler(engine, ui);

  const canvas = document.getElementById('myCanvas');
  const ctx = canvas.getContext('2d');
  engine.setContext(canvas, ctx);

  const setup = () => {
    canvasSetup(window.innerWidth, window.innerHeight, canvas, ctx, engine.defaultFontSize);
    engine.updateBoundaries();
  };

  window.addEventListener('resize', () => {
    setup();
    engine.resetWordsArray();
  });

  // Connect UI Listeners manually for better control
  document.getElementById('button').addEventListener('click', () => {
    setup();
    engine.run(true);
    ui.hideMenu();
  });

  document.getElementById('button2').addEventListener('click', () => {
    setup();
    engine.run(false);
    ui.hideMenu();
  });

  document.getElementById('button3').addEventListener('click', () => {
    engine.all4Directions = !engine.all4Directions;
    engine.resetWordsArray();
    ui.updateAll4DirectionButtonStyling();
  });

  document.getElementById('button4').addEventListener('click', () => {
    import('./constants/Assets.js').then(m => alert(m.helpText));
  });

  document.getElementById('colors').addEventListener('change', (e) => {
    ui.selectFunction();
    engine.switchColor(e.target.value);
  });

  document.getElementById('directions').addEventListener('change', (e) => {
    engine.direction = e.target.value;
  });

  document.getElementById('disco').addEventListener('change', () => {
    ui.checkboxFunction();
  });

  document.getElementById('frameCount').addEventListener('change', () => {
    ui.frameCountFunctionOnChange();
  });

  console.log('Digital Rain: Fixed Modularization Initialized');
});
