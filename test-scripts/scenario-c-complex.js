/**
 * Scenario C - Complex (5,000 items)
 * - Load dashboard
 * - Add 100 items × 50 → 5,000 total
 * - Filter + sort + multiple widget updates
 * - Rapid navigation (3 pages × 2)
 * Expected: ~30-60 seconds execution
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
  
  const browser = await puppeteer.launch({
    headless: false,
    args: ['--disable-web-security', '--disable-features=IsolateOrigins,site-per-process']
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
    
    // 2. Add 100 items × 50 = 5,000 items
    console.log('2. Adding 5,000 items (50 × 100)...');
    const addStart = Date.now();
    for (let i = 0; i < 50; i++) {
      await page.click('#add-btn');
      if (i % 10 === 0) {
        await page.waitForTimeout(100); // Periodic pause for stability
      } else {
        await page.waitForTimeout(50);
      }
    }
    const addTime = Date.now() - addStart;
    metrics.actions.push({ action: 'add_5000_items', duration: addTime, iterations: 50 });
    await page.waitForTimeout(1000);
    
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
    await page.waitForNavigation({ waitUntil: 'networkidle2' });
    await page.waitForTimeout(200);
    
    await page.click('a[href="/contact"]');
    await page.waitForNavigation({ waitUntil: 'networkidle2' });
    await page.waitForTimeout(200);
    
    await page.click('a[href="/about"]');
    await page.waitForNavigation({ waitUntil: 'networkidle2' });
    await page.waitForTimeout(200);
    
    await page.click('a[href="/"]');
    await page.waitForNavigation({ waitUntil: 'networkidle2' });
    await page.waitForTimeout(200);
    
    await page.click('a[href="/contact"]');
    await page.waitForNavigation({ waitUntil: 'networkidle2' });
    
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
