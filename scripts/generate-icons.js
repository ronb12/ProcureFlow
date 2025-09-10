const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const sizes = [72, 96, 128, 144, 152, 192, 384, 512];

// Create icons directory if it doesn't exist
const iconsDir = path.join(__dirname, '..', 'public', 'icons');
if (!fs.existsSync(iconsDir)) {
  fs.mkdirSync(iconsDir, { recursive: true });
}

// Create a simple icon using sharp
async function createIcon(size) {
  const svg = `
    <svg width="${size}" height="${size}" viewBox="0 0 512 512" fill="none" xmlns="http://www.w3.org/2000/svg">
      <!-- Background circle -->
      <circle cx="256" cy="256" r="240" fill="#2563eb" stroke="#1d4ed8" stroke-width="8"/>
      
      <!-- Card icon -->
      <rect x="128" y="180" width="256" height="160" rx="12" fill="white" stroke="#e5e7eb" stroke-width="2"/>
      
      <!-- Card details -->
      <rect x="140" y="200" width="232" height="20" rx="4" fill="#f3f4f6"/>
      <rect x="140" y="230" width="180" height="16" rx="4" fill="#e5e7eb"/>
      <rect x="140" y="250" width="160" height="16" rx="4" fill="#e5e7eb"/>
      <rect x="140" y="270" width="140" height="16" rx="4" fill="#e5e7eb"/>
      
      <!-- Chip -->
      <rect x="160" y="300" width="32" height="24" rx="4" fill="#fbbf24"/>
      
      <!-- Card number -->
      <rect x="200" y="300" width="80" height="16" rx="2" fill="#6b7280"/>
      <rect x="290" y="300" width="60" height="16" rx="2" fill="#6b7280"/>
      
      <!-- Dollar sign -->
      <text x="256" y="140" text-anchor="middle" font-family="Arial, sans-serif" font-size="48" font-weight="bold" fill="white">$</text>
      
      <!-- Flow arrows -->
      <path d="M 80 120 Q 100 140 120 120" stroke="white" stroke-width="4" fill="none" stroke-linecap="round"/>
      <path d="M 392 120 Q 412 140 432 120" stroke="white" stroke-width="4" fill="none" stroke-linecap="round"/>
      <path d="M 80 392 Q 100 372 120 392" stroke="white" stroke-width="4" fill="none" stroke-linecap="round"/>
      <path d="M 392 392 Q 412 372 432 392" stroke="white" stroke-width="4" fill="none" stroke-linecap="round"/>
    </svg>
  `;

  return await sharp(Buffer.from(svg)).resize(size, size).png().toBuffer();
}

async function generateIcons() {
  try {
    // Generate icons for each size
    for (const size of sizes) {
      const filename = `icon-${size}x${size}.png`;
      const filepath = path.join(iconsDir, filename);

      const iconData = await createIcon(size);
      fs.writeFileSync(filepath, iconData);
      console.log(`Created ${filename}`);
    }

    // Create favicon.ico (32x32)
    const faviconData = await createIcon(32);
    const faviconPath = path.join(__dirname, '..', 'public', 'favicon.ico');
    fs.writeFileSync(faviconPath, faviconData);
    console.log('Created favicon.ico');

    // Create apple-touch-icon.png (180x180)
    const appleTouchIconData = await createIcon(180);
    const appleTouchIconPath = path.join(
      __dirname,
      '..',
      'public',
      'apple-touch-icon.png'
    );
    fs.writeFileSync(appleTouchIconPath, appleTouchIconData);
    console.log('Created apple-touch-icon.png');

    console.log('Icon generation complete!');
  } catch (error) {
    console.error('Error generating icons:', error);
  }
}

generateIcons();
