const fs = require('fs');
const path = require('path');

// Read the logo file
const logoPath = path.join(__dirname, '../../public/images/mission-mate-logo.png');
const logoBuffer = fs.readFileSync(logoPath);
const base64Logo = logoBuffer.toString('base64');

console.log(`data:image/png;base64,${base64Logo}`);
