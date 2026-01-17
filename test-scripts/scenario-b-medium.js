/**
 * Scenario B - Medium (100 items x 250 time)
 * - Load dashboard
 * - Add 100 items × 250 → 25,000 total
 * - Filter + sort → heavy computation
 * - Refresh all 25 widgets
 * - Navigate + form submission
 * Expected: ~100-200 seconds execution
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
  console.log(`Starting Scenario B (Medium) for ${FRAMEWORK}...`);

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
  await page.setViewport({ width: 1920, height: 1080 });

  const metrics = {
    scenario: 'medium',
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

    // 2. Add 100 items × 250 = 25,000 items
    console.log('2. Adding 25,000 items (250 × 100)...');
    const addStart = Date.now();
    for (let i = 0; i < 250; i++) {
      await page.click('#add-btn');
      await page.waitForTimeout(50); // Allow time for re-render
      if (i % 50 === 0) {
        console.log(`   Progress: ${(i + 1) * 100} items added...`);
      }
    }
    const addTime = Date.now() - addStart;
    metrics.actions.push({ action: 'add_25000_items', duration: addTime, iterations: 250 });
    await page.waitForTimeout(1000);

    // 3. Filter items
    console.log('3. Filtering items...');
    const filterStart = Date.now();
    await page.click('#filter-btn');
    await page.waitForTimeout(500);
    const filterTime = Date.now() - filterStart;
    metrics.actions.push({ action: 'filter_items', duration: filterTime });

    // 4. Sort items
    console.log('4. Sorting items...');
    const sortStart = Date.now();
    await page.click('#sort-btn');
    await page.waitForTimeout(500);
    const sortTime = Date.now() - sortStart;
    metrics.actions.push({ action: 'sort_items', duration: sortTime });
    await page.waitForTimeout(500);

    // 5. Refresh all widgets
    console.log('5. Refreshing widgets...');
    const refreshStart = Date.now();
    await page.click('#refresh-widgets');
    await page.waitForTimeout(1000); // Wait for widget updates
    const refreshTime = Date.now() - refreshStart;
    metrics.actions.push({ action: 'refresh_widgets', duration: refreshTime });
    await page.waitForTimeout(500);

    // 6. Navigate to Contact
    console.log('6. Navigating to Contact...');
    const nav1Start = Date.now();
    await page.click('a[href="/contact"]');
    await page.waitForTimeout(1000); // Wait for SPA route change
    const nav1Time = Date.now() - nav1Start;
    metrics.actions.push({ action: 'navigate_to_contact', duration: nav1Time });
    await page.waitForTimeout(500);

    // 7. Fill and submit form
    console.log('7. Submitting contact form...');
    const formStart = Date.now();
    await page.type('input[name="name"]', 'Test User');
    await page.type('input[name="email"]', 'test@example.com');
    await page.type('textarea[name="message"]', 'This is a test message for energy measurement.');
    await page.click('button[type="submit"]');
    await page.waitForTimeout(500);
    const formTime = Date.now() - formStart;
    metrics.actions.push({ action: 'submit_form', duration: formTime });
    await page.waitForTimeout(500);

    // 8. Navigate back to Home
    console.log('8. Navigating back to Home...');
    const nav2Start = Date.now();
    await page.click('a[href="/"]');
    await page.waitForTimeout(1000); // Wait for SPA route change
    const nav2Time = Date.now() - nav2Start;
    metrics.actions.push({ action: 'navigate_to_home', duration: nav2Time });

    const totalTime = Date.now() - startTime;
    metrics.totalDuration = totalTime;
    metrics.actions.push({ action: 'total', duration: totalTime });

    console.log(`Scenario B completed in ${totalTime}ms`);

  } catch (error) {
    console.error('Error during scenario execution:', error);
    metrics.error = error.message;
  } finally {
    await browser.close();
  }

  const outputFile = path.join(OUTPUT_DIR, 'medium.json');
  fs.appendFileSync(outputFile, JSON.stringify(metrics) + '\n');
  console.log(`Metrics saved to ${outputFile}`);
}

runScenario().catch(console.error);
