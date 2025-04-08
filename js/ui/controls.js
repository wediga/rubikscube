// controls.js – zuständig für UI-Steuerung und Button-Erstellung

import { rotateLayer } from '../core/rotation.js';

export function createLayerButtons(containerId = 'layer-buttons') {
    const container = document.getElementById(containerId);
    container.innerHTML = '';
    ['x', 'y', 'z'].forEach(axis => {
        const row = document.createElement('div');
        row.classList.add('layer-row');
        const label = document.createElement('span');
        label.className = 'layer-label';
        label.textContent = `${axis.toUpperCase()}-Axis:`;
        row.appendChild(label);

        [-1, 0, 1].forEach(index => {
            [true, false].forEach(clockwise => {
                const btn = document.createElement('button');
                btn.textContent = `${axis.toUpperCase()}${index} ${clockwise ? '↻' : '↺'}`;
                btn.setAttribute('data-axis', axis);
                btn.setAttribute('data-index', index);
                btn.setAttribute('data-dir', clockwise ? 'cw' : 'ccw');
                btn.addEventListener('click', () => rotateLayer(axis, index, clockwise));
                row.appendChild(btn);
            });
        });
        container.appendChild(row);
    });
}

export function clearHintHighlight() {
    document.querySelectorAll('.hint-highlight').forEach(b => b.classList.remove('hint-highlight'));
}