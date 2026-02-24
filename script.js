/* PERFORMANCE & ANIMATIONS */

/* Smooth Scroll */
const lenis = new Lenis({
  duration: 1.6,
  easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
  smoothTouch: true,
  touchMultiplier: 1.5,
  touchInertiaMultiplier: 25,
});

// Sync Lenis with GSAP for butter-smooth performance
lenis.on("scroll", ScrollTrigger.update);

gsap.ticker.fps(120); // Unlock 120fps for high refresh rate monitors
gsap.ticker.add((time) => {
  lenis.raf(time * 1000);
});

gsap.ticker.lagSmoothing(0);

// Register ScrollTrigger
gsap.registerPlugin(ScrollTrigger);

/* Theme Toggle */
const themeToggle = document.getElementById('theme-toggle');
const mobileThemeToggle = document.getElementById('mobile-theme-toggle');
const themeIcon = themeToggle.querySelector('i');
const mobileThemeIcon = mobileThemeToggle.querySelector('i');

// Check for saved theme
const currentTheme = localStorage.getItem('theme') || 'light';
if (currentTheme === 'dark') {
  document.documentElement.setAttribute('data-theme', 'dark');
  themeIcon.className = 'ri-sun-line';
  if (mobileThemeIcon) mobileThemeIcon.className = 'ri-sun-line';
  if (mobileThemeToggle) mobileThemeToggle.innerHTML = '<i class="ri-sun-line"></i> Theme';
}

function executeThemeSwitch() {
  const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
  if (isDark) {
    document.documentElement.setAttribute('data-theme', 'light');
    localStorage.setItem('theme', 'light');
    themeIcon.className = 'ri-moon-line';
    if (mobileThemeIcon) mobileThemeIcon.className = 'ri-moon-line';
    if (mobileThemeToggle) mobileThemeToggle.innerHTML = '<i class="ri-moon-line"></i> Theme';
  } else {
    document.documentElement.setAttribute('data-theme', 'dark');
    localStorage.setItem('theme', 'dark');
    themeIcon.className = 'ri-sun-line';
    if (mobileThemeIcon) mobileThemeIcon.className = 'ri-sun-line';
    if (mobileThemeToggle) mobileThemeToggle.innerHTML = '<i class="ri-sun-line"></i> Theme';
  }
}

function toggleTheme(e) {
  if (!document.startViewTransition) {
    executeThemeSwitch();
    return;
  }
  const x = e?.clientX ?? window.innerWidth / 2;
  const y = e?.clientY ?? window.innerHeight / 2;
  document.documentElement.style.setProperty('--x', `${x}px`);
  document.documentElement.style.setProperty('--y', `${y}px`);
  document.startViewTransition(() => {
    executeThemeSwitch();
  });
}

themeToggle.addEventListener('click', toggleTheme);
if (mobileThemeToggle) {
  mobileThemeToggle.addEventListener('click', (e) => {
    toggleTheme(e);
    if (isMenuOpen) toggleMobileMenu();
  });
}

/* Navigation Styles */
const nav = document.getElementById("main-nav");
const navToggle = document.getElementById("nav-toggle");
const mobileOverlay = document.getElementById("mobile-nav-overlay");
const mobileLinks = document.querySelectorAll(".mobile-link span");
const mobileStatusSection = document.querySelector(".mobile-status-section");
const mobileNavFooter = document.querySelector(".mobile-nav-footer");
let isMenuOpen = false;

const menuTl = gsap.timeline({ paused: true });
menuTl
  .to(mobileOverlay, { autoAlpha: 1, duration: 0.5, ease: "power4.inOut" })
  .fromTo(mobileLinks, { y: 100 }, { y: 0, duration: 0.8, stagger: 0.1, ease: "power4.out" }, "-=0.3")
  .fromTo(mobileStatusSection, { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6 }, "-=0.4")
  .fromTo(mobileNavFooter, { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6 }, "-=0.5");

