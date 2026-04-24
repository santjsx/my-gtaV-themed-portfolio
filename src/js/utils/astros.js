/**
 * ORBIT WATCH — Humans in Space Tracker
 * Integrates real-time orbital data with a high-end editorial aesthetic.
 */

const ASTROS_API = 'https://corquaid.github.io/international-space-station-APIs/JSON/people-in-space.json';
const CACHE_KEY = 'humans_in_space_v1';
const CACHE_TTL = 60 * 60 * 1000; // 1 hour (Data doesn't change often)

export async function initAstrosWidget() {
    const container = document.getElementById('astros-count');
    if (!container) return;

    try {
        // 1. Try Cache
        let data = getCache();

        if (!data) {
            const res = await fetch(ASTROS_API);
            if (!res.ok) throw new Error('Orbital uplink failed');
            data = await res.json();
            setCache(data);
        }

        const count = data.number || data.people?.length || 0;
        
        // 2. Render with transition
        container.style.opacity = '0';
        setTimeout(() => {
            container.innerHTML = `
                <div class="astros-badge" title="There are currently ${count} people in orbit.">
                    <span class="astros-icon"></span>
                    ${count} PEOPLE
                </div>
            `;
            container.style.opacity = '1';
        }, 300);

    } catch (err) {
        console.error('Space Uplink Error:', err);
        container.innerHTML = '<span class="meta-label">OFFLINE</span>';
    }
}

function getCache() {
    const cached = sessionStorage.getItem(CACHE_KEY);
    if (!cached) return null;
    const { data, timestamp } = JSON.parse(cached);
    return (Date.now() - timestamp > CACHE_TTL) ? null : data;
}

function setCache(data) {
    sessionStorage.setItem(CACHE_KEY, JSON.stringify({ data, timestamp: Date.now() }));
}
