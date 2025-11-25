📁 CLASSIFIED DOSSIER: SANTHOSH REDDY // [THE ROOKIE]

[00] PROJECT OVERVIEW: GRAND THEFT PORTFOLIO (GTA-P)

This is the personal portfolio of Santhosh Reddy, a highly motivated MERN Stack Recruit. The design is engineered to replicate the Grand Theft Auto V HUD and Pause Menu interface, employing a sleek, neon-drenched, and highly interactive Single Page Application (SPA) structure.

OBJECTIVE: Secure a high-value development position by presenting skills and experience as a series of Heists, Loadouts, and Mission Logs.

[01] THE LOADOUT (TECH STACK)

Component

Technology

Rationale

Frontend

HTML5, Tailwind CSS, Vanilla JS, GSAP, Lucide/Remix Icons

Used to build a pixel-perfect, highly responsive, and dynamically animated UI. Tailwind ensures rapid, utility-first styling.

Animation

GSAP (GreenSock)

Powers all complex interactions, magnetic hovers, page transitions, and the Weapon Wheel rotation for maximum smoothness.

Architecture

Single Page Application (SPA) with URL Hashing

Provides a multi-page feel without complicated routing libraries, perfect for a fast, self-contained single file.

Audio

Web Audio API (Vanilla JS)

Synthesizes all UI sound effects (click, hover, startup) directly within the file, bypassing browser autoplay restrictions via user interaction.

[02] CORE SYSTEMS: BREAKDOWN

A. 🛡️ NAVIGATION (PAUSE MENU / iFRUIT)

Desktop: Utilizes a fixed, stylized header mirroring the GTA V Pause Menu tabs (Brief, Stats, Loadout, Heists, Contact).

Mobile: Deploys a full-screen, bottom-up iFruit Phone overlay, with navigation links styled as App Icons for a touch-friendly experience.

B. 🔫 SKILLS (TECH LOADOUT WHEEL)

Aesthetic: Designed as the iconic GTA V Weapon Wheel.

Interaction: Users can cycle through skills (weapons) via mouse scroll or hover.

Status Indicators:

Unlocked (HTML/CSS): Full stats, active neon-cyan glow.

In Progress (JavaScript): Partial stats displayed.

Locked (React, Node, Mongo, etc.): Grayed out with a Lock Icon, representing skills the Recruit has yet to acquire (learn/master).

C. 📋 PROJECTS (HEIST PLANNING BOARD)

Projects are reframed as Training Sims (for a fresher) on a tactical Planning Board. Each card features:

Mission Status (PASSED, ONGOING).

Estimated Payout ($ 500).

Required Tech Stack icons.

D. 📞 CONTACT (COMMS UPLINK)

The contact form is styled as a secure Comms Uplink Terminal, triggering a "MISSION PASSED" cinematic overlay upon submission.

[03] OPERATION MANUAL (USAGE)

The entire application is contained within a single index.html file, making deployment instant.

Deployment: Upload index.html to any web server (GitHub Pages, Netlify, Vercel).

Startup: On launch, the system presents a cinematic "ENTER SYSTEM" screen. Click the screen to initialize the Audio Context and begin the experience.

Audio Control: Use the floating Mute/Unmute button in the bottom-right corner to control sound effects globally.

[04] KNOWN ISSUES (BUGS & POLISH)

Status

Issue

Description

✅

Autoplay Block

Fixed via the "Click to Start" screen, ensuring audio initializes instantly upon user interaction.

✅

Express Logo

Fixed visibility issue on dark background by forcing white color filter.

🟡

Mugshot

Placeholder image used in the "FIB Dossier." Needs replacement with the actual subject's image for final deployment.

🟡

Links

All external links (GitHub, LinkedIn, X) currently point to #. Must be updated for deployment.

[05] CREW & CREDITS

Recruit: Santhosh Reddy (The Rookie)
Base Assets: Lucide Icons, Remix Icons, Devicon CDN
Animation Engine: GSAP (GreenSock)

END OF TRANSMISSION.
