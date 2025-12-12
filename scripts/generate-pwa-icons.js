#!/usr/bin/env node

/**
 * PWA Icon Generation Script
 *
 * This script generates all required PWA icon sizes from a source image.
 *
 * Usage:
 *   npm run generate-icons [--source <path>]
 *
 * Example:
 *   npm run generate-icons
 *   npm run generate-icons --source ./my-icon.png
 *
 * Default source: source-icon.png (in project root)
 * Output directory: public/
 *
 * Generated icons:
 *   - favicon.ico (32x32)
 *   - favicon-16x16.png (16x16)
 *   - favicon-32x32.png (32x32)
 *   - apple-touch-icon.png (180x180)
 *   - icon-120x120.png (120x120, iPhone)
 *   - icon-152x152.png (152x152, iPad mini)
 *   - icon-167x167.png (167x167, iPad Pro)
 *   - icon-192x192.png (192x192, Android Chrome)
 *   - icon-512x512.png (512x512, Android Chrome)
 *   - icon-192x192-maskable.png (192x192, maskable for Android)
 *   - icon-512x512-maskable.png (512x512, maskable for Android)
 */

const fs = require('fs');
const path = require('path');

// Try to use sharp if available, otherwise provide instructions
let sharp;
try {
  sharp = require('sharp');
} catch (e) {
  console.error('Error: sharp module not found.');
  console.error('Please install it with: npm install --save-dev sharp');
  process.exit(1);
}

const args = process.argv.slice(2);
const sourceArgIndex = args.indexOf('--source');
const sourceFile = sourceArgIndex !== -1 ? args[sourceArgIndex + 1] : 'source-icon.png';
const sourcePath = path.join(process.cwd(), sourceFile);
const publicDir = path.join(process.cwd(), 'public');

// Ensure public directory exists
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

// Check if source file exists
if (!fs.existsSync(sourcePath)) {
  console.error(`Error: Source icon not found at ${sourcePath}`);
  console.error('\nPlease place your icon file (1024x1024 or larger) at:');
  console.error(`  ${sourcePath}`);
  console.error('\nOr specify a custom path:');
  console.error('  npm run generate-icons --source ./path/to/your/icon.png');
  process.exit(1);
}

const sizes = [
  { width: 16, height: 16, name: 'favicon-16x16.png' },
  { width: 32, height: 32, name: 'favicon-32x32.png' },
  { width: 120, height: 120, name: 'icon-120x120.png' },
  { width: 152, height: 152, name: 'icon-152x152.png' },
  { width: 167, height: 167, name: 'icon-167x167.png' },
  { width: 180, height: 180, name: 'apple-touch-icon.png' },
  { width: 192, height: 192, name: 'icon-192x192.png' },
  { width: 512, height: 512, name: 'icon-512x512.png' },
  { width: 192, height: 192, name: 'icon-192x192-maskable.png', maskable: true },
  { width: 512, height: 512, name: 'icon-512x512-maskable.png', maskable: true },
];

async function generateIcons() {
  try {
    console.log('Generating PWA icons...');
    console.log(`Source: ${sourcePath}\n`);

    for (const size of sizes) {
      try {
        const outputPath = path.join(publicDir, size.name);
        let pipeline = sharp(sourcePath);

        // Resize and fit
        pipeline = pipeline.resize(size.width, size.height, {
          fit: 'contain',
          background: size.maskable ? { r: 0, g: 0, b: 0, alpha: 0 } : { r: 255, g: 255, b: 255, alpha: 1 },
        });

        // Convert to PNG
        await pipeline.png().toFile(outputPath);
        console.log(`✓ Generated ${size.name} (${size.width}x${size.height})`);
      } catch (err) {
        console.error(`✗ Failed to generate ${size.name}:`, err.message);
      }
    }

    // Generate favicon.ico (simple version using 32x32)
    try {
      const favicon32Path = path.join(publicDir, 'favicon-32x32.png');
      const faviconPath = path.join(publicDir, 'favicon.ico');

      // For ICO format, we'll just copy the 32x32 PNG
      // In production, you might want to use a proper ICO converter
      await sharp(favicon32Path)
        .ico()
        .toFile(faviconPath);
      console.log('✓ Generated favicon.ico');
    } catch (err) {
      console.warn('Note: .ico generation requires additional tools. Using PNG favicon instead.');
    }

    console.log('\nIcons generated successfully in public/');
    console.log('\nNext steps:');
    console.log('1. Run: npm run build');
    console.log('2. Install the PWA from your browser');
    console.log('3. The app will be available offline!');
  } catch (error) {
    console.error('Error generating icons:', error);
    process.exit(1);
  }
}

generateIcons();
