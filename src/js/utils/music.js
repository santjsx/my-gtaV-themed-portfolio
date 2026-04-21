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
 * Renders the track list into the container with GSAP animations.
 */
function renderTracks(tracks) {
    const listContainer = document.getElementById('track-list');
    
    // Convert to array if only one track is returned (Edge case)
    const trackList = Array.isArray(tracks) ? tracks : [tracks];
    
    let htmlContent = '';
    
    trackList.forEach(track => {
        const name = track.name;
        const artist = track.artist['#text'];
        const isNowPlaying = track['@attr'] && track['@attr'].nowplaying === 'true';
        const dateText = isNowPlaying ? 'Live Now' : formatDate(track.date ? track.date['#text'] : null);
        
        // Get album art (prefer extralarge)
        const images = track.image || [];
        const imageObj = images.find(img => img.size === 'extralarge') || 
                         images.find(img => img.size === 'large') || 
                         images[images.length - 1];
        
        // Fallback for missing images
        const imageUrl = (imageObj && imageObj['#text']) ? imageObj['#text'] : '';
        
        htmlContent += `
            <div class="track-card ${isNowPlaying ? 'is-now-playing' : ''}">
                <div class="track-artwork-wrapper">
                    ${imageUrl ? 
                        `<img src="${imageUrl}" alt="${escapeHTML(name)}" class="track-img" loading="lazy">` : 
                        `<div class="track-img-placeholder"></div>`
                    }
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

    // Only update if content is different
    if (listContainer.dataset.lastHash === btoa(htmlContent).slice(0, 32)) return;
    listContainer.dataset.lastHash = btoa(htmlContent).slice(0, 32);

    listContainer.innerHTML = htmlContent;

    // Grid Entrance Animation
    const cards = listContainer.querySelectorAll('.track-card');
    if (typeof gsap !== 'undefined') {
        gsap.fromTo(cards, 
            { 
                opacity: 0, 
                y: 30,
                scale: 0.95
            }, 
            { 
                opacity: 1, 
                y: 0, 
                scale: 1,
                duration: 0.8, 
                stagger: 0.05, 
                ease: "expo.out",
                clearProps: "all"
            }
        );
    }
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
