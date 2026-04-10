// src/js/utils/lanyard.js

const DiscordID = '1284925883240550552';
const API_URL = `https://api.lanyard.rest/v1/users/${DiscordID}`;

export function initLanyardWidget() {
    const toggleBtn = document.getElementById('lanyard-toggle');
    const popover = document.getElementById('lanyard-popover');
    
    if (!toggleBtn || !popover) return;

    // Toggle popover visibility
    toggleBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        popover.classList.toggle('active');
        if (popover.classList.contains('active')) {
            fetchLanyardData(); // Refresh data when opened
        }
    });

    // Close when clicking outside
    document.addEventListener('click', (e) => {
        if (!popover.contains(e.target) && !toggleBtn.contains(e.target)) {
            popover.classList.remove('active');
        }
    });

    // Initial fetch to set color indicator on the floating button
    fetchLanyardData();
    
    // Poll every 30 seconds
    setInterval(fetchLanyardData, 30000);
}

async function fetchLanyardData() {
    try {
        const response = await fetch(API_URL);
        const json = await response.json();
        
        if (json.success && json.data) {
            updateWidgetUI(json.data);
        }
    } catch (error) {
        console.error('Failed to fetch Lanyard data:', error);
    }
}

function updateWidgetUI(data) {
    const wrapper = document.getElementById('lanyard-toggle');
    const statusText = document.getElementById('lanyard-status-text');
    const activitiesContainer = document.getElementById('lanyard-activities');
    
    // Update basic status (online, idle, dnd, offline)
    const status = data.discord_status;
    
    // Reset classes
    wrapper.classList.remove('status-online', 'status-idle', 'status-dnd', 'status-offline');
    if (statusText) statusText.parentElement.classList.remove('status-online', 'status-idle', 'status-dnd', 'status-offline');
    
    // Apply new status
    wrapper.classList.add(`status-${status}`);
    if (statusText) {
        statusText.parentElement.classList.add(`status-${status}`);
        statusText.textContent = status.toUpperCase();
    }
    
    // Render activities (like VS Code, Spotify, Games)
    if (activitiesContainer) {
        const activities = data.activities || [];
        
        if (activities.length === 0) {
            activitiesContainer.innerHTML = `
                <div class="lanyard-offline-message">
                    <span class="offline-tag">[ SYSTEM LOG ]</span>
                    <span class="offline-text">User is currently operating in stealth mode or completely offline. Plotting the next move...</span>
                </div>
            `;
            return;
        }
        
        let htmlContent = '';
        activities.forEach((act, index) => {
            const isCustomStatus = act.id === 'custom' || act.type === 4;
            
            let innerHtml = '';
            if (isCustomStatus) {
                // If it's a discord custom status (e.g., "Working on the portfolio")
                const emoji = act.emoji ? `${act.emoji.name} ` : '';
                const text = act.state || '';
                innerHtml += `<span class="activity-custom">" ${escapeHTML(emoji + text)} "</span>`;
            } else {
                // Standard Rich Presence (Games, VS Code, Music)
                innerHtml += `<span class="activity-name">${escapeHTML(act.name)}</span>`;
                if (act.details) {
                    innerHtml += `<span class="activity-details">${escapeHTML(act.details)}</span>`;
                }
                if (act.state) {
                    innerHtml += `<span class="activity-state">${escapeHTML(act.state)}</span>`;
                }
            }
            
            htmlContent += `<div class="lanyard-activity">${innerHtml}</div>`;
            
            // Add a subtle divider between multiple activities
            if (index < activities.length - 1) {
                htmlContent += `<div class="activity-divider"></div>`;
            }
        });
        
        activitiesContainer.innerHTML = htmlContent;
    }
}

// Security: basic HTML escaping for Discord string inputs
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
