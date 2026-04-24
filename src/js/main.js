import { setupLenis } from './utils/lenis-setup.js';
import { initScrollObserver } from './utils/scroll-observer.js';
import { initTitleAnimation } from './utils/title-anim.js';
import { initResumeDrawer } from './utils/drawer.js';
import { initPreloader } from './utils/preloader.js';
import { initHeroEffects } from './utils/hero-effects.js';
import { initContactSection } from './utils/contact.js';
import { initLanyardWidget } from './utils/lanyard.js';
import { initGSAPAnimations } from './utils/gsap-animations.js';
import { initAboutReveal } from './utils/about-reveal.js';
import { initMusicHistory } from './utils/music.js';
import { initNavHighlighter } from './utils/nav-highlighter.js';
import { initVibePortal } from './utils/vibe-portal.js';

document.addEventListener('DOMContentLoaded', () => {
    // 1. PHASE 0: CRITICAL BOOT (Immediate)
    if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
    window.scrollTo(0, 0);

    // Initial fundamental UI
    const preloaderPromise = initPreloader();
    const lenis = setupLenis();
    initVibePortal();

    // Header optimized scroll listener
    const header = document.getElementById('header');
    if (header) {
        let ticking = false;
        window.addEventListener('scroll', () => {
            if (!ticking) {
                requestAnimationFrame(() => {
                    header.classList.toggle('scrolled', window.scrollY > 40);
                    ticking = false;
                });
                ticking = true;
            }
        }, { passive: true });
    }

    // 2. PHASE 1: UI INTERACTIVITY (After Preloader)
    preloaderPromise.then(() => {
        // Essential entrance effects
        initHeroEffects();
        initTitleAnimation();
        
        // Stagger non-critical modules to avoid long tasks
        const deferredModules = [
            { fn: initGSAPAnimations, delay: 0 },
            { fn: initAboutReveal, delay: 100 },
            { fn: initScrollObserver, delay: 200 },
            { fn: initMusicHistory, delay: 400 },
            { fn: initNavHighlighter, delay: 600 },
            { fn: initResumeDrawer, delay: 800 },
            { fn: initContactSection, delay: 1000 },
            { fn: initLanyardWidget, delay: 1200 }
        ];

        deferredModules.forEach(({ fn, delay }) => {
            setTimeout(() => {
                if (typeof fn === 'function') fn();
            }, delay);
        });
    });

    // Mobile Menu Optimization
    setupMobileMenu();
});

function setupMobileMenu() {
    const mobileToggle = document.getElementById('mobile-menu-toggle');
    const navOverlay = document.getElementById('nav-overlay');
    const navClose = document.getElementById('nav-close');
    const navItemLinks = document.querySelectorAll('.nav-overlay .nav-item');

    if (!mobileToggle || !navOverlay) return;

    const toggleMenu = (open) => {
        mobileToggle.classList.toggle('active', open);
        navOverlay.classList.toggle('active', open);
        document.body.style.overflow = open ? 'hidden' : '';
    };

    mobileToggle.addEventListener('click', () => {
        const isOpen = navOverlay.classList.contains('active');
        toggleMenu(!isOpen);
    });

    if (navClose) navClose.addEventListener('click', () => toggleMenu(false));

    navItemLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (window.innerWidth <= 768) toggleMenu(false);
        });
    });
}
