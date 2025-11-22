/* Navy Cooperation Timer - Server */

const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);
const path = require('path');

const PORT = process.env.PORT || 3000;

// Serve static files
// NOTE: For production, consider serving only a dedicated 'public' folder instead of __dirname
// to avoid exposing server-side files. This is acceptable for development/testing.
app.use(express.static(__dirname));

// Timer state for each quadrant
const timerState = {
    red: 180,    // 3 minutes
    blue: 180,
    green: 180,
    yellow: 180
};

// Partner rotation (who sends bonus to whom)
const partnerRotation = {
    red: 'blue',
    blue: 'green',
    green: 'yellow',
    yellow: 'red'
};

// Active timer color
let activeTimer = 'red';

// Socket.IO connection handling
io.on('connection', (socket) => {
    console.log('Client connected:', socket.id);
    
    // Send initial state to new client
    socket.emit('initialState', {
        timers: timerState,
        activeTimer: activeTimer
    });
    
    socket.on('disconnect', () => {
        console.log('Client disconnected:', socket.id);
    });
});

// Timer logic - runs every second
setInterval(() => {
    if (timerState[activeTimer] > 0) {
        timerState[activeTimer]--;
        
        // Check if time expired - award bonus time to partner
        if (timerState[activeTimer] === 0) {
            const bonusReceiver = partnerRotation[activeTimer];
            const bonusAmount = 30; // 30 seconds bonus
            
            timerState[bonusReceiver] += bonusAmount;
            
            console.log(`Timer expired for ${activeTimer}, bonus awarded to ${bonusReceiver}`);
            
            // === Emit timerUpdate with bonusReceiver data ===
            io.emit('timerUpdate', {
                timers: timerState,
                activeTimer: activeTimer,
                bonusSender: activeTimer,
                bonusReceiver: bonusReceiver,
                bonusAmount: bonusAmount
            });
            
            // Move to next timer in rotation
            activeTimer = bonusReceiver;
        } else {
            // Regular timer update without bonus
            io.emit('timerUpdate', {
                timers: timerState,
                activeTimer: activeTimer
            });
        }
    }
}, 1000);

// Start server
http.listen(PORT, () => {
    console.log(`Navy Cooperation Timer server running on port ${PORT}`);
    console.log(`Open http://localhost:${PORT} in your browser`);
});

/* 
 * Server emits timerUpdate events with the following data:
 * - timers: Object with current time for each quadrant
 * - activeTimer: Currently active quadrant color
 * - bonusSender: (optional) Color of quadrant that ran out of time
 * - bonusReceiver: (optional) Color of quadrant receiving bonus time
 * - bonusAmount: (optional) Amount of bonus time awarded in seconds
 * 
 * No additional fields are needed for the bonus animation feature.
 */
