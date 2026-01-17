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

#If there are unmet dependencies, fix them by running:
sudo apt-get install -f


### Fix: `scaphandre: libssl.so.1.1 not found` on Ubuntu 22.04 / 24.04 (If needed)

This guide explains how to fix the following error when running **Scaphandre** on modern Ubuntu systems:

Step 1 — Add temporary focal-security repo

```bash
echo "deb http://security.ubuntu.com/ubuntu focal-security main" | sudo tee /etc/apt/sources.list.d/temp-libssl.list
```

Step 2 — Update package lists

```bash
sudo apt update
```

Step 3 — Install libssl1.1

```bash
sudo apt install libssl1.1
```

Step 4 — Remove the temporary repo file

```bash
sudo rm /etc/apt/sources.list.d/temp-libssl.list
sudo apt update
```

Step 5 — Verify installation

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
```

---

## 3. Running Experiments &amp; Collecting Data

The data collection process follows the methodology outlined in README.md. Each experiment requires running the web application, monitoring energy consumption with Scaphandre, executing test scenarios, and merging the data.

### Overview: Data Collection Workflow

```
┌─────────────────────────────────────────────────────────────┐
│ 1. Start Framework App → 2. Start Scaphandre Monitor       │
│ 3. Run Test Scenario → 4. Stop Monitoring → 5. Merge Data  │
└─────────────────────────────────────────────────────────────┘
```

**Important Notes:**
- Each framework should be tested with all 3 scenarios (Simple, Medium, Complex)
- Repeat each test **10 times** for statistical validity (120+ total runs)
- Allow **10-minute cooldown** between runs to stabilize system temperature
- Close unnecessary applications to minimize interference

---

### Step-by-Step Data Collection Process

#### Step 1: Start the Framework Application

Open **Terminal 1** and start the framework you want to test.

**For React:**
```bash
cd apps/react
npm start
# Wait for "Compiled successfully!" message
# App runs on http://localhost:3000
```

**For Vue:**
```bash
cd apps/vue
npm run serve
# Wait for "DONE Compiled successfully" message
# App runs on http://localhost:8080
```

**For Angular:**
```bash
cd apps/angular
npm start
# Wait for compilation to complete
# App runs on http://localhost:4200
```

**For Svelte:**
```bash
cd apps/svelte
npm run dev
# App runs on http://localhost:5173
```

✅ **Verify:** Open the URL in your browser to confirm the app is running.

---

#### Step 2: Start Energy Monitoring with Scaphandre

Open **Terminal 2** for energy monitoring. Scaphandre will collect power consumption data.

**Choose duration based on scenario (with ~10% buffer):**
- **Scenario A (Simple)**: Use `-t 60` (60 seconds)
  - Expected test duration: 20-50 seconds
- **Scenario B (Medium)**: Use `-t 240` (240 seconds / 4 minutes)
  - Expected test duration: 100-200 seconds (1.7-3.3 minutes)
- **Scenario C (Complex)**: Use `-t 660` (660 seconds / 11 minutes)
  - Expected test duration: 300-600 seconds (5-10 minutes)

**Example command for Simple scenario:**
```bash
cd ~/Downloads/frontend-energy-study
sudo scaphandre json -t 60 -f measurements/react/energy_simple_run1.json
```

**Naming convention for files:**
```
measurements/{framework}/energy_{scenario}_run{number}.json

Examples:
- measurements/react/energy_simple_run1.json
- measurements/vue/energy_medium_run5.json
- measurements/angular/energy_complex_run10.json
```

⚠️ **Do NOT start this command yet!** Wait until you're ready to run the test scenario.

---

#### Step 3: Run the Test Scenario

Open **Terminal 3** for running automated test scripts.

```bash
cd test-scripts
```

**Important: Execute steps 2 and 3 almost simultaneously:**

1. In **Terminal 2**: Start Scaphandre monitoring command (from Step 2)
2. **Immediately** switch to **Terminal 3** and run the test script:

**For Scenario A - Simple (100 items x 50 time):**
```bash
# React
node scenario-a-simple.js react 3000

# Vue
node scenario-a-simple.js vue 8080

# Angular
node scenario-a-simple.js angular 4200

