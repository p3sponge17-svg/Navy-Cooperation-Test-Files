/* Navy Cooperation Timer - Client Script */

// Connect to Socket.IO server
const socket = io();

// Color map for quadrants
const colorMap = {
    'red': { quadrant: 0, position: { top: '25%', left: '25%' } },
    'blue': { quadrant: 1, position: { top: '25%', left: '75%' } },
    'green': { quadrant: 2, position: { top: '75%', left: '25%' } },
    'yellow': { quadrant: 3, position: { top: '75%', left: '75%' } }
};

// Initialize timer displays
document.addEventListener('DOMContentLoaded', () => {
    console.log('Navy Cooperation Timer initialized');
    
    // Create bonus animation container if it doesn't exist
    if (!document.querySelector('.bonus-animation-container')) {
        const container = document.createElement('div');
        container.className = 'bonus-animation-container';
        document.body.appendChild(container);
    }
});

// === Bonus Animation Function ===
/**
 * Displays bonus time animation from sender to receiver quadrant
 * @param {string} fromColor - Color of sender's quadrant (red, blue, green, yellow)
 * @param {string} toColor - Color of receiver's quadrant (red, blue, green, yellow)
 */
function showBonusArrow(fromColor, toColor) {
    console.log(`Bonus animation: ${fromColor} -> ${toColor}`);
    
    const container = document.querySelector('.bonus-animation-container');
    if (!container) {
        console.error('Bonus animation container not found');
        return;
    }
    
    const fromPos = colorMap[fromColor]?.position;
    const toPos = colorMap[toColor]?.position;
    
    if (!fromPos || !toPos) {
        console.error('Invalid color specified for bonus animation');
        return;
    }
    
    // Step 1: Create and show the "+" symbol in sender's quadrant
    const plusSymbol = document.createElement('div');
    plusSymbol.className = 'bonus-plus';
    plusSymbol.textContent = '+';
    plusSymbol.style.top = fromPos.top;
    plusSymbol.style.left = fromPos.left;
    plusSymbol.style.transform = 'translate(-50%, -50%)';
    container.appendChild(plusSymbol);
    
    // Step 2: After a delay, create and animate the arrow from sender to receiver
    setTimeout(() => {
        const arrow = document.createElement('div');
        arrow.className = 'bonus-arrow';
        arrow.textContent = '➜';
        arrow.style.top = fromPos.top;
        arrow.style.left = fromPos.left;
        arrow.style.transform = 'translate(-50%, -50%)';
        arrow.style.opacity = '0';
        container.appendChild(arrow);
        
        // Calculate rotation angle for arrow direction
        const angle = calculateAngle(fromPos, toPos);
        
        // Trigger animation on next frame
        requestAnimationFrame(() => {
            arrow.style.opacity = '1';
            arrow.style.top = toPos.top;
            arrow.style.left = toPos.left;
            arrow.style.transform = `translate(-50%, -50%) rotate(${angle}deg)`;
            
            // Fade out as it approaches destination
            setTimeout(() => {
                arrow.style.opacity = '0';
            }, 1000);
        });
        
        // Clean up arrow after animation completes
        setTimeout(() => {
            arrow.remove();
        }, 2500);
    }, 800);
    
    // Clean up plus symbol after its animation completes
    setTimeout(() => {
        plusSymbol.remove();
    }, 2000);
}

/**
 * Calculate rotation angle for arrow based on start and end positions
 * @param {Object} from - Starting position {top, left}
 * @param {Object} to - Ending position {top, left}
 * @returns {number} Angle in degrees
 */
function calculateAngle(from, to) {
    const fromTop = parseFloat(from.top);
    const fromLeft = parseFloat(from.left);
    const toTop = parseFloat(to.top);
    const toLeft = parseFloat(to.left);
    
    const deltaY = toTop - fromTop;
    const deltaX = toLeft - fromLeft;
    
    // Calculate angle in degrees (0° is pointing right)
    let angle = Math.atan2(deltaY, deltaX) * (180 / Math.PI);
    return angle;
}

// === Socket.IO Event Handlers ===

// Handle timer updates from server
socket.on('timerUpdate', (data) => {
    console.log('Timer update received:', data);
    
    // Update timer displays for each quadrant
    if (data.timers) {
        Object.keys(data.timers).forEach(color => {
            const timerElement = document.querySelector(`.quadrant.${color} .timer`);
            if (timerElement) {
                timerElement.textContent = formatTime(data.timers[color]);
            }
        });
    }
    
    // === Trigger bonus animation when bonus is awarded ===
    if (data.bonusReceiver && data.bonusSender) {
        console.log(`Bonus awarded: ${data.bonusSender} -> ${data.bonusReceiver}`);
        showBonusArrow(data.bonusSender, data.bonusReceiver);
    }
});

// Handle connection status
socket.on('connect', () => {
    console.log('Connected to server');
});

socket.on('disconnect', () => {
    console.log('Disconnected from server');
});

// Handle initial state
socket.on('initialState', (data) => {
    console.log('Initial state received:', data);
    
    if (data.timers) {
        Object.keys(data.timers).forEach(color => {
            const timerElement = document.querySelector(`.quadrant.${color} .timer`);
            if (timerElement) {
                timerElement.textContent = formatTime(data.timers[color]);
            }
        });
    }
});

/**
 * Format seconds into MM:SS display
 * @param {number} seconds - Time in seconds
 * @returns {string} Formatted time string
 */
function formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}