function toggleMobileMenu() {
  if (isMenuOpen) {
    menuTl.reverse();
    navToggle.classList.remove("active");
    gsap.to(navToggle, { scale: 1, duration: 0.4, ease: "power2.out" });
    document.body.style.overflow = "";
    isMenuOpen = false;
  } else {
    menuTl.play();
    navToggle.classList.add("active");
    gsap.fromTo(navToggle, { scale: 0.9 }, { scale: 1, duration: 0.5, ease: "elastic.out(1, 0.5)" });
    document.body.style.overflow = "hidden";
    isMenuOpen = true;
  }
}

navToggle.addEventListener("click", toggleMobileMenu);
document.querySelectorAll(".mobile-link").forEach((link) => {
  link.addEventListener("click", () => { if (isMenuOpen) toggleMobileMenu(); });
});

document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute("href"));
    if (target) lenis.scrollTo(target, { offset: -80, duration: 1.4 });
  });
});

/* GSAP Animations */

function initScrollAnimations() {
  gsap.utils.toArray(".anim-fade-up").forEach((el, i) => {
    gsap.to(el, {
      opacity: 1, y: 0, duration: 0.9, ease: "power3.out", force3D: true,
      scrollTrigger: { trigger: el, start: "top 88%", toggleActions: "play none none none" },
      delay: el.closest(".hero") ? i * 0.12 : 0.05
    });
  });

  // --- Hero Letter Split Animation ---
  document.querySelectorAll("[data-hero-split]").forEach(span => {
    const text = span.childNodes;
    const frag = document.createDocumentFragment();
    text.forEach(node => {
      if (node.nodeType === 3) { // text node
        node.textContent.split("").forEach(char => {
          const s = document.createElement("span");
          s.className = "hero-letter";
          s.textContent = char;
          frag.appendChild(s);
        });
      } else {
        frag.appendChild(node.cloneNode(true)); // preserve accent-dot span
      }
    });
    span.innerHTML = "";
    span.appendChild(frag);
  });

  const heroLetters = document.querySelectorAll(".hero-letter");
  if (heroLetters.length > 0) {
    gsap.to(heroLetters, {
      opacity: 1, y: 0, rotate: 0, force3D: true,
      duration: 0.8, stagger: 0.04,
      ease: "power4.out", delay: 0.3
    });
  }

  // --- Accent Lines Draw-In ---
  gsap.to(".hero-line-h", { scaleX: 1, duration: 1.2, ease: "power4.inOut", force3D: true, delay: 0.6 });
  gsap.to(".hero-line-v", { scaleY: 1, duration: 1.2, ease: "power4.inOut", force3D: true, delay: 0.8 });

  // Technical Scanner Animation
  const scannerWrap = document.querySelector(".about-image-wrapper");
  if (scannerWrap) {
    const locks = scannerWrap.querySelectorAll(".lock");
    const line = scannerWrap.querySelector(".scanner-line");
    gsap.timeline({ scrollTrigger: { trigger: scannerWrap, start: "top 80%" } })
      .to(locks, { opacity: 0.8, duration: 0.5 })
      .fromTo(locks, { inset: "40%" }, { inset: "1.5rem", duration: 1, ease: "power4.out" }, "<")
      .set(line, { display: "block" }, "-=0.2")
      .fromTo(line, { opacity: 0 }, { opacity: 0.3, duration: 1 }, "<");
  }
}

// --- Hero Mouse Parallax ---
function initHeroParallax() {
  if ("ontouchstart" in window) return; // disable on touch devices

  const hero = document.querySelector(".hero");
  const title = document.querySelector(".hero-title");
  const ambient = document.querySelector(".hero-ambient");
  if (!hero || !title) return;

  let ticking = false;
  hero.addEventListener("mousemove", (e) => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      const rect = hero.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      gsap.to(title, { x: x * 15, y: y * 10, duration: 0.8, ease: "power2.out", force3D: true });
      if (ambient) gsap.to(ambient, { x: x * -30, y: y * -20, duration: 1.2, ease: "power2.out", force3D: true });
      ticking = false;
    });
  }, { passive: true });

  hero.addEventListener("mouseleave", () => {
    gsap.to(title, { x: 0, y: 0, duration: 0.6, ease: "power2.out", force3D: true });
    if (ambient) gsap.to(ambient, { x: 0, y: 0, duration: 0.8, ease: "power2.out", force3D: true });
  });
}

