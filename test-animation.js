// Test script to trigger bonus animation manually
// This can be run in the browser console for testing

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
