// Initialize Icons
lucide.createIcons();
gsap.registerPlugin(ScrollTrigger);

// --- LENIS SCROLL ENGINE ---
const lenis = new Lenis({
  duration: 1.2,
  easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
  direction: "vertical",
  gestureDirection: "vertical",
  smooth: true,
  mouseMultiplier: 1,
  smoothTouch: true,
  touchMultiplier: 2,
});

// Sync Lenis with GSAP Ticker for performance
lenis.on('scroll', ScrollTrigger.update);

gsap.ticker.add((time) => {
  lenis.raf(time * 1000);
});

gsap.ticker.lagSmoothing(0);

// --- ANIMATION CONTROLLER (Orchestrator) ---
const AnimationController = {
  // Config
  reducedMotion: window.matchMedia("(prefers-reduced-motion: reduce)").matches,

  // Methods
  scrollToTop: function (immediate = false) {
    lenis.scrollTo(0, { immediate: immediate });
  },

  pageExit: function (element) {
    if (!element || this.reducedMotion) return Promise.resolve();

    return new Promise((resolve) => {
      const tl = gsap.timeline({
        onComplete: resolve,
        defaults: { ease: "power2.in", duration: 0.4 }
      });

      tl.to(element, {
        opacity: 0,
        scale: 0.98,
        filter: "blur(4px)",
        y: -20
      });
    });
  },

  pageEnter: function (element) {
    if (!element) return;

    // Reset state first
    gsap.set(element, {
      opacity: 0,
      scale: 1.02,
      filter: "blur(8px)",
      y: 20
    });

    if (this.reducedMotion) {
      gsap.to(element, { opacity: 1, scale: 1, filter: "none", y: 0, duration: 0.1 });
      return;
    }

    const tl = gsap.timeline({
      defaults: { ease: "power2.out", duration: 0.6 }
    });

    tl.to(element, {
      opacity: 1,
      scale: 1,
      filter: "blur(0px)",
      y: 0,
      clearProps: "scale,filter,transform" // clean up for interactions
    });
  },

  // Micro-Interaction: Scramble Text
  scrambleText: function (element) {
    if (this.reducedMotion || element.dataset.scrambleActive === "true") return;

    const originalText = element.dataset.originalText || element.innerText;
    if (!element.dataset.originalText) element.dataset.originalText = originalText;

    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890!@#$%^&*()_+-=[]{}|;:,.<>?";
    let iterations = 0;
    element.dataset.scrambleActive = "true";

    const interval = setInterval(() => {
      element.innerText = originalText
        .split("")
        .map((letter, index) => {
          if (index < iterations) return originalText[index];
          return chars[Math.floor(Math.random() * chars.length)];
        })
        .join("");

      if (iterations >= originalText.length) {
        clearInterval(interval);
        element.dataset.scrambleActive = "false";
        element.innerText = originalText; // Ensure final state is clean
      }

      iterations += 1 / 2; // Speed control
    }, 20);
  }
};

