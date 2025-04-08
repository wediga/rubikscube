// interaction.js – Benutzerrotation des gesamten Cubes via Maus

const wrapper = document.getElementById('cube-wrapper');

let isDragging = false;
let lastX = 0;
let lastY = 0;
let rotationX = -30;
let rotationY = 45;

function updateCubeTransform() {
    wrapper.style.transform = `translate(-50%, -50%) rotateX(${rotationX}deg) rotateY(${rotationY}deg)`;
}

export function enableCubeDragRotation() {
    document.querySelector('.scene').addEventListener('mousedown', (e) => {
        isDragging = true;
        lastX = e.clientX;
        lastY = e.clientY;
    });

    window.addEventListener('mouseup', () => {
        isDragging = false;
    });

    window.addEventListener('mousemove', (e) => {
        if (!isDragging) return;
        const dx = e.clientX - lastX;
        const dy = e.clientY - lastY;
        lastX = e.clientX;
        lastY = e.clientY;

        rotationY += dx * 0.4;  // Links ↔ Rechts bleibt wie es ist
        rotationX -= dy * 0.4;  // Vertikalrichtung invertiert = natürlicher
        rotationX = Math.max(-90, Math.min(90, rotationX));

        updateCubeTransform();
    });

    updateCubeTransform();
}