<div align="center">

# 📁 CLASSIFIED DOSSIER: SANTHOSH REDDY // THE ROOKIE

## 🕶️ GRAND THEFT PORTFOLIO (GTA-P)

![Status](https://img.shields.io/badge/status-ACTIVE-00ff00.svg)
![Mission](https://img.shields.io/badge/mission-PASSED-gold.svg)
![Threat Level](https://img.shields.io/badge/threat%20level-HIGH-red.svg)

*A GTA V–themed personal portfolio engineered as a neon-drenched, HUD-inspired Single Page Application*

**OBJECTIVE**: Present skills, projects, and identity as Heists, Loadouts, and Mission Logs to secure a high-value developer role.

[The Loadout](#-01--the-loadout-tech-stack) • [Core Systems](#-02--core-systems) • [Operation Manual](#%EF%B8%8F-03--operation-manual-usage) • [Known Issues](#-04--known-issues-bugs--polish) • [Crew Credits](#-05--crew--credits)

---

</div>

## 🧰 01 — THE LOADOUT (TECH STACK)

| Component | Technology | Purpose |
|-----------|-----------|---------|
| **Frontend** | HTML5, Tailwind CSS, Vanilla JS, GSAP, Lucide/Remix Icons | Pixel-perfect responsive UI with fast, utility-first styling and rich animations |
| **Animation** | GSAP | Drives magnetic hovers, cinematic transitions, and the GTA Weapon Wheel mechanics |
| **Architecture** | Single Page Application (SPA) w/ URL Hashing | Multi-page feel without routing libraries. Fully self-contained |
| **Audio** | Web Audio API | Synthesizes UI SFX (hover, click, startup). Bypasses autoplay restrictions via user interaction |

### Technology Breakdown

```javascript
const loadout = {
  core: ['HTML5', 'CSS3', 'JavaScript ES6+'],
  framework: ['Tailwind CSS v3.x'],
  animation: ['GSAP (GreenSock)'],
  icons: ['Lucide Icons', 'Remix Icons', 'Devicon'],
  architecture: 'SPA with hash routing',
  audio: 'Web Audio API',
  deployment: ['GitHub Pages', 'Netlify', 'Vercel']
};
```

---

## 🧩 02 — CORE SYSTEMS

### 🛡️ A. Navigation (Pause Menu / iFruit)

#### Desktop Experience
GTA V Pause Menu–style header with seamless transitions:
- **Brief** — Mission briefing / About section
- **Stats** — Performance metrics / Experience
- **Loadout** — Tech stack / Skills inventory
- **Heists** — Project showcase
- **Contact** — Secure communications terminal

#### Mobile Experience
**iFruit Phone UI** — Full-screen bottom-up overlay with app-style navigation icons, optimized for thumb-zone interaction.

```css
/* Adaptive Navigation */
@media (min-width: 768px) { /* Desktop: Header Nav */ }
@media (max-width: 767px) { /* Mobile: iFruit Overlay */ }
```

---

### 🔫 B. Skills (Tech Loadout Wheel)

A stylized **GTA Weapon Wheel** mapping core skills as selectable "weapons."

#### Skill Status System

| Status | Visual | Description |
|--------|--------|-------------|
| 🟢 **Unlocked** | Full stats + neon cyan glow | HTML, CSS, JavaScript — Battle-tested |
| 🟡 **In Progress** | Partial stats + amber glow | React, Node.js — Active training |
| 🔒 **Locked** | Grayed out + lock icon | MongoDB, AWS — Queued for unlock |

#### Interaction Model
- **Scroll** or **hover** to cycle between skills
- **Click** to view detailed proficiency breakdown
- **Magnetic hover effects** powered by GSAP

```javascript
// Skill Proficiency Tiers
const skills = {
  expert: ['HTML5', 'CSS3', 'JavaScript'],
  advanced: ['Tailwind', 'GSAP', 'Git'],
  intermediate: ['React', 'Node.js', 'Python'],
  learning: ['MongoDB', 'Express', 'AWS']
};
```

---

### 📋 C. Projects (Heist Planning Board)

Projects displayed as **tactical Heist Plans** pinned on a planning board:

#### Heist Card Structure
```
┌─────────────────────────────────────┐
│ 🎯 MISSION: The Hustle Planner      │
│ ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ │
│ STATUS: ✅ PASSED                   │
│ EST. PAYOUT: $500                   │
│ TECH: [JS] [CSS] [HTML]             │
│                                     │
│ Training-sim themed task manager    │
│ with GTA V Social Club aesthetics   │
└─────────────────────────────────────┘
```

#### Features
- **Mission Status**: `PASSED` / `ONGOING` / `FAILED`
- **Est. Payout**: Difficulty rating system ($100 - $1000)
- **Tech Stack Icons**: Visual loadout display
- **Training-sim Descriptions**: Immersive project narratives
- **Live Links**: GitHub repos + deployed demos

---

### 📞 D. Contact (Comms Uplink)

A secure **communication terminal** with military-grade UI feedback:

#### Form Features
- Real-time field validation with neon indicators
- Animated submission sequence
- **"MISSION PASSED"** cinematic overlay on success
- Integrated audio/visual feedback
- Email integration via backend service

```javascript
// Contact Form Flow
User Input → Validation → Submission Animation → 
→ "MISSION PASSED" Overlay → Audio Feedback → Reset
```

---

## 🕹️ 03 — OPERATION MANUAL (USAGE)

### Quick Start

Everything runs from **one file**: `index.html`

```bash
# Clone the repository
git clone https://github.com/yourusername/grand-theft-portfolio.git

# Navigate to directory
cd grand-theft-portfolio

# Open in browser
open index.html
```

### Deployment Options

Deploy instantly on:
- **GitHub Pages**: Push to `gh-pages` branch
- **Netlify**: Drag & drop deployment
- **Vercel**: One-click deployment

### Startup Sequence

1. User lands on splash screen with **"ENTER SYSTEM"** CTA
2. Click activates `AudioContext` (bypasses autoplay restrictions)
3. Portfolio loads with full HUD experience
4. Audio system initialized with UI sound effects

### Audio Control

- **Floating mute/unmute button** (bottom-right corner)
- Persistent across navigation
- Saves preference to `localStorage`

```javascript
// Audio State Management
const audioControl = {
  muted: localStorage.getItem('audio_muted') === 'true',
  toggle: () => { /* Mute/unmute logic */ }
};
```

---

## 🐞 04 — KNOWN ISSUES (BUGS & POLISH)

| Status | Issue | Notes |
|--------|-------|-------|
| ✅ | **Autoplay Block** | Resolved using "Click to Start" screen |
| ✅ | **Express Logo** | Forced white filter to fix visibility on dark UI |
| 🟡 | **Mugshot** | Placeholder used in FIB Dossier — replace with final image |
| 🟡 | **External Links** | GitHub/LinkedIn/X currently set to `#` — update before deployment |
| 🟢 | **Mobile Responsiveness** | iFruit UI fully tested on iOS/Android |
| 🟢 | **Cross-browser Support** | Tested on Chrome, Firefox, Safari, Edge |

### Priority Fixes

```javascript
// TODO: Before Production Deployment
const preLaunchChecklist = [
  'Replace placeholder mugshot with professional photo',
  'Update social links (GitHub, LinkedIn, X)',
  'Compress audio assets for faster load',
  'Add meta tags for SEO',
  'Test form submission endpoint'
];
```

---

## 👥 05 — CREW & CREDITS

### 🎯 Recruit
**Santhosh Reddy** — *The Rookie*  
Role: Full-Stack Developer | Mission Specialist  
Clearance Level: 🔴 HIGH

### 🛠️ Arsenal
- **Icons**: [Lucide Icons](https://lucide.dev), [Remix Icons](https://remixicon.com), [Devicon](https://devicon.dev)
- **Animation Engine**: [GSAP (GreenSock)](https://greensock.com/gsap/)
- **Styling Framework**: [Tailwind CSS](https://tailwindcss.com)
- **Inspiration**: Rockstar Games — *Grand Theft Auto V*

### 🏆 Special Thanks
- **GSAP Team** for the industry-leading animation library
- **Rockstar Games** for the iconic GTA V UI/UX design language
- **Open Source Community** for invaluable icon libraries

---

## 📄 License

This project is licensed under the MIT License — see the [LICENSE](LICENSE) file for details.

---

## ⚠️ Legal Disclaimer

This portfolio is a **fan tribute** and is not affiliated with, endorsed by, or sponsored by Rockstar Games or Take-Two Interactive. Grand Theft Auto and GTA are registered trademarks of Take-Two Interactive Software, Inc. All other trademarks are the property of their respective owners.

---

<div align="center">

### 🎮 END OF TRANSMISSION

**Mission Status**: ✅ ACTIVE  
**Next Objective**: Secure Developer Role  
**Reward**: $$$$ + XP

---

*Built with 🎯 precision and 🔥 ambition*

**[⬆ RETURN TO TOP](#-classified-dossier-santhosh-reddy--the-rookie)**

</div>
