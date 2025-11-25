📁 CLASSIFIED DOSSIER: SANTHOSH REDDY // THE ROOKIE
🕶️ GRAND THEFT PORTFOLIO (GTA-P)

A GTA V–themed personal portfolio engineered as a neon-drenched, HUD-inspired Single Page Application (SPA).
The objective: present skills, projects, and identity as Heists, Loadouts, and Mission Logs to secure a high-value developer role.

🧰 01 — THE LOADOUT (TECH STACK)
Component	Technology	Purpose
Frontend	HTML5, Tailwind CSS, Vanilla JS, GSAP, Lucide/Remix Icons	Pixel-perfect responsive UI with fast, utility-first styling and rich animations.
Animation	GSAP	Drives magnetic hovers, cinematic transitions, and the GTA Weapon Wheel mechanics.
Architecture	Single Page Application (SPA) w/ URL Hashing	Multi-page feel without routing libraries. Fully self-contained.
Audio	Web Audio API	Synthesizes UI SFX (hover, click, startup). Bypasses autoplay restrictions via user interaction.
🧩 02 — CORE SYSTEMS
🛡️ A. Navigation (Pause Menu / iFruit)

Desktop: GTA V Pause Menu–style header (Brief, Stats, Loadout, Heists, Contact).
Mobile: iFruit Phone UI — full-screen bottom-up overlay with app-style navigation icons.

🔫 B. Skills (Tech Loadout Wheel)

A stylized GTA Weapon Wheel mapping core skills as selectable “weapons.”

Unlocked (HTML/CSS): Full stats + neon cyan glow

In Progress (JS): Partial stats

Locked (React/Node/Mongo/etc.): Grayed + lock icon

Interaction: scroll or hover to cycle between skills.

📋 C. Projects (Heist Planning Board)

Projects displayed as tactical Heist Plans pinned on a planning board:

Mission Status (PASSED / ONGOING)

Est. Payout: $500

Tech stack icons

Training-sim themed descriptions

📞 D. Contact (Comms Uplink)

A secure communication terminal with:

Form submission animation

"MISSION PASSED" cinematic overlay

Integrated audio/visual feedback

🕹️ 03 — OPERATION MANUAL (USAGE)

Everything runs from one file: index.html

Deploy on:

GitHub Pages

Netlify

Vercel

Startup sequence:

User clicks the “ENTER SYSTEM” splash screen → initializes AudioContext

Portfolio loads with full HUD experience

Audio Control:

Floating mute/unmute button (bottom-right)

🐞 04 — KNOWN ISSUES (BUGS & POLISH)
Status	Issue	Notes
✅	Autoplay Block	Resolved using “Click to Start” screen.
✅	Express Logo	Forced white filter to fix visibility on dark UI.
🟡	Mugshot	Placeholder used in FIB Dossier — replace with final image.
🟡	External Links	GitHub/LinkedIn/X currently set to # — update before deployment.
👥 05 — CREW & CREDITS

Recruit: Santhosh Reddy (The Rookie)

Icons: Lucide Icons, Remix Icons, Devicon

Animation Engine: GSAP (GreenSock)

END OF TRANSMISSION.
