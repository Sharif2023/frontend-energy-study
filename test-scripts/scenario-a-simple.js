/**
 * Scenario A - Simple (100 items x 50 time)
 * - Load dashboard
 * - Add 100 items x 50 time → 5,000 total items triggers re-render
 * - Filter items → DOM mutations
 * - Navigate between 3 pages
 * Expected: ~20-50 seconds execution
 */

const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

const FRAMEWORK = process.argv[2] || 'react';
const PORT = process.argv[3] || '3000';
const OUTPUT_DIR = path.join(__dirname, '..', 'measurements', FRAMEWORK);

// Ensure output directory exists
if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

async function runScenario() {
  console.log(`Starting Scenario A (Simple) for ${FRAMEWORK}...`);

  // Try to find Chrome on Windows
  const chromePaths = [
    'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
    'C:\\Users\\Admin\\AppData\\Local\\Google\\Chrome\\Application\\chrome.exe'
  ];
  let executablePath = null;
  for (const chromePath of chromePaths) {
    if (fs.existsSync(chromePath)) {
      executablePath = chromePath;
      break;
    }
  }

  const browser = await puppeteer.launch({
    headless: false,
    executablePath: executablePath,
    args: ['--disable-web-security', '--disable-features=IsolateOrigins,site-per-process']
  });

  const page = await browser.newPage();

  // Enable performance monitoring
  await page.setViewport({ width: 1920, height: 1080 });

  // Collect performance metrics
  const metrics = {
    scenario: 'simple',
    framework: FRAMEWORK,
    timestamp: new Date().toISOString(),
    actions: []
  };

  try {
    // 1. Load dashboard
    console.log('1. Loading dashboard...');
    const startTime = Date.now();
    await page.goto(`http://localhost:${PORT}`, { waitUntil: 'networkidle2' });
    const loadTime = Date.now() - startTime;
    metrics.actions.push({ action: 'load_dashboard', duration: loadTime });
    await page.waitForTimeout(1000);

    // 2. Add 100 items × 50 times = 1,000 items
    console.log('2. Adding 1,000 items (50 × 100)...');
    const addStart = Date.now();
    for (let i = 0; i < 50; i++) {
      await page.click('#add-btn');
      await page.waitForTimeout(100); // Wait for render
      if (i % 10 === 0) {
        console.log(`   Progress: ${(i + 1) * 100} items added...`);
      }
    }
    const addTime = Date.now() - addStart;
    metrics.actions.push({ action: 'add_1000_items', duration: addTime, iterations: 50 });
    await page.waitForTimeout(500);

    // 3. Filter items
    console.log('3. Filtering items...');
    const filterStart = Date.now();
    await page.click('#filter-btn');
    await page.waitForTimeout(500); // Wait for DOM mutations
    const filterTime = Date.now() - filterStart;
    metrics.actions.push({ action: 'filter_items', duration: filterTime });
    await page.waitForTimeout(500);

    // 4. Navigate to About
    console.log('4. Navigating to About...');
    const nav1Start = Date.now();
    await page.click('a[href="/about"]');
    await page.waitForTimeout(1000); // Wait for SPA route change
    const nav1Time = Date.now() - nav1Start;
    metrics.actions.push({ action: 'navigate_to_about', duration: nav1Time });
    await page.waitForTimeout(500);

    // 5. Navigate to Contact
    console.log('5. Navigating to Contact...');
    const nav2Start = Date.now();
    await page.click('a[href="/contact"]');
    await page.waitForTimeout(1000); // Wait for SPA route change
    const nav2Time = Date.now() - nav2Start;
    metrics.actions.push({ action: 'navigate_to_contact', duration: nav2Time });
    await page.waitForTimeout(500);

    // 6. Navigate back to Home
    console.log('6. Navigating back to Home...');
    const nav3Start = Date.now();
    await page.click('a[href="/"]');
    await page.waitForTimeout(1000); // Wait for SPA route change
    const nav3Time = Date.now() - nav3Start;
    metrics.actions.push({ action: 'navigate_to_home', duration: nav3Time });

    const totalTime = Date.now() - startTime;
    metrics.totalDuration = totalTime;
    metrics.actions.push({ action: 'total', duration: totalTime });

    console.log(`Scenario A completed in ${totalTime}ms`);

  } catch (error) {
    console.error('Error during scenario execution:', error);
    metrics.error = error.message;
  } finally {
    await browser.close();
  }

  // Save metrics
  const outputFile = path.join(OUTPUT_DIR, 'simple.json');
  fs.appendFileSync(outputFile, JSON.stringify(metrics) + '\n');
  console.log(`Metrics saved to ${outputFile}`);
}

runScenario().catch(console.error);