// --- AUDIO SYSTEM (Web Audio API) ---
const SoundManager = {
  ctx: null,
  isMuted: false,

  init: function () {
    // Create context immediately if not exists
    if (!this.ctx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      this.ctx = new AudioContext();
    }
    return this.ctx;
  },

  resume: function () {
    if (this.ctx && this.ctx.state === "suspended") {
      return this.ctx.resume();
    }
    return Promise.resolve();
  },

  toggleMute: function () {
    this.isMuted = !this.isMuted;
    this.updateUI();
    return this.isMuted;
  },

  updateUI: function () {
    const iconName = this.isMuted ? "volume-x" : "volume-2";
    const text = this.isMuted ? "Sound Off" : "Sound On";
    const colorClass = this.isMuted ? "text-red-500" : "text-gray-400";

    // Desktop
    const dIcon = document.getElementById("mute-icon-desktop");
    const dBtn = document.getElementById("mute-btn-desktop");
    if (dIcon) {
      dIcon.parentElement.innerHTML = `<span id="mute-text-desktop">${text}</span><i data-lucide="${iconName}" id="mute-icon-desktop" class="w-4 h-4"></i>`;
      lucide.createIcons();
    }
    if (dBtn)
      dBtn.className = `transition-colors flex items-center gap-2 uppercase font-hud text-xs tracking-widest ${colorClass} hover:text-white`;

    // Mobile
    const mBtn = document.getElementById("mute-btn-mobile");
    if (mBtn) {
      mBtn.innerHTML = `<i data-lucide="${iconName}" id="mute-icon-mobile" class="w-5 h-5 ${this.isMuted ? "text-red-500" : "text-white"
        }"></i>`;
      lucide.createIcons();
    }
  },

  playTone: function (freq, type, duration, vol = 0.1) {
    if (this.isMuted || !this.ctx) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = type;
    osc.frequency.setValueAtTime(freq, this.ctx.currentTime);

    gain.gain.setValueAtTime(vol, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(
      0.001,
      this.ctx.currentTime + duration
    );

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start();
    osc.stop(this.ctx.currentTime + duration);
  },

  playHover: function () {
    this.playTone(800, "sine", 0.05, 0.05);
  },

  playClick: function () {
    this.playTone(200, "square", 0.1, 0.05);
  },

  playScroll: function () {
    this.playTone(150, "sawtooth", 0.05, 0.03);
  },

  playMissionSuccess: function () {
    if (this.isMuted || !this.ctx) return;
    const now = this.ctx.currentTime;
    const notes = [261.63, 329.63, 392.0, 523.25]; // C Major Arpeggio

    notes.forEach((freq, i) => {
      // Optimized tone call
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = "sawtooth";
      osc.frequency.value = freq;
      gain.gain.setValueAtTime(0.1, now + i * 0.05);
      gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.05 + 1.5);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now + i * 0.05);
      osc.stop(now + i * 0.05 + 1.5);
    });
  },
};

// Define attachSounds function properly in global scope
function attachSounds() {
  const interactiveElements = document.querySelectorAll(
    "a, button, .wheel-slice, .mission-card, .app-icon, .cursor-pointer, .inventory-item"
  );
  interactiveElements.forEach((el) => {
    if (el.dataset.soundAttached) return;
    el.addEventListener("mouseenter", () => SoundManager.playHover());
    el.addEventListener("click", () => SoundManager.playClick());
    el.dataset.soundAttached = "true";
  });

  // Attach Scramble Effect to Nav Items
  document.querySelectorAll('.nav-desktop-item .nav-hud-content span').forEach(span => {
    span.parentElement.parentElement.addEventListener('mouseenter', () => {
      AnimationController.scrambleText(span);
    });
  });
}

// --- NAVIGATION LOGIC ---
const pages = document.querySelectorAll(".app-page");
const desktopNavItems = document.querySelectorAll(".nav-desktop-item");
const overlay = document.getElementById("transition-overlay");
const ifruitMenu = document.getElementById("ifruit-menu");
const loadingText = document.getElementById("loading-text");
const startPrompt = document.getElementById("start-prompt");
const loadingBar = document.getElementById("loading-bar");

// Global state to track if we have passed the initial load
window.hasStarted = false;

// GTA Story Mode Loading Phrases
const loadingPhrases = [
  "Loading Story Mode...",
  "entering north yankton...",
  "waiting for lester's call...",
  "escaping the vault...",
  "losing the cops...",
  "connecting to bawsaq...",
  "initializing social club...",
  "loading los santos...",
];

function handleRouting() {
  const hash = window.location.hash.substring(1) || "home";
  navigateTo(hash, false);
}

async function navigateTo(pageId, pushState = true) {
  const targetPage = document.getElementById(`page-${pageId}`);
  if (!targetPage) return;

  // Don't navigate if already there
  const currentPage = document.querySelector(".app-page.active");
  if (currentPage && currentPage.id === `page-${pageId}`) return;

  if (pushState) {
    history.pushState(null, null, `#${pageId}`);
  }

  ifruitMenu.classList.remove("open");

  // On subsequent navigations, use cinematic transitions
  if (window.hasStarted && currentPage) {
    // 1. Play Exit Animation
    await AnimationController.pageExit(currentPage);

    // 2. Switch DOM State
    performNavigation(targetPage, pageId);

    // 3. Play Enter Animation
    AnimationController.pageEnter(targetPage);
  } else {
    // Initial load setup
    performNavigation(targetPage, pageId);
    // Optional: Animate in on first load if we want to smooth the loading screen exit
    if (window.hasStarted) AnimationController.pageEnter(targetPage);
  }
}

