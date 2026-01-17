# Frontend Energy Data Collection - Complete Workflow Document

**Date:** January 11, 2026  
**Frameworks:** React, Vue  
**Researcher:** Student  

---

## Table of Contents
1. [Environment Setup](#1-environment-setup)
2. [Initial Troubleshooting](#2-initial-troubleshooting)
3. [Test Scenario Configuration](#3-test-scenario-configuration)
4. [Data Collection Procedure](#4-data-collection-procedure)
5. [Final Results (React)](#5-final-results-react)
6. [Final Results (Vue)](#6-final-results-vue)
7. [Files Generated](#7-files-generated)
8. [Research Paper Integration](#8-research-paper-integration)
9. [Notes for Future Runs](#9-notes-for-future-runs)
10. [Commands Quick Reference](#10-commands-quick-reference)

---

## 1. Environment Setup

### 1.1 System Requirements
- **OS:** Ubuntu 22.04 LTS
- **Node.js:** v18.20.8 (upgraded from v12.22.9)
- **Energy Tool:** Scaphandre v0.5.0
- **Browser Automation:** Puppeteer with Chromium 121.0.6167.85

### 1.2 Node.js Upgrade
The original Node.js v12 caused compatibility issues with `react-scripts 5.0.1`. Error encountered:
```
Error: Cannot find module 'node:path'
```

**Solution:** Installed nvm and upgraded to Node.js v18:
```bash
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
nvm install 18
```

### 1.3 Dependencies Reinstallation
After Node.js upgrade, reinstalled all framework dependencies:
```bash
cd apps/react && rm -rf node_modules package-lock.json && npm install
cd apps/vue && rm -rf node_modules package-lock.json && npm install
```

### 1.4 Puppeteer Chrome Installation
```bash
cd test-scripts
node node_modules/puppeteer/install.mjs
```
Chrome installed to: `/home/student/.cache/puppeteer/chrome/linux-121.0.6167.85`

---

## 2. Initial Troubleshooting

### 2.1 SPA Navigation Issue
Test scripts used `waitForNavigation()` which doesn't work with React's client-side routing.

**Error:**
```
TimeoutError: Navigation timeout of 30000 ms exceeded
```

**Fix Applied to All Scenario Scripts:**
```javascript
// Before (broken):
await page.click('a[href="/about"]');
await page.waitForNavigation({ waitUntil: 'networkidle2' });

// After (fixed):
await page.click('a[href="/about"]');
await page.waitForTimeout(1000); // Wait for SPA route change
```

Files modified:
- `test-scripts/scenario-a-simple.js`
- `test-scripts/scenario-b-medium.js`
- `test-scripts/scenario-c-complex.js`

### 2.2 Test Scenario Specification Correction
Original scripts did NOT match README.md specifications:

| Scenario | README Spec | Original Script | Fixed Script |
|----------|-------------|-----------------|--------------|
| Simple | 100 × 50 = 1,000 | 100 × 1 = 100 | 100 × 50 = 1,000 ✓ |
| Medium | 100 × 250 = 25,000 | 100 × 10 = 1,000 | 100 × 250 = 25,000 ✓ |
| Complex | 100 × 500 = 50,000 | 100 × 50 = 5,000 | 100 × 500 = 50,000 ✓ |

---

## 3. Test Scenario Configuration

### 3.1 Scenario A - Simple (1,000 items)
**Actions:**
1. Load dashboard
2. Add 100 items × 50 times = 1,000 items
3. Filter items
4. Navigate: Home → About → Contact → Home

**Expected Duration:** 20-50 seconds  
**Scaphandre Timing:** 60 seconds

### 3.2 Scenario B - Medium (25,000 items)
**Actions:**
1. Load dashboard
2. Add 100 items × 250 times = 25,000 items
3. Filter items
4. Sort items
5. Refresh all 25 widgets
6. Navigate to Contact + submit form
7. Navigate back to Home

**Expected Duration:** 100-200 seconds  
**Scaphandre Timing:** 240 seconds

### 3.3 Scenario C - Complex (50,000 items)
**Actions:**
1. Load dashboard
2. Add 100 items × 500 times = 50,000 items (human-like 300ms delays)
3. Filter items (heavy computation)
4. Sort items (heavy computation)
5. Refresh widgets 3 times
6. Rapid navigation: Home → About → Contact → About → Home → Contact

**Expected Duration:** 300-600 seconds  
**Scaphandre Timing:** 660 seconds

**Human-Like Timing Applied:**
```javascript
for (let i = 0; i < 500; i++) {
  await page.click('#add-btn');
  if (i % 50 === 0) {
    await page.waitForTimeout(500); // Rest pause every 50 clicks
  } else {
    await page.waitForTimeout(300); // Human-like delay
  }
}
```

---

## 4. Data Collection Procedure

### 4.1 Pre-Collection Checklist
- [ ] React app running on http://localhost:3000
- [ ] Close unnecessary applications
- [ ] Verify Scaphandre is installed (`scaphandre --version`)
- [ ] Verify Puppeteer Chrome is installed

### 4.2 Step-by-Step Process

**Terminal 1: Start React App**
```bash
cd apps/react
npm start
# Wait for "Compiled successfully!"
```

**Terminal 2: Start Energy Monitoring**
```bash
cd ~/Downloads/frontend-energy-study
sudo scaphandre json -t [TIME] -f measurements/react/energy_[scenario]_run1.json &
```

**Terminal 3: Run Test Scenario**
```bash
cd test-scripts
export NVM_DIR="$HOME/.nvm" && [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
node scenario-[a|b|c]-[simple|medium|complex].js react 3000
```

### 4.3 Cooldown Protocol
Between each scenario:
1. Stop React app (Ctrl+C)
2. Close browser tabs
3. Wait **10 minutes** for CPU temperature stabilization
4. Restart React app before next scenario

### 4.4 Data Merge Process
After all scenarios complete:
```bash
python3 analysis/merge_energy_data.py
```

This script:
1. Parses Scaphandre JSON files
2. Calculates total energy in Joules
3. Merges with performance metrics
4. Outputs `*_merged.json` files

---

## 5. Final Results (React)

### 5.1 React Framework Energy Data

| Scenario | Energy (J) | Duration (ms) | Peak Power (W) | Items |
|----------|-----------|---------------|----------------|-------|
| **Simple** | 120.83 | 15,595 | 12.95 | 1,000 |
| **Medium** | 860.72 | 64,809 | 26.30 | 25,000 |
| **Complex** | 2,530.30 | 323,038 | 24.12 | 50,000 |

### 5.2 Performance Breakdown

**Scenario A - Simple:**
| Action | Duration (ms) |
|--------|---------------|
| Load Dashboard | 726 |
| Add 1,000 Items | 8,141 |
| Filter Items | 589 |
| Navigate to About | 1,058 |
| Navigate to Contact | 1,032 |
| Navigate to Home | 1,041 |

**Scenario B - Medium:**
| Action | Duration (ms) |
|--------|---------------|
| Load Dashboard | 736 |
| Add 25,000 Items | 54,058 |
| Filter Items | 798 |
| Sort Items | 1,125 |
| Refresh Widgets | 1,292 |
| Navigate to Contact | 1,110 |
| Submit Form | 658 |
| Navigate to Home | 1,023 |

**Scenario C - Complex:**
| Action | Duration (ms) |
|--------|---------------|
| Load Dashboard | 733 |
| Add 50,000 Items | 308,570 |
| Filter Items | 1,677 |
| Sort Items | 1,869 |
| Refresh Widgets (3x) | 3,372 |
| Rapid Navigation (5x) | 2,811 |

---

## 6. Final Results (Vue)

### 6.1 Vue Framework Energy Data

| Scenario | Energy (J) | Duration (ms) | Peak Power (W) | Items |
|----------|-----------|---------------|----------------|-------|
| **Simple** | 132.63 | 14,034 | 13.53 | 1,000 |
| **Medium** | 153.34 | 48,468 | 10.13 | 25,000 |
| **Complex** | 1,326.65 | 210,346 | 22.15 | 50,000 |

### 6.2 Performance Breakdown

**Scenario A - Simple:**
1,000 items added in ~7s. Total ~14s.

**Scenario B - Medium:**
25,000 items added in ~38s. Total ~48s.

**Scenario C - Complex:**
50,000 items added with human-like delays (300ms). Total ~210s.

### 6.3 Challenges & Fixes
- **Scaphandre Timeouts:** Complex scenario required `-t 1200` (20 mins) due to Scaphandre stopped early issues with shorter timeouts. Run 5 was the successful attempt.
- **Sudo Access:** Required for RAPL reading. Commands run with `sudo`.
- **Process Management:** Used `nohup` for stability in long-running Complex scenario tests.

---

## 7. Files Generated

### 7.1 Energy Data Files (Scaphandre Raw)
```
measurements/react/
├── energy_simple_run1.json   (140 KB)
├── energy_medium_run1.json   (568 KB)
└── energy_complex_run1.json  (748 KB)
```

### 7.2 Performance Metrics Files
```
measurements/react/
├── simple.json    (Performance only)
├── medium.json    (Performance only)
└── complex.json   (Performance only)
```

### 7.3 Merged Data Files (Final Output)
```
measurements/react/
├── simple_merged.json   (Energy + Performance)
├── medium_merged.json   (Energy + Performance)
└── complex_merged.json  (Energy + Performance)
```

### 7.4 Scripts Modified
```
test-scripts/
├── scenario-a-simple.js  (SPA fix + 50 iterations)
├── scenario-b-medium.js  (SPA fix + 250 iterations)
└── scenario-c-complex.js (SPA fix + 500 iterations + human timing)

analysis/
└── merge_energy_data.py  (Created for automated merging)
```


### 7.5 Vue Data Files
```
measurements/vue/
├── energy_simple_run1.json
├── energy_medium_run1.json
├── energy_complex_run5.json (Definitive Run)
├── simple_merged.json
├── medium_merged.json
└── complex_merged.json
└── vue_complete_summary.json
```

---

## 8. Research Paper Integration

### 8.1 How to Add Data to Manuscript
To incorporate these findings into `docs/manuscript.tex`:

1. **Extract Statistics:**
   - Use `vue_complete_summary.json` and `react_complete_summary.json` (if exists) or the Tables in Section 5 & 6.
   - Key metrics: Total Energy (J), Duration (ms), Normalized Energy (J/item).

2. **Generate LaTeX Tables:**
   - Use the Python script `analysis/generate_latex_table.py` (to be created) to read the `_merged.json` files and output LaTeX code.
   - Example Table Format:
     ```latex
     \begin{table}[h]
     \centering
     \begin{tabular}{|l|c|c|c|}
     \hline
     Framework & Scenario & Energy (J) & Time (s) \\
     \hline
     React & Simple & 120.83 & 15.60 \\
     Vue & Simple & 132.63 & 14.03 \\
     ...
     \hline
     \end{tabular}
     \caption{Energy Consumption Comparison}
     \end{table}
     ```

3. **Update Manuscript:**
   - Open `docs/manuscript.tex`.
   - Paste the generated tables into the Results section.
   - Write analysis comparing React vs Vue (e.g., "Vue consumed 10% more energy in Simple scenario...").

---

## 9. Notes for Future Runs

1. **For statistical validity:** Repeat each scenario 10 times (currently 1 run each)
2. **Cooldown is critical:** 10-minute wait between runs
3. **Human-like timing:** Use 300ms delays for realistic measurements
4. **Merge script:** Run `python3 analysis/merge_energy_data.py` after each batch

---

## 10. Commands Quick Reference

```bash
# Start React app
cd apps/react && npm start

# Run Simple scenario
sudo scaphandre json -t 60 -f measurements/react/energy_simple_run1.json &
node test-scripts/scenario-a-simple.js react 3000

# Run Medium scenario
sudo scaphandre json -t 240 -f measurements/react/energy_medium_run1.json &
node test-scripts/scenario-b-medium.js react 3000

# Run Complex scenario
sudo scaphandre json -t 660 -f measurements/react/energy_complex_run1.json &
node test-scripts/scenario-c-complex.js react 3000

# Merge all data
python3 analysis/merge_energy_data.py
```

---

**Document Created:** January 11, 2026, 16:17  
**React Data Collection Status:** ✅ Complete
