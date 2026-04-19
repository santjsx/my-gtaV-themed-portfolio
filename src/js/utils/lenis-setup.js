import Lenis from 'lenis';
import 'lenis/dist/lenis.css';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';

export function setupLenis() {
    gsap.registerPlugin(ScrollTrigger);

    const lenis = new Lenis({
        lerp: 0.1,               /* Silky smooth */
        wheelMultiplier: 1.0,     /* Standard wheel multiplier */
        smoothWheel: true,
        smoothTouch: true,
        touchMultiplier: 2.0,     /* Natural mobile swipe without overshoot */
        gestureOrientation: 'vertical',
        infinite: false,
        autoResize: true,
        syncTouch: true,          /* Synchronize touch events with rAF */
        syncTouchLerp: 0.08,     /* Gentle touch deceleration curve */
    });

    // Synchronize Lenis with ScrollTrigger
    lenis.on('scroll', ScrollTrigger.update);

    // Add Lenis's requestAnimationFrame to GSAP's ticker
    // This ensures perfect synchronization between GSAP animations and smooth scrolling
    gsap.ticker.add((time) => {
        lenis.raf(time * 1000);
    });

    // Prevents lagging by setting GSAP's max lag processing to 0
    gsap.ticker.lagSmoothing(0);

    // Pause Lenis when tab is hidden to save GPU cycles
    document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
            lenis.stop();
        } else {
            lenis.start();
        }
    });

    // Expose lenis for other modules if needed
    window.__lenis = lenis;

    return lenis;
}