function performNavigation(targetPage, pageId) {
  pages.forEach((page) => page.classList.remove("active"));
  desktopNavItems.forEach((item) => {
    item.classList.remove("active");
    if (item.getAttribute("data-page") === pageId) item.classList.add("active");
  });

  targetPage.classList.add("active");
  // Use Lenis for scrolling instead of window.scrollTo
  AnimationController.scrollToTop(true);

  if (pageId === "skills") initWeaponWheel();
  // refreshPageAnimations(pageId); // Deprecated in favor of AnimationController

  // We can kill old ScrollTriggers here to be safe
  const triggers = ScrollTrigger.getAll();
  triggers.forEach(t => t.kill());

  // Re-attach sounds
  setTimeout(attachSounds, 100);
}

function navigateToMobile(pageId) {
  toggleIfruit();
  setTimeout(() => {
    navigateTo(pageId);
  }, 300);
}

// iFruit Status Update Logic
function updatePhoneStatus() {
  const timeEl = document.getElementById("ifruit-time");
  const batteryTextEl = document.getElementById("ifruit-battery-text");
  const batteryFillEl = document.getElementById("ifruit-battery-fill");

  if (timeEl) {
    const now = new Date();
    timeEl.innerText = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }

  if (batteryTextEl && batteryFillEl) {
    // Generate random realistic percentage between 40% and 98%
    // Only generate once per session or just reuse
    if (!window.phoneBatteryLevel) {
      window.phoneBatteryLevel = Math.floor(Math.random() * (98 - 40 + 1) + 40);
    }

    batteryTextEl.innerText = `${window.phoneBatteryLevel}%`;
    batteryFillEl.style.width = `${window.phoneBatteryLevel}%`;

    // Color logic
    if (window.phoneBatteryLevel < 20) {
      batteryFillEl.classList.remove("bg-green-400", "bg-white");
      batteryFillEl.classList.add("bg-red-500");
    } else {
      batteryFillEl.classList.add("bg-green-400");
    }
  }
}

function toggleIfruit() {
  ifruitMenu.classList.toggle("open");
  if (ifruitMenu.classList.contains("open")) {
    updatePhoneStatus(); // Update every time we open
  }
  SoundManager.playClick();
}

function refreshPageAnimations(pageId) {
  ScrollTrigger.getAll().forEach((t) => t.kill());
  if (pageId === "home") {
    gsap.from(".hero-title", {
      duration: 1,
      y: 50,
      opacity: 0,
      ease: "power4.out",
      delay: 0.2,
    });
  } else if (pageId === "about") {
    gsap.from(".page-reveal-left", {
      x: -50,
      opacity: 0,
      duration: 0.8,
      ease: "power3.out",
      delay: 0.2,
    });
    gsap.from(".page-reveal-right", {
      x: 50,
      opacity: 0,
      duration: 0.8,
      ease: "power3.out",
      delay: 0.2,
    });
  }
}

window.addEventListener("popstate", handleRouting);

// Initial Load Logic - Loading screen removed
window.addEventListener("load", () => {
  // Force scroll to top on reload
  if ('scrollRestoration' in history) {
    history.scrollRestoration = 'manual';
  }
  // Force scroll to top on reload using Lenis
  if ('scrollRestoration' in history) {
    history.scrollRestoration = 'manual';
  }
  AnimationController.scrollToTop(true);

  // Navigate to the correct page based on hash
  const hash = window.location.hash.substring(1) || "home";
  const targetPage = document.getElementById(`page-${hash}`);
  if (targetPage) performNavigation(targetPage, hash);

  // Mark as started immediately (no loading screen)
  window.hasStarted = true;

  // Initialize audio on first user interaction (required by browsers)
  document.addEventListener("click", initAudioOnce, { once: true });

  // Attach sounds to interactive elements
  attachSounds();
});

