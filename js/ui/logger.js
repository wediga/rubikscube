// logger.js – Zugzählung, Logging, Solver-Prüfung

import { cubeState } from '../core/cube.js';
import { showWinPopup, updateTimerDisplay } from './feedback.js';
import { rotateLayer } from '../core/rotation.js';


let moveCount = 0;
let playerMoves = [];
let loggingEnabled = false;

export function enableLogging() {
    loggingEnabled = true;
    moveCount = 0;
    playerMoves = [];
    updateMoveDisplay();
}

export function disableLogging() {
    loggingEnabled = false;
}

export { playerMoves };

export function resetLogging() {
    loggingEnabled = false;
    moveCount = 0;
    playerMoves = [];
    updateMoveDisplay();
    document.getElementById('move-log').textContent = '';
}

export function logMove(text) {
    if (!loggingEnabled) return;
    playerMoves.unshift(text);
    moveCount++;
    updateMoveDisplay();

    const el = document.getElementById('move-log');
    el.textContent = playerMoves.join('\n');

    if (isCubeSolved()) {
        const currentTime = document.getElementById('timer').textContent;
        showWinPopup(moveCount, currentTime);
    }
}

function updateMoveDisplay() {
    document.getElementById('move-count').textContent = moveCount.toString();
    updateTimerDisplay();
}

export function isCubeSolved() {
    // Vor der Rotation: Logge alle Cubie-Positionen
    console.log('Before rotation:');
    cubeState.forEach(cubie => {
        console.log(`Cubie at position: (${cubie.pos.x}, ${cubie.pos.y}, ${cubie.pos.z})`);
    });

    // Rotation durchführen
    rotateLayer(axis, index, clockwise);

    // Nach der Rotation: Logge alle neuen Cubie-Positionen
    console.log('After rotation:');
    cubeState.forEach(cubie => {
        console.log(`Cubie at position: (${cubie.pos.x}, ${cubie.pos.y}, ${cubie.pos.z})`);
    });

    for (const cubie of cubeState) {
        const { x, y, z } = cubie.pos;

        const isInPlace = x === parseInt(cubie.dom.dataset.x) &&
            y === parseInt(cubie.dom.dataset.y) &&
            z === parseInt(cubie.dom.dataset.z);

        const isUnrotated = cubie.rotation.x % 360 === 0 &&
            cubie.rotation.y % 360 === 0 &&
            cubie.rotation.z % 360 === 0;

        if (!isInPlace || !isUnrotated) {
            // Debug log für den Fehlerfall
            if (!isInPlace) {
                console.log(`Cubie at (${cubie.pos.x}, ${cubie.pos.y}, ${cubie.pos.z}) is NOT in place.`);
            }
            if (!isUnrotated) {
                console.log(`Cubie at (${cubie.pos.x}, ${cubie.pos.y}, ${cubie.pos.z}) is NOT unrotated.`);
            }
            return false;
        }
    }

    console.log("Cube is solved!");
    return true;
}