# Svelte
node scenario-a-simple.js svelte 5173
```

**For Scenario B - Medium (100 items x 250 time):**
```bash
node scenario-b-medium.js react 3000
# (adjust framework and port as needed)
```

**For Scenario C - Complex (100 items x 500 time):**
```bash
node scenario-c-complex.js react 3000
# (adjust framework and port as needed)
```

**What happens:**
- The test script will automate browser interactions (adding items, filtering, navigation, etc.)
- Scaphandre will record energy consumption in parallel
- Both will complete around the same time

**Expected output from test script:**
```
Scenario completed successfully!
Results saved to: measurements/react/simple.json
Total duration: 3845ms
```

---

#### Step 4: Wait for Scaphandre to Complete

Switch back to **Terminal 2** and wait for Scaphandre to finish recording.

**Expected output:**
```
scaphandre::sensors: Sysinfo sees 20
Scaphandre json exporter
Sending ⚡ metrics
scaphandre::sensors: Not enough records for socket
```

The "Not enough records for socket" message is normal—the tool still collects data successfully.

**Verify the file was created:**
```bash
ls -lh measurements/react/energy_simple_run1.json
# Should show file size (e.g., 9.9K)
```

---

#### Step 5: Merge Energy Data with Performance Metrics

The test script creates a performance file like `measurements/react/simple.json`, but it **lacks energy data**. You need to merge it with Scaphandre's output.

**Method 1: Manual Calculation (Quick for single tests)**

1. **Open the Scaphandre JSON file:**
   ```bash
   cat measurements/react/energy_simple_run1.json | jq '.[] | .host.consumption' | head -20
   ```
   
2. **Calculate Total Energy:**
   - Look for "consumption" values in microjoules (μJ)
   - Sum the socket consumption values across all time samples
   - Convert microjoules to Joules: `Joules = μJ / 1,000,000`
   
   **Example calculation:**
   ```
   Sample 1: consumption = 2074437.0 μJ
   Sample 2: consumption = 1934218.0 μJ
   Total = 4008655.0 μJ = 4.01 Joules
   ```

3. **Calculate Peak Power (Watts):**
   ```
   Peak Power = Max consumption (μJ) / time interval (seconds) / 1,000,000
   ```

4. **Update the performance JSON file:**
   ```bash
   nano measurements/react/simple.json
   ```
   
   Add these fields:
   ```json
   {
     "scenario": "simple",
     "framework": "react",
     "timestamp": "2024-01-01T12:00:00.000Z",
     "actions": [...],
     "totalDuration": 3845,
     "energy_joules": 4.01,          ← ADD THIS
     "peak_power_watts": 45.2,       ← ADD THIS
     "memory_mb": 125.5,             ← ADD THIS (from browser metrics)
     "dom_mutations": 1523           ← ADD THIS (from test output)
   }
   ```

**Method 2: Automated Script (Recommended for 120+ runs)**

Create a Python script to parse Scaphandre JSON and merge automatically:

```python
# merge_energy_data.py (create this in analysis/)
import json
import glob

# Example: sum all consumption values from Scaphandre
with open('measurements/react/energy_simple_run1.json', 'r') as f:
    data = json.load(f)
    
total_energy_uj = sum([record['host']['consumption'] for record in data])
total_energy_j = total_energy_uj / 1_000_000

print(f"Total Energy: {total_energy_j:.2f} Joules")
```

---

#### Step 6: Repeat for Statistical Validity

**For each framework and scenario combination:**
1. Repeat the data collection **10 times** (e.g., `run1` through `run10`)
2. Wait **10 minutes** between runs to allow system cooldown
3. Store each run's data separately with unique filenames

**Example for React + Simple scenario:**
```
measurements/react/energy_simple_run1.json
measurements/react/energy_simple_run2.json
...
measurements/react/energy_simple_run10.json
```

**Total runs needed:**
```
4 frameworks × 3 scenarios × 10 repetitions = 120 runs
Estimated time: ~2 hours per day (with cooldowns)
```

---

### Complete Example: React Simple Scenario

**Terminal 1:**
```bash
cd apps/react
npm start
```

**Terminal 2:**
```bash
cd ~/Downloads/frontend-energy-study
sudo scaphandre json -t 60 -f measurements/react/energy_simple_run1.json
```

**Terminal 3:**
```bash
cd test-scripts
node scenario-a-simple.js react 3000
```

**After completion:**
```bash
# View energy data
cat measurements/react/energy_simple_run1.json | head -100

# Update performance file
nano measurements/react/simple.json
# (Add energy_joules and peak_power_watts fields)
```

---

### Data Collection Checklist

For each test run, ensure:
- [ ] Framework application is running and accessible
- [ ] Scaphandre monitoring started
- [ ] Test scenario executed successfully
- [ ] Energy data file created (check file size)
- [ ] Performance metrics recorded
- [ ] Energy data merged into final JSON
- [ ] 10-minute cooldown before next run
- [ ] Files named with proper convention

---

### Troubleshooting

**Problem:** Scaphandre shows "Not enough records for socket"  
**Solution:** This is normal—the tool still collects data. Verify the JSON file exists and has content.

**Problem:** Energy file is empty or very small (&lt;1KB)  
**Solution:** Ensure you have proper permissions (`sudo`) and your CPU supports RAPL (Intel Sandy Bridge or newer, AMD Zen or newer).

**Problem:** Test scenario fails to connect  
**Solution:** Verify the framework app is running and the port is correct. Check browser console for errors.

**Problem:** Measurements folder doesn't exist  
**Solution:** Create it manually:
```bash
mkdir -p measurements/{react,vue,angular,svelte}
```

---

## 4. Running the Analysis

Once you have collected data for all frameworks and scenarios, run the analysis.

1.  Navigate to the `analysis` directory.
    ```bash
    cd analysis
    ```
2.  Launch Jupyter Notebook.
    ```bash
    jupyter notebook
    ```
3.  Open `analyze.ipynb`.
4.  Run all cells to generate charts and statistics.
    *   **Note**: If you skipped the manual data merging step, the script will generate **synthetic (fake) energy data** for demonstration purposes. Ensure you check the output logs for "Warning: No energy data found".

## Summary of Commands

| Framework | Startup Command | Port |
|-----------|-----------------|------|
| React | `npm start` | 3000 |
| Vue | `npm run serve` | 8080 |
| Angular | `npm start` | 4200 |
| Svelte | `npm run dev` | 5173 |

| Scenario | Script | Approx Duration |
|----------|--------|-----------------|
| Simple | `scenario-a-simple.js` | 20-50s |
| Medium | `scenario-b-medium.js` | 100-200s |
| Complex | `scenario-c-complex.js` | 300-600s |
