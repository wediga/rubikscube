// rotation.js – zuständig für Layerrotation, Positionsupdate, Faceausrichtung

import { cubeState, getTransform } from './cube.js';
import { logMove } from '../ui/logger.js';

export function rotateLayer(axis, index, clockwise = true) {
    const angle = clockwise ? 90 : -90;
    const affected = cubeState.filter(c => c.pos[axis] === index);

    affected.forEach(cubie => {
        cubie.dom.style.transition = 'transform 0.5s ease-in-out';

        cubie.rotation[axis] += angle;
        cubie.rotation[axis] = (cubie.rotation[axis] + 360) % 360;
        cubie.faceRotation = rotateFaceOrientation(cubie.faceRotation, axis, clockwise);

        cubie.dom.style.transform = getTransform(cubie.pos.x, cubie.pos.y, cubie.pos.z, cubie.rotation);
    });

    setTimeout(() => {
        affected.forEach(cubie => {
            cubie.dom.style.transition = '';
            const { x, y, z } = cubie.pos;
            let newX = x, newY = y, newZ = z;
            if (axis === 'x') {
                newY = clockwise ? -z : z;
                newZ = clockwise ? y : -y;
            } else if (axis === 'y') {
                newX = clockwise ? z : -z;
                newZ = clockwise ? -x : x;
            } else if (axis === 'z') {
                newX = clockwise ? -y : y;
                newY = clockwise ? x : -x;
            }

            cubie.pos = { x: newX, y: newY, z: newZ };
            cubie.dom.dataset.x = newX;
            cubie.dom.dataset.y = newY;
            cubie.dom.dataset.z = newZ;
            cubie.dom.style.transform = getTransform(newX, newY, newZ, cubie.rotation);

            // Debugging Log: Tracking rotation and positions of cubies
            console.log(`Rotating layer: ${axis} ${index} ${clockwise ? '↻' : '↺'} | New Positions:`, cubeState.map(cubie => cubie.pos));
            console.log(`Rotation for Cubie at (${cubie.pos.x}, ${cubie.pos.y}, ${cubie.pos.z}) updated to:`, cubie.rotation);
        });
    }, 500);

    logMove(`${axis.toUpperCase()}${index}${clockwise ? '↻' : '↺'}`);
}

export function rotateFaceOrientation(current, axis, clockwise) {
    const newRot = { ...current };
    if (axis === 'x') {
        const oldY = newRot.y;
        newRot.y = clockwise ? -newRot.z : newRot.z;
        newRot.z = clockwise ? oldY : -oldY;
    } else if (axis === 'y') {
        const oldX = newRot.x;
        newRot.x = clockwise ? newRot.z : -newRot.z;
        newRot.z = clockwise ? -oldX : oldX;
    } else if (axis === 'z') {
        const oldX = newRot.x;
        newRot.x = clockwise ? -newRot.y : newRot.y;
        newRot.y = clockwise ? oldX : -oldX;
    }
    return newRot;
}
