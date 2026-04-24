/**
 * THE MUSIC ARCHIVE 4.0 — High-Performance Sonic Catalog
 * Optimized with session caching and shimmering skeleton loaders.
 */

const LASTFM_API_KEY = 'a403d71a4af1bacfddab789750be1c18';
const LASTFM_USER = 'santhoshh25';
const FETCH_LIMIT = 30;

const CACHE_KEY = 'lastfm_top_tracks_v4';
const CACHE_TTL = 30 * 60 * 1000; // 30 minutes

/**
 * Initializes the music history.
 */
export function initMusicHistory() {
    const tracksContainer = document.getElementById('track-list');
    if (!tracksContainer) return;

    fetchMediaLog();
}

/**
 * Orchestrates fetching with caching and skeleton states.
 */
async function fetchMediaLog() {
    const tracksContainer = document.getElementById('track-list');
    if (!tracksContainer) return;

    try {
        // 1. Show Skeletons Immediately
        injectSkeletons(tracksContainer);

        // 2. Check Cache
        let finalTracks = getCache();

        if (!finalTracks) {
            // Fetch Top Tracks
            const topUrl = `https://ws.audioscrobbler.com/2.0/?method=user.gettoptracks&user=${LASTFM_USER}&api_key=${LASTFM_API_KEY}&format=json&limit=${FETCH_LIMIT}&period=7day`;
            const topRes = await fetch(topUrl);
            const topData = await topRes.json();
            const topTracks = topData.toptracks.track || [];

            // Check for Now Playing
            const recentUrl = `https://ws.audioscrobbler.com/2.0/?method=user.getrecenttracks&user=${LASTFM_USER}&api_key=${LASTFM_API_KEY}&format=json&limit=1`;
            const recentRes = await fetch(recentUrl);
            const recentData = await recentRes.json();
            const nowPlaying = recentData.recenttracks.track[0] || null;
            const isLive = nowPlaying && nowPlaying['@attr'] && nowPlaying['@attr'].nowplaying === 'true';

            // Process Albums
            finalTracks = await Promise.all(topTracks.map(async (track) => {
                const albumName = extractAlbumFromTitle(track.name) || 'COLLECTION';
                return {
                    name: track.name,
                    artist: { name: track.artist.name },
                    album: albumName,
                    playcount: track.playcount,
                    isLive: false
                };
            }));

            // Inject Live track if active
            if (isLive) {
                const liveTrack = {
                    name: nowPlaying.name,
                    artist: { name: nowPlaying.artist['#text'] },
                    album: nowPlaying.album['#text'] || 'NOW PLAYING',
                    isLive: true,
                    playcount: 'LIVE'
                };
                // Remove duplicates and put live at top
                finalTracks = [liveTrack, ...finalTracks.filter(t => 
                    !(t.name.toLowerCase() === nowPlaying.name.toLowerCase() && 
                      t.artist.name.toLowerCase() === nowPlaying.artist['#text'].toLowerCase())
                )].slice(0, FETCH_LIMIT);
            }

            setCache(finalTracks);
        }

        // 3. Render
        renderMusicGrid(tracksContainer, finalTracks);

    } catch (error) {
        console.error('Music Archive Sync Failed:', error);
        tracksContainer.innerHTML = '<div class="frequency-loading">ARCHIVE TEMPORARILY OFFLINE</div>';
    }
}

/**
 * Renders the music data into the grid.
 */
function renderMusicGrid(container, tracks) {
    let htmlContent = `
        <div class="playlist-container fade-up">
            <div class="playlist-header">
                <span class="col-index">#</span>
                <span class="col-title">TITLE</span>
                <span class="col-album">ALBUM</span>
                <span class="col-plays">PLAYS</span>
            </div>
            <div class="playlist-rows">
    `;

    tracks.forEach((track, index) => {
        const isLive = track.isLive;
        const indexContent = isLive 
            ? '<div class="live-eq"><span class="eq-bar"></span><span class="eq-bar"></span><span class="eq-bar"></span></div>' 
            : (index + 1);
        
        htmlContent += `
            <div class="track-row ${isLive ? 'is-live' : ''}">
                <div class="track-col col-index">${indexContent}</div>
                <div class="track-col col-title">
                    <div class="track-info">
                        <span class="track-name">${escapeHTML(track.name)}</span>
                        <span class="track-artist">${escapeHTML(track.artist.name)}</span>
                    </div>
                </div>
                <div class="track-col col-album">${escapeHTML(track.album)}</div>
                <div class="track-col col-plays">
                    ${isLive ? '<span class="live-tag">LIVE</span>' : track.playcount}
                </div>
            </div>
        `;
    });

    htmlContent += `</div></div>`;
    container.innerHTML = htmlContent;
}

/**
 * Skeleton Loader Injection
 */
function injectSkeletons(container) {
    container.innerHTML = `
        <div class="playlist-container">
            <div class="playlist-header">
                <span class="col-index">#</span>
                <span class="col-title">TITLE</span>
                <span class="col-album">ALBUM</span>
                <span class="col-plays">PLAYS</span>
            </div>
            <div class="playlist-rows">
                ${Array(12).fill(0).map(() => `
                    <div class="skeleton-row">
                        <div class="skeleton" style="height: 16px; width: 20px;"></div>
                        <div class="skeleton" style="height: 16px; width: 100%;"></div>
                        <div class="skeleton" style="height: 16px; width: 100%;"></div>
                        <div class="skeleton" style="height: 16px; width: 40px; justify-self: end;"></div>
                    </div>
                `).join('')}
            </div>
        </div>
    `;
}

/**
 * Cache Management
 */
function getCache() {
    const cached = sessionStorage.getItem(CACHE_KEY);
    if (!cached) return null;
    const { data, timestamp } = JSON.parse(cached);
    return (Date.now() - timestamp > CACHE_TTL) ? null : data;
}

function setCache(data) {
    sessionStorage.setItem(CACHE_KEY, JSON.stringify({ data, timestamp: Date.now() }));
}

/**
 * Utility: Extract album name from title (e.g. from "Song Name (From Movie Name)")
 */
function extractAlbumFromTitle(title) {
    if (!title) return null;
    const fromMatch = title.match(/(?:From|from|Movie)\s+["']?([^"'\)]+)["']?/i);
    return fromMatch ? fromMatch[1].trim().toUpperCase() : null;
}

/**
 * Utility: Escape HTML
 */
function escapeHTML(str) {
    if (!str) return "";
    const p = document.createElement("p");
    p.textContent = str;
    return p.innerHTML;
}
