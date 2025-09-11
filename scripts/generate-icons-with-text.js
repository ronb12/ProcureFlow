const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

// Icon sizes to generate
const sizes = [72, 96, 128, 144, 152, 192, 384, 512];

// App branding
const appName = 'ProcureFlow';
const backgroundColor = '#2563eb'; // Primary blue
const textColor = '#ffffff'; // White text
const iconPath = path.join(__dirname, '../public/icons');

async function generateIconWithText(size) {
  // Create SVG with text
  const fontSize = Math.max(size * 0.15, 12); // 15% of size, minimum 12px
  const radius = size * 0.2; // 20% of size for rounded corners

  const svg = `
    <svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <style>
          .app-text { 
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; 
            font-weight: bold; 
            font-size: ${fontSize}px; 
            fill: ${textColor}; 
            text-anchor: middle; 
            dominant-baseline: middle;
            filter: drop-shadow(2px 2px 4px rgba(0,0,0,0.3));
          }
        </style>
      </defs>
      <rect width="${size}" height="${size}" rx="${radius}" ry="${radius}" fill="${backgroundColor}"/>
      <rect x="2" y="2" width="${size - 4}" height="${size - 4}" rx="${radius - 1}" ry="${radius - 1}" fill="none" stroke="rgba(255,255,255,0.2)" stroke-width="2"/>
      <text x="${size / 2}" y="${size / 2}" class="app-text">${appName}</text>
    </svg>`;

  // Convert SVG to PNG
  const buffer = await sharp(Buffer.from(svg)).png().toBuffer();

  // Save the icon
  const filename = `icon-${size}x${size}.png`;
  const filepath = path.join(iconPath, filename);
  fs.writeFileSync(filepath, buffer);

  console.log(`Generated ${filename}`);
}

async function generateAllIcons() {
  console.log('Generating icons with app name...');

  // Ensure the icons directory exists
  if (!fs.existsSync(iconPath)) {
    fs.mkdirSync(iconPath, { recursive: true });
  }

  // Generate all icon sizes
  for (const size of sizes) {
    await generateIconWithText(size);
  }

  // Also generate the SVG icon
  const svgContent = `
<svg width="512" height="512" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <style>
      .app-text { 
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; 
        font-weight: bold; 
        font-size: 80px; 
        fill: white; 
        text-anchor: middle; 
        dominant-baseline: middle;
        filter: drop-shadow(2px 2px 4px rgba(0,0,0,0.3));
      }
    </style>
  </defs>
  <rect width="512" height="512" rx="102" ry="102" fill="${backgroundColor}"/>
  <rect x="2" y="2" width="508" height="508" rx="100" ry="100" fill="none" stroke="rgba(255,255,255,0.2)" stroke-width="4"/>
  <text x="256" y="256" class="app-text">${appName}</text>
</svg>`;

  fs.writeFileSync(path.join(iconPath, 'icon.svg'), svgContent);
  console.log('Generated icon.svg');

  console.log('All icons generated successfully!');
}

// Run the script
generateAllIcons().catch(console.error);
