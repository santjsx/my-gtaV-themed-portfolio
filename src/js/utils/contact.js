// src/js/utils/contact.js
// Copy email to clipboard with visual feedback

export function initContactSection() {
    const btn = document.getElementById('copy-email-btn');
    if (!btn) return;

    btn.addEventListener('click', async () => {
        const email = btn.dataset.email;
        const textEl = document.getElementById('copy-email-text');

        try {
            await navigator.clipboard.writeText(email);

            // Success feedback
            btn.classList.add('copied');
            textEl.textContent = 'Copied to clipboard ✓';

            setTimeout(() => {
                btn.classList.remove('copied');
                textEl.textContent = 'Copy email address';
            }, 2500);
        } catch (err) {
            // Fallback for older browsers
            const textarea = document.createElement('textarea');
            textarea.value = email;
            textarea.style.position = 'fixed';
            textarea.style.opacity = '0';
            document.body.appendChild(textarea);
            textarea.select();
            document.execCommand('copy');
            document.body.removeChild(textarea);

            btn.classList.add('copied');
            textEl.textContent = 'Copied to clipboard ✓';

            setTimeout(() => {
                btn.classList.remove('copied');
                textEl.textContent = 'Copy email address';
            }, 2500);
        }
    });
}
