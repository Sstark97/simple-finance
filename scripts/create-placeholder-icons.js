#!/usr/bin/env node

/**
 * Creates placeholder icons for PWA testing
 * Run this temporarily until you have your actual icon
 */

const fs = require('fs');
const path = require('path');

// Simple PNG creation - creates a solid color square
function createSimplePNG(width, height, color = [22, 101, 52]) {
  // PNG header
  const header = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);

  // IHDR chunk (image header)
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8; // bit depth
  ihdr[9] = 2; // color type (RGB)
  ihdr[10] = 0; // compression
  ihdr[11] = 0; // filter
  ihdr[12] = 0; // interlace

  // Calculate CRC (simplified)
  const crcTable = [];
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) {
      c = (c & 1) ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    }
    crcTable[n] = c >>> 0;
  }

  function crc32(buf) {
    let crc = 0xffffffff;
    for (let i = 0; i < buf.length; i++) {
      crc = crcTable[(crc ^ buf[i]) & 0xff] ^ (crc >>> 8);
    }
    return (crc ^ 0xffffffff) >>> 0;
  }

  // Create IHDR chunk
  const ihdrData = Buffer.concat([Buffer.from('IHDR'), ihdr]);
  const ihdrCrc = Buffer.alloc(4);
  ihdrCrc.writeUInt32BE(crc32(ihdrData), 0);
  const ihdrChunk = Buffer.concat([
    Buffer.alloc(4, 0),
    ihdrData,
    ihdrCrc,
  ]);
  ihdrChunk.writeUInt32BE(ihdr.length, 0);

  // Simple IDAT chunk (pixel data) - just a solid color
  const scanline = Buffer.alloc(width * 3 + 1);
  scanline[0] = 0; // filter type
  for (let x = 0; x < width; x++) {
    scanline[x * 3 + 1] = color[0];
    scanline[x * 3 + 2] = color[1];
    scanline[x * 3 + 3] = color[2];
  }

  const pixelData = Buffer.alloc((width * 3 + 1) * height);
  for (let y = 0; y < height; y++) {
    scanline.copy(pixelData, y * scanline.length);
  }

  const zlib = require('zlib');
  const compressed = zlib.deflateSync(pixelData);

  const idatData = Buffer.concat([Buffer.from('IDAT'), compressed]);
  const idatCrc = Buffer.alloc(4);
  idatCrc.writeUInt32BE(crc32(idatData), 0);
  const idatChunk = Buffer.concat([
    Buffer.alloc(4, 0),
    idatData,
    idatCrc,
  ]);
  idatChunk.writeUInt32BE(compressed.length, 0);

  // IEND chunk
  const iendData = Buffer.from('IEND');
  const iendCrc = Buffer.alloc(4);
  iendCrc.writeUInt32BE(crc32(iendData), 0);
  const iendChunk = Buffer.concat([
    Buffer.alloc(4, 0),
    iendData,
    iendCrc,
  ]);
  iendChunk.writeUInt32BE(0, 0);

  return Buffer.concat([header, ihdrChunk, idatChunk, iendChunk]);
}

const publicDir = path.join(process.cwd(), 'public');

if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
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
  { width: 192, height: 192, name: 'icon-192x192-maskable.png' },
  { width: 512, height: 512, name: 'icon-512x512-maskable.png' },
];

console.log('Creating placeholder PWA icons...\n');

for (const size of sizes) {
  try {
    const outputPath = path.join(publicDir, size.name);
    const png = createSimplePNG(size.width, size.height, [22, 101, 52]); // Green color
    fs.writeFileSync(outputPath, png);
    console.log(`✓ Created ${size.name} (${size.width}x${size.height})`);
  } catch (err) {
    console.error(`✗ Failed to create ${size.name}:`, err.message);
  }
}

console.log('\nPlaceholder icons created successfully!');
console.log('Replace them with your actual icon when ready.');
