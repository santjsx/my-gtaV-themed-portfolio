/**
 * Intelligent Navigation Highlighting (ScrollSpy + Page Detection)
 * Ensures the cinematic active underline follows the user's focus precisely.
 */
export function initNavHighlighter() {
    const navItems = document.querySelectorAll('.nav-item');
    const sections = ['about', 'work', 'contact'];
    
    // Normalize path to handle local dev vs production
    const path = window.location.pathname;
    const isMusicPage = path.includes('music.html');
    const isHomePage = path === '/' || path.endsWith('index.html') || (!isMusicPage && path.split('/').pop().indexOf('.') === -1);

    /**
     * Highlights the correct nav item by href matching
     */
    const highlightByHref = (href) => {
        navItems.forEach(item => {
            const itemHref = item.getAttribute('href');
            // Match exactly or check if itemHref ends with the target (for cross-page links)
            if (itemHref === href || (href !== '#' && itemHref.endsWith(href))) {
                item.classList.add('active');
            } else {
                item.classList.remove('active');
            }
        });
    };

    // 1. STANDALONE PAGE DETECTION
    if (isMusicPage) {
        highlightByHref('music.html');
        return; // We don't need ScrollSpy on the standalone music page
    }

    // 2. HOME PAGE SCROLLSPY (IntersectionObserver)
    if (isHomePage) {
        const observerOptions = {
            root: null,
            rootMargin: '-25% 0px -50% 0px', // Focuses on the upper-middle area of the viewport
            threshold: 0
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const id = entry.target.getAttribute('id');
                    highlightByHref(`#${id}`);
                }
            });
        }, observerOptions);

        // Observe defined sections
        sections.forEach(id => {
            const el = document.getElementById(id);
            if (el) observer.observe(el);
        });

        // SPECIAL CASE: TOP OF PAGE (Hero)
        // If the hero is significantly visible, we clear all highlights to keep it clean
        const hero = document.getElementById('hero');
        if (hero) {
            const heroObserver = new IntersectionObserver((entries) => {
                if (entries[0].isIntersecting) {
                    navItems.forEach(item => item.classList.remove('active'));
                }
            }, { threshold: 0.6 });
            heroObserver.observe(hero);
        }
    }
}
