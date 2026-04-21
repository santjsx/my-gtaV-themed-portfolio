import gsap from 'gsap';

const LASTFM_API_KEY = 'a403d71a4af1bacfddab789750be1c18';
const LASTFM_USER = 'santhoshh25';
const FETCH_LIMIT = 30;

/**
 * Initializes the music history (Recently Played) section.
 */
export function initMusicHistory() {
    const listContainer = document.getElementById('track-list');
    if (!listContainer) return;

    fetchRecentTracks();
    
    // Refresh every 2 minutes
    setInterval(fetchRecentTracks, 120000);
}

/**
 * Fetches recent tracks from Last.fm API.
 */
async function fetchRecentTracks() {
    const listContainer = document.getElementById('track-list');
    if (!listContainer) return;

    try {
        const url = `https://ws.audioscrobbler.com/2.0/?method=user.getrecenttracks&user=${LASTFM_USER}&api_key=${LASTFM_API_KEY}&format=json&limit=${FETCH_LIMIT}`;
        const response = await fetch(url);
        const data = await response.json();

        if (data && data.recenttracks && data.recenttracks.track) {
            const tracks = data.recenttracks.track;
            renderTracks(tracks);
        }
    } catch (error) {
        console.error('Failed to fetch Last.fm tracks:', error);
        listContainer.innerHTML = '<div class="frequency-loading">System Link Interrupted: Unable to fetch pulse.</div>';
    }
}

/**
 * Renders the track list into the container instantly with placeholders.
 * Background processes then resolve missing artwork and inject it smoothly.
 */
function renderTracks(tracks) {
    const listContainer = document.getElementById('track-list');
    const trackList = Array.isArray(tracks) ? tracks : [tracks];
    
    let htmlContent = '';
    const pendingFallbacks = [];

    trackList.forEach((track, index) => {
        const name = track.name;
        const artist = track.artist['#text'];
        const isNowPlaying = track['@attr'] && track['@attr'].nowplaying === 'true';
        const dateText = isNowPlaying ? 'Live Now' : formatDate(track.date ? track.date['#text'] : null);
        
        // Artwork Priority: 1. Last.fm, 2. Persistent Cache, 3. Pending Deezer Search
        const images = track.image || [];
        const imageObj = images.find(img => img.size === 'extralarge') || 
                         images.find(img => img.size === 'large') || 
                         images[images.length - 1];
        
        let imageUrl = (imageObj && imageObj['#text'] && !imageObj['#text'].includes('2a96cbd8b')) ? imageObj['#text'] : '';
        let isPreloaded = !!imageUrl;

        // Check local cache if Last.fm failed
        if (!imageUrl) {
            const cachedUrl = getCachedArtwork(artist, name);
            if (cachedUrl) {
                imageUrl = cachedUrl;
                isPreloaded = true;
            } else {
                pendingFallbacks.push({ artist, name, index });
            }
        }

        htmlContent += `
            <div class="track-card ${isNowPlaying ? 'is-now-playing' : ''}" data-index="${index}">
                <div class="track-artwork-wrapper">
                    <img src="${imageUrl || ''}" 
                         alt="${escapeHTML(name)}" 
                         class="track-img ${isPreloaded ? 'loaded' : ''}" 
                         id="track-img-${index}"
                         onload="this.classList.add('loaded')"
                         onerror="this.style.opacity=0">
                    <div class="track-img-placeholder"></div>
                    ${isNowPlaying ? '<div class="live-pulse-badge">LIVE</div>' : ''}
                </div>
                <div class="track-info-card">
                    <h4 class="track-name-grid">${escapeHTML(name)}</h4>
                    <p class="track-artist-grid">${escapeHTML(artist)}</p>
                    <span class="track-time-grid">${dateText}</span>
                </div>
            </div>
        `;
    });

    // Hash check for efficient updating
    const currentHash = btoa(unescape(encodeURIComponent(htmlContent))).slice(0, 32);
    if (listContainer.dataset.lastHash === currentHash) return;
    listContainer.dataset.lastHash = currentHash;

    listContainer.innerHTML = htmlContent;

    // Trigger grid entrance immediately (Zero Lag)
    const cards = listContainer.querySelectorAll('.track-card');
    if (typeof gsap !== 'undefined') {
        gsap.fromTo(cards, 
            { opacity: 0, y: 20 }, 
            { opacity: 1, y: 0, duration: 0.6, stagger: 0.04, ease: "power2.out" }
        );
    }

    // Process missing artwork in background
    if (pendingFallbacks.length > 0) {
        processArtFallbacks(pendingFallbacks);
    }
}

/**
 * Background process to find missing covers without blocking the UI.
 */
async function processArtFallbacks(fallbacks) {
    // Process fallbacks in small chunks to avoid network congestion
    const chunkSize = 3;
    for (let i = 0; i < fallbacks.length; i += chunkSize) {
        const chunk = fallbacks.slice(i, i + chunkSize);
        await Promise.all(chunk.map(async (item) => {
            const url = await getFailsafeCover(item.artist, item.name);
            if (url) {
                const img = document.getElementById(`track-img-${item.index}`);
                if (img) {
                    img.src = url;
                    // Cache it for the next visit!
                    saveArtworkToCache(item.artist, item.name, url);
                }
            }
        }));
    }
}

/**
 * Persistent local storage cache for artwork URLs.
 */
function getCachedArtwork(artist, track) {
    try {
        const cache = JSON.parse(localStorage.getItem('artwork_cache_v1') || '{}');
        return cache[`${artist}:${track}`];
    } catch (e) { return null; }
}

function saveArtworkToCache(artist, track, url) {
    try {
        const cache = JSON.parse(localStorage.getItem('artwork_cache_v1') || '{}');
        cache[`${artist}:${track}`] = url;
        localStorage.setItem('artwork_cache_v1', JSON.stringify(cache));
    } catch (e) {}
}

/**
 * External artwork provider (Deezer) with 2s timeout failsafe.
 */
async function getFailsafeCover(artist, track) {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 2500);

    try {
        const query = encodeURIComponent(`track:"${track}" artist:"${artist}"`);
        const response = await fetch(
            `https://api.allorigins.win/get?url=${encodeURIComponent(`https://api.deezer.com/search?q=${query}&limit=1`)}`,
            { signal: controller.signal }
        );
        const data = await response.json();
        const deezerData = JSON.parse(data.contents);
        
        if (deezerData && deezerData.data && deezerData.data.length > 0) {
            return deezerData.data[0].album.cover_xl || deezerData.data[0].album.cover_big;
        }
    } catch (e) {
        // Silently fail to maintain "Zero Errors" vibe
    } finally {
        clearTimeout(timeout);
    }
    return '';
}

/**
 * Formats the Last.fm date string into a relative time.
 */
function formatDate(dateStr) {
    if (!dateStr) return 'Recently';
    
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    return `${diffDays}d ago`;
}

/**
 * Escapes HTML to prevent XSS.
 */
function escapeHTML(str) {
    if (!str) return '';
    return str.replace(/[&<>'"]/g, tag => ({
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        "'": '&#39;',
        '"': '&quot;'
    }[tag] || tag));
}