function initAudioOnce() {
  SoundManager.init();
  SoundManager.resume();
}

// Keep startExperience for compatibility but it's no longer used
function startExperience() {
  if (window.hasStarted) return;
  window.hasStarted = true;
  SoundManager.init();
  SoundManager.resume();
}

document
  .getElementById("ifruit-trigger")
  .addEventListener("click", toggleIfruit);
document.getElementById("mute-btn-desktop").addEventListener("click", (e) => {
  e.stopPropagation();
  SoundManager.toggleMute();
});
document.getElementById("mute-btn-mobile").addEventListener("click", (e) => {
  e.stopPropagation();
  SoundManager.toggleMute();
});

desktopNavItems.forEach((link) => {
  link.addEventListener("click", (e) => {
    e.preventDefault();
    const target = link.getAttribute("data-page");
    navigateTo(target);
  });
});

// Mobile Nav Event Listeners
document.querySelectorAll('[data-mobile-target]').forEach(item => {
  item.addEventListener('click', (e) => {
    e.preventDefault(); // Good practice although div doesn't default
    const target = item.getAttribute('data-mobile-target');
    navigateToMobile(target);
  });
});

/* --- WEAPON WHEEL LOGIC (Devicon URLs) --- */
let wheelInitialized = false;
let currentWheelIndex = 0;
let isScrolling = false;

const skillsData = [
  {
    id: 1,
    category: "HTML5",
    icon: "https://upload.wikimedia.org/wikipedia/commons/3/38/HTML5_Badge.svg",
    skills: "Semantic Structure, Accessibility, SEO",
    stats: [100, 95, 100],
    attachments: ["Canvas API", "WebSockets", "Storage"],
    locked: false,
  },
  {
    id: 2,
    category: "CSS3",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/css3/css3-original.svg",
    skills: "Flexbox, Grid, Tailwind, Animations",
    stats: [100, 90, 100],
    attachments: ["SASS", "BEM", "PostCSS"],
    locked: false,
  },
  {
    id: 3,
    category: "JavaScript",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/javascript/javascript-original.svg",
    skills: "ES6+, Async/Await, DOM Manipulation",
    stats: [50, 45, 50],
    attachments: ["TypeScript", "Webpack", "Jest"],
    locked: false,
  },
  {
    id: 4,
    category: "React",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/react/react-original.svg",
    skills: "Requires Level 10",
    stats: [0, 0, 0],
    attachments: ["Locked"],
    locked: true,
  },
  {
    id: 5,
    category: "Node.js",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/nodejs/nodejs-original.svg",
    skills: "Requires Level 15",
    stats: [0, 0, 0],
    attachments: ["Locked"],
    locked: true,
  },
  {
    id: 6,
    category: "Express",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/express/express-original.svg",
    skills: "Requires Level 15",
    stats: [0, 0, 0],
    invert: true,
    attachments: ["Locked"],
    locked: true,
  },
  {
    id: 7,
    category: "MongoDB",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/mongodb/mongodb-original.svg",
    skills: "Requires Level 20",
    stats: [0, 0, 0],
    attachments: ["Locked"],
    locked: true,
  },
  {
    id: 8,
    category: "GSAP",
    icon: "https://cdn.worldvectorlogo.com/logos/gsap-greensock.svg",
    skills: "Requires Level 5",
    stats: [0, 0, 0],
    attachments: ["Locked"],
    locked: true,
  },
];

