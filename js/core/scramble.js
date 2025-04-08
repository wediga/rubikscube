// scramble.js – zuständig für Scramblelogik, Seed-Handling und deterministische Zufallsgenerierung

import { rotateLayer } from './rotation.js';
import { enableLogging, disableLogging } from '../ui/logger.js';


let currentSeed = null;
let randomFn = null;

export function scrambleCube(moves = 20, seed = Date.now()) {
    disableLogging();

    currentSeed = seed;
    randomFn = makeSeededRandom(seed);

    const axes = ['x', 'y', 'z'];
    const directions = [true, false];
    const indices = [-1, 0, 1];

    for (let i = 0; i < moves; i++) {
        const axis = axes[Math.floor(randomFn() * axes.length)];
        const index = indices[Math.floor(randomFn() * indices.length)];
        const clockwise = directions[Math.floor(randomFn() * directions.length)];

        rotateLayer(axis, index, clockwise);
    }

    enableLogging();
}

export function makeSeededRandom(seed) {
    let state = typeof seed === 'string' ? hashSeed(seed) : seed;
    return function () {
        // Linear congruential generator
        state = (state * 1664525 + 1013904223) % 4294967296;
        return state / 4294967296;
    };
}

export function hashSeed(str) {
    let h = 2166136261 >>> 0;
    for (let i = 0; i < str.length; i++) {
        h ^= str.charCodeAt(i);
        h = Math.imul(h, 16777619);
    }
    return h >>> 0;
}

export function getCurrentSeed() {
    return currentSeed;
}
