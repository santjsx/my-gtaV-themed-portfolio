// src/js/utils/preloader.js
// Ultra-Premium Cinematic Title Sequence
// Built with GSAP for high-fidelity motion control

import gsap from 'gsap';

export function initPreloader() {
    return new Promise((resolve) => {
        const loader = document.getElementById('premium-preloader');
        if (!loader) {
            resolve();
            return;
        }

        const percentEl = document.getElementById('loader-percent');
        const nameEls = loader.querySelectorAll('.loader-name');
        const topMeta = loader.querySelector('.loader-top-meta');
        const bottomMeta = loader.querySelector('.loader-bottom-meta');
        const panels = loader.querySelectorAll('.loader-panel');
        const letterboxes = loader.querySelectorAll('.loader-letterbox');

        // Lock Body Scroll
        document.body.style.overflow = 'hidden';

        // ── 1. Preparation ──
        gsap.set([topMeta, bottomMeta], { opacity: 0 });
        gsap.set(nameEls, { y: '110%', opacity: 0, filter: 'blur(20px)' });

        // ── 2. Entrance Sequence ──
        const entranceTl = gsap.timeline({
            defaults: { ease: "power4.out", duration: 1.2 }
        });

        entranceTl
            .to(topMeta, { opacity: 1, y: 0, duration: 1 }, "+=0.5")
            .to(nameEls, {
                y: 0,
                opacity: 1,
                filter: "blur(0px)",
                stagger: 0.2,
                ease: "expo.out"
            }, "-=0.6")
            .to(bottomMeta, { opacity: 1, y: 0, duration: 0.8 }, "-=0.8");

        // ── 3. Loading Logic ──
        let loadProgress = 0;
        let targetProgress = 0;
        let isFullyLoaded = false;

        const setTarget = (val) => {
            if (val > targetProgress) targetProgress = val;
        };

        const updateCounter = () => {
            if (percentEl && loadProgress < targetProgress) {
                // Smooth interpolation towards target
                loadProgress += (targetProgress - loadProgress) * 0.1 + 0.2;
                
                if (loadProgress > targetProgress) loadProgress = targetProgress;
                
                percentEl.textContent = Math.floor(loadProgress).toString().padStart(2, '0');
            }

            if (loadProgress < 100) {
                requestAnimationFrame(updateCounter);
            } else if (loadProgress >= 100 && !isFullyLoaded) {
                isFullyLoaded = true;
                triggerExitSequence();
            }
        };
        requestAnimationFrame(updateCounter);

        // simulated steps - safety checked
        setTimeout(() => { setTarget(25); }, 200);
        setTimeout(() => { setTarget(50); }, 600);
        setTimeout(() => { setTarget(85); }, 1100);

        // Window Load Promise
        const windowLoad = new Promise(res => {
            if (document.readyState === 'complete') {
                res();
            } else {
                window.addEventListener('load', res, { once: true });
            }
        });

        // Failsafe: Resolve after 3.5s max
        const failsafe = new Promise(res => setTimeout(res, 3500));
        
        fetch('/Santhosh%20Reddy%20Resume.pdf').catch(() => null);

        Promise.race([windowLoad, failsafe]).then(() => {
            // Intentional delay to allow the "Entrance Animation" to breathe 
            // before we slam the progress to 100%
            setTimeout(() => {
                setTarget(100);
            }, 1500); 
        });

        // ── 4. Exit Sequence (The "Wow" Moment) ──
        function triggerExitSequence() {
            const exitTl = gsap.timeline({
                onComplete: () => {
                    document.body.style.overflow = '';
                    loader.classList.add('loaded');
                    setTimeout(() => loader.remove(), 1000);
                    resolve();
                }
            });

            exitTl
                // A. Subliminal Tension: Slight jitter/tighten before release
                .to(nameEls, {
                    scale: 1.05,
                    letterSpacing: "0.1em",
                    duration: 0.8,
                    ease: "power2.inOut"
                })
                // B. The Flash Cut: Everything fades to white/black instantly
                .to([topMeta, bottomMeta, nameEls], {
                    opacity: 0,
                    y: -20,
                    duration: 0.4,
                    stagger: 0.05,
                    ease: "power4.in"
                })
                // C. The Cinematic Split: Open the Letterboxes and Panels
                .to(letterboxes, {
                    scaleY: 0,
                    opacity: 0,
                    duration: 0.6,
                    ease: "expo.in"
                }, "-=0.2")
                .to(panels[0], { // Top Panel
                    yPercent: -101,
                    duration: 1.2,
                    ease: "power4.inOut"
                }, "-=0.3")
                .to(panels[1], { // Bottom Panel
                    yPercent: 101,
                    duration: 1.2,
                    ease: "power4.inOut"
                }, "<");
        }
    });
}