function initParallax() {
  document.querySelectorAll("[data-parallax]").forEach((el) => {
    const speed = parseFloat(el.getAttribute("data-parallax"));
    gsap.to(el, { y: 100 * speed, ease: "none", force3D: true, scrollTrigger: { trigger: el, start: "top bottom", end: "bottom top", scrub: true } });
  });
}

function initMagneticConstellation() {
  const wrapper = document.querySelector('.constellation-wrapper');
  const nodes = document.querySelectorAll('.skill-node');
  if (!wrapper || nodes.length === 0) return;

  // Configuration for constellation physics
  const floatRange = 30; // Max px they drift normally
  const floatDuration = 4; // Seconds per float cycle

  const repelRadius = 200; // Radius of mouse influence
  const repelForce = 80;   // Max px they get pushed away

  const wrapperRect = wrapper.getBoundingClientRect();
  const nodeData = [];

  // 1. Initial Spread & Float Animation
  nodes.forEach((node) => {
    // Generate random constraints within wrapper (adding padding so they don't clip off edge)
    const nodeWidth = node.offsetWidth;
    const nodeHeight = node.offsetHeight;

    // We want them somewhat scattered but avoiding extreme edges
    const randomX = gsap.utils.random(10, 80); // percentage 10% to 90%
    const randomY = gsap.utils.random(10, 80);

    // Set base position natively
    node.style.left = `${randomX}%`;
    node.style.top = `${randomY}%`;

    // Scale based on data-weight attached to HTML
    const weight = parseFloat(node.getAttribute("data-weight")) || 1;
    gsap.set(node, { scale: weight });

    // Staggered reveal
    gsap.to(node, { opacity: parseFloat(weight) >= 1.2 ? 1 : 0.8, duration: 1, delay: gsap.utils.random(0, 0.5) });

    // Continuous random drift loop (the "floating" state)
    gsap.to(node, {
      x: `random(-${floatRange}, ${floatRange})`,
      y: `random(-${floatRange}, ${floatRange})`,
      rotation: `random(-10, 10)`,
      duration: `random(${floatDuration - 1}, ${floatDuration + 2})`,
      ease: "sine.inOut",
      yoyo: true,
      repeat: -1,
      repeatRefresh: true // pick new random values each loop
    });

    // Store node data for repel math
    nodeData.push({ element: node, initialX: randomX, initialY: randomY });
  });

  // 2. Mouse Interaction: Magnetic Repel Effect
  // If on mobile (touch), skip the intensive math listener
  if ("ontouchstart" in window) return;

  wrapper.addEventListener("mousemove", (e) => {
    const rect = wrapper.getBoundingClientRect();
    // Mouse X/Y relative to the wrapper center
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    nodes.forEach((node) => {
      // Get current center of node
      const nodeRect = node.getBoundingClientRect();
      const nodeCenterX = nodeRect.left - rect.left + nodeRect.width / 2;
      const nodeCenterY = nodeRect.top - rect.top + nodeRect.height / 2;

      // Calculate distance between mouse and node center
      const dx = nodeCenterX - mouseX;
      const dy = nodeCenterY - mouseY;
      const distance = Math.sqrt(dx * dx + dy * dy);

      // If mouse is within the repel radius of the node
      if (distance < repelRadius) {
        // Calculate force vector
        const force = (repelRadius - distance) / repelRadius; // 1 at center, 0 at edge

        // Push node away based on angle and force
        const pushX = (dx / distance) * (repelForce * force);
        const pushY = (dy / distance) * (repelForce * force);

        // Animate the repel
        gsap.to(node, {
          x: `+=${pushX}`,
          y: `+=${pushY}`,
          duration: 0.4,
          ease: "power2.out",
          overwrite: "auto" // cancel ongoing drift momentarily
        });
      } else {
        // If outside radius, ensure drifting resumes smoothly.
        // We don't necessarily need to force them back since repeatRefresh handles it, 
        // but adding a subtle return to near-origin prevents clustering over time.
        gsap.to(node, {
          x: `random(-${floatRange}, ${floatRange})`,
          y: `random(-${floatRange}, ${floatRange})`,
          duration: `random(${floatDuration - 1}, ${floatDuration + 2})`,
          ease: "sine.inOut",
          overwrite: "auto",
          delay: 0.5 // Wait before resuming drift loop
        });
      }
    });
  }, { passive: true });
}

