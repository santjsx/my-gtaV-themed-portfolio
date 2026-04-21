# Santhosh Reddy — Digital Archive 2.0

A high-performance, cinematic developer portfolio built with **Neo-Minimalist** aesthetics, butter-smooth motion, and real-time Discord reactivity. 

Designed for **Zero Lag** and **Maximum Intent**.

---

## 📽️ The Cinematic Experience
- **Fluid Motion**: Powered by **GSAP** and **Lenis** for an effortless, weighted scroll experience.
- **Typographic Precision**: A rigorous focus on editorial layout, high-end indices, and technical dossiers.
- **Zero Asset Latency**: The "Media Log" uses embedded vector architecture (SVGs) for instantaneous loads without network lag.

## 📡 Live Logic (Lanyard Integration)
The site’s soul is connected to Discord. You can update your brand identity in real-time via **Lanyard KV** commands (`.set <key> <value>`):

| Command Key | Action | Visual Result |
| :--- | :--- | :--- |
| `mood` | `.set mood <text>` | Updates the "Mood Island" status text. |
| `hero_quote` | `.set hero_quote <text>` | Swaps the cinematic quote in the Hero section. |
| `accent_color` | `.set accent_color <hex>` | Shifts the global accent color across the entire site. |
| `about_photo_url` | `.set about_photo_url <url>` | Live-swaps your portrait (with automatic failsafe). |
| `skills` | `.set skills Name:Level` | Additive "Arsenal" system. Appends new credits instantly. |

## 📼 Featured Systems
### **The Media Log**
A standalone, high-density **Vector Grid** that archives your listening history (Spotify) and cinema logs (Letterboxd). 
- **Typographic focus**: Scrapped heavy images for instant performance.
- **Real-time**: Leverages Last.fm and Deezer APIs for metadata depth.

### **Intelligent Nav**
Precision **ScrollSpy** across the main index. The cinematic red underline follows your focus, whether you are scrolling through projects or exploring standalone media logs.

## 🛠️ Tech Stack
- **Architecture**: Vanilla HTML5, Modern CSS (Custom Design System), JavaScript (ES6+).
- **Engine**: **Vite** for optimized assets and multi-page builds.
- **APIs**: Lanyard (Presence/KV), Last.fm (Music), Deezer (Metadata).
- **Animation**: GSAP (GreenSock), ScrollTrigger, Lenis.

## 🚀 Setup & Deployment
```bash
# Clone the repository
git clone https://github.com/santjsx/my-portfolio.git

# Install dependencies
npm install

# Start local server
npm run dev

# Build for production
npm run build
```

---
*Architected with precision by [Santhosh Reddy](https://github.com/santjsx).*