function initWeaponWheel() {
  if (wheelInitialized) return;
  wheelInitialized = true;

  // DESKTOP WHEEL RENDER
  const container = document.getElementById("wheel-container");
  const wheelSlicesContainer = document.getElementById("wheel-slices");
  const wheelIconsContainer = document.getElementById("wheel-icons");
  const centerX = 300;
  const centerY = 300;
  // Tuned Radius: 280px (Max safe) | 130px (Clear of center overlay)
  const outerRadius = 280;
  const innerRadius = 130;
  const gap = 0.04;

  const totalSlices = skillsData.length;
  const angleStep = (Math.PI * 2) / totalSlices;

  skillsData.forEach((skill, index) => {
    const startAngle = index * angleStep - Math.PI / 2 + gap;
    const endAngle = (index + 1) * angleStep - Math.PI / 2 - gap;

    const x1 = centerX + outerRadius * Math.cos(startAngle);
    const y1 = centerY + outerRadius * Math.sin(startAngle);
    const x2 = centerX + outerRadius * Math.cos(endAngle);
    const y2 = centerY + outerRadius * Math.sin(endAngle);
    const x3 = centerX + innerRadius * Math.cos(endAngle);
    const y3 = centerY + innerRadius * Math.sin(endAngle);
    const x4 = centerX + innerRadius * Math.cos(startAngle);
    const y4 = centerY + innerRadius * Math.sin(startAngle);

    const d = `M ${x1} ${y1} A ${outerRadius} ${outerRadius} 0 0 1 ${x2} ${y2} L ${x3} ${y3} A ${innerRadius} ${innerRadius} 0 0 0 ${x4} ${y4} Z`;

    const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
    path.setAttribute("d", d);
    // Add specific locked class
    const lockedClass = skill.locked ? "wheel-slice locked" : "wheel-slice";
    path.setAttribute("class", lockedClass);

    path.addEventListener("mouseenter", () => activateSlice(index));
    path.addEventListener("click", () => activateSlice(index));
    wheelSlicesContainer.appendChild(path);

    const midAngle = (startAngle + endAngle) / 2;
    const iconDist = (outerRadius + innerRadius) / 2;
    const iconX = centerX + iconDist * Math.cos(midAngle);
    const iconY = centerY + iconDist * Math.sin(midAngle);

    const iconGroup = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "g"
    );

    let imgStyle = skill.invert ? "filter: brightness(0) invert(1);" : "";

    // Extra logic for locked icons
    let iconClasses = "wheel-icon-group";
    if (skill.locked) {
      iconClasses += " locked";
      // Override invert for locked items to ensure they look gray
      if (skill.invert) imgStyle = "filter: grayscale(100%) brightness(0.5);";
    }

    iconGroup.setAttribute("class", iconClasses);

    // Lock Overlay Icon
    let overlayHTML = "";
    if (skill.locked) {
      overlayHTML = `<foreignObject x="${iconX - 12}" y="${iconY - 12
        }" width="24" height="24" class="lock-overlay"><div xmlns="http://www.w3.org/1999/xhtml"><i data-lucide="lock" style="color: #888;"></i></div></foreignObject>`;
    }

    iconGroup.innerHTML = `
                    <foreignObject x="${iconX - 20}" y="${iconY - 20
      }" width="40" height="40" class="wheel-icon">
                        <div xmlns="http://www.w3.org/1999/xhtml" class="flex items-center justify-center w-full h-full">
                            <img src="${skill.icon
      }" class="w-10 h-10 object-contain" style="${imgStyle}" alt="${skill.category
      }" />
                        </div>
                    </foreignObject>
                    ${overlayHTML}
                `;
    wheelIconsContainer.appendChild(iconGroup);
  });

  // Refresh icons for new lock SVGs
  lucide.createIcons();

  container.addEventListener(
    "wheel",
    (e) => {
      e.preventDefault();
      if (isScrolling) return;
      isScrolling = true;
      setTimeout(() => (isScrolling = false), 100);

      const direction = e.deltaY > 0 ? 1 : -1;
      let nextIndex = currentWheelIndex + direction;

      if (nextIndex >= skillsData.length) nextIndex = 0;
      if (nextIndex < 0) nextIndex = skillsData.length - 1;

      activateSlice(nextIndex);
      SoundManager.playScroll(); // Add Scroll Sound
    },
    { passive: false }
  );

  // Touch Support
  let touchStartY = 0;
  container.addEventListener(
    "touchstart",
    (e) => {
      touchStartY = e.touches[0].clientY;
    },
    { passive: false }
  );

  container.addEventListener(
    "touchmove",
    (e) => {
      e.preventDefault(); // Prevent page scroll while using wheel
      if (isScrolling) return;

      const touchEndY = e.touches[0].clientY;
      const diff = touchStartY - touchEndY;

      if (Math.abs(diff) > 30) {
        // Threshold for swipe
        isScrolling = true;
        setTimeout(() => (isScrolling = false), 150);

        const direction = diff > 0 ? 1 : -1;
        let nextIndex = currentWheelIndex + direction;

        if (nextIndex >= skillsData.length) nextIndex = 0;
        if (nextIndex < 0) nextIndex = skillsData.length - 1;

        activateSlice(nextIndex);
        SoundManager.playScroll();
        touchStartY = touchEndY; // Reset for continuous scrolling
      }
    },
    { passive: false }
  );

  activateSlice(0);

  // MOBILE INVENTORY RENDER
  const mobileGrid = document.getElementById("mobile-inventory-grid");
  skillsData.forEach((skill) => {
    let imgStyle = skill.invert ? "filter: brightness(0) invert(1);" : "";
    let itemClass = "inventory-item";
    let lockIcon = "";

    if (skill.locked) {
      itemClass += " locked";
      if (skill.invert) imgStyle = "filter: grayscale(100%) brightness(0.5);";
      lockIcon = `<div class="absolute top-2 right-2 text-gray-500"><i data-lucide="lock" class="w-4 h-4"></i></div>`;
    }

    const itemHTML = `
                    <div class="${itemClass}" onclick="SoundManager.playClick()">
                        ${lockIcon}
                        <img src="${skill.icon}" class="w-16 h-16 object-contain mb-4" style="${imgStyle}" alt="${skill.category}">
                        <div class="item-stats">
                            <h4 class="text-white font-display text-sm uppercase text-center">${skill.category}</h4>
                            <div class="w-full bg-gray-700 h-1 mt-1">
                                <div class="bg-gta-magenta h-full" style="width: ${skill.stats[0]}%"></div>
                            </div>
                        </div>
                    </div>
                `;
    mobileGrid.innerHTML += itemHTML;
  });
  lucide.createIcons();

  // Attach sounds to new elements
  attachSounds();
}