/* Contact Section Animations */
function initContactAnimations() {
  // Split text reveal for contact headlines
  document.querySelectorAll("[data-contact-split]").forEach(headline => {
    const inner = headline.querySelector("span");
    if (!inner) return;
    gsap.fromTo(inner,
      { y: "100%", opacity: 0 },
      {
        y: "0%", opacity: 1, duration: 1.2, ease: "power4.out",
        scrollTrigger: {
          trigger: headline,
          start: "top 85%",
          toggleActions: "play none none none"
        }
      }
    );
  });

  // Minimal footer bar reveal
  const footerBar = document.querySelector(".minimal-footer-bar");
  if (footerBar) {
    gsap.fromTo(footerBar,
      { y: 20, opacity: 0 },
      {
        y: 0, opacity: 1, duration: 1, ease: "power3.out", force3D: true,
        scrollTrigger: {
          trigger: ".contact-section",
          start: "top 70%",
          toggleActions: "play none none none"
        }
      }
    );
  }

  // Contact ambient glow mouse parallax
  const contactSection = document.querySelector(".contact-section");
  const contactAmbient = document.getElementById("contact-ambient");
  if (contactSection && contactAmbient && !("ontouchstart" in window)) {
    contactSection.addEventListener("mousemove", (e) => {
      const rect = contactSection.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      gsap.to(contactAmbient, {
        x: x * 60, y: y * 40,
        duration: 1.5, ease: "power2.out", force3D: true
      });
    }, { passive: true });

    contactSection.addEventListener("mouseleave", () => {
      gsap.to(contactAmbient, { x: 0, y: 0, duration: 1, ease: "power2.out", force3D: true });
    });
  }

  // Copyright line reveal
  const copyright = document.querySelector(".contact-copyright");
  if (copyright) {
    gsap.fromTo(copyright,
      { opacity: 0 },
      {
        opacity: 0.5, duration: 1, ease: "power2.out", force3D: true,
        scrollTrigger: {
          trigger: ".contact-section",
          start: "top 70%",
          toggleActions: "play none none none"
        }
      }
    );
  }
}

function getIdleContext() {
  const hour = new Date().getHours();
  if (hour >= 0 && hour < 6) return { label: "DEEP SLEEP", desc: "System hibernating — back by morning" };
  if (hour >= 6 && hour < 9) return { label: "BOOTING UP", desc: "Initializing with caffeine..." };
  if (hour >= 9 && hour < 12) return { label: "OFFLINE", desc: "Probably in a lecture or building something" };
  if (hour >= 12 && hour < 14) return { label: "ON BREAK", desc: "Refueling — back shortly" };
  if (hour >= 14 && hour < 18) return { label: "AWAY", desc: "Heads-down on something. Check back soon" };
  if (hour >= 18 && hour < 21) return { label: "OFFLINE", desc: "Recharging creativity" };
  return { label: "WINDING DOWN", desc: "Wrapping up for the night" };
}

