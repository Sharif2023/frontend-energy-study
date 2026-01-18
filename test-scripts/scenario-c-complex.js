/**
 * Scenario C - Complex (100 items x 500 time)
 * - Load dashboard
 * - Add 100 items × 500 → 50,000 total
 * - Filter + sort + multiple widget updates
 * - Rapid navigation (3 pages × 2)
 * Expected: ~300-600 seconds execution
 */

const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

const FRAMEWORK = process.argv[2] || 'react';
const PORT = process.argv[3] || '3000';
const OUTPUT_DIR = path.join(__dirname, '..', 'measurements', FRAMEWORK);

if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

async function runScenario() {
  console.log(`Starting Scenario C (Complex) for ${FRAMEWORK}...`);

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
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-web-security', '--disable-features=IsolateOrigins,site-per-process']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1920, height: 1080 });

  const metrics = {
    scenario: 'complex',
    framework: FRAMEWORK,
    timestamp: new Date().toISOString(),
    actions: []
  };

  try {
    // 1. Load dashboard
    console.log('1. Loading dashboard...');
    const startTime = Date.now();
    await page.goto(`http://localhost:${PORT}`, { waitUntil: 'networkidle2' });
    metrics.actions.push({ action: 'load_dashboard', duration: Date.now() - startTime });
    await page.waitForTimeout(1000);

    // 2. Add 100 items × 500 = 50,000 items (human-like speed)
    console.log('2. Adding 50,000 items (500 × 100) at human-like speed...');
    const addStart = Date.now();
    for (let i = 0; i < 500; i++) {
      await page.click('#add-btn');
      if (i % 50 === 0) {
        await page.waitForTimeout(500); // Longer pause every 50 clicks (like human resting)
        console.log(`   Progress: ${(i + 1) * 100} items added...`);
      } else {
        await page.waitForTimeout(300); // Human-like delay between clicks
      }
    }
    const addTime = Date.now() - addStart;
    metrics.actions.push({ action: 'add_50000_items', duration: addTime, iterations: 500 });
    await page.waitForTimeout(2000); // Human pause before next action

    // 3. Filter items
    console.log('3. Filtering items...');
    const filterStart = Date.now();
    await page.click('#filter-btn');
    await page.waitForTimeout(1000); // Heavy computation
    const filterTime = Date.now() - filterStart;
    metrics.actions.push({ action: 'filter_items', duration: filterTime });

    // 4. Sort items
    console.log('4. Sorting items...');
    const sortStart = Date.now();
    await page.click('#sort-btn');
    await page.waitForTimeout(1000); // Heavy computation
    const sortTime = Date.now() - sortStart;
    metrics.actions.push({ action: 'sort_items', duration: sortTime });
    await page.waitForTimeout(500);

    // 5. Refresh widgets multiple times
    console.log('5. Refreshing widgets (3x)...');
    const refreshStart = Date.now();
    for (let i = 0; i < 3; i++) {
      await page.click('#refresh-widgets');
      await page.waitForTimeout(500);
    }
    const refreshTime = Date.now() - refreshStart;
    metrics.actions.push({ action: 'refresh_widgets_multiple', duration: refreshTime, iterations: 3 });
    await page.waitForTimeout(500);

    // 6. Rapid navigation: Home → About → Contact → About → Home
    console.log('6. Rapid navigation (5 page transitions)...');
    const navStart = Date.now();

    await page.click('a[href="/about"]');
    await page.waitForTimeout(500); // Wait for SPA route change

    await page.click('a[href="/contact"]');
    await page.waitForTimeout(500); // Wait for SPA route change

    await page.click('a[href="/about"]');
    await page.waitForTimeout(500); // Wait for SPA route change

    await page.click('a[href="/"]');
    await page.waitForTimeout(500); // Wait for SPA route change

    await page.click('a[href="/contact"]');
    await page.waitForTimeout(500); // Wait for SPA route change

    const navTime = Date.now() - navStart;
    metrics.actions.push({ action: 'rapid_navigation', duration: navTime, transitions: 5 });

    const totalTime = Date.now() - startTime;
    metrics.totalDuration = totalTime;
    metrics.actions.push({ action: 'total', duration: totalTime });

    console.log(`Scenario C completed in ${totalTime}ms`);

  } catch (error) {
    console.error('Error during scenario execution:', error);
    metrics.error = error.message;
  } finally {
    await browser.close();
  }

  const outputFile = path.join(OUTPUT_DIR, 'complex.json');
  fs.appendFileSync(outputFile, JSON.stringify(metrics) + '\n');
  console.log(`Metrics saved to ${outputFile}`);
}

runScenario().catch(console.error);
