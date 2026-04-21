/**
 * THE LISTENING LOG — Typographic Media Index
 * A high-speed, purely typographic log of music rotations and cinema pulses.
 */

const LASTFM_API_KEY = 'a403d71a4af1bacfddab789750be1c18';
const LASTFM_USER = 'santhoshh25';
const FETCH_LIMIT = 30;

/**
 * Initializes the media log.
 */
export function initMusicHistory() {
    const listContainer = document.getElementById('track-list');
    if (!listContainer) return;

    fetchMediaLog();
    // Refresh every 2 minutes
    setInterval(fetchMediaLog, 120000);
}

/**
 * Orchestrates fetching from multiple media sources.
 */
async function fetchMediaLog() {
    try {
        const tracks = await fetchRecentTracks();
        // Place for movies fetch: const movies = await fetchRecentMovies();
        
        renderMediaLog(tracks);
    } catch (error) {
        console.error('Media log sync failed:', error);
        const container = document.getElementById('track-list');
        if (container) {
            container.innerHTML = '<div class="frequency-error">SYNC INTERRUPTED. RETRYING...</div>';
        }
    }
}

/**
 * Fetches recent music from Last.fm.
 */
async function fetchRecentTracks() {
    const url = `https://ws.audioscrobbler.com/2.0/?method=user.getrecenttracks&user=${LASTFM_USER}&api_key=${LASTFM_API_KEY}&format=json&limit=${FETCH_LIMIT}`;
    const response = await fetch(url);
    const data = await response.json();
    return data.recenttracks.track;
}

/**
 * Renders the unified media log into a typographic index.
 */
function renderMediaLog(tracks) {
    const listContainer = document.getElementById('track-list');
    
    let htmlContent = `
        <div class="log-header-row" aria-hidden="true">
            <div class="col-date">Date / Status</div>
            <div class="col-type">Media</div>
            <div class="col-title">Title</div>
            <div class="col-creator">Creator</div>
            <div class="col-collection">Collection</div>
        </div>
        <div class="log-body">
    `;

    tracks.forEach((track) => {
        const name = track.name;
        const artist = track.artist['#text'];
        const album = track.album?.['#text'] || 'Single';
        const isNowPlaying = track['@attr'] && track['@attr'].nowplaying === 'true';
        const dateText = isNowPlaying ? 'LIVE' : formatDate(track.date ? track.date['#text'] : null);
        
        htmlContent += `
            <div class="log-item ${isNowPlaying ? 'is-live' : ''}">
                <div class="col-date">${dateText}</div>
                <div class="col-type">SONIC / MUSIC</div>
                <div class="col-title">${escapeHTML(name)}</div>
                <div class="col-creator">by ${escapeHTML(artist)}</div>
                <div class="col-collection">${escapeHTML(album)}</div>
            </div>
        `;
    });

    htmlContent += '</div>';

    // Only update if content payload changed
    const currentHash = btoa(unescape(encodeURIComponent(htmlContent))).slice(0, 32);
    if (listContainer.dataset.lastHash === currentHash) return;
    listContainer.dataset.lastHash = currentHash;

    listContainer.innerHTML = htmlContent;

    // Cinematic Entrance
    const rows = listContainer.querySelectorAll('.log-item');
    if (typeof gsap !== 'undefined') {
        gsap.fromTo(rows, 
            { opacity: 0, x: -15, filter: "blur(4px)" }, 
            { opacity: 1, x: 0, filter: "blur(0px)", duration: 0.6, stagger: 0.02, ease: "power2.out" }
        );
    }
}

/**
 * Formats the Last.fm date string.
 */
function formatDate(dateStr) {
    if (!dateStr) return 'RECENT';
    const date = new Date(dateStr);
    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);

    if (diffInSeconds < 60) return 'JUST NOW';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}M AGO`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}H AGO`;
    
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }).toUpperCase();
}

/**
 * Sanitizes HTML to prevent XSS.
 */
function escapeHTML(str) {
    if (!str) return "";
    const p = document.createElement("p");
    p.textContent = str;
    return p.innerHTML;
}
