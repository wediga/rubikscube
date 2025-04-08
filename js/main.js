// main.js – Einstiegspunkt: Initialisierung, Eventbindung, Startlogik

import { initCube } from './core/cube.js';
import { createLayerButtons } from './ui/controls.js';
import { scrambleCube } from './core/scramble.js';
import { enableLogging, resetLogging, playerMoves } from './ui/logger.js';
import { startTimer, resetStats } from './ui/feedback.js';
import { enableCubeDragRotation } from './interaction.js';

// === DOM Referenzen ===
const startBtn = document.getElementById('start-button');
const resetBtn = document.getElementById('reset-button');
const seedInput = document.getElementById('seed-input');
const copySeedBtn = document.getElementById('copy-seed');

let scrambleSnapshot = [];

// === Initialisierung ===
initCube();
enableCubeDragRotation();
createLayerButtons();

// === Spielstart ===
startBtn.addEventListener('click', () => {
    resetStats();
    resetLogging();
    enableLogging();
    const seed = seedInput.value.trim() || Date.now().toString();
    seedInput.value = seed;
    scrambleCube(20, seed);
    scrambleSnapshot = [...playerMoves];
    startTimer();
    startBtn.classList.add('hidden');
    resetBtn.classList.remove('hidden');
    seedInput.disabled = true;
});

resetBtn.addEventListener('click', () => {
    resetStats();
    resetLogging();
    initCube();
    enableLogging();
    scrambleSnapshot.forEach(move => {
        const [axisRaw, indexStr, dir] = move.match(/([XYZ])(-?\d) (↻|↺)/).slice(1);
        const axis = axisRaw.toLowerCase();
        const index = parseInt(indexStr);
        const clockwise = dir === '↺' ? false : true;
        rotateLayer(axis, index, clockwise);
    });
    startTimer();
    resetBtn.classList.add('hidden');
    startBtn.classList.remove('hidden');
    seedInput.disabled = false;
});

copySeedBtn.addEventListener('click', () => {
    navigator.clipboard.writeText(seedInput.value);
});
