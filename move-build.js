// move-build.js
const fs = require('fs');
const path = require('path');

const source = path.join(__dirname, 'frontend/build');
const destination = path.join(__dirname, 'build');

try {
  // Remove destination directory if it exists
  if (fs.existsSync(destination)) {
    fs.rmSync(destination, { recursive: true, force: true });
  }
  // Copy frontend/build to build
  fs.cpSync(source, destination, { recursive: true });
  console.log('Build moved to root build directory');
} catch (error) {
  console.error('Error moving build:', error);
  process.exit(1);
}