async function updateDiscordStatus() {
  const footerStack = document.getElementById("discord-activity-stack");
  const mobileStack = document.getElementById("mobile-activity-stack");
  try {
    const response = await fetch(`https://api.lanyard.rest/v1/users/1284925883240550552`);
    const data = await response.json();
    if (!data.success) return;

    const discordStatus = data.data.discord_status; // online, idle, dnd, offline
    const activities = data.data.activities.filter(a => a.type !== 4);

    if (activities.length === 0) {
      const ctx = getIdleContext();
      const dotClass = discordStatus === "offline" ? "" : discordStatus;
      const idleHTML = `
        <div class="idle-pill-minimal">
          <div class="status-indicator">
            <div class="status-pulse ${dotClass}"></div>
          </div>
          <div class="idle-pill-content">
            <span class="status-label">${ctx.label}</span>
            <span class="idle-pill-desc">${ctx.desc}</span>
          </div>
        </div>`;
      if (footerStack) footerStack.innerHTML = idleHTML;
      if (mobileStack) mobileStack.innerHTML = idleHTML;
      return;
    }

    // Prioritize Spotify for mobile, show only ONE activity in footer for minimalism
    const sorted = [...activities].sort((a, b) => (a.name === 'Spotify' ? -1 : 1));

    const primaryActivity = sorted[0];
    let cardHTML = '';

    if (primaryActivity.name === 'Spotify') {
      const albumArt = primaryActivity.album_art_url
        || (primaryActivity.assets?.large_image?.replace('spotify:', 'https://i.scdn.co/image/'))
        || '';
      cardHTML = `
        <div class="spotify-pill">
          <div class="spotify-vinyl">
             <img src="${albumArt}" alt="Album Art" class="spotify-cover">
             <div class="vinyl-hole"></div>
          </div>
          <div class="spotify-pill-info">
            <span class="spotify-pill-track">${primaryActivity.details || 'Unknown Track'}</span>
            <div class="spotify-pill-bottom">
              <span class="spotify-pill-artist">${primaryActivity.state || 'Unknown Artist'}</span>
              <div class="spotify-equalizer"><span></span><span></span><span></span></div>
            </div>
          </div>
          <div class="spotify-pill-brand"><i class="ri-spotify-fill"></i></div>
        </div>`;
    } else {
      let imageUrl = null;
      if (primaryActivity.assets?.large_image) {
        if (primaryActivity.assets.large_image.startsWith('mp:external')) {
          const extPath = primaryActivity.assets.large_image.split('mp:external/')[1];
          imageUrl = extPath ? `https://media.discordapp.net/external/${extPath}` : null;
        } else {
          imageUrl = `https://cdn.discordapp.com/app-assets/${primaryActivity.application_id}/${primaryActivity.assets.large_image}.png`;
        }
      }
      const details = primaryActivity.details || primaryActivity.state || '';
      cardHTML = `
        <div class="generic-activity-pill">
          ${imageUrl ? `<div class="generic-activity-icon"><img src="${imageUrl}" alt="${primaryActivity.name}"></div>` : ''}
          <div class="spotify-pill-info">
            <span class="spotify-pill-track">${primaryActivity.name}</span>
            <div class="spotify-pill-bottom">
              <span class="spotify-pill-artist">${details}</span>
            </div>
          </div>
        </div>`;
    }

    if (footerStack) footerStack.innerHTML = cardHTML;
    if (mobileStack) mobileStack.innerHTML = cardHTML;
  } catch (err) { console.warn("Lanyard fetch failed:", err); }
}

setInterval(updateDiscordStatus, 5000);
updateDiscordStatus();

// Real-time local clock (IST)
function updateLocalTime() {
  const el = document.getElementById("local-time");
  if (!el) return;
  el.textContent = new Date().toLocaleTimeString("en-IN", {
    hour: "2-digit", minute: "2-digit", second: "2-digit",
    hour12: true, timeZone: "Asia/Kolkata"
  });
}
setInterval(updateLocalTime, 1000);
updateLocalTime();

window.addEventListener("load", () => {
  if ("scrollRestoration" in history) history.scrollRestoration = "manual";
  window.scrollTo(0, 0);
  requestAnimationFrame(() => { initScrollAnimations(); initParallax(); initHeroParallax(); initMagneticConstellation(); initContactAnimations(); ScrollTrigger.refresh(); });
});

window.addEventListener("resize", () => { ScrollTrigger.refresh(); });
