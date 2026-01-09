#!/usr/bin/env node
/**
 * Script to download images from AT&T CDN and update markdown references
 */

const fs = require('fs');
const path = require('path');
const https = require('https');
const http = require('http');

const PRODUCTS_DIR = path.join(__dirname, '../content/products');
const IMAGES_DIR = path.join(PRODUCTS_DIR, 'images');

// Ensure images directory exists
if (!fs.existsSync(IMAGES_DIR)) {
  fs.mkdirSync(IMAGES_DIR, { recursive: true });
}

// Extract all image URLs from markdown files
function extractImageUrls(content) {
  const urlPattern = /https:\/\/www\.business\.att\.com\/content\/dam\/[^\s\)\"]+/g;
  const matches = content.match(urlPattern) || [];
  return [...new Set(matches)];
}

// Generate local filename from URL
function getLocalFilename(url) {
  const urlPath = new URL(url).pathname;
  const filename = path.basename(urlPath);
  return filename;
}

// Download a file
function downloadFile(url, destPath) {
  return new Promise((resolve, reject) => {
    const protocol = url.startsWith('https') ? https : http;

    const request = protocol.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    }, (response) => {
      // Handle redirects
      if (response.statusCode >= 300 && response.statusCode < 400 && response.headers.location) {
        downloadFile(response.headers.location, destPath).then(resolve).catch(reject);
        return;
      }

      if (response.statusCode !== 200) {
        reject(new Error(`Failed to download ${url}: ${response.statusCode}`));
        return;
      }

      const fileStream = fs.createWriteStream(destPath);
      response.pipe(fileStream);

      fileStream.on('finish', () => {
        fileStream.close();
        resolve(destPath);
      });

      fileStream.on('error', (err) => {
        fs.unlink(destPath, () => {});
        reject(err);
      });
    });

    request.on('error', reject);
    request.setTimeout(30000, () => {
      request.destroy();
      reject(new Error(`Timeout downloading ${url}`));
    });
  });
}

// Process all markdown files
async function processMarkdownFiles() {
  const mdFiles = fs.readdirSync(PRODUCTS_DIR)
    .filter(f => f.endsWith('.md'));

  const allUrls = new Map(); // url -> local filename

  // First pass: collect all unique URLs
  for (const file of mdFiles) {
    const filePath = path.join(PRODUCTS_DIR, file);
    const content = fs.readFileSync(filePath, 'utf-8');
    const urls = extractImageUrls(content);

    for (const url of urls) {
      if (!allUrls.has(url)) {
        const filename = getLocalFilename(url);
        allUrls.set(url, filename);
      }
    }
  }

  console.log(`Found ${allUrls.size} unique images to download`);

  // Download all images
  let downloaded = 0;
  let failed = 0;

  for (const [url, filename] of allUrls) {
    const destPath = path.join(IMAGES_DIR, filename);

    // Skip if already downloaded
    if (fs.existsSync(destPath)) {
      console.log(`[SKIP] ${filename} (already exists)`);
      downloaded++;
      continue;
    }

    try {
      await downloadFile(url, destPath);
      console.log(`[OK] ${filename}`);
      downloaded++;
    } catch (err) {
      console.log(`[FAIL] ${filename}: ${err.message}`);
      failed++;
    }

    // Small delay to avoid rate limiting
    await new Promise(r => setTimeout(r, 100));
  }

  console.log(`\nDownloaded: ${downloaded}, Failed: ${failed}`);

  // Second pass: update markdown files
  console.log('\nUpdating markdown files...');

  for (const file of mdFiles) {
    const filePath = path.join(PRODUCTS_DIR, file);
    let content = fs.readFileSync(filePath, 'utf-8');
    let updated = false;

    for (const [url, filename] of allUrls) {
      const localPath = `./images/${filename}`;
      if (content.includes(url)) {
        content = content.split(url).join(localPath);
        updated = true;
      }
    }

    if (updated) {
      fs.writeFileSync(filePath, content);
      console.log(`[UPDATED] ${file}`);
    }
  }

  console.log('\nDone!');
}

processMarkdownFiles().catch(console.error);
