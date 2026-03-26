/**
 * Asset Downloader for finethought.com.au clone
 * Uses actual filenames extracted from __NEXT_DATA__
 *
 * Usage: node scripts/download-assets.mjs
 */

import { createWriteStream, mkdirSync, existsSync } from 'fs';
import { pipeline } from 'stream/promises';
import path from 'path';

const MEDIA_BASE = 'https://media.finethought.com.au/media/';
const SITE_BASE = 'https://finethought.com.au/';
const PUBLIC_DIR = path.join(process.cwd(), 'public');
const IMAGES_DIR = path.join(PUBLIC_DIR, 'images');
const VIDEOS_DIR = path.join(PUBLIC_DIR, 'videos');
const SEO_DIR = path.join(PUBLIC_DIR, 'seo');

[IMAGES_DIR, VIDEOS_DIR, SEO_DIR].forEach(dir => {
  if (!existsSync(dir)) mkdirSync(dir, { recursive: true });
});

// Actual filenames from __NEXT_DATA__
const imageFiles = [
  // Arthur G
  'ArthurG-Home-Loop-1280x720.jpg',
  'ArthurG-Home-Loop-1920x1080.jpg',
  // Assembly Talent
  'Home-Assembly-Talent-1280x720.jpg',
  'Home-Assembly-Talent-1920x1080.jpg',
  // Black Fridye
  'Splash-Black-Fridye-1280x720.jpg',
  'Splash-Black-Fridye-1920x1080.jpg',
  // Bloomingdales
  'bloomingdales-home-1280x720.jpg',
  'bloomingdales-home-1920x1080.jpg',
  // Junglefy
  'Home-Loop-Junglefy-1-1280x720.jpg',
  'Home-Loop-Junglefy-1-1920x1080.jpg',
  // Kuwaii
  'Home-Kuwaii-1280x720.jpg',
  'Home-Kuwaii-1920x1080.jpg',
  // More Air
  'More-Air-Home-Loop-1280x720.jpg',
  'More-Air-Home-Loop-1920x1080.jpg',
  // Provider Store
  'Home-Provider-Store-1280x720.jpg',
  'Home-Provider-Store-1920x1080.jpg',
  // Stanislava Pinchuk
  'Home-Stanislava-Pinchuk-1280x720.jpg',
  'Home-Stanislava-Pinchuk-1920x1080.jpg',
  // Studio Massive
  'Home-Studio-Massive-1280x720.jpg',
  'Home-Studio-Massive-1920x1080.jpg',
  // The Gallery
  'Home-The-Gallery-1280x720.jpg',
  'Home-The-Gallery-1920x1080.jpg',
];

const videoFiles = [
  'ArthurG-Home-Loop-480.mp4',
  'ArthurG-Home-Loop-720.mp4',
  'Arthur-G-hover-video.mp4',
  'Splash-Black-Fridye-720.mp4',
  'Home-Loop-Junglefy-480-2.mp4',
  'More-Air-Home-Loop-480.mp4',
];

const faviconFiles = [
  'android-icon-192x192.png',
  'apple-icon-57x57.png',
  'apple-icon-60x60.png',
  'apple-icon-72x72.png',
  'apple-icon-76x76.png',
  'apple-icon-114x114.png',
  'apple-icon-120x120.png',
  'apple-icon-144x144.png',
  'apple-icon-152x152.png',
  'apple-icon-180x180.png',
  'favicon-16x16.png',
  'favicon-32x32.png',
  'favicon-96x96.png',
  'ms-icon-144x144.png',
  'manifest.json',
];

async function downloadFile(url, destPath) {
  if (existsSync(destPath)) {
    console.log(`  [skip] ${path.basename(destPath)}`);
    return;
  }
  try {
    const res = await fetch(url);
    if (!res.ok) {
      console.error(`  [fail] ${path.basename(destPath)} → ${res.status}`);
      return;
    }
    const out = createWriteStream(destPath);
    await pipeline(res.body, out);
    console.log(`  [ok]   ${path.basename(destPath)}`);
  } catch (err) {
    console.error(`  [err]  ${path.basename(destPath)}: ${err.message}`);
  }
}

async function downloadBatch(tasks, batchSize = 4) {
  for (let i = 0; i < tasks.length; i += batchSize) {
    const batch = tasks.slice(i, i + batchSize);
    await Promise.all(batch.map(([url, dest]) => downloadFile(url, dest)));
  }
}

async function main() {
  const imageTasks = imageFiles.map(f => [MEDIA_BASE + f, path.join(IMAGES_DIR, f)]);
  const videoTasks = videoFiles.map(f => [MEDIA_BASE + f, path.join(VIDEOS_DIR, f)]);
  const faviconTasks = faviconFiles.map(f => [`${SITE_BASE}icons/${f}`, path.join(SEO_DIR, f)]);

  console.log(`\nDownloading ${imageTasks.length} images...`);
  await downloadBatch(imageTasks);

  console.log(`\nDownloading ${videoTasks.length} videos...`);
  await downloadBatch(videoTasks, 2);

  console.log(`\nDownloading ${faviconTasks.length} favicons...`);
  await downloadBatch(faviconTasks);

  console.log('\nDone!');
}

main().catch(console.error);
