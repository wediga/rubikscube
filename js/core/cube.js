// cube.js – zuständig für Aufbau & Zustand des Cubes

export const cube = document.getElementById('cube');
export const wrapper = document.getElementById('cube-wrapper');

export const offset = 60;
export const gap = 2;
export const cubieSize = offset;

export let cubeState = [];

export function getTransform(x, y, z, rotation = { x: 0, y: 0, z: 0 }) {
    const tx = x * (cubieSize + gap);
    const ty = y * (cubieSize + gap);
    const tz = z * (cubieSize + gap);
    return `translate3d(${tx}px, ${ty}px, ${tz}px) rotateX(${rotation.x}deg) rotateY(${rotation.y}deg) rotateZ(${rotation.z}deg)`;
}

export function createCubie(x, y, z) {
    const cubie = document.createElement('div');
    cubie.className = 'cubie';
    cubie.style.transform = getTransform(x, y, z);
    cubie.dataset.x = x;
    cubie.dataset.y = y;
    cubie.dataset.z = z;

    const faces = ['front', 'back', 'left', 'right', 'top', 'bottom'];
    faces.forEach(face => {
        const f = document.createElement('div');
        f.className = 'face ' + face;
        cubie.appendChild(f);
    });

    cube.appendChild(cubie);

    cubeState.push({
        dom: cubie,
        pos: { x, y, z },
        rotation: { x: 0, y: 0, z: 0 },
        faceRotation: { x: 0, y: 0, z: 0 },
    });
}

export function initCube() {
    cubeState = [];
    cube.innerHTML = '';
    for (let x = -1; x <= 1; x++) {
        for (let y = -1; y <= 1; y++) {
            for (let z = -1; z <= 1; z++) {
                createCubie(x, y, z);
            }
        }
    }
}
