// Test script to trigger bonus animation manually
// USAGE: Open http://localhost:3000 in browser, then paste this entire script into the browser console
// This assumes the main application (script.js) is already loaded, which defines showBonusArrow()

console.log('Testing bonus animation from Red to Blue...');
showBonusArrow('red', 'blue');

setTimeout(() => {
    console.log('Testing bonus animation from Blue to Green...');
    showBonusArrow('blue', 'green');
}, 3000);

setTimeout(() => {
    console.log('Testing bonus animation from Green to Yellow...');
    showBonusArrow('green', 'yellow');
}, 6000);

setTimeout(() => {
    console.log('Testing bonus animation from Yellow to Red...');
    showBonusArrow('yellow', 'red');
}, 9000);