function activateSlice(index) {
  // Calculate shortest path for rotation to avoid spinning wildy
  // We want the active slice to be at -90deg (top) or specific angle?
  // Current implementation doesn't rotate the wheel container, it just highlights slices.
  // Let's ADD container rotation for that "physical" feel.

  const container = document.getElementById("wheel-slices");
  const iconsContainer = document.getElementById("wheel-icons");

  if (container && iconsContainer) {
    const anglePerSlice = 360 / skillsData.length;
    // We want the selected index to be at the top (270deg or -90deg)
    // By default index 0 is at -90deg based on draw logic.
    // So if we rotate by -index * anglePerSlice, we keep it static?
    // Actually, GTA V wheel behaves differently (cursor moves, wheel stays).
    // BUT the user wants "Movement".
    // Let's do a subtle "Kick" rotation on change to feel the weight.

    // Shake removed based on user feedback
  }

  currentWheelIndex = index;
  document.querySelectorAll(".wheel-slice").forEach((slice, i) => {
    if (i === index) {
      slice.classList.add("active");
      // Scale animation removed - was causing overflow
    } else {
      slice.classList.remove("active");
    }
  });

  const data = skillsData[index];
  document.getElementById("skill-category").textContent = data.category;
  const countNum = index + 1;
  const totalNum = skillsData.length;
  document.getElementById("skill-count").textContent = `${countNum < 10 ? "0" + countNum : countNum
    } / ${totalNum < 10 ? "0" + totalNum : totalNum}`;

  document.getElementById("stat-bar-1").style.width = data.stats[0] + "%";
  document.getElementById("stat-bar-2").style.width = data.stats[1] + "%";
  document.getElementById("stat-bar-3").style.width = data.stats[2] + "%";

  const attachContainer = document.getElementById("skill-attachments");
  attachContainer.innerHTML = "";
  if (data.attachments) {
    data.attachments.forEach((tag) => {
      const span = document.createElement("span");
      span.className = "attachment-tag font-hud";
      span.innerText = tag;
      attachContainer.appendChild(span);
    });
  }

  // Mobile Details Update
  const mobileCategory = document.getElementById("mobile-skill-category");
  if (mobileCategory) {
    mobileCategory.textContent = data.category;
    document.getElementById("mobile-skill-count").textContent = `${countNum < 10 ? "0" + countNum : countNum
      } / ${totalNum < 10 ? "0" + totalNum : totalNum}`;
    document.getElementById("mobile-stat-bar-1").style.width =
      data.stats[0] + "%";
    document.getElementById("mobile-stat-bar-2").style.width =
      data.stats[1] + "%";
    document.getElementById("mobile-stat-bar-3").style.width =
      data.stats[2] + "%";

    const mobileAttachContainer = document.getElementById(
      "mobile-skill-attachments"
    );
    mobileAttachContainer.innerHTML = "";
    if (data.attachments) {
      data.attachments.forEach((tag) => {
        const span = document.createElement("span");
        span.className = "attachment-tag font-hud";
        span.innerText = tag;
        mobileAttachContainer.appendChild(span);
      });
    }
  }
}

