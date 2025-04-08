// feedback.js – Anzeige von Stats, Timer, Win-Popup, Debug

import { getCurrentSeed } from '../core/scramble.js';

let timerInterval = null;
let gameStartTime = null;

export function startTimer() {
    gameStartTime = Date.now();
    timerInterval = setInterval(updateTimerDisplay, 1000);
}

export function resetStats() {
    clearInterval(timerInterval);
    document.getElementById('timer').textContent = '00:00';
    document.getElementById('move-count').textContent = '0';
    gameStartTime = null;
}

export function updateTimerDisplay() {
    if (!gameStartTime) return;
    const elapsed = Math.floor((Date.now() - gameStartTime) / 1000);
    const minutes = String(Math.floor(elapsed / 60)).padStart(2, '0');
    const seconds = String(elapsed % 60).padStart(2, '0');
    document.getElementById('timer').textContent = `${minutes}:${seconds}`;
}

export function showWinPopup(moveCount, timeStr) {
    document.getElementById('win-popup').classList.remove('hidden');
    document.getElementById('win-moves').textContent = moveCount;
    document.getElementById('win-time').textContent = timeStr;
    document.getElementById('win-seed').textContent = getCurrentSeed();
}

export function hideWinPopup() {
    document.getElementById('win-popup').classList.add('hidden');
}
