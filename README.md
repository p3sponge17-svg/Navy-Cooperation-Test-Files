# Navy Cooperation Timer

A real-time cooperation timer application with bonus time animations.

## Features

- Four quadrant display (Red, Blue, Green, Yellow)
- Real-time timer synchronization using Socket.IO
- Bonus time animation when a timer expires:
  - "+" symbol appears in sender's quadrant
  - Green arrow animates from sender to receiver quadrant
  - Responsive design for mobile and desktop

## Installation

```bash
npm install
```

## Running the Application

```bash
npm start
```

Open your browser to `http://localhost:3000`

## Bonus Animation

When a quadrant's timer reaches zero, bonus time is awarded to the next partner in rotation:
- Red → Blue
- Blue → Green  
- Green → Yellow
- Yellow → Red

The animation consists of:
1. A "+" symbol fades in and out in the sender's quadrant
2. A green arrow animates from sender to receiver quadrant and fades out as it moves
