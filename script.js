// const cube = document.getElementById('cube');
// const wrapper = document.getElementById('cube-wrapper');
// const seedInput = document.getElementById('seed-input');
// const copySeedBtn = document.getElementById('copy-seed');
// const moveLogEl = document.getElementById('move-log');
// const moveCountEl = document.getElementById('move-count');
// const timerEl = document.getElementById('timer');
// const layerButtonContainer = document.getElementById('layer-buttons');
//
// const offset = 60;
// const gap = 2;
// const size = offset + gap;
//
// let allMoves = [];
// let playerMoves = [];
// let loggingEnabled = false;
// let cubeState = [];
// let scrambleMoves = [];
// let moveCount = 0;
// let gameStartTime = null;
// let timerInterval = null;
//
// function createLayerButtons() {
//     const axes = ['x', 'y', 'z'];
//     layerButtonContainer.innerHTML = '';
//     axes.forEach(axis => {
//         const row = document.createElement('div');
//         row.classList.add('layer-row');
//         const label = document.createElement('span');
//         label.className = 'layer-label';
//         label.textContent = `${axis.toUpperCase()}-Axis:`;
//         row.appendChild(label);
//
//         [-1, 0, 1].forEach(index => {
//             [true, false].forEach(clockwise => {
//                 const btn = document.createElement('button');
//                 btn.textContent = `${axis.toUpperCase()}${index} ${clockwise ? '↻' : '↺'}`;
//                 btn.setAttribute('data-axis', axis);
//                 btn.setAttribute('data-index', index);
//                 btn.setAttribute('data-dir', clockwise ? 'cw' : 'ccw');
//                 btn.addEventListener('click', () => rotateLayer(axis, index, clockwise));
//                 row.appendChild(btn);
//             });
//         });
//         layerButtonContainer.appendChild(row);
//     });
// }
//
// function suggestNextMove() {
//     clearHintHighlight();
//     const faces = ['front','back','left','right','top','bottom'];
//     let mostMixed = null;
//     let maxMismatch = 0;
//     for (const face of faces) {
//         const els = Array.from(document.querySelectorAll(`.face.${face}`));
//         if (els.length !== 9) continue;
//         const ref = getComputedStyle(els[0]).backgroundColor;
//         const mismatch = els.filter(e => getComputedStyle(e).backgroundColor !== ref).length;
//         if (mismatch > maxMismatch) {
//             maxMismatch = mismatch;
//             mostMixed = face;
//         }
//     }
//     if (!mostMixed) return;
//     const map = {
//         front:  ['z', 1, true],
//         back:   ['z', -1, true],
//         left:   ['x', -1, true],
//         right:  ['x', 1, true],
//         top:    ['y', 1, true],
//         bottom: ['y', -1, true]
//     };
//     const [axis, index, clockwise] = map[mostMixed];
//     const dir = clockwise ? 'cw' : 'ccw';
//     const selector = `button[data-axis="${axis}"][data-index="${index}"][data-dir="${dir}"]`;
//     const button = document.querySelector(selector);
//     if (button) button.classList.add('hint-highlight');
// }
//
// function clearHintHighlight() {
//     document.querySelectorAll('.hint-highlight').forEach(b => b.classList.remove('hint-highlight'));
// }
//
// function isCubeSolved() {
//     const faces = ['front', 'back', 'left', 'right', 'top', 'bottom'];
//     for (const face of faces) {
//         const all = Array.from(document.querySelectorAll(`.face.${face}`));
//         if (all.length !== 9) return false;
//         const refColor = getComputedStyle(all[0]).backgroundColor;
//         for (let i = 1; i < all.length; i++) {
//             if (getComputedStyle(all[i]).backgroundColor !== refColor) {
//                 return false;
//             }
//         }
//     }
//     return true;
// }
//
// function showWinPopup() {
//     const elapsed = Math.floor((Date.now() - gameStartTime) / 1000);
//     const minutes = String(Math.floor(elapsed / 60)).padStart(2, '0');
//     const seconds = String(elapsed % 60).padStart(2, '0');
//
//     document.getElementById('win-time').textContent = `${minutes}:${seconds}`;
//     document.getElementById('win-moves').textContent = moveCount;
//     document.getElementById('win-seed').textContent = seedInput.value;
//     document.getElementById('win-popup').classList.remove('hidden');
// }
//
// document.getElementById('win-ok').addEventListener('click', () => {
//     location.reload();
// });
//
// function updateTimerDisplay() {
//     const now = Date.now();
//     const elapsed = Math.floor((now - gameStartTime) / 1000); // in Sekunden
//     const minutes = String(Math.floor(elapsed / 60)).padStart(2, '0');
//     const seconds = String(elapsed % 60).padStart(2, '0');
//     timerEl.textContent = `${minutes}:${seconds}`;
// }
//
// function makeSeededRandom(seed) {
//     return function () {
//         seed |= 0;
//         seed = (seed + 0x6D2B79F5) | 0;
//         let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
//         t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
//         return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
//     };
// }
//
// function hashSeed(str) {
//     let h = 2166136261 >>> 0;
//     for (let i = 0; i < str.length; i++) {
//         h ^= str.charCodeAt(i);
//         h += (h << 1) + (h << 4) + (h << 7) + (h << 8) + (h << 24);
//     }
//     return h >>> 0;
// }
//
// function applyMoves(moves, delay = 0) {
//     moves.forEach((line, i) => {
//         const [axis, indexStr, symbol] = line.split(' ');
//         const index = parseInt(indexStr);
//         const clockwise = symbol === '↻';
//         setTimeout(() => {
//             rotateLayer(axis, index, clockwise);
//         }, i * delay);
//     });
// }
//
// function logMove(axis, index, clockwise) {
//     const symbol = clockwise ? '↻' : '↺';
//     const line = `${axis} ${index} ${symbol}`;
//     allMoves.push(line);
//
//     if (loggingEnabled) {
//         playerMoves.unshift(line);
//         moveLogEl.textContent = playerMoves.join('\n');
//         moveCount++;
//         moveCountEl.textContent = moveCount;
//
//         // Gewinnprüfung
//         if (isCubeSolved()) {
//             showWinPopup();
//         }
//
//     }
// }
//
// function forceSolvedState() {
//     initCube(); // setzt Cubies neu & sauber
//
//     // Reset Zustand für Debug-Anzeige
//     moveCount = 0;
//     moveCountEl.textContent = moveCount;
//     gameStartTime = Date.now();
//     updateTimerDisplay();
//     clearInterval(timerInterval);
//     timerInterval = setInterval(updateTimerDisplay, 1000);
//
//     loggingEnabled = true;
//     showWinPopup();
// }
//
//
// function createCubie(x, y, z) {
//     const cubie = document.createElement('div');
//     cubie.className = 'cubie';
//     cubie.dataset.x = x;
//     cubie.dataset.y = y;
//     cubie.dataset.z = z;
//
//     ['front','back','left','right','top','bottom'].forEach(face => {
//         const f = document.createElement('div');
//         f.className = 'face ' + face;
//         cubie.appendChild(f);
//     });
//
//     cube.appendChild(cubie);
//
//     cubeState.push({
//         dom: cubie,
//         pos: { x, y, z },
//         rotation: { x: 0, y: 0, z: 0 },
//         faceRotation: { x: 0, y: 0, z: 0 }, // NEU: Rotation der Sticker mitführen
//     });
//
//     applyTransform(cubeState[cubeState.length - 1]);
// }
//
// function generateScrambleMoves(seed, length = 20) {
//     const rng = makeSeededRandom(seed);
//     const axes = ['x', 'y', 'z'];
//     const indices = [-1, 0, 1];
//     let lastAxis = null;
//     const moves = [];
//
//     for (let i = 0; i < length; i++) {
//         let axis;
//         do {
//             axis = axes[Math.floor(rng() * axes.length)];
//         } while (axis === lastAxis);
//         lastAxis = axis;
//
//         const index = indices[Math.floor(rng() * indices.length)];
//         const dir = rng() < 0.5;
//         const symbol = dir ? '↻' : '↺';
//
//         moves.push(`${axis} ${index} ${symbol}`);
//     }
//
//     return moves;
// }
//
// function scrambleWithMoves(moves) {
//     scrambleMoves = moves;
//     for (const move of moves) {
//         const [axis, indexStr, symbol] = move.split(' ');
//         const index = parseInt(indexStr, 10);
//         const clockwise = symbol === '↻';
//         rotateLayer(axis, index, clockwise);
//     }
// }
//
// function scrambleCube(moves = 20, seed = Date.now()) {
//     const moveList = generateScrambleMoves(seed);
//     scrambleWithMoves(moveList);
//
//     // Optionale UI-Updates:
//     if (!seedInput.value.trim()) seedInput.value = seed;
//     const label = document.getElementById('seed-label');
//     if (label) label.textContent = 'Seed: ' + seed;
// }
//
// function applyTransform(c) {
//     const { x, y, z } = c.pos;
//     const { x: rx, y: ry, z: rz } = c.rot;
//     const tx = x * size;
//     const ty = y * size;
//     const tz = z * size;
//     c.dom.style.transform = `translate3d(${tx}px, ${ty}px, ${tz}px) rotateX(${rx}deg) rotateY(${ry}deg) rotateZ(${rz}deg)`;
// }
//
// function initCube() {
//     cubeState = [];
//     cube.innerHTML = '';
//     for (let x = -1; x <= 1; x++) {
//         for (let y = -1; y <= 1; y++) {
//             for (let z = -1; z <= 1; z++) {
//                 createCubie(x, y, z);
//             }
//         }
//     }
//     updateCubeTransform();
// }
//
// // ==== View-Rotation
// let isDragging = false, lastX = 0, lastY = 0;
// let rotationX = -30, rotationY = 45;
//
// function updateCubeTransform() {
//     wrapper.style.transform = `translate(-50%, -50%) rotateX(${rotationX}deg) rotateY(${rotationY}deg)`;
// }
//
// document.querySelector('.scene').addEventListener('mousedown', e => {
//     isDragging = true;
//     lastX = e.clientX;
//     lastY = e.clientY;
// });
// document.addEventListener('mouseup', () => isDragging = false);
// document.addEventListener('mousemove', e => {
//     if (!isDragging) return;
//     const dx = e.clientX - lastX;
//     const dy = e.clientY - lastY;
//     lastX = e.clientX;
//     lastY = e.clientY;
//     rotationY += dx * 0.4;
//     rotationX -= dy * 0.4;
//     rotationX = Math.max(-90, Math.min(90, rotationX));
//     updateCubeTransform();
// });
//
// // ==== Layer-Rotation
// function rotateLayer(axis, index, clockwise = true) {
//     const angle = clockwise ? 90 : -90;
//     const affected = cubeState.filter(c => c.pos[axis] === index);
//
//     affected.forEach(cubie => {
//         cubie.dom.style.transition = 'transform 0.5s ease-in-out';
//
//         cubie.rotation[axis] += angle;
//         cubie.faceRotation = rotateFaceOrientation(cubie.faceRotation, axis, clockwise);
//
//         cubie.dom.style.transform = getTransform(cubie.pos.x, cubie.pos.y, cubie.pos.z, cubie.rotation);
//     });
//
//     setTimeout(() => {
//         affected.forEach(cubie => {
//             cubie.dom.style.transition = '';
//             const { x, y, z } = cubie.pos;
//             let newX = x, newY = y, newZ = z;
//             if (axis === 'x') {
//                 newY = clockwise ? -z : z;
//                 newZ = clockwise ? y : -y;
//             } else if (axis === 'y') {
//                 newX = clockwise ? z : -z;
//                 newZ = clockwise ? -x : x;
//             } else if (axis === 'z') {
//                 newX = clockwise ? -y : y;
//                 newY = clockwise ? x : -x;
//             }
//             cubie.pos = { x: newX, y: newY, z: newZ };
//             cubie.dom.style.transform = getTransform(newX, newY, newZ, cubie.rotation);
//
//             updateFaceRotation(cubie);
//         });
//     }, 500);
// }
//
// function rotateFaceOrientation(current, axis, clockwise) {
//     const newRot = { ...current };
//     if (axis === 'x') {
//         const oldY = newRot.y;
//         newRot.y = clockwise ? -newRot.z : newRot.z;
//         newRot.z = clockwise ? oldY : -oldY;
//     } else if (axis === 'y') {
//         const oldX = newRot.x;
//         newRot.x = clockwise ? newRot.z : -newRot.z;
//         newRot.z = clockwise ? -oldX : oldX;
//     } else if (axis === 'z') {
//         const oldX = newRot.x;
//         newRot.x = clockwise ? -newRot.y : newRot.y;
//         newRot.y = clockwise ? oldX : -oldX;
//     }
//     return newRot;
// }
//
// function updateFaceRotation(cubie) {
//     const faces = cubie.dom.querySelectorAll('.face');
//     faces.forEach(face => {
//         const baseClass = face.classList[1]; // z. B. "left", "top"
//
//         let transform = '';
//         if (baseClass === 'front') transform = `rotateY(${cubie.faceRotation.y}deg)`;
//         else if (baseClass === 'back') transform = `rotateY(${180 + cubie.faceRotation.y}deg)`;
//         else if (baseClass === 'left') transform = `rotateY(${-90 + cubie.faceRotation.y}deg)`;
//         else if (baseClass === 'right') transform = `rotateY(${90 + cubie.faceRotation.y}deg)`;
//         else if (baseClass === 'top') transform = `rotateX(${-90 + cubie.faceRotation.x}deg)`;
//         else if (baseClass === 'bottom') transform = `rotateX(${90 + cubie.faceRotation.x}deg)`;
//
//         face.style.transform = `${transform} translateZ(${cubieSize / 2}px)`;
//     });
// }
//
// function resetstats() {
//     moveCount = 0;
//     moveCountEl.textContent = moveCount;
//
//     gameStartTime = Date.now();
//     updateTimerDisplay();
//     clearInterval(timerInterval);
//     timerInterval = setInterval(updateTimerDisplay, 1000);
// }
//
// document.getElementById('start-button').addEventListener('click', () => {
//     let input = seedInput?.value.trim();
//     let seed;
//
//     if (!input) {
//         seed = Math.floor(Math.random() * 1e9); // leer → Zufallsseed
//     } else if (/^\d+$/.test(input)) {
//         seed = parseInt(input, 10); // nur Ziffern → direkt als Zahl verwenden
//     } else {
//         seed = hashSeed(input);     // sonst → hash aus String
//     }
//
//     scrambleCube(20, seed);
//
//     moveLogEl.textContent = '';
//     playerMoves = [];
//     loggingEnabled = false;
//
//     seedInput.disabled = true;
//
//     resetstats();
//
//     setTimeout(() => {
//         loggingEnabled = true;
//     }, 500); // warten bis Scramble vorbei
//
//     document.getElementById('start-button').style.display = 'none';
//     document.getElementById('reset-button').style.display = 'inline-block';
// });
//
// document.getElementById('reset-button').addEventListener('click', () => {
//     loggingEnabled = false;
//     moveLogEl.textContent = '';
//     playerMoves = [];
//
//     resetstats();
//
//     initCube(); // Zurücksetzen
//     setTimeout(() => applyMoves(scrambleMoves, 50), 100);
//     setTimeout(() => loggingEnabled = true, scrambleMoves.length * 50 + 100);
// });
//
// copySeedBtn.addEventListener('click', () => {
//     navigator.clipboard.writeText(seedInput.value.trim());
// });
//
// window.addEventListener('keydown', (e) => {
//     if (e.key.toLowerCase() === 'l') {
//         forceSolvedState();
//     }
// });
//
// createLayerButtons();
// document.getElementById('hint-button').addEventListener('click', suggestNextMove);
//
// window.rotateLayer = rotateLayer;
// initCube();
//
