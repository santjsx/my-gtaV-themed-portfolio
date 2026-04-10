// src/js/utils/contact.js
// Simplified for the minimal Fight Club contact layout

export function initContactSection() {
    // Dynamic year
    const yearEl = document.getElementById('year');
    if (yearEl) {
        yearEl.textContent = new Date().getFullYear();
    }
}
