// src/js/utils/hero-effects.js
// Premium Fight Club hero: staggered reveal, scramble text, subliminal flash, glow tracking

const FC_CHARS = '!@#$%^&*()_+-=[]{}|;:,.<>?/01';

/**
 * Staggered reveal of headline rows with a cinematic delay
 */
function initHeadlineReveal() {
    const rows = document.querySelectorAll('.headline-row, .headline-divider');
    if (!rows.length) return;

    rows.forEach((row, i) => {
        row.style.opacity = '0';
        row.style.transform = 'translateY(30px)';
        row.style.transition = `opacity 0.7s cubic-bezier(0.22, 1, 0.36, 1), transform 0.7s cubic-bezier(0.22, 1, 0.36, 1)`;
        row.style.transitionDelay = `${0.3 + i * 0.12}s`;
    });

    // Trigger after a frame so CSS kicks in
    requestAnimationFrame(() => {
        requestAnimationFrame(() => {
            rows.forEach(row => {
                row.style.opacity = '1';
                row.style.transform = 'translateY(0)';
            });
        });
    });
}

/**
 * Scramble-reveal the hero rule tag "// first rule of clean code"
 */
function initRuleTagScramble() {
    const el = document.getElementById('hero-rule-tag');
    if (!el) return;

    const originalText = el.textContent;
    el.textContent = '';
    let iteration = 0;

    setTimeout(() => {
        const interval = setInterval(() => {
            el.textContent = originalText
                .split('')
                .map((char, i) => {
                    if (i < iteration) return originalText[i];
                    if (char === ' ') return ' ';
                    return FC_CHARS[Math.floor(Math.random() * FC_CHARS.length)];
                })
                .join('');

            if (iteration >= originalText.length) {
                clearInterval(interval);
            }
            iteration += 0.5;
        }, 30);
    }, 400);
}

/**
 * Subliminal Tyler Flash — randomly fires a full-screen pink flash
 * with a Fight Club quote for exactly 1-2 frames
 */
function initSubliminalFlash() {
    const flashEl = document.getElementById('subliminal-flash');
    if (!flashEl) return;

    const quotes = [
        'You are not your code.',
        'It\'s only after we\'ve lost everything that we\'re free to build anything.',
        'The things you own end up owning you.',
        'Self-improvement is masturbation.',
        'First rule: you do not talk about bugs.',
    ];

    function triggerFlash() {
        const quote = quotes[Math.floor(Math.random() * quotes.length)];
        flashEl.querySelector('span').textContent = quote;
        flashEl.classList.add('active');
        
        setTimeout(() => {
            flashEl.classList.remove('active');
        }, 100);

        // Next flash: 12-30 seconds
        setTimeout(triggerFlash, 12000 + Math.random() * 18000);
    }

    // First flash after 6-14 seconds
    setTimeout(triggerFlash, 6000 + Math.random() * 8000);
}

/**
 * Ambient glow follows cursor (desktop only)
 */
function initGlowTracking() {
    const glow = document.querySelector('.hero-ambient-glow');
    if (!glow || window.innerWidth < 900) return;

    const hero = document.querySelector('.hero');
    if (!hero) return;

    let targetX = 50, targetY = 50, currentX = 50, currentY = 50;

    hero.addEventListener('mousemove', (e) => {
        const rect = hero.getBoundingClientRect();
        targetX = ((e.clientX - rect.left) / rect.width) * 100;
        targetY = ((e.clientY - rect.top) / rect.height) * 100;
    });

    function lerp() {
        currentX += (targetX - currentX) * 0.04;
        currentY += (targetY - currentY) * 0.04;
        glow.style.left = `${currentX}%`;
        glow.style.top = `${currentY}%`;
        requestAnimationFrame(lerp);
    }
    lerp();
}

/**
 * Initialize all hero effects
 */
export function initHeroEffects() {
    initHeadlineReveal();
    initRuleTagScramble();
    initSubliminalFlash();
    initGlowTracking();
}