// --- MISSION PASSED LOGIC ---
const contactForm = document.getElementById("contact-form");
const missionPassedOverlay = document.getElementById("mission-passed");

if (contactForm) {
  contactForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const btn = contactForm.querySelector('button[type="submit"]');
    const originalText = btn.innerHTML;
    btn.innerHTML = `<span class="animate-pulse">TRANSMITTING...</span>`;
    btn.disabled = true;

    // COMPATIBILITY PATCH: Ensure both 'email' and 'from_email' are sent
    // This fixes the "empty recipient" error regardless of dashboard config
    const emailInput = contactForm.querySelector('[name="from_email"]');
    let hiddenEmail = contactForm.querySelector('[name="email"]');
    if (!hiddenEmail && emailInput) {
      hiddenEmail = document.createElement('input');
      hiddenEmail.type = 'hidden';
      hiddenEmail.name = 'email';
      contactForm.appendChild(hiddenEmail);
    }
    if (hiddenEmail && emailInput) hiddenEmail.value = emailInput.value;

    // OPTIMISTIC UI: Trigger success after 1.5s "fake uplink" time
    // This makes it feel arcade-fast while the actual email sends in background
    const UPLINK_TIME = 1500;

    // 1. Start the visual timer
    const visualPromise = new Promise(resolve => setTimeout(resolve, UPLINK_TIME));

    // 2. Start the actual network request (Fire & Forget style)
    const emailPromise = emailjs.sendForm('service_p4u5fvw', 'template_p4ov2n5', contactForm)
      .then(() => {
        // Background: Send Auto-Reply
        return emailjs.sendForm('service_p4u5fvw', 'template_1c58azf', contactForm);
      })
      .catch(err => {
        // Silent background error log (don't break the game immersion unless critical)
        console.warn('Background transmission issue:', err);
      });

    // 3. Update UI when visual timer ends (User feels instant gratification)
    visualPromise.then(() => {
      SoundManager.playMissionSuccess();
      missionPassedOverlay.classList.add("visible");
      contactForm.reset();

      btn.innerHTML = originalText;
      btn.disabled = false;

      setTimeout(() => {
        missionPassedOverlay.classList.remove("visible");
      }, 4000);
    });
  });
}

// --- LOGO ANIMATION LOGIC ---
const logoElements = [
  document.getElementById("navbar-logo-text"),
  document.getElementById("mobile-logo-text")
].filter(el => el !== null);

if (logoElements.length > 0) {
  console.log("Logo animation initialized for", logoElements.length, "elements");
  const logoClasses = [
    "logo-style-1",
    "logo-style-2",
    "logo-style-3",
    "logo-style-4",
    "logo-style-5",
  ];

  setInterval(() => {
    // Fade out
    logoElements.forEach(el => el.style.opacity = '0');

    setTimeout(() => {
      // Get random class index
      const randomIndex = Math.floor(Math.random() * logoClasses.length);
      const newClass = logoClasses[randomIndex];

      // Apply to all logo elements
      logoElements.forEach(logoText => {
        // Remove all existing style classes
        logoText.classList.remove(...logoClasses);
        // Add new class
        logoText.classList.add(newClass);
        // Fade in
        logoText.style.opacity = '1';
      });
    }, 300); // Wait for fade out (matches CSS transition duration)
  }, 4000); // Change every 4 seconds
} else {
  console.error("No logo elements found!");
}

