// src/js/utils/preloader.js

export function initPreloader() {
    const loader = document.getElementById('premium-preloader');
    const percentEl = document.getElementById('loader-percent');
    
    // Only execute on mobile where the loader is visible
    if (!loader || window.getComputedStyle(loader).display === 'none') {
        return;
    }

    // Lock body scroll while loading
    document.body.style.overflow = 'hidden';

    let loadProgress = 0;
    let targetProgress = 0;
    
    // Smooth counter animation
    const updateCounter = () => {
        if (loadProgress < targetProgress) {
            loadProgress++;
            // Pad to always be 2 digits (01, 05, 99)
            percentEl.textContent = loadProgress.toString().padStart(2, '0');
        }

        if (loadProgress < 100) {
            requestAnimationFrame(updateCounter);
        } else if (loadProgress >= 100 && !loader.classList.contains('loaded')) {
            // Unveil the website
            setTimeout(() => {
                loader.classList.add('loaded');
                document.body.style.overflow = ''; // Unlock scroll
                
                // Remove from DOM eventually to save memory
                setTimeout(() => loader.remove(), 1200);
            }, 500);
        }
    };
    
    // Start animation loop
    requestAnimationFrame(updateCounter);

    // Initial bump to show it's working
    setTimeout(() => { targetProgress = 35; }, 100);
    setTimeout(() => { targetProgress = 60; }, 500);
    setTimeout(() => { targetProgress = 85; }, 1200);

    // Promise 1: Fetch the PDF to cache it natively (silent background)
    fetch('/Santhosh%20Reddy%20Resume.pdf').catch(() => null);

    // Promise 2: Await Window Load (all images/css done)
    const windowLoad = new Promise(resolve => {
        if (document.readyState === 'complete') {
            resolve();
        } else {
            window.addEventListener('load', resolve, { once: true });
        }
    });

    // Failsafe: Maximum time we will ever force the user to wait (2.5 seconds)
    const absoluteFailsafe = new Promise(resolve => setTimeout(resolve, 2500));

    // Resolve when Window loads OR 2.5 seconds pass (whichever is faster)
    Promise.race([windowLoad, absoluteFailsafe]).then(() => {
        targetProgress = 100;
    });
}
