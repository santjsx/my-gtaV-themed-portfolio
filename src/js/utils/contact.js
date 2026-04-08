// src/js/utils/contact.js
// Copy email to clipboard via the secure comms link

export function initContactSection() {
    const decryptLinks = document.querySelectorAll('.decrypt-link');
    if (!decryptLinks.length) return;

    decryptLinks.forEach(link => {
        link.addEventListener('click', async (e) => {
            // Only prevent default if it's not a mailto link, 
            // but we want to allow mailto to open the email client natively.
            // Actually, let's copy to clipboard AND let mailto trigger if supported.
            // A simple way is to just do the copy alongside the native click action.
            
            const maskEl = link.querySelector('.decrypt-mask');
            if (!maskEl) return;
            
            const email = maskEl.dataset.real;
            if (!email) return;

            try {
                await navigator.clipboard.writeText(email);

                const originalText = maskEl.innerText;
                const originalReal = maskEl.dataset.real;

                // Visual Feedback: Show copied state
                maskEl.innerText = '[ SECURE_COPIED ]';
                maskEl.dataset.real = '[ SECURE_COPIED ]';
                maskEl.style.color = '#4ade80'; // hacker green
                link.style.pointerEvents = 'none';

                setTimeout(() => {
                    maskEl.innerText = originalText;
                    maskEl.dataset.real = originalReal;
                    maskEl.style.color = '';
                    link.style.pointerEvents = 'all';
                }, 2000);
            } catch (err) {
                console.error("Clipboard API failed: ", err);
            }
        });
    });
}
