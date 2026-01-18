# Ubuntu 22.04 Run & Data Collection Guide

This guide details how to set up the environment, run the framework applications, and collect energy data for your green computing research on Ubuntu 22.04 LTS.

## 1. Prerequisites Setup

### System Update
First, ensure your system is up to date:
```bash
sudo apt update && sudo apt upgrade -y
```

### Install Node.js 18.16.0 LTS
The project requires Node.js v18. We recommend using `nvm` (Node Version Manager) or installing directly.

**Option A: Using curl (Recommended)**
```bash
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs
node -v  # Should output v18.x.x
```

### Install Scaphandre (Energy Monitoring Tool)
For Ubuntu, we use [Scaphandre](https://github.com/hubblo-org/scaphandre) to measure power consumption.

```bash
# Download the latest Debian package
wget https://github.com/hubblo-org/scaphandre/releases/download/v1.0.2/scaphandre_v1.0.2-deb11_amd64.deb

# Install
sudo dpkg -i scaphandre_v1.0.2-deb11_amd64.deb

# If there are unmet dependencies, fix them by running:
sudo apt-get install -f
```

### Fix: `scaphandre: libssl.so.1.1 not found` on Ubuntu 22.04 / 24.04 (If needed)

This guide explains how to fix the following error when running **Scaphandre** on modern Ubuntu systems:

**Step 1 — Add temporary focal-security repo**
```bash
echo "deb http://security.ubuntu.com/ubuntu focal-security main" | sudo tee /etc/apt/sources.list.d/temp-libssl.list
```

**Step 2 — Update package lists**
```bash
sudo apt update
```

**Step 3 — Install libssl1.1**
```bash
sudo apt install libssl1.1
```

**Step 4 — Remove the temporary repo file**
```bash
sudo rm /etc/apt/sources.list.d/temp-libssl.list
sudo apt update
```

**Step 5 — Verify installation**
```bash
scaphandre --version
```

### Install Python & Analysis Libraries
For running the analysis scripts:
```bash
sudo apt install -y python3-pip python3-venv

# Set up a virtual environment (optional but recommended)
python3 -m venv venv
source venv/bin/activate

# Install requirements
pip install pandas numpy matplotlib seaborn scipy jupyter notebook
```

---

## 2. Project Setup

Navigate to your project directory and install dependencies for all frameworks and scripts.

```bash
cd frontend-energy-study

# 1. Install React dependencies
cd apps/react
npm install

# 2. Install Vue dependencies
cd ../vue
npm install

# 3. Install Angular dependencies
cd ../angular
npm install

# 4. Install Svelte dependencies
cd ../svelte
npm install

# 5. Install Test Script dependencies (Puppeteer)
cd ../../test-scripts
npm install

# 6. Create measurements directories
cd ..
mkdir -p measurements/{react,vue,angular,svelte}
```

---

## 3. Test Scenarios Overview

Based on the research methodology, there are **3 test scenarios** with increasing complexity:

| Scenario | Description | Items Added | Expected Duration |
|----------|-------------|-------------|-------------------|
| **A - Simple** | 100 items × 50 times | 5,000 total | ~20-50 seconds |
| **B - Medium** | 100 items × 250 times | 25,000 total | ~100-200 seconds |
| **C - Complex** | 100 items × 500 times | 50,000 total | ~300-600 seconds |

### What Each Scenario Tests:

**Scenario A - Simple (100 items × 50 time)**
- Load dashboard
- Add 5,000 items (triggers re-render)
- Filter items (DOM mutations)
- Navigate between 3 pages

**Scenario B - Medium (100 items × 250 time)**
- Load dashboard
- Add 25,000 items
- Filter + sort (heavy computation)
- Refresh all 25 widgets
- Navigate + form submission

**Scenario C - Complex (100 items × 500 time)**
- Load dashboard
- Add 50,000 items
- Filter + sort + multiple widget updates
- Rapid navigation (3 pages × 2)

---

## 4. Running Experiments & Collecting Data

### Overview: Data Collection Workflow

```
┌─────────────────────────────────────────────────────────────┐
│ 1. Start Framework App → 2. Start Scaphandre Monitor       │
│ 3. Run Test Scenario → 4. Stop Monitoring → 5. Merge Data  │
└─────────────────────────────────────────────────────────────┘
```

**Important Notes:**
- Each framework should be tested with all 3 scenarios (Simple, Medium, Complex)
- Repeat each test **5 times** for statistical validity (15 total runs)
- Allow **10-minute cooldown** between runs to stabilize system temperature
- Close unnecessary applications to minimize interference

---

### Step-by-Step Data Collection Process

#### Step 1: Start the Framework Application

Open **Terminal 1** and start the framework you want to test.

| Framework | Command | Wait for | URL |
|-----------|---------|----------|-----|
| React | `cd apps/react && npm start` | "Compiled successfully!" | http://localhost:3000 |
| Vue | `cd apps/vue && npm run serve` | "DONE Compiled successfully" | http://localhost:8080 |
| Angular | `cd apps/angular && npm start` | Compilation complete | http://localhost:4200 |
| Svelte | `cd apps/svelte && npm run dev` | "ready in..." | http://localhost:5173 |

**Example for React:**
```bash
cd ~/Downloads/frontend-energy-study/apps/react
npm start
# Wait for "Compiled successfully!" message
# App runs on http://localhost:3000
```

✅ **Verify:** Open the URL in your browser to confirm the app is running.

---

#### Step 2: Prepare Scaphandre Energy Monitoring

Open **Terminal 2** for energy monitoring. 

**Choose duration based on scenario (with ~20% buffer):**

| Scenario | Expected Duration | Scaphandre Duration |
|----------|-------------------|---------------------|
| A - Simple | 20-50 seconds | `-t 20` (20 seconds) |
| B - Medium | 100-200 seconds | `-t 60` (60 seconds) |
| C - Complex | 300-600 seconds | `-t 100` (100 seconds) |

**Prepare the command (DO NOT RUN YET):**
```bash
cd ~/Downloads/frontend-energy-study
sudo scaphandre json -t 20 -f measurements/react/energy_simple_run1.json
```

**File naming convention:**
```
measurements/{framework}/energy_{scenario}_run{number}.json

Examples:
- measurements/react/energy_simple_run1.json
- measurements/vue/energy_medium_run2.json
- measurements/angular/energy_complex_run5.json
```

⚠️ **Do NOT start this command yet!** Wait until you're ready to run the test scenario.

---

#### Step 3: Run the Test Scenario

Open **Terminal 3** for running automated test scripts.

```bash
cd ~/Downloads/frontend-energy-study/test-scripts
```

**🚨 CRITICAL: Execute steps 2 and 3 simultaneously:**

1. In **Terminal 2**: Press Enter to start Scaphandre monitoring
2. **Immediately** switch to **Terminal 3** and run the test script

---

### Complete Commands for All Frameworks & Scenarios

#### Scenario A - Simple (100 items × 50 time)

| Framework | Terminal 1 (App) | Terminal 2 (Energy) | Terminal 3 (Test) |
|-----------|------------------|---------------------|-------------------|
| React | `cd apps/react && npm start` | `sudo scaphandre json -t 20 -f measurements/react/energy_simple_run1.json` | `node scenario-a-simple.js react 3000` |
| Vue | `cd apps/vue && npm run serve` | `sudo scaphandre json -t 20 -f measurements/vue/energy_simple_run1.json` | `node scenario-a-simple.js vue 8080` |
| Angular | `cd apps/angular && npm start` | `sudo scaphandre json -t 20 -f measurements/angular/energy_simple_run1.json` | `node scenario-a-simple.js angular 4200` |
| Svelte | `cd apps/svelte && npm run dev` | `sudo scaphandre json -t 20 -f measurements/svelte/energy_simple_run1.json` | `node scenario-a-simple.js svelte 5173` |

#### Scenario B - Medium (100 items × 250 time)

| Framework | Terminal 2 (Energy) | Terminal 3 (Test) |
|-----------|---------------------|-------------------|
| React | `sudo scaphandre json -t 60 -f measurements/react/energy_medium_run1.json` | `node scenario-b-medium.js react 3000` |
| Vue | `sudo scaphandre json -t 60 -f measurements/vue/energy_medium_run1.json` | `node scenario-b-medium.js vue 8080` |
| Angular | `sudo scaphandre json -t 60 -f measurements/angular/energy_medium_run1.json` | `node scenario-b-medium.js angular 4200` |
| Svelte | `sudo scaphandre json -t 60 -f measurements/svelte/energy_medium_run1.json` | `node scenario-b-medium.js svelte 5173` |

#### Scenario C - Complex (100 items × 500 time)

| Framework | Terminal 2 (Energy) | Terminal 3 (Test) |
|-----------|---------------------|-------------------|
| React | `sudo scaphandre json -t 100 -f measurements/react/energy_complex_run1.json` | `node scenario-c-complex.js react 3000` |
| Vue | `sudo scaphandre json -t 100 -f measurements/vue/energy_complex_run1.json` | `node scenario-c-complex.js vue 8080` |
| Angular | `sudo scaphandre json -t 100 -f measurements/angular/energy_complex_run1.json` | `node scenario-c-complex.js angular 4200` |
| Svelte | `sudo scaphandre json -t 100 -f measurements/svelte/energy_complex_run1.json` | `node scenario-c-complex.js svelte 5173` |

---

#### Step 4: Wait for Completion

Switch back to both terminals and wait for both to complete.

**Expected output from Test Script (Terminal 3):**
```
Starting Scenario A (Simple) for react...
1. Loading dashboard...
2. Adding 5,000 items (50 × 100)...
   Progress: 1000 items added...
   Progress: 2000 items added...
   ...
3. Filtering items...
4. Navigating to About...
5. Navigating to Contact...
6. Navigating back to Home...
Scenario A completed in 28456ms
Metrics saved to ../measurements/react/simple.json
```

**Expected output from Scaphandre (Terminal 2):**
```
scaphandre::sensors: Sysinfo sees 20
Scaphandre json exporter
Sending ⚡ metrics
scaphandre::sensors: Not enough records for socket
```

> ℹ️ The "Not enough records for socket" message is normal—the tool still collects data successfully.

**Verify files were created:**
```bash
ls -lh measurements/react/
# Should show:
# energy_simple_run1.json (energy data from Scaphandre)
# simple.json (performance metrics from test script)
```

---

#### Step 5: Calculate & Merge Energy Data

The test script creates `simple.json` with performance metrics, but you need to calculate energy from Scaphandre's output.

**Quick Energy Calculation:**
```bash
# Install jq if not available
sudo apt install jq

# Calculate total energy (in microjoules)
cat measurements/react/energy_simple_run1.json | jq '[.[].host.consumption] | add'

# Example output: 45234567.0 (this is in microjoules)
# Convert to Joules: 45234567.0 / 1000000 = 45.23 Joules
```

**Update the performance JSON:**
```bash
nano measurements/react/simple.json
```

Add these fields to the JSON:
```json
{
  "scenario": "simple",
  "framework": "react",
  "timestamp": "2026-01-17T22:00:00.000Z",
  "totalDuration": 28456,
  "energy_joules": 45.23,
  "peak_power_watts": 52.1,
  "actions": [...]
}
```

---

#### Step 6: Repeat for Statistical Validity

**For each framework and scenario combination:**
1. Repeat the data collection **5 times** (e.g., `run1` through `run5`)
2. Wait **10 minutes** between runs to allow system cooldown
3. Increment the run number in filename for each repetition

**Example for React Simple scenario (5 runs):**
```bash
# Run 1
sudo scaphandre json -t 20 -f measurements/react/energy_simple_run1.json
node scenario-a-simple.js react 3000
# Wait 10 minutes

# Run 2
sudo scaphandre json -t 20 -f measurements/react/energy_simple_run2.json
node scenario-a-simple.js react 3000
# Wait 10 minutes

# ... continue until run5
```

**Total runs needed:**
```
4 frameworks × 3 scenarios × 5 repetitions = 60 runs
Estimated total time: ~2 hours (spread across multiple days)
```

---

## 5. Complete Example: Run React Simple Scenario

Here's a complete walkthrough for one test run:

### Terminal 1: Start React App
```bash
cd ~/Downloads/frontend-energy-study/apps/react
npm start
# Wait until you see "Compiled successfully!"
# Verify: http://localhost:3000 opens in browser
```

### Terminal 2: Prepare Energy Monitoring
```bash
cd ~/Downloads/frontend-energy-study
# Type this command but DON'T press Enter yet:
sudo scaphandre json -t 20 -f measurements/react/energy_simple_run1.json
```

### Terminal 3: Prepare Test Script
```bash
cd ~/Downloads/frontend-energy-study/test-scripts
# Type this command but DON'T press Enter yet:
node scenario-a-simple.js react 3000
```

### Run Both Simultaneously
1. Go to Terminal 2, press **Enter**
2. Quickly switch to Terminal 3, press **Enter**
3. Watch both terminals complete

### After Completion
```bash
# Check files were created
ls -lh measurements/react/

# Calculate energy
cat measurements/react/energy_simple_run1.json | jq '[.[].host.consumption] | add'

# View test results
cat measurements/react/simple.json
```

---

## 6. Data Collection Checklist

For each test run, ensure:
- [ ] Framework application is running and accessible in browser
- [ ] Scaphandre monitoring started (sudo required)
- [ ] Test scenario executed successfully (check output)
- [ ] Energy data file created (check file size > 1KB)
- [ ] Performance metrics recorded in measurements folder
- [ ] Energy data merged into final JSON
- [ ] 10-minute cooldown before next run
- [ ] Files named with proper convention (framework_scenario_runN.json)

---

## 7. Troubleshooting

| Problem | Solution |
|---------|----------|
| Scaphandre shows "Not enough records for socket" | This is normal—verify JSON file exists and has content |
| Energy file is empty or very small (<1KB) | Ensure `sudo` was used; check CPU supports RAPL (Intel Sandy Bridge+, AMD Zen+) |
| Test scenario fails to connect | Verify framework app is running; check correct port |
| Measurements folder doesn't exist | Run: `mkdir -p measurements/{react,vue,angular,svelte}` |
| "Cannot find module puppeteer" | Run: `cd test-scripts && npm install` |
| Browser doesn't open during test | Install Chrome/Chromium: `sudo apt install chromium-browser` |

---

## 8. Running the Analysis

Once you have collected data for all frameworks and scenarios:

1. Navigate to the `analysis` directory:
   ```bash
   cd ~/Downloads/frontend-energy-study/analysis
   ```

2. Launch Jupyter Notebook:
   ```bash
   jupyter notebook
   ```

3. Open `analyze.ipynb`

4. Run all cells to generate charts and statistics

> ⚠️ **Note**: If energy data is missing, the script will generate synthetic data for demonstration purposes. Check output for "Warning: No energy data found".

---

## 9. Quick Reference

### Framework Commands

| Framework | Start Command | Port | Stop |
|-----------|---------------|------|------|
| React | `npm start` | 3000 | Ctrl+C |
| Vue | `npm run serve` | 8080 | Ctrl+C |
| Angular | `npm start` | 4200 | Ctrl+C |
| Svelte | `npm run dev` | 5173 | Ctrl+C |

### Test Script Commands

| Scenario | Script | Items | Duration |
|----------|--------|-------|----------|
| Simple | `node scenario-a-simple.js {framework} {port}` | 5,000 | ~20s |
| Medium | `node scenario-b-medium.js {framework} {port}` | 25,000 | ~60s |
| Complex | `node scenario-c-complex.js {framework} {port}` | 50,000 | ~100s |

### Scaphandre Duration Settings

| Scenario | Duration Flag |
|----------|---------------|
| Simple | `-t 20` |
| Medium | `-t 60` |
| Complex | `-t 100` |