/* =========================================
   RAP SHEET LOGIC
   ========================================= */
const rapSheetOverlay = document.getElementById("rap-sheet-overlay");
const rapSheetLoading = document.getElementById("rap-sheet-loading");

function openRapSheet() {
  if (rapSheetOverlay) {
    rapSheetOverlay.classList.remove("hidden");
    // Stop Lenis to allow native scroll in overlay
    lenis.stop();
    document.body.style.overflow = 'hidden'; // Ensure body doesn't scroll

    // Show loading state first
    if (rapSheetLoading) {
      rapSheetLoading.classList.remove("hidden");
    }

    // Small delay to allow display:flex to apply before opacity transition
    setTimeout(() => {
      rapSheetOverlay.classList.add("visible");
      SoundManager.playClick();

      // Simulate database search
      setTimeout(() => {
        if (rapSheetLoading) {
          rapSheetLoading.classList.add("hidden");
          SoundManager.playTone(1000, "sine", 0.1); // Success beep
        }
      }, 1500);

    }, 10);
  }
}

function closeRapSheet() {
  if (rapSheetOverlay) {
    rapSheetOverlay.classList.remove("visible");
    SoundManager.playClick();
    setTimeout(() => {
      rapSheetOverlay.classList.add("hidden");
      // Resume Lenis
      lenis.start();
      document.body.style.overflow = '';
    }, 300);
  }
}

// Close on Escape key
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && rapSheetOverlay && rapSheetOverlay.classList.contains("visible")) {
    closeRapSheet();
  }
});

// Close on clicking outside container
if (rapSheetOverlay) {
  rapSheetOverlay.addEventListener("click", (e) => {
    if (e.target === rapSheetOverlay) {
      closeRapSheet();
    }
  });
}

/* =========================================
   MOBILE HINT LOGIC
   ========================================= */
const mobileHint = document.getElementById("gta-mobile-hint");
const phoneBadge = document.getElementById("phone-notification-badge");

function showMobileHint() {
  // Only show on mobile
  if (window.innerWidth >= 768) return;

  // Check if we've already shown it this session (optional, but good for UX)
  if (sessionStorage.getItem("mobileHintShown")) return;

  setTimeout(() => {
    if (mobileHint && phoneBadge) {
      mobileHint.classList.remove("hidden");
      // Small delay to allow display:block to apply
      setTimeout(() => mobileHint.classList.add("visible"), 10);

      phoneBadge.classList.remove("hidden");

      // Play a subtle notification sound
      // 2 beeps like a pager/phone message
      if (SoundManager && !SoundManager.isMuted) {
        if (SoundManager.ctx && SoundManager.ctx.state === 'running') {
          const now = SoundManager.ctx.currentTime;
          SoundManager.playTone(800, "sine", 0.1, 0.05);
          setTimeout(() => SoundManager.playTone(800, "sine", 0.1, 0.05), 150);
        }
      }
    }
  }, 3000); // Show 3 seconds after load
}

// Hook into existing toggleIfruit to clear hints
// We can just add an event listener to the trigger since we already have one
const phoneTrigger = document.getElementById("ifruit-trigger");
if (phoneTrigger) {
  phoneTrigger.addEventListener("click", () => {
    if (mobileHint) {
      mobileHint.classList.remove("visible");
      setTimeout(() => mobileHint.classList.add("hidden"), 300);
    }
    if (phoneBadge) {
      phoneBadge.classList.add("hidden");
    }
    // Set flag
    sessionStorage.setItem("mobileHintShown", "true");
  });
}

// Initialize Mobile Hint
window.addEventListener("load", showMobileHint);
